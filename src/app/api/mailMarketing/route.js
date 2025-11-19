// API Route: https://www.froit.com.ar/api/mailMarketing
// Webhook para recibir eventos de Brevo (SendinBlue)
// Maneja: deliveries, opens, clicks, bounces, spam, unsubscribes

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * Webhook de Brevo para tracking de emails
 * Eventos soportados:
 * - request: Email enviado
 * - delivered: Email entregado
 * - opened: Email abierto
 * - click: Link clickeado
 * - hard_bounce: Rebote permanente
 * - soft_bounce: Rebote temporal
 * - blocked: Email bloqueado
 * - spam: Marcado como spam
 * - unsubscribe: Usuario se dio de baja
 */
export async function POST(request) {
  // Crear cliente Supabase dentro de la función para evitar errores de build
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON
  )
  
  try {
    const body = await request.json()
    
    console.log('📧 Webhook de Brevo recibido:', JSON.stringify(body, null, 2))

    const { event, email, 'message-id': messageId, date, tag, tags } = body

    if (!email) {
      console.error('❌ Email no proporcionado en webhook')
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    // Buscar el envío en la base de datos por email
    const { data: envios, error: errorBusqueda } = await supabase
      .from('froit_email_sends')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)

    if (errorBusqueda) {
      console.error('Error buscando envío:', errorBusqueda)
      return NextResponse.json({ error: 'Error en BD' }, { status: 500 })
    }

    if (!envios || envios.length === 0) {
      console.warn(`⚠️ No se encontró registro para email: ${email}`)
      // Aún así retornamos 200 para que Brevo no reintente
      return NextResponse.json({ message: 'Email no encontrado pero webhook procesado' })
    }

    const envio = envios[0]
    console.log(`✅ Envío encontrado: ${envio.id} - Estado actual: ${envio.estado}`)

    // Procesar según el tipo de evento
    let updateData = {
      updated_at: new Date().toISOString()
    }

    switch (event) {
      case 'request':
        // Email enviado (solicitado)
        updateData.estado = 'enviado'
        updateData.fecha_envio = new Date(date).toISOString()
        console.log(`📤 Email enviado: ${email}`)
        break

      case 'delivered':
        // Email entregado
        updateData.estado = 'enviado'
        updateData.fecha_envio = new Date(date).toISOString()
        console.log(`✅ Email entregado: ${email}`)
        break

      case 'opened':
      case 'unique_opened':
        // Email abierto
        updateData.abierto = true
        updateData.cantidad_aperturas = (envio.cantidad_aperturas || 0) + 1
        
        if (!envio.fecha_apertura) {
          updateData.fecha_apertura = new Date(date).toISOString()
        }
        
        console.log(`👁️ Email abierto: ${email} (Total: ${(envio.cantidad_aperturas || 0) + 1})`)
        break

      case 'click':
      case 'unique_click':
        // Link clickeado
        updateData.click = true
        updateData.cantidad_clicks = (envio.cantidad_clicks || 0) + 1
        
        if (!envio.fecha_primer_click) {
          updateData.fecha_primer_click = new Date(date).toISOString()
        }

        // Guardar el link clickeado si viene en el body
        if (body.link) {
          const urlsActuales = envio.urls_clickeadas || []
          if (!urlsActuales.includes(body.link)) {
            updateData.urls_clickeadas = [...urlsActuales, body.link]
          }
        }
        
        console.log(`🖱️ Link clickeado: ${email} (Total: ${(envio.cantidad_clicks || 0) + 1})`)
        break

      case 'hard_bounce':
        // Rebote permanente (email inválido)
        updateData.estado = 'bounce'
        updateData.bounce = true
        updateData.bounce_type = 'hard'
        updateData.bounce_reason = body.reason || 'Hard bounce - Email inválido'
        
        // Marcar contacto como bounce en la tabla de contactos
        await supabase
          .from('froit_email_contacts')
          .update({ estado: 'bounce' })
          .eq('email', email)
        
        console.log(`⛔ Hard bounce: ${email} - ${body.reason}`)
        break

      case 'soft_bounce':
        // Rebote temporal (buzón lleno, servidor temporal no disponible)
        updateData.bounce = true
        updateData.bounce_type = 'soft'
        updateData.bounce_reason = body.reason || 'Soft bounce - Temporal'
        console.log(`⚠️ Soft bounce: ${email} - ${body.reason}`)
        break

      case 'blocked':
        // Email bloqueado
        updateData.estado = 'rechazado'
        updateData.error_mensaje = body.reason || 'Email bloqueado'
        console.log(`🚫 Email bloqueado: ${email} - ${body.reason}`)
        break

      case 'spam':
        // Marcado como spam
        updateData.spam_report = true
        
        // Marcar contacto como spam
        await supabase
          .from('froit_email_contacts')
          .update({ estado: 'spam' })
          .eq('email', email)
        
        console.log(`🚨 Marcado como spam: ${email}`)
        break

      case 'unsubscribe':
        // Usuario se dio de baja
        updateData.unsubscribed = true
        
        // Marcar contacto como unsubscribed
        await supabase
          .from('froit_email_contacts')
          .update({ estado: 'unsubscribed' })
          .eq('email', email)
        
        console.log(`👋 Usuario se dio de baja: ${email}`)
        break

      case 'invalid_email':
        // Email inválido
        updateData.estado = 'fallido'
        updateData.error_mensaje = 'Email inválido'
        
        await supabase
          .from('froit_email_contacts')
          .update({ estado: 'bounce' })
          .eq('email', email)
        
        console.log(`❌ Email inválido: ${email}`)
        break

      default:
        console.log(`ℹ️ Evento no manejado: ${event}`)
        return NextResponse.json({ message: 'Evento recibido pero no procesado' })
    }

    // Actualizar el registro del envío
    const { error: errorUpdate } = await supabase
      .from('froit_email_sends')
      .update(updateData)
      .eq('id', envio.id)

    if (errorUpdate) {
      console.error('Error actualizando envío:', errorUpdate)
      return NextResponse.json({ error: 'Error actualizando' }, { status: 500 })
    }

    // Actualizar estadísticas de la campaña
    await actualizarEstadisticasCampaña(envio.campaign_id)

    console.log(`✅ Webhook procesado exitosamente para ${email}`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook procesado',
      event,
      email 
    })

  } catch (error) {
    console.error('❌ Error procesando webhook:', error)
    return NextResponse.json({ 
      error: 'Error interno',
      message: error.message 
    }, { status: 500 })
  }
}

