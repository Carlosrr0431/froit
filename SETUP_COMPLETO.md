# ✅ Sistema de Webhooks para WhatsApp - Instalación Completa

## 📦 Archivos Creados

### 1. **Librerías Core** (`src/lib/`)
- ✅ `messageThrottle.js` - Sistema de throttling para control de envío de mensajes
- ✅ `wasenderMessageHandler.js` - Manejador de mensajes de WasenderAPI

### 2. **API Endpoints** (`src/app/api/`)
- ✅ `webhook/[agentCode]/route.js` - Endpoint del webhook con soporte para múltiples agentes

### 3. **Documentación**
- ✅ `WEBHOOK_README.md` - Documentación completa del sistema
- ✅ `.env.example` - Ejemplo de variables de entorno

### 4. **Dependencias**
- ✅ `openai` agregado al `package.json`
- ✅ Dependencias instaladas exitosamente

## 🚀 Próximos Pasos

### 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_key (opcional)

# OpenAI (opcional)
OPENAI_API_KEY=sk-proj-tu_openai_key

# WasenderAPI (opcional)
WASENDER_API_KEY=tu_wasender_api_key_default
```

### 2. Configurar Base de Datos en Supabase

#### Tabla: `agents`
```sql
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_code TEXT UNIQUE NOT NULL,
  api_key TEXT NOT NULL,
  session_id TEXT,
  nombre_completo TEXT NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ejemplo de inserción
INSERT INTO agents (agent_code, api_key, session_id, nombre_completo, activo)
VALUES (
  'froit_support',
  'tu_wasender_api_key',
  'tu_session_id',
  'Agente de Soporte FroIT',
  true
);
```

#### Tabla: `chats`
```sql
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telefono TEXT NOT NULL,
  propietario TEXT NOT NULL,
  contact_name TEXT,
  sender_lid TEXT,
  picture_url TEXT,
  atendido_por_humano BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(telefono, propietario)
);
```

#### Tabla: `messages`
```sql
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT,
  direction TEXT NOT NULL, -- 'incoming' o 'outgoing'
  status TEXT NOT NULL, -- 'sent', 'received', 'read', 'failed'
  media_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Función: `get_agent_by_code`
```sql
CREATE OR REPLACE FUNCTION get_agent_by_code(p_agent_code TEXT)
RETURNS TABLE (
  agent_code TEXT,
  api_key TEXT,
  session_id TEXT,
  nombre_completo TEXT,
  activo BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.agent_code, 
    a.api_key, 
    a.session_id, 
    a.nombre_completo, 
    a.activo
  FROM agents a
  WHERE a.agent_code = p_agent_code 
    AND a.activo = true;
END;
$$ LANGUAGE plpgsql;
```

#### Función: `save_message_simple`
```sql
CREATE OR REPLACE FUNCTION save_message_simple(
  p_message_id TEXT,
  p_telefono TEXT,
  p_type TEXT,
  p_status TEXT,
  p_content TEXT,
  p_metadata JSONB,
  p_direction TEXT,
  p_media_url TEXT,
  p_message_timestamp TIMESTAMP WITH TIME ZONE,
  p_propietario TEXT,
  p_push_name TEXT
)
RETURNS TABLE (chat_id UUID) AS $$
DECLARE
  v_chat_id UUID;
BEGIN
  -- Buscar o crear chat
  SELECT id INTO v_chat_id
  FROM chats
  WHERE telefono = p_telefono 
    AND propietario = p_propietario;
  
  IF v_chat_id IS NULL THEN
    INSERT INTO chats (telefono, propietario, contact_name, atendido_por_humano)
    VALUES (p_telefono, p_propietario, p_push_name, false)
    RETURNING id INTO v_chat_id;
  ELSIF p_push_name IS NOT NULL AND p_direction = 'incoming' THEN
    -- Actualizar nombre del contacto si viene en mensaje entrante
    UPDATE chats
    SET contact_name = p_push_name,
        updated_at = NOW()
    WHERE id = v_chat_id;
  END IF;
  
  -- Insertar mensaje (con ON CONFLICT para evitar duplicados)
  INSERT INTO messages (
    id,
    chat_id,
    type,
    content,
    direction,
    status,
    media_url,
    metadata,
    created_at
  )
  VALUES (
    p_message_id,
    v_chat_id,
    p_type,
    p_content,
    p_direction,
    p_status,
    p_media_url,
    p_metadata,
    COALESCE(p_message_timestamp, NOW())
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    status = EXCLUDED.status,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();
  
  RETURN QUERY SELECT v_chat_id;
END;
$$ LANGUAGE plpgsql;
```

