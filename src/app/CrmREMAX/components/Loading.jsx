/**
 * Componente de loading moderno para el CRM
 */
export default function ModernLoading() {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center z-50">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 flex flex-col items-center gap-6 max-w-sm mx-4">
                {/* Spinner doble */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                    <div className="absolute inset-2 w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 animate-reverse"></div>
                </div>

                {/* Texto */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Inicializando sistema</h3>
                    <p className="text-sm text-gray-600">Configurando conexión al servidor...</p>
                </div>

                {/* Dots animados */}
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );
}

/**
 * Componente de loading para el chat
 */
export function ChatLoadingOverlay() {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-indigo-50/95 to-purple-50/95 backdrop-blur-sm flex items-center justify-center z-40 rounded-2xl">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 flex flex-col items-center gap-4 max-w-xs mx-4">
                {/* Animación de mensajes */}
                <div className="relative">
                    <div className="flex gap-2 items-end">
                        <div className="w-8 h-6 bg-blue-200 rounded-2xl rounded-bl-sm animate-pulse"></div>
                        <div className="w-12 h-6 bg-blue-300 rounded-2xl rounded-bl-sm animate-pulse delay-150"></div>
                    </div>
                    <div className="flex gap-2 items-end justify-end mt-2">
                        <div className="w-10 h-6 bg-indigo-200 rounded-2xl rounded-br-sm animate-pulse delay-300"></div>
                        <div className="w-6 h-6 bg-indigo-300 rounded-2xl rounded-br-sm animate-pulse delay-450"></div>
                    </div>
                </div>

                {/* Spinner central */}
                <div className="relative">
                    <div className="w-8 h-8 border-3 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
                    <div className="absolute inset-1 w-6 h-6 border-3 border-purple-200 rounded-full animate-spin border-t-purple-500 animate-reverse"></div>
                </div>

                {/* Texto */}
                <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">Cargando conversación</h3>
                    <p className="text-xs text-gray-600">Obteniendo mensajes del chat...</p>
                </div>

                {/* Dots animados */}
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );
}
