import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { 
  processWasenderMessage, 
  extractPhoneNumber, 
  isGroupMessage,
  isValidWhatsAppNumber,
  getChatHistory
} from "../../../lib/wasenderMessageHandler.js";
import { throttledFetch } from "../../../lib/messageThrottle.js";

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
);

// Cliente de Supabase con permisos de servicio
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req, { params }) {
  try {
    const rawBody = await req.text();
    const webhookData = JSON.parse(rawBody);

    console.log("📩 Webhook recibido para agente:", params.agentCode);
    console.log("📦 Datos del webhook:", JSON.stringify(webhookData, null, 2));

    // Verificar que es el evento messages.upsert
    if (webhookData.event !== 'messages.upsert') {
      console.log('⚠️ Evento no es messages.upsert:', webhookData.event);
      return NextResponse.json({ success: true, message: 'Evento no procesado' });
    }

    const { data: webhookDataContent } = webhookData;
    let messagesArray;
    
    // Manejar diferentes formatos de webhook
    if (webhookDataContent.messages) {
      messagesArray = Array.isArray(webhookDataContent.messages) 
        ? webhookDataContent.messages 
        : [webhookDataContent.messages];
    } else if (webhookDataContent.key && webhookDataContent.message) {
      messagesArray = [webhookDataContent];
    } else {
      console.error('❌ Formato de webhook no reconocido');
      return NextResponse.json({ success: false, error: 'Formato no reconocido' });
    }
    
    if (!messagesArray || messagesArray.length === 0) {
      console.error('❌ No hay mensajes para procesar');
      return NextResponse.json({ success: false, error: 'No hay mensajes' });
    }
    
    const messageData = messagesArray[0];
    
    console.log("📧 Mensaje a procesar:", JSON.stringify(messageData, null, 2));
    
    if (!messageData || !messageData.key || !messageData.message) {
      console.error('❌ Datos del mensaje incompletos');
      return NextResponse.json({ success: false, error: 'Datos incompletos' });
    }

    // Extraer teléfono
    let telefono = extractPhoneNumber(messageData.key.remoteJid);
    console.log("📞 Teléfono extraído:", telefono);
    
    // Validación de teléfono
    if (telefono === null || telefono === undefined || 
        typeof telefono !== 'string' || 
        telefono.trim() === '' || 
        telefono.length < 10 || 
        !/^\d+$/.test(telefono)) {
      console.log('⚠️ Ignorando mensaje: teléfono inválido:', telefono);
      return NextResponse.json({ 
        success: true, 
        message: 'Mensaje ignorado: teléfono inválido'
      });
    }

    // Obtener configuración del agente
    const agentCode = params.agentCode;
    const { data: agentConfig, error: agentError } = await supabase.rpc('get_agent_by_code', {
      p_agent_code: agentCode
    });

    if (agentError || !agentConfig || Object.keys(agentConfig).length === 0) {
      console.error('❌ Agente no encontrado:', agentCode);
      return NextResponse.json({ 
        success: false, 
        error: `Agente ${agentCode} no encontrado` 
      }, { status: 404 });
    }

    console.log('👤 Agente configurado:', agentConfig);
    console.log('📤 FromMe:', messageData.key.fromMe);
    
    // Ignorar mensajes de grupos
    if (isGroupMessage(messageData.key.remoteJid)) {
      console.log('📝 Ignorando mensaje de grupo');
      return NextResponse.json({ success: true, message: 'Mensaje de grupo ignorado' });
    }

    const propietario = agentCode;

    console.log('💾 Guardando mensaje en BD...');
    
    // Extraer senderLid y pushName
    let senderLid = messageData.key?.senderLid || null;
    let pushName = null;
    
    // Solo obtener nombre para mensajes entrantes
    if (!messageData.key.fromMe) {
      pushName = messageData.pushName || webhookDataContent.messages?.pushName || null;
      console.log('👤 PushName extraído:', pushName);
      
      // Obtener nombre de contacto desde API si no hay pushName
      if (!pushName && telefono) {
        console.log('📞 Obteniendo nombre desde WasenderAPI...');
        try {
          const contactResponse = await fetch(`https://www.wasenderapi.com/api/contacts/${telefono}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${agentConfig.api_key}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (contactResponse.ok) {
            const contactResult = await contactResponse.json();
            
            if (contactResult.success && contactResult.data) {
              const contactName = contactResult.data.name || contactResult.data.notify;
              if (contactName && contactName.trim()) {
                pushName = contactName.trim();
                console.log('✅ Nombre obtenido desde API:', pushName);
              }
            }
          }
        } catch (contactApiError) {
          console.error('❌ Error consultando API contacts:', contactApiError.message);
        }
      }
    }
    
    // Procesar y guardar el mensaje
    const { success, error, data } = await processWasenderMessage(
      messageData, 
      propietario, 
      agentConfig.api_key, 
      pushName, 
      senderLid, 
      telefono
    );
    
    if (!success) {
      console.error('❌ Error procesando mensaje:', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    if (!data) {
      console.log('ℹ️ Mensaje ignorado (protocolo o inválido)');
      return NextResponse.json({ 
        success: true, 
        message: 'Mensaje ignorado correctamente'
      });
    }

    // Si es un mensaje entrante, procesarlo para respuestas automáticas
    if (!messageData.key.fromMe) {
      await processIncomingMessage(telefono, data, messageData, propietario, agentConfig);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Mensaje procesado correctamente',
      messageId: data.id,
      chatId: data.chat_id,
      contactId: data.contact_id,
      agent: agentConfig.nombre_completo
    });

  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Procesa mensajes entrantes para generar respuestas automáticas
 */
async function processIncomingMessage(telefono, messageData, originalData, propietario, agentConfig) {
  try {
    console.log('🔄 Procesando mensaje entrante de:', telefono);

    // Obtener información del chat
    const { data: chat, error } = await supabase
      .from('chats')
      .select('*')
      .eq('telefono', telefono)
      .eq('propietario', propietario)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error obteniendo chat:', error);
      return;
    }

    // Solo procesar mensajes de texto
    if (messageData.type !== 'text') {
      console.log('📝 Tipo de mensaje no procesable:', messageData.type);
      return;
    }

    const mensajeUsuario = messageData.content;
    console.log('💬 Contenido del mensaje:', mensajeUsuario);

    // Aquí puedes agregar lógica de respuestas automáticas
    // Por ejemplo, usando OpenAI o reglas predefinidas
    
  } catch (error) {
    console.error('❌ Error procesando mensaje entrante:', error);
  }
}

/**
 * Endpoint GET para obtener historial de chat
 */
export async function GET(req, { params }) {
  const searchParams = req.nextUrl.searchParams;
  const telefono = searchParams.get('telefono');
  const agentCode = params.agentCode;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  if (!telefono) {
    return NextResponse.json(
      { error: 'Se requiere el número de teléfono' },
      { status: 400 }
    );
  }

  // Verificar que el agente existe
  const { data: agentConfig, error: agentError } = await supabase.rpc('get_agent_by_code', {
    p_agent_code: agentCode
  });

  if (agentError || !agentConfig || Object.keys(agentConfig).length === 0) {
    return NextResponse.json(
      { error: `Agente ${agentCode} no encontrado` },
      { status: 404 }
    );
  }

  try {
    const { success, data, error } = await getChatHistory(telefono, agentCode, limit, offset);

    if (!success) {
      throw new Error(error.message);
    }

    return NextResponse.json({ 
      success: true, 
      data: data || [],
      telefono,
      agent: agentConfig.nombre_completo,
      total: data ? data.length : 0
    });

  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
