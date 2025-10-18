'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, MessageCircle, Bot, ChevronDown, Play } from 'lucide-react';
import { useRef } from 'react';

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <section ref={ref} className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 overflow-hidden">
      {/* Modern Background Effects */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        {/* AI-themed floating orbs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        
        {/* Tech grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tech-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tech-grid)" />
          </svg>
        </div>
        
        {/* Animated particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.2, 0.6, 0.2],
              y: [-15, 15, -15],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Content Container - Perfectly Centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto py-16 sm:py-20">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center space-y-6 sm:space-y-8"
          >
            {/* Startup Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center justify-center"
            >
              <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-400/40 rounded-full text-blue-200 text-sm font-semibold backdrop-blur-md shadow-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <Sparkles className="w-4 h-4" />
                <span>IA Revolucionaria para WhatsApp</span>
                <span className="px-2.5 py-0.5 bg-blue-500/50 rounded-full text-xs font-bold">BETA</span>
              </div>
            </motion.div>

            {/* Modern Title - Perfectly Centered */}
            <motion.div variants={itemVariants} className="w-full max-w-5xl mx-auto">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
                <span className="block text-white mb-3">Automatización</span>
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Inteligente
                </span>
                <span className="block text-white mt-3">para WhatsApp</span>
              </h1>
            </motion.div>

            {/* Value Proposition - Centered */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-4"
            >
              La primera plataforma de{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-semibold">
                IA conversacional
              </span>{' '}
              que transforma tu WhatsApp Business en un agente de ventas autónomo 24/7
            </motion.p>

            {/* Key Metrics - Responsive Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mx-auto px-4"
            >
              {[
                { icon: Zap, metric: "95%", label: "Automatización", color: "text-yellow-400", bg: "bg-yellow-500/10" },
                { icon: MessageCircle, metric: "24/7", label: "Disponible", color: "text-green-400", bg: "bg-green-500/10" },
                { icon: Bot, metric: "500+", label: "Empresas", color: "text-blue-400", bg: "bg-blue-500/10" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className={`flex items-center justify-center gap-3 p-5 ${item.bg} backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300`}
                >
                  <div className="flex items-center justify-center p-2.5 bg-white/10 rounded-xl">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white leading-none">{item.metric}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons - With Proper Padding */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mx-auto px-4"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.6)"
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center shadow-2xl w-full sm:w-auto sm:min-w-[280px]"
              >
                <span className="mr-2">Comenzar Demo Gratis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/30 hover:border-white/50 text-white/90 hover:text-white rounded-xl font-bold text-lg transition-all duration-300 hover:bg-white/5 backdrop-blur-sm w-full sm:w-auto sm:min-w-[260px]"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <span>Ver en Acción</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center space-y-4 pt-4"
            >
              <p className="text-sm text-gray-400 font-medium">
                Confiado por startups y empresas innovadoras
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-50">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-8 bg-white/10 rounded-lg"></div>
                ))}
              </div>
            </motion.div>

            {/* Scroll Indicator - Improved */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="pt-8"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center text-gray-400 cursor-pointer group"
                onClick={() => {
                  const nextSection = document.querySelector('#features');
                  if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span className="text-sm font-medium mb-2 group-hover:text-white transition-colors">
                  Descubre cómo funciona
                </span>
                <ChevronDown className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;