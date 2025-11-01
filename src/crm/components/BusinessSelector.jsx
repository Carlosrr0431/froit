'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { businessTypes } from '../utils/businessConfig';

const BusinessSelector = ({ currentType, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const businessOptions = Object.entries(businessTypes).map(([key, value]) => ({
    id: key,
    ...value,
  }));

  const currentBusiness = businessOptions.find(b => b.id === currentType);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: currentBusiness?.color }}
          >
            {currentBusiness?.icon?.charAt(0) || '🏢'}
          </div>
          <div className="text-left">
            <p className="text-sm text-slate-500">Tipo de negocio</p>
            <p className="font-semibold text-slate-900">{currentBusiness?.name}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2 max-h-80 overflow-y-auto">
                {businessOptions.map((business) => {
                  const isSelected = business.id === currentType;

                  return (
                    <motion.button
                      key={business.id}
                      onClick={() => {
                        onChange(business.id);
                        setIsOpen(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all text-left
                        ${isSelected ? 'bg-slate-50' : 'hover:bg-slate-50'}
                      `}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: business.color }}
                      >
                        {business.icon?.charAt(0) || '🏢'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900">{business.name}</p>
                        <p className="text-xs text-slate-500">
                          {business.stages.length} etapas configuradas
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessSelector;
