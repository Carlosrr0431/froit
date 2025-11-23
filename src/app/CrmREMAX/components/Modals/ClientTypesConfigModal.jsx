"use client"

import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Edit2, Trash2, Loader2, Check } from 'lucide-react';
import { supabaseClient } from '@/lib/supabase';

export default function ClientTypesConfigModal({ isOpen, onClose, agentEmail, agentCode, onConfigSaved, showToast }) {
    const [clientTypes, setClientTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [showAddType, setShowAddType] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    
    // Estados para nuevo tipo (sin pasos, se configuran después)
    const [newType, setNewType] = useState({
        nombre_tipo: '',
        descripcion: '',
        color: '#6366f1',
        icono: '👤'
    });

    // Cargar tipos de clientes del agente
    const loadClientTypes = useCallback(async () => {
        if (!agentEmail) return;
        setLoading(true);
        try {
            console.log('🔍 Cargando tipos de clientes para:', agentEmail);
            
            // Cargar tipos de clientes directamente de la tabla
            const { data: tiposData, error: tiposError } = await supabaseClient
                .from('tipos_clientes_personalizados')
                .select('*')
                .eq('agente_email', agentEmail)
                .eq('activo', true)
                .order('orden', { ascending: true });

            if (tiposError) {
                console.error('❌ Error cargando tipos:', tiposError);
                throw tiposError;
            }

            console.log('✅ Tipos cargados:', tiposData);

            // Para cada tipo, cargar sus pasos del proceso
            const tiposConPasos = await Promise.all(
                (tiposData || []).map(async (tipo) => {
                    const { data: pasosData, error: pasosError } = await supabaseClient
                        .from('procesos_venta_personalizados')
                        .select('nombre_paso, orden')
                        .eq('tipo_cliente_id', tipo.id)
                        .eq('activo', true)
                        .order('orden', { ascending: true });

                    if (pasosError) {
                        console.error('Error cargando pasos para tipo', tipo.id, pasosError);
                    }

                    return {
                        id: tipo.id,
                        nombre: tipo.nombre_tipo,
                        descripcion: tipo.descripcion,
                        color: tipo.color,
                        icono: tipo.icono,
                        orden: tipo.orden,
                        pasos: (pasosData || []).map(p => ({ nombre: p.nombre_paso }))
                    };
                })
            );

            console.log('✅ Tipos con pasos:', tiposConPasos);
            setClientTypes(tiposConPasos);
        } catch (error) {
            console.error('❌ Error cargando tipos de clientes:', error);
            showToast?.('Error al cargar los tipos de clientes: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [agentEmail, showToast]);

    useEffect(() => {
        if (isOpen) {
            console.log('📂 Modal abierto, cargando tipos de clientes...');
            loadClientTypes();
        }
    }, [isOpen, loadClientTypes]);

    // Guardar nuevo tipo de cliente (sin pasos)
    const handleSaveNewType = async () => {
        if (!newType.nombre_tipo.trim()) {
            showToast?.('El nombre del tipo de cliente es obligatorio', 'warning');
            return;
        }

        setSaving(true);
        try {
            // Verificar si el tipo ya existe
            const { data: existingType, error: checkError } = await supabaseClient
                .from('tipos_clientes_personalizados')
                .select('id, nombre_tipo')
                .eq('agente_email', agentEmail)
                .eq('nombre_tipo', newType.nombre_tipo.trim())
                .maybeSingle();

            if (checkError) {
                console.error('Error verificando tipo existente:', checkError);
                throw checkError;
            }

            if (existingType) {
                showToast?.(`El tipo de cliente "${newType.nombre_tipo}" ya existe. Por favor, usa un nombre diferente.`, 'warning');
                setSaving(false);
                return;
            }

            // Si no existe, crear el tipo de cliente
            const { data: tipoCreado, error: errorTipo } = await supabaseClient
                .from('tipos_clientes_personalizados')
                .insert({
                    agente_email: agentEmail,
                    nombre_tipo: newType.nombre_tipo.trim(),
                    descripcion: newType.descripcion?.trim() || null,
                    color: newType.color,
                    icono: newType.icono,
                    orden: 999,
                    activo: true
                })
                .select()
                .single();

            if (errorTipo) throw errorTipo;

            console.log('✅ Tipo de cliente creado:', tipoCreado);

            await loadClientTypes();
            setShowAddType(false);
            setNewType({
                nombre_tipo: '',
                descripcion: '',
                color: '#6366f1',
                icono: '👤'
            });
            
            if (onConfigSaved) onConfigSaved();
            showToast?.(`Tipo de cliente "${newType.nombre_tipo}" creado exitosamente`, 'success');
        } catch (error) {
            console.error('Error guardando tipo de cliente:', error);
            
            if (error.code === '23505') {
                showToast?.(`El tipo de cliente "${newType.nombre_tipo}" ya existe. Por favor, usa un nombre diferente.`, 'warning');
            } else {
                showToast?.('Error al guardar el tipo de cliente: ' + error.message, 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    // Actualizar nombre, color e icono de un tipo existente
    const handleUpdateType = async (tipoId, updatedData) => {
        setSaving(true);
        try {
            // Verificar si el nuevo nombre ya existe (solo si se está cambiando el nombre)
            const { data: currentType } = await supabaseClient
                .from('tipos_clientes_personalizados')
                .select('nombre_tipo')
                .eq('id', tipoId)
                .single();

            const nombreCambiado = currentType && currentType.nombre_tipo !== updatedData.nombre_tipo.trim();
            const nombreAntiguo = currentType?.nombre_tipo;

            if (nombreCambiado) {
                const { data: duplicateType } = await supabaseClient
                    .from('tipos_clientes_personalizados')
                    .select('id')
                    .eq('agente_email', agentEmail)
                    .eq('nombre_tipo', updatedData.nombre_tipo.trim())
                    .neq('id', tipoId)
                    .maybeSingle();

                if (duplicateType) {
                    showToast?.(`El nombre "${updatedData.nombre_tipo}" ya está en uso. Por favor, usa un nombre diferente.`, 'warning');
                    setSaving(false);
                    return;
                }
            }

            // Actualizar el tipo
            const { error } = await supabaseClient
                .from('tipos_clientes_personalizados')
                .update({
                    nombre_tipo: updatedData.nombre_tipo.trim(),
                    descripcion: updatedData.descripcion?.trim() || null,
                    color: updatedData.color,
                    icono: updatedData.icono
                })
                .eq('id', tipoId);

            if (error) throw error;

            // ✅ NUEVO: Si cambió el nombre, actualizar todos los chats que tienen el tipo antiguo
            if (nombreCambiado && nombreAntiguo && agentCode) {
                console.log(`🔄 Actualizando chats con tipo "${nombreAntiguo}" a "${updatedData.nombre_tipo.trim()}"`);
                console.log(`🔑 Usando propietario (agent_code): ${agentCode}`);
                
                // Actualizar chats usando agentCode como propietario
                const { error: updateChatsError, count } = await supabaseClient
                    .from('chats')
                    .update({ tipo_cliente: updatedData.nombre_tipo.trim() })
                    .eq('propietario', agentCode)
                    .eq('tipo_cliente', nombreAntiguo);

                if (updateChatsError) {
                    console.error('⚠️ Error actualizando chats:', updateChatsError);
                } else {
                    console.log(`✅ ${count || 0} chats actualizados con el nuevo nombre de tipo`);
                }
            }

            await loadClientTypes();
            setEditingType(null);
            
            // ✅ Notificar al padre para refrescar los datos del chat activo
            if (onConfigSaved) {
                await onConfigSaved();
            }
            
            showToast?.('Tipo de cliente actualizado exitosamente', 'success');
        } catch (error) {
            console.error('Error actualizando tipo:', error);
            
            if (error.code === '23505') {
                showToast?.(`El nombre "${updatedData.nombre_tipo}" ya está en uso. Por favor, usa un nombre diferente.`, 'warning');
            } else {
                showToast?.('Error al actualizar el tipo de cliente: ' + error.message, 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    // Eliminar tipo de cliente
    const handleDeleteType = async (tipoId) => {
        setSaving(true);
        try {
            // ✅ NUEVO: Obtener el nombre del tipo antes de desactivarlo
            const { data: tipoData } = await supabaseClient
                .from('tipos_clientes_personalizados')
                .select('nombre_tipo')
                .eq('id', tipoId)
                .single();

            const nombreTipo = tipoData?.nombre_tipo;

            // Desactivar el tipo de cliente
            const { error } = await supabaseClient
                .from('tipos_clientes_personalizados')
                .update({ activo: false })
                .eq('id', tipoId);

            if (error) throw error;

            // ✅ NUEVO: Limpiar el campo tipo_cliente de todos los chats que tenían este tipo
            if (nombreTipo && agentCode) {
                console.log(`🧹 Limpiando tipo de cliente "${nombreTipo}" de todos los chats`);
                console.log(`🔑 Usando propietario (agent_code): ${agentCode}`);
                
                // Limpiar chats usando agentCode como propietario
                const { error: clearChatsError, count } = await supabaseClient
                    .from('chats')
                    .update({ tipo_cliente: 'No especificado' })
                    .eq('propietario', agentCode)
                    .eq('tipo_cliente', nombreTipo);

                if (clearChatsError) {
                    console.error('⚠️ Error limpiando chats:', clearChatsError);
                } else {
                    console.log(`✅ ${count || 0} chats actualizados a "No especificado"`);
                }
            }

            await loadClientTypes();
            setShowDeleteConfirm(null);
            
            // ✅ Notificar al padre para refrescar los datos del chat activo
            if (onConfigSaved) {
                await onConfigSaved();
            }
            
            showToast?.('Tipo de cliente eliminado exitosamente', 'success');
        } catch (error) {
            console.error('Error eliminando tipo:', error);
            showToast?.('Error al eliminar el tipo de cliente', 'error');
        } finally {
            setSaving(false);
        }
    };

    const iconOptions = ['👤', '🏡', '💼', '💰', '🔑', '📊', '🎯', '⭐', '🏢', '🏘️'];
    const colorOptions = [
        '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
        '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
    ];

    // Cerrar modal y limpiar estados
    const handleClose = useCallback(() => {
        setShowAddType(false);
        setEditingType(null);
        setShowDeleteConfirm(null);
        onClose();
    }, [onClose]);

    // Manejar tecla ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Prevenir scroll del body
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop con blur */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
                onClick={handleClose}
            />
            
            {/* Modal principal - Compacto y moderno */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden pointer-events-auto flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header compacto */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Tipos de Clientes</h2>
                                <p className="text-xs text-white/80">Gestiona tus tipos personalizados</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowAddType(true)}
                                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition flex items-center gap-1.5 text-sm font-medium"
                            >
                                <Plus size={16} />
                                Nuevo
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 hover:bg-white/20 rounded-lg transition flex items-center justify-center text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Contenido con scroll */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                                <p className="text-sm text-gray-500">Cargando tipos...</p>
                            </div>
                        ) : clientTypes.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">📋</span>
                                </div>
                                <p className="text-gray-600 mb-1">No hay tipos de clientes</p>
                                <p className="text-sm text-gray-400 mb-4">Crea el primero para comenzar</p>
                                <button
                                    onClick={() => setShowAddType(true)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                                >
                                    Crear primer tipo
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {clientTypes.map((tipo) => (
                                    <div
                                        key={tipo.id}
                                        className="group border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: `${tipo.color}20` }}
                                            >
                                                <span className="text-2xl">{tipo.icono}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 
                                                    className="font-semibold text-base truncate"
                                                    style={{ color: tipo.color }}
                                                >
                                                    {tipo.nombre}
                                                </h3>
                                                {tipo.descripcion && (
                                                    <p className="text-xs text-gray-500 truncate">{tipo.descripcion}</p>
                                                )}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-400">
                                                        {tipo.pasos.length} {tipo.pasos.length === 1 ? 'paso' : 'pasos'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingType(tipo)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(tipo.id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para agregar nuevo tipo - Compacto */}
            {showAddType && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
                        onClick={() => setShowAddType(false)}
                    />
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                        <div 
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Plus size={20} className="text-white" />
                                    <h3 className="text-lg font-bold text-white">Nuevo Tipo de Cliente</h3>
                                </div>
                                <button
                                    onClick={() => setShowAddType(false)}
                                    className="w-8 h-8 hover:bg-white/20 rounded-lg transition flex items-center justify-center text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            {/* Contenido */}
                            <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                                    💡 Los pasos del proceso se configuran desde Etapa del proceso en el chat
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Nombre del Tipo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newType.nombre_tipo}
                                        onChange={(e) => setNewType({...newType, nombre_tipo: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                        placeholder="Ej: Comprador, Vendedor, Inversor..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Descripción (opcional)
                                    </label>
                                    <textarea
                                        value={newType.descripcion}
                                        onChange={(e) => setNewType({...newType, descripcion: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                                        rows="2"
                                        placeholder="Breve descripción..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Icono
                                        </label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {iconOptions.map((icon) => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setNewType({...newType, icono: icon})}
                                                    className={`text-xl p-2 rounded-lg border transition ${
                                                        newType.icono === icon
                                                            ? 'border-indigo-500 bg-indigo-50 scale-110'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Color
                                        </label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {colorOptions.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setNewType({...newType, color})}
                                                    className={`w-9 h-9 rounded-lg border-2 transition ${
                                                        newType.color === color
                                                            ? 'border-gray-900 scale-110 shadow-md'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 px-5 py-3 bg-gray-50 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddType(false)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveNewType}
                                    disabled={saving || !newType.nombre_tipo.trim()}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Guardar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal para editar tipo - Compacto */}
            {editingType && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
                        onClick={() => setEditingType(null)}
                    />
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                        <div 
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Edit2 size={20} className="text-white" />
                                    <h3 className="text-lg font-bold text-white">Editar Tipo de Cliente</h3>
                                </div>
                                <button
                                    onClick={() => setEditingType(null)}
                                    className="w-8 h-8 hover:bg-white/20 rounded-lg transition flex items-center justify-center text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            {/* Contenido */}
                            <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                                    💡 Los pasos del proceso se editan desde Etapa del proceso en el chat
                                </div>
                                
                                {/* ✅ NUEVO: Advertencia sobre actualización automática de chats */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 flex-shrink-0">✓</span>
                                        <p>Al cambiar el nombre, todos los chats con este tipo se actualizarán automáticamente</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Nombre del Tipo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editingType.nombre}
                                        onChange={(e) => setEditingType({...editingType, nombre: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Descripción (opcional)
                                    </label>
                                    <textarea
                                        value={editingType.descripcion || ''}
                                        onChange={(e) => setEditingType({...editingType, descripcion: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                                        rows="2"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Icono
                                        </label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {iconOptions.map((icon) => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setEditingType({...editingType, icono: icon})}
                                                    className={`text-xl p-2 rounded-lg border transition ${
                                                        editingType.icono === icon
                                                            ? 'border-indigo-500 bg-indigo-50 scale-110'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Color
                                        </label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {colorOptions.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setEditingType({...editingType, color})}
                                                    className={`w-9 h-9 rounded-lg border-2 transition ${
                                                        editingType.color === color
                                                            ? 'border-gray-900 scale-110 shadow-md'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 px-5 py-3 bg-gray-50 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingType(null)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUpdateType(editingType.id, {
                                        nombre_tipo: editingType.nombre,
                                        descripcion: editingType.descripcion,
                                        color: editingType.color,
                                        icono: editingType.icono
                                    })}
                                    disabled={saving || !editingType.nombre?.trim()}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Guardar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal de confirmación de eliminación - Compacto */}
            {showDeleteConfirm && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
                        onClick={() => setShowDeleteConfirm(null)}
                    />
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                        <div 
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
                                    ¿Eliminar tipo de cliente?
                                </h3>
                                <p className="text-sm text-gray-600 text-center mb-3">
                                    Esta acción no se puede deshacer. El tipo de cliente será desactivado.
                                </p>
                                
                                {/* ✅ NUEVO: Advertencia sobre actualización de chats */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                                    <div className="flex items-start gap-2">
                                        <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
                                        <div className="text-xs text-amber-800">
                                            <p className="font-semibold mb-1">Los chats afectados serán actualizados</p>
                                            <p>Todos los chats con este tipo se cambiarán a No especificado</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(null)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteType(showDeleteConfirm)}
                                        disabled={saving}
                                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Eliminando...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={16} />
                                                Eliminar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
