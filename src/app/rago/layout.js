import { Montserrat } from 'next/font/google';

export const metadata = {
  title: {
    default: "RAGO - Sistema Inteligente de Presupuestos de Construcción",
    template: "%s | RAGO"
  },
  description: "Sistema de presupuestos de construcción potenciado por IA. Genera presupuestos detallados, precisos y profesionales en minutos.",
  keywords: [
    "presupuesto construcción",
    "IA construcción",
    "estimación de costos",
    "presupuesto obra",
    "sistema presupuestos",
    "RAGO"
  ],
};

export default function RagoLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {children}
    </div>
  );
}
