# 🚀 Guía Rápida - Sistema de Email Marketing con Supabase

## ✅ Pasos de Configuración (5 minutos)

### 1️⃣ Configurar Supabase

```bash
# 1. Ve a https://supabase.com y crea un nuevo proyecto
# 2. Copia la URL y la ANON KEY del proyecto
# 3. En el SQL Editor de Supabase, ejecuta:
```

**Ejecutar en orden:**
- `supabase/setup_email_marketing.sql` (estructura de base de datos)
- `supabase/seed_email_marketing.sql` (datos de prueba - opcional)

### 2️⃣ Configurar Brevo (SendinBlue)

```bash
# 1. Crea una cuenta en https://app.brevo.com (300 emails/día gratis)
# 2. Verifica el dominio comercial@froit.com.ar en Settings > Senders
# 3. Obtén tu API Key en Settings > API Keys
```

### 3️⃣ Variables de Entorno

Crea `.env.local` basado en `.env.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON=tu_anon_key_aqui

# Brevo
BREVO_API_KEY=tu_brevo_api_key_aqui
BREVO_SENDER_EMAIL=comercial@froit.com.ar
BREVO_SENDER_NAME=Froit - Automatización con IA

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4️⃣ Configurar Webhook en Brevo

1. Ve a **Brevo > Settings > Webhooks**
2. Crea un nuevo webhook con:
   - **URL**: `https://tu-dominio.com/api/mailMarketing` (en producción)
   - **Eventos**: Selecciona todos (delivered, opened, clicked, bounce, spam, unsubscribe)
3. Guarda el webhook

### 5️⃣ Instalar Dependencias

```bash
npm install
# Ya instaladas: @supabase/supabase-js, xlsx, react-hot-toast
```

### 6️⃣ Iniciar Aplicación

```bash
npm run dev
# Visita: http://localhost:3000/marketing
```

---

## 📋 Uso del Sistema

### ✉️ Crear una Campaña

1. **Ir a**: `/marketing`
2. **Click**: "Nueva Campaña"
3. **Completar**:
   - Nombre de campaña (ej: "Lanzamiento Producto X")
   - Asunto del email
   - Contenido (HTML opcional, usa plantilla por defecto)
4. **Subir Excel**: Formato requerido:
   ```
   | email                  | nombre         |
   |------------------------|----------------|
   | juan@example.com       | Juan Pérez     |
   | maria@example.com      | María González |
   ```
5. **Crear Campaña**: Se guardará como borrador

### 🚀 Enviar Campaña

1. **Vista Campañas**: Busca tu campaña
2. **Click**: Botón "Enviar" (icono de avión)
3. **Confirmación**: Se enviarán automáticamente
4. **Seguimiento**: Las métricas se actualizan en tiempo real

### 📊 Ver Estadísticas

- **Vista Estadísticas**: Muestra:
  - Total enviados
  - Tasa de apertura
  - Tasa de clicks
  - Bounces
  - Gráficos de rendimiento

### 👥 Gestionar Contactos

- **Ver todos los contactos**
- **Buscar por email/nombre**
- **Eliminar contactos**
- **Ver origen** (Excel o Manual)

---

## 🔧 Funcionalidades Implementadas

### ✅ Campañas
- ✅ Crear campaña con nombre, asunto y contenido
- ✅ Subir contactos desde Excel (.xlsx, .xls, .csv)
- ✅ Validación automática de emails
- ✅ Eliminación de duplicados
- ✅ Envío masivo con límite diario (300/día)
- ✅ Estados: borrador, enviando, completada
- ✅ Eliminar campañas

### ✅ Contactos
- ✅ Import desde Excel automático
- ✅ Validación de formato de email
- ✅ Estados: activo, inactivo, bounce
- ✅ Búsqueda por email/nombre
- ✅ Eliminación de contactos
- ✅ Origen: excel_import, manual

### ✅ Tracking en Tiempo Real
- ✅ Webhook de Brevo configurado
- ✅ Eventos rastreados:
  - ✅ Delivered (entregado)
  - ✅ Opened (abierto)
  - ✅ Clicked (click en enlaces)
  - ✅ Bounce (rebotado)
  - ✅ Spam (marcado como spam)
  - ✅ Unsubscribe (desuscrito)
- ✅ Actualización automática de métricas
- ✅ Suscripciones en tiempo real (Supabase Realtime)

### ✅ Métricas
- ✅ Tasa de apertura
- ✅ Tasa de clicks
- ✅ Bounces
- ✅ Gráficos visuales
- ✅ Métricas globales y por campaña
- ✅ Top contactos más activos

