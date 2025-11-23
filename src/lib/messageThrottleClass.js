/**
 * Clase MessageThrottle - Sistema de Control de Throttling para Mensajes
 * Exportada como clase reutilizable
 * 
 * @version 1.0.0
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

export class MessageThrottle {
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
    this.agentCode = options.agentCode || 'default';
    
    // Opciones configurables
    this.maxRetries = options.maxRetries ?? 3;
    this.retryDelay = options.retryDelay ?? 1000;
    this.enableMetrics = options.enableMetrics ?? true;
    this.enablePersistence = options.enablePersistence ?? false; // Deshabilitado por defecto para evitar problemas
    
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
      console.log(`⏰ [${this.agentCode}] Esperando ${waitTimeSec}s antes del próximo envío...`);
      
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
      console.log(`✅ [${this.agentCode}] Mensaje enviado. Próximo disponible en ${intervalSec}s`);
      
      return result;
      
    } catch (error) {
      console.error(`❌ [${this.agentCode}] Error en envío (intento ${attemptNumber}/${this.maxRetries}):`, error.message);
      
      this.lastSendTime = Date.now();
      
      if (attemptNumber < this.maxRetries) {
        console.log(`🔄 [${this.agentCode}] Reintentando en ${this.retryDelay}ms...`);
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
      console.error(`❌ [${this.agentCode}]`, error.message);
      throw error;
    }
    
    const messageId = this._generateId();
    const queueItem = {
      id: messageId,
      metadata: {
        ...metadata,
        enqueuedAt: Date.now(),
        id: messageId,
        agentCode: this.agentCode
      }
    };
    
    return new Promise((resolve, reject) => {
      queueItem.sendFunction = sendFunction;
      queueItem.resolve = resolve;
      queueItem.reject = reject;
      
      this.queue.push(queueItem);
      console.log(`📬 [${this.agentCode}] Mensaje agregado a cola. Posición: ${this.queue.length}`);
      
      this.processQueue();
    });
  }

  /**
   * Procesa la cola de mensajes con throttling
   */
  async processQueue() {
    if (this.processing) {
      console.log(`🔄 [${this.agentCode}] Cola ya está siendo procesada...`);
      return;
    }
    
    if (this.queue.length === 0) return;
    
    this.processing = true;
    console.log(`🚀 [${this.agentCode}] Iniciando procesamiento de cola (${this.queue.length} mensajes)`);
    
    while (this.queue.length > 0) {
      const { sendFunction, resolve, reject, metadata } = this.queue.shift();
      
      const waitTime = Date.now() - metadata.enqueuedAt;
      console.log(`📤 [${this.agentCode}] Procesando mensaje #${metadata.id} (esperó ${(waitTime / 1000).toFixed(1)}s en cola)`);
      
      try {
        const result = await this.send(sendFunction);
        resolve(result);
      } catch (error) {
        console.error(`❌ [${this.agentCode}] Error procesando mensaje #${metadata.id}:`, error.message);
        reject(error);
      }
    }
    
    this.processing = false;
    console.log(`✅ [${this.agentCode}] Cola procesada completamente`);
  }

  /**
   * Genera un ID único para el mensaje
   */
  _generateId() {
    return `msg_${this.agentCode}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Reinicia el contador de throttling
   */
  reset(clearQueue = false) {
    this.lastSendTime = 0;
    
    if (clearQueue) {
      const queueSize = this.queue.length;
      this.queue = [];
      console.log(`🔄 [${this.agentCode}] Throttle reiniciado (${queueSize} mensajes eliminados)`);
    } else {
      console.log(`🔄 [${this.agentCode}] Throttle reiniciado (cola preservada)`);
    }
  }

  /**
   * Obtiene el estado actual del throttle
   */
  getStatus() {
    const waitTime = this.getWaitTime();
    const uptime = Date.now() - this.metrics.startTime;
    const successRate = this.metrics.totalSent + this.metrics.totalFailed > 0
      ? ((this.metrics.totalSent / (this.metrics.totalSent + this.metrics.totalFailed)) * 100).toFixed(2)
      : 0;
    
    return {
      agentCode: this.agentCode,
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
   */
  getStatusReport() {
    const status = this.getStatus();
    const lines = [
      '╔══════════════════════════════════════════════╗',
      `║      THROTTLE - AGENTE: ${this.agentCode.padEnd(22)}║`,
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
    console.log(`📊 [${this.agentCode}] Métricas limpiadas`);
  }
}

export default MessageThrottle;
