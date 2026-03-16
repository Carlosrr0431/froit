'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  FileSpreadsheet,
  TrendingUp,
  Clock,
  Shield,
  Layers,
  BarChart3,
  Cpu,
  Download,
  RefreshCw,
  MessageSquareText,
  Ruler,
} from 'lucide-react';

const RagoFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: 'IA Predictiva',
      description: 'Calcula costos basándose en miles de datos del mercado de construcción actualizados en tiempo real.',
      color: 'from-emerald-400 to-teal-500',
      bgLight: 'bg-emerald-50',
    },
    {
      icon: FileSpreadsheet,
      title: 'Detalle Completo',
      description: 'Desglose por categoría: obra gruesa, instalaciones, terminaciones, mano de obra y más.',
      color: 'from-cyan-400 to-blue-500',
      bgLight: 'bg-cyan-50',
    },
    {
      icon: TrendingUp,
      title: 'Precios Actualizados',
      description: 'Base de datos con precios del mercado argentino actualizados, incluyendo ajustes por inflación.',
      color: 'from-amber-400 to-orange-500',
      bgLight: 'bg-amber-50',
    },
    {
      icon: Clock,
      title: 'En Minutos',
      description: 'Genera presupuestos profesionales completos en menos de 2 minutos con asistencia de IA.',
      color: 'from-violet-400 to-purple-500',
      bgLight: 'bg-violet-50',
    },
    {
      icon: Download,
      title: 'Exportar PDF/Excel',
      description: 'Descarga tus presupuestos en formato profesional listo para presentar a clientes.',
      color: 'from-rose-400 to-pink-500',
      bgLight: 'bg-rose-50',
    },
    {
      icon: MessageSquareText,
      title: 'Chat con IA',
      description: 'Consulta dudas sobre materiales, costos y mejores prácticas directamente al asistente IA.',
      color: 'from-teal-400 to-emerald-500',
      bgLight: 'bg-teal-50',
    },
  ];

  const processSteps = [
    {
      step: '01',
      icon: Ruler,
      title: 'Describe tu Proyecto',
      description: 'Ingresa los detalles: tipo de construcción, metros cuadrados, ubicación y nivel de calidad.',
    },
    {
      step: '02',
      icon: Cpu,
      title: 'IA Analiza y Calcula',
      description: 'Nuestra IA procesa los datos, compara precios del mercado y genera un desglose preciso.',
    },
    {
      step: '03',
      icon: BarChart3,
      title: 'Revisa y Ajusta',
      description: 'Visualiza el presupuesto detallado, modifica cantidades y ajusta según tus necesidades.',
    },
    {
      step: '04',
      icon: Download,
      title: 'Exporta y Comparte',
      description: 'Descarga en PDF o Excel profesional, listo para presentar a clientes o inversores.',
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Soft Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Características Principales</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Todo el poder de la IA
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              al servicio de tu obra
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Herramientas profesionales diseñadas para constructores, arquitectos e ingenieros que buscan eficiencia.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="relative bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 h-full">
                  {/* Gradient Line Top */}
                  <div className={`absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r ${feature.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full`} />

                  <div className={`inline-flex p-3 rounded-xl ${feature.bgLight} mb-5`}>
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full mb-5">
            <RefreshCw className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-700">¿Cómo Funciona?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            4 pasos simples
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            De la idea al presupuesto profesional en minutos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-emerald-300 to-transparent" />
                )}

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 text-center relative">
                  <span className="absolute -top-3 left-6 text-xs font-bold text-emerald-500 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {step.step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center mx-auto mb-4 mt-2">
                    <Icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RagoFeatures;
