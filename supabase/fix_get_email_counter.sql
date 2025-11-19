-- Corrección de la función get_email_counter_today()
-- Este archivo corrige el error de ambigüedad en la columna "fecha"
-- Ejecutar en Supabase SQL Editor

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

-- Comentario
COMMENT ON FUNCTION get_email_counter_today() IS 'Obtiene el contador de emails del día actual con límite de 300';
