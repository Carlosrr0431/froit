"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { X, User, Phone, Calendar, TrendingUp, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"

// Estilos CSS para scroll minimalista
const scrollStyles = `
    .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-track {
        background: #e5e7eb;
        border-radius: 10px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb {
        background: #818cf8;
        border-radius: 10px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: #6366f1;
    }
    
    .scrollbar-track-gray-200::-webkit-scrollbar-track {
        background: #e5e7eb;
    }
    
    .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
        background: #9ca3af;
    }
    
    .scrollbar-thumb-indigo-400::-webkit-scrollbar-thumb {
        background: #818cf8;
    }
`;

export default function PipelineView({ 
    chats = [],
    clientTypes = [],
    getSalesStepsForClient,
    salesStepIndices = {},
    onSelectChat,
    activeChat,
    showToast,
    onOpenClientTypesConfig, // ✅ Abrir config
    onClientTypesUpdated // ✅ Callback cuando se actualizan los tipos
}) {
    // ✅ SOLO usar clientTypes de la BD - SIN fallbacks
    const availableClientTypes = useMemo(() => {
        // Asegurarse de que sea un array válido
        if (!clientTypes) return [];
        if (!Array.isArray(clientTypes)) return [];
        return clientTypes;
    }, [clientTypes]);

    const [selectedClientType, setSelectedClientType] = useState(
        availableClientTypes.length > 0 ? availableClientTypes[0] : ""
    )
    const [searchTerm, setSearchTerm] = useState("")
    const [hoveredStage, setHoveredStage] = useState(null)
    const scrollContainerRef = useRef(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)
    const [draggedContact, setDraggedContact] = useState(null)
    const [draggedFromStage, setDraggedFromStage] = useState(null)
    const [dropTargetStage, setDropTargetStage] = useState(null)
    const [localChats, setLocalChats] = useState(chats)
    const [localStepIndices, setLocalStepIndices] = useState(salesStepIndices)
    const [autoScrollInterval, setAutoScrollInterval] = useState(null)

    // Actualizar tipo seleccionado si availableClientTypes cambia
    useEffect(() => {
        if (availableClientTypes.length > 0 && !availableClientTypes.includes(selectedClientType)) {
            setSelectedClientType(availableClientTypes[0]);
        }
    }, [availableClientTypes, selectedClientType]);

    // Sincronizar con props
    useEffect(() => {
        setLocalChats(chats)
    }, [chats])

    useEffect(() => {
        setLocalStepIndices(salesStepIndices)
    }, [salesStepIndices])

    // Obtener las etapas según el tipo de cliente
    const stages = useMemo(() => {
        if (!selectedClientType) return []
        return getSalesStepsForClient(selectedClientType) || []
    }, [selectedClientType, getSalesStepsForClient])

    // Detectar si se puede hacer scroll
    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setShowLeftArrow(scrollLeft > 10)
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    useEffect(() => {
        checkScrollButtons()
        const scrollContainer = scrollContainerRef.current
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScrollButtons)
            window.addEventListener('resize', checkScrollButtons)
            return () => {
                scrollContainer.removeEventListener('scroll', checkScrollButtons)
                window.removeEventListener('resize', checkScrollButtons)
            }
        }
    }, [stages])

    // Función para scroll suave
    const scroll = useCallback((direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400
            const currentScroll = scrollContainerRef.current.scrollLeft
            const newScrollLeft = direction === 'left' 
                ? Math.max(0, currentScroll - scrollAmount)
                : currentScroll + scrollAmount
            
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            })
            
            setTimeout(checkScrollButtons, 100)
        }
    }, [])

    // Detectar scroll con teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                scroll('left')
            } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                scroll('right')
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [scroll])

    // Agrupar contactos por etapa
    const contactsByStage = useMemo(() => {
        const grouped = {}
        
        stages.forEach(stage => {
            grouped[stage] = []
        })

        localChats.forEach(chat => {
            const chatClientType = chat.tipo_cliente || chat.client_type
            if (chatClientType === selectedClientType) {
                const currentStage = chat.estado_embudo
                
                if (currentStage && grouped[currentStage] !== undefined) {
                    if (searchTerm) {
                        const searchLower = searchTerm.toLowerCase()
                        const matchesSearch = 
                            chat.contact_name?.toLowerCase().includes(searchLower) ||
                            chat.nombre?.toLowerCase().includes(searchLower) ||
                            chat.telefono?.includes(searchTerm) ||
                            chat.push_name?.toLowerCase().includes(searchLower) ||
                            chat.pushName?.toLowerCase().includes(searchLower)
                        
                        if (matchesSearch) {
                            grouped[currentStage].push(chat)
                        }
                    } else {
                        grouped[currentStage].push(chat)
                    }
                } else {
                    const defaultStage = stages[0]
                    if (defaultStage && grouped[defaultStage]) {
                        if (searchTerm) {
                            const searchLower = searchTerm.toLowerCase()
                            const matchesSearch = 
                                chat.contact_name?.toLowerCase().includes(searchLower) ||
                                chat.nombre?.toLowerCase().includes(searchLower) ||
                                chat.telefono?.includes(searchTerm) ||
                                chat.push_name?.toLowerCase().includes(searchLower) ||
                                chat.pushName?.toLowerCase().includes(searchLower)
                            
                            if (matchesSearch) {
                                grouped[defaultStage].push(chat)
                            }
                        } else {
                            grouped[defaultStage].push(chat)
                        }
                    }
                }
            }
        })

        return grouped
    }, [localChats, stages, selectedClientType, searchTerm])

    // Calcular estadísticas
    const stats = useMemo(() => {
        const total = Object.values(contactsByStage).reduce((sum, contacts) => sum + contacts.length, 0)
        return {
            total,
            byStage: Object.keys(contactsByStage).map(stage => ({
                stage,
                count: contactsByStage[stage].length,
                percentage: total > 0 ? Math.round((contactsByStage[stage].length / total) * 100) : 0
            }))
        }
    }, [contactsByStage])

    // Colores para las etapas
    const stageColors = [
        { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', badge: 'bg-blue-500' },
        { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700', badge: 'bg-purple-500' },
        { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-500' },
        { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', badge: 'bg-orange-500' },
        { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-700', badge: 'bg-pink-500' },
        { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-700', badge: 'bg-indigo-500' },
    ]

    const getStageColor = (index) => stageColors[index % stageColors.length]

    // Auto-scroll horizontal durante el drag
    const handleAutoScroll = useCallback((e) => {
        if (!scrollContainerRef.current || !draggedContact) return

        const container = scrollContainerRef.current
        const rect = container.getBoundingClientRect()
        const threshold = 100
        const scrollSpeed = 15
        
        const mouseX = e.clientX
        const distanceFromLeft = mouseX - rect.left
        const distanceFromRight = rect.right - mouseX

        if (autoScrollInterval) {
            clearInterval(autoScrollInterval)
            setAutoScrollInterval(null)
        }

        if (distanceFromLeft < threshold && distanceFromLeft > 0) {
            const interval = setInterval(() => {
                if (container.scrollLeft > 0) {
                    container.scrollLeft -= scrollSpeed
                    checkScrollButtons()
                } else {
                    clearInterval(interval)
                    setAutoScrollInterval(null)
                }
            }, 20)
            setAutoScrollInterval(interval)
        }
        else if (distanceFromRight < threshold && distanceFromRight > 0) {
            const interval = setInterval(() => {
                const maxScroll = container.scrollWidth - container.clientWidth
                if (container.scrollLeft < maxScroll) {
                    container.scrollLeft += scrollSpeed
                    checkScrollButtons()
                } else {
                    clearInterval(interval)
                    setAutoScrollInterval(null)
                }
            }, 20)
            setAutoScrollInterval(interval)
        }
    }, [draggedContact, autoScrollInterval])

    useEffect(() => {
        return () => {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval)
            }
        }
    }, [autoScrollInterval])

    // Funciones de Drag and Drop
    const handleDragStart = (e, contact, fromStage) => {
        setDraggedContact(contact)
        setDraggedFromStage(fromStage)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', e.currentTarget)
        e.currentTarget.style.opacity = '0.5'
    }

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1'
        setDraggedContact(null)
        setDraggedFromStage(null)
        setDropTargetStage(null)
        
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval)
            setAutoScrollInterval(null)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        handleAutoScroll(e)
    }

    const handleDragEnter = (e, stage) => {
        e.preventDefault()
        setDropTargetStage(stage)
    }

    const handleDragLeave = (e) => {
        if (e.currentTarget === e.target) {
            setDropTargetStage(null)
        }
    }

    const handleDrop = async (e, toStage) => {
        e.preventDefault()
        setDropTargetStage(null)

        if (!draggedContact || draggedFromStage === toStage) {
            return
        }

        const newStageIndex = stages.indexOf(toStage)
        if (newStageIndex === -1) return

        const chatId = draggedContact.id || draggedContact.chat_id

        if (!chatId) {
            showToast('No se encontró el ID del chat', 'error')
            return
        }

        const previousStage = draggedContact.estado_embudo
        
        // Actualización optimista
        setLocalStepIndices(prev => ({
            ...prev,
            [chatId]: newStageIndex
        }))

        setLocalChats(prevChats => 
            prevChats.map(chat => 
                (chat.id === chatId || chat.chat_id === chatId)
                    ? { ...chat, estado_embudo: toStage }
                    : chat
            )
        )

        setDraggedContact(null)
        setDraggedFromStage(null)

        showToast('Guardando cambio...', 'info')

        try {
            const response = await fetch('/api/updateChatStage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId: chatId,
                    newStageIndex: newStageIndex,
                    clientType: selectedClientType,
                    stageName: toStage
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al actualizar la etapa')
            }

            const data = await response.json()
            console.log('✅ Etapa actualizada exitosamente:', data)

            showToast(`Movido a "${toStage.replace(/^[0-9]+\.\s*/, '')}"`, 'success')

        } catch (error) {
            console.error('❌ Error al mover el contacto:', error)
            
            // Rollback
            const previousStageIndex = stages.indexOf(previousStage)
            setLocalStepIndices(prev => ({
                ...prev,
                [chatId]: previousStageIndex >= 0 ? previousStageIndex : 0
            }))
            
            setLocalChats(prevChats => 
                prevChats.map(chat => 
                    (chat.id === chatId || chat.chat_id === chatId)
                        ? { ...chat, estado_embudo: previousStage }
                        : chat
                )
            )
            
            showToast(error.message || 'Error al mover el contacto. Revirtiendo cambios...', 'error')
        }
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
            {/* Inyectar estilos de scroll */}
            <style dangerouslySetInnerHTML={{ __html: scrollStyles }} />
            
            {/* Si no hay tipos de cliente configurados, mostrar pantalla de bienvenida */}
            {availableClientTypes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                    <div className="max-w-md text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Bienvenido al Pipeline de Ventas
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Para comenzar a usar el pipeline, primero necesitas configurar tus tipos de clientes 
                            y definir las etapas del proceso de venta para cada uno.
                        </p>
                        <button
                            onClick={() => {
                                if (onOpenClientTypesConfig) {
                                    onOpenClientTypesConfig();
                                } else {
                                    showToast('Función no disponible', 'error');
                                }
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Crear mi primer tipo de cliente
                        </button>
                        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 text-left">
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                ¿Qué son los tipos de cliente?
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Los tipos de cliente te permiten categorizar tus contactos (ej: Comprador, Vendedor, Inversor) 
                                y definir un proceso de venta específico con etapas personalizadas para cada uno.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
            {/* Header Compacto */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2.5 text-white flex-shrink-0 shadow-md">
                <div className="flex items-center justify-between gap-3">
                    {/* Título e Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold leading-tight">Pipeline de Ventas</h2>
                            <p className="text-xs text-white/80">Total: {stats.total} contactos</p>
                        </div>
                    </div>
                    
                    {/* Selector de Tipo de Cliente */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white/90">Tipo:</span>
                        <div className="relative">
                            <select
                                value={selectedClientType}
                                onChange={(e) => {
                                    if (e.target.value === '__manage__') {
                                        // Abrir modal de gestión
                                        if (onOpenClientTypesConfig) {
                                            onOpenClientTypesConfig();
                                        }
                                        return;
                                    }
                                    setSelectedClientType(e.target.value);
                                }}
                                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-white text-indigo-600 border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-md appearance-none pr-8"
                            >
                                {availableClientTypes.length === 0 ? (
                                    <option value="">Sin tipos configurados</option>
                                ) : (
                                    availableClientTypes.map((type) => {
                                        const count = chats.filter(c => (c.tipo_cliente || c.client_type) === type).length;
                                        return (
                                            <option key={type} value={type}>
                                                {type} ({count})
                                            </option>
                                        );
                                    })
                                )}
                                
                                {/* Separador visual */}
                                <option disabled>──────────</option>
                                
                                {/* Opción para gestionar */}
                                <option value="__manage__" className="font-semibold">
                                    ⚙️ Gestionar tipos
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Buscador Compacto */}
                    <div className="relative max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-white/60" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-sm bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>
                    
                    {/* Indicador de Drag */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/30 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-[11px] font-medium text-white">Arrastra</span>
                    </div>
                </div>
            </div>

            {/* Pipeline con scroll horizontal */}
            <div className="flex-1 relative flex flex-col overflow-hidden">
                {/* Flecha izquierda - Minimalista */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-indigo-600/90 backdrop-blur-sm shadow-lg hover:bg-indigo-700 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                )}

                {/* Flecha derecha - Minimalista */}
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-indigo-600/90 backdrop-blur-sm shadow-lg hover:bg-indigo-700 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                )}

                {/* Contenedor de columnas con scroll minimalista */}
                <div className="flex-1 overflow-hidden">
                    <div 
                        ref={scrollContainerRef}
                        className="w-full h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-200"
                        style={{ 
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#818cf8 #e5e7eb'
                        }}
                    >
                        <div className="flex gap-3 p-3 h-full" style={{ minWidth: 'max-content' }}>
                            {stages.map((stage, stageIndex) => {
                                const contacts = contactsByStage[stage] || []
                                const color = getStageColor(stageIndex)
                                
                                return (
                                    <div
                                        key={stage}
                                        className={`flex-shrink-0 w-72 flex flex-col ${color.bg} rounded-lg border-2 ${color.border} shadow-md transition-all duration-200 ${
                                            hoveredStage === stage ? 'shadow-xl ring-2 ring-indigo-300' : ''
                                        } ${dropTargetStage === stage ? 'ring-4 ring-indigo-400 ring-opacity-50 scale-[1.02]' : ''}`}
                                        style={{ height: 'calc(100vh - 140px)' }}
                                        onMouseEnter={() => setHoveredStage(stage)}
                                        onMouseLeave={() => setHoveredStage(null)}
                                        onDragOver={handleDragOver}
                                        onDragEnter={(e) => handleDragEnter(e, stage)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, stage)}
                                    >
                                        {/* Header de la columna - Más compacto */}
                                        <div className={`p-2.5 border-b-2 ${color.border} flex-shrink-0`}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <h3 className={`font-bold ${color.text} text-xs leading-tight`}>
                                                    {stage.replace(/^[0-9]+\.\s*/, "")}
                                                </h3>
                                                <span className={`${color.badge} text-white text-[11px] font-bold px-2 py-0.5 rounded-full`}>
                                                    {contacts.length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1">
                                                <div
                                                    className={`${color.badge} h-1 rounded-full transition-all duration-300`}
                                                    style={{ width: `${stats.total > 0 ? (contacts.length / stats.total) * 100 : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Lista de contactos - Ocupa todo el espacio vertical disponible */}
                                        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                                            style={{ 
                                                scrollbarWidth: 'thin',
                                                scrollbarColor: '#9ca3af #e5e7eb'
                                            }}
                                        >
                                            {contacts.length === 0 ? (
                                                <div className="text-center py-6">
                                                    <User className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                                    <p className="text-xs text-gray-500">Sin contactos</p>
                                                </div>
                                            ) : (
                                                contacts.map((contact) => {
                                                    const isActive = activeChat?.id === contact.id || activeChat?.chat_id === contact.chat_id
                                                    
                                                    return (
                                                        <div
                                                            key={contact.chat_id || contact.id}
                                                            draggable={true}
                                                            onDragStart={(e) => handleDragStart(e, contact, stage)}
                                                            onDragEnd={handleDragEnd}
                                                            onClick={() => onSelectChat(contact)}
                                                            className={`bg-white rounded-lg p-2.5 border-2 cursor-move transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                                                                isActive 
                                                                    ? `${color.border} ring-2 ring-offset-1 ${color.badge.replace('bg-', 'ring-')}` 
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            } ${(draggedContact?.id === contact.id) ? 'opacity-50' : ''}`}
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <Avatar className="w-9 h-9 ring-2 ring-gray-200 flex-shrink-0">
                                                                    <img
                                                                        src={
                                                                            contact.picture_url || 
                                                                            contact.avatarUrl || 
                                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                                contact.contact_name || contact.nombre || contact.push_name || contact.pushName || contact.telefono
                                                                            )}&background=6366f1&color=fff&size=64`
                                                                        }
                                                                        alt={contact.contact_name || contact.nombre || "Avatar"}
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                                contact.contact_name || contact.nombre || contact.push_name || contact.pushName || contact.telefono
                                                                            )}&background=6b7280&color=fff&size=64`
                                                                        }}
                                                                    />
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-gray-900 text-xs truncate leading-tight">
                                                                        {contact.contact_name || contact.nombre || contact.push_name || contact.pushName || "Sin nombre"}
                                                                    </h4>
                                                                    <div className="space-y-0.5 mt-1">
                                                                        <div className="flex items-center gap-1 text-[11px] text-gray-600">
                                                                            <Phone className="w-2.5 h-2.5 flex-shrink-0" />
                                                                            <span className="truncate">{contact.telefono}</span>
                                                                        </div>
                                                                        {contact.ultima_interaccion && (
                                                                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                                                <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                                                                                <span className="truncate">
                                                                                    {new Date(contact.ultima_interaccion).toLocaleDateString('es-AR', { 
                                                                                        day: 'numeric', 
                                                                                        month: 'short' 
                                                                                    })}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {(() => {
                                                                        const etiquetas = Array.isArray(contact.etiquetas) 
                                                                            ? contact.etiquetas 
                                                                            : typeof contact.etiquetas === 'string' 
                                                                                ? JSON.parse(contact.etiquetas || '[]')
                                                                                : []
                                                                        
                                                                        return etiquetas.length > 0 && (
                                                                            <div className="flex gap-1 mt-1.5 flex-wrap">
                                                                                {etiquetas.slice(0, 2).map((tag, idx) => (
                                                                                    <span
                                                                                        key={idx}
                                                                                        className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] rounded-full font-medium"
                                                                                    >
                                                                                        {tag}
                                                                                    </span>
                                                                                ))}
                                                                                {etiquetas.length > 2 && (
                                                                                    <span className="inline-block px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[9px] rounded-full font-bold">
                                                                                        +{etiquetas.length - 2}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            </>
            )}
        </div>
    )
}
