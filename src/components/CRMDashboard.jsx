'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Users,
  Filter,
  Search,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  X,
  Menu,
  User,
  Star,
  Tag,
  Clock,
  CheckCheck,
  Home,
  Settings,
  Bell,
  TrendingUp,
  FileText,
  LogOut
} from 'lucide-react';

const CRMDashboard = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileContactListOpen, setIsMobileContactListOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chats');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Contactos
  const contacts = [
    {
      id: 1,
      name: 'Nicolás Amarillo',
      phone: '5493875068552',
      lastMessage: 'Hola, Nicolás Amarillo, 🎉 ¡Gracias por inscribirte!...',
      time: '22:47',
      unread: 0,
      avatar: 'NA',
      status: 'Sin etiquetas asignadas',
      stage: 'Contacto inicial',
      messages: [
        {
          id: 1,
          text: 'Hola Nicolás Amarillo, esperamos que este mensaje te encuentre bien. Tras analizar tu postulación, queremos invitarte a una entrevista para seguir conociéndote y contarte más sobre nuestro modelo de negocios. Podés agendar tu turno directamente en este link: https://www.remaxnoa.com.ar/sumate/programar-token?token=3cd02f20-2570-491e-85f2-b591a1a300c2&id=3875068552',
          sender: 'bot',
          timestamp: '07:04 ✓✓'
        },
        {
          id: 2,
          text: 'Hola, Nicolás Amarillo, 🎉 ¡Gracias por inscribirte! Te confirmamos que tu entrevista ha sido agendada de forma presencial para el día 06/11/2025 y hora 15:00.\n\nTe esperamos en nuestras oficinas ubicadas en:\n📍 Pueyrredón 608, Salta Capital\n🕒 Por favor, llegá 5 minutos antes del horario pactado.\n\n¡Estamos entusiasmados por conocerte en persona!',
          sender: 'bot',
          timestamp: '22:47 ✓✓'
        }
      ]
    },
    {
      id: 2,
      name: 'Mauro Espinosa',
      phone: '5493876145059',
      lastMessage: 'Hola Mauro Espinosa 🔥, te escribe el equipo de Ex...',
      time: '20:40',
      unread: 0,
      avatar: 'ME',
      status: 'Sin etiquetas asignadas',
      stage: 'Contacto inicial',
      messages: []
    },
    {
      id: 3,
      name: 'Esteban Ramiro Caliva',
      phone: '5493875530410',
      lastMessage: 'Hola Esteban Ramiro Caliva 🔥, te escribe el equi...',
      time: '18:48',
      unread: 0,
      avatar: 'EC',
      status: 'Sin etiquetas asignadas',
      stage: 'Contacto inicial',
      messages: []
    },
    {
      id: 4,
      name: 'Angela',
      phone: '5493875123456',
      lastMessage: 'Gracias por la información',
      time: '18:37',
      unread: 0,
      avatar: 'A',
      status: 'Cliente activo',
      stage: 'Seguimiento',
      messages: []
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const handleSendMessage = () => {
    if (message.trim() && selectedContact) {
      // Aquí iría la lógica para enviar el mensaje
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="hidden lg:flex w-16 xl:w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
              C
            </div>
            <div className="hidden xl:block">
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Carlos Facundo</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Agente en línea</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="hidden xl:block font-medium">Chats</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Users className="w-5 h-5" />
            <span className="hidden xl:block font-medium">Clientes</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="hidden xl:block font-medium">Calendario</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="hidden xl:block font-medium">Ranking</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="hidden xl:block font-medium">Propiedades</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="hidden xl:block font-medium">Configuración</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="hidden xl:block font-medium">Cerrar sesión</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2 px-2">
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-blue-600 dark:text-blue-400">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Chats</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-slate-600 dark:text-slate-400">
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Clientes</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-slate-600 dark:text-slate-400">
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Agenda</span>
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 text-slate-600 dark:text-slate-400"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">Más</span>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 z-50 flex flex-col"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Carlos Facundo</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Agente en línea</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-2 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Inicio</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Ranking</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Propiedades</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notificaciones</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Configuración</span>
                </button>
              </nav>

              <div className="p-2 border-t border-slate-200 dark:border-slate-800">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Cerrar sesión</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Contact List */}
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        className={`${
          selectedContact && !isMobileContactListOpen ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 lg:w-96 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Conversaciones</h1>
            <button className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>

          {/* Filters - Desktop */}
          <div className="hidden lg:flex items-center gap-2 mt-3">
            <button className="px-3 py-1.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
              Tipo Cliente
            </button>
            <button className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
              Etapa
            </button>
            <button className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
              Etiquetas
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-medium">
            <MessageCircle className="w-4 h-4" />
            <span>Chats</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
            <Users className="w-4 h-4" />
            <span>Clientes</span>
          </button>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <motion.button
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setIsMobileContactListOpen(false);
              }}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              className={`w-full p-4 flex items-start gap-3 border-b border-slate-100 dark:border-slate-800 text-left transition-colors ${
                selectedContact?.id === contact.id
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {contact.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                    {contact.time}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate mb-1">
                  {contact.lastMessage}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {contact.stage}
                  </span>
                </div>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {contact.unread}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className={`${selectedContact ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col bg-white dark:bg-slate-900`}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedContact(null);
                    setIsMobileContactListOpen(true);
                  }}
                  className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg -ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {selectedContact.avatar}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    {selectedContact.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedContact.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden md:block p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
              {selectedContact.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 ${
                      msg.sender === 'bot'
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pb-safe">
              <div className="flex items-end gap-2">
                <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg mb-1">
                  <Paperclip className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Escribe un mensaje..."
                    rows="1"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm max-h-32"
                    style={{ minHeight: '44px' }}
                  />
                </div>
                <button className="hidden md:block p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg mb-1">
                  <Smile className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white mb-1"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Selecciona una conversación
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Elige un contacto de la lista para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Info Sidebar - Desktop Only */}
      {selectedContact && (
        <motion.aside
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          className="hidden xl:flex w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 flex-col"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mb-3">
                {selectedContact.avatar}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {selectedContact.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {selectedContact.phone}
              </p>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30">
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Información del cliente
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Tipo:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedContact.stage}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Estado:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedContact.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Última actividad:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedContact.time}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Ver calendario
                </span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Ver recordatorios
                </span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Star className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Ver KPIs
                </span>
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </div>
  );
};

export default CRMDashboard;
