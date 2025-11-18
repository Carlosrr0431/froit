# Sistema de Webhooks para WhatsApp - FroIT

Este módulo implementa un sistema completo de webhooks para procesar mensajes de WhatsApp usando WasenderAPI, con soporte para múltiples agentes, throttling de mensajes y almacenamiento en Supabase.

## 📁 Estructura de Archivos

```
src/
├── lib/
│   ├── messageThrottle.js          # Sistema de control de throttling para envíos
│   └── wasenderMessageHandler.js   # Procesamiento de mensajes de WasenderAPI
└── app/
    └── api/
        └── webhook/
            └── [agentCode]/
                └── route.js         # Endpoint del webhook por agente
```

## 🚀 Características

### 1. **Procesamiento de Mensajes**
- ✅ Procesa mensajes entrantes y salientes
- ✅ Soporte para múltiples tipos de medios (imágenes, documentos, audio, video, stickers)
- ✅ Desencriptación automática de medios de WhatsApp
- ✅ Almacenamiento en Supabase Storage
- ✅ Extracción de nombre de contacto automática
- ✅ Detección de mensajes de protocolo/sistema

### 2. **Sistema de Throttling**
- ⏰ Control de intervalos entre mensajes (20 segundos por defecto)
- 🔄 Cola de mensajes con procesamiento automático
- 🔁 Reintentos automáticos (hasta 3 intentos)
- 📊 Métricas de rendimiento en tiempo real
- ⏱️ Timeouts para detectar envíos colgados

### 3. **Almacenamiento**
- 💾 Guardado automático en Supabase
- 📁 Organización de medios por tipo (images, documents, audios, videos)
- 🔗 URLs públicas de Supabase Storage
- 🆔 Soporte para `sender_lid` de WhatsApp
- 👤 Persistencia de nombres de contacto

## 🔧 Configuración

### Variables de Entorno

Agrega las siguientes variables en tu archivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_key (opcional)

# OpenAI (opcional, para respuestas automáticas)
OPENAI_API_KEY=tu_openai_api_key

# WasenderAPI (opcional, key por defecto)
WASENDER_API_KEY=tu_wasender_api_key
```

### Instalación de Dependencias

```bash
npm install openai
# o
yarn add openai
# o
pnpm add openai
```

## 📡 Uso del Webhook

### Configurar Webhook en WasenderAPI

1. Ve a tu panel de WasenderAPI
2. Configura el webhook URL para tu agente:
   ```
   https://tu-dominio.com/api/webhook/[codigo-agente]
   ```
   Ejemplo:
   ```
   https://froit.com/api/webhook/agent_001
   ```

3. Selecciona el evento: `messages.upsert`

### Formato del Código de Agente

El código de agente debe estar registrado en tu tabla `agents` de Supabase con:
- `agent_code`: Código único del agente (ej: "agent_001", "FroIT_Support")
- `api_key`: API key de WasenderAPI del agente
- `session_id`: Session ID de WasenderAPI (opcional)
- `nombre_completo`: Nombre del agente
- `activo`: true

### Ejemplo de Configuración de Agente en Supabase

```sql
INSERT INTO agents (agent_code, api_key, session_id, nombre_completo, activo)
VALUES (
  'FroIT_Support',
  'tu_api_key_de_wasender',
  'tu_session_id',
  'Agente de Soporte FroIT',
  true
);
```

## 💬 Procesamiento de Mensajes

### Tipos de Mensajes Soportados

| Tipo | Descripción | Almacenamiento |
|------|-------------|----------------|
| `text` | Mensajes de texto simples | Supabase DB |
| `image` | Imágenes (JPG, PNG, GIF, WebP) | Supabase Storage |
| `document` | Documentos (PDF, DOC, XLS, etc) | Supabase Storage |
| `audio` | Audios y notas de voz | Supabase Storage |
| `video` | Videos (MP4, AVI, etc) | Supabase Storage |
| `sticker` | Stickers de WhatsApp | Supabase Storage |
| `contact` | Tarjetas de contacto | Supabase DB |
| `location` | Ubicaciones compartidas | Supabase DB |
| `protocol` | Mensajes de sistema (ignorados) | N/A |

### Flujo de Procesamiento

```
Webhook recibido
    ↓
Validar evento (messages.upsert)
    ↓
Extraer datos del mensaje
    ↓
Validar teléfono
    ↓
Verificar agente en BD
    ↓
¿Es mensaje de grupo? → Ignorar
    ↓
¿Es mensaje saliente? → Verificar si ya existe
    ↓
Obtener nombre de contacto (API)
    ↓
¿Tiene medios? → Desencriptar y subir a Storage
    ↓
Guardar mensaje en BD (save_message_simple)
    ↓
Actualizar sender_lid del chat
    ↓
¿Es mensaje entrante? → Procesar para respuestas
    ↓
Retornar respuesta exitosa
```

## 📊 Sistema de Throttling

### Uso Básico

```javascript
import { throttledFetch, sendMessageWithThrottle } from '@/lib/messageThrottle';

// Opción 1: Usar throttledFetch (automático para envío de mensajes)
const response = await throttledFetch('https://www.wasenderapi.com/api/send-message', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ to: telefono, text: mensaje })
});

