'use client';

import { motion } from 'framer-motion';
import { Bot, MessageSquare, Calendar, Send, Bell, Share2, Sparkles, Zap, Target, ArrowRight } from 'lucide-react';

const Services = () => {
  const mainServices = [
    {
      id: 'automatizaciones-ia',
      title: 'Automatizaciones con IA',
      subtitle: 'Ahorra Tiempo y Recursos',
      description: 'Automatiza todo tipo de necesidades en tu negocio para ahorrar tiempo y recursos valiosos.',
      benefits: [
        'Automatiza tareas repetitivas del día a día',
        'Reduce costos operativos significativamente',
        'Libera tiempo para enfocarte en crecer'
      ],
      icon: Zap,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      accentColor: 'orange'
    },
    {
      id: 'whatsapp-ia',
      title: 'WhatsApp IA con RAG',
      subtitle: 'Sistema Inteligente de Respuestas',
      description: 'Sistema inteligente que responde automáticamente con información actualizada de tu negocio usando Retrieval-Augmented Generation.',
      benefits: [
        'Respuestas contextuales y personalizadas 24/7',
        'Aprende de tu base de conocimientos',
        'Captura y califica leads automáticamente'
      ],
      icon: Bot,
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      accentColor: 'blue'
    },
    {
      id: 'crm',
      title: 'CRM Conversacional',
      subtitle: 'Gestión Completa de Clientes',
      description: 'Seguimiento completo de consultas y estados de cada cliente integrado con tu flujo de trabajo.',
      benefits: [
        'Seguimiento de conversaciones en tiempo real',
        'Estados personalizables del proceso de ventas',
        'Integración con Google Calendar para agendar'
      ],
      icon: MessageSquare,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      accentColor: 'green'
    }
  ];

  const microservices = [
    {
      id: 'bulk',
      title: 'Mensajes Masivos',
      description: 'Envía campañas programadas a todos tus contactos',
      icon: Send,
      color: 'from-violet-500 to-purple-500',
      price: '+$8/mes'
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Alertas automáticas personalizadas por WhatsApp',
      icon: Bell,
      color: 'from-orange-500 to-red-500',
      price: '+$5/mes'
    },
    {
      id: 'social',
      title: 'Multi-Redes',
      description: 'Publica en todas tus redes desde un solo lugar',
      icon: Share2,
      color: 'from-cyan-500 to-blue-500',
      price: '+$10/mes'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC0yaDJ2Mmgtdi0yem0wLTJ2LTJoMnYyaC0yem0tMiAwdi0yaDJ2Mmgtdi0yem0tMiAwaC0ydjJoMnYtMnptMCAydjJoLTJ2LTJoMnptMCAyaDJ2Mmgtdi0yem0yIDB2Mmgydi0yaC0yem0wLTJoMnYyaC0ydi0yem0yLTJoMnYyaC0ydi0yem0wIDJ2Mmgydi0yaC0yem0tMi0ydjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Soluciones Completas
            </span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            <span className="text-gray-900 dark:text-white">Todo lo que tu negocio necesita</span>
            <br />
            <span className="gradient-text">con un agente IA de WhatsApp</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Agente IA inteligente + CRM personalizado + microservicios potentes,
            <br className="hidden md:block" />
            diseñados específicamente para hacer crecer tu negocio
          </p>
        </motion.div>

        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-7xl mx-auto px-4">
          {mainServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className={`text-sm font-semibold text-${service.accentColor}-600 dark:text-${service.accentColor}-400 mb-4`}>
                      {service.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-3">
                      {service.benefits.map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + idx * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                            <Zap className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Learn More Link */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                      <button 
                        onClick={() => {
                          const contactSection = document.getElementById('contact');
                          if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all duration-300"
                      >
                        Explorar más
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Integration Flow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 border border-gray-200 dark:border-gray-600">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Integración Perfecta
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Todos los servicios trabajan juntos para potenciar tu negocio
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-md"
              >
                <Bot className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white">IA + RAG</span>
              </motion.div>

              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-md"
              >
                <MessageSquare className="w-6 h-6 text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">CRM</span>
              </motion.div>

              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-md"
              >
                <Target className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Automatización</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Microservices */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Microservicios Potentes
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Funcionalidades adicionales para llevar tu comunicación al siguiente nivel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {microservices.map((micro, index) => {
              const Icon = micro.icon;
              return (
                <motion.div
                  key={micro.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Gradient accent on hover */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${micro.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                    
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${micro.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {micro.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {micro.description}
                    </p>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {micro.price}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Descubre cómo funciona todo junto
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
