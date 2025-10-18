'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-2 border-gray-200/50 dark:border-blue-500/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
      whileHover={{ 
        scale: 1.1,
        boxShadow: theme === 'dark' 
          ? '0 20px 40px -10px rgba(59, 130, 246, 0.5)' 
          : '0 20px 40px -10px rgba(251, 191, 36, 0.5)'
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative"
        >
          {theme === 'dark' ? (
            <div className="relative">
              <Sun className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />
              {/* Glow effect for sun */}
              <motion.div
                className="absolute inset-0 bg-amber-400/30 rounded-full blur-md"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          ) : (
            <div className="relative">
              <Moon className="w-6 h-6 text-blue-600 group-hover:text-blue-500 transition-colors" />
              {/* Glow effect for moon */}
              <motion.div
                className="absolute inset-0 bg-blue-500/30 rounded-full blur-md"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Sparkle particles on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-current rounded-full"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, (i % 2 ? 1 : -1) * 20],
              y: [0, (i < 2 ? -1 : 1) * 20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;