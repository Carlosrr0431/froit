'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'María González',
      role: 'CEO, TechFlow Solutions',
      company: 'TechFlow Solutions',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'FroIT revolucionó nuestra atención al cliente. Aumentamos las conversiones en un 180% y reducimos el tiempo de respuesta de horas a segundos. Es impresionante cómo la IA maneja conversaciones tan naturales.',
      rating: 5,
      metrics: '+180% conversiones'
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      role: 'Director de Marketing',
      company: 'Digital Boost',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'Implementamos FroIT en 3 días y los resultados fueron inmediatos. Nuestro equipo ahora se enfoca en casos complejos mientras la IA maneja el 85% de las consultas automáticamente.',
      rating: 5,
      metrics: '85% automatización'
    },
    {
      id: 3,
      name: 'Ana Rodríguez',
      role: 'Gerente de Ventas',
      company: 'InnovateCorp',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'La integración con nuestro CRM fue perfecta. Cada lead se registra automáticamente y el seguimiento es impecable. Hemos cerrado más ventas que nunca gracias a la automatización inteligente.',
      rating: 5,
      metrics: '+240% leads calificados'
    },
    {
      id: 4,
      name: 'Roberto Silva',
      role: 'Fundador',
      company: 'StartupHub',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'Como startup, necesitábamos escalar rápido sin contratar más personal. FroIT nos permitió atender 10x más clientes con la misma calidad. ROI increíble.',
      rating: 5,
      metrics: '10x más clientes'
    },
    {
      id: 5,
      name: 'Patricia López',
      role: 'Directora de Operaciones',
      company: 'EcommPlus',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      content: 'En e-commerce, la velocidad de respuesta es crucial. FroIT responde instantáneamente 24/7, y nuestros clientes están más satisfechos que nunca. Las ventas nocturnas se dispararon.',
      rating: 5,
      metrics: '+95% satisfacción'
    },
    {
      id: 6,
      name: 'Diego Herrera',
      role: 'VP Tecnología',
      company: 'CloudTech',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      content: 'La implementación fue sorprendentemente fácil. En menos de una semana teníamos todo funcionando. Los reportes y analytics nos dan insights valiosos sobre nuestros clientes.',
      rating: 5,
      metrics: 'Setup en 5 días'
    }
  ];

  const companies = [
    { name: 'TechFlow', logo: 'https://logo.clearbit.com/techcrunch.com' },
    { name: 'Digital Boost', logo: 'https://logo.clearbit.com/stripe.com' },
    { name: 'InnovateCorp', logo: 'https://logo.clearbit.com/shopify.com' },
    { name: 'StartupHub', logo: 'https://logo.clearbit.com/slack.com' },
    { name: 'EcommPlus', logo: 'https://logo.clearbit.com/zoom.com' },
    { name: 'CloudTech', logo: 'https://logo.clearbit.com/notion.so' }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-semibold mb-4">
            Testimonios Reales
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Empresas que confían</span>
            <br />
            <span className="gradient-text">en FroIT</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubre cómo empresas de todos los tamaños están transformando 
            su atención al cliente y aumentando sus ventas con nuestra plataforma.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-blue-500 opacity-20">
                <Quote className="w-8 h-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {testimonial.content}
              </p>

              {/* Metrics Badge */}
              <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold mb-6">
                {testimonial.metrics}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.role}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Companies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Empresas que ya transformaron su WhatsApp
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 hover:opacity-80 transition-opacity">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-center">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-8 md:h-12 w-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              500+
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Empresas Activas
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              98%
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Tasa de Satisfacción
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              24/7
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Soporte Técnico
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Únete a las empresas exitosas
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Comienza tu transformación digital hoy y experimenta los mismos 
                resultados extraordinarios que nuestros clientes.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
                  Comenzar Prueba Gratuita
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                  Hablar con un Especialista
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;