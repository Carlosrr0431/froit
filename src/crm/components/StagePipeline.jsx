'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';

const StagePipeline = ({ stages, currentStageId, onStageChange, compact = false, showNavigation = true }) => {
  const currentIndex = stages.findIndex(s => s.id === currentStageId);
  
  // Navegación con teclado
  useEffect(() => {
    if (!onStageChange || !showNavigation) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onStageChange(stages[currentIndex - 1].id);
      } else if (e.key === 'ArrowRight' && currentIndex < stages.length - 1) {
        onStageChange(stages[currentIndex + 1].id);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, stages, onStageChange, showNavigation]);
  
  const handlePrevStage = () => {
    if (currentIndex > 0) {
      onStageChange(stages[currentIndex - 1].id);
    }
  };
  
  const handleNextStage = () => {
    if (currentIndex < stages.length - 1) {
      onStageChange(stages[currentIndex + 1].id);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {stages.map((stage, index) => {
          const isActive = stage.id === currentStageId;
          const isPast = index < currentIndex;
          
          return (
            <motion.button
              key={stage.id}
              onClick={() => onStageChange?.(stage.id)}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm
                transition-all duration-200 shadow-sm hover:shadow-md
                ${isActive ? 'ring-2 ring-offset-2' : ''}
              `}
              style={{
                background: isActive 
                  ? `linear-gradient(135deg, ${stage.color}, ${stage.color}dd)`
                  : isPast 
                    ? `linear-gradient(135deg, ${stage.color}60, ${stage.color}40)` 
                    : `linear-gradient(135deg, ${stage.color}30, ${stage.color}20)`,
                color: isActive || isPast ? 'white' : stage.color,
                ringColor: stage.color,
                boxShadow: isActive ? `0 4px 12px ${stage.color}40` : undefined,
              }}
              title={stage.name}
            >
              {isPast && !isActive ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <motion.span
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {stage.icon}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    backgroundColor: stage.color,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Botones de navegación - Solo si showNavigation es true y onStageChange está definido */}
      {showNavigation && onStageChange && !compact && (
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={handlePrevStage}
            disabled={currentIndex === 0}
            whileHover={currentIndex > 0 ? { scale: 1.05, x: -2 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold
              transition-all duration-200
              ${currentIndex === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </motion.button>
          
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">
              Etapa {currentIndex + 1} de {stages.length}
            </p>
            <p className="text-sm font-bold text-slate-700">
              {stages[currentIndex]?.name}
            </p>
          </div>
          
          <motion.button
            onClick={handleNextStage}
            disabled={currentIndex === stages.length - 1}
            whileHover={currentIndex < stages.length - 1 ? { scale: 1.05, x: 2 } : {}}
            whileTap={currentIndex < stages.length - 1 ? { scale: 0.95 } : {}}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold
              transition-all duration-200
              ${currentIndex === stages.length - 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md'
              }
            `}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      {/* Indicador de navegación con teclado */}
      {showNavigation && onStageChange && !compact && (
        <div className="hidden lg:flex items-center justify-center mb-2">
          <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full">
            <span>💡 Usa las flechas</span>
            <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono">←</kbd>
            <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono">→</kbd>
            <span>para navegar</span>
          </div>
        </div>
      )}

      {/* Desktop View */}
      <div className="hidden md:flex items-center gap-2">
        {stages.map((stage, index) => {
          const isActive = stage.id === currentStageId;
          const isPast = index < currentIndex;
          const isClickable = onStageChange !== undefined;
          const progress = ((index) / (stages.length - 1)) * 100;
          
          return (
            <div key={stage.id} className="flex items-center">
              <motion.button
                onClick={() => isClickable && onStageChange(stage.id)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.03, y: -2 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: isActive ? [1, 1.02, 1] : 1
                }}
                transition={{ 
                  delay: index * 0.08,
                  scale: isActive ? {
                    duration: 0.3,
                    ease: "easeInOut"
                  } : {}
                }}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                  transition-all font-semibold text-sm overflow-hidden
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  ${isActive ? 'ring-2 ring-offset-2 shadow-lg' : 'shadow-sm hover:shadow-md'}
                `}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${stage.color}, ${stage.color}dd)`
                    : isPast 
                      ? `linear-gradient(135deg, ${stage.color}60, ${stage.color}40)` 
                      : `linear-gradient(135deg, ${stage.color}25, ${stage.color}15)`,
                  color: isActive || isPast ? 'white' : stage.color,
                  ringColor: stage.color,
                  borderWidth: '1.5px',
                  borderStyle: 'solid',
                  borderColor: isActive || isPast ? 'transparent' : `${stage.color}40`,
                }}
              >
                {/* Progress bar background */}
                {isActive && (
                  <>
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                    />
                    {/* Barra de progreso global */}
                    <motion.div
                      className="absolute -bottom-2 left-0 h-0.5 bg-white/80 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </>
                )}
                
                <span className="text-lg relative z-10">
                  {isPast && !isActive ? <CheckCircle2 className="w-5 h-5" /> : stage.icon}
                </span>
                <span className="whitespace-nowrap relative z-10">{stage.name}</span>
                
                {/* Shine effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    }}
                  />
                )}
              </motion.button>
              
              {index < stages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 + 0.1 }}
                >
                  <ChevronRight 
                    className={`w-5 h-5 mx-1 flex-shrink-0 transition-colors ${
                      isPast ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {/* Navegación móvil */}
        {showNavigation && onStageChange && !compact && (
          <div className="flex items-center justify-between mb-3 px-2">
            <motion.button
              onClick={handlePrevStage}
              disabled={currentIndex === 0}
              whileTap={currentIndex > 0 ? { scale: 0.9 } : {}}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold
                ${currentIndex === 0 
                  ? 'bg-slate-100 text-slate-400' 
                  : 'bg-blue-500 text-white active:bg-blue-600'
                }
              `}
            >
              <ChevronLeft className="w-3 h-3" />
              Anterior
            </motion.button>
            
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-medium">
                {currentIndex + 1}/{stages.length}
              </p>
            </div>
            
            <motion.button
              onClick={handleNextStage}
              disabled={currentIndex === stages.length - 1}
              whileTap={currentIndex < stages.length - 1 ? { scale: 0.9 } : {}}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold
                ${currentIndex === stages.length - 1
                  ? 'bg-slate-100 text-slate-400' 
                  : 'bg-blue-500 text-white active:bg-blue-600'
                }
              `}
            >
              Siguiente
              <ChevronRight className="w-3 h-3" />
            </motion.button>
          </div>
        )}
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {stages.map((stage, index) => {
            const isActive = stage.id === currentStageId;
            const isPast = index < currentIndex;
            const isClickable = onStageChange !== undefined;
            
            return (
              <motion.button
                key={stage.id}
                onClick={() => isClickable && onStageChange(stage.id)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.05, y: -2 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: isActive ? [1, 1.05, 1] : 1
                }}
                transition={{ 
                  delay: index * 0.05,
                  scale: isActive ? {
                    duration: 0.3,
                    ease: "easeInOut"
                  } : {}
                }}
                className={`
                  relative flex-shrink-0 flex flex-col items-center gap-1.5 p-2.5 rounded-xl
                  transition-all shadow-sm
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  ${isActive ? 'ring-2 ring-offset-1 shadow-md' : ''}
                `}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${stage.color}, ${stage.color}dd)`
                    : isPast 
                      ? `linear-gradient(135deg, ${stage.color}60, ${stage.color}40)` 
                      : `linear-gradient(135deg, ${stage.color}25, ${stage.color}15)`,
                  color: isActive || isPast ? 'white' : stage.color,
                  ringColor: stage.color,
                  borderWidth: '1.5px',
                  borderStyle: 'solid',
                  borderColor: isActive || isPast ? 'transparent' : `${stage.color}40`,
                }}
              >
                <motion.span 
                  className="text-xl"
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {isPast && !isActive ? <CheckCircle2 className="w-5 h-5" /> : stage.icon}
                </motion.span>
                <span className="text-[10px] font-semibold text-center leading-tight max-w-[60px]">
                  {stage.name}
                </span>
                
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      backgroundColor: stage.color,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StagePipeline;
