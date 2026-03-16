'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // Light mode por defecto
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Forzar light mode - limpiar preferencia anterior si era dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      localStorage.setItem('theme', 'light');
    }
    // Mantener light mode por defecto
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Aplicar el tema al documento
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    
    // Guardar la preferencia
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Evitar flash de contenido sin estilo
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};