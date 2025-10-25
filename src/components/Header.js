'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import MobileMenu from './MobileMenu';
import AnimatedFroitLogo from './AnimatedFroitLogo';

const Header = ({ isLogoInHeader = false }) => {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Mobile Menu Component */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

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
              {/* Logo que aparece en el header desktop - Fixed, siempre visible */}
              <AnimatePresence mode="wait">
                {isLogoInHeader && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.2,
                      }
                    }}
                    exit={{ 
                      opacity: 0,
                      scale: 0.8,
                      transition: {
                        duration: 0.2,
                      }
                    }}
                    className="flex-shrink-0"
                  >
                    <AnimatedFroitLogo className="w-[70px] h-auto" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider when logo is present - Animación suave */}
              <AnimatePresence mode="wait">
                {isLogoInHeader && (
                  <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scaleX: 1,
                      transition: {
                        duration: 0.3, 
                        delay: 0.2,
                        ease: [0.4, 0, 0.2, 1]
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scaleX: 0,
                      transition: {
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1]
                      }
                    }}
                    className="w-px h-6 bg-slate-300 dark:bg-slate-600"
                  />
                )}
              </AnimatePresence>

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

      {/* Modern Mobile Header - Top Fixed */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="md:hidden fixed top-0 left-0 right-0 z-50"
      >
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-transparent blur-xl" />
          
          {/* Header container */}
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(true)}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-200 shadow-md"
              >
                <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />
              </motion.button>

              {/* Logo que aparece en el header móvil - Fixed, siempre visible */}
              <AnimatePresence mode="wait">
                {isLogoInHeader ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.2,
                      }
                    }}
                    exit={{ 
                      opacity: 0,
                      scale: 0.8,
                      transition: {
                        duration: 0.2,
                      }
                    }}
                  >
                    <AnimatedFroitLogo className="w-[60px] h-auto" />
                  </motion.div>
                ) : (
                  <div className="w-[60px] h-[22px]" />
                )}
              </AnimatePresence>

              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToSection('contact')}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
              >
                Demo
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Header;