// Opción 2: Usar cola con sendMessageWithThrottle
await sendMessageWithThrottle(async () => {
  return fetch('https://www.wasenderapi.com/api/send-message', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to: telefono, text: mensaje })
  });
}, { phone: telefono, type: 'text' });
```

### Configuración Avanzada

```javascript
import { createThrottle } from '@/lib/messageThrottle';

const customThrottle = createThrottle(30000, {
  maxRetries: 5,           // Número de reintentos
  retryDelay: 2000,        // Delay entre reintentos (ms)
  enableMetrics: true,     // Habilitar métricas
  maxQueueSize: 500,       // Tamaño máximo de cola
  sendTimeout: 90000       // Timeout por envío (ms)
});
```

### Obtener Estado del Throttling

```javascript
import { getThrottleStatus } from '@/lib/messageThrottle';

const status = getThrottleStatus();
console.log(status);

/* Retorna:
{
  throttle: {
    isReady: true,
    waitTimeMs: 0,
    minIntervalSec: "20.0"
  },
  queue: {
    length: 0,
    processing: false
  },
  metrics: {
    totalSent: 45,
    totalFailed: 2,
    successRate: "95.74%"
  }
}
*/
```

## 🔄 Procesamiento de Mensajes Entrantes

El webhook automáticamente procesa mensajes entrantes y puede ejecutar lógica personalizada:

```javascript
// En route.js, función processIncomingMessage()
async function processIncomingMessage(telefono, messageData, originalData, propietario, agentConfig) {
  // Obtener chat desde BD
  const { data: chat } = await supabase
    .from('chats')
    .select('*')
    .eq('telefono', telefono)
    .eq('propietario', propietario)
    .single();
  
  // Solo procesar texto
  if (messageData.type !== 'text') return;
  
  const mensajeUsuario = messageData.content;
  
  // Aquí puedes agregar:
  // - Respuestas automáticas con OpenAI
  // - Reglas de negocio
  // - Integración con CRM
  // - Notificaciones
  // etc.
}
```

## 📥 Obtener Historial de Chat

El endpoint también soporta GET para obtener historial:

```
GET /api/webhook/[agentCode]?telefono=5491234567890&limit=50&offset=0
```

Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "id": "mensaje_id",
      "content": "Hola!",
      "type": "text",
      "direction": "incoming",
      "created_at": "2024-01-01T12:00:00Z",
      "status": "received"
    }
  ],
  "telefono": "5491234567890",
  "agent": "Agente de Soporte FroIT",
  "total": 50
}
```

## 🛡️ Validaciones y Seguridad

### Validaciones Implementadas

- ✅ Validación de formato de teléfono (mínimo 10 dígitos)
- ✅ Filtrado de mensajes de grupos
- ✅ Filtrado de mensajes de protocolo/sistema
- ✅ Validación de códigos @lid (ignorados)
- ✅ Verificación de agente activo en BD
- ✅ Detección de mensajes duplicados

### Recomendaciones de Seguridad

1. **Usar HTTPS**: Siempre configura webhooks con HTTPS
2. **Validar origen**: Considera agregar validación de IP de WasenderAPI
3. **Rate limiting**: Implementa rate limiting en el endpoint
4. **Logs**: Monitorea logs para detectar comportamientos anómalos

## 🐛 Debugging

### Logs Habilitados

El sistema incluye logs detallados en consola:

```
📩 Webhook recibido para agente: agent_001
📦 Datos del webhook: {...}
📞 Teléfono extraído: 5491234567890
👤 Agente configurado: {...}
💾 Guardando mensaje en BD...
✅ Mensaje guardado: mensaje_id_123
```

### Verificar Estado

Puedes agregar un endpoint de estado:

```javascript
// GET /api/webhook/status
import { getThrottleStatus } from '@/lib/messageThrottle';

export async function GET() {
  const status = getThrottleStatus();
  return NextResponse.json(status);
}
```

## 📚 Funciones RPC de Supabase Requeridas

Asegúrate de tener estas funciones en tu BD:

### `get_agent_by_code(p_agent_code text)`
```sql
CREATE OR REPLACE FUNCTION get_agent_by_code(p_agent_code text)
RETURNS TABLE (
  agent_code text,
  api_key text,
  session_id text,
  nombre_completo text,
  activo boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.agent_code, a.api_key, a.session_id, a.nombre_completo, a.activo
  FROM agents a
  WHERE a.agent_code = p_agent_code AND a.activo = true;
END;
$$ LANGUAGE plpgsql;
```

### `save_message_simple(...)`
Función que guarda mensajes en la BD. Debe crear/actualizar:
- Tabla `chats` (telefono, propietario, contact_name, sender_lid)
- Tabla `messages` (id, chat_id, type, content, direction, etc.)

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
vercel --prod
```

### Variables de Entorno en Vercel

Configura las mismas variables de `.env.local` en el dashboard de Vercel.

## 📖 Referencias

- [WasenderAPI Docs](https://www.wasenderapi.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 🆘 Soporte

Para problemas o preguntas sobre este sistema:
1. Revisa los logs en consola
2. Verifica configuración de agentes en Supabase
3. Confirma que el webhook esté activo en WasenderAPI
4. Verifica variables de entorno

---

**FroIT** - Agente IA Inteligente para WhatsApp 🤖
