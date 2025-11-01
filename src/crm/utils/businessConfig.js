// Configuración adaptativa para diferentes tipos de negocio

export const businessTypes = {
  realEstate: {
    name: 'Inmobiliaria',
    icon: 'Home',
    color: '#3b82f6',
    stages: [
      { id: 'lead', name: 'Lead', color: '#94a3b8', icon: '🎯' },
      { id: 'contact', name: 'Primer Contacto', color: '#60a5fa', icon: '📞' },
      { id: 'visit', name: 'Visita Agendada', color: '#a78bfa', icon: '🏠' },
      { id: 'negotiation', name: 'Negociación', color: '#fbbf24', icon: '💰' },
      { id: 'closing', name: 'Cierre', color: '#10b981', icon: '✅' },
      { id: 'lost', name: 'Perdido', color: '#ef4444', icon: '❌' },
    ],
    customFields: [
      { id: 'propertyType', label: 'Tipo de Propiedad', type: 'select', options: ['Departamento', 'Casa', 'Oficina', 'Local'] },
      { id: 'budget', label: 'Presupuesto', type: 'currency' },
      { id: 'location', label: 'Ubicación preferida', type: 'text' },
    ]
  },
  health: {
    name: 'Centro Médico',
    icon: 'Heart',
    color: '#ec4899',
    stages: [
      { id: 'inquiry', name: 'Consulta Inicial', color: '#94a3b8', icon: '❓' },
      { id: 'scheduled', name: 'Cita Agendada', color: '#60a5fa', icon: '📅' },
      { id: 'inProgress', name: 'En Tratamiento', color: '#a78bfa', icon: '🏥' },
      { id: 'followUp', name: 'Seguimiento', color: '#fbbf24', icon: '📋' },
      { id: 'completed', name: 'Completado', color: '#10b981', icon: '✅' },
      { id: 'cancelled', name: 'Cancelado', color: '#ef4444', icon: '❌' },
    ],
    customFields: [
      { id: 'specialty', label: 'Especialidad', type: 'select', options: ['Medicina General', 'Odontología', 'Pediatría', 'Cardiología'] },
      { id: 'insurance', label: 'Obra Social', type: 'text' },
      { id: 'lastVisit', label: 'Última Visita', type: 'date' },
    ]
  },
  construction: {
    name: 'Construcción',
    icon: 'Hammer',
    color: '#f59e0b',
    stages: [
      { id: 'prospect', name: 'Prospecto', color: '#94a3b8', icon: '🎯' },
      { id: 'quote', name: 'Presupuesto Enviado', color: '#60a5fa', icon: '📄' },
      { id: 'approval', name: 'En Aprobación', color: '#a78bfa', icon: '⏳' },
      { id: 'planning', name: 'Planificación', color: '#fbbf24', icon: '📐' },
      { id: 'execution', name: 'En Ejecución', color: '#f97316', icon: '🔨' },
      { id: 'completed', name: 'Finalizado', color: '#10b981', icon: '✅' },
      { id: 'rejected', name: 'Rechazado', color: '#ef4444', icon: '❌' },
    ],
    customFields: [
      { id: 'projectType', label: 'Tipo de Proyecto', type: 'select', options: ['Construcción Nueva', 'Remodelación', 'Ampliación', 'Mantenimiento'] },
      { id: 'estimatedCost', label: 'Costo Estimado', type: 'currency' },
      { id: 'timeline', label: 'Plazo (meses)', type: 'number' },
    ]
  },
  retail: {
    name: 'Tienda de Ropa',
    icon: 'ShoppingBag',
    color: '#8b5cf6',
    stages: [
      { id: 'visitor', name: 'Visitante', color: '#94a3b8', icon: '👀' },
      { id: 'interested', name: 'Interesado', color: '#60a5fa', icon: '❤️' },
      { id: 'cart', name: 'En Carrito', color: '#a78bfa', icon: '🛒' },
      { id: 'purchased', name: 'Compró', color: '#10b981', icon: '✅' },
      { id: 'vip', name: 'Cliente VIP', color: '#fbbf24', icon: '⭐' },
      { id: 'inactive', name: 'Inactivo', color: '#ef4444', icon: '😴' },
    ],
    customFields: [
      { id: 'style', label: 'Estilo Preferido', type: 'select', options: ['Casual', 'Formal', 'Deportivo', 'Elegante'] },
      { id: 'size', label: 'Talle', type: 'text' },
      { id: 'totalPurchases', label: 'Compras Totales', type: 'currency' },
    ]
  },
  consulting: {
    name: 'Consultoría',
    icon: 'Briefcase',
    color: '#06b6d4',
    stages: [
      { id: 'discovery', name: 'Descubrimiento', color: '#94a3b8', icon: '🔍' },
      { id: 'proposal', name: 'Propuesta Enviada', color: '#60a5fa', icon: '📝' },
      { id: 'negotiation', name: 'Negociación', color: '#a78bfa', icon: '💼' },
      { id: 'contracted', name: 'Contratado', color: '#10b981', icon: '🤝' },
      { id: 'delivery', name: 'En Entrega', color: '#fbbf24', icon: '🚀' },
      { id: 'closed', name: 'Cerrado', color: '#10b981', icon: '✅' },
      { id: 'declined', name: 'Declinado', color: '#ef4444', icon: '❌' },
    ],
    customFields: [
      { id: 'serviceType', label: 'Tipo de Servicio', type: 'select', options: ['Estrategia', 'Marketing', 'IT', 'Finanzas'] },
      { id: 'projectValue', label: 'Valor del Proyecto', type: 'currency' },
      { id: 'duration', label: 'Duración (meses)', type: 'number' },
    ]
  }
};

export const getBusinessConfig = (type = 'realEstate') => {
  return businessTypes[type] || businessTypes.realEstate;
};

export const getCurrentBusinessType = () => {
  // Por ahora retornamos inmobiliaria, pero esto podría venir de una configuración guardada
  if (typeof window !== 'undefined') {
    return localStorage.getItem('businessType') || 'realEstate';
  }
  return 'realEstate';
};

export const setBusinessType = (type) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('businessType', type);
  }
};
