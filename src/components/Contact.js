'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle, ArrowRight, Calendar, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjBmMGYwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
            Contáctanos
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            <span className="text-gray-900 dark:text-white">¿Listo para</span>
            <br />
            <span className="gradient-text">comenzar?</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Elige cómo prefieres contactarnos y te responderemos lo antes posible
          </p>
        </motion.div>

        {/* Contact Options Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Opción 1: Agendar Reunión */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={() => setShowCalendar(!showCalendar)}
              className="group relative bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl p-8 text-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] overflow-hidden"
            >
              {/* Background Effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">Agendar Reunión</h3>
                <p className="text-white/90 mb-6">
                  Programa una videollamada con nuestro equipo para una demo personalizada
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {showCalendar ? 'Ocultar calendario' : 'Ver disponibilidad'}
                  </span>
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${showCalendar ? 'rotate-90' : 'group-hover:translate-x-2'}`} />
                </div>
              </div>
            </motion.button>

            {/* Opción 2: WhatsApp */}
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              href="https://wa.me/5491234567890?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20FroIT"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-2xl p-8 text-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] overflow-hidden"
            >
              {/* Background Effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">Chat por WhatsApp</h3>
                <p className="text-white/90 mb-6">
                  Contáctanos directamente y recibe respuesta inmediata en tu app favorita
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Iniciar conversación</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </motion.a>
          </div>

          {/* Calendario Expandible */}
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors shadow-lg"
                >
                  <ArrowRight className="w-6 h-6 text-gray-600 dark:text-gray-400 rotate-90" />
                </button>
                
                <div className="w-full flex justify-center bg-transparent">
                  <iframe 
                    src="https://zcal.co/i/M4Qr-nrK?embed=1&embedType=iframe" 
                    loading="lazy" 
                    style={{ border: 'none', minWidth: '320px', minHeight: '544px', height: '801px', width: '100%', maxWidth: '1096px', display: 'block' }}
                    id="zcal-invite" 
                    scrolling="no"
                    title="Agendar reunión"
                  />
                </div>
              </div>
            </motion.div>
          )}


          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400"
          >
       
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Consulta gratuita</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Sin compromiso</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;