'use client';

import { motion } from 'framer-motion';
import {
  Facebook,
  Instagram
} from 'lucide-react';
import AnimatedFroitLogo from './AnimatedFroitLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Características', href: '#features' },
      { name: 'Cómo Funciona', href: '#how-it-works' },
      { name: 'Integraciones', href: '#integrations' },
      { name: 'API', href: '#api' },
      { name: 'Precios', href: '#pricing' }
    ],
    company: [
      { name: 'Sobre Nosotros', href: '/about' },
      { name: 'Equipo', href: '/team' },
      { name: 'Carreras', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Prensa', href: '/press' }
    ],
    resources: [
      { name: 'Documentación', href: '/docs' },
      { name: 'Tutoriales', href: '/tutorials' },
      { name: 'Casos de Estudio', href: '/case-studies' },
      { name: 'Webinars', href: '/webinars' },
      { name: 'Centro de Ayuda', href: '/help' }
    ],
    legal: [
      { name: 'Privacidad', href: '/privacy' },
      { name: 'Términos de Servicio', href: '/terms' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
      { name: 'Seguridad', href: '/security' }
    ]
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://www.facebook.com/share/17LHmPz3Ne/',
      color: 'hover:text-blue-500'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/froit.ia?igsh=bXBzZm05Z2R2a3J5',
      color: 'hover:text-pink-500'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
              <AnimatedFroitLogo isStatic className="w-24 sm:w-28 h-auto drop-shadow-lg" />
        
            </div>
            
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto px-4">
              Transformamos la atención al cliente con inteligencia artificial avanzada. 
              Agente IA de WhatsApp + CRM personalizado + Automatizaciones que tu negocio necesita.
            </p>

            {/* Contact Info */}


            {/* Social Links */}
            <div className="flex items-center justify-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors p-2 hover:bg-gray-800 rounded-lg`}
                  >
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="flex items-center mb-4 md:mb-0">
            <p className="text-gray-400">
              © {currentYear} FroIT. Todos los derechos reservados.
            </p>
          </div>

         
       
        </motion.div>

        {/* Final CTA Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 sm:p-6 text-center">
            <h4 className="text-lg sm:text-xl font-bold mb-2">
              ¿Listo para potenciar tu WhatsApp con un agente IA?
            </h4>
            <p className="mb-4 opacity-90 text-sm sm:text-base">
              Únete y transforma completamente tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-white text-blue-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Comenzar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;