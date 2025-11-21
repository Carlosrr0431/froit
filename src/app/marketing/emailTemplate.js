// Plantilla HTML para emails de Froit - Diseño minimalista y moderno
export const emailFroitHTML = (contenido, nombre = 'Cliente') => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Froit</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 60px 20px 40px 20px;">
                
                <!-- Logo de Froit grande -->
                <svg width="280" height="100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto 40px auto;">
                    <defs>
                        <style>
                            .cls-1 { fill: #6cbfa5; }
                            .cls-2 { fill: #1e293b; }
                            .cls-3 { fill: #56c3e8; }
                            .cls-4 { fill: #826aac; }
                        </style>
                    </defs>
                    
                    <!-- Texto FROIT -->
                    <path class="cls-2" d="M63.4,81.2c-1.9,1.1-3.5,2.6-4.6,4.5-1.1,1.9-1.7,4.1-1.7,6.6v36.4h6.8v-20.5h21v-6h-21v-10c0-2,.6-3.6,1.9-4.9,1.2-1.3,2.9-1.9,5-1.9h16.7v-6h-17.5c-2.4,0-4.6.6-6.6,1.7Z"/>
                    <path class="cls-2" d="M97.6,95.6c-1.8,1.8-2.7,4.3-2.7,7.5v25.7h6.5v-25.3c0-1.6.4-2.8,1.3-3.7.9-.9,2.1-1.3,3.6-1.3h6.2v-5.6h-7.4c-3.2,0-5.7.9-7.5,2.7Z"/>
                    <path class="cls-2" d="M145,94.6c-2.8-1.7-6.1-2.5-9.7-2.5s-6.9.8-9.7,2.5c-2.8,1.7-5,3.9-6.7,6.8-1.6,2.8-2.5,6-2.5,9.5s.8,6.7,2.5,9.5c1.6,2.8,3.9,5.1,6.7,6.8s6,2.5,9.7,2.5,6.9-.8,9.7-2.5,5.1-3.9,6.7-6.8c1.6-2.8,2.4-6,2.4-9.5s-.8-6.7-2.4-9.5c-1.6-2.8-3.8-5.1-6.7-6.8ZM146.1,117.6c-1,2-2.5,3.6-4.3,4.7-1.8,1.2-4,1.8-6.4,1.8s-4.7-.6-6.5-1.8c-1.9-1.2-3.3-2.8-4.3-4.7-1-2-1.5-4.2-1.5-6.7s.5-4.7,1.5-6.7c1-2,2.5-3.6,4.3-4.7,1.9-1.2,4-1.8,6.5-1.8s4.6.6,6.4,1.8c1.8,1.2,3.3,2.8,4.3,4.7,1,2,1.5,4.2,1.5,6.7s-.5,4.7-1.5,6.7Z"/>
                    <path class="cls-2" d="M165.7,78.5c-1.2,0-2.2.4-3.1,1.3-.9.9-1.3,1.9-1.3,3.1s.4,2.2,1.3,3.1c.9.9,1.9,1.3,3.1,1.3s2.2-.4,3.1-1.3c.9-.9,1.3-1.9,1.3-3.1s-.4-2.2-1.3-3.1c-.9-.9-1.9-1.3-3.1-1.3Z"/>
                    <rect class="cls-2" x="162.4" y="92.9" width="6.5" height="35.9"/>
                    <path class="cls-2" d="M200,98.5v-5.6h-12.3v-9h-6.5v9h-6.2v5.6h6.2v20.1c0,3.1.9,5.6,2.7,7.5,1.8,1.8,4.3,2.7,7.5,2.7h8.4v-5.6h-7.2c-1.5,0-2.8-.5-3.6-1.4s-1.3-2.1-1.3-3.7v-19.7h12.3Z"/>
                    
                    <!-- Cuadrados -->
                    <rect class="cls-1" x="0" y="109.4" width="19.5" height="19.5"/>
                    <rect class="cls-3" x="0" y="70.3" width="19.5" height="19.5"/>
                    <rect class="cls-4" x="19.5" y="89.9" width="19.5" height="19.5"/>
                </svg>
                
            </td>
        </tr>
    </table>
    
    <!-- Contenedor principal -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 0 20px 60px 20px;">
                
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                    
                    <!-- Saludo -->
                    <tr>
                        <td style="padding: 0 0 32px 0;">
                            <h1 style="color: #1e293b; font-size: 32px; font-weight: 700; margin: 0 0 12px 0; letter-spacing: -0.5px; line-height: 1.2;">
                                Hola ${nombre} 👋
                            </h1>
                            <p style="color: #64748b; font-size: 18px; margin: 0; line-height: 1.6; font-weight: 400;">
                                Transformamos la forma en que trabajas
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenido personalizado -->
                    <tr>
                        <td style="padding: 0 0 48px 0;">
                            <div style="color: #475569; font-size: 16px; line-height: 1.8; font-weight: 400;">
                                ${contenido}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Features minimalistas -->
                    <tr>
                        <td style="padding: 0 0 48px 0;">
                            
                            <!-- Feature 1 -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                                <tr>
                                    <td style="width: 48px; vertical-align: top; padding-right: 20px;">
                                        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #6cbfa5 0%, #4a9d85 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                            </svg>
                                        </div>
                                    </td>
                                    <td style="vertical-align: top;">
                                        <h3 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">
                                            Automatización Inteligente
                                        </h3>
                                        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0;">
                                            Libera hasta el 80% de tiempo en tareas repetitivas con IA que aprende de tu negocio.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Feature 2 -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                                <tr>
                                    <td style="width: 48px; vertical-align: top; padding-right: 20px;">
                                        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #56c3e8 0%, #3a9ec7 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                            </svg>
                                        </div>
                                    </td>
                                    <td style="vertical-align: top;">
                                        <h3 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">
                                            WhatsApp IA Avanzado
                                        </h3>
                                        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0;">
                                            Atención personalizada 24/7 con contexto completo de cada conversación.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Feature 3 -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="width: 48px; vertical-align: top; padding-right: 20px;">
                                        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #826aac 0%, #654a8a 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 3V21H21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                                <path d="M18 17L13 12L9 16L3 10" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                            </svg>
                                        </div>
                                    </td>
                                    <td style="vertical-align: top;">
                                        <h3 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">
                                            CRM Inteligente
                                        </h3>
                                        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0;">
                                            Centraliza interacciones y toma decisiones basadas en datos en tiempo real.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- CTA minimalista -->
                    <tr>
                        <td style="padding: 0 0 48px 0; text-align: center;">
                            <a href="https://www.froit.com.ar" style="display: inline-block; padding: 16px 48px; background-color: #1e293b; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px;">
                                Comenzar ahora
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Separador -->
                    <tr>
                        <td style="padding: 0 0 32px 0;">
                            <div style="border-top: 1px solid #e2e8f0;"></div>
                        </td>
                    </tr>
                    
                    <!-- Footer minimalista -->
                    <tr>
                        <td style="text-align: center;">
                            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">
                                ¿Preguntas? Escríbenos a <a href="mailto:comercial@froit.com.ar" style="color: #1e293b; text-decoration: none; font-weight: 600;">comercial@froit.com.ar</a>
                            </p>
                            <p style="color: #cbd5e1; font-size: 13px; margin: 0 0 12px 0;">
                                Froit · Soluciones de IA para negocios · 2025
                            </p>
                            <p style="margin: 0;">
                                <a href="{{unsubscribe}}" style="color: #cbd5e1; text-decoration: none; font-size: 12px; border-bottom: 1px solid #e2e8f0;">
                                    Cancelar suscripción
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
