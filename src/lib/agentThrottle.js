/**
 * Sistema de Throttling por Agente para Mensajes de WhatsApp
 * Cada agente tiene su propia cola independiente para evitar interferencias
 * 
 * @version 1.0.0
 * @author REMAX NOA Dev Team
 */

import { MessageThrottle } from './messageThrottleClass.js';

/**
 * Mapa de instancias de throttle por agente
 * Key: agent_code
 * Value: MessageThrottle instance
 */
const agentThrottles = new Map();

/**
 * Configuración por defecto para cada agente
 */
const DEFAULT_CONFIG = {
  minIntervalMs: 20000, // 20 segundos entre mensajes
  maxRetries: 3,
  retryDelay: 1000,
  enableMetrics: true,
  maxQueueSize: 1000,
  sendTimeout: 60000,
  enablePersistence: true
};

/**
 * Obtiene o crea una instancia de throttle para un agente específico
 * @param {string} agentCode - Código único del agente
 * @param {Object} config - Configuración personalizada (opcional)
 * @returns {MessageThrottle} Instancia de throttle para el agente
 */
export function getAgentThrottle(agentCode, config = {}) {
  if (!agentCode) {
    throw new Error('Agent code es requerido');
  }

  // Si ya existe una instancia para este agente, retornarla
  if (agentThrottles.has(agentCode)) {
    return agentThrottles.get(agentCode);
  }

  // Crear nueva instancia con configuración personalizada o por defecto
  const throttleConfig = { ...DEFAULT_CONFIG, ...config };
  const throttle = new MessageThrottle(
    throttleConfig.minIntervalMs,
    {
      maxRetries: throttleConfig.maxRetries,
      retryDelay: throttleConfig.retryDelay,
      enableMetrics: throttleConfig.enableMetrics,
      maxQueueSize: throttleConfig.maxQueueSize,
      sendTimeout: throttleConfig.sendTimeout,
      enablePersistence: throttleConfig.enablePersistence,
      agentCode // Pasar el código del agente para identificación
    }
  );

  // Guardar en el mapa
  agentThrottles.set(agentCode, throttle);
  
  console.log(`✅ Throttle creado para agente: ${agentCode}`);
  
  return throttle;
}

/**
 * Envía un mensaje con throttling para un agente específico usando fetch
 * @param {string} agentCode - Código del agente
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones de fetch
 * @param {Object} metadata - Metadatos opcionales
 * @returns {Promise<Response>} Respuesta del fetch
 */
export async function throttledFetchForAgent(agentCode, url, options = {}, metadata = {}) {
  const throttle = getAgentThrottle(agentCode);
  
  console.log(`🚦 [${agentCode}] Enviando mensaje con throttling a: ${url}`);
  
  return await throttle.send(() => fetch(url, options));
}

/**
 * Envía un mensaje con throttling usando la cola para un agente específico
 * @param {string} agentCode - Código del agente
 * @param {Function} sendFunction - Función que realiza el envío
 * @param {Object} metadata - Metadatos opcionales del mensaje
 * @returns {Promise} Resultado del envío
 */
export async function sendMessageWithThrottleForAgent(agentCode, sendFunction, metadata = {}) {
  const throttle = getAgentThrottle(agentCode);
  
  return await throttle.enqueue(sendFunction, {
    ...metadata,
    agentCode
  });
}

/**
 * Obtiene el estado del throttle de un agente específico
 * @param {string} agentCode - Código del agente
 * @returns {Object|null} Estado del throttle o null si no existe
 */
export function getAgentThrottleStatus(agentCode) {
  const throttle = agentThrottles.get(agentCode);
  
  if (!throttle) {
    return null;
  }
  
  return {
    agentCode,
    ...throttle.getStatus()
  };
}

/**
 * Obtiene el reporte formateado del throttle de un agente
 * @param {string} agentCode - Código del agente
 * @returns {string|null} Reporte o null si no existe
 */
export function getAgentThrottleReport(agentCode) {
  const throttle = agentThrottles.get(agentCode);
  
  if (!throttle) {
    return null;
  }
  
  return `[AGENTE: ${agentCode}]\n${throttle.getStatusReport()}`;
}

/**
 * Obtiene el estado de todos los agentes
 * @returns {Object} Mapa de estados por agente
 */
export function getAllAgentsStatus() {
  const status = {};
  
  for (const [agentCode, throttle] of agentThrottles.entries()) {
    status[agentCode] = throttle.getStatus();
  }
  
  return status;
}

/**
 * Reinicia el throttle de un agente específico
 * @param {string} agentCode - Código del agente
 * @param {boolean} clearQueue - Si debe limpiar la cola también
 * @returns {boolean} true si se reinició, false si no existe
 */
export function resetAgentThrottle(agentCode, clearQueue = false) {
  const throttle = agentThrottles.get(agentCode);
  
  if (!throttle) {
    return false;
  }
  
  throttle.reset(clearQueue);
  console.log(`🔄 [${agentCode}] Throttle reiniciado`);
  
  return true;
}

/**
 * Limpia las métricas de un agente específico
 * @param {string} agentCode - Código del agente
 * @returns {boolean} true si se limpió, false si no existe
 */
export function clearAgentMetrics(agentCode) {
  const throttle = agentThrottles.get(agentCode);
  
  if (!throttle) {
    return false;
  }
  
  throttle.clearMetrics();
  console.log(`📊 [${agentCode}] Métricas limpiadas`);
  
  return true;
}

/**
 * Elimina completamente un throttle de agente (útil para cleanup)
 * @param {string} agentCode - Código del agente
 * @returns {boolean} true si se eliminó, false si no existe
 */
export function removeAgentThrottle(agentCode) {
  const result = agentThrottles.delete(agentCode);
  
  if (result) {
    console.log(`🗑️ [${agentCode}] Throttle eliminado`);
  }
  
  return result;
}

/**
 * Limpia todos los throttles (útil para cleanup global)
 */
export function clearAllThrottles() {
  const count = agentThrottles.size;
  agentThrottles.clear();
  console.log(`🗑️ Se eliminaron ${count} throttles de agentes`);
}

export default {
  getAgentThrottle,
  throttledFetchForAgent,
  sendMessageWithThrottleForAgent,
  getAgentThrottleStatus,
  getAgentThrottleReport,
  getAllAgentsStatus,
  resetAgentThrottle,
  clearAgentMetrics,
  removeAgentThrottle,
  clearAllThrottles
};
