-- ============================================
-- CORRECCIÓN COMPLETA DE FUNCIONES
-- Ejecutar este script completo en Supabase
-- ============================================

-- 1. Función: Obtener contador diario de emails (CORREGIDA)
DROP FUNCTION IF EXISTS get_email_counter_today();

CREATE OR REPLACE FUNCTION get_email_counter_today()
RETURNS TABLE (
    fecha_hoy DATE,
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
    INSERT INTO froit_email_daily_counter (fecha, emails_enviados, limite_diario)
    VALUES (v_fecha, 0, v_limite)
    ON CONFLICT (fecha) DO NOTHING;
    
    -- Obtener datos
    SELECT edc.emails_enviados, edc.limite_diario
    INTO v_enviados, v_limite
    FROM froit_email_daily_counter edc
    WHERE edc.fecha = v_fecha;
    
    -- Retornar resultado con alias para evitar ambigüedad
    RETURN QUERY
    SELECT 
        v_fecha AS fecha_hoy,
        v_enviados AS emails_enviados,
        v_limite AS limite_diario,
        (v_limite - v_enviados) AS emails_disponibles,
        ROUND((v_enviados::DECIMAL / v_limite::DECIMAL) * 100, 2) AS porcentaje_usado;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_email_counter_today() IS 'Obtiene el contador de emails del día actual con límite de 300';


-- 2. Función: Incrementar contador diario
DROP FUNCTION IF EXISTS increment_email_counter(INTEGER);

CREATE OR REPLACE FUNCTION increment_email_counter(cantidad INTEGER DEFAULT 1)
RETURNS VOID AS $$
DECLARE
    v_fecha DATE := CURRENT_DATE;
BEGIN
    INSERT INTO froit_email_daily_counter (fecha, emails_enviados, limite_diario)
    VALUES (v_fecha, cantidad, 300)
    ON CONFLICT (fecha) 
    DO UPDATE SET 
        emails_enviados = froit_email_daily_counter.emails_enviados + cantidad,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION increment_email_counter(INTEGER) IS 'Incrementa el contador diario de emails';


-- 3. Función: Actualizar métricas de campaña desde email_sends
DROP FUNCTION IF EXISTS update_campaign_metrics(UUID);

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
        COUNT(*) FILTER (WHERE estado = 'error'),
        COUNT(*)
    INTO v_enviados, v_abiertos, v_clicks, v_bounces, v_spam, v_fallidos, v_total
    FROM froit_email_sends
    WHERE campaign_id = p_campaign_id;
    
    -- Actualizar campaña
    UPDATE froit_email_campaigns
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

COMMENT ON FUNCTION update_campaign_metrics(UUID) IS 'Actualiza las métricas de una campaña basándose en email_sends';


-- 4. Función: Actualizar métricas de contacto
DROP FUNCTION IF EXISTS update_contact_metrics(UUID);

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
    FROM froit_email_sends
    WHERE contact_id = p_contact_id;
    
    -- Actualizar contacto
    UPDATE froit_email_contacts
    SET 
        total_emails_recibidos = v_recibidos,
        total_emails_abiertos = v_abiertos,
        total_clicks = v_clicks,
        total_bounces = v_bounces,
        total_spam_reports = v_spam,
        ultima_actividad = (
            SELECT MAX(GREATEST(fecha_apertura, ultimo_click, fecha_envio))
            FROM froit_email_sends
            WHERE contact_id = p_contact_id
        ),
        updated_at = NOW()
    WHERE id = p_contact_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_contact_metrics(UUID) IS 'Actualiza las métricas de un contacto';


-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que todas las funciones se crearon correctamente
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'get_email_counter_today',
    'increment_email_counter',
    'update_campaign_metrics',
    'update_contact_metrics'
)
ORDER BY routine_name;
