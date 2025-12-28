'use client';

import { useState, useEffect, useRef } from 'react';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import Services from '@/components/Services';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(true);
  const prevScrollY = useRef(0);

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();

    const handleScroll = () => {
      const current = window.scrollY;
      const isScrollingUp = current < prevScrollY.current;
      setScrollY(current);
      setShowWhatsApp(isScrollingUp || current < 20);
      prevScrollY.current = current;
    };

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // En móvil, el logo se traslada INMEDIATAMENTE (10px de scroll)
  // En desktop, el logo se traslada a los 50px
  const scrollThreshold = isMobile ? 10 : 50;
  const isLogoInHeader = scrollY > scrollThreshold;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Innovative Floating Header */}
      <Header isLogoInHeader={isLogoInHeader} />
      
      {/* Main Content - Perfectly Centered Layout with Mobile Padding */}
      <div className="relative pt-0 md:pt-0">
        <Hero isLogoInHeader={isLogoInHeader} />
        <Services />
        <HowItWorks />
        <Pricing />
        <Contact />
        <Footer />
      </div>

      <a
        href="https://wa.me/5493878256162?text=Hola%21%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20de%20FroIT"
        aria-label="Contactar por WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full bg-emerald-500 px-4 py-3 text-white shadow-lg shadow-emerald-600/30 transition-all duration-200 hover:scale-105 hover:shadow-emerald-600/50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-500 ${showWhatsApp ? 'opacity-100 translate-y-0' : 'pointer-events-none translate-y-3 opacity-0'}`}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.38 0 0 5.23 0 11.67c0 2.06.54 4.08 1.58 5.86L.06 24l6.62-1.93a12.1 12.1 0 0 0 5.32 1.2c6.62 0 12-5.23 12-11.67 0-3.12-1.26-6.06-3.48-8.12ZM12 21.2c-1.62 0-3.2-.44-4.58-1.26l-.33-.2-3.93 1.14 1.14-3.68-.22-.38A9.32 9.32 0 0 1 2 11.66C2 6.74 6.36 2.74 12 2.74c2.56 0 4.96.96 6.78 2.72a8.81 8.81 0 0 1 2.79 6.2c0 4.94-4.36 9.54-9.57 9.54Zm5.42-6.72-.67-.34c-.36-.18-1.54-.76-1.78-.84-.24-.08-.42-.12-.6.12-.18.24-.68.84-.83 1.02-.16.18-.3.2-.66.06-.36-.14-1.48-.54-2.82-1.72-1.04-.9-1.76-2-1.96-2.34-.2-.34-.02-.52.12-.7.12-.14.26-.34.4-.5.14-.16.18-.28.28-.46.1-.18.06-.34-.02-.48-.08-.14-.6-1.44-.82-1.98-.22-.54-.44-.46-.6-.46h-.52c-.18 0-.48.06-.74.34-.26.28-.96.94-.96 2.28 0 1.34.98 2.64 1.12 2.82.14.18 1.92 3.06 4.66 4.28.65.28 1.16.44 1.56.56.66.2 1.26.18 1.74.12.54-.08 1.54-.62 1.76-1.22.22-.6.22-1.1.16-1.22-.06-.12-.24-.18-.5-.3Z" />
          </svg>
        </span>
        <span className="hidden text-sm font-semibold md:inline">Escríbenos</span>
      </a>
    </main>
  );
}