#### Función: `get_chat_messages`
```sql
CREATE OR REPLACE FUNCTION get_chat_messages(
  p_telefono TEXT,
  p_propietario TEXT,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id TEXT,
  chat_id UUID,
  type TEXT,
  content TEXT,
  direction TEXT,
  status TEXT,
  media_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.chat_id,
    m.type,
    m.content,
    m.direction,
    m.status,
    m.media_url,
    m.metadata,
    m.created_at
  FROM messages m
  INNER JOIN chats c ON m.chat_id = c.id
  WHERE c.telefono = p_telefono 
    AND c.propietario = p_propietario
  ORDER BY m.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
```

#### Bucket de Storage: `wasender-media`
```sql
-- Crear bucket en Supabase Storage
-- Ir a Storage -> Create a new bucket
-- Name: wasender-media
-- Public: Yes
```

### 3. Configurar Webhook en WasenderAPI

1. Ve a tu panel de WasenderAPI
2. Navega a **Settings > Webhooks**
3. Agrega un nuevo webhook:
   - **URL**: `https://tu-dominio.vercel.app/api/webhook/froit_support`
   - **Event**: `messages.upsert`
   - **Method**: POST
   - **Active**: Yes

### 4. Probar el Sistema

#### Opción 1: Desarrollo Local
```bash
npm run dev
```

Luego usa ngrok o similar para exponer tu localhost:
```bash
ngrok http 3000
```

Configura el webhook con la URL de ngrok: `https://tu-ngrok-url.ngrok.io/api/webhook/froit_support`

#### Opción 2: Desplegar en Vercel
```bash
vercel --prod
```

### 5. Verificar Funcionamiento

Envía un mensaje de WhatsApp al número configurado en WasenderAPI y verifica:

1. **Logs del Webhook**: En la consola de Vercel o terminal local
   ```
   📩 Webhook recibido para agente: froit_support
   📞 Teléfono extraído: 5491234567890
   ✅ Mensaje guardado: mensaje_id_123
   ```

2. **Base de Datos**: Verifica que se crearon registros en:
   - Tabla `chats` (nuevo chat o actualizado)
   - Tabla `messages` (nuevo mensaje)

3. **Storage**: Si el mensaje tiene medios, verifica en Storage > wasender-media

## 📊 Endpoints Disponibles

### POST `/api/webhook/[agentCode]`
Recibe webhooks de WasenderAPI

**Parámetros de ruta:**
- `agentCode`: Código del agente (debe existir en tabla `agents`)

**Body:** Datos del webhook de WasenderAPI

### GET `/api/webhook/[agentCode]`
Obtiene historial de chat

**Parámetros de ruta:**
- `agentCode`: Código del agente

**Query params:**
- `telefono`: Número de teléfono (requerido)
- `limit`: Límite de mensajes (default: 50)
- `offset`: Offset para paginación (default: 0)

**Ejemplo:**
```
GET /api/webhook/froit_support?telefono=5491234567890&limit=100
```

## 🎯 Uso en tu CRM

### Integración con el Dashboard

