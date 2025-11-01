'use client';

import { motion } from 'framer-motion';
import { Phone, Video, MoreVertical, Send, Paperclip, Smile, ChevronLeft, Users, Calendar, TrendingUp, FileText, Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import RankingSection from './sections/RankingSection';
import CalendarSection from './sections/CalendarSection';
import ClientsSection from './sections/ClientsSection';
import PropertiesSection from './sections/PropertiesSection';
import PipelineSection from './sections/PipelineSection';
import StagePipeline from './StagePipeline';
import { getBusinessConfig, getCurrentBusinessType } from '../utils/businessConfig';

const ChatArea = ({ selectedContact, onBack, activeSection, onToggleContactInfo }) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [businessConfig, setBusinessConfig] = useState(null);

  useEffect(() => {
    const type = getCurrentBusinessType();
    setBusinessConfig(getBusinessConfig(type));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedContact?.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [messageInput]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      setMessageInput('');
    }
  };

  // Render different content based on active section
  const renderSectionContent = () => {
    switch(activeSection) {
      case 'clients':
        return <ClientsSection />;
      
      case 'pipeline':
        return <PipelineSection />;
      
      case 'calendar':
        return <CalendarSection />;
      
      case 'ranking':
        return <RankingSection />;
      
      case 'properties':
        return <PropertiesSection />;
      
      default:
        // Chat section
        if (!selectedContact) {
          return (
            <div className="flex-1 hidden md:flex items-center justify-center bg-white">
              <div className="text-center px-4">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Phone className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-sm md:text-base text-slate-600">
                  Elige un contacto para comenzar a chatear
                </p>
              </div>
            </div>
          );
        }

        return (
          <>
            {/* Chat Header */}
            <div className="flex-shrink-0 px-3 py-3 md:p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <button
                  onClick={onBack}
                  className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative flex-shrink-0">
                  <div
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold text-sm"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${selectedContact.color}dd, ${selectedContact.color})`
                    }}
                  >
                    {selectedContact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {selectedContact.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 text-sm md:text-base truncate">
                    {selectedContact.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    {selectedContact.online ? 'En línea' : 'Desconectado'}
                  </p>
                  {businessConfig && selectedContact.stage && (
                    <div className="mt-1">
                      <StagePipeline 
                        stages={businessConfig.stages}
                        currentStageId={selectedContact.stage}
                        compact={true}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Video className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                </button>
                <button 
                  onClick={onToggleContactInfo}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Ver información del contacto"
                >
                  <Info className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 md:p-4 space-y-3 md:space-y-4 bg-slate-50">
              {selectedContact.messages?.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] md:max-w-md ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                        : 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    } rounded-2xl px-3 py-2 md:px-4 md:py-2.5`}
                  >
                    <p className="text-sm md:text-base leading-relaxed break-words">{message.text}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.sender === 'user'
                          ? 'text-blue-100'
                          : 'text-slate-500'
                      }`}
                    >
                      {message.time}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex-shrink-0 p-3 md:p-4 border-t border-slate-200 bg-white safe-area-bottom">
              <div className="flex items-end gap-2">
                <button className="hidden sm:flex p-2 md:p-2.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
                  <Paperclip className="w-5 h-5 text-slate-600" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Escribe un mensaje..."
                    rows="1"
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-slate-100 rounded-xl md:rounded-2xl text-sm md:text-base outline-none resize-none min-h-[44px] max-h-32 overflow-y-auto"
                    style={{ 
                      height: 'auto',
                      maxHeight: '128px'
                    }}
                  />
                </div>
                <button className="hidden sm:flex p-2 md:p-2.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
                  <Smile className="w-5 h-5 text-slate-600" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="p-2.5 md:p-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg md:rounded-xl transition-colors flex-shrink-0 active:scale-95"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {renderSectionContent()}
    </div>
  );
};

export default ChatArea;
