"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import { useRef } from "react";
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
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 overflow-hidden flex items-center justify-center transition-colors duration-500"
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

      {/* Enhanced Background Effects - More Impactful */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        {/* Large animated gradient orbs - More dramatic */}
        <motion.div
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/30 to-cyan-500/30 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/25 to-pink-500/25 dark:from-purple-500/15 dark:to-pink-500/15 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-indigo-500/20 to-blue-500/20 dark:from-indigo-500/15 dark:to-blue-500/15 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Animated wave effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
            backgroundSize: "100% 100%",
          }}
        />

        {/* Enhanced grid pattern with animation */}
        <motion.div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="tech-grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tech-grid)" />
          </svg>
        </motion.div>

        {/* Enhanced floating particles - More dynamic */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400/40 dark:bg-blue-400/20 rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
              y: [0, -50 - Math.random() * 50, -100 - Math.random() * 50],
              x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Glowing grid squares effect - Aligned with grid, slower and subtle */}
        {[...Array(8)].map((_, i) => {
          // Calcular posiciones que coincidan con el grid de 50x50
          const gridSize = 50;
          const randomGridX = Math.floor(Math.random() * 20); // 20 columnas aproximadas
          const randomGridY = Math.floor(Math.random() * 12); // 12 filas aproximadas
          const leftPosition = randomGridX * gridSize;
          const topPosition = randomGridY * gridSize;
          const randomDelay = Math.random() * 8; // Mayor delay para que aparezcan más espaciados
          const randomDuration = 4 + Math.random() * 3; // Duración más larga (4-7 segundos)

          return (
            <motion.div
              key={`square-${i}`}
              className="absolute border border-blue-500/0 dark:border-blue-400/0"
              style={{
                left: `${leftPosition}px`,
                top: `${topPosition}px`,
                width: "50px",
                height: "50px",
              }}
              animate={{
                borderColor: [
                  "rgba(59, 130, 246, 0)",
                  "rgba(59, 130, 246, 0.4)",
                  "rgba(59, 130, 246, 0)",
                ],
                boxShadow: [
                  "0 0 0px rgba(59, 130, 246, 0)",
                  "0 0 15px rgba(59, 130, 246, 0.3)",
                  "0 0 0px rgba(59, 130, 246, 0)",
                ],
              }}
              transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "easeInOut",
                repeatDelay: 2, // Pausa de 2 segundos entre repeticiones
              }}
            >
              {/* Inner glow - más sutil */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/5 dark:to-purple-400/5"
                animate={{
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  delay: randomDelay,
                  ease: "easeInOut",
                  repeatDelay: 2,
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Content Container - Optimized for Mobile */}
      <div className="relative z-20 w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center space-y-4 sm:space-y-5 md:space-y-6 pt-32 md:pt-11"
          >
            {/* Modern Title - Better Mobile Spacing */}
            <motion.div variants={itemVariants} className="w-full">
              <h1
                className="text-4xl xs:text-5xl sm:text-5xl md:text-5xl lg:text-4xl xl:text-5xl font-light leading-[1.1] tracking-tight"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                <span className="block text-slate-900 dark:text-white">
                  Automatización{" "}
                  <span className="font-bold" style={{ color: "#56c3e8" }}>
                    INTELIGENTE
                  </span>{" "}
                </span>
                <span className="block text-slate-900 dark:text-white">
                  para{" "}
                  <span className="font-bold" style={{ color: "#6cbfa5" }}>
                    WHATSAPP
                  </span>{" "}
                </span>
              </h1>
            </motion.div>

            {/* Value Proposition - Better Mobile Text */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2 md:gap-3 max-w-3xl mx-auto px-4 sm:px-2"
            >
              <motion.p 
                className="text-xs sm:text-sm md:text-base lg:text-base text-slate-700 dark:text-gray-300 leading-tight font-light text-center sm:text-right flex-1 max-w-[240px] sm:max-w-[280px] md:max-w-[320px]"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
                animate={{
                  x: [0, 0, -12, -12, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                  times: [0, 0.2, 0.5, 0.7, 1]
                }}
              >
                Automatización de WhatsApp con{" "}
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text font-medium">
                  CRM personalizado
                </span>{" "}
                para tu negocio
              </motion.p>
              
              <motion.div
                className="relative flex items-center justify-center flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
              >
                {/* Animated border tracing the plus sign */}
                <svg 
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  style={{ overflow: 'visible' }}
                >
                  {/* Plus sign path */}
                  <motion.path
                    d="M 45 10 L 55 10 L 55 45 L 90 45 L 90 55 L 55 55 L 55 90 L 45 90 L 45 55 L 10 55 L 10 45 L 45 45 Z"
                    fill="url(#plusFillGradient)"
                    stroke="url(#plusGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: [0, 0, 1, 1, 0],
                      opacity: [0, 0, 1, 1, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.2, 1],
                      times: [0, 0.2, 0.5, 0.7, 1]
                    }}
                  />
                  <defs>
                    <linearGradient id="plusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="plusFillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                      <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
                      <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Subtle pulsing glow */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur-lg"
                  animate={{
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                />
              </motion.div>
              
              <motion.p 
                className="text-xs sm:text-sm md:text-base lg:text-base text-slate-700 dark:text-gray-300 leading-tight font-light text-center sm:text-left flex-1 max-w-[240px] sm:max-w-[280px] md:max-w-[320px]"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
                animate={{
                  x: [0, 0, 12, 12, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1],
                  times: [0, 0.2, 0.5, 0.7, 1]
                }}
              >
                Microservicio incluido para{" "}
                <span className="font-normal text-slate-700 dark:text-gray-300">
                  publicar en todas tus redes sociales en un solo lugar
                </span>
              </motion.p>
            </motion.div>

            {/* CTA Buttons - Better Mobile Size */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center w-full max-w-md mx-auto pt-2 sm:pt-3"
            >
              <motion.button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.7)",
                  y: -2,
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-500 text-white font-medium text-base sm:text-lg md:text-lg px-8 sm:px-10 py-3.5 sm:py-4 transition-all duration-300 inline-flex items-center justify-center shadow-2xl rounded-xl w-full sm:w-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 mr-2">
                  Empezá a automatizar tu negocio
                </span>
                <ArrowRight className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
            </motion.div>

            {/* Trust Line - Better Mobile Visibility */}
            <motion.div 
              variants={itemVariants} 
              className="pt-3 sm:pt-4 flex items-center justify-center gap-2"
            >
              <p 
                className="text-sm sm:text-base font-semibold text-white"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                ¡Transforma conversaciones en conversiones!
              </p>
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
