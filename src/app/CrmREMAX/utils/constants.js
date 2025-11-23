// Constantes del CRM
export const baseSalesSteps = [
    "1. Contacto inicial",
    "2. Calificación del prospecto",
    "3. Presentación de la solución",
    "4. Manejo de objeciones",
    "5. Cierre de la venta",
    "6. Seguimiento postventa",
];

export const clientTypes = [
    "Comprador",
    "Vendedor",
    "Inversor",
];

export const defaultSalesSteps = {
    general: [
        "Contacto inicial",
        "Calificación del prospecto",
        "Presentación de la solución",
        "Manejo de objeciones",
        "Cierre de la venta",
        "Seguimiento postventa",
    ],
    comprador: [
        "Primer contacto",
        "Definir presupuesto y necesidades",
        "Búsqueda de propiedades",
        "Visitas programadas",
        "Negociación de oferta",
        "Gestión de financiamiento",
        "Cierre de compra"
    ],
    vendedor: [
        "Contacto inicial",
        "Evaluación de la propiedad",
        "Análisis de mercado",
        "Firma de contrato",
        "Marketing y promoción",
        "Gestión de visitas",
        "Cierre de venta"
    ],
    inversor: [
        "Primer contacto",
        "Análisis de perfil inversor",
        "Presentación de oportunidades",
        "Evaluación de ROI",
        "Due diligence",
        "Negociación de términos",
        "Cierre de inversión"
    ]
};

export const INITIAL_MESSAGES = 15;
export const MESSAGES_PER_PAGE = 5;