### ✅ Seguridad
- ✅ Row Level Security en Supabase
- ✅ Validación de emails
- ✅ Límite diario de envíos
- ✅ Contador de emails por día

---

## 📁 Estructura de Archivos

```
Projecto Froit/
├── src/
│   ├── app/
│   │   ├── marketing/
│   │   │   ├── page.js              # ⭐ Página principal del sistema
│   │   │   └── emailTemplate.js     # Plantilla HTML de emails
│   │   └── api/
│   │       ├── mailMarketing/
│   │       │   └── route.js         # Webhook de Brevo
│   │       └── sendEmailBrevo/
│   │           └── route.js         # API de envío de emails
│   └── lib/
│       └── supabase.js              # Cliente de Supabase
├── supabase/
│   ├── setup_email_marketing.sql    # ⭐ Esquema de base de datos
│   └── seed_email_marketing.sql     # Datos de prueba
├── .env.example                     # Variables de entorno
└── EMAIL_MARKETING_SETUP.md         # Documentación completa
```

---

## 🎯 Flujo de Trabajo Típico

```
1. Usuario crea campaña
   └─> Se inserta en email_campaigns (estado: borrador)
   
2. Usuario sube Excel con contactos
   └─> Se extraen emails válidos
   └─> Se insertan en email_contacts (upsert)
   └─> Se crean registros en email_sends (estado: pendiente)
   
3. Usuario envía campaña
   └─> Se consulta email_daily_counter (límite: 300/día)
   └─> Se envían emails vía Brevo API
   └─> Se actualiza estado a "enviado"
   └─> Se incrementa contador diario
   
4. Brevo envía webhooks
   └─> Evento "delivered" → actualiza sent_at
   └─> Evento "opened" → actualiza opened_at, open_count
   └─> Evento "clicked" → actualiza clicked_at, click_count
   └─> Se ejecutan triggers para actualizar métricas
   
5. Usuario ve estadísticas en tiempo real
   └─> Supabase Realtime actualiza la UI automáticamente
```

---

## 🧪 Testing

### Probar con Datos de Demo

```sql
-- Ejecuta en Supabase SQL Editor:
\i supabase/seed_email_marketing.sql
```

Esto creará:
- 10 contactos de prueba
- 3 plantillas de email
- 1 campaña de ejemplo con métricas simuladas

### Verificar Instalación

```bash
# 1. Verificar conexión a Supabase
# En consola del navegador (http://localhost:3000/marketing):
const { data, error } = await supabaseClient.from('email_campaigns').select('count')
console.log(data)

# 2. Verificar API de envío
curl -X POST http://localhost:3000/api/sendEmailBrevo \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test",
    "htmlContent": "<p>Test email</p>"
  }'

# 3. Verificar webhook
curl -X GET http://localhost:3000/api/mailMarketing
# Debe retornar: {"status":"ok","service":"Email Marketing Webhook"}
```

---

## ⚠️ Troubleshooting

### Error: "Module not found: xlsx"
```bash
npm install xlsx
```

### Error: "Supabase URL is required"
```bash
# Verifica que .env.local tenga:
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON=eyJ...
```

### Error: "Brevo API Key is invalid"
```bash
# Verifica en Brevo > Settings > API Keys
# Copia la key completa (comienza con xkeysib-)
BREVO_API_KEY=xkeysib-xxxxxxxxxxxx
```

### Emails no se envían
```bash
# 1. Verifica límite diario:
SELECT * FROM email_daily_counter WHERE fecha = CURRENT_DATE;

# 2. Verifica emails pendientes:
SELECT * FROM email_sends WHERE estado = 'pendiente';

# 3. Revisa logs en consola del navegador
```

### Métricas no se actualizan
```bash
# 1. Verifica que el webhook esté configurado en Brevo
# 2. En producción, usa HTTPS (no HTTP)
# 3. Verifica logs del webhook:
SELECT * FROM email_sends ORDER BY updated_at DESC LIMIT 10;
```

---

## 🎉 ¡Todo Listo!

Tu sistema de email marketing está 100% funcional con:

✅ Base de datos Supabase completa
✅ Integración con Brevo (300 emails/día gratis)
✅ Tracking en tiempo real
✅ Importación de contactos desde Excel
✅ Métricas y estadísticas detalladas
✅ UI moderna y responsiva

**Accede a**: `http://localhost:3000/marketing`

---

## 📞 Soporte

Si tienes problemas, revisa:
1. `EMAIL_MARKETING_SETUP.md` (documentación completa)
2. Logs en consola del navegador
3. Logs en Supabase Dashboard
4. Logs en Brevo Dashboard

**Remitente configurado**: `comercial@froit.com.ar`
