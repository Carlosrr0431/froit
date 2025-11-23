"use client"

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, User, MapPin, X } from 'lucide-react';

/**
 * Vista de Calendario - Gestión de eventos y citas
 * Muestra calendario semanal con eventos de Google Calendar
 */
export default function CalendarioView({ showToast }) {
    const { data: session } = useSession();
    const [weekStart, setWeekStart] = useState(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);

    // Función para verificar si el evento fue creado por el usuario actual
    const isEventFromCurrentUser = useCallback((event) => {
        if (!session?.user?.email) return true;
        const creatorEmail = event.creator?.email || '';
        return creatorEmail === session.user.email;
    }, [session?.user?.email]);

    // Cargar eventos de la semana
    const fetchCalendarEvents = useCallback(async (start = weekStart) => {
        if (!session?.accessToken) {
            setError("No se encontró un token de Google válido");
            return;
        }

        setError("");
        setLoading(true);

        try {
            // Calcular rango de la semana (lunes a domingo)
            const startOfWeek = new Date(start);
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const timeMin = startOfWeek.toISOString();
            const timeMax = endOfWeek.toISOString();

            const res = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
                {
                    headers: {
                        "Authorization": `Bearer ${session.accessToken}`
                    }
                }
            );

            const data = await res.json();

            if (res.ok) {
                // Filtrar eventos del usuario actual
                const eventosDelUsuario = (data.items || []).filter(evento => isEventFromCurrentUser(evento));
                setEvents(eventosDelUsuario);
            } else {
                setError("No se pudieron cargar los eventos");
                console.error("Error al cargar eventos:", data);
            }
        } catch (err) {
            setError("Error al cargar los eventos de Google Calendar");
            console.error("Error fetch:", err);
        } finally {
            setLoading(false);
        }
    }, [session?.accessToken, weekStart, isEventFromCurrentUser]);

    // Cargar eventos al montar y cuando cambia la semana
    useEffect(() => {
        fetchCalendarEvents();
    }, [fetchCalendarEvents]);

    // Navegar semanas
    const navigateWeek = (direction) => {
        const newStart = new Date(weekStart);
        newStart.setDate(weekStart.getDate() + (direction === 'next' ? 7 : -7));
        setWeekStart(newStart);
    };

    // Obtener días de la semana
    const getDaysOfWeek = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            days.push(day);
        }
        return days;
    };

    // Obtener eventos del día
    const getEventsForDay = (day) => {
        return events.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date);
            return eventDate.toDateString() === day.toDateString();
        });
    };

    // Abrir modal con detalles del evento
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowEventModal(true);
    };

    // Cerrar modal
    const closeEventModal = () => {
        setShowEventModal(false);
        setSelectedEvent(null);
    };

    const daysOfWeek = getDaysOfWeek();
    const today = new Date();

    return (
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
            {/* Header compacto con navegación de semana y métricas */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between gap-6">
                    {/* Navegación de semana */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigateWeek('prev')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <ChevronLeft size={20} className="text-gray-700" />
                        </button>

                        <div className="text-center min-w-[280px]">
                            <h3 className="text-lg font-semibold text-gray-900 capitalize">
                                {weekStart.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {weekStart.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} - {' '}
                                {(() => {
                                    const endOfWeek = new Date(weekStart);
                                    endOfWeek.setDate(weekStart.getDate() + 6);
                                    return endOfWeek.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
                                })()}
                            </p>
                        </div>

                        <button
                            onClick={() => navigateWeek('next')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <ChevronRight size={20} className="text-gray-700" />
                        </button>
                    </div>

                    {/* Métricas compactas */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                            <div>
                                <p className="text-xs text-blue-600 font-medium">Total</p>
                                <p className="text-lg font-bold text-blue-900">{events.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
                            <div>
                                <p className="text-xs text-green-600 font-medium">Hoy</p>
                                <p className="text-lg font-bold text-green-900">{getEventsForDay(today).length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
                            <div>
                                <p className="text-xs text-purple-600 font-medium">Próximos</p>
                                <p className="text-lg font-bold text-purple-900">
                                    {events.filter(e => new Date(e.start.dateTime || e.start.date) > today).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500">Cargando eventos...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <Calendar size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el calendario</h3>
                        <p className="text-gray-500 text-sm">{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Vista tipo Google Calendar */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            {/* Flechas de navegación arriba del calendario */}
                            <div className="flex items-center justify-end gap-2 px-6 py-2">
                                <button
                                    onClick={() => {
                                        const container = document.getElementById('calendar-scroll-container');
                                        if (container) {
                                            container.scrollBy({ left: -200, behavior: 'smooth' });
                                        }
                                    }}
                                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                >
                                    <ChevronLeft size={20} className="text-gray-700" />
                                </button>

                                <button
                                    onClick={() => {
                                        const container = document.getElementById('calendar-scroll-container');
                                        if (container) {
                                            container.scrollBy({ left: 200, behavior: 'smooth' });
                                        }
                                    }}
                                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                >
                                    <ChevronRight size={20} className="text-gray-700" />
                                </button>
                            </div>

                            {/* Contenedor de días con scroll */}
                            <div 
                                id="calendar-scroll-container"
                                className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-6"
                                style={{ scrollbarWidth: 'thin' }}
                            >
                                <div className="flex gap-1 min-w-full h-full">
                                    {daysOfWeek.map((day, index) => {
                                        const dayEvents = getEventsForDay(day);
                                        const isToday = day.toDateString() === today.toDateString();

                                        return (
                                            <div
                                                key={index}
                                                className={`flex-1 min-w-[140px] bg-white border-r ${
                                                    index === 0 ? 'border-l' : ''
                                                } border-gray-200 flex flex-col h-full`}
                                            >
                                                {/* Header del día */}
                                                <div className={`p-3 border-b border-gray-200 text-center ${
                                                    isToday ? 'bg-blue-50' : 'bg-gray-50'
                                                }`}>
                                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                                        {day.toLocaleDateString('es-AR', { weekday: 'short' })}
                                                    </p>
                                                    <p className={`text-2xl font-semibold ${
                                                        isToday 
                                                            ? 'bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto' 
                                                            : 'text-gray-900'
                                                    }`}>
                                                        {day.getDate()}
                                                    </p>
                                                </div>

                                                {/* Eventos del día */}
                                                <div className="flex-1 p-2 space-y-1 overflow-y-auto bg-white">
                                                    {dayEvents.length === 0 ? (
                                                        <div className="flex items-center justify-center h-32">
                                                            <p className="text-xs text-gray-300 italic">Sin eventos</p>
                                                        </div>
                                                    ) : (
                                                        dayEvents.map((event) => (
                                                            <button
                                                                key={event.id}
                                                                onClick={() => handleEventClick(event)}
                                                                className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all text-left group shadow-sm"
                                                            >
                                                                <p className="text-xs font-semibold mb-1.5 leading-tight">
                                                                    {event.summary}
                                                                </p>
                                                                <div className="flex items-center gap-1.5">
                                                                    <Clock size={11} className="flex-shrink-0 opacity-90" />
                                                                    <p className="text-xs opacity-90 font-medium">
                                                                        {event.start.dateTime
                                                                            ? new Date(event.start.dateTime).toLocaleTimeString('es-AR', {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })
                                                                            : 'Todo el día'}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal de detalles del evento */}
            {showEventModal && selectedEvent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeEventModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Header del modal */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl relative">
                            <button
                                onClick={closeEventModal}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-white" />
                            </button>
                            <h3 className="text-2xl font-bold text-white pr-12">{selectedEvent.summary}</h3>
                        </div>

                        {/* Contenido del modal */}
                        <div className="p-8 space-y-6">
                            {/* Fecha y hora */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <Clock size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Fecha y Hora</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {selectedEvent.start.dateTime
                                            ? new Date(selectedEvent.start.dateTime).toLocaleString('es-AR', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : new Date(selectedEvent.start.date).toLocaleDateString('es-AR', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                    </p>
                                    {selectedEvent.end?.dateTime && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Hasta: {new Date(selectedEvent.end.dateTime).toLocaleTimeString('es-AR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Descripción */}
                            {selectedEvent.description && (
                                <div className="border-t border-gray-100 pt-6">
                                    <p className="text-sm font-medium text-gray-500 mb-2">Descripción</p>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
                                </div>
                            )}

                            {/* Ubicación */}
                            {selectedEvent.location && (
                                <div className="flex items-start gap-4 border-t border-gray-100 pt-6">
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <MapPin size={24} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Ubicación</p>
                                        <p className="text-lg text-gray-900">{selectedEvent.location}</p>
                                    </div>
                                </div>
                            )}

                            {/* Organizador */}
                            {selectedEvent.organizer && (
                                <div className="flex items-start gap-4 border-t border-gray-100 pt-6">
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <User size={24} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Organizador</p>
                                        <p className="text-lg text-gray-900">{selectedEvent.organizer.email}</p>
                                    </div>
                                </div>
                            )}

                            {/* Asistentes */}
                            {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                                <div className="border-t border-gray-100 pt-6">
                                    <p className="text-sm font-medium text-gray-500 mb-3">Asistentes ({selectedEvent.attendees.length})</p>
                                    <div className="space-y-2">
                                        {selectedEvent.attendees.map((attendee, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User size={16} className="text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{attendee.displayName || attendee.email}</p>
                                                    {attendee.displayName && (
                                                        <p className="text-xs text-gray-500">{attendee.email}</p>
                                                    )}
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    attendee.responseStatus === 'accepted' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : attendee.responseStatus === 'declined'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {attendee.responseStatus === 'accepted' ? 'Aceptó' : 
                                                     attendee.responseStatus === 'declined' ? 'Rechazó' : 'Pendiente'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer del modal */}
                        <div className="px-8 py-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                            <button
                                onClick={closeEventModal}
                                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

