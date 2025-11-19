-- ========================================
-- DATOS DE PRUEBA - EMAIL MARKETING
-- ========================================
-- Este script inserta datos de ejemplo para probar el sistema
-- NOTA: Ejecutar DESPUÉS de setup_email_marketing.sql

-- Limpiar datos existentes (solo en desarrollo)
-- TRUNCATE TABLE froit_froit_email_sends CASCADE;
-- TRUNCATE TABLE froit_froit_email_campaigns CASCADE;
-- TRUNCATE TABLE froit_froit_email_contacts CASCADE;
-- TRUNCATE TABLE froit_froit_email_templates CASCADE;
-- TRUNCATE TABLE froit_froit_email_daily_counter CASCADE;

-- ========================================
-- 1. INSERTAR CONTACTOS DE PRUEBA
-- ========================================
INSERT INTO froit_froit_email_contacts (email, nombre, estado, origen, metadata) VALUES
('juan.perez@example.com', 'Juan Pérez', 'activo', 'manual', '{"empresa": "Tech Corp", "cargo": "CEO"}'),
('maria.gonzalez@example.com', 'María González', 'activo', 'excel_import', '{"empresa": "Marketing Solutions", "cargo": "CMO"}'),
('pedro.lopez@example.com', 'Pedro López', 'activo', 'excel_import', '{"empresa": "Digital Agency", "cargo": "Director"}'),
('ana.martinez@example.com', 'Ana Martínez', 'activo', 'manual', '{"empresa": "Startup Inc", "cargo": "Founder"}'),
('carlos.rodriguez@example.com', 'Carlos Rodríguez', 'activo', 'excel_import', '{"empresa": "Consulting Firm", "cargo": "Partner"}'),
('lucia.fernandez@example.com', 'Lucía Fernández', 'activo', 'manual', '{"empresa": "E-commerce Plus", "cargo": "COO"}'),
('diego.sanchez@example.com', 'Diego Sánchez', 'inactivo', 'excel_import', '{"razon": "Se dio de baja", "fecha": "2024-01-15"}'),
('sofia.torres@example.com', 'Sofía Torres', 'activo', 'excel_import', '{"empresa": "Innovation Lab", "cargo": "CTO"}'),
('miguel.ramirez@example.com', 'Miguel Ramírez', 'activo', 'manual', '{"empresa": "Growth Agency", "cargo": "Manager"}'),
('laura.moreno@example.com', 'Laura Moreno', 'activo', 'excel_import', '{"empresa": "Creative Studio", "cargo": "Designer"}')
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- 2. INSERTAR PLANTILLAS DE PRUEBA
-- ========================================
INSERT INTO froit_froit_email_templates (nombre, asunto, contenido, categoria, variables_requeridas) VALUES
(
    'Plantilla: Bienvenida Froit',
    '🎉 ¡Bienvenido a Froit!',
    '<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;"><h1 style="color: white; margin: 0; font-size: 32px;">¡Bienvenido a Froit! 🚀</h1></div><div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><p style="font-size: 18px; color: #333;">Hola {{nombre}},</p><p style="color: #666; line-height: 1.6;">Gracias por unirte a Froit. Estamos emocionados de ayudarte a automatizar tu negocio con inteligencia artificial.</p><div style="margin: 30px 0;"><a href="https://froit.com.ar" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Comenzar Ahora</a></div><p style="color: #666; font-size: 14px; margin-top: 40px;">Si tienes preguntas, estamos aquí para ayudarte.</p></div></body></html>',
    'onboarding',
    '["nombre"]'
),
(
    'Plantilla: Newsletter Semanal',
    '📊 Tu Newsletter Semanal de Froit',
    '<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><h2 style="color: #667eea;">Newsletter Semanal</h2><p>Hola {{nombre}},</p><p>Aquí están las últimas novedades:</p><ul><li>Nueva funcionalidad de automatización</li><li>Casos de éxito de clientes</li><li>Tips para mejorar tu productividad</li></ul><a href="{{link}}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Leer Más</a></body></html>',
    'newsletter',
    '["nombre", "link"]'
),
(
    'Plantilla: Promoción Especial',
    '🔥 Oferta Especial Solo Por Hoy',
    '<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: #ff6b6b; color: white; padding: 30px; text-align: center; border-radius: 12px;"><h1 style="margin: 0;">🔥 OFERTA ESPECIAL 🔥</h1><p style="font-size: 24px; margin: 20px 0;">{{descuento}}% de descuento</p><p>Solo por tiempo limitado</p><a href="{{link_oferta}}" style="background: white; color: #ff6b6b; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 20px;">Aprovechar Oferta</a></div></body></html>',
    'promocion',
    '["descuento", "link_oferta"]'
)
ON CONFLICT (nombre) DO NOTHING;

-- ========================================
-- 3. INSERTAR CAMPAÑA DE PRUEBA
-- ========================================
DO $$
DECLARE
    nueva_campana_id INTEGER;
    contacto_record RECORD;
