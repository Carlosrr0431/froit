"use client"

import { Mail } from 'lucide-react';

/**
 * Vista de Gmail - Integración con Gmail
 * (Versión simplificada - se puede copiar la completa del CRM de agentes)
 */
export default function GmailView() {
    return (
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-red-50 to-pink-50">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Mail size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gmail Integration</h3>
                <p className="text-gray-600 mb-6">
                    Conecta tu cuenta de Gmail para gestionar correos desde el CRM
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    Conectar Gmail
                </button>
            </div>
        </div>
    );
}
