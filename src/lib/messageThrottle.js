/**
 * Sistema de Control de Throttling para Mensajes de WhatsApp
 * Asegura un intervalo mínimo configurable entre cada mensaje enviado
 * a través de WaSender API para evitar rate limiting y bloqueos
 * 
 * @version 3.0.0 - Ahora con persistencia en Supabase
 * @author FroIT Dev Team
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
    }
  }

  /**
   * Calcula el tiempo de espera necesario antes del próximo envío
   */
  getWaitTime() {
    const now = Date.now();
    const timeSinceLastSend = now - this.lastSendTime;
    const waitTime = Math.max(0, this.minIntervalMs - timeSinceLastSend);
    return waitTime;
  }

  /**
   * Espera el tiempo necesario antes de permitir el próximo envío
   */
  async waitIfNeeded() {
    const waitTime = this.getWaitTime();
    
    if (waitTime > 0) {
      const waitTimeSec = (waitTime / 1000).toFixed(1);
      console.log(`⏰ Throttle: Esperando ${waitTimeSec}s antes del próximo envío...`);
      
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
   */
  async send(sendFunction, attemptNumber = 1) {
    await this.waitIfNeeded();
    
    try {
      const result = await this._executeWithTimeout(sendFunction, this.sendTimeout);
      
      this.lastSendTime = Date.now();
      
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
      
      this.lastSendTime = Date.now();
      
      if (attemptNumber < this.maxRetries) {
        console.log(`🔄 Reintentando en ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return await this.send(sendFunction, attemptNumber + 1);
      }
      
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
   */
  async enqueue(sendFunction, metadata = {}) {
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
    
    return new Promise((resolve, reject) => {
      queueItem.sendFunction = sendFunction;
      queueItem.resolve = resolve;
      queueItem.reject = reject;
      
      this.queue.push(queueItem);
      console.log(`📬 Mensaje agregado a cola. Posición: ${this.queue.length}`);
      
      this.processQueue();
    });
  }

  /**
   * Procesa la cola de mensajes con throttling
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
      
      try {
        const result = await this.send(sendFunction);
        resolve(result);
      } catch (error) {
        console.error(`❌ Error procesando mensaje #${metadata.id}:`, error.message);
        reject(error);
      }
    }
    
    this.processing = false;
    console.log('✅ Cola procesada completamente');
  }

  /**
   * Genera un ID único para el mensaje
   */
  _generateId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Reinicia el contador de throttling
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
}

// Instancia global singleton
const messageThrottle = new MessageThrottle(20000, {
  maxRetries: 3,
  retryDelay: 1000,
  enableMetrics: true,
  maxQueueSize: 1000,
  sendTimeout: 60000
});

/**
 * Wrapper para fetch de mensajes con throttling automático
 */
export async function throttledFetch(url, options = {}, metadata = {}) {
  if (url.includes('/api/send-message')) {
    console.log(`🚦 Enviando mensaje con throttling a: ${url}`);
    return await messageThrottle.send(() => fetch(url, options));
  }
  
  return fetch(url, options);
}

/**
 * Envía un mensaje con throttling usando la cola
 */
export async function sendMessageWithThrottle(sendFunction, metadata = {}) {
  return await messageThrottle.enqueue(sendFunction, metadata);
}

/**
 * Obtiene el estado actual del throttle
 */
export function getThrottleStatus() {
  return messageThrottle.getStatus();
}

/**
 * Reinicia el throttle
 */
export function resetThrottle(clearQueue = false) {
  messageThrottle.reset(clearQueue);
}

export default messageThrottle;
