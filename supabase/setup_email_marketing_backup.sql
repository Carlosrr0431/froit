-- ================================================
-- SISTEMA DE EMAIL MARKETING PARA FROIT
-- ================================================
-- Archivo: setup_email_marketing.sql
-- Descripción: Configuración completa de tablas para email marketing
-- Fecha: Noviembre 2025
-- ================================================

-- 1. TABLA: email_contacts
-- Almacena todos los contactos de email marketing
DROP TABLE IF EXISTS email_contacts CASCADE;

CREATE TABLE email_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nombre TEXT,
    estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'bounce', 'spam', 'unsubscribed')),
    origen TEXT DEFAULT 'manual' CHECK (origen IN ('excel_import', 'manual', 'api', 'landing')),
    telefono TEXT,
    empresa TEXT,
    tags TEXT[],
    
    -- Métricas del contacto
    total_emails_recibidos INTEGER DEFAULT 0,
    total_emails_abiertos INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_bounces INTEGER DEFAULT 0,
    total_spam_reports INTEGER DEFAULT 0,
    
    -- Metadatos
    ultima_actividad TIMESTAMPTZ,
    fecha_suscripcion TIMESTAMPTZ DEFAULT NOW(),
    fecha_baja TIMESTAMPTZ,
    ip_suscripcion TEXT,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para email_contacts
CREATE INDEX idx_email_contacts_email ON email_contacts(email);
CREATE INDEX idx_email_contacts_estado ON email_contacts(estado);
CREATE INDEX idx_email_contacts_origen ON email_contacts(origen);
CREATE INDEX idx_email_contacts_created_at ON email_contacts(created_at DESC);

-- Comentarios
COMMENT ON TABLE email_contacts IS 'Contactos para campañas de email marketing';
COMMENT ON COLUMN email_contacts.estado IS 'Estado del contacto: activo, inactivo, bounce, spam, unsubscribed';
COMMENT ON COLUMN email_contacts.origen IS 'Origen del contacto: excel_import, manual, api, landing';


-- 2. TABLA: email_campaigns
-- Almacena las campañas de email marketing
DROP TABLE IF EXISTS email_campaigns CASCADE;

CREATE TABLE email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    asunto TEXT NOT NULL,
    contenido TEXT NOT NULL,
    
    -- Configuración
    estado TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviando', 'completada', 'pausada', 'cancelada', 'programada')),
    tipo TEXT DEFAULT 'promocional' CHECK (tipo IN ('promocional', 'transaccional', 'newsletter', 'remarketing')),
    prioridad TEXT DEFAULT 'normal' CHECK (prioridad IN ('baja', 'normal', 'alta', 'urgente')),
    
    -- Remitente
    email_remitente TEXT DEFAULT 'comercial@froit.com.ar',
    nombre_remitente TEXT DEFAULT 'Froit',
    
    -- Programación
    programada_para TIMESTAMPTZ,
    fecha_envio TIMESTAMPTZ,
    fecha_completada TIMESTAMPTZ,
    
    -- Estadísticas (calculadas desde email_sends)
    total_destinatarios INTEGER DEFAULT 0,
    enviados INTEGER DEFAULT 0,
    abiertos INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    bounces INTEGER DEFAULT 0,
    spam_reports INTEGER DEFAULT 0,
    fallidos INTEGER DEFAULT 0,
    
    -- Métricas calculadas
    tasa_apertura DECIMAL(5,2),
    tasa_click DECIMAL(5,2),
    tasa_bounce DECIMAL(5,2),
    
    -- Remarketing
    campaña_padre_id UUID REFERENCES email_campaigns(id) ON DELETE SET NULL,
    tipo_remarketing TEXT CHECK (tipo_remarketing IN ('no-abierto', 'sin-click', 'abandonados')),
    dias_espera_remarketing INTEGER DEFAULT 7,
    ultimo_envio_masivo TIMESTAMPTZ,
    
    -- Metadatos
    etiquetas TEXT[],
    notas TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para email_campaigns
