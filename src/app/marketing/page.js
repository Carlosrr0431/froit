'use client'

import { useState, useCallback, useEffect } from 'react'
import { Mail, Upload, Send, Users, BarChart3, RefreshCw, Search, Clock, Check, X, Eye, Trash2, AlertCircle, CheckCircle2, XCircle, TrendingUp, Target, Repeat, Zap, Plus, Minus, FileSpreadsheet, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { supabaseClient } from '@/lib/supabase'
import * as XLSX from 'xlsx'
import { emailFroitHTML } from './emailTemplate'

export default function MarketingPage() {
    const [vistaActiva, setVistaActiva] = useState('campañas') // 'campañas', 'contactos', 'nueva-campaña', 'estadisticas'
    const [campañas, setCampañas] = useState([])
    const [contactos, setContactos] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    
    // Estados para modal de detalles de envíos
    const [modalEnviosAbierto, setModalEnviosAbierto] = useState(false)
    const [campañaSeleccionada, setCampañaSeleccionada] = useState(null)
    const [enviosCampaña, setEnviosCampaña] = useState([])
    const [loadingEnvios, setLoadingEnvios] = useState(false)
    
    // Estados para nueva campaña
    const [nombreCampaña, setNombreCampaña] = useState('')
    const [asunto, setAsunto] = useState('')
    const [contenido, setContenido] = useState('')
    const [archivoExcel, setArchivoExcel] = useState(null)
    const [contactosExtraidos, setContactosExtraidos] = useState([])
    const [enviando, setEnviando] = useState(false)
    const [textoPegado, setTextoPegado] = useState('') // Para pegar emails directamente

    // Estados para métricas
    const [metricsGlobales, setMetricsGlobales] = useState({
        totalEnviados: 0,
        totalAbiertos: 0,
        totalClicks: 0,
        totalBounces: 0,
        tasaApertura: 0,
        tasaClick: 0
    })

    // Cargar campañas desde Supabase
    const cargarCampañas = useCallback(async () => {
        setLoading(true)
        try {
            // Verificar que supabaseClient esté inicializado
            if (!supabaseClient) {
                console.error('❌ Supabase client no inicializado')
                toast.error('Error: Cliente de Supabase no disponible. Verifica las variables de entorno.')
                setLoading(false)
                return
            }

            // Cargar campañas
            const { data: campaigns, error: campaignsError } = await supabaseClient
                .from('froit_email_campaigns')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (campaignsError) throw campaignsError
            
            // Cargar todos los envíos para calcular métricas en tiempo real
            const { data: sends, error: sendsError } = await supabaseClient
                .from('froit_email_sends')
                .select('*')
            
            if (sendsError) throw sendsError
            
            // Calcular métricas por campaña desde los envíos
            const campaignsConMetricas = (campaigns || []).map(campaign => {
                const enviosCampaña = (sends || []).filter(s => s.campaign_id === campaign.id)
                
                return {
                    ...campaign,
                    enviados: enviosCampaña.filter(s => s.estado === 'enviado').length,
                    abiertos: enviosCampaña.filter(s => s.abierto === true).length,
                    clicks: enviosCampaña.filter(s => s.click === true).length,
                    bounces: enviosCampaña.filter(s => s.bounce === true).length,
                    spam_reports: enviosCampaña.filter(s => s.spam_report === true).length,
                    unsubscribes: enviosCampaña.filter(s => s.unsubscribed === true).length
                }
            })
            
            setCampañas(campaignsConMetricas)
            
            // Calcular métricas globales desde todos los envíos
            const totalEnviados = (sends || []).filter(s => s.estado === 'enviado').length
            const totalAbiertos = (sends || []).filter(s => s.abierto === true).length
            const totalClicks = (sends || []).filter(s => s.click === true).length
            const totalBounces = (sends || []).filter(s => s.bounce === true).length

            setMetricsGlobales({
                totalEnviados,
                totalAbiertos,
                totalClicks,
                totalBounces,
                tasaApertura: totalEnviados > 0 ? ((totalAbiertos / totalEnviados) * 100).toFixed(1) : 0,
                tasaClick: totalAbiertos > 0 ? ((totalClicks / totalAbiertos) * 100).toFixed(1) : 0
            })
        } catch (error) {
            console.error('Error cargando campañas:', error)
            toast.error('Error al cargar campañas')
        } finally {
            setLoading(false)
        }
    }, [])

    // Cargar contactos desde Supabase
    const cargarContactos = useCallback(async () => {
        setLoading(true)
        try {
            // Verificar que supabaseClient esté inicializado
            if (!supabaseClient) {
                console.error('❌ Supabase client no inicializado')
                toast.error('Error: Cliente de Supabase no disponible. Verifica las variables de entorno.')
                setLoading(false)
                return
            }

            const { data, error } = await supabaseClient
                .from('froit_email_contacts')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (error) throw error
            setContactos(data || [])
        } catch (error) {
            console.error('Error cargando contactos:', error)
            toast.error('Error al cargar contactos')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        cargarCampañas()
        cargarContactos()

        // Verificar que supabaseClient esté disponible para suscripciones
        if (!supabaseClient) {
            console.warn('⚠️ Supabase client no disponible. Suscripciones en tiempo real deshabilitadas.')
            return
        }

        // Suscripción en tiempo real a cambios en campañas
        const campaignsSubscription = supabaseClient
            .channel('froit_email_campaigns_changes')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'froit_email_campaigns' 
                }, 
                (payload) => {
                    console.log('🔔 Cambio en campañas:', payload)
                    cargarCampañas()
                }
            )
            .subscribe()

        // Suscripción en tiempo real a cambios en contactos
        const contactsSubscription = supabaseClient
            .channel('froit_email_contacts_changes')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'froit_email_contacts' 
                }, 
                (payload) => {
                    console.log('🔔 Cambio en contactos:', payload)
                    cargarContactos()
                }
            )
            .subscribe()

        // Suscripción en tiempo real a cambios en envíos (para actualizar métricas)
        const sendsSubscription = supabaseClient
            .channel('froit_email_sends_changes')
            .on('postgres_changes', 
                { 
                    event: 'UPDATE', 
                    schema: 'public', 
                    table: 'froit_email_sends' 
                }, 
                (payload) => {
                    console.log('🔔 Cambio en envío detectado:', payload)
                    // Recargar campañas inmediatamente cuando hay cambios en envíos
                    cargarCampañas()
                }
            )
            .subscribe()

        // Cleanup: desuscribirse al desmontar
        return () => {
            campaignsSubscription.unsubscribe()
            contactsSubscription.unsubscribe()
            sendsSubscription.unsubscribe()
        }
    }, [cargarCampañas, cargarContactos])

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validar tipo de archivo
        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ]
        
        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
            toast.error('Por favor, sube un archivo Excel (.xlsx, .xls) o CSV')
            return
        }

        setArchivoExcel(file)
        const loadingToast = toast.loading('Procesando archivo...')

        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data, { type: 'array' })
            
            // Leer la primera hoja
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            
            // Convertir a JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            
            if (!jsonData || jsonData.length < 2) {
                throw new Error('El archivo está vacío o no tiene datos válidos')
            }

            // Extraer encabezados (primera fila)
            const headers = jsonData[0].map(h => String(h).toLowerCase().trim())
            
            // Buscar columnas de email y nombre
            const emailIndex = headers.findIndex(h => 
                h.includes('email') || h.includes('correo') || h.includes('mail')
            )
            const nombreIndex = headers.findIndex(h => 
                h.includes('nombre') || h.includes('name') || h.includes('contacto')
            )

            if (emailIndex === -1) {
                throw new Error('No se encontró una columna de email en el archivo')
            }

            // Procesar filas (desde la segunda fila)
            const contactos = []
            const emailsUnicos = new Set()
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i]
                const email = row[emailIndex]?.toString().trim().toLowerCase()
                const nombre = nombreIndex !== -1 ? row[nombreIndex]?.toString().trim() : ''

                // Validar y evitar duplicados
                if (email && emailRegex.test(email) && !emailsUnicos.has(email)) {
                    emailsUnicos.add(email)
                    contactos.push({ email, nombre: nombre || email.split('@')[0] })
                }
            }

            if (contactos.length === 0) {
                throw new Error('No se encontraron emails válidos en el archivo')
            }

            setContactosExtraidos(contactos)
            toast.success(
                `${contactos.length} contacto${contactos.length > 1 ? 's' : ''} extraído${contactos.length > 1 ? 's' : ''} correctamente`,
                { id: loadingToast }
            )
        } catch (error) {
            console.error('Error procesando archivo:', error)
            toast.error('Error: ' + error.message, { id: loadingToast })
            setArchivoExcel(null)
            setContactosExtraidos([])
        }
    }

    const extraerEmailsDeTexto = () => {
        if (!textoPegado.trim()) {
            toast.error('Pega algunos emails en el campo de texto')
            return
        }

        const loadingToast = toast.loading('Extrayendo emails...')

        try {
            // Regex para encontrar emails
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
            const emailsEncontrados = textoPegado.match(emailRegex) || []

            if (emailsEncontrados.length === 0) {
                throw new Error('No se encontraron emails válidos en el texto')
            }

            // Eliminar duplicados y crear array de contactos
            const emailsUnicos = [...new Set(emailsEncontrados.map(e => e.toLowerCase().trim()))]
            
            const contactos = emailsUnicos.map(email => ({
                email,
                nombre: email.split('@')[0] // Usar parte antes del @ como nombre por defecto
            }))

            // Combinar con contactos existentes si los hay
            const contactosExistentesEmails = new Set(contactosExtraidos.map(c => c.email))
            const contactosNuevos = contactos.filter(c => !contactosExistentesEmails.has(c.email))
            
            const todoLosContactos = [...contactosExtraidos, ...contactosNuevos]

            setContactosExtraidos(todoLosContactos)
            toast.success(
                `${contactosNuevos.length} email${contactosNuevos.length > 1 ? 's' : ''} nuevo${contactosNuevos.length > 1 ? 's' : ''} agregado${contactosNuevos.length > 1 ? 's' : ''}. Total: ${todoLosContactos.length}`,
                { id: loadingToast }
            )
            
            // Limpiar el campo de texto
            setTextoPegado('')
        } catch (error) {
            console.error('Error extrayendo emails:', error)
            toast.error('Error: ' + error.message, { id: loadingToast })
        }
    }

    const crearCampaña = async () => {
        if (!nombreCampaña.trim() || !asunto.trim()) {
            toast.error('Completa el nombre y asunto de la campaña')
            return
        }

        if (contactosExtraidos.length === 0) {
            toast.error('Debes agregar al menos un contacto (desde Excel o pegando emails)')
            return
        }

        setEnviando(true)
        
        try {
            // 1. Crear la campaña en Supabase
            const { data: campaña, error: errorCampaña } = await supabaseClient
                .from('froit_email_campaigns')
                .insert({
                    nombre: nombreCampaña.trim(),
                    asunto: asunto.trim(),
                    contenido: contenido || emailFroitHTML(asunto.trim()),
                    estado: 'borrador',
                    total_destinatarios: contactosExtraidos.length,
                    enviados: 0,
                    abiertos: 0,
                    clicks: 0,
                    bounces: 0
                })
                .select()
                .single()

            if (errorCampaña) throw errorCampaña

            // 2. Insertar o actualizar contactos
            const contactosToInsert = contactosExtraidos.map(c => ({
                email: c.email.toLowerCase().trim(),
                nombre: c.nombre || '',
                estado: 'activo',
                origen: 'excel_import'
            }))

            const { data: contactosInsertados, error: errorContactos } = await supabaseClient
                .from('froit_email_contacts')
                .upsert(contactosToInsert, { onConflict: 'email', ignoreDuplicates: false })
                .select()

            if (errorContactos) throw errorContactos

            // 3. Crear los registros de envío
            const envios = contactosInsertados.map(contacto => ({
                campaign_id: campaña.id,
                contact_id: contacto.id,
                email: contacto.email,
                estado: 'pendiente'
            }))

            const { error: errorEnvios } = await supabaseClient
                .from('froit_email_sends')
                .insert(envios)

            if (errorEnvios) throw errorEnvios

            toast.success(`Campaña "${nombreCampaña}" creada con ${contactosExtraidos.length} destinatarios`)
            
            // Limpiar formulario
            setNombreCampaña('')
            setAsunto('')
            setContenido('')
            setContactosExtraidos([])
            setArchivoExcel(null)
            setVistaActiva('campañas')
            
            // Recargar datos
            await cargarCampañas()
            await cargarContactos()
        } catch (error) {
            console.error('Error creando campaña:', error)
            toast.error('Error al crear la campaña: ' + error.message)
        } finally {
            setEnviando(false)
        }
    }

    const eliminarContacto = async (contacto) => {
        if (confirm(`¿Eliminar el contacto ${contacto.email}?`)) {
            try {
                const { error } = await supabaseClient
                    .from('froit_email_contacts')
                    .delete()
                    .eq('id', contacto.id)

                if (error) throw error

                toast.success('Contacto eliminado')
                await cargarContactos()
            } catch (error) {
                console.error('Error eliminando contacto:', error)
                toast.error('Error al eliminar el contacto')
            }
        }
    }

    const enviarCampaña = async (campaña) => {
        const loadingToast = toast.loading(`Enviando campaña "${campaña.nombre}"...`)
        
        try {
            // 1. Verificar límite diario
            const { data: counter, error: counterError } = await supabaseClient
                .rpc('get_email_counter_today')
            
            if (counterError) throw counterError
            
            const emailsHoy = counter?.[0]?.emails_enviados || 0
            const LIMITE_DIARIO = counter?.[0]?.limite_diario || 300
            
            if (emailsHoy >= LIMITE_DIARIO) {
                throw new Error(`Límite diario alcanzado (${LIMITE_DIARIO} emails/día)`)
            }

            // 2. Obtener envíos (todos o solo pendientes)
            const { data: envios, error: errorEnvios } = await supabaseClient
                .from('froit_email_sends')
                .select('*')
                .eq('campaign_id', campaña.id)
                .in('estado', ['pendiente', 'enviado', 'error']) // Incluir también enviados para permitir reenvío

            if (errorEnvios) throw errorEnvios

            if (!envios || envios.length === 0) {
                throw new Error('No hay destinatarios en esta campaña')
            }

            const emailsRestantes = LIMITE_DIARIO - emailsHoy
            const enviosAEnviar = envios.slice(0, emailsRestantes)

            // 3. Enviar emails usando Brevo
            let enviados = 0
            let errores = 0

            for (const envio of enviosAEnviar) {
                try {
                    const response = await fetch('/api/sendEmailBrevo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: envio.email,
                            subject: campaña.asunto,
                            htmlContent: campaña.contenido,
                            tags: [`campaign-${campaña.id}`], // Cambiado de underscore a hyphen
                            params: {
                                campaign_id: campaña.id,
                                contact_id: envio.contact_id,
                                send_id: envio.id
                            }
                        })
                    })

                    const result = await response.json()

                    if (response.ok && result.success) {
                        // Actualizar estado del envío
                        await supabaseClient
                            .from('froit_email_sends')
                            .update({
                                estado: 'enviado',
                                fecha_envio: new Date().toISOString(),
                                brevo_message_id: result.messageId || result.data?.messageId
                            })
                            .eq('id', envio.id)

                        // Incrementar contador diario usando upsert
                        const fechaHoy = new Date().toISOString().split('T')[0]
                        const { data: existingCounter } = await supabaseClient
                            .from('froit_email_daily_counter')
                            .select('emails_enviados')
                            .eq('fecha', fechaHoy)
                            .single()

                        if (existingCounter) {
                            await supabaseClient
                                .from('froit_email_daily_counter')
                                .update({ emails_enviados: existingCounter.emails_enviados + 1 })
                                .eq('fecha', fechaHoy)
                        } else {
                            await supabaseClient
                                .from('froit_email_daily_counter')
                                .insert({ fecha: fechaHoy, emails_enviados: 1 })
                        }

                        enviados++
                    } else {
                        throw new Error(result.error || 'Error enviando email')
                    }
                } catch (err) {
                    console.error(`Error enviando a ${envio.email}:`, err)
                    
                    // Marcar como error
                    await supabaseClient
                        .from('froit_email_sends')
                        .update({
                            estado: 'error',
                            error_message: err.message
                        })
                        .eq('id', envio.id)
                    
                    errores++
                }

                // Pequeña pausa entre envíos
                await new Promise(resolve => setTimeout(resolve, 100))
            }

            // 4. Actualizar métricas de la campaña
            await supabaseClient.rpc('update_campaign_metrics', { p_campaign_id: campaña.id })

            // 5. Actualizar estado de la campaña (siempre como completada si se enviaron todos)
            const todosEnviados = enviosAEnviar.length === envios.length
            await supabaseClient
                .from('froit_email_campaigns')
                .update({
                    estado: todosEnviados ? 'completada' : 'enviando',
                    fecha_envio: new Date().toISOString()
                })
                .eq('id', campaña.id)

            toast.success(
                `Campaña enviada: ${enviados} exitosos${errores > 0 ? `, ${errores} errores` : ''}`,
                { id: loadingToast }
            )
            
            // Recargar campañas
            await cargarCampañas()
        } catch (error) {
            console.error('Error enviando campaña:', error)
            toast.error('Error: ' + error.message, { id: loadingToast })
        }
    }

    const eliminarCampaña = async (campaña) => {
        if (confirm(`¿Eliminar la campaña "${campaña.nombre}"?`)) {
            try {
                // El CASCADE DELETE eliminará automáticamente los email_sends
                const { error } = await supabaseClient
                    .from('froit_email_campaigns')
                    .delete()
                    .eq('id', campaña.id)

                if (error) throw error

                toast.success('Campaña eliminada')
                await cargarCampañas()
            } catch (error) {
                console.error('Error eliminando campaña:', error)
                toast.error('Error al eliminar la campaña')
            }
        }
    }

    const verDetallesEnvios = async (campaña) => {
        setCampañaSeleccionada(campaña)
        setModalEnviosAbierto(true)
        setLoadingEnvios(true)
        
        try {
            const { data, error } = await supabaseClient
                .from('froit_email_sends')
                .select('*')
                .eq('campaign_id', campaña.id)
                .order('created_at', { ascending: false })
            
            if (error) throw error
            setEnviosCampaña(data || [])
        } catch (error) {
            console.error('Error cargando envíos:', error)
            toast.error('Error al cargar detalles de envíos')
        } finally {
            setLoadingEnvios(false)
        }
    }

    const campañasFiltradas = campañas.filter(c => 
        c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.asunto?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const contactosFiltrados = contactos.filter(c => 
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
            <Toaster position="top-right" />
            
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Email Marketing
                    </h1>
                    <p className="text-gray-600">Gestiona tus campañas de email con Froit</p>
                </motion.div>

                {/* Navegación */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setVistaActiva('campañas')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                vistaActiva === 'campañas'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Mail className="w-5 h-5" />
                            Campañas
                        </button>

                        <button
                            onClick={() => setVistaActiva('nueva-campaña')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                vistaActiva === 'nueva-campaña'
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Send className="w-5 h-5" />
                            Nueva Campaña
                        </button>

                        <button
                            onClick={() => setVistaActiva('contactos')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                vistaActiva === 'contactos'
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Users className="w-5 h-5" />
                            Contactos ({contactos.length})
                        </button>

                        <button
                            onClick={() => setVistaActiva('estadisticas')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                vistaActiva === 'estadisticas'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <BarChart3 className="w-5 h-5" />
                            Estadísticas
                        </button>
                    </div>
                </div>

                {/* Vista de Campañas */}
                {vistaActiva === 'campañas' && (
                    <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 text-white"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                        <Send className="w-7 h-7" />
                                    </div>
                                </div>
                                <p className="text-blue-100 text-sm font-medium mb-2">Emails Enviados</p>
                                <p className="text-5xl font-bold">{metricsGlobales.totalEnviados}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl shadow-2xl p-6 text-white"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                        <Eye className="w-7 h-7" />
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                                        {metricsGlobales.tasaApertura}%
                                    </div>
                                </div>
                                <p className="text-green-100 text-sm font-medium mb-2">Emails Abiertos</p>
                                <p className="text-5xl font-bold">{metricsGlobales.totalAbiertos}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl shadow-2xl p-6 text-white"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                        <Download className="w-7 h-7" />
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                                        {metricsGlobales.tasaClick}%
                                    </div>
                                </div>
                                <p className="text-purple-100 text-sm font-medium mb-2">Clicks</p>
                                <p className="text-5xl font-bold">{metricsGlobales.totalClicks}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl shadow-2xl p-6 text-white"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                        <XCircle className="w-7 h-7" />
                                    </div>
                                </div>
                                <p className="text-red-100 text-sm font-medium mb-2">Bounces</p>
                                <p className="text-5xl font-bold">{metricsGlobales.totalBounces}</p>
                            </motion.div>
                        </div>

                        {/* Buscador */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar campañas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 font-medium"
                                />
                            </div>
                        </div>

                        {/* Lista de Campañas */}
                        <div className="grid grid-cols-1 gap-4">
                            {campañasFiltradas.map((campaña) => (
                                <motion.div
                                    key={campaña.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-300"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-800">{campaña.nombre}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        campaña.estado === 'completada' ? 'bg-green-100 text-green-700' :
                                                        campaña.estado === 'enviando' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {campaña.estado}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-4">{campaña.asunto}</p>

                                                {/* Métricas */}
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                                                        <p className="text-xs text-blue-600 font-semibold mb-1">Destinatarios</p>
                                                        <p className="text-2xl font-bold text-blue-700">{campaña.total_destinatarios}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl">
                                                        <p className="text-xs text-green-600 font-semibold mb-1">Enviados</p>
                                                        <p className="text-2xl font-bold text-green-700">{campaña.enviados}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl">
                                                        <p className="text-xs text-purple-600 font-semibold mb-1">Abiertos</p>
                                                        <p className="text-2xl font-bold text-purple-700">{campaña.abiertos}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-xl">
                                                        <p className="text-xs text-orange-600 font-semibold mb-1">Clicks</p>
                                                        <p className="text-2xl font-bold text-orange-700">{campaña.clicks}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-xl">
                                                        <p className="text-xs text-red-600 font-semibold mb-1">Bounces</p>
                                                        <p className="text-2xl font-bold text-red-700">{campaña.bounces}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => verDetallesEnvios(campaña)}
                                                    className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
                                                    title="Ver detalles de envíos"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => enviarCampaña(campaña)}
                                                    className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center"
                                                    title={campaña.estado === 'borrador' ? 'Enviar campaña' : 'Reenviar campaña'}
                                                >
                                                    {campaña.estado === 'borrador' ? (
                                                        <Send className="w-5 h-5" />
                                                    ) : (
                                                        <Repeat className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => eliminarCampaña(campaña)}
                                                    className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                                                    title="Eliminar campaña"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Vista de Nueva Campaña */}
                {vistaActiva === 'nueva-campaña' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nueva Campaña</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la Campaña
                                </label>
                                <input
                                    type="text"
                                    value={nombreCampaña}
                                    onChange={(e) => setNombreCampaña(e.target.value)}
                                    placeholder="Ej: Newsletter Diciembre 2025"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Asunto del Email
                                </label>
                                <input
                                    type="text"
                                    value={asunto}
                                    onChange={(e) => setAsunto(e.target.value)}
                                    placeholder="Ej: 🚀 Automatiza tu negocio con IA"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cargar Lista de Contactos (Excel)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all duration-200">
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer flex flex-col items-center gap-3"
                                    >
                                        <div className="bg-blue-100 p-4 rounded-full">
                                            <Upload className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {archivoExcel ? archivoExcel.name : 'Haz clic para cargar archivo Excel'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Formatos: .xlsx, .xls, .csv
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* NUEVO: Campo para pegar emails directamente */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    O Pega Emails Directamente
                                </label>
                                <div className="space-y-3">
                                    <textarea
                                        value={textoPegado}
                                        onChange={(e) => setTextoPegado(e.target.value)}
                                        placeholder="Pega aquí una lista de emails (uno por línea o separados por comas, espacios, etc.)&#10;&#10;Ejemplo:&#10;juan@empresa.com&#10;maria@empresa.com&#10;pedro@empresa.com"
                                        rows={6}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 text-gray-900 font-mono text-sm resize-none"
                                    />
                                    <button
                                        onClick={extraerEmailsDeTexto}
                                        disabled={!textoPegado.trim()}
                                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Extraer Emails del Texto
                                    </button>
                                    <p className="text-xs text-gray-500 text-center">
                                        💡 Tip: Puedes pegar emails desde Excel, Word, notas, etc. Se extraerán automáticamente
                                    </p>
                                </div>

                                {contactosExtraidos.length > 0 && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                <span className="font-semibold text-green-800">
                                                    {contactosExtraidos.length} email{contactosExtraidos.length > 1 ? 's' : ''} agregado{contactosExtraidos.length > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setContactosExtraidos([])}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Limpiar
                                            </button>
                                        </div>
                                        <div className="max-h-40 overflow-y-auto space-y-1">
                                            {contactosExtraidos.map((contacto, index) => (
                                                <div key={index} className="text-sm text-gray-700 flex items-center gap-2">
                                                    <Mail className="w-3 h-3 text-gray-400" />
                                                    <span className="font-mono">{contacto.email}</span>
                                                    {contacto.nombre && contacto.nombre !== contacto.email.split('@')[0] && (
                                                        <span className="text-gray-500">({contacto.nombre})</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={crearCampaña}
                                    disabled={enviando || !nombreCampaña || !asunto || contactosExtraidos.length === 0}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {enviando ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Crear Campaña
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setVistaActiva('campañas')
                                        setNombreCampaña('')
                                        setAsunto('')
                                        setContactosExtraidos([])
                                        setArchivoExcel(null)
                                    }}
                                    className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vista de Contactos */}
                {vistaActiva === 'contactos' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar contactos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 font-medium text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Origen</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {contactosFiltrados.map((contacto) => (
                                            <tr key={contacto.id} className="hover:bg-purple-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-purple-500" />
                                                        <span className="font-medium text-gray-800">{contacto.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">{contacto.nombre}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                        {contacto.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {contacto.origen === 'excel_import' ? '📊 Excel' : '✍️ Manual'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => eliminarContacto(contacto)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                                                        title="Eliminar contacto"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vista de Estadísticas */}
                {vistaActiva === 'estadisticas' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    Rendimiento General
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-gray-700">Tasa de Apertura</span>
                                            <span className="text-sm font-bold text-green-600">{metricsGlobales.tasaApertura}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                                                style={{ width: `${metricsGlobales.tasaApertura}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-gray-700">Tasa de Click</span>
                                            <span className="text-sm font-bold text-purple-600">{metricsGlobales.tasaClick}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                                                style={{ width: `${metricsGlobales.tasaClick}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-blue-500" />
                                    Resumen de Campañas
                                </h3>
                                
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800">{campañas.length}</p>
                                        <p className="text-xs text-gray-500">Total</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">
                                            {campañas.filter(c => c.estado === 'completada').length}
                                        </p>
                                        <p className="text-xs text-gray-500">Completadas</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-600">
                                            {campañas.filter(c => c.estado === 'borrador').length}
                                        </p>
                                        <p className="text-xs text-gray-500">Borradores</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Detalles de Envíos */}
            {modalEnviosAbierto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{campañaSeleccionada?.nombre}</h2>
                                    <p className="text-blue-100 mt-1">{campañaSeleccionada?.asunto}</p>
                                </div>
                                <button
                                    onClick={() => setModalEnviosAbierto(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {loadingEnvios ? (
                                <div className="flex items-center justify-center py-12">
                                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                                </div>
                            ) : enviosCampaña.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>No hay envíos para esta campaña</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {enviosCampaña.map((envio) => (
                                        <div
                                            key={envio.id}
                                            className="bg-white border-2 border-gray-100 hover:border-blue-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                {/* Email Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <Mail className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{envio.email}</p>
                                                            <p className="text-xs text-gray-500">
                                                                Enviado: {new Date(envio.fecha_envio || envio.created_at).toLocaleString('es-AR')}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Métricas del envío */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                                                        {/* Estado */}
                                                        <div className={`px-3 py-2 rounded-lg text-center ${
                                                            envio.estado === 'enviado' ? 'bg-green-50' :
                                                            envio.estado === 'fallido' ? 'bg-red-50' :
                                                            envio.estado === 'bounce' ? 'bg-orange-50' :
                                                            'bg-gray-50'
                                                        }`}>
                                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                                {envio.estado === 'enviado' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                                                {envio.estado === 'fallido' && <XCircle className="w-4 h-4 text-red-600" />}
                                                                {envio.estado === 'bounce' && <AlertCircle className="w-4 h-4 text-orange-600" />}
                                                            </div>
                                                            <p className={`text-xs font-semibold ${
                                                                envio.estado === 'enviado' ? 'text-green-700' :
                                                                envio.estado === 'fallido' ? 'text-red-700' :
                                                                envio.estado === 'bounce' ? 'text-orange-700' :
                                                                'text-gray-700'
                                                            }`}>
                                                                {envio.estado}
                                                            </p>
                                                        </div>

                                                        {/* Abierto */}
                                                        <div className={`px-3 py-2 rounded-lg text-center ${
                                                            envio.abierto ? 'bg-purple-50' : 'bg-gray-50'
                                                        }`}>
                                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                                <Eye className={`w-4 h-4 ${envio.abierto ? 'text-purple-600' : 'text-gray-400'}`} />
                                                            </div>
                                                            <p className={`text-xs font-semibold ${
                                                                envio.abierto ? 'text-purple-700' : 'text-gray-500'
                                                            }`}>
                                                                {envio.abierto ? `Abierto (${envio.cantidad_aperturas || 1}x)` : 'No abierto'}
                                                            </p>
                                                            {envio.fecha_apertura && (
                                                                <p className="text-[10px] text-gray-500 mt-1">
                                                                    {new Date(envio.fecha_apertura).toLocaleString('es-AR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        day: '2-digit',
                                                                        month: '2-digit'
                                                                    })}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Click */}
                                                        <div className={`px-3 py-2 rounded-lg text-center ${
                                                            envio.click ? 'bg-orange-50' : 'bg-gray-50'
                                                        }`}>
                                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                                <TrendingUp className={`w-4 h-4 ${envio.click ? 'text-orange-600' : 'text-gray-400'}`} />
                                                            </div>
                                                            <p className={`text-xs font-semibold ${
                                                                envio.click ? 'text-orange-700' : 'text-gray-500'
                                                            }`}>
                                                                {envio.click ? `${envio.cantidad_clicks || 1} click${envio.cantidad_clicks > 1 ? 's' : ''}` : 'Sin clicks'}
                                                            </p>
                                                            {envio.fecha_primer_click && (
                                                                <p className="text-[10px] text-gray-500 mt-1">
                                                                    {new Date(envio.fecha_primer_click).toLocaleString('es-AR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        day: '2-digit',
                                                                        month: '2-digit'
                                                                    })}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Bounce */}
                                                        <div className={`px-3 py-2 rounded-lg text-center ${
                                                            envio.bounce ? 'bg-red-50' : 'bg-gray-50'
                                                        }`}>
                                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                                <XCircle className={`w-4 h-4 ${envio.bounce ? 'text-red-600' : 'text-gray-400'}`} />
                                                            </div>
                                                            <p className={`text-xs font-semibold ${
                                                                envio.bounce ? 'text-red-700' : 'text-gray-500'
                                                            }`}>
                                                                {envio.bounce ? `Bounce (${envio.bounce_type || 'N/A'})` : 'OK'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Información adicional */}
                                                    {(envio.dispositivo || envio.navegador || envio.urls_clickeadas) && (
                                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                                                {envio.dispositivo && (
                                                                    <span className="px-2 py-1 bg-gray-100 rounded">
                                                                        📱 {envio.dispositivo}
                                                                    </span>
                                                                )}
                                                                {envio.navegador && (
                                                                    <span className="px-2 py-1 bg-gray-100 rounded">
                                                                        🌐 {envio.navegador}
                                                                    </span>
                                                                )}
                                                                {envio.sistema_operativo && (
                                                                    <span className="px-2 py-1 bg-gray-100 rounded">
                                                                        💻 {envio.sistema_operativo}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {envio.urls_clickeadas && envio.urls_clickeadas.length > 0 && (
                                                                <div className="mt-2">
                                                                    <p className="text-xs font-semibold text-gray-700 mb-1">URLs clickeadas:</p>
                                                                    <div className="space-y-1">
                                                                        {envio.urls_clickeadas.map((url, idx) => (
                                                                            <a
                                                                                key={idx}
                                                                                href={url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-xs text-blue-600 hover:underline block truncate"
                                                                            >
                                                                                {url}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <p>Total de envíos: <span className="font-bold">{enviosCampaña.length}</span></p>
                                <button
                                    onClick={() => setModalEnviosAbierto(false)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
