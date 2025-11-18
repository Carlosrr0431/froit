'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, Sparkles, Zap, Shield, Share2, Plus, Minus } from 'lucide-react';

const Pricing = () => {
  const [automationCount, setAutomationCount] = useState(0);
  
  const basePlan = {
    name: "Plan Completo",
    price: 45,
    description: "Todo lo que necesitas para automatizar y hacer crecer tu negocio",
    includes: [
      {
        title: "WhatsApp IA con RAG",
        detail: "Sistema inteligente que responde automáticamente con información actualizada de tu negocio"
      },
      {
        title: "CRM Conversacional",
        detail: "Seguimiento completo de consultas y estados de cada cliente"
      },
      {
        title: "Automatizaciones",
        detail: "Automatiza cualquier proceso de tu negocio",
        isAutomation: true
      }
    ]
  };

  const microservices = [
    {
      id: 'bulk',
      name: 'Mensajes Masivos',
      description: 'Envía campañas programadas a todos tus contactos',
      icon: Zap,
      price: 8
    },
    {
      id: 'notifications',
      name: 'Notificaciones',
      description: 'Alertas automáticas personalizadas por WhatsApp',
      icon: Shield,
      price: 5
    },
    {
      id: 'social',
      name: 'Multi-Redes',
      description: 'Publica en todas tus redes desde un solo lugar',
      icon: Share2,
      price: 10
    }
  ];

  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, i]);
  };

  const incrementAutomations = () => {
    setAutomationCount(prev => prev + 1);
  };

  const decrementAutomations = () => {
    setAutomationCount(prev => Math.max(0, prev - 1));
  };

  const automationPrice = automationCount * 15;

  const total = basePlan.price + automationPrice + selected.reduce((sum, id) => {
    return sum + (microservices.find(s => s.id === id)?.price || 0);
  }, 0);

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              <span className="text-gray-900 dark:text-white">Un plan </span>
              <span className="gradient-text">simple y claro</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              Incluye todo lo esencial + microservicios opcionales
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left: Main Plan Card */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white h-full shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">{basePlan.name}</h3>
                    <p className="text-white/90 text-sm sm:text-base">{basePlan.description}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 text-center sm:text-right flex-shrink-0">
                    <div className="text-3xl sm:text-4xl font-bold">${total}</div>
                    <div className="text-white/90 text-xs sm:text-sm">por mes</div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6">
                  {basePlan.includes.map((item, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                      {!item.isAutomation ? (
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-base sm:text-lg mb-1">{item.title}</div>
                            <div className="text-white/80 text-xs sm:text-sm leading-relaxed">{item.detail}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-base sm:text-lg mb-1">{item.title}</div>
                              <div className="text-white/80 text-xs sm:text-sm leading-relaxed">{item.detail}</div>
                            </div>
                          </div>
                          
                          {/* Contador de automatizaciones - versión móvil mejorada */}
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="text-white/90 text-xs font-medium mb-2 text-center sm:text-left">
                              Cantidad seleccionada
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    decrementAutomations();
                                  }}
                                  className="w-8 h-8 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-md flex items-center justify-center transition-colors touch-manipulation"
                                  type="button"
                                >
                                  <Minus className="w-4 h-4" />
                                </motion.button>
                                <span className="w-12 text-center font-bold text-lg">{automationCount}</span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    incrementAutomations();
                                  }}
                                  className="w-8 h-8 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-md flex items-center justify-center transition-colors touch-manipulation"
                                  type="button"
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                              </div>
                              <div className="text-white font-bold text-base bg-white/20 px-4 py-2 rounded-md">
                                ${automationPrice}/mes
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Selected Microservices */}
                  {selected.length > 0 && (
                    <div className="border-t border-white/20 pt-4 mt-4">
                      <div className="text-sm font-semibold mb-3 text-white/90">Microservicios agregados:</div>
                      <div className="flex flex-wrap gap-2">
                        {selected.map(id => {
                          const service = microservices.find(s => s.id === id);
                          return (
                            <div key={id} className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-300" />
                              <span className="font-semibold">{service.name}</span>
                              <span className="text-sm opacity-80">+${service.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full bg-white text-purple-600 hover:bg-gray-50 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Comenzar Ahora
                </button>
            
              </motion.div>
            </div>

            {/* Right: Microservices */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Microservicios
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-xs sm:text-sm">
                  Agrega funcionalidades extra
                </p>
                
                <div className="space-y-3 sm:space-y-4">
                  {microservices.map((service) => {
                    const Icon = service.icon;
                    const isSelected = selected.includes(service.id);

                    return (
                      <motion.button
                        key={service.id}
                        onClick={() => toggle(service.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all relative ${
                          isSelected
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                          </div>
                        )}
                        
                        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className={`p-1.5 sm:p-2 rounded-lg ${
                            isSelected ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30'
                          }`}>
                            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                              isSelected ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-bold text-base sm:text-lg mb-1 ${
                              isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}>
                              {service.name}
                            </div>
                            <div className={`text-xs sm:text-sm leading-tight ${
                              isSelected ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {service.description}
                            </div>
                          </div>
                        </div>
                        
                        <div className={`text-xl sm:text-2xl font-bold ${
                          isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}>
                          +${service.price}/mes
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
