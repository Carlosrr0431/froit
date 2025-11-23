"use client"

import { useEffect, useRef, useMemo } from 'react';
import MessageItem from './MessageItem';

const WHATSAPP_PATTERN = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23efeae2'/%3E%3Cpath d='M0 86h10v10H0zM46 40h10v10H46zM86 0h10v10H86z' fill='%23d1c3a7' fill-opacity='0.35'/%3E%3C/svg%3E";
const WHATSAPP_BACKGROUND = {
    backgroundImage: `url(${WHATSAPP_PATTERN})`,
    backgroundColor: '#efeae2'
}

/**
 * Componente para mostrar la lista de mensajes del chat
 */
export default function MessageList({ messages, loading }) {
    const scrollRef = useRef(null);
    const previousMessagesLengthRef = useRef(0);

    // Mantener el orden recibido (ya preprocesado en ChatArea)
    const orderedMessages = useMemo(() => {
        if (!messages || messages.length === 0) return [];
        return [...messages];
    }, [messages]);

    // Auto-scroll al último mensaje cuando cambian los mensajes
    useEffect(() => {
        if (scrollRef.current) {
            const isNewChatOrNewMessage = 
                previousMessagesLengthRef.current === 0 || 
                orderedMessages.length !== previousMessagesLengthRef.current;
            
            if (isNewChatOrNewMessage) {
                // Usar setTimeout para asegurar que el DOM se haya actualizado
                setTimeout(() => {
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    }
                }, 0);
            }
            
            previousMessagesLengthRef.current = orderedMessages.length;
        }
    }, [orderedMessages]);

    // Scroll al final cuando se monta el componente o cambia el chat
    useEffect(() => {
        if (scrollRef.current && orderedMessages.length > 0) {
            // Forzar scroll al final con un pequeño delay para asegurar renderizado
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 100);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Cargando mensajes...</p>
                </div>
            </div>
        );
    }

    if (!orderedMessages || orderedMessages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                    <p className="text-lg mb-2">📭</p>
                    <p className="text-sm">Los mensajes aparecerán aquí...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={WHATSAPP_BACKGROUND}
        >
            {orderedMessages.map((message, index) => (
                <MessageItem 
                    key={message.id || `msg-${index}`} 
                    message={message} 
                />
            ))}
        </div>
    );
}
