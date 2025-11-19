// API Route: https://www.froit.com.ar/api/mailMarketing
// Webhook para recibir eventos de Brevo (SendinBlue)
// Maneja: deliveries, opens, clicks, bounces, spam, unsubscribes

import { supabaseClient as supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// Configuración
const WEBHOOK_SECRET = process.env.BREVO_WEBHOOK_SECRET || '' // Opcional: para validar firma
const DEBUG_MODE = process.env.NODE_ENV === 'development'

// Helper: Log con timestamp
function log(message, data = null) {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [Brevo Webhook]`, message)
    if (data && DEBUG_MODE) {
        console.log(JSON.stringify(data, null, 2))
    }
}

// Helper: Extraer información del user agent
function parseUserAgent(userAgent) {
    if (!userAgent) return { dispositivo: 'desconocido', navegador: 'desconocido', sistema_operativo: 'desconocido' }
    
    // Detectar dispositivo
    let dispositivo = 'desktop'
    if (/mobile/i.test(userAgent)) dispositivo = 'mobile'
    else if (/tablet/i.test(userAgent)) dispositivo = 'tablet'
    
    // Detectar navegador
    let navegador = 'desconocido'
    if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) navegador = 'Chrome'
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) navegador = 'Safari'
    else if (/firefox/i.test(userAgent)) navegador = 'Firefox'
    else if (/edg/i.test(userAgent)) navegador = 'Edge'
    else if (/opera/i.test(userAgent)) navegador = 'Opera'
    
    // Detectar sistema operativo
    let sistema_operativo = 'desconocido'
    if (/windows/i.test(userAgent)) sistema_operativo = 'Windows'
    else if (/mac os/i.test(userAgent)) sistema_operativo = 'MacOS'
    else if (/linux/i.test(userAgent)) sistema_operativo = 'Linux'
    else if (/android/i.test(userAgent)) sistema_operativo = 'Android'
    else if (/ios|iphone|ipad/i.test(userAgent)) sistema_operativo = 'iOS'
    
    return { dispositivo, navegador, sistema_operativo }
}

// Helper: Actualizar métricas de campaña
async function updateCampaignMetrics(campaignId) {
    try {
        const { error } = await supabase.rpc('update_campaign_metrics', {
            p_campaign_id: campaignId
        })
        
        if (error) {
            log(`Error actualizando métricas de campaña ${campaignId}:`, error)
        } else {
            log(`✅ Métricas actualizadas para campaña ${campaignId}`)
        }
    } catch (err) {
        log(`Error en updateCampaignMetrics:`, err)
    }
}

// Helper: Actualizar métricas de contacto
async function updateContactMetrics(contactId) {
    try {
        const { error } = await supabase.rpc('update_contact_metrics', {
            p_contact_id: contactId
        })
        
        if (error) {
            log(`Error actualizando métricas de contacto ${contactId}:`, error)
        } else {
            log(`✅ Métricas actualizadas para contacto ${contactId}`)
        }
    } catch (err) {
        log(`Error en updateContactMetrics:`, err)
    }
}

// Handler principal del webhook
export async function POST(request) {
    try {
        log('📧 Webhook recibido de Brevo')
        
        // Leer el body
        const body = await request.json()
        log('Body recibido:', body)
        
        const event = body.event || body.Event
        const email = body.email || body.Email
        const messageId = body['message-id'] || body.MessageId || body.messageId
        const tags = body.tags || body.Tags || []
        
        if (!event || !email) {
            log('❌ Evento inválido: falta event o email')
            return NextResponse.json({ 
                success: false, 
                error: 'Evento inválido: se requiere event y email' 
            }, { status: 400 })
        }
        
        log(`Procesando evento: ${event} para ${email}`)
        
        // Extraer campaign_id de los tags
        let campaignId = null
        const campaignTag = tags.find(tag => tag.startsWith('campaign-'))
        if (campaignTag) {
            campaignId = campaignTag.replace('campaign-', '')
        }
        
        // Buscar el registro de envío
        let query = supabase
            .from('froit_email_sends')
            .select('*')
            .eq('email', email.toLowerCase())
        
        if (messageId) {
            query = query.eq('brevo_message_id', messageId)
        } else if (campaignId) {
            query = query.eq('campaign_id', campaignId)
        }
        
        query = query.order('created_at', { ascending: false }).limit(1)
        
        const { data: sends, error: searchError } = await query
        
        if (searchError) {
            log('❌ Error buscando envío:', searchError)
            return NextResponse.json({ 
                success: false, 
                error: 'Error buscando registro de envío' 
            }, { status: 500 })
        }
        
        if (!sends || sends.length === 0) {
            log(`⚠️ No se encontró registro de envío para ${email}`)
            return NextResponse.json({ 
                success: true, 
                message: 'Registro no encontrado, ignorando evento' 
            }, { status: 200 })
        }
        
        const sendRecord = sends[0]
        log(`✅ Registro encontrado: ${sendRecord.id}`)
        
        // Preparar actualización según el tipo de evento
        let updateData = {
            updated_at: new Date().toISOString()
        }
        
        // Guardar message ID si no existe
        if (messageId && !sendRecord.brevo_message_id) {
            updateData.brevo_message_id = messageId
        }
        
        // Procesar según tipo de evento
        switch (event.toLowerCase()) {
            case 'delivered':
            case 'delivery':
                log('✉️ Email entregado correctamente')
                updateData.estado = 'enviado'
                updateData.fecha_envio = new Date().toISOString()
                
                // Incrementar contador diario
                await supabase.rpc('increment_email_counter', { cantidad: 1 })
                break
                
            case 'open':
            case 'opened':
                log('👀 Email abierto')
                const ipApertura = body.ip || body.IP
                const userAgent = body['user-agent'] || body.UserAgent || body.userAgent
                const deviceInfo = parseUserAgent(userAgent)
                
                updateData.abierto = true
                updateData.cantidad_aperturas = (sendRecord.cantidad_aperturas || 0) + 1
                updateData.ultima_apertura = new Date().toISOString()
                
                if (!sendRecord.fecha_apertura) {
                    updateData.fecha_apertura = new Date().toISOString()
                }
                
                if (ipApertura) updateData.ip_apertura = ipApertura
                if (userAgent) updateData.user_agent_apertura = userAgent
                if (deviceInfo.dispositivo) updateData.dispositivo = deviceInfo.dispositivo
                if (deviceInfo.navegador) updateData.navegador = deviceInfo.navegador
                if (deviceInfo.sistema_operativo) updateData.sistema_operativo = deviceInfo.sistema_operativo
                break
                
            case 'click':
            case 'clicked':
                log('🖱️ Click en enlace')
                const clickedUrl = body.link || body.url || body.URL
                
                updateData.click = true
                updateData.cantidad_clicks = (sendRecord.cantidad_clicks || 0) + 1
                updateData.ultimo_click = new Date().toISOString()
                
                if (!sendRecord.fecha_primer_click) {
                    updateData.fecha_primer_click = new Date().toISOString()
                }
                
                // Agregar URL clickeada al array
                if (clickedUrl) {
                    const urlsActuales = sendRecord.urls_clickeadas || []
                    if (!urlsActuales.includes(clickedUrl)) {
                        updateData.urls_clickeadas = [...urlsActuales, clickedUrl]
                    }
                }
                
                // Si hizo click, automáticamente lo marcamos como abierto
                if (!sendRecord.abierto) {
                    updateData.abierto = true
                    updateData.cantidad_aperturas = 1
                    updateData.fecha_apertura = new Date().toISOString()
                    updateData.ultima_apertura = new Date().toISOString()
                }
                break
                
            case 'bounce':
            case 'hard_bounce':
            case 'soft_bounce':
            case 'blocked':
                log('🚫 Bounce detectado')
                const bounceReason = body.reason || body.Reason || 'No especificado'
                const bounceType = event.toLowerCase().includes('hard') ? 'hard' : 
                                 event.toLowerCase().includes('soft') ? 'soft' : 'blocked'
                
                updateData.bounce = true
                updateData.bounce_type = bounceType
                updateData.fecha_bounce = new Date().toISOString()
                updateData.bounce_reason = bounceReason
                updateData.estado = 'bounce'
                
                // Actualizar estado del contacto
                if (bounceType === 'hard') {
                    const { error: contactError } = await supabase
                        .from('froit_email_contacts')
                        .update({ 
                            estado: 'bounce',
                            updated_at: new Date().toISOString()
                        })
                        .eq('email', email.toLowerCase())
                    
                    if (contactError) {
                        log('Error actualizando estado de contacto:', contactError)
                    }
                }
                break
                
            case 'spam':
            case 'complaint':
                log('⚠️ Reporte de spam')
                updateData.spam_report = true
                updateData.fecha_spam_report = new Date().toISOString()
                
                // Actualizar estado del contacto
                const { error: spamContactError } = await supabase
                    .from('froit_email_contacts')
                    .update({ 
                        estado: 'spam',
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', email.toLowerCase())
                
                if (spamContactError) {
                    log('Error actualizando estado de contacto (spam):', spamContactError)
                }
                break
                
            case 'unsubscribe':
            case 'unsubscribed':
                log('👋 Usuario dado de baja')
                updateData.unsubscribed = true
                updateData.fecha_unsubscribe = new Date().toISOString()
                
                // Actualizar estado del contacto
                const { error: unsubContactError } = await supabase
                    .from('froit_email_contacts')
                    .update({ 
                        estado: 'unsubscribed',
                        fecha_baja: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', email.toLowerCase())
                
                if (unsubContactError) {
                    log('Error actualizando estado de contacto (unsub):', unsubContactError)
                }
                break
                
            case 'error':
            case 'deferred':
            case 'invalid_email':
                log('❌ Error en envío')
                updateData.estado = 'fallido'
                updateData.error_mensaje = body.reason || body.error || 'Error desconocido'
                break
                
            default:
                log(`⚠️ Evento no manejado: ${event}`)
                return NextResponse.json({ 
                    success: true, 
                    message: `Evento ${event} recibido pero no procesado` 
                }, { status: 200 })
        }
        
        // Actualizar registro de envío
        const { error: updateError } = await supabase
            .from('froit_email_sends')
            .update(updateData)
            .eq('id', sendRecord.id)
        
        if (updateError) {
            log('❌ Error actualizando registro:', updateError)
            return NextResponse.json({ 
                success: false, 
                error: 'Error actualizando registro de envío' 
            }, { status: 500 })
        }
        
        log(`✅ Registro actualizado exitosamente`)
        
        // Actualizar métricas de campaña y contacto en segundo plano
        if (sendRecord.campaign_id) {
            updateCampaignMetrics(sendRecord.campaign_id)
        }
        
        if (sendRecord.contact_id) {
            updateContactMetrics(sendRecord.contact_id)
        }
        
        return NextResponse.json({ 
            success: true,
            message: `Evento ${event} procesado correctamente`,
            email: email,
            event: event
        }, { status: 200 })
        
    } catch (error) {
        log('❌ Error general en webhook:', error)
        return NextResponse.json({ 
            success: false, 
            error: 'Error interno del servidor',
            details: DEBUG_MODE ? error.message : undefined
        }, { status: 500 })
    }
}

// GET para verificar que el endpoint está activo
export async function GET(request) {
    return NextResponse.json({
        service: 'Froit Email Marketing Webhook',
        status: 'active',
        endpoint: '/api/mailMarketing',
        events: [
            'delivered',
            'opened',
            'clicked',
            'bounce',
            'spam',
            'unsubscribe',
            'error'
        ],
        timestamp: new Date().toISOString()
    }, { status: 200 })
}
