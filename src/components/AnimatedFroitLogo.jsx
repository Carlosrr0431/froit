'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedFroitLogo = ({ className = "" }) => {
  const [currentCycle, setCurrentCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCycle((prev) => (prev + 1) % 9);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  // Tres posiciones fijas en el logo
  const position1 = { x: 0, y: 109.4 };     // Verde - inferior izquierda
  const position2 = { x: 0, y: 70.3 };      // Azul - superior izquierda
  const position3 = { x: 19.5, y: 89.9 };   // Morado - medio derecha

  // Patrones aleatorios de rotación - mucho más variados e impredecibles
  const getPositions = (cycle) => {
    // 9 patrones diferentes para máxima variedad
    const patterns = [
      // Patrón 1: Inicial
      { green: position1, blue: position2, purple: position3 },
      // Patrón 2: Verde y Azul intercambian
      { green: position2, blue: position1, purple: position3 },
      // Patrón 3: Verde y Morado intercambian
      { green: position3, blue: position2, purple: position1 },
      // Patrón 4: Azul y Morado intercambian
      { green: position1, blue: position3, purple: position2 },
      // Patrón 5: Todos rotan sentido horario
      { green: position2, blue: position3, purple: position1 },
      // Patrón 6: Todos rotan sentido antihorario
      { green: position3, blue: position1, purple: position2 },
      // Patrón 7: Verde al medio, otros intercambian
      { green: position3, blue: position2, purple: position1 },
      // Patrón 8: Combinación única
      { green: position2, blue: position3, purple: position1 },
      // Patrón 9: Vuelta al inicio con variación
      { green: position1, blue: position3, purple: position2 },
    ];
    
    return patterns[cycle % patterns.length];
  };

  const currentPositions = getPositions(currentCycle);

  return (
    <svg 
      id="Capa_1" 
      data-name="Capa 1" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200"
      className={className}
    >
      <defs>
        <style>
          {`
            .cls-1 {
              fill: #6cbfa5;
            }
            .cls-2 {
              fill: #fff;
            }
            .cls-3 {
              fill: #56c3e8;
            }
            .cls-4 {
              fill: #826aac;
            }
          `}
        </style>
      </defs>
      
      {/* Texto FROIT */}
      <g>
        <path className="cls-2" d="M63.4,81.2c-1.9,1.1-3.5,2.6-4.6,4.5-1.1,1.9-1.7,4.1-1.7,6.6v36.4h6.8v-20.5h21v-6h-21v-10c0-2,.6-3.6,1.9-4.9,1.2-1.3,2.9-1.9,5-1.9h16.7v-6h-17.5c-2.4,0-4.6.6-6.6,1.7Z"/>
        <path className="cls-2" d="M97.6,95.6c-1.8,1.8-2.7,4.3-2.7,7.5v25.7h6.5v-25.3c0-1.6.4-2.8,1.3-3.7.9-.9,2.1-1.3,3.6-1.3h6.2v-5.6h-7.4c-3.2,0-5.7.9-7.5,2.7Z"/>
        <path className="cls-2" d="M145,94.6c-2.8-1.7-6.1-2.5-9.7-2.5s-6.9.8-9.7,2.5c-2.8,1.7-5,3.9-6.7,6.8-1.6,2.8-2.5,6-2.5,9.5s.8,6.7,2.5,9.5c1.6,2.8,3.9,5.1,6.7,6.8s6,2.5,9.7,2.5,6.9-.8,9.7-2.5,5.1-3.9,6.7-6.8c1.6-2.8,2.4-6,2.4-9.5s-.8-6.7-2.4-9.5c-1.6-2.8-3.8-5.1-6.7-6.8ZM146.1,117.6c-1,2-2.5,3.6-4.3,4.7-1.8,1.2-4,1.8-6.4,1.8s-4.7-.6-6.5-1.8c-1.9-1.2-3.3-2.8-4.3-4.7-1-2-1.5-4.2-1.5-6.7s.5-4.7,1.5-6.7c1-2,2.5-3.6,4.3-4.7,1.9-1.2,4-1.8,6.5-1.8s4.6.6,6.4,1.8c1.8,1.2,3.3,2.8,4.3,4.7,1,2,1.5,4.2,1.5,6.7s-.5,4.7-1.5,6.7Z"/>
        <path className="cls-2" d="M165.7,78.5c-1.2,0-2.2.4-3.1,1.3-.9.9-1.3,1.9-1.3,3.1s.4,2.2,1.3,3.1c.9.9,1.9,1.3,3.1,1.3s2.2-.4,3.1-1.3c.9-.9,1.3-1.9,1.3-3.1s-.4-2.2-1.3-3.1c-.9-.9-1.9-1.3-3.1-1.3Z"/>
        <rect className="cls-2" x="162.4" y="92.9" width="6.5" height="35.9"/>
        <path className="cls-2" d="M200,98.5v-5.6h-12.3v-9h-6.5v9h-6.2v5.6h6.2v20.1c0,3.1.9,5.6,2.7,7.5,1.8,1.8,4.3,2.7,7.5,2.7h8.4v-5.6h-7.2c-1.5,0-2.8-.5-3.6-1.4s-1.3-2.1-1.3-3.7v-19.7h12.3Z"/>
      </g>
      
      {/* Cuadrados animados con patrones aleatorios y dinámicos */}
      <g>
        {/* Cuadrado verde - movimiento aleatorio */}
        <motion.rect 
          className="cls-1" 
          width="19.5" 
          height="19.5"
          animate={{
            x: currentPositions.green.x,
            y: currentPositions.green.y,
            scale: [1, 1.08, 1],
            rotate: [0, 360],
          }}
          transition={{
            x: { duration: 1.3, ease: [0.34, 1.56, 0.64, 1] }, // Bounce out
            y: { duration: 1.3, ease: [0.34, 1.56, 0.64, 1] },
            scale: { duration: 1.3, ease: "easeInOut" },
            rotate: { duration: 1.3, ease: "easeInOut" },
          }}
          style={{
            filter: 'drop-shadow(0 0 12px rgba(108, 191, 165, 0.8))',
          }}
        >
          <motion.animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </motion.rect>
        
        {/* Cuadrado azul - movimiento aleatorio */}
        <motion.rect 
          className="cls-3" 
          width="19.5" 
          height="19.5"
          animate={{
            x: currentPositions.blue.x,
            y: currentPositions.blue.y,
            scale: [1, 1.08, 1],
            rotate: [0, -360],
          }}
          transition={{
            x: { duration: 1.4, ease: [0.34, 1.56, 0.64, 1] },
            y: { duration: 1.4, ease: [0.34, 1.56, 0.64, 1] },
            scale: { duration: 1.4, ease: "easeInOut" },
            rotate: { duration: 1.4, ease: "easeInOut" },
            delay: 0.08,
          }}
          style={{
            filter: 'drop-shadow(0 0 12px rgba(86, 195, 232, 0.8))',
          }}
        >
          <motion.animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </motion.rect>
        
        {/* Cuadrado morado - movimiento aleatorio */}
        <motion.rect 
          className="cls-4" 
          width="19.5" 
          height="19.5"
          animate={{
            x: currentPositions.purple.x,
            y: currentPositions.purple.y,
            scale: [1, 1.08, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            x: { duration: 1.35, ease: [0.34, 1.56, 0.64, 1] },
            y: { duration: 1.35, ease: [0.34, 1.56, 0.64, 1] },
            scale: { duration: 1.35, ease: "easeInOut" },
            rotate: { duration: 1.35, ease: "easeInOut" },
            delay: 0.15,
          }}
          style={{
            filter: 'drop-shadow(0 0 12px rgba(130, 106, 172, 0.8))',
          }}
        >
          <motion.animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </motion.rect>
      </g>
    </svg>
  );
};

export default AnimatedFroitLogo;
