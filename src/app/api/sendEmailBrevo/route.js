// API Route para enviar emails usando Brevo SMTP
// Endpoint: /api/sendEmailBrevo
// Remitente: comercial@froit.com.ar

import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

/**
 * Enviar email usando Brevo SMTP (sin restricciones de IP)
 * Con tracking automático de aperturas y clicks
 */
export async function POST(request) {
    try {
        const { 
            to, 
            subject, 
            htmlContent, 
            textContent,
            tags = [],
            params = {},
            sender,
            replyTo
        } = await request.json()

        // Validaciones
        if (!to) {
            return NextResponse.json({
                success: false,
                error: 'El campo "to" es requerido'
            }, { status: 400 })
        }

        if (!subject) {
            return NextResponse.json({
                success: false,
                error: 'El campo "subject" es requerido'
            }, { status: 400 })
        }

        if (!htmlContent && !textContent) {
            return NextResponse.json({
                success: false,
                error: 'Se requiere al menos htmlContent o textContent'
            }, { status: 400 })
        }

        console.log('📧 Enviando email con Brevo SMTP:', {
            to: Array.isArray(to) ? to : [to],
            subject,
            tags
        })

        // Configurar transporter de Nodemailer con SMTP de Brevo
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false, // true para puerto 465, false para otros puertos
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASS
            }
        })

        // Preparar destinatarios
        const recipients = Array.isArray(to) ? to : [to]

        // Preparar opciones del email
        const mailOptions = {
            from: {
                name: sender?.name || 'Froit',
                address: sender?.email || 'comercial@froit.com.ar'
            },
            to: recipients,
            subject: subject,
            html: htmlContent,
            text: textContent,
            headers: {
                // Headers personalizados de Brevo para tracking
                'X-Mailin-Custom': JSON.stringify(params),
                'X-Mailin-Tag': tags.length > 0 ? tags.join(', ') : undefined
            }
        }

        // Agregar replyTo si existe
        if (replyTo) {
            mailOptions.replyTo = typeof replyTo === 'string' 
                ? replyTo 
                : replyTo.email
        }

        // Limpiar headers undefined
        if (!mailOptions.headers['X-Mailin-Tag']) {
            delete mailOptions.headers['X-Mailin-Tag']
        }

        // Enviar email
        const info = await transporter.sendMail(mailOptions)

        console.log('✅ Email enviado exitosamente con Brevo SMTP:', info.messageId)

        return NextResponse.json({
            success: true,
            message: 'Email enviado con tracking activo',
            messageId: info.messageId,
            accepted: info.accepted,
            response: info.response,
            data: {
                messageId: info.messageId
            }
        }, { status: 200 })

    } catch (error) {
        console.error('❌ Error en sendEmailBrevo:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Error interno del servidor'
        }, { status: 500 })
    }
}

// GET para verificar que la API está activa
export async function GET() {
    return NextResponse.json({
        service: 'Froit Email Service (Brevo SMTP)',
        status: 'active',
        sender: {
            email: 'comercial@froit.com.ar',
            name: 'Froit'
        },
        configured: !!(process.env.BREVO_SMTP_USER || process.env.BREVO_SMTP_PASS),
        timestamp: new Date().toISOString()
    }, { status: 200 })
}
