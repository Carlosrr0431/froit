"use client"

import { useEffect, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCRMState } from './hooks/useCRMState';
import { useToast } from './hooks/useToast';
import { useWasenderIntegration } from './hooks/useWasenderIntegration';
import ModernLoading from './components/Loading';
import Toast from './components/Toast';
import ChatSidebar from './components/Sidebar/ChatSidebar';
import ChatArea from './components/Chat/ChatArea';
import ClientesView from './components/Views/ClientesView';
import CalendarioView from './components/Views/CalendarioView';
import GmailView from './components/Views/GmailView';
import PipelineView from './components/Views/PipelineView';
import RankingView from './components/Views/RankingView';
import RecordatoriosView from './components/Views/RecordatoriosView';
import PropiedadesView from './components/Views/PropiedadesView';
import { useMediaQuery3 } from './hooks/useMediaQuery3';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
);

/**
 * Componente principal del CRM REMAX - Versión Modular
 * 
 * Estructura:
 * - hooks/: Lógica de estado y efectos
 * - components/: Componentes visuales reutilizables
 * - utils/: Funciones auxiliares y constantes
 * 
 * @version 2.0.0
 * @author REMAX NOA Team
 */
export default function CrmREMAX() {
    const { data: session, status } = useSession();
    const isMobile = useMediaQuery3("(max-width: 768px)");
    
    // Estados de navegación
    const [activeTab, setActiveTab] = useState('chats');
    
    // ✅ Estado para modal de gestión de tipos de clientes (compartido)
    const [showClientTypesConfigModal, setShowClientTypesConfigModal] = useState(false);
    
    // ✅ Estado para tipos de cliente (cargados de BD)
    const [clientTypes, setClientTypes] = useState([]);
    const [loadingClientTypes, setLoadingClientTypes] = useState(true);
    
    // Hook principal del estado del CRM
    const crmState = useCRMState();
    
    // Hook de Toast para notificaciones
    const { toastState, showToast, hideToast } = useToast();
    
    // Hook de integración con Wasender
    const wasender = useWasenderIntegration();

    // ✅ Función para cargar tipos de cliente desde Supabase
    const loadClientTypes = useCallback(async () => {
        if (!session?.user?.email) {
            setLoadingClientTypes(false);
            return;
        }
        
        try {
            const { data, error } = await supabase
                .rpc('obtener_tipos_clientes_con_procesos', { 
                    p_agente_email: session.user.email 
                });

            if (error) {
                console.error('Error cargando tipos:', error.message);
                setClientTypes([]);
            } else {
                const formattedTypes = (data || []).map(tipo => ({
                    id: tipo.tipo_id,
                    nombre: tipo.tipo_nombre,
                    descripcion: tipo.tipo_descripcion,
                    color: tipo.tipo_color,
                    icono: tipo.tipo_icono,
                    orden: tipo.tipo_orden,
                    pasos: tipo.pasos || []
                }));
                
                const typeNames = formattedTypes.map(t => t.nombre);
                setClientTypes(typeNames);
                
                if (crmState.setDynamicClientTypes) {
                    crmState.setDynamicClientTypes(typeNames);
                }
            }
        } catch (err) {
            console.error('Error crítico al cargar tipos:', err.message);
            setClientTypes([]);
        } finally {
            setLoadingClientTypes(false);
        }
    }, [session?.user?.email, crmState]);

    // ✅ EFECTO: Cargar tipos de cliente al montar
    useEffect(() => {
        loadClientTypes();
    }, [loadClientTypes]);

    // ✅ EFECTO: Cargar chats cuando el agente esté configurado
    useEffect(() => {
        if (wasender.agentConfig && !wasender.loading) {
            wasender.refreshChats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wasender.agentConfig, wasender.loading]);

    // ✅ EFECTO: Cargar mensajes cuando cambia el chat activo
    useEffect(() => {
        if (crmState.activeChat?.id && wasender.agentConfig?.api_key) {
            // Usar loadChatMessages con el teléfono (no el ID)
            if (typeof wasender.loadChatMessages === 'function') {
                wasender.loadChatMessages(crmState.activeChat.telefono || crmState.activeChat.id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crmState.activeChat?.id, wasender.agentConfig?.api_key]);

    // ✅ EFECTO: Manejar errores de Wasender
    useEffect(() => {
        if (wasender.error) {
            showToast(wasender.error, 'error');
        }
    }, [wasender.error, showToast]);

    // Mostrar loading mientras se carga la sesión o Wasender
    // if (status === 'loading' || wasender.loading) {
    //     return <ModernLoading />;
    // }

    // Verificar autenticación
    if (!session?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
                    <p className="text-gray-600 mb-6">Debes iniciar sesión para acceder al CRM</p>
                    <button
                        onClick={() => window.location.href = '/api/auth/signin'}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Layout principal */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Siempre visible con navegación integrada */}
                {(!isMobile || crmState.mobileView === 'sidebar') && (
                    <ChatSidebar
                        wasender={wasender}
                        crmState={crmState}
                        showToast={showToast}
                        session={session}
                        isMobile={isMobile}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                )}

                {/* Contenido principal según el tab activo */}
                {activeTab === 'chats' && (!isMobile || crmState.mobileView === 'chat') && (
                    <ChatArea
                        wasender={wasender}
                        crmState={crmState}
                        showToast={showToast}
                        session={session}
                        isMobile={isMobile}
                        showClientTypesConfigModal={showClientTypesConfigModal}
                        setShowClientTypesConfigModal={setShowClientTypesConfigModal}
                    />
                )}

                {activeTab === 'clientes' && (!isMobile || crmState.mobileView === 'chat') && (
                    <ChatArea
                        wasender={wasender}
                        crmState={crmState}
                        showToast={showToast}
                        session={session}
                        isMobile={isMobile}
                        showClientTypesConfigModal={showClientTypesConfigModal}
                        setShowClientTypesConfigModal={setShowClientTypesConfigModal}
                    />
                )}

                {activeTab === 'pipeline' && (
                    <PipelineView
                        chats={wasender.chats || []}
                        clientTypes={clientTypes}
                        getSalesStepsForClient={crmState.getSalesStepsForClient}
                        salesStepIndices={crmState.salesStepIndices || {}}
                        onSelectChat={(chat) => {
                            crmState.setActiveChat(chat);
                            setActiveTab('chats');
                            if (isMobile) {
                                crmState.setMobileView('chat');
                            }
                        }}
                        activeChat={crmState.activeChat}
                        showToast={showToast}
                        onOpenClientTypesConfig={() => setShowClientTypesConfigModal(true)}
                        onClientTypesUpdated={() => {
                            // Recargar tipos cuando se actualicen
                            loadClientTypes();
                        }}
                    />
                )}

                {activeTab === 'calendario' && <CalendarioView showToast={showToast} />}

                {activeTab === 'ranking' && <RankingView />}

                {activeTab === 'recordatorios' && (
                    <RecordatoriosView
                        chats={wasender.chats || []}
                        showToast={showToast}
                    />
                )}

                {activeTab === 'gmail' && <GmailView />}

                {activeTab === 'propiedades' && (
                    <PropiedadesView
                        onSelectPropiedad={(propiedad) => {
                            console.log('Propiedad seleccionada:', propiedad);
                            showToast(`Propiedad seleccionada: ${propiedad.titulo}`, 'success');
                        }}
                    />
                )}
            </div>

            {/* Toast de notificaciones */}
            <Toast
                message={toastState.message}
                type={toastState.type}
                isVisible={toastState.isVisible}
                onClose={hideToast}
            />
        </div>
    );
}
