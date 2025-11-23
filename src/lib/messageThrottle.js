/**
 * Sistema de Control de Throttling para Mensajes de WhatsApp
 * Asegura un intervalo mínimo configurable entre cada mensaje enviado
 * a través de WaSender API para evitar rate limiting y bloqueos
 * 
 * @version 3.0.0 - Ahora con persistencia en Supabase
 * @author REMAX NOA Dev Team
 */

import { createClient } from '@supabase/supabase-js';

// Cliente Supabase para persistencia
let supabaseClient = null;

// Inicializar cliente Supabase
function initSupabase() {
  if (!supabaseClient && typeof process !== 'undefined' && process.env) {
    try {
      supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON
      );
      console.log('✅ Supabase inicializado para persistencia de cola');
    } catch (error) {
      console.warn('⚠️ No se pudo inicializar Supabase:', error.message);
    }
  }
  return supabaseClient;
}

class MessageThrottle {
  /**
   * Crea una instancia del throttle
   * @param {number} minIntervalMs - Intervalo mínimo en milisegundos (default: 20000ms)
   * @param {Object} options - Opciones adicionales
   * @param {number} options.maxRetries - Número máximo de reintentos (default: 3)
   * @param {number} options.retryDelay - Delay entre reintentos en ms (default: 1000)
   * @param {boolean} options.enableMetrics - Habilitar métricas de envío (default: true)
   * @param {boolean} options.enablePersistence - Habilitar persistencia en Supabase (default: true)
   */
  constructor(minIntervalMs = 20000, options = {}) {
    this.minIntervalMs = minIntervalMs;
    this.lastSendTime = 0;
    this.queue = [];
    this.processing = false;
    
    // Opciones configurables
    this.maxRetries = options.maxRetries ?? 3;
    this.retryDelay = options.retryDelay ?? 1000;
    this.enableMetrics = options.enableMetrics ?? true;
    this.enablePersistence = options.enablePersistence ?? true;
    
    // Métricas de rendimiento
    this.metrics = {
      totalSent: 0,
      totalFailed: 0,
      totalRetries: 0,
      averageWaitTime: 0,
      lastError: null,
      startTime: Date.now()
    };
    
    // Límite de cola para evitar desbordamiento de memoria
    this.maxQueueSize = options.maxQueueSize ?? 1000;
    
    // Timeout para detectar envíos colgados
    this.sendTimeout = options.sendTimeout ?? 60000; // 60 segundos
    
    // Inicializar Supabase si la persistencia está habilitada
    if (this.enablePersistence) {
      this.supabase = initSupabase();
      // Cargar cola pendiente al iniciar
      this._loadQueueFromSupabase();
    }
  }

  /**
   * Calcula el tiempo de espera necesario antes del próximo envío
   * @returns {number} Milisegundos a esperar
   */
  getWaitTime() {
    const now = Date.now();
    const timeSinceLastSend = now - this.lastSendTime;
    const waitTime = Math.max(0, this.minIntervalMs - timeSinceLastSend);
    return waitTime;
  }

