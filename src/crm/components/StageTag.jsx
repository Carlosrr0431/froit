'use client';

import { motion } from 'framer-motion';

const StageTag = ({ stage, size = 'md', showIcon = true, className = '' }) => {
  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-2 rounded-full font-semibold
        shadow-sm hover:shadow-md transition-all duration-200
        backdrop-blur-sm
        ${sizes[size]}
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, ${stage.color}25, ${stage.color}15)`,
        color: stage.color,
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderColor: `${stage.color}60`,
        boxShadow: `0 0 0 0 ${stage.color}00, 0 2px 8px ${stage.color}15`,
      }}
    >
      {showIcon && (
        <motion.span 
          className={`${iconSizes[size]} filter drop-shadow-sm`}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {stage.icon}
        </motion.span>
      )}
      <span className="tracking-wide">{stage.name}</span>
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${stage.color}15, transparent)`,
        }}
      />
    </motion.span>
  );
};

export default StageTag;
