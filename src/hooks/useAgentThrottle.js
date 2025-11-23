/**
 * Hook personalizado para usar throttling por agente en componentes React
 * 
 * @version 1.0.0
 * @author REMAX NOA Dev Team
 */

import { useCallback, useEffect, useRef } from 'react';
import { 
  getAgentThrottle, 
  sendMessageWithThrottleForAgent,
  throttledFetchForAgent,
  getAgentThrottleStatus
} from '../lib/agentThrottle.js';

/**
 * Hook para manejar throttling de mensajes por agente
 * @param {string} agentCode - Código único del agente
 * @param {Object} config - Configuración opcional del throttle
 * @returns {Object} Funciones y estado del throttle
 */
export function useAgentThrottle(agentCode, config = {}) {
  const throttleRef = useRef(null);

  // Inicializar throttle al montar o cuando cambie el agentCode
  useEffect(() => {
    if (agentCode) {
      throttleRef.current = getAgentThrottle(agentCode, config);
      console.log(`🔧 useAgentThrottle inicializado para: ${agentCode}`);
    }

    // Cleanup opcional (normalmente queremos mantener el throttle activo)
    return () => {
      // No eliminar el throttle para mantener la cola entre re-renders
      console.log(`🔧 useAgentThrottle desmontado para: ${agentCode}`);
    };
  }, [agentCode]); // Solo recrear si cambia el agentCode

  /**
   * Envía un mensaje con throttling usando fetch
   */
  const sendWithFetch = useCallback(async (url, options = {}, metadata = {}) => {
    if (!agentCode) {
      throw new Error('Agent code no está definido');
    }

    return await throttledFetchForAgent(agentCode, url, options, metadata);
  }, [agentCode]);

  /**
   * Envía un mensaje con throttling usando una función personalizada
   */
  const sendWithFunction = useCallback(async (sendFunction, metadata = {}) => {
    if (!agentCode) {
      throw new Error('Agent code no está definido');
    }

    return await sendMessageWithThrottleForAgent(agentCode, sendFunction, metadata);
  }, [agentCode]);

  /**
   * Obtiene el estado actual del throttle
   */
  const getStatus = useCallback(() => {
    if (!agentCode) {
      return null;
    }

    return getAgentThrottleStatus(agentCode);
  }, [agentCode]);

  /**
   * Verifica si el throttle está listo para enviar
   */
  const isReady = useCallback(() => {
    const status = getStatus();
    return status?.throttle?.isReady ?? true;
  }, [getStatus]);

  /**
   * Obtiene el tiempo de espera restante
   */
  const getWaitTime = useCallback(() => {
    const status = getStatus();
    return status?.throttle?.waitTimeMs ?? 0;
  }, [getStatus]);

  /**
   * Obtiene la longitud de la cola
   */
  const getQueueLength = useCallback(() => {
    const status = getStatus();
    return status?.queue?.length ?? 0;
  }, [getStatus]);

  return {
    // Funciones de envío
    sendWithFetch,
    sendWithFunction,
    
    // Información de estado
    getStatus,
    isReady,
    getWaitTime,
    getQueueLength,
    
    // Referencia al throttle (para casos avanzados)
    throttle: throttleRef.current
  };
}

export default useAgentThrottle;