  /**
   * Espera el tiempo necesario antes de permitir el próximo envío
   * @returns {Promise<void>}
   */
  async waitIfNeeded() {
    const waitTime = this.getWaitTime();
    
    if (waitTime > 0) {
      const waitTimeSec = (waitTime / 1000).toFixed(1);
      console.log(`⏰ Throttle: Esperando ${waitTimeSec}s antes del próximo envío...`);
      
      // Actualizar métrica de tiempo de espera promedio
      if (this.enableMetrics) {
        const totalWaits = this.metrics.totalSent + 1;
        this.metrics.averageWaitTime = 
          (this.metrics.averageWaitTime * (totalWaits - 1) + waitTime) / totalWaits;
      }
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  /**
   * Ejecuta una función de envío con throttling y reintentos automáticos
   * @param {Function} sendFunction - Función asíncrona que realiza el envío
   * @param {number} attemptNumber - Número de intento actual (interno)
   * @returns {Promise} Resultado de la función de envío
   */
  async send(sendFunction, attemptNumber = 1) {
    await this.waitIfNeeded();
    
    try {
      // Ejecutar con timeout para evitar colgamientos
      const result = await this._executeWithTimeout(sendFunction, this.sendTimeout);
      
      this.lastSendTime = Date.now();
      
      // Actualizar métricas
      if (this.enableMetrics) {
        this.metrics.totalSent++;
        if (attemptNumber > 1) {
          this.metrics.totalRetries += (attemptNumber - 1);
        }
      }
      
      const intervalSec = (this.minIntervalMs / 1000);
      console.log(`✅ Mensaje enviado exitosamente. Próximo disponible en ${intervalSec}s`);
      
      return result;
      
    } catch (error) {
      console.error(`❌ Error en envío (intento ${attemptNumber}/${this.maxRetries}):`, error.message);
      
      // Actualizar timestamp incluso en error para evitar spam
      this.lastSendTime = Date.now();
      
      // Reintentar si quedan intentos
      if (attemptNumber < this.maxRetries) {
        console.log(`🔄 Reintentando en ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return await this.send(sendFunction, attemptNumber + 1);
      }
      
      // Si se agotaron los reintentos, actualizar métricas y lanzar error
      if (this.enableMetrics) {
        this.metrics.totalFailed++;
        this.metrics.lastError = {
          message: error.message,
          timestamp: new Date().toISOString(),
          attempts: attemptNumber
        };
      }
      
      throw new Error(`Falló después de ${attemptNumber} intentos: ${error.message}`);
    }
  }

  /**
   * Ejecuta una función con timeout
   * @private
   * @param {Function} fn - Función a ejecutar
   * @param {number} timeoutMs - Timeout en milisegundos
   * @returns {Promise} Resultado de la función
   */
  async _executeWithTimeout(fn, timeoutMs) {
    return Promise.race([
      fn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: El envío tardó demasiado')), timeoutMs)
      )
    ]);
  }

  /**
   * Agrega un mensaje a la cola y procesa automáticamente
   * @param {Function} sendFunction - Función asíncrona que realiza el envío
   * @param {Object} metadata - Metadatos opcionales del mensaje
   * @returns {Promise} Promesa que se resuelve cuando el mensaje es enviado
   */
  async enqueue(sendFunction, metadata = {}) {
    // Verificar límite de cola
    if (this.queue.length >= this.maxQueueSize) {
      const error = new Error(`Cola llena: ${this.maxQueueSize} mensajes en espera`);
      console.error('❌', error.message);
      throw error;
    }
    
    const messageId = this._generateId();
    const queueItem = {
      id: messageId,
      metadata: {
        ...metadata,
        enqueuedAt: Date.now(),
        id: messageId,
        phone: metadata.phone || 'unknown',
        messageType: metadata.type || 'text'
      }
    };
    
    // Guardar en Supabase si la persistencia está habilitada
    if (this.enablePersistence && this.supabase) {
      await this._saveToSupabase(queueItem);
    }
    
    return new Promise((resolve, reject) => {
      queueItem.sendFunction = sendFunction;
      queueItem.resolve = resolve;
      queueItem.reject = reject;
      
      this.queue.push(queueItem);
      console.log(`📬 Mensaje agregado a cola. Posición: ${this.queue.length}`);
      
      // Iniciar procesamiento si no está activo
      this.processQueue();
    });
  }

  /**
   * Guarda un mensaje en Supabase
   * @private
   * @param {Object} queueItem - Item de la cola a guardar
   */
  async _saveToSupabase(queueItem) {
    if (!this.supabase) return;
    
    try {
      const { error } = await this.supabase
        .from('message_queue')
        .insert({
          id: queueItem.id,
          phone: queueItem.metadata.phone,
          message_type: queueItem.metadata.messageType,
          metadata: queueItem.metadata,
          status: 'pending',
          enqueued_at: new Date(queueItem.metadata.enqueuedAt).toISOString(),
          retry_count: 0
        });
      
      if (error) {
        console.error('❌ Error guardando en Supabase:', error.message);
      } else {
        console.log(`💾 Mensaje ${queueItem.id} guardado en Supabase`);
      }
    } catch (error) {
      console.error('❌ Error en _saveToSupabase:', error.message);
    }
  }

  /**
   * Actualiza el estado de un mensaje en Supabase
   * @private
   * @param {string} messageId - ID del mensaje
   * @param {string} status - Nuevo estado ('processing', 'sent', 'failed')
   * @param {Object} details - Detalles adicionales
   */
  async _updateSupabaseStatus(messageId, status, details = {}) {
    if (!this.supabase || !this.enablePersistence) return;
    
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'sent') {
        updateData.sent_at = new Date().toISOString();
      } else if (status === 'failed') {
        updateData.error_message = details.error;
        updateData.retry_count = details.retryCount || 0;
      }
      
      const { error } = await this.supabase
        .from('message_queue')
        .update(updateData)
        .eq('id', messageId);
      
      if (error) {
        console.error(`❌ Error actualizando estado en Supabase:`, error.message);
      }
    } catch (error) {
      console.error('❌ Error en _updateSupabaseStatus:', error.message);
    }
  }

  /**
   * Elimina un mensaje de Supabase después de ser procesado
   * @private
   * @param {string} messageId - ID del mensaje
   */
  async _deleteFromSupabase(messageId) {
    if (!this.supabase || !this.enablePersistence) return;
    
    try {
      const { error } = await this.supabase
        .from('message_queue')
        .delete()
        .eq('id', messageId);
      
      if (error) {
        console.error(`❌ Error eliminando de Supabase:`, error.message);
      } else {
        console.log(`�️ Mensaje ${messageId} eliminado de Supabase`);
      }
    } catch (error) {
      console.error('❌ Error en _deleteFromSupabase:', error.message);
    }
  }

  /**
   * Carga mensajes pendientes de Supabase al iniciar
   * @private
   */
  async _loadQueueFromSupabase() {
    if (!this.supabase) return;
    
    try {
      console.log('📥 Cargando cola pendiente desde Supabase...');
      
      const { data, error } = await this.supabase
        .from('message_queue')
        .select('*')
        .in('status', ['pending', 'processing'])
        .order('enqueued_at', { ascending: true });
      
      if (error) {
        console.error('❌ Error cargando cola desde Supabase:', error.message);
        return;
      }
      
      if (data && data.length > 0) {
        console.log(`📦 Se encontraron ${data.length} mensajes pendientes en Supabase`);
        
        // Aquí necesitarías reconstruir las funciones de envío
        // Esto es complejo porque las funciones no se pueden serializar
        // Una solución es guardar los datos del mensaje y recrear la función
        console.warn('⚠️ Mensajes pendientes detectados. Requieren procesamiento manual.');
        console.warn('⚠️ Para implementar recuperación completa, considera guardar datos del mensaje en lugar de funciones.');
      } else {
        console.log('✅ No hay mensajes pendientes en Supabase');
      }
    } catch (error) {
      console.error('❌ Error en _loadQueueFromSupabase:', error.message);
    }
  }

  /**
   * Procesa la cola de mensajes con throttling
   * @returns {Promise<void>}
   */
  async processQueue() {
    if (this.processing) {
      console.log('🔄 Cola ya está siendo procesada...');
      return;
    }
    
    if (this.queue.length === 0) return;
    
    this.processing = true;
    console.log(`🚀 Iniciando procesamiento de cola (${this.queue.length} mensajes)`);
    
    while (this.queue.length > 0) {
      const { sendFunction, resolve, reject, metadata } = this.queue.shift();
      
      const waitTime = Date.now() - metadata.enqueuedAt;
      console.log(`📤 Procesando mensaje #${metadata.id} (esperó ${(waitTime / 1000).toFixed(1)}s en cola)`);
      
      // Actualizar estado a "processing" en Supabase
      if (this.enablePersistence && this.supabase) {
        await this._updateSupabaseStatus(metadata.id, 'processing');
      }
      
      try {
        const result = await this.send(sendFunction);
        
        // Actualizar estado a "sent" en Supabase
        if (this.enablePersistence && this.supabase) {
          await this._updateSupabaseStatus(metadata.id, 'sent');
          // Eliminar después de envío exitoso
          await this._deleteFromSupabase(metadata.id);
        }
        
        resolve(result);
      } catch (error) {
        console.error(`❌ Error procesando mensaje #${metadata.id}:`, error.message);
        
        // Actualizar estado a "failed" en Supabase
        if (this.enablePersistence && this.supabase) {
          await this._updateSupabaseStatus(metadata.id, 'failed', {
            error: error.message,
            retryCount: this.maxRetries
          });
        }
        
        reject(error);
      }
    }
    
    this.processing = false;
    console.log('✅ Cola procesada completamente');
  }

  /**
   * Genera un ID único para el mensaje
   * @private
   * @returns {string} ID único
   */
  _generateId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Reinicia el contador de throttling
   * @param {boolean} clearQueue - Si debe limpiar la cola también
   */
  reset(clearQueue = false) {
    this.lastSendTime = 0;
    
    if (clearQueue) {
      const queueSize = this.queue.length;
      this.queue = [];
      console.log(`🔄 Throttle reiniciado (${queueSize} mensajes en cola eliminados)`);
    } else {
      console.log('🔄 Throttle reiniciado (cola preservada)');
    }
  }

  /**
   * Obtiene el estado actual del throttle con métricas detalladas
   * @returns {Object} Estado completo del throttle
   */
  getStatus() {
    const waitTime = this.getWaitTime();
    const uptime = Date.now() - this.metrics.startTime;
    const successRate = this.metrics.totalSent + this.metrics.totalFailed > 0
      ? ((this.metrics.totalSent / (this.metrics.totalSent + this.metrics.totalFailed)) * 100).toFixed(2)
      : 0;
    
    return {
      throttle: {
        isReady: waitTime === 0,
        waitTimeMs: waitTime,
        waitTimeSec: (waitTime / 1000).toFixed(1),
        minIntervalMs: this.minIntervalMs,
        minIntervalSec: (this.minIntervalMs / 1000)
      },
      queue: {
        length: this.queue.length,
        processing: this.processing,
        maxSize: this.maxQueueSize
      },
      metrics: this.enableMetrics ? {
        totalSent: this.metrics.totalSent,
        totalFailed: this.metrics.totalFailed,
        totalRetries: this.metrics.totalRetries,
        successRate: `${successRate}%`,
        averageWaitTimeSec: (this.metrics.averageWaitTime / 1000).toFixed(2),
        uptimeSec: (uptime / 1000).toFixed(0),
        lastError: this.metrics.lastError
      } : null,
      config: {
        maxRetries: this.maxRetries,
        retryDelayMs: this.retryDelay,
        sendTimeoutMs: this.sendTimeout
      },
      lastSendTime: this.lastSendTime
        ? new Date(this.lastSendTime).toISOString()
        : 'Nunca'
    };
  }

  /**
   * Obtiene un reporte resumido del estado
   * @returns {string} Reporte formateado
   */
  getStatusReport() {
    const status = this.getStatus();
    const lines = [
      '╔══════════════════════════════════════════════╗',
      '║      REPORTE DEL SISTEMA DE THROTTLING       ║',
      '╠══════════════════════════════════════════════╣',
      `║ Estado: ${status.throttle.isReady ? '🟢 Listo' : '🟡 Esperando'} (${status.throttle.waitTimeSec}s)`,
      `║ Intervalo: ${status.throttle.minIntervalSec}s entre mensajes`,
      `║ Cola: ${status.queue.length} mensajes ${status.queue.processing ? '(procesando)' : ''}`,
      '╠══════════════════════════════════════════════╣'
    ];
    
    if (status.metrics) {
      lines.push(
        `║ 📊 Enviados: ${status.metrics.totalSent}`,
        `║ ❌ Fallidos: ${status.metrics.totalFailed}`,
        `║ 🔄 Reintentos: ${status.metrics.totalRetries}`,
        `║ ✅ Tasa de éxito: ${status.metrics.successRate}`,
        `║ ⏱️  Espera promedio: ${status.metrics.averageWaitTimeSec}s`,
        `║ 🕐 Uptime: ${status.metrics.uptimeSec}s`,
        '╠══════════════════════════════════════════════╣'
      );
    }
    
    lines.push(
      `║ Último envío: ${status.lastSendTime}`,
      '╚══════════════════════════════════════════════╝'
    );
    
    return lines.join('\n');
  }

  /**
   * Limpia métricas y reinicia contadores
   */
  clearMetrics() {
    this.metrics = {
      totalSent: 0,
      totalFailed: 0,
      totalRetries: 0,
      averageWaitTime: 0,
      lastError: null,
      startTime: Date.now()
    };
    console.log('📊 Métricas limpiadas');
  }
}

// Instancia global singleton con configuración por defecto
const messageThrottle = new MessageThrottle(20000, {
  maxRetries: 3,
  retryDelay: 1000,
  enableMetrics: true,
  maxQueueSize: 1000,
  sendTimeout: 60000
});

/**
 * Wrapper para fetch de mensajes con throttling automático
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones de fetch
 * @param {Object} metadata - Metadatos opcionales
 * @returns {Promise<Response>} Respuesta del fetch
 */
export async function throttledFetch(url, options = {}, metadata = {}) {
  if (url.includes('/api/send-message')) {
    console.log(`🚦 Enviando mensaje con throttling a: ${url}`);
    return await messageThrottle.send(() => fetch(url, options));
  }
  
  // Si no es un endpoint de envío de mensajes, ejecutar normalmente
  return fetch(url, options);
}

/**
 * Envía un mensaje con throttling usando la cola
 * @param {Function} sendFunction - Función que realiza el envío
 * @param {Object} metadata - Metadatos opcionales del mensaje
 * @returns {Promise} Resultado del envío
 */
export async function sendMessageWithThrottle(sendFunction, metadata = {}) {
  return await messageThrottle.enqueue(sendFunction, metadata);
}

/**
 * Obtiene el estado actual del throttle
 * @returns {Object} Estado del throttle
 */
export function getThrottleStatus() {
  return messageThrottle.getStatus();
}

/**
 * Obtiene un reporte formateado del estado
 * @returns {string} Reporte del throttle
 */
export function getThrottleReport() {
  return messageThrottle.getStatusReport();
}

/**
 * Reinicia el throttle
 * @param {boolean} clearQueue - Si debe limpiar la cola también
 */
export function resetThrottle(clearQueue = false) {
  messageThrottle.reset(clearQueue);
}

/**
 * Limpia las métricas del throttle
 */
export function clearThrottleMetrics() {
  messageThrottle.clearMetrics();
}

/**
 * Crea una nueva instancia de throttle con configuración personalizada
 * @param {number} minIntervalMs - Intervalo mínimo en milisegundos
 * @param {Object} options - Opciones de configuración
 * @returns {MessageThrottle} Nueva instancia
 */
export function createThrottle(minIntervalMs, options = {}) {
  return new MessageThrottle(minIntervalMs, options);
}

export default messageThrottle;
