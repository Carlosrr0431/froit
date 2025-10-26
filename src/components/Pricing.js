'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, Sparkles, Zap, Shield, Share2 } from 'lucide-react';

const Pricing = () => {
  const basePlan = {
    name: "Plan Completo",
    price: 499,
    description: "Todo lo que necesitas para automatizar y gestionar tu comunicación por WhatsApp",
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
        title: "Google Calendar",
        detail: "Agenda reuniones directamente desde WhatsApp"
      }
    ]
  };

  const microservices = [
    {
      id: 'bulk',
      name: 'Mensajes Masivos',
      description: 'Envía campañas programadas a todos tus contactos',
      icon: Zap,
      price: 79
    },
    {
      id: 'notifications',
      name: 'Notificaciones',
      description: 'Alertas automáticas personalizadas por WhatsApp',
      icon: Shield,
      price: 69
    },
    {
      id: 'social',
      name: 'Multi-Redes',
      description: 'Publica en todas tus redes desde un solo lugar',
      icon: Share2,
      price: 89
    }
  ];

  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const total = basePlan.price + selected.reduce((sum, id) => {
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              <span className="text-gray-900 dark:text-white">Un plan </span>
              <span className="gradient-text">simple y claro</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Incluye todo lo esencial + microservicios opcionales
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Main Plan Card */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white h-full shadow-2xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{basePlan.name}</h3>
                    <p className="text-white/90 text-sm">{basePlan.description}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-right">
                    <div className="text-4xl font-bold">${total}</div>
                    <div className="text-white/90 text-sm">por mes</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {basePlan.includes.map((item, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-lg mb-1">{item.title}</div>
                          <div className="text-white/80 text-sm">{item.detail}</div>
                        </div>
                      </div>
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
                  className="w-full bg-white text-purple-600 hover:bg-gray-50 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Comenzar Ahora
                </button>
                <p className="text-center text-white/80 text-sm mt-3">
                  Prueba gratis por 14 días • Sin tarjeta de crédito
                </p>
              </motion.div>
            </div>

            {/* Right: Microservices */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Microservicios
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Agrega funcionalidades extra
                </p>
                
                <div className="space-y-4">
                  {microservices.map((service) => {
                    const Icon = service.icon;
                    const isSelected = selected.includes(service.id);

                    return (
                      <motion.button
                        key={service.id}
                        onClick={() => toggle(service.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-5 rounded-2xl transition-all relative ${
                          isSelected
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5 text-green-500" />
                          </div>
                        )}
                        
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${
                            isSelected ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              isSelected ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-bold text-lg mb-1 ${
                              isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}>
                              {service.name}
                            </div>
                            <div className={`text-sm ${
                              isSelected ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {service.description}
                            </div>
                          </div>
                        </div>
                        
                        <div className={`text-2xl font-bold ${
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
