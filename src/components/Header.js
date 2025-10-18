'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'how-it-works', 'stats', 'testimonials', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      setActiveSection(current || '');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'features', label: 'Características' },
    { id: 'how-it-works', label: 'Cómo Funciona' },
    { id: 'stats', label: 'Resultados' },
    { id: 'contact', label: 'Contacto' },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Header - Desktop */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-2xl rounded-full" />
          
          {/* Main container - Centered content */}
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-full shadow-lg px-3.5 py-1.5">
            <div className="flex items-center justify-center gap-4">
              {/* Logo - More compact */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
                  FROIT
                </span>
              </motion.button>

              {/* Divider - Shorter */}
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />

              {/* Navigation - More compact and centered */}
              <nav className="flex items-center justify-center gap-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activePill"
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className={`relative z-10 transition-colors ${
                        isActive 
                          ? 'text-white' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}>
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Divider - Shorter */}
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />

              {/* CTA Button - More compact */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="px-3.5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs rounded-full transition-all duration-200 shadow-md whitespace-nowrap"
              >
                Comenzar
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Floating Bottom Navigation - Mobile */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md"
      >
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl rounded-full" />
          
          {/* Navigation container */}
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-full shadow-xl px-3 py-2.5">
            <div className="flex items-center justify-between">
              {/* Logo for mobile */}
              <motion.button
                onClick={scrollToTop}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </motion.button>

              {/* Navigation items */}
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    whileTap={{ scale: 0.9 }}
                    className="relative px-3 py-1.5 rounded-full"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeMobilePill"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`relative z-10 text-xs font-semibold transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {item.label.split(' ')[0]}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Header;