'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Building, Calendar, Tag, Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBusinessConfig, getCurrentBusinessType } from '../utils/businessConfig';
import StageTag from './StageTag';
import StagePipeline from './StagePipeline';

const ContactInfo = ({ selectedContact, onClose }) => {
  const [businessType, setBusinessType] = useState('realEstate');
  const [businessConfig, setBusinessConfig] = useState(null);

  useEffect(() => {
    const type = getCurrentBusinessType();
    setBusinessType(type);
    setBusinessConfig(getBusinessConfig(type));
  }, []);

  if (!selectedContact || !businessConfig) return null;

  const currentStage = businessConfig.stages.find(s => s.id === selectedContact.stage) || businessConfig.stages[0];

  const handleStageChange = (newStageId) => {
    console.log('Cambiar etapa a:', newStageId);
    // Aquí implementarías la lógica para actualizar la etapa del contacto
  };
  if (!selectedContact) return null;

  return (
    <motion.aside
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      className="hidden xl:flex w-80 2xl:w-96 bg-white border-l border-slate-200 flex-col overflow-hidden"
    >
      {/* Close Button */}
      <div className="flex justify-end p-2 border-b border-slate-200 flex-shrink-0">
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Cerrar panel"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        {/* Profile Header */}
        <div className="p-4 2xl:p-6 border-b border-slate-200">
          <div className="text-center">
            <div
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center text-white text-2xl font-bold mb-4"
              style={{
                backgroundImage: `linear-gradient(135deg, ${selectedContact.color}dd, ${selectedContact.color})`
              }}
            >
              {selectedContact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-1">
              {selectedContact.name}
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Cliente {selectedContact.status || 'Activo'}
            </p>

            {/* Current Stage */}
            <div className="flex justify-center mb-4">
              <StageTag stage={currentStage} size="lg" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>

      {/* Stage Pipeline */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Pipeline de {businessConfig.name}
        </h4>
        <StagePipeline
          stages={businessConfig.stages}
          currentStageId={selectedContact.stage}
          onStageChange={handleStageChange}
          compact={false}
        />
      </div>

      {/* Contact Details */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Información de contacto
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm text-slate-900">
                  {selectedContact.email || `${selectedContact.name.toLowerCase().replace(' ', '.')}@email.com`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Teléfono</p>
                <p className="text-sm text-slate-900">
                  {selectedContact.phone || '+54 11 1234-5678'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Ubicación</p>
                <p className="text-sm text-slate-900">
                  {selectedContact.location || 'Buenos Aires, Argentina'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Información adicional
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Building className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Empresa</p>
                <p className="text-sm text-slate-900">
                  {selectedContact.company || 'Tech Solutions SA'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Cliente desde</p>
                <p className="text-sm text-slate-900">
                  {selectedContact.since || 'Enero 2024'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Etiquetas</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    VIP
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Activo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Fields */}
        {selectedContact.customFields && Object.keys(selectedContact.customFields).length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Información específica
            </h4>
            <div className="space-y-3">
              {Object.entries(selectedContact.customFields).map(([key, value]) => {
                const field = businessConfig.customFields?.find(f => f.id === key);
                if (!field) return null;

                return (
                  <div key={key} className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">{field.label}</p>
                      <p className="text-sm text-slate-900">
                        {field.type === 'currency' ? `USD $${value.toLocaleString()}` : value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Propiedades de interés
          </h4>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-900 mb-1">
                Departamento 2 amb - Palermo
              </p>
              <p className="text-xs text-slate-600">
                USD 180,000 • 55m²
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-900 mb-1">
                Casa 3 amb - Belgrano
              </p>
              <p className="text-xs text-slate-600">
                USD 320,000 • 120m²
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
          Agendar reunión
        </button>
        <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium text-sm transition-colors">
          Ver más detalles
        </button>
      </div>
      </div>
    </motion.aside>
  );
};

export default ContactInfo;
