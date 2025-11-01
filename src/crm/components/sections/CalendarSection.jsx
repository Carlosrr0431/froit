'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Video, Phone, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const CalendarSection = () => {
  const [currentDate] = useState(new Date(2025, 10, 1)); // November 2025
  const [selectedDate, setSelectedDate] = useState(1);

  const meetings = [
    {
      id: 1,
      title: 'Visita propiedad - Palermo',
      client: 'María González',
      date: '2025-11-01',
      time: '10:00',
      duration: '1h',
      type: 'visit',
      location: 'Av. Santa Fe 3421, Palermo',
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'Reunión virtual - Presentación',
      client: 'Juan Pérez',
      date: '2025-11-01',
      time: '14:30',
      duration: '45min',
      type: 'video',
      location: 'Zoom Meeting',
      color: '#10b981'
    },
    {
      id: 3,
      title: 'Llamada de seguimiento',
      client: 'Ana Martínez',
      date: '2025-11-01',
      time: '16:00',
      duration: '30min',
      type: 'call',
      location: 'Telefónica',
      color: '#f59e0b'
    },
    {
      id: 4,
      title: 'Visita propiedad - Belgrano',
      client: 'Luis Rodríguez',
      date: '2025-11-02',
      time: '11:00',
      duration: '1.5h',
      type: 'visit',
      location: 'Av. Cabildo 2100, Belgrano',
      color: '#8b5cf6'
    },
    {
      id: 5,
      title: 'Firma de contrato',
      client: 'Carla Suárez',
      date: '2025-11-03',
      time: '15:00',
      duration: '2h',
      type: 'visit',
      location: 'Oficina Central',
      color: '#ec4899'
    },
  ];

  const upcomingMeetings = meetings.filter(m => {
    const meetingDate = new Date(m.date);
    return meetingDate >= currentDate;
  }).slice(0, 5);

  const todayMeetings = meetings.filter(m => m.date === '2025-11-01');

  const stats = [
    { label: 'Reuniones hoy', value: todayMeetings.length, color: 'blue' },
    { label: 'Esta semana', value: '8', color: 'green' },
    { label: 'Este mes', value: '24', color: 'purple' },
    { label: 'Completadas', value: '18', color: 'orange' },
  ];

  const getTypeIcon = (type) => {
    const icons = {
      visit: MapPin,
      video: Video,
      call: Phone,
    };
    return icons[type] || Calendar;
  };

  // Simple calendar days
  const daysInMonth = 30;
  const firstDayOfWeek = 4; // Thursday
  const calendarDays = Array.from({ length: daysInMonth + firstDayOfWeek }, (_, i) => {
    if (i < firstDayOfWeek) return null;
    return i - firstDayOfWeek + 1;
  });

  const hasMeeting = (day) => {
    return meetings.some(m => {
      const meetingDay = new Date(m.date).getDate();
      return meetingDay === day;
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Calendario</h1>
            <p className="text-slate-600">Gestiona tus reuniones y visitas</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nueva reunión
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => {
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              green: 'from-green-500 to-green-600',
              purple: 'from-purple-500 to-purple-600',
              orange: 'from-orange-500 to-orange-600',
            };

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                <p className="text-xs md:text-sm text-slate-600 mb-2">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">Noviembre 2025</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="text-center text-xs md:text-sm font-semibold text-slate-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} />;
                }
                const hasEvent = hasMeeting(day);
                const isSelected = day === selectedDate;

                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center text-sm md:text-base font-medium transition-all
                      ${isSelected
                        ? 'bg-blue-600 text-white shadow-lg'
                        : hasEvent
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'text-slate-700 hover:bg-slate-100'
                      }
                    `}
                  >
                    {day}
                    {hasEvent && !isSelected && (
                      <div className="w-1 h-1 bg-blue-600 rounded-full mt-1" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
          >
            <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">Agenda de hoy</h3>
              <p className="text-sm text-slate-600">Viernes, 1 de Noviembre</p>
            </div>

            <div className="p-4 md:p-6 space-y-4 max-h-96 overflow-y-auto">
              {todayMeetings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No hay reuniones programadas</p>
                </div>
              ) : (
                todayMeetings.map((meeting, index) => {
                  const Icon = getTypeIcon(meeting.type);
                  return (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-3">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${meeting.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: meeting.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 mb-1 text-sm md:text-base">
                            {meeting.title}
                          </h4>
                          <div className="space-y-1 text-xs md:text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 md:w-4 md:h-4" />
                              <span>{meeting.client}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 md:w-4 md:h-4" />
                              <span>{meeting.time} • {meeting.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                              <span className="truncate">{meeting.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Upcoming Meetings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
        >
          <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg md:text-xl font-semibold text-slate-900">Próximas reuniones</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingMeetings.map((meeting, index) => {
              const Icon = getTypeIcon(meeting.type);
              const meetingDate = new Date(meeting.date);
              const dateStr = meetingDate.toLocaleDateString('es-ES', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              });

              return (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 md:p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${meeting.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: meeting.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 mb-1 text-sm md:text-base">
                          {meeting.title}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-600">{meeting.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="capitalize">{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{meeting.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalendarSection;
