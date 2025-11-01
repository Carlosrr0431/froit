'use client';

import { MoreVertical, Settings } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BusinessSelector from './BusinessSelector';
import { getCurrentBusinessType, setBusinessType } from '../utils/businessConfig';

const UserProfile = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [currentBusinessType, setCurrentBusinessType] = useState(getCurrentBusinessType());

  const handleBusinessTypeChange = (newType) => {
    setBusinessType(newType);
    setCurrentBusinessType(newType);
    // Recargar la página para aplicar el nuevo tipo de negocio
    window.location.reload();
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
            CF
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            title="Configuración de negocio"
          >
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 mx-4"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Configuración del CRM
                </h2>
                <p className="text-slate-600 text-sm">
                  Selecciona el tipo de negocio para adaptar el CRM a tus necesidades
                </p>
              </div>

              <BusinessSelector
                currentType={currentBusinessType}
                onChange={handleBusinessTypeChange}
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserProfile;
