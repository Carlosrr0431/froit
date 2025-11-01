export const mockContacts = [
  {
    id: 1,
    name: 'María González',
    lastMessage: '¿Cuándo podemos agendar la visita?',
    lastMessageTime: '10:30',
    unread: 2,
    online: true,
    color: '#3B82F6',
    email: 'maria.gonzalez@email.com',
    phone: '+54 11 2345-6789',
    location: 'Buenos Aires, Argentina',
    company: 'González & Asociados',
    since: 'Enero 2024',
    status: 'Premium',
    stage: 'visit', // Etapa del pipeline
    priority: 'high',
    customFields: {
      propertyType: 'Departamento',
      budget: 180000,
      location: 'Palermo'
    },
    messages: [
      {
        id: 1,
        sender: 'contact',
        text: 'Hola! Estoy interesada en el departamento de Palermo',
        time: '10:15'
      },
      {
        id: 2,
        sender: 'user',
        text: 'Hola María! Claro, tenemos varias opciones en Palermo. ¿Qué tipo de propiedad buscas?',
        time: '10:18'
      },
      {
        id: 3,
        sender: 'contact',
        text: 'Busco un 2 ambientes con balcón, presupuesto hasta USD 180,000',
        time: '10:25'
      },
      {
        id: 4,
        sender: 'user',
        text: 'Perfecto! Tengo 3 opciones que se ajustan a tu búsqueda. Te envío los detalles',
        time: '10:28'
      },
      {
        id: 5,
        sender: 'contact',
        text: '¿Cuándo podemos agendar la visita?',
        time: '10:30'
      }
    ]
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    lastMessage: 'Gracias por la información!',
    lastMessageTime: 'Ayer',
    unread: 0,
    online: false,
    color: '#8B5CF6',
    email: 'carlos.ruiz@email.com',
    phone: '+54 11 3456-7890',
    location: 'Córdoba, Argentina',
    company: 'Inversiones CR',
    since: 'Febrero 2024',
    status: 'Activo',
    stage: 'negotiation',
    priority: 'medium',
    customFields: {
      propertyType: 'Departamento',
      budget: 120000,
      location: 'Córdoba Capital'
    },
    messages: [
      {
        id: 1,
        sender: 'contact',
        text: 'Buenos días, quisiera información sobre propiedades en Córdoba Capital',
        time: '09:00'
      },
      {
        id: 2,
        sender: 'user',
        text: 'Buenos días Carlos! Tenemos varias opciones. ¿Buscas para inversión o vivienda?',
        time: '09:15'
      },
      {
        id: 3,
        sender: 'contact',
        text: 'Para inversión, estoy buscando departamentos 1 o 2 ambientes',
        time: '09:20'
      },
      {
        id: 4,
        sender: 'user',
        text: 'Excelente! Te comparto un catálogo con opciones disponibles en Nueva Córdoba',
        time: '09:25'
      },
      {
        id: 5,
        sender: 'contact',
        text: 'Gracias por la información!',
        time: '09:30'
      }
    ]
  },
  {
    id: 3,
    name: 'Ana Martínez',
    lastMessage: 'Perfecto, nos vemos entonces',
    lastMessageTime: 'Lun',
    unread: 0,
    online: true,
    color: '#10B981',
    email: 'ana.martinez@email.com',
    phone: '+54 11 4567-8901',
    location: 'Rosario, Argentina',
    company: 'Martínez Real Estate',
    since: 'Marzo 2024',
    status: 'VIP',
    stage: 'closing',
    priority: 'high',
    customFields: {
      propertyType: 'Casa',
      budget: 320000,
      location: 'Belgrano'
    },
    messages: [
      {
        id: 1,
        sender: 'contact',
        text: 'Hola! Me interesa una casa en zona norte',
        time: '14:00'
      },
      {
        id: 2,
        sender: 'user',
        text: 'Hola Ana! Tenemos varias casas disponibles. ¿Qué características buscas?',
        time: '14:05'
      },
      {
        id: 3,
        sender: 'contact',
        text: '3 dormitorios, jardín y cochera para 2 autos',
        time: '14:10'
      },
      {
        id: 4,
        sender: 'user',
        text: 'Tengo la casa perfecta en Belgrano! ¿Podemos coordinar una visita?',
        time: '14:15'
      },
      {
        id: 5,
        sender: 'contact',
        text: 'Perfecto, nos vemos entonces',
        time: '14:20'
      }
    ]
  },
  {
    id: 4,
    name: 'Pedro López',
    lastMessage: '¿Tienen financiación disponible?',
    lastMessageTime: 'Dom',
    unread: 1,
    online: false,
    color: '#F59E0B',
    email: 'pedro.lopez@email.com',
    phone: '+54 11 5678-9012',
    location: 'Mendoza, Argentina',
    company: 'López Construcciones',
    since: 'Abril 2024',
    status: 'Nuevo',
    stage: 'contact',
    priority: 'low',
    customFields: {
      propertyType: 'Lote',
      budget: 80000,
      location: 'Zona Oeste'
    },
    messages: [
      {
        id: 1,
        sender: 'contact',
        text: 'Buenas tardes, estoy buscando un lote en zona oeste',
        time: '16:00'
      },
      {
        id: 2,
        sender: 'user',
        text: 'Buenas tardes Pedro! Tenemos varios lotes disponibles. ¿Para qué sería?',
        time: '16:05'
      },
      {
        id: 3,
        sender: 'contact',
        text: 'Para construir una casa, busco al menos 300m²',
        time: '16:10'
      },
      {
        id: 4,
        sender: 'user',
        text: 'Tengo opciones desde 350m² a muy buenos precios',
        time: '16:15'
      },
      {
        id: 5,
        sender: 'contact',
        text: '¿Tienen financiación disponible?',
        time: '16:20'
      }
    ]
  },
  {
    id: 5,
    name: 'Laura Fernández',
    lastMessage: 'Muchas gracias!',
    lastMessageTime: 'Sáb',
    unread: 0,
    online: true,
    color: '#EC4899',
    email: 'laura.fernandez@email.com',
    phone: '+54 11 6789-0123',
    location: 'La Plata, Argentina',
    company: 'Fernández Inversiones',
    since: 'Mayo 2024',
    status: 'Premium',
    stage: 'lead',
    priority: 'medium',
    customFields: {
      propertyType: 'Departamento',
      budget: 250000,
      location: 'Palermo/Belgrano'
    },
    messages: [
      {
        id: 1,
        sender: 'contact',
        text: 'Hola! Me interesan departamentos en construcción',
        time: '11:00'
      },
      {
        id: 2,
        sender: 'user',
        text: 'Hola Laura! Tenemos varios emprendimientos. ¿En qué zona?',
        time: '11:05'
      },
      {
        id: 3,
        sender: 'contact',
        text: 'Preferentemente en Palermo o Belgrano',
        time: '11:10'
      },
      {
        id: 4,
        sender: 'user',
        text: 'Tengo 2 proyectos excelentes en ambas zonas. Te envío los detalles',
        time: '11:15'
      },
      {
        id: 5,
        sender: 'contact',
        text: 'Muchas gracias!',
        time: '11:20'
      }
    ]
  }
];
