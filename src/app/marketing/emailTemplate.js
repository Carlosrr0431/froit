// Plantilla HTML para emails de Froit - Diseño minimalista para evitar filtros de spam
export const emailFroitHTML = (contenido, nombre = 'Cliente') => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Froit</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff;">
                    
                    <!-- Header simple -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <h1 style="font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 10px 0;">
                                Froit
                            </h1>
                            <p style="color: #64748b; font-size: 15px; margin: 0; line-height: 1.5;">
                                Hola ${nombre},
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenido personalizado -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <div style="color: #334155; font-size: 15px; line-height: 1.7;">
                                ${contenido}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Qué ofrecemos -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                                Qué ofrecemos:
                            </p>
                            
                            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
                                <strong>Automatizaciones inteligentes:</strong> Ahorra tiempo automatizando tareas repetitivas con IA.
                            </p>
                            
                            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
                                <strong>WhatsApp con IA:</strong> Respuestas automáticas 24/7 que aprenden de tu negocio.
                            </p>
                            
                            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">
                                <strong>CRM integrado:</strong> Gestiona todas tus conversaciones y clientes en un solo lugar.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- CTA simple -->
                    <tr>
                        <td style="padding: 30px 40px;">
                            <a href="https://www.froit.com.ar" style="display: inline-block; padding: 12px 30px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 500;">
                                Ver más información
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Separador sutil -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <div style="border-top: 1px solid #e2e8f0;"></div>
                        </td>
                    </tr>
                    
                    <!-- Footer minimalista -->
                    <tr>
                        <td style="padding: 20px 40px 40px 40px;">
                            <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0 0 10px 0;">
                                ¿Preguntas? Responde a este email o contáctanos en comercial@froit.com.ar
                            </p>
                            
                            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 5px 0;">
                                Froit - Soluciones de IA para negocios
                            </p>
                            
                            <a href="{{unsubscribe}}" style="color: #94a3b8; text-decoration: underline; font-size: 11px;">
                                Cancelar suscripción
                            </a>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>`
}
