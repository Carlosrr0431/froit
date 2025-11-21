// Plantilla HTML para emails de Froit - Diseño moderno estilo empresas tech
export const emailFroitHTML = (contenido, nombre = 'Cliente') => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Froit - IA para tu negocio</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <tr>
            <td align="center" style="padding: 60px 20px;">
                
                <!-- Contenedor principal con sombra -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden;">
                    
                    <!-- Header con logo y gradiente -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                            <!-- Logo SVG de Froit -->
                            <div style="margin-bottom: 20px;">
                                <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0" y="0" width="40" height="40" rx="8" fill="#ffffff" opacity="0.2"/>
                                    <text x="50" y="28" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#ffffff">Froit</text>
                                </svg>
                            </div>
                            <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
                                Transformamos tu negocio con IA
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Saludo personalizado -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <p style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">
                                Hola ${nombre} 👋
                            </p>
                            <p style="color: #64748b; font-size: 15px; margin: 0; line-height: 1.6;">
                                Nos emociona presentarte las soluciones que están revolucionando la forma de hacer negocios.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenido personalizado con diseño mejorado -->
                    <tr>
                        <td style="padding: 20px 40px 30px 40px;">
                            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; color: #334155; font-size: 15px; line-height: 1.7;">
                                ${contenido}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Features en tarjetas modernas -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <h2 style="color: #1e293b; font-size: 22px; font-weight: 700; margin: 0 0 24px 0; text-align: center;">
                                Potencia tu negocio con tecnología de vanguardia
                            </h2>
                            
                            <!-- Feature 1 -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="width: 48px; vertical-align: top;">
                                                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                                                        🤖
                                                    </div>
                                                </td>
                                                <td style="padding-left: 16px; vertical-align: top;">
                                                    <h3 style="color: #1e293b; font-size: 17px; font-weight: 600; margin: 0 0 8px 0;">
                                                        Automatización Inteligente
                                                    </h3>
                                                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">
                                                        Libera hasta el 80% de tiempo en tareas repetitivas. Nuestra IA aprende y se adapta a tus procesos únicos.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Feature 2 -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="width: 48px; vertical-align: top;">
                                                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                                                        💬
                                                    </div>
                                                </td>
                                                <td style="padding-left: 16px; vertical-align: top;">
                                                    <h3 style="color: #1e293b; font-size: 17px; font-weight: 600; margin: 0 0 8px 0;">
                                                        WhatsApp IA Avanzado
                                                    </h3>
                                                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">
                                                        Atención 24/7 con contexto completo. Cada conversación es personalizada y relevante para tus clientes.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Feature 3 -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 12px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="width: 48px; vertical-align: top;">
                                                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                                                        📊
                                                    </div>
                                                </td>
                                                <td style="padding-left: 16px; vertical-align: top;">
                                                    <h3 style="color: #1e293b; font-size: 17px; font-weight: 600; margin: 0 0 8px 0;">
                                                        CRM Inteligente
                                                    </h3>
                                                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">
                                                        Centraliza todas tus interacciones. Analytics en tiempo real para decisiones basadas en datos.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- CTA prominente -->
                    <tr>
                        <td style="padding: 40px; text-align: center;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 30px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);">
                                        <a href="https://www.froit.com.ar" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; letter-spacing: 0.3px;">
                                            Comienza ahora →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #64748b; font-size: 13px; margin: 16px 0 0 0; font-style: italic;">
                                Sin compromisos. Configuración en minutos.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Separador sutil -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="border-top: 1px solid #e2e8f0;"></div>
                        </td>
                    </tr>
                    
                    <!-- Footer moderno -->
                    <tr>
                        <td style="padding: 32px 40px; background: #f8fafc; text-align: center;">
                            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
                                ¿Tienes preguntas? Nuestro equipo está listo para ayudarte
                            </p>
                            <p style="margin: 0 0 20px 0;">
                                <a href="mailto:comercial@froit.com.ar" style="color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 14px;">
                                    comercial@froit.com.ar
                                </a>
                            </p>
                            
                            <!-- Social links -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 20px 0;">
                                <tr>
                                    <td style="padding: 0 8px;">
                                        <a href="https://www.froit.com.ar" style="color: #64748b; text-decoration: none; font-size: 13px;">
                                            🌐 Web
                                        </a>
                                    </td>
                                    <td style="color: #cbd5e1; padding: 0 4px;">|</td>
                                    <td style="padding: 0 8px;">
                                        <a href="https://www.froit.com.ar" style="color: #64748b; text-decoration: none; font-size: 13px;">
                                            📱 WhatsApp
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0 0;">
                                © 2025 Froit. Soluciones de IA para negocios.
                            </p>
                            <p style="margin: 8px 0 0 0;">
                                <a href="{{unsubscribe}}" style="color: #94a3b8; text-decoration: none; font-size: 11px; border-bottom: 1px solid #cbd5e1;">
                                    Cancelar suscripción
                                </a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
                <!-- Texto legal pequeño fuera de la tarjeta -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin-top: 24px;">
                    <tr>
                        <td style="text-align: center;">
                            <p style="color: rgba(255, 255, 255, 0.8); font-size: 11px; margin: 0; line-height: 1.5;">
                                Este email fue enviado a ${nombre} porque expresaste interés en Froit.<br>
                                Froit - Argentina
                            </p>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>`
}
