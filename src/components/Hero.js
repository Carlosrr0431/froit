"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import AnimatedFroitLogo from "./AnimatedFroitLogo";

const Hero = ({ isLogoInHeader = false }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: typeof window !== 'undefined' && window.innerWidth < 640 ? 0.05 : 0.12,
        delayChildren: typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: typeof window !== 'undefined' && window.innerWidth < 640 ? 0.3 : 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] sm:min-h-screen bg-gradient-to-br from-white via-blue-50/80 to-indigo-50/60 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 overflow-hidden flex items-center justify-center transition-colors duration-500"
    >
      {/* Logo en Hero Desktop - z-index bajo para no superponerse */}
      {!isLogoInHeader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="absolute -top-5 left-10 z-10 hidden md:block"
        >
          <AnimatedFroitLogo className="w-[140px] h-auto drop-shadow-lg" />
        </motion.div>
      )}

      {/* Logo en Hero Mobile - z-index bajo, sin fixed */}
      {!isLogoInHeader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="md:hidden absolute top-20 left-1/2 -translate-x-1/2 z-10"
        >
          <AnimatedFroitLogo className="w-[90px] h-auto drop-shadow-lg" />
        </motion.div>
      )}

      {/* Minimal Background Effects */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        {/* Mobile: 2 subtle orbs */}
        <div className="sm:hidden absolute -top-20 -left-20 w-[350px] h-[350px] bg-blue-200/30 rounded-full filter blur-3xl"></div>
        <div className="sm:hidden absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-indigo-200/25 rounded-full filter blur-3xl"></div>

        {/* Desktop: Soft animated orbs */}
        <motion.div
          className="hidden sm:block absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-500/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="hidden sm:block absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-indigo-100/30 dark:bg-indigo-500/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>

      {/* Content Container - Optimized for Mobile */}
      <div className="relative z-20 w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center space-y-4 sm:space-y-5 md:space-y-6 pt-24 sm:pt-16 md:pt-11"
          >
            {/* Title */}
            <motion.div variants={itemVariants} className="w-full">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-semibold leading-[1.08] tracking-[-0.03em] text-slate-900 dark:text-white">
                Agente IA{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Inteligente
                </span>
                <br />
                para{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  WhatsApp
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={itemVariants} className="max-w-xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                CRM personalizado con automatizaciones inteligentes
                para cada área de tu negocio.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center w-full max-w-md mx-auto pt-2 sm:pt-4"
            >
              <motion.button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 transition-all duration-200 inline-flex items-center justify-center rounded-full w-full sm:w-auto"
              >
                Potencia tu negocio ahora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </motion.button>
            </motion.div>

            {/* Trust Line */}
            <motion.p 
              variants={itemVariants}
              className="text-sm text-slate-400 dark:text-slate-500 font-normal pt-2"
            >
              Transforma conversaciones en conversiones
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;