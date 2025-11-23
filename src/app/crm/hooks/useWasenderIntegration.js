// Hook personalizado para WasenderAPI y nueva estructura de BD
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase simple
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
);

export const useWasenderIntegration = () => {
  const { data: session } = useSession();
  const [agentConfig, setAgentConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  
  // ⚠️ Estados de verificación de sesión REMOVIDOS - Ahora se manejan en el componente principal

  // Inicializar configuración del agente
  useEffect(() => {
    const initializeAgent = async () => {
      if (!session?.user?.email) return;

      try {
        setLoading(true);
        
        const { data: agent, error: agentError } = await supabase
          .from('agent_sessions')
          .select('*')
          .eq('email', session.user.email)
          .eq('estado_sesion', 'active')
          .maybeSingle();

        if (agentError) {
          console.error('Error consultando agent_sessions:', agentError.message);
          throw new Error(agentError.message);
        }

        if (agent) {
          setAgentConfig(agent);
        } else {
          setError('No se encontró configuración de agente para este usuario');
        }
      } catch (err) {
        console.error('Error inicializando agente:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAgent();
  }, [session?.user?.email]);

  // ✅ NUEVO: Suscripción Realtime para actualizar read_status de mensajes
  useEffect(() => {
    if (!agentConfig?.agent_code) return;

    const channel = supabase
      .channel('messages-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `propietario=eq.${agentConfig.agent_code}`
        },
        (payload) => {
          const newMessage = payload.new;

          // Agregar el nuevo mensaje al estado
          setMessages(prev => {
            const updated = { ...prev };
            
            // Agregar por chat_id
            if (newMessage.chat_id) {
              const existingMessages = updated[newMessage.chat_id] || [];
              
              // Verificar que no exista ya (evitar duplicados)
              const alreadyExists = existingMessages.some(m => m.id === newMessage.id);
              
              if (!alreadyExists) {
                // Transformar mensaje para compatibilidad
                const transformedMessage = {
                  message_id: newMessage.id,
                  id: newMessage.id,
                  type: newMessage.type,
                  status: newMessage.status,
                  content: newMessage.content,
                  metadata: newMessage.metadata,
                  direction: newMessage.direction,
                  media_url: newMessage.media_url,
                  message_timestamp: newMessage.message_timestamp,
                  chat_id: newMessage.chat_id,
                  read_status: newMessage.read_status,
                  reactions: newMessage.reactions || []
                };
                
                updated[newMessage.chat_id] = [...existingMessages, transformedMessage];
              }
            }
            
            return updated;
          });

          // Actualizar último mensaje del chat
          setChats(prevChats => {
            return prevChats.map(chat => {
              if (chat.id === newMessage.chat_id) {
                return {
                  ...chat,
                  ultimo_mensaje_asistente: newMessage.direction === 'incoming' ? newMessage.content : chat.ultimo_mensaje_asistente,
                  ultimo_mensaje_timestamp: newMessage.message_timestamp
                };
              }
              return chat;
            });
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `propietario=eq.${agentConfig.agent_code}`
        },
        (payload) => {
          const updatedMessage = payload.new;
          const readStatusChanged = payload.old.read_status !== updatedMessage.read_status;
          const reactionsChanged = JSON.stringify(payload.old.reactions) !== JSON.stringify(updatedMessage.reactions);
          
          if (readStatusChanged || reactionsChanged) {
          

            // Actualizar el mensaje en el estado
            setMessages(prev => {
              const updated = { ...prev };
              let messageUpdated = false;

              // Buscar y actualizar en todos los chats
              Object.keys(updated).forEach(chatKey => {
                if (Array.isArray(updated[chatKey])) {
                  updated[chatKey] = updated[chatKey].map(msg => {
                    if (msg.id === updatedMessage.id) {
                      messageUpdated = true;
                      return {
                        ...msg,
                        read_status: updatedMessage.read_status,
                        reactions: updatedMessage.reactions || [] // ✅ NUEVO: Actualizar reactions
                      };
                    }
                    return msg;
                  });
                }
              });

         
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentConfig?.agent_code]);

  // Cargar lista de chats del agente
  const loadChats = useCallback(async () => {
    if (!agentConfig) {
      return [];
    }

    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select(`
          *,
          messages!messages_chat_id_fkey (
            content,
            message_timestamp,
            direction,
            type
          )
        `)
        .eq('propietario', agentConfig.agent_code)
        .order('ultimo_mensaje_timestamp', { ascending: false, nullsLast: true });

      if (chatsError) {
        console.error('Error consultando chats:', chatsError.message);
        throw new Error(chatsError.message);
      }

      // ✅ OPTIMIZADO: Procesar chats y obtener último mensaje
      const chatsWithPictures = (chatsData || []).map((chat) => {
        // ✅ Obtener el último mensaje del array de messages
        let lastMessage = null;
        let lastMessageTime = chat.ultimo_mensaje_timestamp;
        
        if (chat.messages && chat.messages.length > 0) {
          // Ordenar mensajes por timestamp y obtener el último
          const sortedMessages = [...chat.messages].sort((a, b) => 
            new Date(b.message_timestamp) - new Date(a.message_timestamp)
          );
          const ultimoMensaje = sortedMessages[0];
          
          // Formatear el contenido del mensaje
          if (ultimoMensaje.type === 'text') {
            lastMessage = ultimoMensaje.content;
          } else {
            // Para mensajes multimedia, mostrar el tipo
            const tipoMap = {
              image: '📷 Imagen',
              video: '🎥 Video',
              audio: '🎵 Audio',
              document: '📄 Documento',
              file: '📎 Archivo'
            };
            lastMessage = tipoMap[ultimoMensaje.type] || '📎 Archivo multimedia';
          }
          
          lastMessageTime = ultimoMensaje.message_timestamp;
        }
        
        // ✅ USAR picture_url DIRECTAMENTE DE LA BD (ya guardado por webhook)
        let pictureUrl = chat.picture_url;

        if (!pictureUrl) {
          if (chat.contact_name) {
            const sanitized = String(chat.contact_name).replace(/[^\w\s]/gi, '').trim();
            const initials = sanitized.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);
            pictureUrl = initials ? `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=128` : `https://ui-avatars.com/api/?name=?&background=6366f1&color=fff&size=128`;
          } else {
            pictureUrl = `https://ui-avatars.com/api/?name=?&background=6366f1&color=fff&size=128`;
          }
        }

        const etiquetas = chat.etiquetas || [];
        
        return {
          ...chat,
          picture_url: pictureUrl,
          etiquetas: etiquetas,
          last_message: lastMessage, // ✅ Último mensaje procesado
          last_message_time: lastMessageTime // ✅ Timestamp del último mensaje
        };
      });

      const transformedChats = chatsWithPictures.map(chat => ({
        id: chat.id,
        chat_id: chat.id,
        telefono: chat.telefono,
        contact_name: chat.contact_name,
        nombre_contacto: chat.contact_name,
        name: chat.contact_name,
        displayName: chat.contact_name,
        pushName: chat.push_name || chat.pushname,
        contact_email: chat.contact_email,
        propietario: chat.propietario,
        picture_url: chat.picture_url,
        created_at: chat.created_at,
        updated_at: chat.updated_at,
        ultimo_mensaje_asistente: chat.ultimo_mensaje_asistente,
        ultima_interaccion: chat.ultimo_mensaje_timestamp,
        ultimo_mensaje_timestamp: chat.ultimo_mensaje_timestamp,
        estado_embudo: chat.estado_embudo,
        tipo_cliente: chat.tipo_cliente,
        fuente: chat.fuente,
        etiquetas: chat.etiquetas || [], // ✅ AGREGADO: Etiquetas del cliente
        // ✅ NUEVO: Agregar último mensaje y fecha (ya procesados en el mapeo anterior)
        last_message: chat.last_message,
        last_message_time: chat.last_message_time,
        unread_count: chat.unread_count || 0,
        // Agregar otros campos necesarios
        urgencia: chat.urgencia,
        presupuesto: chat.presupuesto,
        zona: chat.zona,
        tipo_propiedad: chat.tipo_propiedad,
        intencion_operacion: chat.intencion_operacion
      }));

      setChats(transformedChats);
      setError(null);
      return transformedChats;
    } catch (err) {
      console.error('❌ Error cargando chats:', err);
      setError(`Error cargando chats: ${err.message}`);
      return [];
    }
  }, [agentConfig]);

  // Cargar mensajes de un chat específico
  const loadChatMessages = useCallback(async (telefono, limit = 50, offset = 0) => {
    if (!agentConfig || !telefono) {
      return [];
    }

    try {
      
      // ✅ DIRECTO: Primero buscar el chat por teléfono
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .select('id, telefono, contact_name, contact_email')
        .eq('telefono', telefono)
        .eq('propietario', agentConfig.agent_code)
        .maybeSingle();

      if (chatError) {
        console.error('Error buscando chat:', chatError.message);
        throw new Error(chatError.message);
      }

      if (!chat) {
        return [];
      }

      // ✅ DIRECTO: Obtener mensajes del chat
      const { data: mensajes, error: mensajesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat.id)
        .order('message_timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      if (mensajesError) {
        console.error('Error obteniendo mensajes:', mensajesError.message);
        throw new Error(mensajesError.message);
      }

      // Transformar mensajes para compatibilidad
      const transformedMessages = (mensajes || []).map(m => ({
        message_id: m.id,
        id: m.id,
        type: m.type,
        status: m.status,
        content: m.content,
        metadata: m.metadata,
        direction: m.direction,
        media_url: m.media_url,
        message_timestamp: m.message_timestamp,
        contact_name: chat.contact_name,
        contact_email: chat.contact_email,
        chat_id: m.chat_id,
        read_status: m.read_status, // ✅ Incluir read_status
        reactions: m.reactions || [] // ✅ NUEVO: Incluir reactions
      }));

      // Actualizar mensajes con AMBOS índices (telefono Y chat_id)
      setMessages(prev => ({
        ...prev,
        [telefono]: transformedMessages,
        [chat.id]: transformedMessages
      }));
      
      setError(null);
      return transformedMessages;
    } catch (err) {
      console.error('Error cargando mensajes:', err.message);
      setError(`Error cargando mensajes: ${err.message}`);
      return [];
    }
  }, [agentConfig]);

  // Enviar archivo multimedia usando WasenderAPI y guardar en Cloudinary
  const sendMedia = useCallback(async (telefono, file) => {
    if (!agentConfig || !telefono || !file) {
      return { success: false, error: 'Faltan datos para enviar archivo' };
    }

    try {
      // Convertir archivo a base64
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result;
          if (!result || typeof result !== "string" || !result.includes(",")) {
            return reject("Base64 inválido");
          }
          const base64String = result.split(",")[1];
          if (!base64String || base64String.length < 50) {
            return reject("Base64 vacío o incompleto");
          }
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });

      // Enviar archivo via WasenderAPI
      const response = await fetch(`/api/webhookCarlosRR/send-media/${agentConfig.agent_code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telefono,
          archivo: base64String,
          tipo: file.type,
          nombre: file.name
        })
      });

      const result = await response.json();

      if (result.success) {
        // Obtener la URL del archivo de la respuesta de WasenderAPI
        const wasenderUrl = result.data?.mediaUrl || result.data?.fileUrl;
        const messageId = result.data?.messageId;
        let finalMediaUrl = wasenderUrl; // URL por defecto de WasenderAPI
        
        if (wasenderUrl && messageId) {
          try {
            const cloudinaryResponse = await fetch('/api/webhookCarlosRR/save-wasender-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                wasenderUrl,
                messageId,
                chatId: telefono,
                metadata: {
                  file_name: file.name,
                  mime_type: file.type,
                  file_size: file.size
                }
              })
            });

            const cloudinaryResult = await cloudinaryResponse.json();

            if (cloudinaryResult.success && cloudinaryResult.cloudinaryUrl) {
              finalMediaUrl = cloudinaryResult.cloudinaryUrl;
            } else {
              console.warn('⚠️ Cloudinary no disponible, usando URL de WasenderAPI con decrypt');
              // Construir URL de WasenderAPI con decrypt
              finalMediaUrl = `/api/webhookCarlosRR/decrypt-media?url=${encodeURIComponent(wasenderUrl)}&messageId=${messageId}`;
            }
          } catch (cloudinaryError) {
            console.warn('⚠️ Error con Cloudinary, usando URL de WasenderAPI con decrypt:', cloudinaryError.message);
            // Construir URL de WasenderAPI con decrypt como fallback
            finalMediaUrl = `/api/webhookCarlosRR/decrypt-media?url=${encodeURIComponent(wasenderUrl)}&messageId=${messageId}`;
          }
        }

        // Actualizar el resultado con la URL final
        const updatedResult = {
          ...result,
          data: {
            ...result.data,
            mediaUrl: finalMediaUrl,
            cloudinaryUrl: finalMediaUrl.includes('cloudinary') ? finalMediaUrl : null,
            wasenderUrl: wasenderUrl
          }
        };

       

        // Evitar doble burbuja: no agregar mensaje local aquí.
        // La UI crea un optimista y lo consolida con la respuesta/realtime.
        setError(null);

        return { success: true, data: updatedResult.data };
      } else {
        throw new Error(result.error || 'Error enviando archivo');
      }
    } catch (err) {
      console.error('❌ Error enviando archivo multimedia:', err);
      const errorMessage = `Error enviando archivo: ${err.message}`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [agentConfig]);

  // Enviar mensaje usando WasenderAPI
  const sendMessage = useCallback(async (telefono, mensaje, tipo = 'text') => {
    if (!agentConfig || !telefono || !mensaje) {
      return { success: false, error: 'Faltan datos para enviar mensaje' };
    }

    try {
      const response = await fetch(`/api/webhookCarlosRR/test-message/${agentConfig.agent_code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telefono,
          mensaje
        })
      });

      const result = await response.json();

      if (result.success) {
        // Crear mensaje local para actualizar UI inmediatamente
        const newMessage = {
          message_id: result.data?.messageId || `local_${Date.now()}`,
          content: mensaje,
          type: tipo,
          direction: 'outgoing',
          status: 'sent',
          message_timestamp: new Date().toISOString(),
          contact_name: null,
          contact_email: null
        };

        // Actualizar mensajes localmente
        setMessages(prev => ({
          ...prev,
          [telefono]: [...(prev[telefono] || []), newMessage]
        }));

        // Limpiar errores previos
        setError(null);

        return { success: true, data: result.data };
      } else {
        throw new Error(result.error || 'Error enviando mensaje');
      }
    } catch (err) {
      console.error('❌ Error enviando mensaje:', err);
      const errorMessage = `Error enviando mensaje: ${err.message}`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [agentConfig]);

  // Marcar mensajes como leídos
  const markMessagesAsRead = useCallback(async (telefono) => {
    if (!agentConfig || !telefono) return;

    /* COMENTADO - Endpoint no existe
    try {
      const response = await fetch(`/api/webhookCarlosRR/chats/${agentConfig.agent_code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telefono,
          markAsRead: true
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Mensajes marcados como leídos');
        // Actualizar el estado local
        loadChats(); // Recargar lista de chats para actualizar contadores
      }
    } catch (err) {
      console.error('Error marcando mensajes como leídos:', err);
    }
    */
  }, [agentConfig]);

  // Buscar mensajes
  const searchMessages = useCallback(async (searchText, telefono = null) => {
    if (!agentConfig || !searchText) return [];

    try {
      // Implementar búsqueda usando la función SQL search_messages
      // Por ahora, buscar localmente en los mensajes cargados
      const allMessages = Object.values(messages).flat();
      return allMessages.filter(msg => 
        msg.content.toLowerCase().includes(searchText.toLowerCase())
      );
    } catch (err) {
      console.error('Error buscando mensajes:', err);
      return [];
    }
  }, [agentConfig, messages]);

  // ✅ NUEVO: Actualizar estado de mensaje individual (para messages.update webhook)
  const updateMessageStatus = useCallback((messageKey, newStatus) => {
    if (!messageKey || newStatus === undefined) return;

    setMessages(prev => {
      const updated = { ...prev };
      let messageUpdated = false;

      // Buscar y actualizar el mensaje en todos los chats
      Object.keys(updated).forEach(chatKey => {
        if (Array.isArray(updated[chatKey])) {
          updated[chatKey] = updated[chatKey].map(msg => {
            // Buscar por message_id o por key del webhook
            if (msg.message_id === messageKey.id || 
                msg.id === messageKey.id ||
                (msg.key?.id === messageKey.id && msg.key?.remoteJid === messageKey.remoteJid)) {
              messageUpdated = true;
              return {
                ...msg,
                status: newStatus,
                updated_at: new Date().toISOString()
              };
            }
            return msg;
          });
        }
      });

      return updated;
    });
  }, []);

  // ✅ NUEVO: Función para actualizar metadatos de un chat sin reordenar la lista
  const updateChatMetadata = useCallback((chatId, updates) => {
    setChats(prevChats => prevChats.map(chat => {
        if (chat.id === chatId || chat.telefono === chatId) {
          return {
            ...chat,
            ...updates
          };
        }
        return chat;
      }));
  }, []);

  return {
    agentConfig,
    loading,
    error,
    chats,
    messages,
    loadChats,
    loadChatMessages,
    sendMessage,
    sendMedia,
    markMessagesAsRead,
    searchMessages,
    updateMessageStatus, // ✅ NUEVO: Función para actualizar estados de mensajes
    updateChatMetadata, // ✅ NUEVO: Función para actualizar metadatos sin reordenar
    setError: (newError) => setError(newError),
    clearError: () => setError(null),
    // ✅ NUEVOS MÉTODOS para compatibilidad con Realtime
    refreshChats: loadChats, // Alias para loadChats
    refreshMessages: loadChatMessages, // Alias para loadChatMessages
    // ✅ Método para forzar actualización completa
    forceRefresh: useCallback(async () => {
      setLoading(true);
      try {
        await loadChats();
      } finally {
        setLoading(false);
      }
    }, [loadChats])
  };
};