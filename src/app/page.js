import Hero from '@/components/Hero';
import Header from '@/components/Header';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Stats from '@/components/Stats';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Innovative Floating Header */}
      <Header />
      
      {/* Main Content - Perfectly Centered Layout */}
      <div className="relative">
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