BEGIN
    -- Crear campaña
    INSERT INTO froit_froit_email_campaigns (
        nombre,
        asunto,
        contenido,
        estado,
        total_destinatarios,
        enviados,
        abiertos,
        clicks,
        bounces
    ) VALUES (
        'Campaña de Prueba - Lanzamiento Froit',
        '🚀 Automatiza tu negocio con IA',
        '<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;"><h1 style="color: white; margin: 0; font-size: 32px;">Automatiza tu Negocio 🚀</h1></div><div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><p style="font-size: 18px; color: #333;">Descubre el poder de la automatización con IA</p><div style="margin: 30px 0;"><h3 style="color: #667eea;">✨ Beneficios</h3><ul style="color: #666; line-height: 1.8;"><li>Ahorra hasta 10 horas semanales</li><li>Automatiza respuestas 24/7</li><li>Mejora la satisfacción del cliente</li><li>Aumenta tus ventas</li></ul></div><div style="text-align: center; margin: 30px 0;"><a href="https://froit.com.ar" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Comenzar Ahora</a></div></div></body></html>',
        'borrador',
        0,
        0,
        0,
        0,
        0
    ) RETURNING id INTO nueva_campana_id;

    -- Contar contactos activos
    UPDATE froit_froit_email_campaigns
    SET total_destinatarios = (SELECT COUNT(*) FROM froit_froit_email_contacts WHERE estado = 'activo')
    WHERE id = nueva_campana_id;

    -- Crear registros de envío para contactos activos
    FOR contacto_record IN SELECT * FROM froit_froit_email_contacts WHERE estado = 'activo' LOOP
        INSERT INTO froit_froit_email_sends (
            campaign_id,
            contact_id,
            email,
            estado
        ) VALUES (
            nueva_campana_id,
            contacto_record.id,
            contacto_record.email,
            'pendiente'
        );
    END LOOP;

    RAISE NOTICE 'Campaña de prueba creada con ID: %', nueva_campana_id;
END $$;

-- ========================================
-- 4. SIMULAR ALGUNAS MÉTRICAS
-- ========================================
-- Simular que algunos emails fueron enviados y abiertos
UPDATE froit_froit_email_sends
SET 
    estado = 'enviado',
    sent_at = NOW() - INTERVAL '2 days',
    brevo_message_id = 'test-' || id::text
WHERE campaign_id = (SELECT id FROM froit_froit_email_campaigns ORDER BY created_at DESC LIMIT 1)
  AND id % 3 = 0; -- Solo algunos

-- Simular aperturas
UPDATE froit_froit_email_sends
SET 
    opened_at = NOW() - INTERVAL '1 day',
    open_count = 1
WHERE estado = 'enviado'
  AND id % 2 = 0;

-- Simular clicks
UPDATE froit_froit_email_sends
SET 
    clicked_at = NOW() - INTERVAL '1 day',
    click_count = 1
WHERE opened_at IS NOT NULL
  AND id % 4 = 0;

-- Actualizar métricas de la campaña
SELECT update_campaign_metrics((SELECT id FROM froit_froit_email_campaigns ORDER BY created_at DESC LIMIT 1));

-- Actualizar métricas de contactos
DO $$
DECLARE
    contacto_id INTEGER;
BEGIN
    FOR contacto_id IN SELECT id FROM froit_froit_email_contacts LOOP
        PERFORM update_contact_metrics(contacto_id);
    END LOOP;
END $$;

-- ========================================
-- 5. VERIFICACIÓN
-- ========================================
SELECT 
    'Contactos insertados:' AS descripcion,
    COUNT(*) AS cantidad
FROM froit_froit_email_contacts

UNION ALL

SELECT 
    'Plantillas insertadas:' AS descripcion,
    COUNT(*) AS cantidad
FROM froit_froit_email_templates

UNION ALL

SELECT 
    'Campañas creadas:' AS descripcion,
    COUNT(*) AS cantidad
FROM froit_froit_email_campaigns

UNION ALL

SELECT 
    'Envíos programados:' AS descripcion,
    COUNT(*) AS cantidad
FROM froit_froit_email_sends;

-- Mostrar resumen de campaña de prueba
SELECT 
    c.nombre,
    c.asunto,
    c.estado,
    c.total_destinatarios,
    c.enviados,
    c.abiertos,
    c.clicks,
    CASE 
        WHEN c.enviados > 0 
        THEN ROUND((c.abiertos::NUMERIC / c.enviados) * 100, 1)
        ELSE 0 
    END AS tasa_apertura_pct,
    CASE 
        WHEN c.abiertos > 0 
        THEN ROUND((c.clicks::NUMERIC / c.abiertos) * 100, 1)
        ELSE 0 
    END AS tasa_click_pct
FROM froit_froit_email_campaigns c
ORDER BY c.created_at DESC
LIMIT 1;

-- ========================================
-- LISTO! 🎉
-- ========================================
-- Los datos de prueba han sido insertados exitosamente
-- Puedes comenzar a probar el sistema de email marketing