CREATE INDEX idx_email_campaigns_estado ON email_campaigns(estado);
CREATE INDEX idx_email_campaigns_tipo ON email_campaigns(tipo);
CREATE INDEX idx_email_campaigns_created_at ON email_campaigns(created_at DESC);
CREATE INDEX idx_email_campaigns_programada_para ON email_campaigns(programada_para);
CREATE INDEX idx_email_campaigns_padre ON email_campaigns(campaña_padre_id);

-- Comentarios
COMMENT ON TABLE email_campaigns IS 'Campañas de email marketing de Froit';
COMMENT ON COLUMN email_campaigns.estado IS 'Estado: borrador, enviando, completada, pausada, cancelada, programada';
COMMENT ON COLUMN email_campaigns.tipo_remarketing IS 'Tipo: no-abierto, sin-click, abandonados';


-- 3. TABLA: email_sends
-- Registro individual de cada email enviado
DROP TABLE IF EXISTS email_sends CASCADE;

CREATE TABLE email_sends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES email_contacts(id) ON DELETE CASCADE,
    
    -- Destinatario
    email TEXT NOT NULL,
    nombre_destinatario TEXT,
    
    -- Estado del envío
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviado', 'fallido', 'bounce', 'spam')),
    
    -- Tracking de Brevo
    brevo_message_id TEXT,
    brevo_event_id TEXT,
    
    -- Métricas de apertura
    abierto BOOLEAN DEFAULT FALSE,
    fecha_apertura TIMESTAMPTZ,
    cantidad_aperturas INTEGER DEFAULT 0,
    ultima_apertura TIMESTAMPTZ,
    
    -- Métricas de clicks
    click BOOLEAN DEFAULT FALSE,
    fecha_primer_click TIMESTAMPTZ,
    cantidad_clicks INTEGER DEFAULT 0,
    ultimo_click TIMESTAMPTZ,
    urls_clickeadas TEXT[],
    
    -- Problemas
    bounce BOOLEAN DEFAULT FALSE,
    bounce_type TEXT CHECK (bounce_type IN ('hard', 'soft', 'blocked')),
    fecha_bounce TIMESTAMPTZ,
    bounce_reason TEXT,
    
    spam_report BOOLEAN DEFAULT FALSE,
    fecha_spam_report TIMESTAMPTZ,
    
    unsubscribed BOOLEAN DEFAULT FALSE,
    fecha_unsubscribe TIMESTAMPTZ,
    
    -- Información del envío
    fecha_envio TIMESTAMPTZ,
    error_mensaje TEXT,
    
    -- Datos de tracking
    ip_apertura TEXT,
    user_agent_apertura TEXT,
    dispositivo TEXT,
    navegador TEXT,
    sistema_operativo TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para email_sends
CREATE INDEX idx_email_sends_campaign ON email_sends(campaign_id);
CREATE INDEX idx_email_sends_contact ON email_sends(contact_id);
CREATE INDEX idx_email_sends_email ON email_sends(email);
CREATE INDEX idx_email_sends_estado ON email_sends(estado);
CREATE INDEX idx_email_sends_abierto ON email_sends(abierto);
CREATE INDEX idx_email_sends_click ON email_sends(click);
CREATE INDEX idx_email_sends_bounce ON email_sends(bounce);
CREATE INDEX idx_email_sends_brevo_message_id ON email_sends(brevo_message_id);
CREATE INDEX idx_email_sends_fecha_envio ON email_sends(fecha_envio DESC);

-- Comentarios
COMMENT ON TABLE email_sends IS 'Registro individual de emails enviados con tracking completo';
COMMENT ON COLUMN email_sends.bounce_type IS 'Tipo de bounce: hard (permanente), soft (temporal), blocked';


-- 4. TABLA: email_daily_counter
-- Contador diario de emails enviados (límite Brevo)
DROP TABLE IF EXISTS email_daily_counter CASCADE;

