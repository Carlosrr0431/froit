// Plantilla HTML para emails de Froit - Diseño inspirado en la imagen
export const emailFroitHTML = (contenido, nombre = "Cliente") => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Newsletter Froit - Soluciones IA</title>
    <style>
        /* Reset básico */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100%; height: 100%; }
        
        /* Soporte para Dark Mode */
        @media (prefers-color-scheme: dark) {
            .dark-mode-bg { background-color: #1a1a1a !important; }
            .dark-mode-text { color: #ffffff !important; }
            .dark-mode-text-secondary { color: #b0b0b0 !important; }
            .dark-mode-border { border-color: #333333 !important; }
        }
        
        /* Responsive */
        @media screen and (max-width: 600px) {
            .container { width: 100% !important; max-width: 100% !important; }
            .mobile-padding { padding: 20px 15px !important; }
            .mobile-text { font-size: 16px !important; line-height: 24px !important; }
            .mobile-title { font-size: 28px !important; line-height: 36px !important; }
            .mobile-button { width: 100% !important; display: block !important; }
            .mobile-hide { display: none !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
            .mobile-icon { width: 40px !important; height: 40px !important; font-size: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(180deg, #e0e7ff 0%, #f0f4f8 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    
    <!-- Wrapper principal -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(180deg, #e0e7ff 0%, #f0f4f8 100%);">
        <tr>
            <td align="center" style="padding: 40px 15px;">
                
                <!-- Container principal 600px -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(79, 70, 229, 0.15);">
                    
                    <!-- HEADER -->
                    <tr>
                        <td align="center" style="padding: 40px 40px; background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%); border-bottom: 3px solid #e0e7ff;" class="mobile-padding">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="left" valign="middle">
                                        <!-- Logo Froit sin fondo -->
                                        <a href="https://froit.com" style="text-decoration: none;">
                                            <img src="https://res.cloudinary.com/dtiqaci6a/image/upload/v1765721888/froit-02_b7isuy.png" alt="Froit" width="140" height="auto" style="display: block; max-width: 140px; height: auto;">
                                        </a>
                                    </td>
                                    <td align="right" valign="middle" class="mobile-hide">
                                        <a href="https://froit.com/blog" style="color: #1e293b; text-decoration: none; font-size: 15px; font-weight: 600; margin-left: 28px;">Blog</a>
                                        <a href="https://froit.com/soluciones" style="color: #1e293b; text-decoration: none; font-size: 15px; font-weight: 600; margin-left: 28px;">Soluciones</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- HERO SECTION -->
                    <tr>
                        <td align="center" style="padding: 70px 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); position: relative;" class="mobile-padding">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <h1 style="margin: 0 0 24px 0; font-size: 42px; font-weight: 900; line-height: 50px; color: #ffffff; letter-spacing: -1px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);" class="mobile-title">
                                            Transforma tu Negocio con IA
                                        </h1>
                                        <p style="margin: 0 0 40px 0; font-size: 20px; line-height: 32px; color: #ffffff; font-weight: 400; opacity: 0.95;" class="mobile-text">
                                            Automatización inteligente que libera tu tiempo y potencia tus resultados
                                        </p>
                                        <!-- CTA Button -->
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                                            <tr>
                                                <td align="center" style="border-radius: 10px; background-color: #ffffff; box-shadow: 0 8px 24px rgba(0,0,0,0.2);" class="mobile-button">
                                                    <a href="https://froit.com/demo" style="display: inline-block; padding: 20px 48px; font-size: 17px; font-weight: 800; color: #6366f1; text-decoration: none; border-radius: 10px; background-color: #ffffff; letter-spacing: 0.3px;">
                                                        Solicitar Demo Gratuita →
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- MAIN CONTENT -->
                    <tr>
                        <td style="padding: 55px 45px 45px 45px; background: linear-gradient(180deg, #ffffff 0%, #fafbff 100%);" class="mobile-padding">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <h2 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 800; line-height: 36px; color: #0f172a;">
                                            Hola 👋
                                        </h2>
                                        <p style="margin: 0 0 20px 0; font-size: 17px; line-height: 30px; color: #1e293b; font-weight: 400;">
                                            En <strong style="color: #6366f1; font-weight: 700;">Froit</strong> sabemos que tu tiempo es valioso. Por eso hemos desarrollado soluciones de inteligencia artificial que trabajan para ti las 24 horas del día.
                                        </p>
                                        <p style="margin: 0 0 0 0; font-size: 17px; line-height: 30px; color: #1e293b; font-weight: 400;">
                                            Descubre cómo nuestras herramientas de IA pueden transformar la gestión de tu negocio y llevarte al siguiente nivel.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- FEATURES SECTION -->
                    <tr>
                        <td style="padding: 0 45px 55px 45px; background: linear-gradient(180deg, #fafbff 0%, #f8fafc 100%);" class="mobile-padding">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                
                                <!-- Feature 1: Automatización Inteligente -->
                                <tr>
                                    <td style="padding: 32px; background: linear-gradient(135deg, #ffffff 0%, #fefeff 100%); border-radius: 16px; border: 2px solid #e0e7ff; box-shadow: 0 8px 24px rgba(99, 102, 241, 0.08);" class="mobile-padding">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td width="80" valign="top" style="padding-right: 24px;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td align="center" valign="middle" style="width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; font-size: 32px; line-height: 64px; box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);" class="mobile-icon">
                                                                ⚡
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top">
                                                    <h3 style="margin: 0 0 12px 0; font-size: 21px; font-weight: 800; line-height: 28px; color: #0f172a;">
                                                        Automatización Inteligente
                                                    </h3>
                                                    <p style="margin: 0; font-size: 16px; line-height: 27px; color: #334155; font-weight: 400;">
                                                        Libera el <strong style="color: #6366f1; font-weight: 700;">80% de tu tiempo</strong> con IA que aprende de tu negocio y automatiza tareas repetitivas de forma inteligente.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Spacer -->
                                <tr><td style="height: 20px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
                                
                                <!-- Feature 2: WhatsApp IA 24/7 -->
                                <tr>
                                    <td style="padding: 32px; background: linear-gradient(135deg, #ffffff 0%, #fefeff 100%); border-radius: 16px; border: 2px solid #e0e7ff; box-shadow: 0 8px 24px rgba(139, 92, 246, 0.08);" class="mobile-padding">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td width="80" valign="top" style="padding-right: 24px;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td align="center" valign="middle" style="width: 64px; height: 64px; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); border-radius: 16px; font-size: 32px; line-height: 64px; box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);" class="mobile-icon">
                                                                💬
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top">
                                                    <h3 style="margin: 0 0 12px 0; font-size: 21px; font-weight: 800; line-height: 28px; color: #0f172a;">
                                                        WhatsApp IA 24/7
                                                    </h3>
                                                    <p style="margin: 0; font-size: 16px; line-height: 27px; color: #334155; font-weight: 400;">
                                                        Atención <strong style="color: #8b5cf6; font-weight: 700;">personalizada las 24 horas</strong> del día. Responde a tus clientes al instante, incluso mientras duermes.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Spacer -->
                                <tr><td style="height: 20px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
                                
                                <!-- Feature 3: CRM Inteligente -->
                                <tr>
                                    <td style="padding: 32px; background: linear-gradient(135deg, #ffffff 0%, #fefeff 100%); border-radius: 16px; border: 2px solid #e0e7ff; box-shadow: 0 8px 24px rgba(168, 85, 247, 0.08);" class="mobile-padding">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td width="80" valign="top" style="padding-right: 24px;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td align="center" valign="middle" style="width: 64px; height: 64px; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); border-radius: 16px; font-size: 32px; line-height: 64px; box-shadow: 0 6px 20px rgba(168, 85, 247, 0.3);" class="mobile-icon">
                                                                📊
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top">
                                                    <h3 style="margin: 0 0 12px 0; font-size: 21px; font-weight: 800; line-height: 28px; color: #0f172a;">
                                                        CRM Inteligente
                                                    </h3>
                                                    <p style="margin: 0; font-size: 16px; line-height: 27px; color: #334155; font-weight: 400;">
                                                        Decisiones basadas en <strong style="color: #a855f7; font-weight: 700;">datos en tiempo real</strong>. Analítica predictiva que anticipa las necesidades de tus clientes.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                    
                    <!-- CTA SECTION -->
                    <tr>
                        <td align="center" style="padding: 50px 45px; background: linear-gradient(135deg, #eef2ff 0%, #ddd6fe 100%); border-top: 3px solid #c7d2fe;" class="mobile-padding">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <h3 style="margin: 0 0 16px 0; font-size: 26px; font-weight: 800; line-height: 34px; color: #0f172a;">
                                            ¿Listo para Automatizar tu Negocio? 🚀
                                        </h3>
                                        <p style="margin: 0 0 32px 0; font-size: 17px; line-height: 28px; color: #1e293b; font-weight: 500;">
                                            Únete a <strong style="color: #6366f1;">cientos de empresas</strong> que ya transformaron su gestión con IA
                                        </p>
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                                            <tr>
                                                <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);" class="mobile-button">
                                                    <a href="https://froit.com/comenzar" style="display: inline-block; padding: 20px 48px; font-size: 18px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 10px; letter-spacing: 0.3px;">
                                                        Comenzar Ahora →
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- FOOTER -->
                    <tr>
                        <td style="padding: 50px 45px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);" class="mobile-padding">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                
                                <!-- Social Media -->
                                <tr>
                                    <td align="center" style="padding-bottom: 32px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                                            <tr>
                                                <td style="padding: 0 12px;">
                                                    <a href="https://twitter.com/froit" style="text-decoration: none; display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #334155 0%, #475569 100%); border-radius: 50%; text-align: center; line-height: 48px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                                                        <img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" alt="Twitter" width="22" height="22" style="display: inline-block; vertical-align: middle;">
                                                    </a>
                                                </td>
                                                <td style="padding: 0 12px;">
                                                    <a href="https://linkedin.com/company/froit" style="text-decoration: none; display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #334155 0%, #475569 100%); border-radius: 50%; text-align: center; line-height: 48px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                                                        <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="LinkedIn" width="22" height="22" style="display: inline-block; vertical-align: middle;">
                                                    </a>
                                                </td>
                                                <td style="padding: 0 12px;">
                                                    <a href="https://instagram.com/froit" style="text-decoration: none; display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #334155 0%, #475569 100%); border-radius: 50%; text-align: center; line-height: 48px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                                                        <img src="https://cdn-icons-png.flaticon.com/32/174/174855.png" alt="Instagram" width="22" height="22" style="display: inline-block; vertical-align: middle;">
                                                    </a>
                                                </td>
                                                <td style="padding: 0 12px;">
                                                    <a href="https://wa.me/1234567890" style="text-decoration: none; display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #334155 0%, #475569 100%); border-radius: 50%; text-align: center; line-height: 48px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                                                        <img src="https://cdn-icons-png.flaticon.com/32/733/733585.png" alt="WhatsApp" width="22" height="22" style="display: inline-block; vertical-align: middle;">
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Company Info -->
                                <tr>
                                    <td align="center" style="padding-bottom: 24px;">
                                        <p style="margin: 0; font-size: 16px; line-height: 26px; color: #cbd5e1;">
                                            <strong style="color: #ffffff; font-size: 18px; font-weight: 700;">Froit - Soluciones IA</strong><br>
                                            <span style="color: #94a3b8;">Tu partner en transformación digital</span><br><br>
                                            <a href="tel:+1234567890" style="color: #c7d2fe; text-decoration: none; font-weight: 500;">+1 (234) 567-890</a> | 
                                            <a href="mailto:hola@froit.com" style="color: #c7d2fe; text-decoration: none; font-weight: 500;">hola@froit.com</a><br>
                                            <a href="https://froit.com" style="color: #a5b4fc; text-decoration: none; font-weight: 600;">www.froit.com</a>
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Unsubscribe -->
                                <tr>
                                    <td align="center" style="padding-top: 24px; border-top: 1px solid #334155;">
                                        <p style="margin: 0; font-size: 13px; line-height: 24px; color: #64748b;">
                                            Recibiste este email porque estás suscrito a nuestro newsletter de Froit.<br>
                                            <a href="https://froit.com/preferencias" style="color: #94a3b8; text-decoration: underline; font-weight: 500;">Gestionar preferencias</a> | 
                                            <a href="https://froit.com/unsub" style="color: #94a3b8; text-decoration: underline; font-weight: 500;">Cancelar suscripción</a>
                                        </p>
                                    </td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                    
                </table>
                <!-- Fin Container principal -->
                
            </td>
        </tr>
    </table>
    <!-- Fin Wrapper principal -->
    
</body>
</html>


`;
};
