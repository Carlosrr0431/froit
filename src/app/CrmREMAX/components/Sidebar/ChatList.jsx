"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { formatChatDate, getRandomColor } from '../../utils/helpers'
import { getSupabaseRealtimeClient } from '@/lib/supabase-realtime'

const normalizeId = (value) => {
    if (value === undefined || value === null) {
        return null
    }
    return String(value)
}

/**
 * Componente que muestra la lista de chats con actualizaciones en tiempo real
 */
export default function ChatList({
    chats,
    activeChat,
    onSelectChat,
    selectedTagFilter,
    selectedStepFilter,
    selectedClientTypeFilter,
    salesStepIndices,
    clientTypesSelected,
    getSalesStepsForClient,
    wasender = null,
}) {
    const [realtimeChats, setRealtimeChats] = useState(() =>
        Array.isArray(chats) ? chats.map(chat => ({ ...chat })) : []
    )
    const activeChatRef = useRef(activeChat)
    const realtimeChannelRef = useRef(null)
    const refreshChats = wasender?.refreshChats

    useEffect(() => {
        setRealtimeChats(Array.isArray(chats) ? chats.map(chat => ({ ...chat })) : [])
    }, [chats])

    useEffect(() => {
        activeChatRef.current = activeChat
    }, [activeChat])

    useEffect(() => {
        const targetId = normalizeId(activeChat?.id ?? activeChat?.chat_id ?? activeChat?.telefono)
        if (!targetId) return

        setRealtimeChats(prevChats => prevChats.map(chat => {
            const ids = [chat?.id, chat?.chat_id, chat?.chatId, chat?.telefono]
            return ids.some(id => normalizeId(id) === targetId)
                ? { ...chat, unread_count: 0 }
                : chat
        }))
    }, [activeChat?.id, activeChat?.chat_id, activeChat?.telefono])

    const getMessagePreview = useCallback((message) => {
        if (!message) return 'Nuevo mensaje'

        if (message.type === 'text') {
            return message.content?.trim() || 'Nuevo mensaje'
        }

        const typeMap = {
            image: 'Imagen',
            video: 'Video',
            audio: 'Audio',
            document: 'Documento',
            file: 'Archivo',
            sticker: 'Sticker',
            location: 'Ubicacion',
        }

        return typeMap[message.type] || 'Archivo multimedia'
    }, [])

    const applyRealtimeMessageUpdate = useCallback((message) => {
        if (!message?.chat_id) return

        const targetId = normalizeId(message.chat_id)
        if (!targetId) return

        let chatFound = false

        setRealtimeChats(prevChats => {
            if (!Array.isArray(prevChats) || prevChats.length === 0) {
                return prevChats
            }

            const chatIndex = prevChats.findIndex(chat => {
                const ids = [chat?.id, chat?.chat_id, chat?.chatId, chat?.telefono]
                return ids.some(id => normalizeId(id) === targetId)
            })

            if (chatIndex === -1) {
                return prevChats
            }

            chatFound = true
            const updatedChat = { ...prevChats[chatIndex] }
            const preview = getMessagePreview(message)

            updatedChat.last_message = preview
            updatedChat.last_message_time = message.message_timestamp
            updatedChat.ultimo_mensaje_asistente = preview
            updatedChat.ultimo_mensaje_timestamp = message.message_timestamp

            const active = activeChatRef.current
            const activeIds = [active?.id, active?.chat_id, active?.chatId, active?.telefono]
            const isActiveChat = activeIds.some(id => normalizeId(id) === targetId)

            if (message.direction === 'incoming' && !isActiveChat) {
                const currentUnread = updatedChat.unread_count ?? 0
                updatedChat.unread_count = currentUnread + 1
            }

            const newChats = [...prevChats]
            newChats.splice(chatIndex, 1)
            return [updatedChat, ...newChats]
        })

        if (!chatFound && typeof refreshChats === 'function') {
            refreshChats()
        }
    }, [getMessagePreview, refreshChats])

    useEffect(() => {
        const agentCode = wasender?.agentConfig?.agent_code
        if (!agentCode) return

        const supabaseClient = getSupabaseRealtimeClient()
        if (!supabaseClient) return

        if (realtimeChannelRef.current) {
            supabaseClient.removeChannel(realtimeChannelRef.current)
        }

        const channel = supabaseClient
            .channel(`crm_remax_chats_${agentCode}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chats',
                filter: `propietario=eq.${agentCode}`,
            }, async () => {
                if (typeof refreshChats === 'function') {
                    await refreshChats()
                }
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'chats',
                filter: `propietario=eq.${agentCode}`,
            }, async (payload) => {
                if (payload.new?.propietario !== agentCode) return

                const oldData = payload.old || {}
                const newData = payload.new || {}
                const onlyTagsChanged =
                    oldData.ultimo_mensaje_timestamp === newData.ultimo_mensaje_timestamp &&
                    oldData.ultimo_mensaje_asistente === newData.ultimo_mensaje_asistente &&
                    JSON.stringify(oldData.etiquetas) !== JSON.stringify(newData.etiquetas)

                if (!onlyTagsChanged && typeof refreshChats === 'function') {
                    await refreshChats()
                }
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
            }, (payload) => {
                applyRealtimeMessageUpdate(payload.new)
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'messages',
            }, (payload) => {
                applyRealtimeMessageUpdate(payload.new)
            })
            .subscribe()

        realtimeChannelRef.current = channel

        return () => {
            if (realtimeChannelRef.current) {
                supabaseClient.removeChannel(realtimeChannelRef.current)
                realtimeChannelRef.current = null
            }
        }
    }, [wasender?.agentConfig?.agent_code, refreshChats, applyRealtimeMessageUpdate])

    const handleSelectChat = useCallback((chat) => {
        if (!chat) return

        const targetId = normalizeId(chat.id ?? chat.chat_id ?? chat.chatId ?? chat.telefono)
        if (targetId) {
            setRealtimeChats(prev => prev.map(item => {
                const ids = [item?.id, item?.chat_id, item?.chatId, item?.telefono]
                return ids.some(id => normalizeId(id) === targetId)
                    ? { ...item, unread_count: 0 }
                    : item
            }))
        }

        if (typeof onSelectChat === 'function') {
            onSelectChat(chat)
        }
    }, [onSelectChat])

    const filteredChats = useMemo(() => {
        const sourceChats = Array.isArray(realtimeChats) ? realtimeChats : []

        return sourceChats.filter(chat => {
            if (!chat) return false

            if (selectedTagFilter?.length > 0) {
                let chatTags = []
                if (Array.isArray(chat.etiquetas)) {
                    chatTags = chat.etiquetas
                } else if (typeof chat.etiquetas === 'string') {
                    try {
                        chatTags = JSON.parse(chat.etiquetas)
                    } catch (error) {
                        chatTags = []
                    }
                }

                const hasMatchingTag = selectedTagFilter.some(tagId => chatTags.includes(tagId))
                if (!hasMatchingTag) return false
            }

            if (selectedClientTypeFilter && selectedClientTypeFilter !== 'Todos') {
                const chatType = clientTypesSelected?.[chat.id]
                if (chatType !== selectedClientTypeFilter) return false
            }

            if (selectedStepFilter) {
                const chatStepIndex = salesStepIndices?.[chat.id] || 0
                const clientType = clientTypesSelected?.[chat.id] || 'No especificado'
                const steps = typeof getSalesStepsForClient === 'function'
                    ? getSalesStepsForClient(clientType)
                    : []
                const currentStep = steps?.[chatStepIndex]
                if (currentStep !== selectedStepFilter) return false
            }

            return true
        })
    }, [
        realtimeChats,
        selectedTagFilter,
        selectedClientTypeFilter,
        selectedStepFilter,
        clientTypesSelected,
        salesStepIndices,
        getSalesStepsForClient,
    ])

    if (filteredChats.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1.5">No hay conversaciones</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {selectedTagFilter?.length > 0 || selectedStepFilter || selectedClientTypeFilter
                            ? 'No se encontraron chats con los filtros aplicados'
                            : 'Las conversaciones aparecerán aquí'
                        }
                    </p>
                </div>
            </div>
        )
    }

    const activeChatId = normalizeId(activeChat?.id ?? activeChat?.chat_id ?? activeChat?.telefono)

    return (
        <div className="flex-1 overflow-y-auto chat-list-scroll">
            {filteredChats.map((chat) => {
                const chatId = normalizeId(chat.id ?? chat.chat_id ?? chat.telefono)
                const isActive = activeChatId && chatId === activeChatId
                const chatName = chat.pushName || chat.contact_name || chat.nombre || chat.telefono
                const lastMessage = chat.last_message || 'Sin mensajes'
                const lastMessageTime = chat.last_message_time
                const unreadCount = chat.unread_count || 0

                return (
                    <button
                        key={chat.id}
                        onClick={() => handleSelectChat(chat)}
                        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 transition-all duration-150 border-b border-gray-100/50 group
                            ${isActive
                                ? 'bg-[#f0f2f5]'
                                : 'hover:bg-gray-50/80'
                            }`}
                    >
                        <div className="relative flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={chat.picture_url || chat.avatarUrl || chat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=${getRandomColor(chat.id).replace('#', '')}&color=fff&size=96`}
                                alt={chatName}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=${getRandomColor(chat.id).replace('#', '')}&color=fff&size=96`
                                }}
                            />
                            {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#25d366]
                                              rounded-full flex items-center justify-center text-white text-[10px] font-semibold">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between mb-0.5">
                                <h3 className={`font-semibold truncate text-[15px] ${isActive ? 'text-gray-900' : 'text-gray-900'}`}>
                                    {chatName}
                                </h3>
                                {lastMessageTime && (
                                    <span className={`text-[11px] ml-2 flex-shrink-0 ${unreadCount > 0 ? 'text-[#25d366] font-semibold' : 'text-gray-500'}`}>
                                        {formatChatDate(lastMessageTime)}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <p className={`text-[13px] truncate flex-1 ${unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                    {lastMessage}
                                </p>
                                {clientTypesSelected?.[chat.id] && (
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] rounded font-semibold flex-shrink-0">
                                        {clientTypesSelected[chat.id]}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
