"use client"

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

/**
 * Modal para editar información del chat (nombre y teléfono)
 */
export default function EditChatModal({ chat, isOpen, onClose, onSave, showToast }) {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && chat) {
            setNombre(chat.contact_name || chat.pushName || chat.nombre || '');
            setTelefono(chat.telefono || '');
        }
    }, [isOpen, chat]);

    const handleSave = async () => {
        if (!telefono.trim()) {
            showToast('El teléfono es requerido', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/webhookCarlosRR/chats/update-info', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId: chat.id,
                    telefono: telefono.trim(),
                    contact_name: nombre.trim() || null,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Error al actualizar');
            }

            showToast('Información actualizada exitosamente', 'success');
            onSave(result.data);
            onClose();
        } catch (error) {
            console.error('Error actualizando chat:', error);
            showToast(error.message || 'Error al actualizar la información', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Editar Información del Chat
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={isSaving}
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    {/* Campo Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Contacto
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075e54] focus:border-transparent"
                            disabled={isSaving}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Este nombre se mostrará en el chat
                        </p>
                    </div>

                    {/* Campo Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="Ej: 5493878630173"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075e54] focus:border-transparent"
                            disabled={isSaving}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Solo números, sin espacios ni caracteres especiales
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isSaving}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !telefono.trim()}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                            isSaving || !telefono.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#075e54] text-white hover:bg-[#064b44]'
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Guardar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