```javascript
// En tu componente de CRM
import { useState, useEffect } from 'react';

const ChatComponent = ({ agentCode, telefono }) => {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    fetchMessages();
  }, [telefono]);
  
  const fetchMessages = async () => {
    const response = await fetch(
      `/api/webhook/${agentCode}?telefono=${telefono}&limit=50`
    );
    const data = await response.json();
    
    if (data.success) {
      setMessages(data.data);
    }
  };
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>
          <p>{msg.content}</p>
          <span>{msg.direction}</span>
        </div>
      ))}
    </div>
  );
};
```

## 🔧 Personalización

### Agregar Respuestas Automáticas

Modifica la función `processIncomingMessage` en `route.js`:

```javascript
async function processIncomingMessage(telefono, messageData, originalData, propietario, agentConfig) {
  const mensajeUsuario = messageData.content;
  
  // Ejemplo: Respuesta automática con OpenAI
  if (shouldRespondAutomatically(mensajeUsuario)) {
    const respuesta = await generateAIResponse(mensajeUsuario);
    await sendWhatsAppMessage(telefono, respuesta, agentConfig.api_key);
  }
}
```

### Agregar Lógica de Negocio

```javascript
// Detectar intención del usuario
if (mensajeUsuario.toLowerCase().includes('precio')) {
  // Mostrar precios
  await sendWhatsAppMessage(telefono, '💰 Nuestros planes...', apiKey);
} else if (mensajeUsuario.toLowerCase().includes('demo')) {
  // Agendar demo
  await sendWhatsAppMessage(telefono, '📅 ¿Cuándo te gustaría?', apiKey);
}
```

## 📈 Monitoreo y Métricas

### Ver Estado del Throttling

```javascript
import { getThrottleStatus } from '@/lib/messageThrottle';

const status = getThrottleStatus();
console.log(`
  Mensajes enviados: ${status.metrics.totalSent}
  Mensajes fallidos: ${status.metrics.totalFailed}
  Tasa de éxito: ${status.metrics.successRate}
  Cola actual: ${status.queue.length}
`);
```

### Logs Importantes

Monitorea estos logs para detectar problemas:
- `❌ Agente no encontrado` → Verifica configuración en tabla `agents`
- `❌ Teléfono inválido` → Verifica formato del número
- `❌ Error guardando mensaje` → Revisa función RPC `save_message_simple`

## 🐛 Troubleshooting

### Webhook no recibe mensajes
1. Verifica que el webhook esté activo en WasenderAPI
2. Confirma la URL del webhook (debe ser HTTPS en producción)
3. Revisa logs en Vercel/consola

### Mensajes no se guardan en BD
1. Verifica que las funciones RPC existan en Supabase
2. Confirma que las tablas `chats` y `messages` existan
3. Revisa permisos RLS en Supabase

### Medios no se descargan
1. Verifica que el bucket `wasender-media` exista
2. Confirma que el bucket sea público
3. Revisa API key de WasenderAPI

## ✨ Características Avanzadas

### Cola de Mensajes con Prioridad

```javascript
import { createThrottle } from '@/lib/messageThrottle';

const priorityThrottle = createThrottle(15000); // 15 segundos para mensajes VIP

await priorityThrottle.enqueue(sendFunction, {
  phone: telefono,
  type: 'priority',
  priority: 'high'
});
```

### Respuestas con IA (OpenAI)

```javascript
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'Eres un asistente de FroIT...' },
    { role: 'user', content: mensajeUsuario }
  ]
});

const respuesta = completion.choices[0].message.content;
```

## 🎉 ¡Listo!

Tu sistema de webhooks para WhatsApp está completamente configurado y listo para usar. 

**Próximos pasos sugeridos:**
1. Configurar las variables de entorno
2. Crear las tablas y funciones en Supabase
3. Registrar tu primer agente
4. Configurar el webhook en WasenderAPI
5. ¡Probar enviando mensajes!

---

**¿Necesitas ayuda?** Consulta el archivo `WEBHOOK_README.md` para documentación detallada.
