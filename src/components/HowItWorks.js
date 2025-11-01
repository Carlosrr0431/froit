'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Bot, Settings, BarChart3, Clock, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: MessageCircle,
      title: 'Conecta WhatsApp Business',
      description: 'Vincula tu cuenta de WhatsApp Business mediante nuestra integración con la API oficial de Meta.',
      details: ['Conexión segura mediante API oficial', 'Configuración guiada paso a paso', 'Sin interrumpir operaciones actuales'],
      color: 'from-green-500 to-emerald-600',
      time: '5 min'
    },
    {
      number: 2,
      icon: Bot,
      title: 'Configura el Agente IA',
      description: 'Define las respuestas automáticas y configura el agente IA con la información de tu negocio.',
      details: ['Plantillas predefinidas disponibles', 'Personalización de respuestas inteligentes', 'Configuración de horarios de atención'],
      color: 'from-blue-500 to-cyan-600',
      time: '10 min'
    },
    {
      number: 3,
      icon: Settings,
      title: 'Configura tu CRM',
      description: 'Establece los campos personalizados y flujos de trabajo que necesitas para gestionar tus clientes.',
      details: ['Campos adaptados a tu negocio', 'Automatización de tareas y seguimientos', 'Integración con Google Calendar'],
      color: 'from-purple-500 to-pink-600',
      time: '15 min'
    },
    {
      number: 4,
      icon: BarChart3,
      title: 'Activa Microservicios',
      description: 'Elige y activa los microservicios adicionales que necesites: mensajes masivos, notificaciones o multi-redes.',
      details: ['Activación opcional de microservicios', 'Configuración de campañas y notificaciones', 'Conexión con redes sociales'],
      color: 'from-orange-500 to-red-600',
      time: '10 min'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 dark:from-blue-800/20 dark:to-purple-800/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-r from-green-200/20 to-cyan-200/20 dark:from-green-800/20 dark:to-cyan-800/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Elements */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-blue-400/15 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700 rounded-full text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold mb-6 sm:mb-8 backdrop-blur-sm"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 sm:mr-3 animate-spin" />
            Proceso de Implementación
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 leading-tight px-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            <span className="block text-gray-900 dark:text-white mb-2">Cómo implementar</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              FROIT
            </span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light px-4"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Proceso de configuración en{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">4 pasos</span>{' '}
            para comenzar a potenciar tu negocio con un agente IA de WhatsApp.
          </motion.p>
        </motion.div>

        {/* Enhanced Timeline Steps */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Enhanced Connecting Line - Hidden on mobile, visible on large screens */}
            <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-1 transform -translate-x-1/2">
              <motion.div
                variants={lineVariants}
                className="h-full w-full bg-gradient-to-b from-green-500 via-purple-500 to-orange-500 origin-top rounded-full shadow-lg"
              />
            </div>
            
            {/* Mobile Connecting Line */}
            <div className="lg:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-purple-500 to-orange-500 rounded-full"></div>

            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  variants={stepVariants}
                  className={`relative flex flex-col lg:flex-row items-start lg:items-center mb-16 sm:mb-20 lg:mb-24 last:mb-0 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Enhanced Content Card */}
                  <div className={`w-full lg:w-5/12 ${isEven ? 'lg:pr-8 xl:pr-16' : 'lg:pl-8 xl:pl-16'} mb-8 lg:mb-0 ${!isEven ? 'lg:order-3' : ''}`}>
                    <motion.div
                      whileHover={{ scale: 1.01, y: -3 }}
                      className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ml-16 lg:ml-0"
                    >
                      {/* Card Background Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-3 rounded-2xl sm:rounded-3xl`} />
                      
                      {/* Time Badge */}
                      <div className={`inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r ${step.color} rounded-full text-white text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-md`} style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {step.time}
                      </div>

                      <div className="flex items-start mb-4 sm:mb-6">
                        <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${step.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-lg sm:text-2xl mr-4 sm:mr-6 shadow-md`} style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                          {step.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                            {step.title}
                          </h3>
                          <div className={`w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r ${step.color} rounded-full`} />
                        </div>
                      </div>
                      
                      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed font-light" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                        {step.description}
                      </p>

                      <div className="grid grid-cols-1 gap-2 sm:gap-3">
                        {step.details.map((detail, detailIndex) => (
                          <motion.div
                            key={detailIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: detailIndex * 0.1 }}
                            className="flex items-center p-2 sm:p-3 bg-gray-50/70 dark:bg-gray-800/70 rounded-lg sm:rounded-xl backdrop-blur-sm"
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium leading-tight" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>{detail}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Enhanced Center Icon */}
                  <div className={`absolute lg:relative left-0 lg:left-auto lg:w-2/12 flex justify-center mb-0 lg:mb-0 top-8 lg:top-auto ${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="relative">
                      {/* Main Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 3 }}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${step.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg z-10`}
                      >
                        <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                      </motion.div>
                      
                      {/* Pulsing Ring */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-xl sm:rounded-2xl animate-ping opacity-15`} />
                      
                      {/* Orbiting Dots - Hidden on mobile */}
                      <div className="hidden lg:block absolute inset-0">
                        {[0, 120, 240].map((rotation, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-full h-full"
                            style={{ rotate: rotation }}
                            animate={{ rotate: rotation + 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          >
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r ${step.color} rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2`} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className={`hidden lg:block lg:w-5/12 ${!isEven ? 'lg:order-1' : ''}`} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Enhanced Process Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 sm:mt-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border border-gray-200/50 dark:border-gray-700/50 max-w-5xl mx-auto"
        >
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Flujo de Automatización
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
            {[
              { 
                icon: MessageCircle, 
                title: "Mensaje entrante", 
                description: "Cliente contacta por WhatsApp", 
                color: "bg-green-500",
                step: "01",
                fontStyle: { fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }
              },
              { 
                icon: Bot, 
                title: "Agente IA analiza", 
                description: "Sistema procesa el mensaje", 
                color: "bg-blue-500",
                step: "02",
                fontStyle: { fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }
              },
              { 
                icon: Settings, 
                title: "Acción automática", 
                description: "Respuesta o registro en CRM", 
                color: "bg-purple-500",
                step: "03"
              },
              { 
                icon: BarChart3, 
                title: "Registro y análisis", 
                description: "Información almacenada y procesada", 
                color: "bg-orange-500",
                step: "04"
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="relative text-center p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl sm:rounded-2xl hover:shadow-md transition-all duration-300"
                >
                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                    {item.step}
                  </div>
                  
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}>
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                    {item.description}
                  </p>
                  
                  {/* Connection Line - Hidden on last item and mobile */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform -translate-y-1/2" />
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Enhanced CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Comienza en minutos
            </h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Proceso guiado de configuración sin requisitos técnicos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
              >
                Solicitar Acceso
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
              >
                Consultar Información
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;