"use client"

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TrendingUp, X } from 'lucide-react';

/**
 * Modal de Pipeline - Vista del embudo de ventas
 * (Versión simplificada - se puede copiar la completa del CRM de agentes)
 */
export default function PipelineModal({ isOpen, onClose, chats, clientTypes, getSalesStepsForClient, salesStepIndices }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Pipeline de Ventas</h2>
                            <p className="text-purple-100 text-sm">Visualiza tu embudo de conversión</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="text-center py-12">
                        <p className="text-gray-600 mb-4">Vista de Pipeline</p>
                        <p className="text-sm text-gray-500">
                            Implementar vista de embudo con etapas y arrastre de clientes
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
