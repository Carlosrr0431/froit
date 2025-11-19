// Plantilla HTML para emails de Froit - Optimizada para clientes de correo
export const emailFroitHTML = (contenido, nombre = 'Cliente') => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Froit - Todo lo que tu negocio necesita</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
    
    <!-- Contenedor principal con ancho máximo -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f172a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                
                <!-- Tarjeta contenedora -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #1e293b; border-radius: 16px;">
                    
                    <!-- Header: Logo Froit -->
                    <tr>
                        <td align="center" style="padding: 40px 30px 20px 30px;">
                            <h1 style="font-size: 42px; font-weight: bold; color: #ffffff; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                Froit
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Título principal -->
                    <tr>
                        <td align="center" style="padding: 10px 40px 5px 40px;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; line-height: 1.3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                Todo lo que tu negocio necesita
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Subtítulo -->
                    <tr>
                        <td align="center" style="padding: 5px 40px 20px 40px;">
                            <h3 style="color: #3b82f6; margin: 0; font-size: 24px; font-weight: bold; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                con un agente IA de WhatsApp
                            </h3>
                        </td>
                    </tr>
                    
                    <!-- Descripción -->
                    <tr>
                        <td align="center" style="padding: 10px 50px 30px 50px;">
                            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                Agente IA inteligente + CRM personalizado + microservicios potentes, diseñados específicamente para hacer crecer tu negocio
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenido personalizado -->
                    <tr>
                        <td align="center" style="padding: 0 40px 30px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="color: #cbd5e1; font-size: 16px; line-height: 1.7; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                        ${contenido}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Sección de servicios - Stack vertical para mejor compatibilidad -->
                    <tr>
                        <td style="padding: 20px 30px;">
                            
                            <!-- Servicio 1: Automatizaciones con IA -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f172a; border: 2px solid #fb923c; border-radius: 12px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <!-- Icono -->
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" style="width: 50px; height: 50px; background-color: #fb923c; border-radius: 10px; font-size: 24px; line-height: 50px;">
                                                    ⚡
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Título -->
                                        <h4 style="color: #ffffff; font-size: 19px; font-weight: bold; margin: 15px 0 5px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            Automatizaciones con IA
                                        </h4>
                                        
                                        <!-- Subtítulo -->
                                        <p style="color: #fb923c; font-size: 12px; font-weight: bold; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            Ahorra Tiempo y Recursos
                                        </p>
                                        
                                        <!-- Descripción -->
                                        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 15px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            Automatiza todo tipo de necesidades en tu negocio para ahorrar tiempo y recursos valiosos.
                                        </p>
                                        
                                        <!-- Bullets -->
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="padding: 4px 0;">
                                                    <span style="color: #fb923c;">●</span>
                                                    <span style="color: #cbd5e1; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;"> Automatiza tareas repetitivas del día a día</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0;">
                                                    <span style="color: #fb923c;">●</span>
                                                    <span style="color: #cbd5e1; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;"> Reduce costos operativos significativamente</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0;">
                                                    <span style="color: #fb923c;">●</span>
                                                    <span style="color: #cbd5e1; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;"> Libera tiempo para enfocarte en crecer</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Servicio 2: WhatsApp IA con RAG -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f172a; border: 2px solid #a855f7; border-radius: 12px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <!-- Icono -->
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" style="width: 50px; height: 50px; background-color: #a855f7; border-radius: 10px; font-size: 24px; line-height: 50px;">
                                                    💬
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Título -->
                                        <h4 style="color: #ffffff; font-size: 19px; font-weight: bold; margin: 15px 0 5px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            WhatsApp IA con RAG
                                        </h4>
                                        
                                        <!-- Subtítulo -->
                                        <p style="color: #a855f7; font-size: 12px; font-weight: bold; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            Sistema Inteligente de Respuestas
                                        </p>
                                        
                                        <!-- Descripción -->
                                        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 15px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            Sistema inteligente que responde automáticamente con información actualizada de tu negocio usando Retrieval-Augmented Generation.
                                        </p>
                                        
                                        <!-- Bullets -->
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="padding: 4px 0;">
                                                    <span style="color: #a855f7;">●</span>
                                                    <span style="color: #cbd5e1; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;"> Respuestas contextuales y personalizadas 24/7</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0;">
                                                    <span style="color: #a855f7;">●</span>
                                                    <span style="color: #cbd5e1; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;"> Aprende de tu base de conocimientos</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0;">
                                                    <span style="color: #a855f7;">●</span>
                                                    <span style="color: #cbd5e1; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;"> Captura y califica leads automáticamente</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Servicio 3: CRM Conversacional -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f172a; border: 2px solid #22c55e; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <!-- Icono -->
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" style="width: 50px; height: 50px; background-color: #22c55e; border-radius: 10px; font-size: 24px; line-height: 50px;">
                                                    📊
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Título -->
                                        <h4 style="color: #ffffff; font-size: 19px; font-weight: bold; margin: 15px 0 5px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            CRM Conversacional
                                        </h4>
                                        
                                        <!-- Subtítulo -->
                                        <p style="color: #22c55e; font-size: 12px; font-weight: bold; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            Gestión Completa de Clientes
                                        </p>
                                        
                                        <!-- Descripción -->
                                        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 15px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            Seguimiento completo de consultas y estados de cada cliente integrado con tu flujo de trabajo.
                                        </p>
                                        
                                        <!-- Bullets -->
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="padding: 4px 0;">
                                                    <span style="color: #22c55e;">●</span>
                                                    <span style="color: #cbd5e1; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;"> Seguimiento de conversaciones en tiempo real</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0;">
                                                    <span style="color: #22c55e;">●</span>
                                                    <span style="color: #cbd5e1; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;"> Estados personalizables del proceso de ventas</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0;">
                                                    <span style="color: #22c55e;">●</span>
                                                    <span style="color: #cbd5e1; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;"> Integración con Google Calendar para agendar</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Botón CTA -->
                    <tr>
                        <td align="center" style="padding: 30px 40px 40px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="border-radius: 10px; background-color: #3b82f6;">
                                        <a href="https://www.froit.com.ar" style="display: inline-block; padding: 16px 40px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            Explorar más →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #64748b; font-size: 14px; margin: 15px 0 0 0; font-style: italic; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                Comienza a transformar tu negocio hoy
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Separador -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="border-bottom: 1px solid #334155; padding: 10px 0;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 30px 40px;">
                            <p style="color: #94a3b8; font-size: 14px; margin: 0 0 15px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                Agente IA de WhatsApp con CRM personalizado y microservicios potentes
                            </p>
                            
                            <!-- Enlaces del footer -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                                <tr>
                                    <td style="padding: 0 10px;">
                                        <a href="https://www.froit.com.ar" style="color: #3b82f6; text-decoration: none; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            🌐 Sitio Web
                                        </a>
                                    </td>
                                    <td style="color: #475569; padding: 0 5px;">•</td>
                                    <td style="padding: 0 10px;">
                                        <a href="mailto:comercial@froit.com.ar" style="color: #8b5cf6; text-decoration: none; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            ✉️ Contacto
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #64748b; font-size: 13px; margin: 20px 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                © 2025 Froit. Todos los derechos reservados.
                            </p>
                            <p style="margin: 0;">
                                <a href="{{unsubscribe}}" style="color: #475569; text-decoration: underline; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                    Darse de baja
                                </a>
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
