/**
 * Ejemplo de Integración del Sistema de Webhooks con el CRM
 * Este archivo muestra cómo usar el sistema de webhooks en tu aplicación CRM
 */

import { createClient } from '@supabase/supabase-js';
import { throttledFetch } from '@/lib/messageThrottle';

// Inicializar Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
);

/**
 * Clase para manejar operaciones de WhatsApp en el CRM
 */
export class WhatsAppCRMService {
  constructor(agentCode) {
    this.agentCode = agentCode;
    this.agentConfig = null;
  }

  /**
   * Inicializa el servicio cargando la configuración del agente
   */
  async initialize() {
    const { data, error } = await supabase.rpc('get_agent_by_code', {
      p_agent_code: this.agentCode
    });

    if (error || !data) {
      throw new Error(`Agente ${this.agentCode} no encontrado`);
    }

    this.agentConfig = data;
    console.log('✅ Servicio inicializado para:', this.agentConfig.nombre_completo);
  }

  /**
   * Envía un mensaje de WhatsApp con throttling automático
   * 
   * @param {string} telefono - Número de teléfono destino (ej: 5491234567890)
   * @param {string} mensaje - Texto del mensaje
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendMessage(telefono, mensaje, options = {}) {
    if (!this.agentConfig) {
      await this.initialize();
    }

    const payload = {
      to: telefono,
      text: mensaje
    };

    if (this.agentConfig.session_id) {
      payload.sessionId = this.agentConfig.session_id;
    }

    // Usar throttledFetch para control automático de rate limiting
    const response = await throttledFetch(
      'https://www.wasenderapi.com/api/send-message',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.agentConfig.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      },
      { phone: telefono, type: 'text', agentCode: this.agentCode }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Error enviando mensaje: ${result.message || 'Unknown error'}`);
    }

    console.log('✅ Mensaje enviado exitosamente:', result);

    // Guardar el mensaje en la BD
    await this.saveOutgoingMessage(telefono, mensaje, result.messageId);

    return result;
  }

  /**
   * Envía un mensaje con imagen
   */
  async sendImage(telefono, imageUrl, caption = '') {
    if (!this.agentConfig) {
      await this.initialize();
    }

    const payload = {
      to: telefono,
      image: imageUrl,
      caption: caption
    };

    if (this.agentConfig.session_id) {
      payload.sessionId = this.agentConfig.session_id;
    }

    const response = await throttledFetch(
      'https://www.wasenderapi.com/api/send-message',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.agentConfig.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();
    return result;
  }

  /**
   * Envía un documento
   */
  async sendDocument(telefono, documentUrl, fileName = 'document.pdf') {
    if (!this.agentConfig) {
      await this.initialize();
    }

    const payload = {
      to: telefono,
      document: documentUrl,
      fileName: fileName
    };

    if (this.agentConfig.session_id) {
      payload.sessionId = this.agentConfig.session_id;
    }

    const response = await throttledFetch(
      'https://www.wasenderapi.com/api/send-message',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.agentConfig.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();
    return result;
  }

  /**
   * Obtiene el historial de chat de un contacto
   */
  async getChatHistory(telefono, limit = 50, offset = 0) {
    const response = await fetch(
      `/api/webhook/${this.agentCode}?telefono=${telefono}&limit=${limit}&offset=${offset}`
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(`Error obteniendo historial: ${data.error}`);
    }

    return data.data;
  }

  /**
   * Obtiene información de un contacto desde WasenderAPI
   */
  async getContactInfo(telefono) {
    if (!this.agentConfig) {
      await this.initialize();
    }

    const response = await fetch(
      `https://www.wasenderapi.com/api/contacts/${telefono}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.agentConfig.api_key}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = await response.json();

    if (result.success && result.data) {
      return {
        nombre: result.data.name || result.data.notify || 'Sin nombre',
        telefono: telefono,
        pictureUrl: result.data.picture || null,
        about: result.data.status || null
      };
    }

    return null;
  }

  /**
   * Guarda un mensaje saliente en la BD
   */
  async saveOutgoingMessage(telefono, content, messageId) {
    const { data, error } = await supabase.rpc('save_message_simple', {
      p_message_id: messageId,
      p_telefono: telefono,
      p_type: 'text',
      p_status: 'sent',
      p_content: content,
      p_metadata: { sent_from_crm: true },
      p_direction: 'outgoing',
      p_media_url: null,
      p_message_timestamp: new Date().toISOString(),
      p_propietario: this.agentCode,
      p_push_name: null
    });

    if (error) {
      console.error('Error guardando mensaje saliente:', error);
    }

    return data;
  }

  /**
   * Marca un chat como atendido por humano
   */
  async markAsAttendedByHuman(telefono) {
    const { error } = await supabase
      .from('chats')
      .update({ atendido_por_humano: true })
      .eq('telefono', telefono)
      .eq('propietario', this.agentCode);

    if (error) {
      console.error('Error marcando chat como atendido:', error);
      return false;
    }

    console.log('✅ Chat marcado como atendido por humano');
    return true;
  }

  /**
   * Obtiene todos los chats activos
   */
  async getActiveChats(limit = 50) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        messages (
          id,
          content,
          direction,
          created_at,
          type
        )
      `)
      .eq('propietario', this.agentCode)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error obteniendo chats:', error);
      return [];
    }

    // Procesar para incluir último mensaje
    return data.map(chat => ({
      ...chat,
      lastMessage: chat.messages[0] || null,
      messageCount: chat.messages.length
    }));
  }
}

/**
 * EJEMPLO DE USO EN UN COMPONENTE REACT
 */

// En tu componente de CRM:
/*
import { useState, useEffect } from 'react';
import { WhatsAppCRMService } from '@/lib/whatsappCRMService';

export default function CRMDashboard() {
  const [service] = useState(() => new WhatsAppCRMService('froit_support'));
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    const activeChats = await service.getActiveChats(50);
    setChats(activeChats);
  };

  const selectChat = async (chat) => {
    setSelectedChat(chat);
    const history = await service.getChatHistory(chat.telefono);
    setMessages(history);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    await service.sendMessage(selectedChat.telefono, newMessage);
    setNewMessage('');
    
    // Recargar mensajes
    const history = await service.getChatHistory(selectedChat.telefono);
    setMessages(history);
  };

  return (
    <div className="flex h-screen">
      // Lista de chats (izquierda)
      <div className="w-1/3 border-r">
        {chats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => selectChat(chat)}
            className="p-4 border-b cursor-pointer hover:bg-gray-50"
          >
            <h3>{chat.contact_name || chat.telefono}</h3>
            <p className="text-sm text-gray-600">
              {chat.lastMessage?.content}
            </p>
          </div>
        ))}
      </div>

      // Chat seleccionado (derecha)
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            // Cabecera
            <div className="p-4 border-b">
              <h2>{selectedChat.contact_name || selectedChat.telefono}</h2>
            </div>

            // Mensajes
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map(msg => (
                <div 
                  key={msg.id}
                  className={`mb-4 ${msg.direction === 'outgoing' ? 'text-right' : 'text-left'}`}
                >
                  <div className={`inline-block p-3 rounded-lg ${
                    msg.direction === 'outgoing' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                  }`}>
                    {msg.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            // Input de mensaje
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 p-2 border rounded"
                />
                <button 
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Enviar
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecciona un chat para comenzar
          </div>
        )}
      </div>
    </div>
  );
}
*/

/**
 * EJEMPLO DE USO EN API ROUTE (Next.js)
 */

// pages/api/send-whatsapp.js
/*
import { WhatsAppCRMService } from '@/lib/whatsappCRMService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { agentCode, telefono, mensaje } = req.body;

  if (!agentCode || !telefono || !mensaje) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  try {
    const service = new WhatsAppCRMService(agentCode);
    await service.initialize();
    
    const result = await service.sendMessage(telefono, mensaje);
    
    return res.status(200).json({
      success: true,
      messageId: result.messageId,
      status: result.status
    });
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
*/

/**
 * EJEMPLO DE USO CON RESPUESTAS AUTOMÁTICAS
 */

// Función para generar respuesta automática
/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAutoResponse(mensajeUsuario, historialChat = []) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Eres un asistente virtual de FroIT, una empresa que ofrece agentes de IA para WhatsApp.
        
        Tu objetivo es:
        - Responder preguntas sobre los servicios
        - Proporcionar información sobre precios
        - Agendar demos
        - Ser amable y profesional
        
        Los precios son:
        - Plan Base: $45/mes
        - Automatizaciones: $10 cada una
        - Microservicios: Variables según el tipo`
      },
      ...historialChat.map(msg => ({
        role: msg.direction === 'incoming' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: mensajeUsuario
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return completion.choices[0].message.content;
}

// Uso en el webhook
async function processIncomingMessage(telefono, messageData, propietario, agentConfig) {
  // Obtener historial
  const service = new WhatsAppCRMService(propietario);
  const historial = await service.getChatHistory(telefono, 10);
  
  // Verificar si debe responder automáticamente
  const chat = await supabase
    .from('chats')
    .select('atendido_por_humano')
    .eq('telefono', telefono)
    .eq('propietario', propietario)
    .single();
  
  if (!chat.data?.atendido_por_humano) {
    // Generar respuesta automática
    const respuesta = await generateAutoResponse(messageData.content, historial);
    
    // Enviar respuesta
    await service.sendMessage(telefono, respuesta);
  }
}
*/

export default WhatsAppCRMService;
