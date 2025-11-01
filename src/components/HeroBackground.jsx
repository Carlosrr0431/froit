'use client';

import { motion } from 'framer-motion';

const HeroBackground = () => {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Large animated gradient orbs */}
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

        {/* Enhanced floating particles */}
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

        {/* Glowing grid squares effect */}
        {[...Array(8)].map((_, i) => {
          const gridSize = 50;
          const randomGridX = Math.floor(Math.random() * 20);
          const randomGridY = Math.floor(Math.random() * 12);
          const leftPosition = randomGridX * gridSize;
          const topPosition = randomGridY * gridSize;
          const randomDelay = Math.random() * 8;
          const randomDuration = 4 + Math.random() * 3;

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
                repeatDelay: 2,
              }}
            >
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
      </div>
    </div>
  );
};

export default HeroBackground;
