"use client"

import { Users, Phone, Mail, MapPin, Calendar, Tag as TagIcon } from 'lucide-react';
import { formatChatDate, getRandomColor } from '../../utils/helpers';

/**
 * Vista de Clientes - Muestra todos los clientes que tienen etiquetas o tipo de cliente
 */
export default function ClientesView({ chats, onSelectChat, crmState, isMobile }) {
    // Filtrar solo chats que tengan etiquetas o tipo de cliente
    const clientChats = chats?.filter(chat => {
        const hasClientType = crmState?.clientTypesSelected?.[chat.id] && 
                             crmState.clientTypesSelected[chat.id] !== 'No especificado';
        
        let hasEtiquetas = false;
        if (Array.isArray(chat.etiquetas)) {
            hasEtiquetas = chat.etiquetas.length > 0;
        } else if (typeof chat.etiquetas === 'string') {
            try {
                const parsedEtiquetas = JSON.parse(chat.etiquetas);
                hasEtiquetas = Array.isArray(parsedEtiquetas) && parsedEtiquetas.length > 0;
            } catch (error) {
                hasEtiquetas = false;
            }
        }
        
        return hasClientType || hasEtiquetas;
    }) || [];

    if (clientChats.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users size={48} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No hay clientes</h3>
                    <p className="text-gray-500">Los clientes aparecerán aquí cuando asignes etiquetas o tipos de cliente</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            {/* Lista de chats tipo ChatList */}
            <div className="flex flex-col">
                {clientChats.map((chat) => {
                    const chatName = chat.pushName || chat.contact_name || chat.nombre || chat.telefono || 'Sin nombre';
                    const telefono = chat.telefono || chat.id;
                    const clientType = crmState?.clientTypesSelected?.[chat.id];
                    const lastMessage = chat.last_message || chat.ultimo_mensaje_asistente || 'Sin mensajes';
                    const lastMessageTime = chat.last_message_time || chat.ultimo_mensaje_timestamp;
                    const unreadCount = chat.unread_count || chat.unread || 0;

                    // Normalizar etiquetas
                    let chatEtiquetas = [];
                    if (Array.isArray(chat.etiquetas)) {
                        chatEtiquetas = chat.etiquetas;
                    } else if (typeof chat.etiquetas === 'string') {
                        try {
                            chatEtiquetas = JSON.parse(chat.etiquetas);
                        } catch (error) {
                            chatEtiquetas = [];
                        }
                    }

                    return (
                        <button
                            key={chat.id}
                            onClick={() => onSelectChat(chat)}
                            className="w-full px-4 py-3 flex items-start gap-3 transition-all duration-150 border-b border-gray-100 hover:bg-gray-50 group"
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={chat.picture_url || chat.avatarUrl || chat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=${getRandomColor(chat.id).replace('#', '')}&color=fff&size=96`}
                                    alt={chatName}
                                    className="w-14 h-14 rounded-full object-cover shadow-sm"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=${getRandomColor(chat.id).replace('#', '')}&color=fff&size=96`
                                    }}
                                />
                                {unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#25d366] rounded-full flex items-center justify-center text-white text-[10px] font-semibold">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </div>
                                )}
                            </div>

                            {/* Información del chat */}
                            <div className="flex-1 min-w-0 text-left">
                                {/* Nombre y fecha */}
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-gray-900 truncate text-base">
                                        {chatName}
                                    </h3>
                                    {lastMessageTime && (
                                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                            {formatChatDate(lastMessageTime)}
                                        </span>
                                    )}
                                </div>

                                {/* Último mensaje */}
                                <p className="text-sm text-gray-600 truncate mb-2">
                                    {lastMessage}
                                </p>

                                {/* Tipo de cliente */}
                                {clientType && clientType !== 'No especificado' && (
                                    <div className="mb-2">
                                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                                            {clientType}
                                        </span>
                                    </div>
                                )}

                                {/* Etiquetas */}
                                {chatEtiquetas.length > 0 && crmState?.allTags && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {chatEtiquetas.slice(0, 3).map(tagId => {
                                            const tag = crmState.allTags.find(t => t.id === tagId);
                                            if (!tag) return null;
                                            return (
                                                <span
                                                    key={tagId}
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                                                    style={{ 
                                                        backgroundColor: `${tag.color}20`,
                                                        color: tag.color,
                                                        border: `1px solid ${tag.color}40`
                                                    }}
                                                >
                                                    <TagIcon size={10} />
                                                    {tag.nombre}
                                                </span>
                                            );
                                        })}
                                        {chatEtiquetas.length > 3 && (
                                            <span className="text-xs text-gray-500 font-medium">
                                                +{chatEtiquetas.length - 3} más
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Información de contacto adicional */}
                                <div className="mt-2 flex flex-wrap gap-3">
                                    {telefono && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Phone size={12} className="text-gray-400" />
                                            <span>{telefono}</span>
                                        </div>
                                    )}
                                    {chat.correo && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Mail size={12} className="text-gray-400" />
                                            <span className="truncate max-w-[150px]">{chat.correo}</span>
                                        </div>
                                    )}
                                    {chat.ubicacion && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <MapPin size={12} className="text-gray-400" />
                                            <span className="truncate max-w-[100px]">{chat.ubicacion}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
