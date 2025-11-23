"use client"

import { useMemo, useState, useRef, useCallback, useEffect, useReducer } from 'react';
import { ArrowLeft, Paperclip, Loader2, Edit2, ChevronDown, Plus, X, Tag as TagIcon, AlertTriangle, Search, Check, Settings, Sparkles, Palette, ChevronUp, Calendar as CalendarIcon, FileText, User, Phone, Mail, Send } from 'lucide-react';
import { HiDocument } from 'react-icons/hi';
import MessageList from './MessageList';
import EditChatModal from './EditChatModal';
import DocumentModal from '../Modals/DocumentModal';
import ClientTypesConfigModal from '../Modals/ClientTypesConfigModal';
import { useAgentThrottle } from '@/hooks/useAgentThrottle';
import { supabaseClient } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ✅ Componente auxiliar para mostrar el calendario semanal
function WeeklyCalendarModal({ open, onClose, events, onPrevWeek, onNextWeek, weekStart }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    const startOfWeek = new Date(weekStart);
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });
    
    const eventsByDay = days.map(day => {
        const dayStr = day.toISOString().slice(0, 10);
        return events.filter(ev => {
            const evDate = new Date(ev.start.dateTime || ev.start.date);
            return evDate.toISOString().slice(0, 10) === dayStr;
        });
    });
    
    const todayStr = new Date().toISOString().slice(0, 10);
    
    const eventColors = [
        { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-900', dot: 'bg-blue-500', hover: 'hover:bg-blue-100' },
        { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-900', dot: 'bg-purple-500', hover: 'hover:bg-purple-100' },
        { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-900', dot: 'bg-green-500', hover: 'hover:bg-green-100' },
        { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-900', dot: 'bg-orange-500', hover: 'hover:bg-orange-100' },
    ];
    
    const getEventColor = (index) => eventColors[index % eventColors.length];
    
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] lg:max-w-6xl w-full rounded-xl p-0 overflow-hidden shadow-2xl border-0 max-h-[95vh]">
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <CalendarIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Mi Calendario</h2>
                                <p className="text-sm text-gray-500">Vista semanal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={onPrevWeek} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                                <ChevronDown className="w-5 h-5 rotate-90 text-gray-600" />
                            </button>
                            <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">
                                    {days[0].toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} - {days[6].toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <button onClick={onNextWeek} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                                <ChevronDown className="w-5 h-5 -rotate-90 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-auto max-h-[calc(95vh-140px)] bg-gray-50">
                    <div className="min-w-[900px]">
                        <div className="grid grid-cols-7 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                            {days.map((day, i) => {
                                const isToday = day.toISOString().slice(0, 10) === todayStr;
                                return (
                                    <div key={i} className={`px-3 py-3 text-center border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-xs font-medium text-gray-600 uppercase">{day.toLocaleDateString('es-AR', { weekday: 'short' })}</span>
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-900 hover:bg-gray-100'}`}>
                                                <span className="text-lg font-semibold">{day.getDate()}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-7">
                            {eventsByDay.map((evs, i) => {
                                const isToday = days[i].toISOString().slice(0, 10) === todayStr;
                                return (
                                    <div key={i} className={`min-h-[200px] p-2 border-r border-b border-gray-200 last:border-r-0 ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
                                        <div className="space-y-1.5">
                                            {evs.length === 0 ? (
                                                <div className="flex items-center justify-center h-32 text-gray-300"><span className="text-xs">Sin eventos</span></div>
                                            ) : (
                                                evs.map((ev, j) => {
                                                    const color = getEventColor(j);
                                                    const hasTime = ev.start.dateTime;
                                                    return (
                                                        <div key={j} className={`group relative px-2.5 py-2 rounded-md border-l-3 ${color.bg} ${color.border} ${color.hover} cursor-pointer transition-all duration-150 hover:shadow-md hover:scale-[1.02]`} onClick={() => setSelectedEvent(ev)}>
                                                            <div className="flex items-start gap-2">
                                                                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${color.dot} flex-shrink-0`}></div>
                                                                <div className="flex-1 min-w-0">
                                                                    {hasTime && (<div className="text-[10px] font-semibold text-gray-600 mb-0.5">{new Date(ev.start.dateTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>)}
                                                                    <div className={`text-xs font-medium ${color.text} leading-snug line-clamp-2`} title={ev.summary}>{ev.summary}</div>
                                                                    {!hasTime && (<div className="text-[10px] text-gray-500 mt-0.5">Todo el día</div>)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-3 bg-white flex items-center justify-between">
                    <div className="text-xs text-gray-500">{events.length} {events.length === 1 ? 'evento' : 'eventos'} esta semana</div>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium text-sm">Cerrar</button>
                </div>

                {selectedEvent && (
                    <Dialog open={true} onOpenChange={() => setSelectedEvent(null)}>
                        <DialogContent className="max-w-lg w-full rounded-xl p-0 overflow-hidden shadow-2xl border-0">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                                <h2 className="text-lg font-semibold text-white mb-2 leading-tight line-clamp-3">{selectedEvent.summary}</h2>
                            </div>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <CalendarIcon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                            {selectedEvent.start.dateTime ? new Date(selectedEvent.start.dateTime).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : new Date(selectedEvent.start.date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {selectedEvent.start.dateTime ? `${new Date(selectedEvent.start.dateTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${new Date(selectedEvent.end.dateTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}` : 'Todo el día'}
                                        </p>
                                    </div>
                                </div>
                                {selectedEvent.description && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-sm font-medium text-gray-900 mb-2">Descripción</p>
                                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto">{selectedEvent.description}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-gray-200 px-6 py-3 bg-white flex justify-end">
                                <button onClick={() => setSelectedEvent(null)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium text-sm">Cerrar</button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </DialogContent>
        </Dialog>
    );
}

/**
 * Componente del área de chat principal
 */
export default function ChatArea({ 
    wasender, 
    crmState, 
    showToast, 
    session, 
    isMobile,
    showClientTypesConfigModal,
    setShowClientTypesConfigModal
}) {
    const [uploadingCount, setUploadingCount] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const { messages: localMessagesState, setMessages, message: draftMessage, setMessage } = crmState;
    const lastChatIdRef = useRef(null);
    
    // ✅ NUEVO: Estados para etiquetas
    const [allTags, setAllTags] = useState([]);
    const [clientTags, setClientTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(false);
    const [loadingChatData, setLoadingChatData] = useState(false);
    
    // ✅ Estados para modales de gestión de etiquetas
    const [showEditTagModal, setShowEditTagModal] = useState(false);
    const [showDeleteTagModal, setShowDeleteTagModal] = useState(false);
    const [showClientTagsModal, setShowClientTagsModal] = useState(false);
    const [showDuplicateTagModal, setShowDuplicateTagModal] = useState(false);
    
    // ✅ Estados para datos de etiquetas
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("#6366f1");
    const [creatingTag, setCreatingTag] = useState(false);
    const [editingTag, setEditingTag] = useState(null); // {id, nombre, color}
    const [tagToDelete, setTagToDelete] = useState(null); // {id, nombre}
    const [duplicateTagName, setDuplicateTagName] = useState('');
    const [searchTagQuery, setSearchTagQuery] = useState('');
    const [searchTag, setSearchTag] = useState('');

    // ✅ NUEVO: Estados para tipos de cliente
    const [dynamicClientTypes, setDynamicClientTypes] = useState(['Comprador', 'Vendedor', 'Inversor']);
    const [loadingClientTypes, setLoadingClientTypes] = useState(false);
    const [clientTypeSteps, setClientTypeSteps] = useState({});
    
    // ✅ NUEVO: Estados para edición de etapas del proceso
    const [editingSalesSteps, setEditingSalesSteps] = useState(false);
    const [editingStepsType, setEditingStepsType] = useState('Comprador');
    const [tempSalesSteps, setTempSalesSteps] = useState([]);
    const [savingSalesSteps, setSavingSalesSteps] = useState(false);
    
    // ✅ Estados para modales de herramientas
    const [eventForm, setEventForm] = useState({ title: "", description: "", start: "", clientName: "", clientPhone: "" });
    const [creatingEvent, setCreatingEvent] = useState(false);
    
    // ✅ Estados para recordatorios
    const [eventosCliente, setEventosCliente] = useState([]);
    const [mostrarModalEventos, setMostrarModalEventos] = useState(false);
    
    // ✅ Estados para crear recordatorio diario
    const [showDailyReminderModal, setShowDailyReminderModal] = useState(false);
    const [dailyReminderTitle, setDailyReminderTitle] = useState("");
    const [creatingDailyReminder, setCreatingDailyReminder] = useState(false);
    
    // ✅ Estados para calendario semanal
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [calendarWeekStart, setCalendarWeekStart] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    });
    
    // ✅ Estados para documentos
    const [archivosBD, setArchivosBD] = useState([]);
    
    // ✅ showClientTypesConfigModal viene como prop del padre (compartido con PipelineView)
    
    // ✅ NUEVO: Reducer para manejar tipo de cliente y etapas sin re-renders
    const [clientState, dispatchClientState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_CLIENT_TYPE':
                    return { ...state, selectedClientType: action.payload };
                case 'SET_SALES_STEPS':
                    return { ...state, salesSteps: action.payload };
                case 'SET_SALES_STEP':
                    return { ...state, selectedSalesStep: action.payload };
                case 'SET_ALL':
                    return { 
                        selectedClientType: action.payload.type,
                        salesSteps: action.payload.steps,
                        selectedSalesStep: action.payload.step
                    };
                default:
                    return state;
            }
        },
        {
            selectedClientType: 'No especificado',
            salesSteps: [
                "1. Contacto inicial",
                "2. Calificación del prospecto",
                "3. Presentación de la solución",
                "4. Manejo de objeciones",
                "5. Cierre de la venta",
                "6. Seguimiento postventa",
            ],
            selectedSalesStep: "1. Contacto inicial"
        }
    );

    const { selectedClientType, salesSteps, selectedSalesStep } = clientState;
    
    // 🔥 NUEVO: Hook de throttling por agente
    const agentCode = wasender?.agentConfig?.agent_code;
    const { sendWithFunction } = useAgentThrottle(agentCode, {
        minIntervalMs: 20000, // 20 segundos entre mensajes
        maxRetries: 3,
        enableMetrics: true
    });

    // ✅ NUEVO: Cargar etiquetas desde Supabase (renombrado para consistencia)
    const fetchTags = useCallback(async () => {
        if (!session?.user?.email) return;
        
        setLoadingTags(true);
        try {
            const { data, error } = await supabaseClient
                .from('etiquetas')
                .select('*')
                .eq('usuario_email', session.user.email)
                .order('nombre');

            if (error) {
                console.error('Error cargando etiquetas:', error);
            } else {
                setAllTags(data || []);
                console.log('✅ Etiquetas cargadas:', data?.length || 0);
            }
        } catch (error) {
            console.error('Error en fetchTags:', error);
        } finally {
            setLoadingTags(false);
        }
    }, [session?.user?.email]);
    
    // Mantener alias para compatibilidad
    const cargarEtiquetas = fetchTags;



    // ✅ NUEVO: Cargar tipos de cliente desde Supabase usando RPC
    const cargarTiposCliente = useCallback(async () => {
        if (!session?.user?.email) return;
        
        setLoadingClientTypes(true);
        try {
            const { data, error } = await supabaseClient
                .rpc('obtener_tipos_clientes_con_procesos', { 
                    p_agente_email: session.user.email 
                });

            if (error) {
                console.error('Error cargando tipos de cliente:', error);
            } else if (data && data.length > 0) {
                const tipos = data.map(t => t.tipo_nombre);
                setDynamicClientTypes(tipos);
                
                // Guardar pasos por tipo
                const stepsMap = {};
                data.forEach(tipo => {
                    const pasos = (tipo.pasos || []).map(p => p.nombre);
                    stepsMap[tipo.tipo_nombre] = pasos.length > 0 ? pasos : salesSteps;
                });
                setClientTypeSteps(stepsMap);
            }
        } catch (error) {
            console.error('Error en cargarTiposCliente:', error);
        } finally {
            setLoadingClientTypes(false);
        }
    }, [session?.user?.email, salesSteps]);

    // ✅ NUEVO: Función para recargar datos del chat activo (para usar después de editar tipos)
    const reloadActiveChatData = useCallback(async () => {
        const currentChatId = crmState.activeChat?.id;
        
        if (!currentChatId || !wasender.agentConfig?.agent_code) {
            return;
        }
        
        try {
            const { data, error } = await supabaseClient
                .from('chats')
                .select('tipo_cliente, estado_embudo, etiquetas')
                .eq('id', currentChatId)
                .eq('propietario', wasender.agentConfig.agent_code)
                .single();

            if (error) {
                console.error('Error recargando datos del chat:', error);
            } else {
                const currentType = data?.tipo_cliente || 'No especificado';
                const estadoEmbudo = data?.estado_embudo;
                
                console.log('🔄 Recargando datos del chat:', {
                    tipo_cliente: currentType,
                    estado_embudo: estadoEmbudo
                });
                
                // Calcular pasos
                let stepsForType;
                if (!currentType || currentType === "No especificado") {
                    stepsForType = salesSteps;
                } else {
                    const normalizedType = currentType.trim();
                    if (clientTypeSteps[normalizedType] && clientTypeSteps[normalizedType].length > 0) {
                        stepsForType = clientTypeSteps[normalizedType];
                    } else {
                        stepsForType = salesSteps;
                    }
                }
                
                // Determinar el paso seleccionado
                let selectedStep;
                if (estadoEmbudo && stepsForType.includes(estadoEmbudo)) {
                    selectedStep = estadoEmbudo;
                } else if (estadoEmbudo) {
                    console.warn('⚠️ Estado embudo no encontrado en pasos:', estadoEmbudo);
                    selectedStep = stepsForType[0];
                } else {
                    selectedStep = stepsForType[0];
                }
                
                console.log('✅ Paso seleccionado después de recargar:', selectedStep);
                
                dispatchClientState({ 
                    type: 'SET_ALL',
                    payload: {
                        type: currentType,
                        steps: stepsForType,
                        step: selectedStep
                    }
                });
                setClientTags(data?.etiquetas || []);
            }
        } catch (error) {
            console.error('Error en reloadActiveChatData:', error);
        }
    }, [crmState.activeChat?.id, wasender.agentConfig?.agent_code, salesSteps, clientTypeSteps]);

    // ✅ EFECTO: Autocompletar datos del cliente al abrir modal de eventos
    useEffect(() => {
        if (crmState.showEventModal && crmState.activeChat) {
            setEventForm(prev => ({
                ...prev,
                clientName: prev.clientName || crmState.activeChat?.nombre || crmState.activeChat?.name || crmState.activeChat?.displayName || '',
                clientPhone: prev.clientPhone || crmState.activeChat?.telefono || crmState.activeChat?.id?.replace(/@c\.us$/, '') || ''
            }));
        }
    }, [crmState.showEventModal, crmState.activeChat]);

    // ✅ FUNCIÓN: Listar recordatorios diarios del cliente
    const listarRecordatoriosDiariosDelCliente = useCallback(async () => {
        if (!session?.accessToken || !crmState.activeChat) {
            showToast('No hay sesión activa', 'warning');
            return;
        }

        let telefono = crmState.activeChat.telefono || crmState.activeChat.id?.replace(/@c\.us$/, '') || '';
        telefono = telefono.replace(/\D/g, '');

        if (!telefono || telefono.length < 10) {
            showToast('No se pudo obtener el teléfono del cliente', 'error');
            return;
        }

        const now = new Date().toISOString();

        try {
            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&singleEvents=false&maxResults=250`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showToast('Error al obtener eventos de Google Calendar', 'error');
                return;
            }

            const recordatorios = (data.items || []).filter((evento) => {
                const isDailyRecurrence = evento.recurrence?.some(r => r.includes("RRULE:FREQ=DAILY"));
                if (!isDailyRecurrence) return false;

                const phonesInDescription = evento.description?.match(/\d{10,15}/g) || [];
                const hasPhone = phonesInDescription.some(phone => phone === telefono);
                if (!hasPhone) return false;

                const isFromCurrentUser = evento.description?.includes(`Creado por: ${session.user.email}`) || evento.creator?.email === session.user.email;
                
                return isDailyRecurrence && hasPhone && isFromCurrentUser;
            });

            setEventosCliente(recordatorios);
            setMostrarModalEventos(true);

            if (recordatorios.length === 0) {
                showToast('No se encontraron recordatorios para este cliente', 'info');
            }
        } catch (error) {
            showToast('Error al listar recordatorios: ' + error.message, 'error');
        }
    }, [session, crmState.activeChat, showToast]);

    // ✅ FUNCIÓN: Eliminar recordatorio
    const eliminarEventoRecurrente = useCallback(async (eventId) => {
        if (!session?.accessToken) {
            showToast('No hay sesión activa', 'warning');
            return;
        }

        try {
            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                }
            );

            if (response.ok) {
                showToast('Recordatorio completado y eliminado', 'success');
                setEventosCliente(prev => prev.filter(e => e.id !== eventId));
            } else {
                const data = await response.json();
                showToast('Error al eliminar recordatorio: ' + (data.error?.message || 'Desconocido'), 'error');
            }
        } catch (error) {
            showToast('Error al eliminar recordatorio: ' + error.message, 'error');
        }
    }, [session, showToast]);

    // ✅ FUNCIÓN: Crear recordatorio diario
    const crearRecordatorioDiario = useCallback(async (titulo) => {
        if (!session?.accessToken || !crmState.activeChat || !wasender.agentConfig) {
            showToast('No hay sesión activa o configuración del agente', 'warning');
            return;
        }

        setCreatingDailyReminder(true);

        try {
            const now = new Date();
            const start = new Date(now);
            start.setHours(8, 0, 0, 0);
            const end = new Date(start);
            end.setMinutes(start.getMinutes() + 15);

            const telefono = crmState.activeChat.telefono || crmState.activeChat.id?.replace(/@c\.us$/, '') || '';
            const nombreCliente = crmState.activeChat.nombre || crmState.activeChat.name || 'Cliente';

            const event = {
                summary: `📋 ${titulo}`,
                description: `Recordatorio diario para seguimiento con ${nombreCliente}\n📱 Teléfono: +${telefono}\n👤 Cliente: ${nombreCliente}\n📧 Creado por: ${session.user.email}\n📅 Fecha: ${new Date().toLocaleDateString('es-AR')}`,
                start: { dateTime: start.toISOString(), timeZone: "America/Argentina/Buenos_Aires" },
                end: { dateTime: end.toISOString(), timeZone: "America/Argentina/Buenos_Aires" },
                recurrence: ["RRULE:FREQ=DAILY"],
                reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 0 }, { method: 'popup', minutes: 15 }] }
            };

            const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
                method: "POST",
                headers: { Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json" },
                body: JSON.stringify(event),
            });

            const data = await res.json();

            if (res.ok) {
                showToast(`✅ Recordatorio diario "${titulo}" creado correctamente`, 'success');
                setShowDailyReminderModal(false);
                setDailyReminderTitle("");
            } else {
                showToast('Error al crear recordatorio: ' + (data.error?.message || 'Desconocido'), 'error');
            }
        } catch (error) {
            showToast('Error al crear recordatorio: ' + error.message, 'error');
        } finally {
            setCreatingDailyReminder(false);
        }
    }, [session, crmState.activeChat, wasender.agentConfig, showToast]);

    // ✅ FUNCIÓN: Cargar eventos del calendario para la semana
    const fetchCalendarEvents = useCallback(async (weekStart) => {
        if (!session?.accessToken) return;

        const start = new Date(weekStart);
        const end = new Date(weekStart);
        end.setDate(end.getDate() + 7);

        try {
            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&singleEvents=true&orderBy=startTime`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setCalendarEvents(data.items || []);
            } else {
                showToast('Error al cargar eventos del calendario', 'error');
            }
        } catch (error) {
            showToast('Error al cargar eventos: ' + error.message, 'error');
        }
    }, [session, showToast]);

    // ✅ EFECTO: Cargar eventos cuando se abre el modal de calendario
    useEffect(() => {
        if (crmState.showCalendarModal) {
            fetchCalendarEvents(calendarWeekStart);
        }
    }, [crmState.showCalendarModal, calendarWeekStart, fetchCalendarEvents]);

    // ✅ FUNCIÓN: Cargar notas del cliente
    const fetchClientNotes = useCallback(async () => {
        if (!crmState.activeChat?.id) {
            console.log("❌ No hay chat activo para cargar notas");
            crmState.setClientNotes([]);
            return;
        }
        
        crmState.setLoadingNotes(true);
        console.log("🔍 Cargando notas para cliente:", crmState.activeChat.nombre || crmState.activeChat.id);
        
        const normalizeTelefono = (v) => {
            if (!v) return '';
            return String(v).trim().replace(/[@].*$/, '').replace(/[^0-9]/g, '');
        };

        try {
            const telefono = crmState.activeChat?.telefono
                ? normalizeTelefono(crmState.activeChat.telefono)
                : normalizeTelefono(crmState.activeChat.id);
            if (!telefono) {
                console.warn("⚠️ No se pudo derivar un teléfono normalizado para el chat activo");
                crmState.setClientNotes([]);
                return;
            }
            
            let data = null;
            let error = null;
            let fallback = false;

            const resp1 = await supabaseClient
                .from('chats')
                .select('id, notas')
                .eq('telefono', telefono)
                .eq('propietario', wasender.agentConfig?.agent_code)
                .maybeSingle();

            data = resp1.data;
            error = resp1.error;

            if ((!data && (!error || (error && error.code === 'PGRST116')))) {
                console.warn("⚠️ No se encontró fila con telefono + propietario. Intentando fallback solo por telefono.");
                fallback = true;
                const resp2 = await supabaseClient
                    .from('chats')
                    .select('id, notas, propietario')
                    .eq('telefono', telefono)
                    .order('updated_at', { ascending: false })
                    .limit(1);
                if (resp2.error) {
                    console.error("❌ Error en fallback solo telefono:", resp2.error);
                    crmState.setClientNotes([]);
                    return;
                }
                data = resp2.data && resp2.data.length > 0 ? resp2.data[0] : null;
                if (!data) {
                    console.warn("⚠️ No existe ningún registro para este teléfono. No hay notas que mostrar.");
                    crmState.setClientNotes([]);
                    return;
                }
            } else if (error && error.code !== 'PGRST116') {
                console.error("❌ Error cargando notas (primer intento):", error);
                crmState.setClientNotes([]);
                return;
            }

            let notas = [];
            if (data?.notas) {
                if (Array.isArray(data.notas)) {
                    notas = data.notas;
                } else if (typeof data.notas === 'string') {
                    try {
                        const parsed = JSON.parse(data.notas);
                        notas = Array.isArray(parsed) ? parsed : [];
                    } catch (e) {
                        console.warn("⚠️ notas es string no parseable, se usa vacío");
                        notas = [];
                    }
                } else {
                    console.warn("⚠️ Tipo inesperado en notas (", typeof data.notas, ") se usa vacío");
                }
            }
            if (fallback) {
                console.log("ℹ️ Fallback aplicado. Propietario real en BD: ", data.propietario);
            }

            console.log(`✅ Notas cargadas: ${notas.length} para ${crmState.activeChat.nombre}`);
            crmState.setClientNotes([...notas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
        } catch (err) {
            console.error("❌ Error inesperado cargando notas:", err);
            crmState.setClientNotes([]);
        } finally {
            crmState.setLoadingNotes(false);
        }
    }, [crmState.activeChat?.id, crmState.activeChat?.telefono, crmState.activeChat?.nombre, wasender.agentConfig?.agent_code, crmState.setClientNotes, crmState.setLoadingNotes]);

    // ✅ FUNCIÓN: Guardar nueva nota
    const saveClientNote = useCallback(async () => {
        if (!crmState.activeChat?.id || !crmState.newNote.trim()) {
            console.log("❌ No se puede guardar nota: faltan datos");
            return;
        }

        console.log("💾 Guardando nueva nota para cliente:", crmState.activeChat.nombre);
        
        try {
            const normalizeTelefono = (v) => {
                if (!v) return '';
                return String(v).trim().replace(/[@].*$/, '').replace(/[^0-9]/g, '');
            };
            const telefono = crmState.activeChat?.telefono
                ? normalizeTelefono(crmState.activeChat.telefono)
                : normalizeTelefono(crmState.activeChat.id);
            if (!telefono) {
                console.error("❌ No se pudo normalizar el teléfono del chat activo. Abortando guardado de nota.");
                return;
            }
            
            let { data, error } = await supabaseClient
                .from('chats')
                .select('notas')
                .eq('telefono', telefono)
                .eq('propietario', wasender.agentConfig?.agent_code)
                .single();

            let notasActuales = [];

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log("ℹ️ El chat no tiene campo notas aún, se inicializará como array vacío");
                    notasActuales = [];
                } else {
                    console.error("❌ Error consultando notas del chat:", error);
                    throw error;
                }
            } else {
                if (data?.notas) {
                    if (Array.isArray(data.notas)) {
                        notasActuales = data.notas;
                    } else if (typeof data.notas === 'string') {
                        try {
                            const parsed = JSON.parse(data.notas);
                            notasActuales = Array.isArray(parsed) ? parsed : [];
                        } catch (e) {
                            console.warn("⚠️ Campo notas (string) no es JSON válido, se inicializa vacío");
                            notasActuales = [];
                        }
                    } else {
                        console.warn("⚠️ Campo notas con tipo inesperado, se inicializa vacío", typeof data.notas);
                        notasActuales = [];
                    }
                } else {
                    notasActuales = [];
                }
            }

            const nuevaNota = {
                id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
                nota: crmState.newNote.trim(),
                fecha: new Date().toISOString(),
                autor: session?.user?.email || wasender.agentConfig?.agent_code
            };
            
            const nuevasNotas = [nuevaNota, ...notasActuales];

            const { data: upd1Data, error: upd1Error } = await supabaseClient
                .from('chats')
                .update({ notas: nuevasNotas, updated_at: new Date().toISOString() })
                .eq('telefono', telefono)
                .eq('propietario', wasender.agentConfig?.agent_code)
                .select('id');

            if (upd1Error) {
                console.error('❌ Error UPDATE (telefono+propietario):', upd1Error);
            }

            if (!upd1Error && upd1Data && upd1Data.length > 0) {
                console.log(`✅ Notas guardadas con filtro telefono+propietario. Filas: ${upd1Data.length}`);
            } else {
                console.warn('⚠️ No se pudo actualizar por telefono+propietario, buscando fila por telefono para usar su id real.');
                const { data: rowByPhone, error: rowPhoneError } = await supabaseClient
                    .from('chats')
                    .select('id, propietario, notas, telefono, sender_lid')
                    .eq('telefono', telefono)
                    .order('updated_at', { ascending: false })
                    .limit(1);

                if (rowPhoneError) {
                    console.error('❌ Error buscando fila por telefono:', rowPhoneError);
                    throw rowPhoneError;
                }

                let targetRow = rowByPhone && rowByPhone.length > 0 ? rowByPhone[0] : null;

                if (!targetRow) {
                    console.error('❌ No existe fila asociada. No se guardará la nota.');
                    throw new Error('No existe fila asociada para guardar la nota');
                }

                const { error: updByIdError } = await supabaseClient
                    .from('chats')
                    .update({ notas: nuevasNotas, updated_at: new Date().toISOString() })
                    .eq('id', targetRow.id);

                if (updByIdError) {
                    console.error('❌ Error actualizando por id:', updByIdError);
                    throw updByIdError;
                }

                console.log('✅ Notas guardadas usando fallback por id');
            }

            console.log("✅ Nota guardada exitosamente");
            crmState.setNewNote("");
            await fetchClientNotes();
            showToast("Nota guardada exitosamente", 'success');
            
        } catch (err) {
            console.error("❌ Error inesperado guardando nota:", err);
            showToast("Error al guardar la nota. Por favor, intenta de nuevo.", 'error');
        }
    }, [crmState.activeChat?.id, crmState.activeChat?.telefono, crmState.activeChat?.nombre, crmState.newNote, wasender.agentConfig?.agent_code, session?.user?.email, crmState.setNewNote, fetchClientNotes, showToast]);

    // ✅ FUNCIÓN: Editar nota existente
    const editClientNote = useCallback(async (notaId, nuevoTexto) => {
        if (!crmState.activeChat?.id || !nuevoTexto.trim()) {
            console.log("❌ No se puede editar nota: faltan datos");
            return;
        }

        console.log("📝 Editando nota:", notaId);
        
        try {
            const normalizeTelefono = (v) => {
                if (!v) return '';
                return String(v).trim().replace(/[@].*$/, '').replace(/[^0-9]/g, '');
            };
            const telefono = crmState.activeChat?.telefono ? normalizeTelefono(crmState.activeChat.telefono) : normalizeTelefono(crmState.activeChat.id);
            if (!telefono) {
                console.error('❌ No se pudo normalizar teléfono para editar nota');
                return;
            }

            let targetRow = null;
            let resp1 = await supabaseClient
                .from('chats')
                .select('id, notas, propietario')
                .eq('telefono', telefono)
                .eq('propietario', wasender.agentConfig?.agent_code)
                .maybeSingle();

            if (resp1.data) {
                targetRow = resp1.data;
            } else {
                console.warn('⚠️ No se halló fila por telefono+propietario para editar. Fallback telefono.');
                const resp2 = await supabaseClient
                    .from('chats')
                    .select('id, notas, propietario, telefono, sender_lid')
                    .eq('telefono', telefono)
                    .order('updated_at', { ascending: false })
                    .limit(1);
                if (resp2.error) {
                    console.error('❌ Error fallback telefono (editar):', resp2.error);
                    throw resp2.error;
                }
                if (resp2.data && resp2.data.length > 0) {
                    targetRow = resp2.data[0];
                }
            }

            if (!targetRow) {
                console.error('❌ No se encontró fila para editar la nota');
                throw new Error('Fila no encontrada para editar');
            }

            let notasActuales = [];
            if (Array.isArray(targetRow.notas)) {
                notasActuales = targetRow.notas;
            } else if (typeof targetRow.notas === 'string') {
                try { const parsed = JSON.parse(targetRow.notas); if (Array.isArray(parsed)) notasActuales = parsed; } catch {}
            }

            let encontrada = false;
            const nuevasNotas = notasActuales.map(n => {
                if (n.id === notaId) {
                    encontrada = true;
                    return { ...n, nota: nuevoTexto.trim(), fechaEditado: new Date().toISOString(), autorEditor: session?.user?.email || wasender.agentConfig?.agent_code };
                }
                return n;
            });

            if (!encontrada) {
                console.error('❌ No se encontró la nota a editar dentro del array');
                throw new Error('Nota no encontrada');
            }

            const { error: updError } = await supabaseClient
                .from('chats')
                .update({ notas: nuevasNotas, updated_at: new Date().toISOString() })
                .eq('id', targetRow.id);
            if (updError) {
                console.error('❌ Error actualizando nota (por id):', updError);
                throw updError;
            }

            console.log('✅ Nota editada exitosamente (id fila:', targetRow.id, ')');
            await fetchClientNotes();
            showToast("Nota editada exitosamente", 'success');
            
        } catch (err) {
            console.error("❌ Error inesperado editando nota:", err);
            showToast("Error al editar la nota. Por favor, intenta de nuevo.", 'error');
        }
    }, [crmState.activeChat?.id, crmState.activeChat?.telefono, wasender.agentConfig?.agent_code, session?.user?.email, fetchClientNotes, showToast]);

    // ✅ FUNCIÓN: Eliminar nota
    const deleteClientNote = useCallback(async (notaId) => {
        if (!crmState.activeChat?.id || !notaId) {
            console.log("❌ No se puede borrar nota: faltan datos");
            return;
        }

        console.log("🗑️ Borrando nota:", notaId);
        
        try {
            const normalizeTelefono = (v) => {
                if (!v) return '';
                return String(v).trim().replace(/[@].*$/, '').replace(/[^0-9]/g, '');
            };
            const telefono = crmState.activeChat?.telefono ? normalizeTelefono(crmState.activeChat.telefono) : normalizeTelefono(crmState.activeChat.id);
            if (!telefono) {
                console.error('❌ No se pudo normalizar teléfono para borrar nota');
                return;
            }

            let targetRow = null;
            let resp1 = await supabaseClient
                .from('chats')
                .select('id, notas')
                .eq('telefono', telefono)
                .eq('propietario', wasender.agentConfig?.agent_code)
                .maybeSingle();
            if (resp1.data) {
                targetRow = resp1.data;
            } else {
                const resp2 = await supabaseClient
                    .from('chats')
                    .select('id, notas, telefono, sender_lid')
                    .eq('telefono', telefono)
                    .order('updated_at', { ascending: false })
                    .limit(1);
                if (resp2.error) {
                    console.error('❌ Error fallback telefono (borrar):', resp2.error);
                    throw resp2.error;
                }
                if (resp2.data && resp2.data.length > 0) {
                    targetRow = resp2.data[0];
                }
            }

            if (!targetRow) {
                console.error('❌ No se encontró fila para borrar la nota');
                throw new Error('Fila no encontrada para borrar');
            }

            let notasActuales = [];
            if (Array.isArray(targetRow.notas)) {
                notasActuales = targetRow.notas;
            } else if (typeof targetRow.notas === 'string') {
                try { const parsed = JSON.parse(targetRow.notas); if (Array.isArray(parsed)) notasActuales = parsed; } catch {}
            }

            const existe = notasActuales.some(n => n.id === notaId);
            if (!existe) {
                console.warn('⚠️ Nota a borrar no encontrada en array');
                throw new Error('Nota no encontrada');
            }

            const nuevasNotas = notasActuales.filter(n => n.id !== notaId);
            console.log(`ℹ️ Notas antes: ${notasActuales.length}, después: ${nuevasNotas.length}`);

            const { error: updDelError } = await supabaseClient
                .from('chats')
                .update({ notas: nuevasNotas, updated_at: new Date().toISOString() })
                .eq('id', targetRow.id);
            if (updDelError) {
                console.error('❌ Error actualizando notas (borrar) por id:', updDelError);
                throw updDelError;
            }

            console.log('✅ Nota borrada exitosamente (id fila:', targetRow.id, ')');
            await fetchClientNotes();
            showToast("Nota eliminada exitosamente", 'success');
            
        } catch (err) {
            console.error("❌ Error inesperado borrando nota:", err);
            showToast("Error al borrar la nota. Por favor, intenta de nuevo.", 'error');
        }
    }, [crmState.activeChat?.id, crmState.activeChat?.telefono, wasender.agentConfig?.agent_code, fetchClientNotes, showToast]);

    // ✅ EFECTO: Auto-cargar notas cuando se abre el modal de notas
    useEffect(() => {
        if (crmState.showNotesModal && crmState.activeChat?.id) {
            fetchClientNotes();
        }
    }, [crmState.showNotesModal, crmState.activeChat?.id, fetchClientNotes]);

    // ✅ EFECTO: Limpiar estado de edición al cambiar notas o cliente
    useEffect(() => {
        crmState.setEditingNoteId(null);
        crmState.setEditingNoteText("");
    }, [crmState.clientNotes, crmState.activeChat?.id, crmState.setEditingNoteId, crmState.setEditingNoteText]);

    // ✅ FUNCIÓN: Obtener mensajes del chat actual
    const getCurrentChatMessages = useCallback(() => {
        if (!crmState.activeChat?.id) {
            console.log('🔍 getCurrentChatMessages: No hay chat activo');
            return [];
        }
        
        const chatId = crmState.activeChat.id;
        const tel = crmState.activeChat.telefono;
        
        // Priorizar búsqueda por chat_id
        let messages = wasender.messages[chatId] || [];
        
        // Si no hay mensajes por chat_id, intentar por teléfono
        if (messages.length === 0 && tel) {
            messages = wasender.messages[tel] || [];
        }
        
        console.log('🔍 getCurrentChatMessages:', {
            chatId,
            telefono: tel,
            messagesByChatId: wasender.messages[chatId]?.length || 0,
            messagesByTelefono: tel ? (wasender.messages[tel]?.length || 0) : 0,
            finalMessagesLength: messages.length
        });
        
        return messages;
    }, [crmState.activeChat?.id, crmState.activeChat?.telefono, wasender.messages]);

    // ✅ FUNCIÓN: Extraer URLs de Supabase Storage de los mensajes
    const extractSupabaseStorageUrls = useCallback((messages) => {
        console.log('🔍 EXTRACT_STORAGE: Iniciando extracción con', messages.length, 'mensajes');
        
        const storageUrls = [];
        const supabaseStorageRegex = /https?:\/\/[A-Za-z0-9_-]+\.supabase\.co\/storage\/v1\/object\/public\/[^\s"')\]]+/g;
        
        messages.forEach((msg, index) => {
            const candidatos = new Set();
            
            // Verificar todos los campos donde puede estar la URL
            if (msg.content && typeof msg.content === 'string' && msg.content.includes('.supabase.co/storage')) {
                candidatos.add(msg.content);
            }
            if (msg.media_url && typeof msg.media_url === 'string' && msg.media_url.includes('.supabase.co/storage')) {
                candidatos.add(msg.media_url);
            }
            if (msg.url && typeof msg.url === 'string' && msg.url.includes('.supabase.co/storage')) {
                candidatos.add(msg.url);
            }
            if (msg.body && typeof msg.body === 'string' && msg.body.includes('.supabase.co/storage')) {
                candidatos.add(msg.body);
            }
            if (msg.text && typeof msg.text === 'string' && msg.text.includes('.supabase.co/storage')) {
                candidatos.add(msg.text);
            }
            
            if (msg.metadata && typeof msg.metadata === 'object') {
                if (msg.metadata.storage_url && msg.metadata.storage_url.includes('.supabase.co/storage')) {
                    candidatos.add(msg.metadata.storage_url);
                }
                Object.entries(msg.metadata).forEach(([key, valor]) => {
                    if (typeof valor === 'string' && valor.includes('.supabase.co/storage')) {
                        candidatos.add(valor);
                    }
                });
            }
            
            if (candidatos.size === 0) return;
            
            // Extraer URLs válidas
            Array.from(candidatos).forEach(candidato => {
                const matches = candidato.match(supabaseStorageRegex);
                if (matches) {
                    matches.forEach(url => {
                        let nombre = 'archivo';
                        
                        try {
                            if (msg.metadata?.file_name) {
                                nombre = msg.metadata.file_name;
                            } else {
                                const urlParts = url.split('/');
                                const fileName = urlParts[urlParts.length - 1];
                                const cleanFileName = fileName.split('?')[0];
                                
                                if (cleanFileName && cleanFileName.length > 0) {
                                    nombre = decodeURIComponent(cleanFileName);
                                } else {
                                    let tipoArchivo = msg.type;
                                    if (!tipoArchivo || tipoArchivo === 'text') {
                                        if (url.includes('/wasender-media/images/')) tipoArchivo = 'image';
                                        else if (url.includes('/wasender-media/videos/')) tipoArchivo = 'video';
                                        else if (url.includes('/wasender-media/audios/')) tipoArchivo = 'audio';
                                        else if (url.includes('/wasender-media/documents/')) tipoArchivo = 'document';
                                        else tipoArchivo = 'document';
                                    }
                                    
                                    const extension = tipoArchivo === 'image' ? '.jpg' : 
                                                     tipoArchivo === 'document' ? '.pdf' : 
                                                     tipoArchivo === 'video' ? '.mp4' : 
                                                     tipoArchivo === 'audio' ? '.mp3' : '.file';
                                    nombre = `${tipoArchivo}_${msg.id}${extension}`;
                                }
                            }
                        } catch (e) {
                            nombre = `archivo_${msg.id || Date.now()}`;
                        }
                        
                        let tipoFinal = msg.type;
                        if (!tipoFinal || tipoFinal === 'text') {
                            if (url.includes('/wasender-media/images/')) tipoFinal = 'image';
                            else if (url.includes('/wasender-media/videos/')) tipoFinal = 'video';
                            else if (url.includes('/wasender-media/audios/')) tipoFinal = 'audio';
                            else if (url.includes('/wasender-media/documents/')) tipoFinal = 'document';
                            else if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) tipoFinal = 'image';
                            else if (url.match(/\.(mp4|avi|mov|wmv|webm|mkv)$/i)) tipoFinal = 'video';
                            else if (url.match(/\.(mp3|wav|ogg|m4a|aac|opus)$/i)) tipoFinal = 'audio';
                            else tipoFinal = 'document';
                        }
                        
                        const storageFile = {
                            url: url,
                            nombre: nombre,
                            fecha: msg.message_timestamp || msg.timestamp || new Date().toISOString(),
                            tipo: tipoFinal,
                            messageId: msg.id,
                            metadata: msg.metadata
                        };
                        
                        storageUrls.push(storageFile);
                    });
                }
            });
        });
        
        // Eliminar duplicados por URL y ordenar por fecha
        const mapa = new Map();
        storageUrls.forEach(item => {
            if (!mapa.has(item.url)) {
                mapa.set(item.url, item);
            }
        });
        
        const resultado = Array.from(mapa.values())
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            
        console.log('🔍 EXTRACT_STORAGE: ✅ Extracción completada:', {
            mensajesAnalizados: messages.length,
            candidatosEncontrados: storageUrls.length,
            archivosFinal: resultado.length
        });
        
        return resultado;
    }, []);

    // ✅ FUNCIÓN: Cargar documentos del chat
    const fetchArchivos = useCallback(async () => {
        if (crmState.showDocuments && crmState.activeChat?.id) {
            console.log('📂 FETCH_ARCHIVOS: INICIANDO para chat:', {
                chatId: crmState.activeChat.id,
                chatNombre: crmState.activeChat.nombre || crmState.activeChat.name,
                telefono: crmState.activeChat.telefono
            });
            
            const allMessages = getCurrentChatMessages();
            console.log('📂 FETCH_ARCHIVOS: Mensajes obtenidos:', allMessages.length);
            
            // Filtrar solo mensajes multimedia
            const multimediaMessages = allMessages.filter(msg => 
                msg.type && msg.type !== 'text' && ['image', 'document', 'video', 'audio'].includes(msg.type)
            );
            
            console.log('📂 FETCH_ARCHIVOS: Mensajes multimedia filtrados:', multimediaMessages.length);
            
            // Extraer URLs de Supabase Storage
            const storageFiles = extractSupabaseStorageUrls(multimediaMessages);
            console.log('📂 FETCH_ARCHIVOS: URLs de Supabase Storage extraídas:', storageFiles.length);
            
            if (storageFiles.length > 0) {
                console.log('📂 FETCH_ARCHIVOS: 📋 Archivos encontrados:');
                storageFiles.forEach((archivo, index) => {
                    console.log(`📂   ${index + 1}. 📎 ${archivo.nombre} (${archivo.tipo})`);
                });
                
                // Convertir formato para el modal
                const archivosParaModal = storageFiles.map(archivo => ({
                    url: archivo.url,
                    nombre: archivo.nombre,
                    fecha: archivo.fecha,
                    origen: archivo.tipo,
                    messageId: archivo.messageId,
                    tipo: archivo.tipo,
                    metadata: archivo.metadata
                }));
                
                setArchivosBD(archivosParaModal);
                console.log('📂 FETCH_ARCHIVOS: ✅ Archivos cargados en el modal');
            } else {
                console.log('📂 FETCH_ARCHIVOS: 📭 No se encontraron URLs de Supabase Storage');
                setArchivosBD([]);
            }
        } else {
            console.log('📂 FETCH_ARCHIVOS: Modal cerrado o sin chat activo');
        }
    }, [crmState.showDocuments, crmState.activeChat?.id, crmState.activeChat?.nombre, crmState.activeChat?.name, crmState.activeChat?.telefono, getCurrentChatMessages, extractSupabaseStorageUrls]);

    // ✅ EFECTO: Auto-cargar documentos cuando se abre el modal
    useEffect(() => {
        fetchArchivos();
    }, [crmState.showDocuments, crmState.activeChat?.id, fetchArchivos]);

    // ✅ NUEVO: Callback combinado para ejecutar después de cambios en tipos de cliente
    const handleConfigSaved = useCallback(async () => {
        await cargarTiposCliente(); // Recargar lista de tipos
        await reloadActiveChatData(); // Recargar datos del chat activo
    }, [cargarTiposCliente, reloadActiveChatData]);

    // ✅ NUEVO: Obtener pasos de venta según tipo de cliente (igual que RealEstateChatApp)
    const getSalesStepsForClient = useCallback((clientType) => {
        if (!clientType || clientType === "No especificado") {
            return salesSteps;
        }

        const normalizedType = clientType.trim();
        
        // Buscar pasos desde clientTypeSteps (BD)
        if (clientTypeSteps[normalizedType] && clientTypeSteps[normalizedType].length > 0) {
            return clientTypeSteps[normalizedType];
        }

        // Fallback a pasos por defecto
        return salesSteps;
    }, [clientTypeSteps, salesSteps]);

    // ✅ NUEVO: Obtener tipo de cliente actual
    const getCurrentClientType = useCallback(() => {
        return selectedClientType || "No especificado";
    }, [selectedClientType]);

    // ✅ NUEVO: Guardar etapas personalizadas por tipo de cliente
    const saveUserSalesSteps = async () => {
        if (!session?.user?.email) return;
        setSavingSalesSteps(true);

        try {
            console.log(`💾 Guardando pasos para tipo "${editingStepsType}":`, tempSalesSteps);

            // Obtener el ID del tipo de cliente
            const { data: tipoCliente, error: errorTipo } = await supabaseClient
                .from('tipos_clientes_personalizados')
                .select('id')
                .eq('agente_email', session.user.email)
                .eq('nombre_tipo', editingStepsType)
                .maybeSingle();

            if (errorTipo) {
                console.error('❌ Error buscando tipo de cliente:', errorTipo);
                showToast(`Error al buscar el tipo de cliente: ${errorTipo.message}`, 'error');
                return;
            }

            if (!tipoCliente) {
                console.error('❌ No se encontró el tipo de cliente:', editingStepsType);
                showToast(`Error: El tipo de cliente "${editingStepsType}" no existe en la base de datos.`, 'error');
                return;
            }

            console.log(`✅ ID del tipo de cliente encontrado:`, tipoCliente.id);

            // Eliminar pasos anteriores de este tipo
            const { error: errorDelete } = await supabaseClient
                .from('procesos_venta_personalizados')
                .delete()
                .eq('tipo_cliente_id', tipoCliente.id);

            if (errorDelete) {
                console.error('❌ Error eliminando pasos anteriores:', errorDelete);
            }

            // Insertar los nuevos pasos
            if (tempSalesSteps.length > 0) {
                const pasosToInsert = tempSalesSteps.map((paso, index) => ({
                    tipo_cliente_id: tipoCliente.id,
                    nombre_paso: paso,
                    orden: index,
                    activo: true
                }));

                const { error: errorInsert } = await supabaseClient
                    .from('procesos_venta_personalizados')
                    .insert(pasosToInsert);

                if (errorInsert) {
                    console.error('❌ Error insertando nuevos pasos:', errorInsert);
                    showToast('Error al guardar los pasos', 'error');
                    return;
                }

                console.log(`✅ ${tempSalesSteps.length} pasos guardados exitosamente`);
            }

            // Actualizar clientTypeSteps
            setClientTypeSteps(prev => ({
                ...prev,
                [editingStepsType]: [...tempSalesSteps]
            }));

            console.log('✅ Estados locales actualizados');

            // Recargar tipos y pasos desde BD
            await cargarTiposCliente();

            setEditingSalesSteps(false);
            setEditingStepsType(dynamicClientTypes[0] || 'Comprador');
            
            showToast(`Pasos guardados exitosamente para ${editingStepsType}`, 'success');
        } catch (error) {
            console.error('❌ Error in saveUserSalesSteps:', error);
            showToast('Error al guardar: ' + error.message, 'error');
        } finally {
            setSavingSalesSteps(false);
        }
    };



    // ✅ NUEVO: Manejar selección de tipo de cliente
    const handleSelectClientType = async (type) => {
        if (!crmState.activeChat?.id || !wasender.agentConfig?.agent_code) return;
        
        // Guardar estados anteriores por si hay error
        const previousState = { ...clientState };
        
        // ✅ Obtener las nuevas etapas para este tipo de cliente desde BD
        const newSteps = getSalesStepsForClient(type);
        const firstStep = newSteps[0];
        
        try {
            const updates = {
                tipo_cliente: type === 'No especificado' ? null : type,
                estado_embudo: firstStep
            };
            
            const { error } = await supabaseClient
                .rpc('update_metadata_silent', {
                    p_chat_id: crmState.activeChat.id,
                    p_propietario: wasender.agentConfig.agent_code,
                    p_updates: updates
                });

            if (error) {
                console.error('❌ Error actualizando tipo de cliente:', error);
                showToast('Error al actualizar tipo de cliente', 'error');
            } else {
                // ✅ Solo actualizar UI después de confirmar éxito en BD
                dispatchClientState({ 
                    type: 'SET_ALL',
                    payload: {
                        type,
                        steps: newSteps,
                        step: firstStep
                    }
                });
            }
        } catch (error) {
            console.error('❌ Error en handleSelectClientType:', error);
            showToast('Error al actualizar tipo de cliente', 'error');
        }
    };

    // ✅ NUEVO: Manejar selección de etapa del proceso
    const handleSelectSalesStep = async (step) => {
        if (!crmState.activeChat?.id || !wasender.agentConfig?.agent_code) return;
        
        try {
            const { error } = await supabaseClient
                .rpc('update_metadata_silent', {
                    p_chat_id: crmState.activeChat.id,
                    p_propietario: wasender.agentConfig.agent_code,
                    p_updates: { estado_embudo: step }
                });

            if (error) {
                console.error('❌ Error actualizando etapa:', error);
                showToast('Error al actualizar etapa', 'error');
            } else {
                // ✅ Solo actualizar UI después de confirmar éxito en BD
                dispatchClientState({ type: 'SET_SALES_STEP', payload: step });
            }
        } catch (error) {
            console.error('❌ Error en handleSelectSalesStep:', error);
            showToast('Error al actualizar etapa', 'error');
        }
    };

    // ✅ NUEVO: Manejar toggle de etiquetas
    const handleToggleTag = async (tagId) => {
        if (!crmState.activeChat?.id || !wasender.agentConfig?.agent_code) {
            console.warn('⚠️ No hay chat activo o configuración de agente');
            return;
        }

        try {
            console.log('🔄 Toggle etiqueta:', tagId, 'para chat:', crmState.activeChat.id);

            let newClientTags;
            if (clientTags.includes(tagId)) {
                // Quitar etiqueta
                newClientTags = clientTags.filter(id => id !== tagId);
                console.log('➖ Quitando etiqueta');
            } else {
                // Agregar etiqueta
                newClientTags = [...clientTags, tagId];
                console.log('➕ Agregando etiqueta');
            }

            // ✅ Primero actualizar el estado local para feedback inmediato
            setClientTags(newClientTags);

            // ✅ USAR FUNCIÓN RPC QUE DESACTIVA TRIGGERS
            const { data, error } = await supabaseClient
                .rpc('update_metadata_silent', {
                    p_chat_id: crmState.activeChat.id,
                    p_propietario: wasender.agentConfig.agent_code,
                    p_updates: { etiquetas: newClientTags }
                });

            if (error) {
                console.error('❌ Error en RPC update_metadata_silent (etiquetas):', error);
                showToast('Error al actualizar etiquetas', 'error');
                // Revertir cambio local si falla
                setClientTags(clientTags);
                return;
            }

            console.log('✅ Etiquetas actualizadas sin triggers:', data);

        } catch (error) {
            console.error('❌ Error en handleToggleTag:', error);
            showToast('Error al actualizar etiquetas', 'error');
            // Revertir cambio local si hay error
            setClientTags(clientTags);
        }
    };

    // ✅ NUEVO: Crear nueva etiqueta
    const handleCreateTag = async () => {
        if (!newTagName.trim() || !session?.user?.email) return;
        
        setCreatingTag(true);
        console.log('🏷️ Creando nueva etiqueta:', newTagName);

        try {
            // Verificar si ya existe una etiqueta con ese nombre para el usuario
            const { data: etiquetasExistentes, error: errorExistente } = await supabaseClient
                .from('etiquetas')
                .select('id')
                .eq('usuario_email', session.user.email)
                .ilike('nombre', newTagName.trim());

            if (errorExistente) {
                console.error('❌ Error verificando etiqueta existente:', errorExistente);
                showToast('Error al verificar etiqueta existente', 'error');
                setCreatingTag(false);
                return;
            }

            if (etiquetasExistentes && etiquetasExistentes.length > 0) {
                showToast('Ya tienes una etiqueta con ese nombre. Elige otro nombre.', 'warning');
                setCreatingTag(false);
                return;
            }

            // ✅ Insertar etiqueta asociada al usuario actual
            const { data: tag, error } = await supabaseClient
                .from('etiquetas')
                .insert([{ 
                    nombre: newTagName.trim(), 
                    color: newTagColor, 
                    usuario_email: session.user.email 
                }])
                .select()
                .single();

            if (error) {
                console.error('❌ Error creando etiqueta:', error);
                showToast('Error al crear la etiqueta: ' + (error.message || 'Error desconocido.'), 'error');
                setCreatingTag(false);
                return;
            }

            if (tag) {
                console.log('✅ Etiqueta creada:', tag);
                
                // Recargar etiquetas
                await fetchTags();
                
                // ✅ Agregar etiqueta al chat actual automáticamente
                if (crmState.activeChat?.id && wasender.agentConfig?.agent_code) {
                    const newClientTags = [...clientTags, tag.id];
                    
                    const { error: updateError } = await supabaseClient
                        .rpc('update_metadata_silent', {
                            p_chat_id: crmState.activeChat.id,
                            p_propietario: wasender.agentConfig.agent_code,
                            p_updates: { etiquetas: newClientTags }
                        });

                    if (updateError) {
                        console.error('❌ Error agregando etiqueta al chat:', updateError);
                    } else {
                        setClientTags(newClientTags);
                        console.log('✅ Etiqueta agregada al chat automáticamente');
                    }
                }
                
                setNewTagName("");
                setNewTagColor("#6366f1");
                setSearchTag(''); // Limpiar búsqueda
                showToast('Etiqueta creada exitosamente', 'success');
            }
        } catch (e) {
            console.error('❌ Error inesperado:', e);
            showToast('Error inesperado al crear la etiqueta.', 'error');
        } finally {
            setCreatingTag(false);
        }
    };

    // ✅ NUEVO: Editar etiqueta
    const handleEditTag = async () => {
        if (!editingTag || !editingTag.nombre.trim() || !session?.user?.email) return;

        setCreatingTag(true);
        console.log('✏️ Editando etiqueta:', editingTag.id);

        try {
            // ✅ Verificar si ya existe una etiqueta con ese nombre (excluyendo la etiqueta actual)
            const { data: etiquetasExistentes, error: errorExistente } = await supabaseClient
                .from('etiquetas')
                .select('id, nombre')
                .eq('usuario_email', session.user.email)
                .ilike('nombre', editingTag.nombre.trim())
                .neq('id', editingTag.id);

            if (errorExistente) {
                console.error('❌ Error verificando etiqueta existente:', errorExistente);
                showToast('Error al verificar etiqueta existente', 'error');
                setCreatingTag(false);
                return;
            }

            if (etiquetasExistentes && etiquetasExistentes.length > 0) {
                console.log('⚠️ Ya existe una etiqueta con ese nombre:', etiquetasExistentes[0].nombre);
                setDuplicateTagName(etiquetasExistentes[0].nombre);
                setShowDuplicateTagModal(true);
                setCreatingTag(false);
                return;
            }

            // Actualizar etiqueta en la base de datos
            const { data, error } = await supabaseClient
                .from('etiquetas')
                .update({
                    nombre: editingTag.nombre.trim(),
                    color: editingTag.color
                })
                .eq('id', editingTag.id)
                .eq('usuario_email', session.user.email)
                .select()
                .single();

            if (error) {
                console.error('❌ Error editando etiqueta:', error);
                showToast('Error al editar la etiqueta: ' + (error.message || 'Error desconocido.'), 'error');
                return;
            }

            console.log('✅ Etiqueta editada:', data);

            // Recargar etiquetas
            await fetchTags();
            
            // Cerrar modal
            setShowEditTagModal(false);
            setEditingTag(null);

            showToast('Etiqueta editada exitosamente', 'success');
        } catch (e) {
            console.error('❌ Error inesperado:', e);
            showToast('Error inesperado al editar la etiqueta.', 'error');
        } finally {
            setCreatingTag(false);
        }
    };

    // ✅ NUEVO: Eliminar etiqueta
    const handleDeleteTag = async (tagId) => {
        if (!session?.user?.email) return;

        console.log('🗑️ Eliminando etiqueta:', tagId);

        try {
            // ✅ PASO 1: Eliminar todas las referencias en cliente_etiquetas (si existe)
            console.log('🔄 Eliminando referencias en cliente_etiquetas...');
            const { error: deleteRelationsError } = await supabaseClient
                .from('cliente_etiquetas')
                .delete()
                .eq('etiqueta_id', tagId);

            if (deleteRelationsError && !deleteRelationsError.message.includes('does not exist')) {
                console.warn('⚠️ Error al eliminar relaciones en cliente_etiquetas:', deleteRelationsError);
            } else {
                console.log('✅ Referencias en cliente_etiquetas eliminadas');
            }

            // ✅ PASO 2: Eliminar la etiqueta del campo JSONB 'etiquetas' de todos los chats
            console.log('🔄 Eliminando etiqueta de todos los chats...');
            
            const { data: chatsWithTag, error: fetchError } = await supabaseClient
                .from('chats')
                .select('id, etiquetas, propietario')
                .contains('etiquetas', [tagId]);

            if (!fetchError && chatsWithTag && chatsWithTag.length > 0) {
                console.log(`📋 Encontrados ${chatsWithTag.length} chats con esta etiqueta`);
                
                for (const chat of chatsWithTag) {
                    const updatedTags = (chat.etiquetas || []).filter(id => id !== tagId);
                    
                    await supabaseClient
                        .rpc('update_metadata_silent', {
                            p_chat_id: chat.id,
                            p_propietario: chat.propietario,
                            p_updates: { etiquetas: updatedTags }
                        });
                }
                
                console.log('✅ Etiqueta eliminada de todos los chats');
            }

            // ✅ PASO 3: Eliminar la etiqueta de la tabla principal
            console.log('🔄 Eliminando etiqueta de la tabla principal...');
            const { error } = await supabaseClient
                .from('etiquetas')
                .delete()
                .eq('id', tagId)
                .eq('usuario_email', session.user.email);

            if (error) {
                console.error('❌ Error eliminando etiqueta:', error);
                showToast('Error al eliminar la etiqueta: ' + (error.message || 'Error desconocido.'), 'error');
                return;
            }

            console.log('✅ Etiqueta eliminada exitosamente de la base de datos');

            // ✅ PASO 4: Actualizar el estado local
            await fetchTags();

            // Si la etiqueta estaba en el chat actual, quitarla del estado local
            if (clientTags.includes(tagId)) {
                const newClientTags = clientTags.filter(id => id !== tagId);
                setClientTags(newClientTags);
            }

            showToast('Etiqueta eliminada exitosamente', 'success');
        } catch (error) {
            console.error('❌ Error en handleDeleteTag:', error);
            showToast('Error al eliminar la etiqueta', 'error');
        }
    };

    // ✅ NUEVO: Cargar datos del chat cuando cambia el chat activo
    useEffect(() => {
        const currentChatId = crmState.activeChat?.id;
        
        // Si el chat no cambió, no hacer nada
        if (currentChatId === lastChatIdRef.current) {
            return;
        }
        
        // Actualizar la referencia
        lastChatIdRef.current = currentChatId;
        
        const loadData = async () => {
            if (!currentChatId || !wasender.agentConfig?.agent_code) {
                setLoadingChatData(false);
                return;
            }
            
            setLoadingChatData(true);
            try {
                const { data, error } = await supabaseClient
                    .from('chats')
                    .select('tipo_cliente, estado_embudo, etiquetas')
                    .eq('id', currentChatId)
                    .eq('propietario', wasender.agentConfig.agent_code)
                    .single();

                if (error) {
                    console.error('Error cargando datos del chat:', error);
                } else {
                    const currentType = data?.tipo_cliente || 'No especificado';
                    const estadoEmbudo = data?.estado_embudo;
                    
                    console.log('📊 Datos del chat cargados:', {
                        tipo_cliente: currentType,
                        estado_embudo: estadoEmbudo,
                        etiquetas: data?.etiquetas
                    });
                    
                    // Calcular pasos directamente aquí para evitar dependencia
                    let stepsForType;
                    if (!currentType || currentType === "No especificado") {
                        stepsForType = salesSteps;
                    } else {
                        const normalizedType = currentType.trim();
                        if (clientTypeSteps[normalizedType] && clientTypeSteps[normalizedType].length > 0) {
                            stepsForType = clientTypeSteps[normalizedType];
                        } else {
                            stepsForType = salesSteps;
                        }
                    }
                    
                    // Determinar el paso seleccionado
                    let selectedStep;
                    if (estadoEmbudo && stepsForType.includes(estadoEmbudo)) {
                        // Si el estado_embudo existe y está en la lista de pasos, usarlo
                        selectedStep = estadoEmbudo;
                    } else if (estadoEmbudo) {
                        // Si existe pero no está en la lista, usar el primero y loguear advertencia
                        console.warn('⚠️ Estado embudo no encontrado en pasos:', estadoEmbudo);
                        selectedStep = stepsForType[0];
                    } else {
                        // Si no existe, usar el primero
                        selectedStep = stepsForType[0];
                    }
                    
                    console.log('✅ Paso seleccionado:', selectedStep);
                    
                    dispatchClientState({ 
                        type: 'SET_ALL',
                        payload: {
                            type: currentType,
                            steps: stepsForType,
                            step: selectedStep
                        }
                    });
                    setClientTags(data?.etiquetas || []);
                }
            } catch (error) {
                console.error('Error en loadData:', error);
            } finally {
                setLoadingChatData(false);
            }
        };
        
        loadData();
    }, [crmState.activeChat?.id, wasender.agentConfig?.agent_code, salesSteps, clientTypeSteps]);

    // ✅ NUEVO: Cargar etiquetas globales y tipos de cliente solo una vez al montar
    useEffect(() => {
        if (session?.user?.email) {
            cargarEtiquetas();
            cargarTiposCliente();
        }
    }, [session?.user?.email, cargarEtiquetas, cargarTiposCliente]);
    
    // Obtener mensajes del chat activo
    const remoteMessages = useMemo(() => {
        if (!crmState.activeChat?.id) return [];
        
        const chatId = crmState.activeChat.id;
        const telefono = crmState.activeChat.telefono;
        
        // Buscar mensajes por chat_id o por teléfono
        let messages = wasender.messages[chatId] || [];
        
        if (messages.length === 0 && telefono) {
            messages = wasender.messages[telefono] || [];
        }
        
        console.log('📨 Mensajes del chat:', {
            chatId,
            telefono,
            total: messages.length
        });
        
        return messages;
    }, [crmState.activeChat?.id, crmState.activeChat?.telefono, wasender.messages]);

    const currentMessages = useMemo(() => {
        const chatKey = crmState.activeChat?.telefono || crmState.activeChat?.id;
        
        // 🔥 SOLUCIÓN DEFINITIVA: Solo usar mensajes remotos de Supabase
        // NO usar mensajes locales para evitar duplicación
        
        // Crear un Map para deduplicar por ID y actualizar read_status
        const messageMap = new Map();
        
        remoteMessages.forEach(msg => {
            const msgId = msg.id;
            const existing = messageMap.get(msgId);
            
            if (!existing) {
                // Primer mensaje con este ID, agregarlo
                messageMap.set(msgId, msg);
            } else {
                // Ya existe, actualizar si el read_status es mayor
                const msgReadStatus = parseInt(msg.read_status || 0, 10);
                const existingReadStatus = parseInt(existing.read_status || 0, 10);
                
                if (msgReadStatus > existingReadStatus) {
                    messageMap.set(msgId, { ...existing, read_status: msg.read_status });
                    console.log('📱 Actualizando read_status:', existingReadStatus, '→', msgReadStatus);
                }
            }
        });
        
        // Convertir Map a array y ordenar
        const deduped = Array.from(messageMap.values());
        
        // Ordenar de más antiguo a más reciente
        return deduped.sort((a, b) => {
            const timeA = new Date(a.message_timestamp || a.timestamp || 0).getTime();
            const timeB = new Date(b.message_timestamp || b.timestamp || 0).getTime();
            return timeA - timeB;
        });
    }, [remoteMessages, crmState.activeChat?.telefono, crmState.activeChat?.id]);

    const chatKey = crmState.activeChat?.telefono || crmState.activeChat?.id;

    const handleSendMessage = useCallback(async (event) => {
        event?.preventDefault();

        const messageText = draftMessage.trim();
        const telefono = crmState.activeChat?.telefono;

        if (!messageText) return;
        if (!telefono) {
            showToast('Selecciona un chat válido para enviar mensajes', 'warning');
            return;
        }
        if (!wasender.agentConfig?.agent_code) {
            showToast('Configura tu agente antes de enviar mensajes', 'warning');
            return;
        }

        // 🔥 NUEVO: Limpiar input INMEDIATAMENTE sin bloquear el botón
        // Esto permite enviar múltiples mensajes seguidos
        const currentMessage = messageText;
        setMessage('');

        try {
            // 🔥 NUEVO: Enviar con throttling por agente usando cola
            // No esperamos el resultado, se agrega a la cola y se procesa automáticamente
            sendWithFunction(
                () => wasender.sendMessage(telefono, currentMessage),
                {
                    phone: telefono,
                    type: 'text',
                    content: currentMessage
                }
            ).then(result => {
                if (result.success) {
                    console.log('✅ Mensaje enviado con throttling, esperando confirmación desde Supabase');
                } else {
                    throw new Error(result.error || 'No se pudo enviar el mensaje');
                }
            }).catch(error => {
                console.error('Error enviando mensaje:', error);
                showToast(error.message || 'No se pudo enviar el mensaje', 'error');
            });
            
            // Mostrar feedback inmediato al usuario
            showToast('Mensaje agregado a la cola de envío', 'info');
            
        } catch (error) {
            console.error('Error agregando mensaje a cola:', error);
            // Restaurar el mensaje en el input si falló al agregarlo a la cola
            setMessage(currentMessage);
            showToast(error.message || 'No se pudo agregar el mensaje a la cola', 'error');
        }
    }, [crmState.activeChat?.telefono, draftMessage, setMessage, showToast, wasender, sendWithFunction]);

    const handleFileUpload = useCallback(async (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        const telefono = crmState.activeChat?.telefono;
        if (!telefono) {
            showToast('Selecciona un chat para enviar archivos', 'warning');
            return;
        }
        if (!wasender.agentConfig?.agent_code) {
            showToast('Configura tu agente antes de enviar archivos', 'warning');
            return;
        }

        for (const file of files) {
            // 🔥 SOLUCIÓN DEFINITIVA: NO crear mensaje optimista para multimedia
            // Solo mostrar indicador de carga
            setUploadingCount(count => count + 1);

            try {
                // 🔥 NUEVO: Enviar multimedia con throttling por agente usando cola
                const result = await sendWithFunction(
                    () => wasender.sendMedia(telefono, file),
                    {
                        phone: telefono,
                        type: 'media',
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type
                    }
                );
                
                if (!result.success) {
                    throw new Error(result.error || 'No se pudo enviar el archivo');
                }
                
                // ✅ Archivo enviado exitosamente
                console.log('✅ Archivo enviado con throttling, esperando mensaje real desde Supabase');
                showToast('Archivo enviado exitosamente', 'success');
                
            } catch (error) {
                console.error('Error enviando archivo:', error);
                showToast(error.message || 'No se pudo enviar el archivo', 'error');
            } finally {
                setUploadingCount(count => Math.max(0, count - 1));
            }
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [crmState.activeChat?.telefono, showToast, wasender, sendWithFunction]);

    const triggerFileSelect = useCallback(() => {
        if (!crmState.activeChat?.id) {
            showToast('Selecciona un chat para adjuntar archivos', 'warning');
            return;
        }
        fileInputRef.current?.click();
    }, [crmState.activeChat?.id, showToast]);

    const handleSaveEditedChat = useCallback((updatedChat) => {
        // Actualizar el chat activo con la nueva información
        if (crmState.setActiveChat && crmState.activeChat?.id === updatedChat.id) {
            crmState.setActiveChat({
                ...crmState.activeChat,
                contact_name: updatedChat.contact_name,
                telefono: updatedChat.telefono,
            });
        }
        
        // Recargar los chats si hay una función para eso
        if (wasender.loadChats) {
            wasender.loadChats();
        }
    }, [crmState, wasender]);

    if (!crmState.activeChat?.id) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md px-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Selecciona una conversación
                    </h2>
                    <p className="text-gray-600">
                        Elige un chat de la lista para comenzar a enviar y recibir mensajes
                    </p>
                </div>
            </div>
        );
    }

    const chatName = crmState.activeChat.pushName || 
                     crmState.activeChat.contact_name || 
                     crmState.activeChat.nombre || 
                     crmState.activeChat.telefono;

    return (
        <div className="flex-1 flex flex-col bg-[#efeae2]">
            {/* Header estilo WhatsApp */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#075e54] text-white shadow">
                {/* Primera fila: Avatar, nombre y botón editar */}
                <div className="flex items-center gap-3 sm:gap-4 mb-3">
                    {isMobile && (
                        <button
                            onClick={() => crmState.setMobileView('sidebar')}
                            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                    )}
                    <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={crmState.activeChat.picture_url || crmState.activeChat.avatarUrl || crmState.activeChat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=128C7E&color=fff&size=96`}
                            alt={chatName}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/40"
                            onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=6B7280&color=fff&size=96`;
                            }}
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-green-400 rounded-full border-2 border-[#075e54]"></div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-base sm:text-lg font-semibold">
                            {chatName}
                        </h2>
                        <p className="text-xs sm:text-sm opacity-80">
                            {crmState.activeChat.telefono}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        title="Editar información del chat"
                    >
                        <Edit2 size={18} className="text-white" />
                    </button>
                </div>

                {/* Segunda fila: Herramientas (Etiquetas, Tipo de Cliente, Etapa del Proceso) */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3" style={{ minHeight: '32px' }}>
                    {loadingChatData ? (
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-6 bg-white/20 rounded animate-pulse"></div>
                            <div className="w-20 h-6 bg-white/20 rounded animate-pulse"></div>
                            <div className="w-24 h-6 bg-white/20 rounded animate-pulse"></div>
                        </div>
                    ) : (
                        <>
                    {/* Etiquetas con tooltip hover */}
                    <div className="relative group">
                        {allTags.filter(tag => clientTags.includes(tag.id)).length > 0 ? (
                            <>
                                <div className="flex items-center gap-1.5 cursor-pointer">
                                    {/* Mostrar primeras 2 etiquetas */}
                                    <div className="flex gap-1.5">
                                        {allTags
                                            .filter(tag => clientTags.includes(tag.id))
                                            .slice(0, 2)
                                            .map(tag => (
                                                <div
                                                    key={tag.id}
                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border-2 border-white/50 shadow-md backdrop-blur-md shrink-0 hover:scale-105 transition-transform"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${tag.color}90, ${tag.color}70)` || 'linear-gradient(135deg, rgba(224, 231, 255, 0.6), rgba(224, 231, 255, 0.4))',
                                                        color: '#ffffff',
                                                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    <div 
                                                        className="w-1.5 h-1.5 rounded-full border border-white/50 shadow-sm shrink-0"
                                                        style={{ background: tag.color || '#e0e7ff' }}
                                                    ></div>
                                                    <span className="max-w-[70px] truncate">{tag.nombre}</span>
                                                </div>
                                            ))}
                                    </div>

                                    {/* Indicador de más etiquetas */}
                                    {allTags.filter(tag => clientTags.includes(tag.id)).length > 2 && (
                                        <div className="text-xs text-white/95 font-bold px-2.5 py-1 bg-white/30 rounded-lg shrink-0 backdrop-blur-sm border border-white/40 shadow-sm">
                                            +{allTags.filter(tag => clientTags.includes(tag.id)).length - 2}
                                        </div>
                                    )}
                                </div>

                                {/* Tooltip hover con TODAS las etiquetas */}
                                <div className="absolute z-50 left-0 top-full mt-1 w-max max-w-[350px] p-3 rounded-xl bg-white shadow-2xl border-2 border-indigo-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible pointer-events-auto transition-opacity duration-300 ease-in-out">
                                    {/* Header del dropdown */}
                                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                                        <TagIcon className="w-3.5 h-3.5 text-indigo-600" />
                                        <span className="text-xs font-bold text-gray-800">
                                            Etiquetas ({allTags.filter(tag => clientTags.includes(tag.id)).length})
                                        </span>
                                    </div>
                                    
                                    {/* Grid de etiquetas */}
                                    <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto custom-scrollbar">
                                        {allTags
                                            .filter(tag => clientTags.includes(tag.id))
                                            .map(tag => (
                                                <div
                                                    key={`hover-${tag.id}`}
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold border-2 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
                                                    style={{
                                                        background: tag.color || '#e0e7ff',
                                                        color: '#1f2937',
                                                        borderColor: tag.color || '#e0e7ff',
                                                    }}
                                                    onClick={() => setShowClientTagsModal(true)}
                                                    title="Click para gestionar etiquetas"
                                                >
                                                    <div 
                                                        className="w-1.5 h-1.5 rounded-full"
                                                        style={{ background: tag.color || '#e0e7ff' }}
                                                    ></div>
                                                    <span>{tag.nombre}</span>
                                                </div>
                                            ))}
                                    </div>
                                    
                                    {/* Footer con botón de gestión */}
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <button
                                            onClick={() => setShowClientTagsModal(true)}
                                            className="w-full px-2 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-[10px] font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
                                        >
                                            <Settings size={12} />
                                            Gestionar
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs text-white/70 italic font-medium">Sin etiquetas</span>
                                <button
                                    onClick={() => setShowClientTagsModal(true)}
                                    title="Agregar etiquetas"
                                    className="shrink-0 w-6 h-6 rounded bg-gradient-to-br from-emerald-500/40 to-emerald-600/30 backdrop-blur-md hover:from-emerald-500/50 hover:to-emerald-600/40 border border-white/50 flex items-center justify-center transition-all hover:scale-110 group/btn"
                                >
                                    <Plus size={14} className="text-white font-bold group-hover/btn:rotate-90 transition-transform" strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Separador */}
                    <div className="h-6 w-px bg-white/30 hidden sm:block"></div>

                    {/* Tipo de Cliente */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-white/70 hidden sm:inline">Tipo:</span>
                        <DropdownMenu key="client-type-dropdown">
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs px-2 transition-none"
                                >
                                    <span className="truncate max-w-[80px]">{selectedClientType}</span>
                                    <ChevronDown className="ml-1 h-3 w-3 flex-shrink-0" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                    onClick={() => handleSelectClientType('No especificado')}
                                    className={selectedClientType === 'No especificado' ? 'bg-indigo-100 font-semibold' : ''}
                                >
                                    No especificado
                                </DropdownMenuItem>
                                {dynamicClientTypes.map((type, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() => handleSelectClientType(type)}
                                        className={type === selectedClientType ? 'bg-indigo-100 font-semibold' : ''}
                                    >
                                        {type}
                                    </DropdownMenuItem>
                                ))}
                                
                                {/* Separador */}
                                <div className="border-t border-gray-200 my-1"></div>
                                
                                {/* Botón para gestionar tipos de clientes */}
                                <DropdownMenuItem
                                    onClick={() => setShowClientTypesConfigModal(true)}
                                    className="text-blue-600 hover:bg-blue-50 font-medium cursor-pointer"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Gestionar tipos de clientes
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Separador */}
                    <div className="h-6 w-px bg-white/30 hidden sm:block"></div>

                    {/* Etapa del Proceso */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-white/70 hidden sm:inline">Etapa:</span>
                        <div className="flex items-center bg-white/10 border border-white/20 rounded-md hover:bg-white/15 transition-colors">
                            <DropdownMenu key="sales-step-dropdown">
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-white hover:bg-transparent border-0 text-xs px-2 transition-none"
                                    >
                                        <span className="truncate max-w-[100px]">{selectedSalesStep}</span>
                                        <ChevronDown className="ml-1 h-3 w-3 flex-shrink-0" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {salesSteps.map((step, index) => (
                                        <DropdownMenuItem
                                            key={`${index}-${step}`}
                                            onClick={() => handleSelectSalesStep(step)}
                                            className={step === selectedSalesStep ? 'bg-indigo-100 font-semibold' : ''}
                                        >
                                            {step}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="h-6 w-px bg-white/30"></div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 p-1.5 flex-shrink-0 transition-all h-auto border-0"
                                onClick={() => {
                                    const currentClientType = getCurrentClientType();
                                    const typeForEditing = currentClientType && currentClientType !== "No especificado" 
                                        ? currentClientType 
                                        : (dynamicClientTypes[0] || 'Comprador');
                                    
                                    setEditingStepsType(typeForEditing);
                                    const stepsForType = getSalesStepsForClient(typeForEditing);
                                    setTempSalesSteps([...stepsForType]);
                                    setEditingSalesSteps(true);
                                }}
                                title="Editar etapas del proceso"
                            >
                                <Edit2 size={14} />
                            </Button>
                        </div>
                    </div>
                        </>
                    )}
                </div>
            </div>

            {/* Área de mensajes */}
            <MessageList 
                messages={currentMessages} 
                loading={wasender.loading}
            />

            {/* Barra de herramientas justo arriba del input */}
            {crmState.activeChat?.id && (
                <div className="px-3 py-2 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-200 flex items-center justify-center gap-2 overflow-x-auto scrollbar-thin">
                    {/* Crear evento único */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 rounded-full text-xs border-green-300 bg-green-50 text-green-700 hover:bg-green-100 flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                                    onClick={() => crmState.setShowEventModal(true)}
                                >
                                    <CalendarIcon size={13} />
                                    <span className="font-medium">Evento</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Crear evento único en Google Calendar</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Crear recordatorio diario */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 rounded-full text-xs border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                                    onClick={() => setShowDailyReminderModal(true)}
                                >
                                    🔔
                                    <span className="font-medium">Recordatorio</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Crear recordatorio diario recurrente</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Ver recordatorios */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 rounded-full text-xs border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                                    onClick={listarRecordatoriosDiariosDelCliente}
                                >
                                    📋
                                    <span className="font-medium">Ver recordatorios</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Ver y gestionar recordatorios activos</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Ver eventos del cliente */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 rounded-full text-xs border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                                    onClick={() => crmState.setShowCalendarModal(true)}
                                >
                                    📅
                                    <span className="font-medium">Ver eventos</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Ver calendario semanal de eventos</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Notas del cliente */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 rounded-full text-xs border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                                    onClick={async () => {
                                        crmState.setShowNotesModal(true);
                                        await fetchClientNotes();
                                    }}
                                >
                                    📝
                                    <span className="font-medium">Notas</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Ver y agregar notas del cliente</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Documentos */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 rounded-full text-xs border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                                    onClick={() => crmState.setShowDocuments(true)}
                                >
                                    <HiDocument size={13} />
                                    <span className="font-medium">Documentos</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Ver documentos compartidos</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}

            {/* Input de mensaje - Con envío real y adjuntos */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-5 border-t border-[#d1c3a7] bg-white/90">
                <div className="flex items-center gap-2 sm:gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        onChange={handleFileUpload}
                    />
                    <button
                        type="button"
                        onClick={triggerFileSelect}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        title="Adjuntar archivos"
                    >
                        <Paperclip size={18} />
                    </button>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={draftMessage}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escribe un mensaje"
                            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 pr-4 bg-white border border-gray-300 rounded-3xl text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#25d366]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!draftMessage.trim()}
                        className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow flex items-center gap-2 transition-colors ${
                            !draftMessage.trim()
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-[#25d366] text-white hover:bg-[#1eb85c]'
                        }`}
                    >
                        Enviar
                    </button>
                </div>
                {uploadingCount > 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                        Subiendo {uploadingCount} archivo{uploadingCount === 1 ? '' : 's'}...
                    </p>
                )}
            </form>

            {/* Modal de Edición */}
            <EditChatModal
                chat={crmState.activeChat}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEditedChat}
                showToast={showToast}
            />

            {/* ✅ MODAL EDITAR ETIQUETA */}
            {showEditTagModal && editingTag && (
                <Dialog open={showEditTagModal} onOpenChange={setShowEditTagModal}>
                    <DialogContent className="max-w-xs w-full rounded-2xl p-0 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                        <form
                            onSubmit={e => { e.preventDefault(); handleEditTag(); }}
                            className="flex flex-col gap-0 bg-white w-full"
                        >
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-5 text-white rounded-t-2xl flex flex-col items-center gap-2">
                                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20">
                                    <Edit2 size={28} />
                                </span>
                                <h2 className="text-lg font-bold mb-1">Editar etiqueta</h2>
                                <p className="text-xs opacity-80 text-center">Modifica el nombre o color de la etiqueta</p>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-blue-900 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre de la etiqueta"
                                        className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={editingTag.nombre}
                                        onChange={e => setEditingTag({ ...editingTag, nombre: e.target.value })}
                                        maxLength={20}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-blue-900 mb-1">Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={editingTag.color}
                                            onChange={e => setEditingTag({ ...editingTag, color: e.target.value })}
                                            className="w-12 h-12 border-2 border-blue-300 rounded-lg cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-600">{editingTag.color}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 p-4 bg-gray-50 rounded-b-2xl">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditTagModal(false);
                                        setEditingTag(null);
                                    }}
                                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    disabled={creatingTag}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                                    disabled={!editingTag.nombre.trim() || creatingTag}
                                >
                                    {creatingTag ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* ✅ MODAL ERROR ETIQUETA DUPLICADA */}
            {showDuplicateTagModal && (
                <Dialog open={showDuplicateTagModal} onOpenChange={setShowDuplicateTagModal}>
                    <DialogContent className="max-w-sm w-full rounded-xl p-6 shadow-xl">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                <AlertTriangle size={24} className="text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    Nombre duplicado
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Ya existe una etiqueta con este nombre
                                </p>
                            </div>
                            <div className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">{duplicateTagName}</span>
                            </div>
                            <button
                                onClick={() => {
                                    setShowDuplicateTagModal(false);
                                    setDuplicateTagName('');
                                }}
                                className="w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Entendido
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* ✅ MODAL CONFIRMAR ELIMINAR ETIQUETA */}
            {showDeleteTagModal && tagToDelete && (
                <Dialog open={showDeleteTagModal} onOpenChange={setShowDeleteTagModal}>
                    <DialogContent className="max-w-sm w-full rounded-xl p-6 shadow-xl">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <X size={24} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    ¿Eliminar etiqueta?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Esta acción no se puede deshacer
                                </p>
                            </div>
                            <div className="w-full px-4 py-2 bg-red-50 rounded-lg border border-red-200">
                                <span className="text-sm font-medium text-red-700">{tagToDelete.nombre}</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Se eliminará de todos los chats
                            </p>
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={() => {
                                        setShowDeleteTagModal(false);
                                        setTagToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={async () => {
                                        await handleDeleteTag(tagToDelete.id);
                                        setShowDeleteTagModal(false);
                                        setTagToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* ✅ MODAL VER TODAS LAS ETIQUETAS DEL CLIENTE - MEJORADO */}
            {showClientTagsModal && (() => {
                const filteredTags = allTags.filter(tag => 
                    tag.nombre.toLowerCase().includes(searchTag.toLowerCase())
                );

                return (
                    <Dialog open={showClientTagsModal} onOpenChange={(open) => {
                        setShowClientTagsModal(open);
                        if (!open) setSearchTag(''); // Limpiar búsqueda al cerrar
                    }}>
                        <DialogContent className="max-w-3xl w-full rounded-3xl p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                            {/* Header compacto con gradiente moderno */}
                            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 text-white">
                                {/* Decoración de fondo */}
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                <TagIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold">Etiquetas del Chat</h2>
                                                {crmState.activeChat?.telefono && (
                                                    <span className="text-xs text-white/80">{crmState.activeChat.telefono}</span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowClientTagsModal(false)}
                                            className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:rotate-90 duration-300"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Buscador moderno */}
                            <div className="px-6 pt-4 bg-gradient-to-b from-gray-50 to-white">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar etiquetas..."
                                        value={searchTag}
                                        onChange={(e) => setSearchTag(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-sm font-medium bg-white shadow-sm"
                                    />
                                    {searchTag && (
                                        <button
                                            onClick={() => setSearchTag('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-600" />
                                        </button>
                                    )}
                                </div>
                                
                                {/* Contador de etiquetas */}
                                <div className="flex items-center justify-between mt-3 mb-2">
                                    <span className="text-xs font-semibold text-gray-500">
                                        {filteredTags.length} {filteredTags.length === 1 ? 'etiqueta disponible' : 'etiquetas disponibles'}
                                    </span>
                                    {clientTags.length > 0 && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-100 rounded-full">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs font-bold text-purple-700">
                                                {clientTags.length} seleccionada{clientTags.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Loading de etiquetas */}
                            {loadingTags ? (
                                <div className="flex-1 flex items-center justify-center p-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                                            <div className="absolute inset-0 w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-600" style={{ animationDirection: 'reverse' }}></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">Cargando etiquetas...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Lista de etiquetas con scroll personalizado */}
                                    <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: '450px', minHeight: '300px' }}>
                                        {filteredTags.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12">
                                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <TagIcon className="w-10 h-10 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-medium text-center mb-2">
                                                    {searchTag ? 'No se encontraron etiquetas' : 'No hay etiquetas disponibles'}
                                                </p>
                                                <p className="text-sm text-gray-400 text-center mb-4">
                                                    {searchTag ? `¿Crear etiqueta "${searchTag}"?` : 'Escribe para crear una nueva etiqueta'}
                                                </p>
                                                {searchTag && (
                                                    <button
                                                        onClick={async () => {
                                                            if (!searchTag.trim()) return;
                                                            
                                                            setCreatingTag(true);
                                                            
                                                            try {
                                                                // Verificar si ya existe una etiqueta con ese nombre
                                                                const { data: etiquetasExistentes, error: errorExistente } = await supabaseClient
                                                                    .from('etiquetas')
                                                                    .select('id')
                                                                    .eq('usuario_email', session.user.email)
                                                                    .ilike('nombre', searchTag.trim());

                                                                if (errorExistente) {
                                                                    console.error('❌ Error verificando etiqueta existente:', errorExistente);
                                                                    showToast('Error al verificar etiqueta existente', 'error');
                                                                    setCreatingTag(false);
                                                                    return;
                                                                }

                                                                if (etiquetasExistentes && etiquetasExistentes.length > 0) {
                                                                    showToast('Ya tienes una etiqueta con ese nombre. Elige otro nombre.', 'warning');
                                                                    setCreatingTag(false);
                                                                    return;
                                                                }

                                                                // Insertar etiqueta con el color por defecto
                                                                const { data: tag, error } = await supabaseClient
                                                                    .from('etiquetas')
                                                                    .insert([{ 
                                                                        nombre: searchTag.trim(), 
                                                                        color: newTagColor, 
                                                                        usuario_email: session.user.email 
                                                                    }])
                                                                    .select()
                                                                    .single();

                                                                if (error) {
                                                                    console.error('❌ Error creando etiqueta:', error);
                                                                    showToast('Error al crear la etiqueta: ' + (error.message || 'Error desconocido.'), 'error');
                                                                    setCreatingTag(false);
                                                                    return;
                                                                }

                                                                if (tag) {
                                                                    console.log('✅ Etiqueta creada:', tag);
                                                                    
                                                                    // Recargar etiquetas
                                                                    await fetchTags();
                                                                    
                                                                    // Agregar etiqueta al chat actual automáticamente
                                                                    if (crmState.activeChat?.id && wasender.agentConfig?.agent_code) {
                                                                        const newClientTags = [...clientTags, tag.id];
                                                                        
                                                                        const { error: updateError } = await supabaseClient
                                                                            .rpc('update_metadata_silent', {
                                                                                p_chat_id: crmState.activeChat.id,
                                                                                p_propietario: wasender.agentConfig.agent_code,
                                                                                p_updates: { etiquetas: newClientTags }
                                                                            });

                                                                        if (updateError) {
                                                                            console.error('❌ Error agregando etiqueta al chat:', updateError);
                                                                        } else {
                                                                            setClientTags(newClientTags);
                                                                            console.log('✅ Etiqueta agregada al chat automáticamente');
                                                                        }
                                                                    }
                                                                    
                                                                    setSearchTag(''); // Limpiar búsqueda
                                                                    showToast('Etiqueta creada exitosamente', 'success');
                                                                }
                                                            } catch (e) {
                                                                console.error('❌ Error inesperado:', e);
                                                                showToast('Error inesperado al crear la etiqueta.', 'error');
                                                            } finally {
                                                                setCreatingTag(false);
                                                            }
                                                        }}
                                                        disabled={creatingTag}
                                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                                    >
                                                        {creatingTag ? (
                                                            <>
                                                                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                                                Creando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus className="w-4 h-4" />
                                                                Crear &quot;{searchTag}&quot;
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2.5">
                                                {filteredTags.map(tag => {
                                                    const isSelected = clientTags.includes(tag.id);
                                                    return (
                                                        <div key={tag.id} className="relative group/tag">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleTag(tag.id)}
                                                                className={`w-full group relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                                                                    isSelected 
                                                                        ? 'ring-4 ring-offset-2 scale-105 shadow-lg' 
                                                                        : 'opacity-70 hover:opacity-100 hover:scale-102 hover:shadow-md'
                                                                }`}
                                                                style={{ 
                                                                    background: isSelected ? tag.color || '#e0e7ff' : `${tag.color || '#e0e7ff'}30`,
                                                                    borderColor: tag.color || '#e0e7ff',
                                                                    color: '#1f2937',
                                                                    ringColor: `${tag.color || '#e0e7ff'}40`
                                                                }}
                                                            >
                                                                {/* Punto de color */}
                                                                <div 
                                                                    className="flex-shrink-0 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                                                    style={{ background: tag.color || '#e0e7ff' }}
                                                                ></div>
                                                                <span className="truncate flex-1 text-left text-xs">{tag.nombre}</span>
                                                                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                                    isSelected ? 'bg-white border-current scale-110' : 'border-gray-400 group-hover:border-current'
                                                                }`}>
                                                                    {isSelected && <Check className="w-3 h-3" style={{ color: tag.color || '#6366f1' }} />}
                                                                </div>
                                                            </button>
                                                            
                                                            {/* Botones de editar y eliminar - aparecen al hacer hover */}
                                                            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover/tag:opacity-100 transition-opacity z-10">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingTag({ id: tag.id, nombre: tag.nombre, color: tag.color });
                                                                        setShowEditTagModal(true);
                                                                    }}
                                                                    className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                                                    title="Editar etiqueta"
                                                                >
                                                                    <Edit2 className="w-3 h-3" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setTagToDelete({ id: tag.id, nombre: tag.nombre });
                                                                        setShowDeleteTagModal(true);
                                                                    }}
                                                                    className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                                                    title="Eliminar etiqueta"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Formulario para crear nueva etiqueta - Mejorado */}
                                    <form
                                        onSubmit={e => { e.preventDefault(); handleCreateTag(); }}
                                        className="border-t-2 border-gray-100 bg-gradient-to-b from-white to-gray-50 p-6"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles className="w-4 h-4 text-purple-500" />
                                            <span className="text-sm font-bold text-gray-700">Crear Nueva Etiqueta</span>
                                        </div>
                                        
                                        <div className="flex gap-3">
                                            {/* Input de nombre */}
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    placeholder="Nombre de la etiqueta..."
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-sm font-medium"
                                                    value={newTagName}
                                                    onChange={e => setNewTagName(e.target.value)}
                                                    maxLength={30}
                                                    required
                                                />
                                            </div>

                                            {/* Selector de color */}
                                            <label className="relative flex items-center justify-center cursor-pointer w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:scale-110 transition-all bg-white shadow-sm group" title="Elegir color">
                                                <Palette className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                                                <input
                                                    type="color"
                                                    value={newTagColor}
                                                    onChange={e => setNewTagColor(e.target.value)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <div 
                                                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-lg"
                                                    style={{ background: newTagColor }}
                                                ></div>
                                            </label>

                                            {/* Botón de crear */}
                                            <button
                                                type="submit"
                                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                                disabled={!newTagName.trim() || creatingTag}
                                            >
                                                {creatingTag ? (
                                                    <>
                                                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                                        Creando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4" />
                                                        Crear
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                );
            })()}

            {/* ✅ MODAL DE EDICIÓN DE ETAPAS DEL PROCESO */}
            {editingSalesSteps && (
                <Dialog open={editingSalesSteps} onOpenChange={setEditingSalesSteps}>
                    <DialogContent className="max-w-2xl w-full rounded-2xl p-0 overflow-hidden shadow-2xl flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-100 border-2 border-indigo-100">
                        <div className="w-full bg-white/90 p-6 rounded-2xl shadow-md flex flex-col items-center justify-center">
                            <h2 className="text-xl font-bold mb-2 text-indigo-700 flex items-center gap-2 justify-center w-full">
                                <Edit2 size={20} className="text-indigo-400" /> Editar etapas del proceso
                            </h2>
                            <p className="text-xs text-gray-500 mb-4 text-center w-full">Personaliza las etapas según el tipo de cliente. Cada tipo tiene su propio embudo de ventas.</p>

                            {/* Selector de tipo de cliente */}
                            <div className="mb-4 w-full max-w-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de cliente:</label>
                                <div className="flex gap-2 justify-center flex-wrap">
                                    {dynamicClientTypes.map((tipo) => (
                                        <button
                                            key={tipo}
                                            onClick={() => {
                                                setEditingStepsType(tipo);
                                                const stepsForType = getSalesStepsForClient(tipo);
                                                setTempSalesSteps([...stepsForType]);
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${editingStepsType === tipo
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            type="button"
                                        >
                                            {tipo}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center mb-4">
                                <span className="text-sm font-medium text-indigo-600">
                                    Editando: Proceso para {editingStepsType}
                                </span>
                            </div>

                            <ul className="space-y-2 mb-4 w-full max-w-2xl flex flex-col items-center max-h-60 overflow-y-auto">
                                {tempSalesSteps.map((step, idx) => (
                                    <li key={idx} className="flex items-center gap-2 group w-full">
                                        <span className="text-xs text-gray-400 font-bold w-5 text-right select-none">{idx + 1}.</span>
                                        <input
                                            type="text"
                                            value={step}
                                            onChange={e => {
                                                const arr = [...tempSalesSteps];
                                                arr[idx] = e.target.value;
                                                setTempSalesSteps(arr);
                                            }}
                                            className="flex-1 border border-indigo-200 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-300 bg-white/80 text-gray-800 shadow-sm"
                                            maxLength={60}
                                            style={{ minWidth: 0 }}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                const arr = [...tempSalesSteps];
                                                arr.splice(idx, 1);
                                                setTempSalesSteps(arr);
                                            }}
                                            title="Eliminar"
                                            className="opacity-60 group-hover:opacity-100 text-red-400 hover:bg-red-100"
                                            type="button"
                                        >
                                            <X size={14} />
                                        </Button>
                                        {idx > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const arr = [...tempSalesSteps];
                                                    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                                                    setTempSalesSteps(arr);
                                                }}
                                                title="Subir"
                                                className="text-indigo-400 hover:bg-indigo-100"
                                                type="button"
                                            >
                                                <ChevronUp size={14} />
                                            </Button>
                                        )}
                                        {idx < tempSalesSteps.length - 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const arr = [...tempSalesSteps];
                                                    [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                                                    setTempSalesSteps(arr);
                                                }}
                                                title="Bajar"
                                                className="text-indigo-400 hover:bg-indigo-100"
                                                type="button"
                                            >
                                                <ChevronDown size={14} />
                                            </Button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant="outline"
                                className="mb-4 w-full max-w-md border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                onClick={() => setTempSalesSteps([...tempSalesSteps, `Nueva etapa ${tempSalesSteps.length + 1}`])}
                                type="button"
                            >
                                + Agregar etapa
                            </Button>
                            <div className="flex gap-2 justify-end w-full">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setEditingSalesSteps(false);
                                        setEditingStepsType(dynamicClientTypes[0] || 'Comprador');
                                    }}
                                    className="text-gray-500 hover:bg-gray-100"
                                    type="button"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={saveUserSalesSteps}
                                    disabled={savingSalesSteps || tempSalesSteps.some(s => !s.trim()) || tempSalesSteps.length === 0}
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                                    type="button"
                                >
                                    {savingSalesSteps ? "Guardando..." : `Guardar para ${editingStepsType}`}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* ✅ MODAL DE CONFIGURACIÓN DE TIPOS DE CLIENTES */}
            <ClientTypesConfigModal
                isOpen={showClientTypesConfigModal}
                onClose={() => setShowClientTypesConfigModal(false)}
                agentEmail={session?.user?.email}
                agentCode={wasender.agentConfig?.agent_code}
                onConfigSaved={handleConfigSaved}
                showToast={showToast}
            />

            {/* ✅ MODAL CREAR EVENTO - DISEÑO COMPLETO */}
            {crmState.showEventModal && (
                <Dialog open={crmState.showEventModal} onOpenChange={crmState.setShowEventModal}>
                    <DialogContent className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border-0 p-0 max-h-[85vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setCreatingEvent(true);
                                try {
                                    if (!session?.accessToken) {
                                        showToast('Debes iniciar sesión con Google para crear eventos', 'warning');
                                        setCreatingEvent(false);
                                        return;
                                    }
                                    const startDate = new Date(eventForm.start);
                                    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
                                    const evento = {
                                        summary: eventForm.title,
                                        description: `${eventForm.description}\n\nCliente: ${eventForm.clientName || crmState.activeChat?.nombre || crmState.activeChat?.name || crmState.activeChat?.displayName || ''} - Tel: ${eventForm.clientPhone || crmState.activeChat?.telefono || crmState.activeChat?.id?.replace(/@c\.us$/, '') || ''}\n\nCreado por: ${session.user.email}`,
                                        start: { dateTime: startDate.toISOString() },
                                        end: { dateTime: endDate.toISOString() },
                                        reminders: {
                                            useDefault: false,
                                            overrides: [
                                                { method: 'popup', minutes: 60 },
                                                { method: 'popup', minutes: 30 }
                                            ]
                                        }
                                    };
                                    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
                                        method: "POST",
                                        headers: { "Authorization": `Bearer ${session.accessToken}`, "Content-Type": "application/json" },
                                        body: JSON.stringify(evento)
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        showToast(`✅ Evento "${eventForm.title}" creado correctamente para ${eventForm.clientName || crmState.activeChat?.nombre || 'el cliente'}`, 'success');
                                        crmState.setShowEventModal(false);
                                        setEventForm({ title: "", description: "", start: "", clientName: "", clientPhone: "" });
                                    } else if (res.status === 401) {
                                        showToast('Tu sesión de Google ha expirado. Por favor, vuelve a iniciar sesión', 'warning');
                                        setCreatingEvent(false);
                                        return;
                                    } else {
                                        showToast("Error al crear evento: " + (data.error?.message || "Desconocido"), 'error');
                                    }
                                } catch (err) {
                                    showToast("Error: " + err.message, 'error');
                                } finally {
                                    setCreatingEvent(false);
                                }
                            }}
                            className="flex flex-col bg-white w-full"
                        >
                            {/* HEADER COMPACTO Y ELEGANTE */}
                            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <CalendarIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Crear evento en Google Calendar</h2>
                                            <p className="text-blue-100/80 text-sm">Programa una cita con tu cliente</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex gap-1 opacity-30">
                                        <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                        <div className="w-6 h-6 rounded-full bg-white/10"></div>
                                    </div>
                                </div>
                            </div>

                            {/* CONTENIDO PRINCIPAL EN GRID COMPACTO */}
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white">
                                {/* COLUMNA 1: INFORMACIÓN DEL CLIENTE */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        Cliente
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={eventForm.clientName || crmState.activeChat?.nombre || crmState.activeChat?.name || crmState.activeChat?.displayName || ''}
                                                    onChange={e => setEventForm(f => ({ ...f, clientName: e.target.value }))}
                                                    placeholder="Nombre del cliente"
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={eventForm.clientPhone || crmState.activeChat?.telefono || crmState.activeChat?.id?.replace(/@c\.us$/, '') || ''}
                                                    onChange={e => setEventForm(f => ({ ...f, clientPhone: e.target.value }))}
                                                    placeholder="Teléfono"
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200"
                                                />
                                                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA 2: DETALLES DEL EVENTO */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                                        <Edit2 className="h-5 w-5 text-purple-600" />
                                        Evento
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Reunión, visita, cita..."
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:border-purple-500 focus:outline-none transition-all duration-200"
                                                value={eventForm.title}
                                                onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                            <textarea
                                                placeholder="Detalles del evento..."
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:border-purple-500 focus:outline-none transition-all duration-200 resize-none"
                                                value={eventForm.description}
                                                onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA 3: FECHA Y HORA MODERNA */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                                        <CalendarIcon className="h-5 w-5 text-indigo-600" />
                                        Fecha y hora
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:border-indigo-500 focus:outline-none transition-all duration-200"
                                                value={eventForm.start ? eventForm.start.split('T')[0] : ''}
                                                onChange={e => {
                                                    const currentTime = eventForm.start ? eventForm.start.split('T')[1] : '09:00';
                                                    setEventForm(f => ({ ...f, start: e.target.value + 'T' + currentTime }));
                                                }}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="col-span-2">
                                                    <div className="grid grid-cols-4 gap-1 mb-2">
                                                        {['09:00', '10:00', '14:00', '16:00'].map((time) => (
                                                            <button
                                                                key={time}
                                                                type="button"
                                                                onClick={() => {
                                                                    const currentDate = eventForm.start ? eventForm.start.split('T')[0] : new Date().toISOString().split('T')[0];
                                                                    setEventForm(f => ({ ...f, start: currentDate + 'T' + time }));
                                                                }}
                                                                className={`px-2 py-1.5 text-xs rounded-md border transition-all duration-200 ${
                                                                    eventForm.start?.includes(time) 
                                                                        ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium' 
                                                                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200'
                                                                }`}
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="time"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:border-indigo-500 focus:outline-none transition-all duration-200"
                                                        value={eventForm.start ? eventForm.start.split('T')[1] : '09:00'}
                                                        onChange={e => {
                                                            const currentDate = eventForm.start ? eventForm.start.split('T')[0] : new Date().toISOString().split('T')[0];
                                                            setEventForm(f => ({ ...f, start: currentDate + 'T' + e.target.value }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-1">
                                                <svg className="h-3 w-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                <span>Duración: 1 hora</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER COMPACTO CON BOTONES */}
                            <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-4">
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            crmState.setShowEventModal(false);
                                            setEventForm({ title: "", description: "", start: "", clientName: "", clientPhone: "" });
                                        }}
                                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 flex items-center gap-2 text-sm"
                                        disabled={creatingEvent}
                                    >
                                        <X className="h-4 w-4" />
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2 min-w-[120px] justify-center text-sm"
                                        disabled={creatingEvent}
                                    >
                                        {creatingEvent ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Creando...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4" />
                                                Crear evento
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* ✅ MODAL NOTAS - VERSIÓN COMPLETA CON EDITAR Y ELIMINAR */}
            {crmState.showNotesModal && (
                <Dialog open={crmState.showNotesModal} onOpenChange={crmState.setShowNotesModal}>
                    <DialogContent className="max-w-lg w-full rounded-2xl p-0 overflow-hidden shadow-2xl">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-5 text-white rounded-t-2xl flex items-center gap-3">
                            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20">📝</span>
                            <div>
                                <h2 className="text-lg font-bold mb-1">Notas de {crmState.activeChat?.nombre || crmState.activeChat?.name || 'Cliente'}</h2>
                                <p className="text-xs opacity-80">Notas privadas para este cliente</p>
                            </div>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                            {crmState.loadingNotes ? (
                                <div className="text-center text-yellow-600 font-semibold">Cargando notas...</div>
                            ) : crmState.clientNotes.length === 0 ? (
                                <div className="text-center text-gray-400">No hay notas para este cliente.</div>
                            ) : (
                                <ul className="space-y-2">
                                    {crmState.clientNotes.map(note => {
                                        const isEditing = crmState.editingNoteId === note.id;
                                        return (
                                            <li key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 relative">
                                                <div className="text-xs text-gray-500 mb-1">{new Date(note.fecha).toLocaleString('es-AR')}</div>
                                                {isEditing ? (
                                                    <div className="flex gap-2 items-center">
                                                        <textarea
                                                            className="flex-1 border border-yellow-300 rounded-lg px-2 py-1 text-sm"
                                                            value={crmState.editingNoteText}
                                                            onChange={e => crmState.setEditingNoteText(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <Button
                                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                            onClick={async () => {
                                                                await editClientNote(note.id, crmState.editingNoteText);
                                                                crmState.setEditingNoteId(null);
                                                                crmState.setEditingNoteText("");
                                                            }}
                                                            disabled={!crmState.editingNoteText.trim()}
                                                        >Guardar</Button>
                                                        <Button
                                                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                                                            onClick={() => { crmState.setEditingNoteId(null); crmState.setEditingNoteText(""); }}
                                                        >Cancelar</Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 items-center">
                                                        <div className="text-sm text-yellow-900 whitespace-pre-line flex-1">{note.nota}</div>
                                                        <Button
                                                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 text-xs"
                                                            onClick={() => {
                                                                crmState.setEditingNoteId(note.id);
                                                                crmState.setEditingNoteText(note.nota);
                                                            }}
                                                        >Editar</Button>
                                                        <Button
                                                            className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 text-xs"
                                                            onClick={async () => {
                                                                const confirmed = true;
                                                                if (confirmed) {
                                                                    await deleteClientNote(note.id);
                                                                    if (crmState.editingNoteId === note.id) {
                                                                        crmState.setEditingNoteId(null);
                                                                        crmState.setEditingNoteText("");
                                                                    }
                                                                }
                                                            }}
                                                        >Borrar</Button>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex gap-2">
                            <textarea
                                className="flex-1 border border-yellow-200 rounded-lg px-3 py-2 text-sm"
                                placeholder="Escribe una nota..."
                                value={crmState.newNote}
                                onChange={e => crmState.setNewNote(e.target.value)}
                            />
                            <Button
                                onClick={saveClientNote}
                                disabled={!crmState.newNote.trim()}
                                className="bg-yellow-500 text-white rounded-lg px-4 py-2 hover:bg-yellow-600"
                            >
                                Guardar
                            </Button>
                        </div>
                        <div className="flex gap-2 p-4 bg-gray-50 rounded-b-2xl border-t">
                            <button
                                type="button"
                                onClick={() => crmState.setShowNotesModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Cerrar
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* ✅ MODAL DOCUMENTOS - VERSIÓN COMPLETA CON DocumentModal */}
            {crmState.showDocuments && crmState.activeChat && (
                <DocumentModal 
                    open={crmState.showDocuments} 
                    onClose={() => crmState.setShowDocuments(false)} 
                    documents={archivosBD} 
                    telefono={typeof crmState.activeChat.id === 'string' ? crmState.activeChat.id.replace(/@c\.us$/, '') : crmState.activeChat.id} 
                    fetchArchivos={fetchArchivos}
                    showToast={showToast}
                />
            )}

            {/* ✅ MODAL VER RECORDATORIOS */}
            {mostrarModalEventos && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                            🗓️ Recordatorios diarios
                        </h2>

                        {eventosCliente.length === 0 ? (
                            <p className="text-gray-600 text-center">No hay recordatorios disponibles.</p>
                        ) : (
                            <ul className="space-y-3 max-h-80 overflow-y-auto">
                                {eventosCliente.map((evento) => (
                                    <li
                                        key={evento.id}
                                        className="flex justify-between items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 hover:shadow-sm transition"
                                    >
                                        <div className="text-gray-800">
                                            <div className="font-semibold">{evento.summary}</div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(evento.start.dateTime).toLocaleString()}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => eliminarEventoRecurrente(evento.id)}
                                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                            Completar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setMostrarModalEventos(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-5 py-2 rounded-lg transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ MODAL CREAR RECORDATORIO DIARIO */}
            {showDailyReminderModal && (
                <Dialog open={showDailyReminderModal} onOpenChange={setShowDailyReminderModal}>
                    <DialogContent className="max-w-md w-full rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
                        {/* Header con gradiente */}
                        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-white relative overflow-hidden">
                            {/* Animación de fondo */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse"></div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                            </div>
                            
                            {/* Contenido del header */}
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl animate-bounce">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Crear Recordatorio</h2>
                                    <p className="text-sm text-white/90">Configura una alerta diaria para este cliente</p>
                                </div>
                            </div>
                        </div>

                        {/* Cuerpo del modal */}
                        <div className="p-6 space-y-6">
                            {/* Info del cliente */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                                <div className="bg-blue-500 text-white rounded-full p-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-600 font-medium">Cliente seleccionado</p>
                                    <p className="text-sm font-bold text-gray-800">{crmState.activeChat?.nombre || crmState.activeChat?.name || 'Sin nombre'}</p>
                                </div>
                            </div>

                            {/* Campo de entrada con diseño mejorado */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    Nombre del recordatorio
                                </label>
                                <div className="relative">
                                    <input
                                        value={dailyReminderTitle}
                                        onChange={(e) => setDailyReminderTitle(e.target.value)}
                                        placeholder="Ej: Llamar al cliente para seguimiento"
                                        className="w-full pl-4 pr-16 py-3 text-base border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 rounded-xl transition-all outline-none"
                                        maxLength={100}
                                    />
                                    <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                                        {dailyReminderTitle.length}/100
                                    </div>
                                </div>
                            </div>

                            {/* Detalles del recordatorio */}
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                                <div className="flex items-center gap-2 text-amber-900">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-semibold">Configuración automática</span>
                                </div>
                                <ul className="text-xs text-amber-800 space-y-1 ml-7">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                        Se repetirá todos los días a las 8:00 AM
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                        Recibirás una notificación en Google Calendar
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                        Puedes gestionarlo desde tus eventos
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer con botones */}
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                            <Button
                                variant="outline"
                                onClick={() => setShowDailyReminderModal(false)}
                                className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-100 font-semibold rounded-xl transition-all"
                                disabled={creatingDailyReminder}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => crearRecordatorioDiario(dailyReminderTitle)}
                                disabled={!dailyReminderTitle.trim() || creatingDailyReminder}
                                className="px-8 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {creatingDailyReminder ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Crear Recordatorio
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* ✅ MODAL CALENDARIO SEMANAL */}
            {crmState.showCalendarModal && (
                <WeeklyCalendarModal
                    open={crmState.showCalendarModal}
                    onClose={() => crmState.setShowCalendarModal(false)}
                    events={calendarEvents}
                    weekStart={calendarWeekStart}
                    onPrevWeek={async () => {
                        const prev = new Date(calendarWeekStart);
                        prev.setDate(prev.getDate() - 7);
                        setCalendarWeekStart(prev);
                        await fetchCalendarEvents(prev);
                    }}
                    onNextWeek={async () => {
                        const next = new Date(calendarWeekStart);
                        next.setDate(next.getDate() + 7);
                        setCalendarWeekStart(next);
                        await fetchCalendarEvents(next);
                    }}
                />
            )}
        </div>
    );
} 