CREATE TABLE email_daily_counter (
    fecha DATE PRIMARY KEY DEFAULT CURRENT_DATE,
    emails_enviados INTEGER DEFAULT 0,
    limite_diario INTEGER DEFAULT 300,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_email_daily_counter_fecha ON email_daily_counter(fecha DESC);

-- Comentarios
COMMENT ON TABLE email_daily_counter IS 'Contador diario de emails para respetar límite de Brevo (300/día)';


-- 5. TABLA: email_templates
-- Plantillas HTML reutilizables
DROP TABLE IF EXISTS email_templates CASCADE;

CREATE TABLE email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    tipo TEXT DEFAULT 'promocional' CHECK (tipo IN ('promocional', 'transaccional', 'newsletter', 'notificacion')),
    
    -- Contenido
    html_contenido TEXT NOT NULL,
    texto_plano TEXT,
    
    -- Variables disponibles
    variables JSONB, -- Ejemplo: {"nombre": "string", "producto": "string", "precio": "number"}
    
    -- Configuración
    activo BOOLEAN DEFAULT TRUE,
    es_predeterminada BOOLEAN DEFAULT FALSE,
    
    -- Uso
    veces_usada INTEGER DEFAULT 0,
    ultima_vez_usada TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_email_templates_tipo ON email_templates(tipo);
CREATE INDEX idx_email_templates_activo ON email_templates(activo);

-- Comentarios
COMMENT ON TABLE email_templates IS 'Plantillas HTML reutilizables para campañas';


-- ================================================
-- FUNCIONES Y TRIGGERS
-- ================================================

-- Función: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_email_contacts_updated_at BEFORE UPDATE ON email_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_sends_updated_at BEFORE UPDATE ON email_sends
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_daily_counter_updated_at BEFORE UPDATE ON email_daily_counter
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Función: Obtener contador diario de emails
CREATE OR REPLACE FUNCTION get_email_counter_today()
RETURNS TABLE (
    fecha DATE,
    emails_enviados INTEGER,
    limite_diario INTEGER,
    emails_disponibles INTEGER,
    porcentaje_usado DECIMAL(5,2)
) AS $$
DECLARE
    v_fecha DATE := CURRENT_DATE;
    v_enviados INTEGER;
    v_limite INTEGER := 300;
BEGIN
    -- Buscar o crear registro de hoy
    INSERT INTO email_daily_counter (fecha, emails_enviados, limite_diario)
    VALUES (v_fecha, 0, v_limite)
    ON CONFLICT (fecha) DO NOTHING;
    
    -- Obtener datos
    SELECT edc.emails_enviados, edc.limite_diario
    INTO v_enviados, v_limite
    FROM email_daily_counter edc
    WHERE edc.fecha = v_fecha;
    
    -- Retornar resultado
    RETURN QUERY
    SELECT 
        v_fecha,
        v_enviados,
        v_limite,
        (v_limite - v_enviados) as emails_disponibles,
        ROUND((v_enviados::DECIMAL / v_limite::DECIMAL) * 100, 2) as porcentaje_usado;
END;
$$ LANGUAGE plpgsql;

-- Comentario
COMMENT ON FUNCTION get_email_counter_today() IS 'Obtiene el contador de emails del día actual con límite de 300';


-- Función: Incrementar contador diario
CREATE OR REPLACE FUNCTION increment_email_counter(cantidad INTEGER DEFAULT 1)
RETURNS VOID AS $$
DECLARE
    v_fecha DATE := CURRENT_DATE;
BEGIN
    INSERT INTO email_daily_counter (fecha, emails_enviados, limite_diario)
    VALUES (v_fecha, cantidad, 300)
    ON CONFLICT (fecha) 
    DO UPDATE SET 
        emails_enviados = email_daily_counter.emails_enviados + cantidad,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;


-- Función: Actualizar métricas de campaña desde email_sends
CREATE OR REPLACE FUNCTION update_campaign_metrics(p_campaign_id UUID)
RETURNS VOID AS $$
DECLARE
    v_enviados INTEGER;
    v_abiertos INTEGER;
    v_clicks INTEGER;
    v_bounces INTEGER;
    v_spam INTEGER;
    v_fallidos INTEGER;
    v_total INTEGER;
BEGIN
    -- Contar métricas desde email_sends
    SELECT 
        COUNT(*) FILTER (WHERE estado = 'enviado'),
        COUNT(*) FILTER (WHERE abierto = TRUE),
        COUNT(*) FILTER (WHERE click = TRUE),
        COUNT(*) FILTER (WHERE bounce = TRUE),
        COUNT(*) FILTER (WHERE spam_report = TRUE),
        COUNT(*) FILTER (WHERE estado = 'fallido'),
        COUNT(*)
    INTO v_enviados, v_abiertos, v_clicks, v_bounces, v_spam, v_fallidos, v_total
    FROM email_sends
    WHERE campaign_id = p_campaign_id;
    
    -- Actualizar campaña
    UPDATE email_campaigns
    SET 
        enviados = v_enviados,
        abiertos = v_abiertos,
        clicks = v_clicks,
        bounces = v_bounces,
        spam_reports = v_spam,
        fallidos = v_fallidos,
        tasa_apertura = CASE WHEN v_enviados > 0 THEN ROUND((v_abiertos::DECIMAL / v_enviados::DECIMAL) * 100, 2) ELSE 0 END,
        tasa_click = CASE WHEN v_abiertos > 0 THEN ROUND((v_clicks::DECIMAL / v_abiertos::DECIMAL) * 100, 2) ELSE 0 END,
        tasa_bounce = CASE WHEN v_enviados > 0 THEN ROUND((v_bounces::DECIMAL / v_enviados::DECIMAL) * 100, 2) ELSE 0 END,
        updated_at = NOW()
    WHERE id = p_campaign_id;
END;
$$ LANGUAGE plpgsql;

-- Comentario
COMMENT ON FUNCTION update_campaign_metrics(UUID) IS 'Actualiza las métricas de una campaña basándose en email_sends';


-- Función: Actualizar métricas de contacto
CREATE OR REPLACE FUNCTION update_contact_metrics(p_contact_id UUID)
RETURNS VOID AS $$
DECLARE
    v_recibidos INTEGER;
    v_abiertos INTEGER;
    v_clicks INTEGER;
    v_bounces INTEGER;
    v_spam INTEGER;
BEGIN
    -- Contar métricas
    SELECT 
        COUNT(*) FILTER (WHERE estado = 'enviado'),
        COUNT(*) FILTER (WHERE abierto = TRUE),
        COUNT(*) FILTER (WHERE click = TRUE),
        COUNT(*) FILTER (WHERE bounce = TRUE),
        COUNT(*) FILTER (WHERE spam_report = TRUE)
    INTO v_recibidos, v_abiertos, v_clicks, v_bounces, v_spam
    FROM email_sends
    WHERE contact_id = p_contact_id;
    
    -- Actualizar contacto
    UPDATE email_contacts
    SET 
        total_emails_recibidos = v_recibidos,
        total_emails_abiertos = v_abiertos,
        total_clicks = v_clicks,
        total_bounces = v_bounces,
        total_spam_reports = v_spam,
        ultima_actividad = (
            SELECT MAX(GREATEST(fecha_apertura, ultimo_click, fecha_envio))
            FROM email_sends
            WHERE contact_id = p_contact_id
        ),
        updated_at = NOW()
    WHERE id = p_contact_id;
END;
$$ LANGUAGE plpgsql;

-- Comentario
COMMENT ON FUNCTION update_contact_metrics(UUID) IS 'Actualiza las métricas de un contacto';


-- ================================================
-- VISTAS ÚTILES
-- ================================================

-- Vista: Resumen de campañas
CREATE OR REPLACE VIEW v_campaigns_summary AS
SELECT 
    c.id,
    c.nombre,
    c.asunto,
    c.estado,
    c.tipo,
    c.email_remitente,
    c.total_destinatarios,
    c.enviados,
    c.abiertos,
    c.clicks,
    c.bounces,
    c.spam_reports,
    c.fallidos,
    c.tasa_apertura,
    c.tasa_click,
    c.tasa_bounce,
    c.fecha_envio,
    c.created_at,
    -- Engagement score (0-100)
    ROUND(
        (COALESCE(c.tasa_apertura, 0) * 0.4) +
        (COALESCE(c.tasa_click, 0) * 2 * 0.4) +
        ((100 - COALESCE(c.tasa_bounce, 0)) * 0.2)
    , 2) as engagement_score
FROM email_campaigns c
ORDER BY c.created_at DESC;

-- Comentario
COMMENT ON VIEW v_campaigns_summary IS 'Resumen de campañas con score de engagement';


-- Vista: Top contactos activos
CREATE OR REPLACE VIEW v_top_contacts AS
SELECT 
    id,
    email,
    nombre,
    estado,
    total_emails_recibidos,
    total_emails_abiertos,
    total_clicks,
    CASE 
        WHEN total_emails_recibidos > 0 
        THEN ROUND((total_emails_abiertos::DECIMAL / total_emails_recibidos::DECIMAL) * 100, 2)
        ELSE 0 
    END as tasa_apertura_personal,
    CASE 
        WHEN total_emails_abiertos > 0 
        THEN ROUND((total_clicks::DECIMAL / total_emails_abiertos::DECIMAL) * 100, 2)
        ELSE 0 
    END as tasa_click_personal,
    ultima_actividad
FROM email_contacts
WHERE estado = 'activo'
    AND total_emails_recibidos > 0
ORDER BY total_emails_abiertos DESC, total_clicks DESC
LIMIT 100;

-- Comentario
COMMENT ON VIEW v_top_contacts IS 'Top 100 contactos más activos';


-- ================================================
-- DATOS INICIALES
-- ================================================

-- Insertar plantilla HTML por defecto de Froit
INSERT INTO email_templates (nombre, descripcion, tipo, html_contenido, texto_plano, es_predeterminada, variables)
VALUES (
    'Plantilla Froit - Promocional',
    'Plantilla principal para campañas promocionales de Froit',
    'promocional',
    '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{asunto}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🚀 Froit</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Automatiza tu negocio con IA</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Hola {{nombre}},
                            </p>
                            <div style="color: #555555; font-size: 15px; line-height: 1.8;">
                                {{contenido}}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 30px 40px 30px; text-align: center;">
                            <a href="{{enlace}}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: bold; font-size: 16px;">
                                {{texto_boton}}
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                                © 2025 Froit - Automatización con IA
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0;">
                                <a href="{{link_unsub}}" style="color: #999999; text-decoration: underline;">Darse de baja</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>',
    'Hola {{nombre}}, {{contenido}} {{texto_boton}}: {{enlace}}',
    TRUE,
    '{"nombre": "Nombre del destinatario", "contenido": "Cuerpo del mensaje", "enlace": "URL del botón", "texto_boton": "Texto del botón", "link_unsub": "Link para darse de baja"}'::jsonb
);


-- ================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE email_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_daily_counter ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Políticas: Permitir todo para usuarios autenticados (ajustar según necesidad)
CREATE POLICY "Permitir todo a usuarios autenticados" ON email_contacts FOR ALL USING (true);
CREATE POLICY "Permitir todo a usuarios autenticados" ON email_campaigns FOR ALL USING (true);
CREATE POLICY "Permitir todo a usuarios autenticados" ON email_sends FOR ALL USING (true);
CREATE POLICY "Permitir todo a usuarios autenticados" ON email_daily_counter FOR ALL USING (true);
CREATE POLICY "Permitir todo a usuarios autenticados" ON email_templates FOR ALL USING (true);


-- ================================================
-- GRANTS DE PERMISOS
-- ================================================

-- Permisos para anon y authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;


-- ================================================
-- FIN DEL SCRIPT
-- ================================================

-- Verificación
SELECT 'Setup de Email Marketing para Froit completado exitosamente!' as mensaje;
