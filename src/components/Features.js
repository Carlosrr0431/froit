'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Bot, Zap, MessageCircle, Cpu, Workflow, BarChart3, Shield, Clock, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useRef } from 'react';

const Features = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);

  const features = [
    {
      icon: Bot,
      title: 'Agente IA de WhatsApp',
      description: 'Sistema de respuesta automática mediante inteligencia artificial que atiende mensajes en tiempo real y captura clientes potenciales las 24 horas.',
      color: 'from-blue-500 to-cyan-500',
      benefits: ['Respuestas automáticas 24/7', 'Captura de leads en tiempo real', 'Conversaciones contextuales'],
      category: 'Agente IA'
    },
    {
      icon: Zap,
      title: 'Procesamiento Instantáneo',
      description: 'El agente IA analiza cada mensaje y ejecuta las acciones configuradas sin intervención manual, reduciendo tiempos de respuesta a segundos.',
      color: 'from-yellow-500 to-orange-500',
      benefits: ['Análisis automático de mensajes', 'Ejecución de acciones inmediata', 'Cero intervención manual'],
      category: 'Agente IA'
    },
    {
      icon: MessageCircle,
      title: 'Integración con WhatsApp Business',
      description: 'Conexión directa con la API oficial de WhatsApp Business para garantizar estabilidad y cumplir con las políticas de la plataforma.',
      color: 'from-green-500 to-emerald-500',
      benefits: ['API oficial de WhatsApp', 'Conexión estable', 'Cumplimiento de políticas'],
      category: 'Integración'
    },
    {
      icon: Cpu,
      title: 'CRM Personalizado',
      description: 'Sistema de gestión de relaciones con clientes adaptado a las necesidades específicas de tu negocio, con campos y flujos configurables.',
      color: 'from-purple-500 to-pink-500',
      benefits: ['Configuración según tu negocio', 'Campos personalizables', 'Flujos de trabajo a medida'],
      category: 'CRM'
    },
    {
      icon: Workflow,
      title: 'Integraciones a Medida',
      description: 'Conectamos tu CRM con las herramientas que ya utilizas en tu negocio para sincronizar datos y automatizar procesos entre plataformas.',
      color: 'from-indigo-500 to-blue-500',
      benefits: ['Conexión con tus herramientas', 'Sincronización automática', 'Flujo de datos unificado'],
      category: 'Integración'
    },
    {
      icon: BarChart3,
      title: 'Publicación Centralizada en Redes',
      description: 'Microservicio que permite crear y programar contenido una sola vez para publicarlo automáticamente en todas tus redes sociales.',
      color: 'from-red-500 to-rose-500',
      benefits: ['Publicación en múltiples redes', 'Programación de contenido', 'Gestión desde un solo lugar'],
      category: 'Multi-Redes'
    },
    {
      icon: Shield,
      title: 'Seguridad y Privacidad',
      description: 'Implementación de protocolos de seguridad para proteger la información de tus clientes y cumplir con normativas de protección de datos.',
      color: 'from-gray-500 to-slate-500',
      benefits: ['Datos protegidos', 'Cumplimiento normativo', 'Accesos controlados'],
      category: 'Seguridad'
    },
    {
      icon: Clock,
      title: 'Configuración Rápida',
      description: 'Proceso de implementación guiado para que puedas comenzar a utilizar el sistema en el menor tiempo posible, sin conocimientos técnicos previos.',
      color: 'from-teal-500 to-cyan-500',
      benefits: ['Implementación guiada', 'Sin requisitos técnicos', 'Soporte en configuración'],
      category: 'Implementación'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <section ref={ref} id="features" className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Modern Background Effects */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full filter blur-3xl" />
      </motion.div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="features-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#features-grid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20 lg:mb-24 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700 rounded-full text-blue-700 dark:text-blue-300 text-sm font-bold mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Soluciones Tecnológicas</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            <span className="block text-gray-900 dark:text-white mb-2">Agente IA inteligente</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              para tu negocio
            </span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-light"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Herramientas de inteligencia artificial y microservicios diseñados para{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              optimizar la gestión de clientes y presencia digital
            </span>
          </motion.p>
        </motion.div>

        {/* Modern Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 } 
                }}
                className="group relative h-full"
              >
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 h-full">
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                      {feature.category}
                    </span>
                  </div>
                  
                  {/* Subtle background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-3 transition-opacity duration-300 rounded-2xl`} />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 3, scale: 1.05 }}
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-md relative z-10`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 font-light" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                      {feature.description}
                    </p>

                    {/* Benefits List */}
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, bIndex) => (
                        <li key={bIndex} className="flex items-center text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          <span className="leading-tight">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hover indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute bottom-4 right-4"
                  >
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Modern CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10 text-center">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
              >
                Prueba nuestra demo gratuita
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto font-light leading-relaxed"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
              >
                Configura tu cuenta y comienza a potenciar tu negocio con un agente IA de WhatsApp en minutos
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-2xl min-w-[250px]"
                >
                  Solicitar Demo
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm min-w-[220px]"
                >
                  Consultar Precios
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;