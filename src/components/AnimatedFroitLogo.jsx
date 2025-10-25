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
  const position1 = { x: 0, y: 56.7 };      // Inferior izquierda
  const position2 = { x: 0, y: 19 };        // Superior izquierda
  const position3 = { x: 18.8, y: 37.9 };   // Medio derecha

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
      viewBox="0 0 200 76.1"
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
        <rect className="cls-2" x="161.2" y="4.2" width="6.1" height="6.5"/>
        <g>
          <rect className="cls-2" x="161.2" y="19" width="6.1" height="56.5"/>
          <polygon className="cls-2" points="105.9 19 81 19 81 19 81 22.6 81 75.5 87.1 75.5 87.1 22.6 105.9 22.6 105.9 19"/>
          <polygon className="cls-2" points="188.1 69.1 188.1 22.6 198.5 22.6 198.5 19 188.1 19 188.1 7.4 182 7.4 182 19 178 19 178 22.6 182 22.6 182 69.1 182 75.5 188.1 75.5 200 75.5 200 69.1 188.1 69.1"/>
          <path className="cls-2" d="M113.4,19h0v56.5h34.4V19h0s-34.4,0-34.4,0ZM141.6,69.1h-22.1V22.6h22.1v46.5Z"/>
          <polygon className="cls-2" points="76.2 3.5 76.2 0 61.9 0 55.8 0 55.8 3.5 55.8 19 50.5 19 50.5 22.6 55.8 22.6 55.8 76.1 61.9 76.1 61.9 22.6 72.5 22.6 72.5 19 61.9 19 61.9 3.5 76.2 3.5"/>
        </g>
      </g>
      
      {/* Cuadrados animados con patrones aleatorios y dinámicos */}
      <g>
        {/* Cuadrado verde - movimiento aleatorio */}
        <motion.rect 
          className="cls-1" 
          width="18.8" 
          height="18.8"
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
          width="18.8" 
          height="18.8"
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
          width="18.8" 
          height="18.8"
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
