/**
 * Componente de Debug para visualizar el estado del throttling por agente
 * Útil durante desarrollo y para monitoreo
 * 
 * @version 1.0.0
 * @author REMAX NOA Dev Team
 */

"use client"

import { useState, useEffect } from 'react';
import { getAgentThrottleStatus, getAllAgentsStatus } from '@/hooks/useAgentThrottle';

export default function ThrottleDebugPanel({ agentCode, showAllAgents = false }) {
    const [status, setStatus] = useState(null);
    const [allStatus, setAllStatus] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const updateStatus = () => {
            if (showAllAgents) {
                setAllStatus(getAllAgentsStatus());
            } else if (agentCode) {
                setStatus(getAgentThrottleStatus(agentCode));
            }
        };

        // Actualizar inmediatamente
        updateStatus();

        // Actualizar cada segundo
        const interval = setInterval(updateStatus, 1000);

        return () => clearInterval(interval);
    }, [agentCode, showAllAgents]);

    if (!showAllAgents && !agentCode) {
        return null;
    }

    if (showAllAgents) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                    <span className="text-sm font-mono">
                        🔧 Throttle ({Object.keys(allStatus).length} agentes)
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isExpanded && (
                    <div className="mt-2 bg-gray-900 text-white p-4 rounded-lg shadow-2xl max-w-2xl max-h-96 overflow-auto">
                        <h3 className="text-lg font-bold mb-3 text-purple-400">Estado de Throttling - Todos los Agentes</h3>
                        {Object.entries(allStatus).map(([code, agentStatus]) => (
                            <div key={code} className="mb-4 pb-4 border-b border-gray-700 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-sm text-purple-300">{code}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        agentStatus.throttle.isReady 
                                            ? 'bg-green-900 text-green-300' 
                                            : 'bg-yellow-900 text-yellow-300'
                                    }`}>
                                        {agentStatus.throttle.isReady ? '🟢 Listo' : '🟡 Esperando'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-gray-400">Cola:</span>
                                        <span className="ml-2 text-white font-mono">{agentStatus.queue.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Espera:</span>
                                        <span className="ml-2 text-white font-mono">{agentStatus.throttle.waitTimeSec}s</span>
                                    </div>
                                    {agentStatus.metrics && (
                                        <>
                                            <div>
                                                <span className="text-gray-400">Enviados:</span>
                                                <span className="ml-2 text-green-400 font-mono">{agentStatus.metrics.totalSent}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Fallidos:</span>
                                                <span className="ml-2 text-red-400 font-mono">{agentStatus.metrics.totalFailed}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Vista de agente único
    if (!status) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2 ${
                    status.throttle.isReady
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
            >
                <span className="text-sm font-mono">
                    {status.throttle.isReady ? '🟢' : '🟡'} Throttle
                </span>
                {!status.throttle.isReady && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                        {status.throttle.waitTimeSec}s
                    </span>
                )}
                <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="mt-2 bg-gray-900 text-white p-4 rounded-lg shadow-2xl w-80">
                    <h3 className="text-lg font-bold mb-3 text-green-400">
                        Throttle: {status.agentCode}
                    </h3>
                    
                    <div className="space-y-3">
                        {/* Estado del Throttle */}
                        <div className="bg-gray-800 rounded p-3">
                            <h4 className="text-xs font-semibold text-gray-400 mb-2">ESTADO</h4>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Disponible:</span>
                                <span className={`text-sm font-bold ${
                                    status.throttle.isReady ? 'text-green-400' : 'text-yellow-400'
                                }`}>
                                    {status.throttle.isReady ? 'Sí' : `No (${status.throttle.waitTimeSec}s)`}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-sm">Intervalo:</span>
                                <span className="text-sm font-mono">{status.throttle.minIntervalSec}s</span>
                            </div>
                        </div>

                        {/* Cola */}
                        <div className="bg-gray-800 rounded p-3">
                            <h4 className="text-xs font-semibold text-gray-400 mb-2">COLA</h4>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Mensajes:</span>
                                <span className="text-sm font-mono text-blue-400">{status.queue.length}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-sm">Procesando:</span>
                                <span className="text-sm">{status.queue.processing ? '✅' : '⏸️'}</span>
                            </div>
                        </div>

                        {/* Métricas */}
                        {status.metrics && (
                            <div className="bg-gray-800 rounded p-3">
                                <h4 className="text-xs font-semibold text-gray-400 mb-2">MÉTRICAS</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-400">Enviados:</span>
                                        <span className="ml-2 text-green-400 font-mono">{status.metrics.totalSent}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Fallidos:</span>
                                        <span className="ml-2 text-red-400 font-mono">{status.metrics.totalFailed}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Reintentos:</span>
                                        <span className="ml-2 text-yellow-400 font-mono">{status.metrics.totalRetries}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Éxito:</span>
                                        <span className="ml-2 text-blue-400 font-mono">{status.metrics.successRate}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Último envío */}
                        <div className="text-xs text-gray-500 text-center">
                            Último: {new Date(status.lastSendTime).toLocaleTimeString('es-AR')}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
