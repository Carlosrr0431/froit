"use client"

import { Filter, Tag as TagIcon, Users } from 'lucide-react';

/**
 * Componente de filtros para la lista de chats
 */
export default function ChatFilters({ crmState, allTags, dynamicClientTypes, compact = false }) {
    
    // Versión compacta (botones pequeños en línea)
    if (compact) {
        return (
            <div className="flex items-center gap-1">
                {/* Botón Tipo de Cliente */}
                {dynamicClientTypes?.length > 0 && (
                    <button
                        onClick={() => {
                            const dropdown = document.getElementById('tipo-cliente-dropdown');
                            if (dropdown) {
                                dropdown.classList.toggle('hidden');
                            }
                        }}
                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors relative"
                        title="Tipo Cliente"
                    >
                        <Users size={16} className="text-gray-600" />
                        {crmState.selectedClientTypeFilter && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        
                        {/* Dropdown de tipos */}
                        <div
                            id="tipo-cliente-dropdown"
                            className="hidden absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[150px]"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    crmState.setSelectedClientTypeFilter(null);
                                    document.getElementById('tipo-cliente-dropdown').classList.add('hidden');
                                }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b"
                            >
                                Todos
                            </button>
                            {dynamicClientTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        crmState.setSelectedClientTypeFilter(type);
                                        document.getElementById('tipo-cliente-dropdown').classList.add('hidden');
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </button>
                )}

                {/* Botón Etiquetas */}
                {allTags?.length > 0 && (
                    <button
                        onClick={() => {
                            const dropdown = document.getElementById('etiquetas-dropdown');
                            if (dropdown) {
                                dropdown.classList.toggle('hidden');
                            }
                        }}
                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors relative"
                        title="Etiquetas"
                    >
                        <TagIcon size={16} className="text-gray-600" />
                        {crmState.selectedTagFilter?.length > 0 && (
                            <div className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-[9px] font-bold text-white">{crmState.selectedTagFilter.length}</span>
                            </div>
                        )}
                        
                        {/* Dropdown de etiquetas */}
                        <div
                            id="etiquetas-dropdown"
                            className="hidden absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto min-w-[180px]"
                        >
                            {allTags.map((tag) => (
                                <label
                                    key={tag.id}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type="checkbox"
                                        checked={crmState.selectedTagFilter?.includes(tag.id) || false}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                crmState.setSelectedTagFilter([...(crmState.selectedTagFilter || []), tag.id]);
                                            } else {
                                                crmState.setSelectedTagFilter(
                                                    (crmState.selectedTagFilter || []).filter(id => id !== tag.id)
                                                );
                                            }
                                        }}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: tag.color }}
                                    />
                                    <span className="text-xs text-gray-700">{tag.nombre}</span>
                                </label>
                            ))}
                        </div>
                    </button>
                )}

                {/* Botón Etapa */}
                <button
                    onClick={() => {
                        const dropdown = document.getElementById('etapa-dropdown');
                        if (dropdown) {
                            dropdown.classList.toggle('hidden');
                        }
                    }}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors relative"
                    title="Etapa"
                >
                    <Filter size={16} className="text-gray-600" />
                    {crmState.selectedStepFilter && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    
                    {/* Dropdown de etapas */}
                    <div
                        id="etapa-dropdown"
                        className="hidden absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[150px] max-h-60 overflow-y-auto"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                crmState.setSelectedStepFilter(null);
                                document.getElementById('etapa-dropdown').classList.add('hidden');
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b"
                        >
                            Todas las etapas
                        </button>
                        {/* Aquí puedes agregar las etapas disponibles */}
                    </div>
                </button>
            </div>
        );
    }

    // Versión normal (expandida)
    return (
        <div className="p-4 border-b border-gray-200/50 bg-gradient-to-b from-white/50 to-gray-50/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <Filter size={14} className="text-blue-600" />
                </div>
                <span className="text-sm font-bold text-gray-700">Filtros</span>
            </div>

            <div className="space-y-2.5">
                {/* Filtro por tipo de cliente */}
                {dynamicClientTypes?.length > 0 && (
                    <select
                        value={crmState.selectedClientTypeFilter || ''}
                        onChange={(e) => crmState.setSelectedClientTypeFilter(e.target.value || null)}
                        className="w-full px-3.5 py-2.5 text-sm border-2 border-gray-200/50 rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                                 transition-all duration-200 bg-white hover:border-gray-300 font-medium text-gray-700"
                    >
                        <option value="">Todos los tipos</option>
                        {dynamicClientTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                )}

                {/* Filtro por etiquetas */}
                {allTags?.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => {
                                // Toggle del dropdown de etiquetas
                                const dropdown = document.getElementById('tags-dropdown');
                                if (dropdown) {
                                    dropdown.classList.toggle('hidden');
                                }
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between"
                        >
                            <span className="text-gray-700">
                                {crmState.selectedTagFilter?.length > 0
                                    ? `${crmState.selectedTagFilter.length} etiqueta(s)`
                                    : 'Filtrar por etiquetas'
                                }
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div
                            id="tags-dropdown"
                            className="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                        >
                            {allTags.map((tag) => (
                                <label
                                    key={tag.id}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={crmState.selectedTagFilter?.includes(tag.id) || false}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                crmState.setSelectedTagFilter([...(crmState.selectedTagFilter || []), tag.id]);
                                            } else {
                                                crmState.setSelectedTagFilter(
                                                    (crmState.selectedTagFilter || []).filter(id => id !== tag.id)
                                                );
                                            }
                                        }}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: tag.color }}
                                    />
                                    <span className="text-sm text-gray-700">{tag.nombre}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Botón para limpiar filtros */}
                {(crmState.selectedClientTypeFilter || crmState.selectedTagFilter?.length > 0 || crmState.selectedStepFilter) && (
                    <button
                        onClick={() => {
                            crmState.setSelectedClientTypeFilter(null);
                            crmState.setSelectedTagFilter([]);
                            crmState.setSelectedStepFilter(null);
                        }}
                        className="w-full px-3.5 py-2.5 text-sm bg-gradient-to-r from-red-50 to-rose-50 text-red-600 
                                 hover:from-red-100 hover:to-rose-100 rounded-xl transition-all duration-200 
                                 font-semibold border-2 border-red-200/50 hover:border-red-300 
                                 hover:shadow-md hover:shadow-red-500/10"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>
        </div>
    );
}
