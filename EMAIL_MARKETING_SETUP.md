# 📧 Sistema de Email Marketing - Froit

## 🚀 Configuración Completa

### 1. Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON=tu_anon_key_aqui

# Brevo API
BREVO_API_KEY=tu_api_key_de_brevo_aqui
BREVO_WEBHOOK_SECRET=opcional_para_validar_webhooks
```

### 2. Configurar Base de Datos en Supabase

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Abre el **SQL Editor**
3. Ejecuta el archivo `supabase/setup_email_marketing.sql`
4. Verifica que se crearon todas las tablas:
   - `email_contacts`
   - `email_campaigns`
   - `email_sends`
   - `email_daily_counter`
   - `email_templates`

### 3. Configurar Brevo (SendinBlue)

#### Paso 1: Crear cuenta en Brevo
1. Regístrate en [Brevo](https://www.brevo.com)
2. Verifica tu email
3. Plan gratuito: 300 emails/día

#### Paso 2: Obtener API Key
1. Ve a **Settings** → **SMTP & API**
2. Crea una nueva **API Key**
3. Copia la key y agrégala a `.env.local`

#### Paso 3: Verificar dominio de remitente
1. Ve a **Senders**
2. Agrega `comercial@froit.com.ar`
3. Verifica el dominio siguiendo las instrucciones de Brevo

#### Paso 4: Configurar Webhook
1. Ve a **Settings** → **Webhooks**
2. Crea un nuevo webhook con esta URL:
   ```
   https://www.froit.com.ar/api/mailMarketing
   ```
3. Selecciona estos eventos:
   - ✅ Email delivered
   - ✅ Email opened
   - ✅ Link clicked
   - ✅ Hard bounce
   - ✅ Soft bounce
   - ✅ Spam complaint
   - ✅ Unsubscribed

### 4. Probar el Sistema

#### Verificar que las APIs están activas:

```bash
# Verificar API de envío
curl https://www.froit.com.ar/api/sendEmailBrevo

# Verificar webhook
curl https://www.froit.com.ar/api/mailMarketing
```

#### Enviar un email de prueba:

```javascript
fetch('/api/sendEmailBrevo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'test@example.com',
    subject: 'Test desde Froit',
    htmlContent: '<h1>Hola!</h1><p>Email de prueba</p>',
    tags: ['test', 'campaign-123']
  })
})
```

### 5. Usar el Sistema

#### Acceder al Dashboard:
```
https://www.froit.com.ar/marketing
```

#### Crear una campaña:
1. Click en "Nueva Campaña"
2. Completa nombre y asunto
3. Carga un archivo Excel con emails
4. Click en "Crear Campaña"
5. Envía la campaña desde la lista

#### Formato del Excel:
El archivo puede tener cualquier estructura. El sistema detecta automáticamente las columnas con emails.

Ejemplo:
```
Nombre          | Email                    | Empresa
----------------|--------------------------|----------
Juan Pérez      | juan@example.com         | ABC Corp
María González  | maria@example.com        | XYZ Ltd
```

### 6. Métricas en Tiempo Real

El webhook de Brevo actualiza automáticamente:
- ✅ Emails entregados
- 👀 Aperturas (con dispositivo, navegador, SO)
- 🖱️ Clicks (con URLs clickeadas)
- 🚫 Bounces (hard/soft)
- ⚠️ Reportes de spam
- 👋 Unsubscribes

### 7. Funciones Útiles de Supabase

#### Obtener contador diario:
```sql
SELECT * FROM get_email_counter_today();
```

#### Actualizar métricas de una campaña:
```sql
SELECT update_campaign_metrics('uuid-de-campaña');
```

#### Ver top contactos:
```sql
SELECT * FROM v_top_contacts LIMIT 10;
```

### 8. Límites y Consideraciones

- **Brevo Free**: 300 emails/día
- **Contador automático**: Se incrementa al enviar
- **Tracking**: 100% automático vía webhook
- **Almacenamiento**: Ilimitado en Supabase (plan free: 500MB)

### 9. Estructura de Archivos

```
Projecto Froit/
├── src/
│   └── app/
│       ├── marketing/
│       │   ├── page.js              # Dashboard principal
│       │   └── emailTemplate.js     # Plantilla HTML
│       └── api/
│           ├── mailMarketing/
│           │   └── route.js         # Webhook Brevo
│           └── sendEmailBrevo/
│               └── route.js         # API envío emails
├── supabase/
│   └── setup_email_marketing.sql    # Setup BD
└── .env.local                       # Variables de entorno
```

### 10. Soporte y Troubleshooting

#### Problema: No se envían emails
- ✅ Verifica que BREVO_API_KEY esté configurada
- ✅ Verifica que el dominio esté verificado en Brevo
- ✅ Revisa la consola de Next.js para errores

#### Problema: No se actualizan métricas
- ✅ Verifica que el webhook esté configurado correctamente
- ✅ Asegúrate que la URL sea accesible públicamente
- ✅ Revisa los logs del webhook en `/api/mailMarketing`

#### Problema: Emails van a spam
- ✅ Verifica SPF, DKIM, DMARC en tu dominio
- ✅ Usa Brevo's domain authentication
- ✅ Evita palabras spam en asunto/contenido

### 11. Próximos Pasos

- [ ] Personalizar plantilla HTML
- [ ] Crear segmentos de contactos
- [ ] Configurar campañas automatizadas
- [ ] Implementar A/B testing
- [ ] Agregar más plantillas

---

## 📞 Contacto

Para soporte: comercial@froit.com.ar

---

**Creado con ❤️ por el equipo de Froit**
