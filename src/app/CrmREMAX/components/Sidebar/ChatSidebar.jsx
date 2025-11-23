"use client"

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Search, Home, Users, TrendingUp, Calendar, Trophy, Mail, Bell, Building2, MoreVertical } from 'lucide-react';
import ChatList from './ChatList';
import ChatFilters from './ChatFilters';

/**
 * Componente Sidebar del CRM
 * Muestra la lista de chats y filtros
 */
export default function ChatSidebar({ wasender, crmState, showToast, session, isMobile, activeTab, setActiveTab }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [visibleTabs, setVisibleTabs] = useState([]);
    const [hiddenTabs, setHiddenTabs] = useState([]);
    const navRef = useRef(null);
    const moreButtonRef = useRef(null);

    // Filtrar chats por búsqueda
    const filteredChats = wasender.chats?.filter(chat => {
        if (!searchQuery.trim()) return true;
        
        const query = searchQuery.toLowerCase();
        const chatName = (chat.nombre || chat.name || chat.contact_name || chat.pushName || '').toLowerCase();
        const telefono = (chat.telefono || chat.id || '').toString().toLowerCase();
        const lastMessage = (chat.lastMessage || '').toLowerCase();
        
        return chatName.includes(query) || telefono.includes(query) || lastMessage.includes(query);
    }) || [];

    // Tabs de navegación
    const tabs = [
        { id: 'chats', label: 'Chats', icon: Home },
        { id: 'clientes', label: 'Clientes', icon: Users },
        { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
        { id: 'calendario', label: 'Calendario', icon: Calendar },
        { id: 'propiedades', label: 'Propiedades', icon: Building2 },
        { id: 'ranking', label: 'Ranking', icon: Trophy },
        { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
        { id: 'gmail', label: 'Gmail', icon: Mail },
    ];

    // Calcular qué tabs mostrar y cuáles ocultar en el menú "Más"
    useEffect(() => {
        const calculateVisibleTabs = () => {
            if (!navRef.current) return;
            
            const containerWidth = navRef.current.offsetWidth;
            const buttonWidth = 56; // Ancho aproximado de cada botón (52px + gap)
            const moreButtonWidth = 56; // Espacio para el botón "Más"
            
            // Calcular cuántos botones caben (dejando espacio para "Más")
            const availableWidth = containerWidth - moreButtonWidth - 8; // 8px de padding
            const maxButtons = Math.floor(availableWidth / buttonWidth);
            
            if (maxButtons >= tabs.length) {
                // Todos los tabs caben
                setVisibleTabs(tabs);
                setHiddenTabs([]);
            } else {
                // Algunos tabs deben ir al menú "Más"
                setVisibleTabs(tabs.slice(0, Math.max(2, maxButtons)));
                setHiddenTabs(tabs.slice(Math.max(2, maxButtons)));
            }
        };

        calculateVisibleTabs();
        window.addEventListener('resize', calculateVisibleTabs);
        
        return () => window.removeEventListener('resize', calculateVisibleTabs);
    }, []);

    // Cerrar menú "Más" al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreButtonRef.current && !moreButtonRef.current.contains(event.target)) {
                setShowMoreMenu(false);
            }
        };

        if (showMoreMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMoreMenu]);

    // Obtener iniciales del nombre
    const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className={`${isMobile ? 'w-full' : 'w-full sm:w-[390px] lg:w-[450px]'} border-r border-gray-200/50 bg-white flex flex-col shadow-sm`}>
            {/* Header con Avatar y Nombre del Agente */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 py-3 pb-4">
                <div className="flex items-center gap-3">
                    {/* Avatar del agente */}
                    <div className="relative">
                        {session?.user?.image ? (
                            <Image 
                                src={session.user.image} 
                                alt={session.user.name || 'Usuario'}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full border-2 border-white/50 shadow-lg object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {getInitials(session?.user?.name || wasender.agentConfig?.nombre_completo || 'Usuario')}
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>

                    {/* Nombre del agente */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-bold text-white truncate">
                            {session?.user?.name || wasender.agentConfig?.nombre_completo || 'Usuario'}
                        </h2>
                        <p className="text-xs text-white/80 truncate">En línea</p>
                    </div>
                </div>
            </div>

            {/* Navegación con botones circulares */}
            <div className="bg-white py-4 px-3 border-b border-gray-200/50">
                <div ref={navRef} className="flex items-center justify-start gap-1.5 relative">
                    {/* Tabs visibles */}
                    {visibleTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="flex flex-col items-center gap-1.5 min-w-[52px] flex-shrink-0 group relative"
                                title={tab.label}
                            >
                                {/* Círculo del icono */}
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                                    isActive
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}>
                                    <Icon size={18} className={isActive ? 'text-white' : 'text-gray-600'} />
                                </div>
                                
                                {/* Label debajo del círculo */}
                                <span className={`text-[9px] font-medium transition-colors leading-tight text-center ${
                                    isActive 
                                        ? 'text-blue-600' 
                                        : 'text-gray-500'
                                }`}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}

                    {/* Botón "Más" si hay tabs ocultos */}
                    {hiddenTabs.length > 0 && (
                        <div className="relative" ref={moreButtonRef}>
                            <button
                                onClick={() => setShowMoreMenu(!showMoreMenu)}
                                onMouseEnter={() => setShowMoreMenu(true)}
                                className="flex flex-col items-center gap-1.5 min-w-[52px] flex-shrink-0 group relative"
                                title="Más opciones"
                            >
                                {/* Círculo del icono */}
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                                    showMoreMenu
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}>
                                    <MoreVertical size={18} className={showMoreMenu ? 'text-white' : 'text-gray-600'} />
                                </div>
                                
                                {/* Label debajo del círculo */}
                                <span className={`text-[9px] font-medium transition-colors leading-tight text-center ${
                                    showMoreMenu 
                                        ? 'text-blue-600' 
                                        : 'text-gray-500'
                                }`}>
                                    Más
                                </span>
                            </button>

                            {/* Menú desplegable */}
                            {showMoreMenu && (
                                <div 
                                    className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[180px]"
                                    onMouseLeave={() => setShowMoreMenu(false)}
                                >
                                    {hiddenTabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    setActiveTab(tab.id);
                                                    setShowMoreMenu(false);
                                                }}
                                                className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left ${
                                                    isActive
                                                        ? 'bg-blue-50 text-blue-600'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                            >
                                                <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-600'} />
                                                <span className="text-sm font-medium">{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Buscador y Filtros en línea */}
            <div className="px-4 py-3 border-b border-gray-200/50 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    {/* Buscador */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar conversaciones..."
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                                     transition-all placeholder-gray-400"
                        />
                    </div>

                    {/* Filtros compactos */}
                    <ChatFilters
                        crmState={crmState}
                        allTags={crmState.allTags}
                        dynamicClientTypes={crmState.dynamicClientTypes}
                        compact={true}
                    />
                </div>
            </div>

            {/* Lista de chats o clientes según el tab activo */}
            {activeTab === 'clientes' ? (
                // Vista de clientes filtrada
                <div className="flex-1 overflow-y-auto">
                    {(() => {
                        // Filtrar solo chats que tengan etiquetas o tipo de cliente
                        const clientChats = filteredChats.filter(chat => {
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
                        });

                        if (clientChats.length === 0) {
                            return (
                                <div className="flex-1 flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <Users size={32} className="text-blue-600" />
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900 mb-1.5">No hay clientes</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Los clientes aparecerán aquí cuando asignes etiquetas o tipos de cliente
                                        </p>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <ChatList
                                chats={clientChats}
                                activeChat={crmState.activeChat}
                                onSelectChat={(chat) => {
                                    crmState.setActiveChat(chat);
                                    if (isMobile) {
                                        crmState.setMobileView('chat');
                                    }
                                }}
                                selectedTagFilter={crmState.selectedTagFilter}
                                selectedStepFilter={crmState.selectedStepFilter}
                                selectedClientTypeFilter={crmState.selectedClientTypeFilter}
                                salesStepIndices={crmState.salesStepIndices}
                                clientTypesSelected={crmState.clientTypesSelected}
                                getSalesStepsForClient={crmState.getSalesStepsForClient}
                                wasender={wasender}
                            />
                        );
                    })()}
                </div>
            ) : (
                // Vista normal de chats
                <ChatList
                    chats={filteredChats}
                    activeChat={crmState.activeChat}
                    onSelectChat={(chat) => {
                        crmState.setActiveChat(chat);
                        if (isMobile) {
                            crmState.setMobileView('chat');
                        }
                    }}
                    selectedTagFilter={crmState.selectedTagFilter}
                    selectedStepFilter={crmState.selectedStepFilter}
                    selectedClientTypeFilter={crmState.selectedClientTypeFilter}
                    salesStepIndices={crmState.salesStepIndices}
                    clientTypesSelected={crmState.clientTypesSelected}
                    getSalesStepsForClient={crmState.getSalesStepsForClient}
                    wasender={wasender}
                />
            )}
        </div>
    );
}
