"use client"

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, X, Search, User, Calendar as CalendarIcon, Check } from 'lucide-react';

/**
 * Vista de Recordatorios Globales
 * Muestra todos los recordatorios diarios de todos los clientes
 */
export default function RecordatoriosView({ chats, showToast }) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [recordatorios, setRecordatorios] = useState([]);
    const [filteredRecordatorios, setFilteredRecordatorios] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);

    // Cargar recordatorios globales
    const fetchGlobalReminders = useCallback(async () => {
        if (!session?.accessToken) return;

        setLoading(true);
        const now = new Date().toISOString();

        // Función para verificar si el evento fue creado por el usuario actual
        const isEventFromCurrentUser = (event) => {
            if (!session?.user?.email) return true;
            const creatorEmail = event.creator?.email || '';
            return creatorEmail === session.user.email;
        };

        try {
            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&singleEvents=false&maxResults=250`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Error al obtener eventos globales:", data);
                setLoading(false);
                return;
            }

            // Filtrar solo eventos recurrentes diarios del usuario actual
            const recordatoriosDiarios = (data.items || []).filter((evento) =>
                evento.recurrence?.some(r => r.includes("RRULE:FREQ=DAILY")) &&
                evento.description &&
                isEventFromCurrentUser(evento)
            );

            // Agrupar recordatorios por chat (teléfono)
            const recordatoriosPorChat = {};
            
            recordatoriosDiarios.forEach(evento => {
                // Extraer teléfono de la descripción
                const phoneMatch = evento.description.match(/\d{10,15}/);
                if (phoneMatch) {
                    const phone = phoneMatch[0];
                    const chatId = `${phone}@c.us`;
                    
                    if (!recordatoriosPorChat[phone]) {
                        // Buscar el chat correspondiente
                        const chat = chats?.find(c => c.id === chatId);
                        
                        // Extraer nombre del cliente de la descripción
                        let extractedName = null;
                        if (evento.description) {
                            let nameMatch = evento.description.match(/👤\s*Cliente:\s*([^\n\r📧]+)/i);
                            if (!nameMatch) {
                                nameMatch = evento.description.match(/Cliente:\s*([^\n\r📧]+)/i);
                            }
                            if (!nameMatch) {
                                nameMatch = evento.description.match(/con\s+([^📱\n\r]+?)(?:\s*📱|\s*Teléfono:)/i);
                            }
                            
                            if (nameMatch && nameMatch[1]) {
                                extractedName = nameMatch[1].trim();
                            }
                        }
                        
                        const finalName = extractedName || chat?.name || chat?.pushName || chat?.nombre || phone;
                        
                        recordatoriosPorChat[phone] = {
                            phone,
                            chatId,
                            chatName: finalName,
                            recordatorios: []
                        };
                    }
                    recordatoriosPorChat[phone].recordatorios.push(evento);
                }
            });

            const recordatoriosArray = Object.values(recordatoriosPorChat);
            setRecordatorios(recordatoriosArray);
            setFilteredRecordatorios(recordatoriosArray);
            setLoading(false);

        } catch (error) {
            console.error("Error al obtener recordatorios globales:", error);
            showToast?.('Error al cargar recordatorios', 'error');
            setLoading(false);
        }
    }, [session?.accessToken, session?.user?.email, chats, showToast]);

    // Cargar recordatorios al montar
    useEffect(() => {
        fetchGlobalReminders();
    }, [fetchGlobalReminders]);

    // Filtrar por chat seleccionado
    const filterRemindersByChat = (chatId) => {
        setSelectedChat(chatId);
        if (!chatId) {
            setFilteredRecordatorios(recordatorios);
        } else {
            setFilteredRecordatorios(recordatorios.filter(r => r.chatId === chatId));
        }
    };

    // Completar recordatorio
    const completarRecordatorio = async (eventId) => {
        if (!session?.accessToken) return;

        try {
            await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                }
            );

            showToast?.('Recordatorio completado exitosamente', 'success');
            fetchGlobalReminders();
        } catch (error) {
            console.error("Error al completar recordatorio:", error);
            showToast?.('Error al completar el recordatorio', 'error');
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Recordatorios Globales</h2>
                            <p className="text-sm text-gray-600">Gestiona todos los recordatorios diarios de tus clientes</p>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por cliente..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <select
                        value={selectedChat || ''}
                        onChange={(e) => filterRemindersByChat(e.target.value || null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                        <option value="">Todos los clientes ({recordatorios.length})</option>
                        {recordatorios.map((item) => (
                            <option key={item.chatId} value={item.chatId}>
                                {item.chatName} ({item.recordatorios.length})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Cargando recordatorios...</p>
                    </div>
                ) : filteredRecordatorios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Bell size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay recordatorios activos</h3>
                        <p className="text-gray-500 text-sm">Crea recordatorios diarios para tus clientes desde el chat</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-6xl mx-auto">
                        {filteredRecordatorios.map((item) => (
                            <div key={item.chatId} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Header del chat */}
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-md">
                                            {item.chatName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.chatName}</h3>
                                            <p className="text-xs text-gray-500">{item.phone}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                                                {item.recordatorios.length} recordatorio{item.recordatorios.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de recordatorios */}
                                <div className="p-4 space-y-2">
                                    {item.recordatorios.map((evento, idx) => (
                                        <div
                                            key={evento.id}
                                            className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 mb-1">{evento.summary}</h4>
                                                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarIcon size={14} />
                                                        {new Date(evento.start.dateTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Bell size={14} />
                                                        Diario
                                                    </span>
                                                </div>
                                                {evento.description && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{evento.description}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => completarRecordatorio(evento.id)}
                                                className="flex-shrink-0 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                                                title="Completar recordatorio"
                                            >
                                                <Check size={16} />
                                                Completar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
