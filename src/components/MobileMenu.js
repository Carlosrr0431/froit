'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Sparkles, TrendingUp, MessageCircle, Mail, DollarSign, Zap } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';

const MobileMenu = ({ isOpen, onClose, activeSection, scrollToSection }) => {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'services', label: 'Servicios', icon: Zap },
    { id: 'how-it-works', label: 'Cómo Funciona', icon: MessageCircle },
    { id: 'pricing', label: 'Precios', icon: DollarSign },
    { id: 'contact', label: 'Contacto', icon: Mail },
  ];

  const handleItemClick = (sectionId) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToSection(sectionId);
    }
    setTimeout(onClose, 300);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const drawerVariants = {
    hidden: { x: '-100%' },
    visible: { 
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    },
    exit: { 
      x: '-100%',
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.2,
        duration: 0.3
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 shadow-2xl z-[101]"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Image 
                    src="/assets/logo-froit.svg" 
                    alt="FroIT Logo" 
                    width={80}
                    height={30}
                    className="h-auto"
                    priority
                  />
                </motion.div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </motion.button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                <div className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id || (item.id === 'home' && !activeSection);
                    
                    return (
                      <motion.button
                        key={item.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={() => handleItemClick(item.id)}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span className="font-medium text-[15px]">{item.label}</span>
                        
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto w-2 h-2 rounded-full bg-white"
                            transition={{ type: "spring", bounce: 0.3 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </nav>

              {/* Footer CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-4 border-t border-slate-200 dark:border-slate-700"
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleItemClick('contact')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Comenzar Ahora</span>
                </motion.button>

                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
                  © 2025 FroIT. Todos los derechos reservados.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
