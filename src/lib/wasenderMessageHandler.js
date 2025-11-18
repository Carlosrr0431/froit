import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
);

/**
 * Guarda un archivo de WasenderAPI directamente en Supabase Storage
 */
async function saveToSupabaseStorage(wasenderUrl, messageId, metadata) {
  try {
    console.log('📥 Descargando archivo de WasenderAPI:', wasenderUrl);
    
    const response = await fetch(wasenderUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error descargando archivo: ${response.status} ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    
    console.log(`📊 Archivo descargado: ${fileBuffer.length} bytes`);
    
    const contentType = response.headers.get('content-type') || metadata?.mime_type || 'application/octet-stream';
    console.log('🎨 Content-Type detectado:', contentType);
    
    let fileExtension = '';
    let folder = 'others';
    
    if (contentType.includes('pdf')) {
      fileExtension = '.pdf';
      folder = 'documents';
    } else if (contentType.includes('word') || contentType.includes('msword') || contentType.includes('vnd.openxmlformats-officedocument.wordprocessingml')) {
      fileExtension = '.docx';
      folder = 'documents';
    } else if (contentType.includes('excel') || contentType.includes('spreadsheet') || contentType.includes('vnd.openxmlformats-officedocument.spreadsheetml')) {
      fileExtension = '.xlsx';
      folder = 'documents';
    } else if (contentType.startsWith('image/')) {
      folder = 'images';
      if (contentType.includes('jpeg') || contentType.includes('jpg')) fileExtension = '.jpg';
      else if (contentType.includes('png')) fileExtension = '.png';
      else if (contentType.includes('gif')) fileExtension = '.gif';
      else if (contentType.includes('webp')) fileExtension = '.webp';
    } else if (contentType.startsWith('video/')) {
      folder = 'videos';
      if (contentType.includes('mp4')) fileExtension = '.mp4';
    } else if (contentType.startsWith('audio/')) {
      folder = 'audios';
      if (contentType.includes('mpeg') || contentType.includes('mp3')) fileExtension = '.mp3';
      else if (contentType.includes('ogg')) fileExtension = '.ogg';
      else if (contentType.includes('m4a')) fileExtension = '.m4a';
    }
    
    const timestamp = Date.now();
    const fileName = `${folder}/${messageId}_${timestamp}${fileExtension}`;
    
    console.log('📁 Guardando como:', fileName);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('wasender-media')
      .upload(fileName, fileBuffer, {
        contentType: contentType,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Error subiendo a Supabase Storage:', uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from('wasender-media')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    
    console.log('✅ Archivo subido exitosamente a Supabase Storage');
    console.log('🔗 URL pública:', publicUrl);

    return {
      success: true,
      supabaseUrl: publicUrl,
      path: uploadData.path,
      fileName: fileName,
      contentType: contentType,
      bytes: fileBuffer.length,
      folder: folder
    };
    
  } catch (error) {
    console.error('❌ Error guardando en Supabase Storage:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Desencripta medios usando la API de Wasender y los guarda en Supabase Storage
 */
async function decryptMedia(messageId, mediaMessage, messageType, apiKey = null) {
  try {
    console.log("🔓 Desencriptando media con Wasender API...");
    console.log("📋 Tipo:", messageType, "ID:", messageId);

    const API_KEY = apiKey || process.env.WASENDER_API_KEY;
    const payload = {
      data: {
        messages: {
          key: {
            id: messageId,
          },
          message: {},
        },
      },
    };

    // Construir el payload según el tipo de mensaje
    switch (messageType) {
      case "image":
        payload.data.messages.message.imageMessage = {
          url: mediaMessage.url,
          mimetype: mediaMessage.mimetype,
          mediaKey: mediaMessage.mediaKey,
          directPath: mediaMessage.directPath,
          fileEncSha256: mediaMessage.fileEncSha256,
          fileSha256: mediaMessage.fileSha256,
          fileLength: mediaMessage.fileLength,
          mediaKeyTimestamp: mediaMessage.mediaKeyTimestamp,
          height: mediaMessage.height,
          width: mediaMessage.width,
        };
        break;
      case "document":
        payload.data.messages.message.documentMessage = {
          url: mediaMessage.url,
          mimetype: mediaMessage.mimetype,
          mediaKey: mediaMessage.mediaKey,
          directPath: mediaMessage.directPath,
          fileEncSha256: mediaMessage.fileEncSha256,
          fileSha256: mediaMessage.fileSha256,
          fileLength: mediaMessage.fileLength,
          fileName: mediaMessage.fileName || 'document',
          mediaKeyTimestamp: mediaMessage.mediaKeyTimestamp,
        };
        break;
      case "video":
        payload.data.messages.message.videoMessage = {
          url: mediaMessage.url,
          mimetype: mediaMessage.mimetype,
          mediaKey: mediaMessage.mediaKey,
          directPath: mediaMessage.directPath,
          fileEncSha256: mediaMessage.fileEncSha256,
          fileSha256: mediaMessage.fileSha256,
          fileLength: mediaMessage.fileLength,
          mediaKeyTimestamp: mediaMessage.mediaKeyTimestamp,
          seconds: mediaMessage.seconds,
          height: mediaMessage.height,
          width: mediaMessage.width,
        };
        break;
      case "audio":
        payload.data.messages.message.audioMessage = {
          url: mediaMessage.url,
          mimetype: mediaMessage.mimetype,
          mediaKey: mediaMessage.mediaKey,
          directPath: mediaMessage.directPath,
          fileEncSha256: mediaMessage.fileEncSha256,
          fileSha256: mediaMessage.fileSha256,
          fileLength: mediaMessage.fileLength,
          mediaKeyTimestamp: mediaMessage.mediaKeyTimestamp,
          seconds: mediaMessage.seconds,
          ptt: mediaMessage.ptt,
        };
        break;
      case "sticker":
        payload.data.messages.message.stickerMessage = {
          url: mediaMessage.url,
          mimetype: mediaMessage.mimetype,
          mediaKey: mediaMessage.mediaKey,
          directPath: mediaMessage.directPath,
          fileEncSha256: mediaMessage.fileEncSha256,
          fileSha256: mediaMessage.fileSha256,
          fileLength: mediaMessage.fileLength,
          mediaKeyTimestamp: mediaMessage.mediaKeyTimestamp,
          height: mediaMessage.height,
          width: mediaMessage.width,
        };
        break;
    }

    const response = await fetch("https://www.wasenderapi.com/api/decrypt-media", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log("📥 Respuesta decrypt-media:", response.status, responseText);

    if (!response.ok) {
      console.error("❌ Error HTTP desencriptando media:", response.status);
      return mediaMessage.url;
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Error parseando respuesta:", parseError);
      return mediaMessage.url;
    }

    let wasenderUrl = null;
    if (result.success && result.publicUrl) {
      wasenderUrl = result.publicUrl;
    } else if (result.data && result.data.publicUrl) {
      wasenderUrl = result.data.publicUrl;
    } else if (result.publicUrl) {
      wasenderUrl = result.publicUrl;
    } else {
      console.error("❌ Respuesta inesperada desencriptando media:", result);
      return mediaMessage.url;
    }

    console.log("✅ Media desencriptado exitosamente:", wasenderUrl);

    // Guardar en Supabase Storage
    if (wasenderUrl && wasenderUrl.includes('wasenderapi.com')) {
      console.log("🔄 Guardando archivo descifrado en Supabase Storage...");
      
      const storageResult = await saveToSupabaseStorage(wasenderUrl, messageId, {
        file_name: mediaMessage.fileName || `${messageType}_${messageId}`,
        mime_type: mediaMessage.mimetype,
        file_size: mediaMessage.fileLength,
        original_type: messageType
      });

      if (storageResult.success) {
        console.log("✅ Archivo descifrado guardado en Supabase Storage:", storageResult.supabaseUrl);
        return storageResult.supabaseUrl;
      } else {
        console.error("❌ ERROR guardando en Supabase Storage:", storageResult.error);
        throw new Error(`Fallo al guardar archivo: ${storageResult.error}`);
      }
    }

    return wasenderUrl;

  } catch (error) {
    console.error("❌ Error en decryptMedia:", error);
    return mediaMessage.url;
  }
}

/**
 * Procesa un mensaje del evento messages.upsert usando estructura normalizada
 */
export async function processWasenderMessage(
  messageData,
  propietario = "FroIT",
  agentApiKey = null,
  pushName = null,
  senderLid = null,
  telefonoResuelto = null
) {
  try {
    console.log("📩 Procesando mensaje Wasender:", JSON.stringify(messageData, null, 2));

    const { key, message } = messageData;

    const detectedSenderLid = senderLid || key?.senderLid || null;
    if (detectedSenderLid) {
      console.log("🆔 senderLid detectado:", detectedSenderLid);
    }

    const messageId = key.id;
    const fromMe = key.fromMe;
    const telefono = telefonoResuelto || extractPhoneNumber(key.remoteJid);
    
    console.log("📞 Teléfono final a usar:", telefono);

    if (!telefono || telefono.trim() === '') {
      console.error("❌ Teléfono inválido o vacío");
      return { success: false, error: "Teléfono inválido o vacío" };
    }

    const direction = fromMe ? "outgoing" : "incoming";

    // Verificar si mensaje saliente ya existe
    if (direction === "outgoing") {
      console.log('📤 Verificando si mensaje saliente ya existe...');
      try {
        const { data: existingMessage } = await supabase
          .from('messages')
          .select('id, metadata')
          .eq('id', messageId)
          .single();

        if (existingMessage?.metadata?.sent_from_crm) {
          console.log('ℹ️ Mensaje ya guardado desde CRM, ignorando webhook');
          if (telefono && detectedSenderLid) {
            await upsertSenderLid({ telefono, propietario, senderLid: detectedSenderLid });
          }
          return { 
            success: true, 
            message: 'Mensaje saliente ya procesado desde CRM', 
            data: existingMessage 
          };
        }
      } catch {
        console.log('📝 Mensaje saliente no encontrado en BD, procesando...');
      }
    }

    const processedMessage = await parseMessageContent(message, messageId, direction, agentApiKey);

    if (!telefono) {
      console.log('⚠️ Número inválido, ignorando mensaje');
      return { success: true, message: 'Número inválido ignorado', data: null };
    }

    if (processedMessage.type === "protocol") {
      console.log('⚠️ Mensaje de protocolo detectado, ignorando');
      if (detectedSenderLid) {
        await upsertSenderLid({ telefono, propietario, senderLid: detectedSenderLid });
      }
      return { success: true, message: 'Mensaje de protocolo ignorado', data: null };
    }

    // Obtener nombre de contacto si no está disponible
    let finalPushName = pushName;
    
    if ((!pushName || pushName.trim() === '') && agentApiKey) {
      console.log(`📞 Obteniendo nombre de contacto desde WasenderAPI...`);
      try {
        const contactResponse = await fetch(`https://www.wasenderapi.com/api/contacts/${telefono}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${agentApiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (contactResponse.ok) {
          const contactResult = await contactResponse.json();
          
          if (contactResult.success && contactResult.data) {
            let contactName;
            if (direction === 'outgoing') {
              contactName = contactResult.data.notify || contactResult.data.name;
            } else {
              contactName = contactResult.data.name || contactResult.data.notify;
            }
            
            if (contactName && contactName.trim()) {
              finalPushName = contactName.trim();
              console.log(`✅ Nombre de contacto obtenido:`, finalPushName);
            }
          }
        }
      } catch (contactApiError) {
        console.error(`❌ Error consultando API contacts:`, contactApiError.message);
      }
    }
    
    // Guardar mensaje usando RPC
    const saveMessageParams = {
      p_message_id: messageId,
      p_telefono: telefono,
      p_type: processedMessage.type,
      p_status: processedMessage.status,
      p_content: processedMessage.content,
      p_metadata: processedMessage.metadata,
      p_direction: direction,
      p_media_url: processedMessage.media_url,
      p_message_timestamp: processedMessage.timestamp,
      p_propietario: propietario,
      p_push_name: finalPushName
    };

    let data, error;
    
    try {
      const result = await supabase.rpc("save_message_simple", saveMessageParams);
      data = result.data;
      error = result.error;
      
      if (error) {
        console.error("❌ Error en save_message_simple:", error);
        return { success: false, error };
      }
      
      console.log("✅ save_message_simple exitoso");
      
    } catch (rpcError) {
      console.error("❌ Error crítico en save_message_simple:", rpcError);
      return { success: false, error: rpcError };
    }

    if (error) {
      console.error("❌ Error guardando mensaje:", error);
      return { success: false, error };
    }

    console.log("✅ Mensaje guardado:", messageId);

    const chatId = data?.chat_id ?? data?.[0]?.chat_id ?? null;

    // Persistir sender_lid si está disponible
    if (detectedSenderLid) {
      await upsertSenderLid({ telefono, propietario, senderLid: detectedSenderLid, chatId });
    }

    return { 
      success: true, 
      data: {
        id: messageId,
        ...processedMessage,
        chat_id: chatId
      }
    };

  } catch (error) {
    console.error("❌ Error procesando mensaje Wasender:", error);
    return { success: false, error };
  }
}

/**
 * Helper para actualizar/insertar sender_lid en chats
 */
async function upsertSenderLid({ telefono, propietario, senderLid, chatId = null }) {
  try {
    if (!senderLid || !telefono || !propietario) return;

    console.log('🆔 Guardando sender_lid en chat:', { telefono, propietario, senderLid });

    if (chatId) {
      const { error: updateByIdError } = await supabase
        .from('chats')
        .update({ sender_lid: senderLid })
        .eq('id', chatId)
        .is('sender_lid', null);

      if (!updateByIdError) {
        console.log('✅ sender_lid actualizado por chat_id');
        return;
      }
    }

    const { data: existing, error: fetchError } = await supabase
      .from('chats')
      .select('id, sender_lid')
      .eq('telefono', telefono)
      .eq('propietario', propietario)
      .single();

    if (!existing && !fetchError) {
      console.log('🆕 Creando chat mínimo para sender_lid');
      const { error: insertError } = await supabase
        .from('chats')
        .insert({
          telefono,
          propietario,
          sender_lid: senderLid,
          atendido_por_humano: false
        });
      
      if (!insertError) {
        console.log('✅ Chat creado con sender_lid');
      }
    } else if (existing && !existing.sender_lid) {
      await supabase
        .from('chats')
        .update({ sender_lid: senderLid })
        .eq('id', existing.id)
        .is('sender_lid', null);
      
      console.log('✅ sender_lid actualizado en chat existente');
    }
  } catch (e) {
    console.error('❌ Error en upsertSenderLid:', e.message);
  }
}

/**
 * Parsea el contenido del mensaje según su tipo
 */
async function parseMessageContent(message, messageId, direction, agentApiKey = null) {
  const timestamp = new Date().toISOString();

  const baseMessage = {
    timestamp,
    status: direction === "incoming" ? "received" : "sent",
    media_url: null,
    metadata: {}
  };

  // Mensaje de protocolo
  if (message.protocolMessage) {
    return {
      ...baseMessage,
      type: "protocol",
      content: "Mensaje de protocolo",
      metadata: {
        protocol_type: message.protocolMessage.type,
        raw_protocol: message.protocolMessage,
      },
    };
  }

  // Mensaje de texto simple
  if (message.conversation) {
    return {
      ...baseMessage,
      type: "text",
      content: message.conversation,
    };
  }

  // Mensaje de texto extendido
  if (message.extendedTextMessage) {
    return {
      ...baseMessage,
      type: "text",
      content: message.extendedTextMessage.text,
      metadata: {
        context: message.extendedTextMessage.contextInfo || {},
      },
    };
  }

  // Mensaje de imagen
  if (message.imageMessage) {
    let mediaUrl = message.imageMessage.url;

    if (message.imageMessage.url && (message.imageMessage.url.includes('mmg.whatsapp.net') || 
        message.imageMessage.url.includes('pps.whatsapp.net') ||
        message.imageMessage.mediaKey)) {
      mediaUrl = await decryptMedia(messageId, message.imageMessage, "image", agentApiKey);
    }

    return {
      ...baseMessage,
      type: "image",
      content: mediaUrl || message.imageMessage.caption || "Imagen",
      media_url: mediaUrl,
      metadata: {
        mime_type: message.imageMessage.mimetype,
        caption: message.imageMessage.caption || "",
      },
    };
  }

  // Mensaje de documento
  if (message.documentMessage) {
    let mediaUrl = message.documentMessage.url;

    if (message.documentMessage.url && (message.documentMessage.url.includes('mmg.whatsapp.net') || 
        message.documentMessage.url.includes('pps.whatsapp.net') ||
        message.documentMessage.mediaKey)) {
      mediaUrl = await decryptMedia(messageId, message.documentMessage, "document", agentApiKey);
    }

    return {
      ...baseMessage,
      type: "document",
      content: mediaUrl || message.documentMessage.fileName || "Documento",
      media_url: mediaUrl,
      metadata: {
        mime_type: message.documentMessage.mimetype,
        file_name: message.documentMessage.fileName,
        caption: message.documentMessage.caption || "",
      },
    };
  }

  // Mensaje de audio
  if (message.audioMessage) {
    let mediaUrl = message.audioMessage.url;

    if (message.audioMessage.url && (message.audioMessage.url.includes('mmg.whatsapp.net') || 
        message.audioMessage.url.includes('pps.whatsapp.net') ||
        message.audioMessage.mediaKey)) {
      mediaUrl = await decryptMedia(messageId, message.audioMessage, "audio", agentApiKey);
    }

    return {
      ...baseMessage,
      type: "audio",
      content: mediaUrl || "Audio",
      media_url: mediaUrl,
      metadata: {
        mime_type: message.audioMessage.mimetype,
        seconds: message.audioMessage.seconds,
        ptt: message.audioMessage.ptt || false,
      },
    };
  }

  // Mensaje de video
  if (message.videoMessage) {
    let mediaUrl = message.videoMessage.url;

    if (message.videoMessage.url && (message.videoMessage.url.includes('mmg.whatsapp.net') || 
        message.videoMessage.url.includes('pps.whatsapp.net') ||
        message.videoMessage.mediaKey)) {
      mediaUrl = await decryptMedia(messageId, message.videoMessage, "video", agentApiKey);
    }

    return {
      ...baseMessage,
      type: "video",
      content: mediaUrl || message.videoMessage.caption || "Video",
      media_url: mediaUrl,
      metadata: {
        mime_type: message.videoMessage.mimetype,
        caption: message.videoMessage.caption || "",
      },
    };
  }

  // Tipo de mensaje no reconocido
  console.warn("⚠️ Tipo de mensaje no reconocido:", Object.keys(message));
  
  return {
    ...baseMessage,
    type: "unknown",
    content: "Mensaje no soportado",
    metadata: {
      raw_message: message,
    },
  };
}

/**
 * Función helper para extraer el número de teléfono limpio
 */
export function extractPhoneNumber(remoteJid) {
  console.log("🔍 Extrayendo teléfono - Input:", remoteJid);
  
  let result = null;
  
  if (remoteJid.includes("@s.whatsapp.net")) {
    result = remoteJid.replace("@s.whatsapp.net", "");
    console.log("📞 Número válido WhatsApp:", result);
  } else if (remoteJid.includes("@lid")) {
    console.warn("⚠️ @lid detectado (NO es número real), ignorando");
    return null;
  } else if (remoteJid.includes("@g.us")) {
    console.warn("⚠️ Grupo detectado, ignorando");
    return null;
  } else {
    console.warn("⚠️ Formato desconocido, ignorando");
    return null;
  }
  
  if (result && (!/^\d+$/.test(result) || result.length < 10)) {
    console.warn("⚠️ Número sospechoso, ignorando");
    return null;
  }
  
  return result;
}

/**
 * Función para verificar si es un mensaje de grupo
 */
export function isGroupMessage(remoteJid) {
  return remoteJid.includes("@g.us");
}

/**
 * Función para verificar si es un JID válido de WhatsApp personal
 */
export function isValidWhatsAppNumber(remoteJid) {
  return remoteJid.includes("@s.whatsapp.net");
}

/**
 * Obtener historial de chat usando estructura normalizada
 */
export async function getChatHistory(telefono, propietario = "FroIT", limit = 50, offset = 0) {
  try {
    const { data, error } = await supabase.rpc("get_chat_messages", {
      p_telefono: telefono,
      p_propietario: propietario,
      p_limit: limit,
      p_offset: offset
    });

    if (error) {
      console.error("Error obteniendo historial:", error);
      return { success: false, error };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error en getChatHistory:", error);
    return { success: false, error };
  }
}
