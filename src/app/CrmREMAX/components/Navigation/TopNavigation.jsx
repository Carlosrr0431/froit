"use client"

import { Home, Calendar, Users, TrendingUp, Trophy, Mail, MoreVertical } from 'lucide-react';

/**
 * Componente de navegación superior con tabs estilo CRM de agentes - Diseño circular minimalista
 */
export default function TopNavigation({ activeTab, setActiveTab, isMobile, onOpenMoreMenu }) {
    const tabs = [
        { id: 'chats', label: 'Chats', icon: Home },
        { id: 'clientes', label: 'Clientes', icon: Users },
        { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
        { id: 'calendario', label: 'Calendario', icon: Calendar },
        { id: 'ranking', label: 'Ranking', icon: Trophy },
        { id: 'gmail', label: 'Gmail', icon: Mail },
    ];

    return (
        <div className="border-b border-gray-200/30 bg-white shadow-sm">
            <div className="flex items-center justify-center gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
                {/* Tabs principales con diseño circular */}
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex flex-col items-center gap-1.5 min-w-[60px] group"
                            title={tab.label}
                        >
                            {/* Círculo del icono */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isActive
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40 scale-110'
                                    : 'bg-gray-100 hover:bg-gray-200 group-hover:scale-105'
                            }`}>
                                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-600'} />
                            </div>
                            
                            {/* Label debajo del círculo */}
                            <span className={`text-xs font-medium transition-colors ${
                                isActive 
                                    ? 'text-blue-600' 
                                    : 'text-gray-500 group-hover:text-gray-700'
                            }`}>
                                {tab.label}
                            </span>

                            {/* Indicador activo (puntito) */}
                            {isActive && (
                                <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse"></div>
                            )}
                        </button>
                    );
                })}

                {/* Botón Más con diseño circular */}
                {isMobile && (
                    <button
                        onClick={onOpenMoreMenu}
                        className="flex flex-col items-center gap-1.5 min-w-[60px] group"
                        title="Más opciones"
                    >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all duration-300 group-hover:scale-105">
                            <MoreVertical size={20} className="text-gray-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                            Más
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}
