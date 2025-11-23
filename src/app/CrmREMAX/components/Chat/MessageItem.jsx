"use client"

import { formatChatDate } from '../../utils/helpers';
import LinkPreview from './LinkPreview';

/**
 * Componente para renderizar un mensaje individual
 */
export default function MessageItem({ message }) {
    const isOutgoing = message.direction === 'outgoing' || message.fromMe;
    const messageText = message.content || message.text || '';
    const timestamp = message.message_timestamp || message.timestamp;
    
    // Detectar URLs en el texto del mensaje
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = messageText.match(urlRegex) || [];
    const hasUrl = urls.length > 0;
    const firstUrl = urls[0] || null;
    
    // Determinar si el mensaje es SOLO una URL (sin texto adicional significativo)
    const isOnlyUrl = hasUrl && messageText.trim().replace(urlRegex, '').trim().length === 0;
    
    // Determinar si es mensaje multimedia
    const isMedia = message.type && message.type !== 'text';
    const mediaUrl = message.media_url;
    const looksLikeUrl = (value = '') => /^https?:\/\//i.test(value.trim());
    const normalizedMediaUrl = mediaUrl ? mediaUrl.trim().replace(/\/$/, '') : '';
    const normalizedMessageText = messageText.trim().replace(/\/$/, '');
    const mediaLinkInText = isMedia && normalizedMediaUrl && normalizedMediaUrl === normalizedMessageText;
    
    // Ocultar texto si:
    // 1. Es media con link en el texto
    // 2. El texto parece una URL
    // 3. Es documento/file/audio y el texto es solo el nombre del archivo o una URL
    const isDocumentOrFile = message.type === 'document' || message.type === 'file' || message.type === 'audio';
    const shouldHideText = isMedia && (mediaLinkInText || looksLikeUrl(normalizedMessageText) || (isDocumentOrFile && mediaUrl));

    // Procesar ubicación si es tipo location
    let locationData = null;
    if (message.type === 'location' && message.metadata) {
        try {
            const metadata = typeof message.metadata === 'string' 
                ? JSON.parse(message.metadata) 
                : message.metadata;
            if (metadata.latitude && metadata.longitude) {
                locationData = {
                    latitude: metadata.latitude,
                    longitude: metadata.longitude
                };
            }
        } catch (error) {
            console.error('Error parseando metadata de ubicación:', error);
        }
    }

    // ✅ NUEVO: Determinar estado de lectura basado en read_status
    // 0=ERROR, 1=PENDING, 2=SENT, 3=DELIVERED, 4=READ, 5=PLAYED
    const readStatus = message.read_status !== undefined && message.read_status !== null
                      ? parseInt(message.read_status, 10) // ✅ Convertir a número
                      : (message.status === 'sending' || message.status === 'pending') ? 1
                      : (message.status === 'sent') ? 2
                      : (message.status === 'delivered') ? 3
                      : (message.status === 'read') ? 4
                      : (message.status === 'played') ? 5
                      : (message.status === 'failed' || message.status === 'error') ? 0
                      : 2; // Por defecto: SENT

    return (
        <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 shadow-sm transition-all duration-200 hover:shadow flex flex-col ${
                    isOutgoing
                        ? 'bg-[#DCF8C6] text-gray-900 rounded-br-md border border-green-100'
                        : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                }`}
            >
                {/* Contenido multimedia */}
                {isMedia && mediaUrl && (
                    <div className={`mb-2 overflow-hidden rounded-xl border ${isOutgoing ? 'border-green-200 bg-white/40' : 'border-gray-200 bg-gray-50'} max-w-[260px] sm:max-w-[320px]`}>
                        {message.type === 'image' && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                                src={mediaUrl} 
                                alt="Imagen" 
                                className="block w-full h-auto max-h-[320px] object-cover cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                                onClick={() => window.open(mediaUrl, '_blank')}
                            />
                        )}
                        {message.type === 'video' && (
                            <video 
                                src={mediaUrl} 
                                controls 
                                className="block w-full max-h-[320px] object-cover"
                            />
                        )}
                        {message.type === 'audio' && (
                            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 ${isOutgoing ? 'bg-green-100' : 'bg-blue-100'} rounded-full`}>
                                        <svg className={`w-4 h-4 ${isOutgoing ? 'text-green-700' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        Audio
                                    </span>
                                </div>
                                <audio 
                                    src={mediaUrl} 
                                    controls 
                                    className="w-full h-10"
                                    style={{ minWidth: '250px' }}
                                />
                            </div>
                        )}
                        {(message.type === 'document' || message.type === 'file') && (
                            <a 
                                href={mediaUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3 p-3 ${isOutgoing ? 'bg-white/60 hover:bg-white' : 'bg-white hover:bg-gray-50'} rounded-xl transition-colors group`}
                            >
                                <div className={`p-2 ${isOutgoing ? 'bg-green-50' : 'bg-blue-50'} rounded-lg group-hover:scale-105 transition-transform`}>
                                    <svg className={`w-5 h-5 ${isOutgoing ? 'text-green-700' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-800 truncate max-w-[140px]">
                                    {message.metadata?.file_name || 'Documento'}
                                </span>
                            </a>
                        )}
                    </div>
                )}

                {/* ✅ NUEVO: Video no disponible por error de desencriptación */}
                {isMedia && !mediaUrl && message.type === 'video' && message.metadata?.decryption_failed && (
                    <div className={`mb-2 rounded-xl border ${isOutgoing ? 'border-orange-200 bg-orange-50/40' : 'border-orange-200 bg-orange-50'} max-w-[260px] sm:max-w-[320px] p-4`}>
                        <div className="flex flex-col items-center justify-center gap-3 py-3">
                            {/* Ícono de video con advertencia */}
                            <div className="relative">
                                <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Mensaje descriptivo */}
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    Video no disponible
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    El archivo superó el límite<br />de tamaño permitido
                                </p>
                            </div>
                            
                            {/* Información del archivo si está disponible */}
                            {message.metadata?.file_length && (
                                <div className="mt-1 px-3 py-1.5 bg-white/60 rounded-full">
                                    <p className="text-xs text-gray-600 font-medium">
                                        {(parseInt(message.metadata.file_length) / (1024 * 1024)).toFixed(1)} MB
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ✅ NUEVO: Imagen no disponible por error de desencriptación */}
                {isMedia && !mediaUrl && message.type === 'image' && message.metadata?.decryption_failed && (
                    <div className={`mb-2 rounded-xl border ${isOutgoing ? 'border-orange-200 bg-orange-50/40' : 'border-orange-200 bg-orange-50'} max-w-[260px] sm:max-w-[320px] p-4`}>
                        <div className="flex flex-col items-center justify-center gap-3 py-3">
                            <div className="relative">
                                <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    Imagen no disponible
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    El archivo superó el límite<br />de tamaño permitido
                                </p>
                            </div>
                            {message.metadata?.file_length && (
                                <div className="mt-1 px-3 py-1.5 bg-white/60 rounded-full">
                                    <p className="text-xs text-gray-600 font-medium">
                                        {(parseInt(message.metadata.file_length) / (1024 * 1024)).toFixed(1)} MB
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ✅ NUEVO: Audio no disponible por error de desencriptación */}
                {isMedia && !mediaUrl && message.type === 'audio' && message.metadata?.decryption_failed && (
                    <div className={`mb-2 rounded-xl border ${isOutgoing ? 'border-orange-200 bg-orange-50/40' : 'border-orange-200 bg-orange-50'} max-w-[260px] sm:max-w-[320px] p-4`}>
                        <div className="flex flex-col items-center justify-center gap-3 py-3">
                            <div className="relative">
                                <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                                <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    Audio no disponible
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    El archivo superó el límite<br />de tamaño permitido
                                </p>
                            </div>
                            {message.metadata?.file_length && (
                                <div className="mt-1 px-3 py-1.5 bg-white/60 rounded-full">
                                    <p className="text-xs text-gray-600 font-medium">
                                        {(parseInt(message.metadata.file_length) / (1024 * 1024)).toFixed(1)} MB
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ✅ NUEVO: Documento no disponible por error de desencriptación */}
                {isMedia && !mediaUrl && (message.type === 'document' || message.type === 'file') && message.metadata?.decryption_failed && (
                    <div className={`mb-2 rounded-xl border ${isOutgoing ? 'border-orange-200 bg-orange-50/40' : 'border-orange-200 bg-orange-50'} max-w-[260px] sm:max-w-[320px] p-4`}>
                        <div className="flex flex-col items-center justify-center gap-3 py-3">
                            <div className="relative">
                                <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    Documento no disponible
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    El archivo superó el límite<br />de tamaño permitido
                                </p>
                            </div>
                            {message.metadata?.file_length && (
                                <div className="mt-1 px-3 py-1.5 bg-white/60 rounded-full">
                                    <p className="text-xs text-gray-600 font-medium">
                                        {(parseInt(message.metadata.file_length) / (1024 * 1024)).toFixed(1)} MB
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ✅ NUEVO: Mensaje de ubicación (location) */}
                {message.type === 'location' && locationData && (
                    <div className={`mb-2 rounded-xl border overflow-hidden ${isOutgoing ? 'border-green-200' : 'border-gray-200'} max-w-[260px] sm:max-w-[320px]`}>
                        {/* Mapa interactivo con iframe de Google Maps */}
                        <div className="relative w-full h-[180px] bg-gray-100">
                            <iframe
                                src={`https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}&z=15&output=embed`}
                                width="100%"
                                height="180"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                                title="Mapa de ubicación"
                            />
                            
                            {/* Overlay sutil para indicar que es clickeable */}
                            <a 
                                href={`https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 bg-transparent hover:bg-black/5 transition-all duration-200 flex items-center justify-center group"
                            >
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 rounded-full p-2.5 shadow-lg">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                            </a>
                        </div>

                        {/* Footer con información y botones */}
                        <div className={`p-3 ${isOutgoing ? 'bg-white/60' : 'bg-gray-50'}`}>
                            <div className="flex items-start gap-2">
                                <div className={`p-2 ${isOutgoing ? 'bg-green-50' : 'bg-blue-50'} rounded-lg flex-shrink-0`}>
                                    <svg className={`w-5 h-5 ${isOutgoing ? 'text-green-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 mb-1">
                                        Ubicación compartida
                                    </p>
                                    <p className="text-xs text-gray-600 font-mono truncate">
                                        {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
                                    </p>
                                    <a
                                        href={`https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1 mt-2 text-xs font-medium ${
                                            isOutgoing ? 'text-green-700 hover:text-green-800' : 'text-blue-600 hover:text-blue-700'
                                        } transition-colors`}
                                    >
                                        <span>Abrir en Google Maps</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ✅ NUEVO: Vista previa de enlaces (Link Preview) */}
                {!isMedia && hasUrl && message.type !== 'location' && (
                    <div className="mb-2">
                        <LinkPreview url={firstUrl} isOutgoing={isOutgoing} />
                    </div>
                )}

                {/* Texto del mensaje */}
                {messageText && !shouldHideText && message.type !== 'location' && (
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words text-gray-900">
                        {hasUrl ? (
                            // Renderizar texto con URLs como enlaces clickeables
                            messageText.split(urlRegex).map((part, index) => {
                                // Verificar si esta parte es una URL
                                if (part && part.match(/^https?:\/\//i)) {
                                    return (
                                        <a
                                            key={index}
                                            href={part}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`underline ${
                                                isOutgoing 
                                                    ? 'text-blue-700 hover:text-blue-800' 
                                                    : 'text-blue-600 hover:text-blue-700'
                                            } transition-colors`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {part}
                                        </a>
                                    );
                                }
                                return part;
                            })
                        ) : (
                            messageText
                        )}
                    </p>
                )}

                {/* ✅ NUEVO: Reacciones de WhatsApp */}
                {message.reactions && Array.isArray(message.reactions) && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {message.reactions.map((reaction, index) => (
                            <div 
                                key={index}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                    isOutgoing 
                                        ? 'bg-white/60 border border-green-200' 
                                        : 'bg-gray-100 border border-gray-200'
                                }`}
                                title={`De: ${reaction.from_me ? 'Tú' : reaction.from || 'Usuario'}`}
                            >
                                <span className="text-base leading-none">{reaction.emoji}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Timestamp y estado */}
                <div className="flex items-center justify-end gap-1.5 mt-1.5">
                    {timestamp && (
                        <p className={`text-[11px] font-medium ${isOutgoing ? 'text-gray-600' : 'text-gray-500'}`}>
                            {new Date(timestamp).toLocaleTimeString('es-AR', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false
                            })}
                        </p>
                    )}

                    {/* Estado de lectura (solo para mensajes salientes) */}
                    {isOutgoing && (
                        <div className="flex items-center gap-0.5">
                            {/* ERROR (0) - X roja */}
                            {readStatus === 0 && (
                                <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            
                            {/* PENDING (1) - Reloj */}
                            {readStatus === 1 && (
                                <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            )}
                            
                            {/* SENT (2) - Tilde simple gris */}
                            {readStatus === 2 && (
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                </svg>
                            )}
                            
                            {/* DELIVERED (3) - Doble tilde gris */}
                            {readStatus === 3 && (
                                <>
                                    <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                    </svg>
                                    <svg className="w-3.5 h-3.5 text-gray-500 -ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                    </svg>
                                </>
                            )}
                            
                            {/* READ (4) - Doble tilde azul */}
                            {readStatus === 4 && (
                                <>
                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                    </svg>
                                    <svg className="w-3.5 h-3.5 text-blue-500 -ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                    </svg>
                                </>
                            )}
                            
                            {/* PLAYED (5) - Doble tilde azul con ícono de play */}
                            {readStatus === 5 && (
                                <>
                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                    </svg>
                                    <svg className="w-3.5 h-3.5 text-blue-500 -ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                    </svg>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