/**
 * Actualizar estadísticas agregadas de la campaña
 */
async function actualizarEstadisticasCampaña(campaignId) {
  if (!campaignId) return

  // Crear cliente dentro de la función
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON
  )

  try {
    // Obtener estadísticas agregadas
    const { data: stats } = await supabase
      .from('froit_email_sends')
      .select('*')
      .eq('campaign_id', campaignId)

    if (!stats) return

    const enviados = stats.filter(s => s.estado === 'enviado').length
    const fallidos = stats.filter(s => s.estado === 'fallido' || s.estado === 'bounce').length
    const abiertos = stats.filter(s => s.abierto).length
    const clicks = stats.filter(s => s.click).length
    const bounces = stats.filter(s => s.bounce).length
    const spamReports = stats.filter(s => s.spam_report).length
    const unsubscribes = stats.filter(s => s.unsubscribed).length

    // Actualizar campaña
    await supabase
      .from('froit_email_campaigns')
      .update({
        enviados,
        fallidos,
        abiertos,
        clicks,
        bounces,
        spam_reports: spamReports,
        unsubscribes,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId)

    console.log(`📊 Estadísticas actualizadas para campaña ${campaignId}:`, {
      enviados, fallidos, abiertos, clicks
    })
  } catch (error) {
    console.error('Error actualizando estadísticas de campaña:', error)
  }
}

// Método GET para verificar que la API está funcionando
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook de Brevo activo',
    timestamp: new Date().toISOString()
  })
}
