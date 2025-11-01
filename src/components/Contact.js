'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Calendar, MessageCircle, X } from 'lucide-react';

const Contact = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white dark:bg-gray-900 relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header - Más minimalista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Hablemos
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Elige cómo prefieres contactarnos
          </p>
        </motion.div>

        {/* Contact Options - Grid Simple */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Opción 1: Agendar Reunión */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white transition-all duration-300 hover:shadow-xl text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold">Agendar Reunión</h3>
                  </div>
                  <p className="text-sm sm:text-base text-white/90">
                    Programa una demo personalizada con nuestro equipo
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: showCalendar ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4"
                >
                  {showCalendar ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </motion.div>
              </div>
            </button>

            {/* Calendario debajo del botón */}
            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden mt-4"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-4">
                    <iframe 
                      src="https://zcal.co/i/M4Qr-nrK?embed=1&embedType=iframe" 
                      loading="lazy" 
                      className="w-full rounded-lg"
                      style={{ border: 'none', minHeight: '500px', height: '700px' }}
                      id="zcal-invite" 
                      scrolling="no"
                      title="Agendar reunión"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Opción 2: WhatsApp */}
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            href="https://wa.me/5493878256162?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20FroIT"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">Chat por WhatsApp</h3>
                </div>
                <p className="text-sm sm:text-base text-white/90">
                  Respuesta inmediata en tu app favorita
                </p>
              </div>
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Contact;