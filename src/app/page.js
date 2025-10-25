'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Stats from '@/components/Stats';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();

    const handleScroll = () => {
      setScrollY(window.scrollY);
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
        <Features />
        <HowItWorks />
        <Stats />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
