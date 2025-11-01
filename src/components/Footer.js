'use client';

import { motion } from 'framer-motion';
import { 
  Bot, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Instagram,
  ArrowUp,
  MessageCircle
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/froit_ai',
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/company/froit',
      color: 'hover:text-blue-600'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: 'https://youtube.com/froit',
      color: 'hover:text-red-500'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/froit_ai',
      color: 'hover:text-pink-500'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>

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
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">FroIT</span>
            </div>
            
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto px-4">
              Transformamos la atención al cliente con inteligencia artificial avanzada. 
              Agente IA de WhatsApp + CRM personalizado + microservicios potentes para tu negocio.
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