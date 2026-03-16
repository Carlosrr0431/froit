'use client';

import { motion } from 'framer-motion';
import { Building2, Sparkles, ArrowRight, Calculator, Brain, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

const RagoHero = () => {
  const floatingItems = [
    { icon: '🏗️', x: '10%', y: '20%', delay: 0, size: 'text-3xl' },
    { icon: '📐', x: '85%', y: '15%', delay: 0.5, size: 'text-2xl' },
    { icon: '🧱', x: '75%', y: '70%', delay: 1, size: 'text-2xl' },
    { icon: '💰', x: '15%', y: '75%', delay: 1.5, size: 'text-3xl' },
    { icon: '🔧', x: '90%', y: '45%', delay: 0.8, size: 'text-xl' },
  ];

  const stats = [
    { value: '95%', label: 'Precisión', icon: Shield },
    { value: '< 2min', label: 'Generación', icon: Zap },
    { value: 'IA', label: 'Potenciado', icon: Brain },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Construction Icons */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
          className={`absolute ${item.size} select-none pointer-events-none hidden lg:block`}
          style={{ left: item.x, top: item.y }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Potenciado por Inteligencia Artificial
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              <span className="text-slate-900">Presupuestos de</span>
              <br />
              <span className="text-slate-900">construcción </span>
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                inteligentes
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-8 max-w-lg">
              Genera presupuestos detallados y profesionales en minutos. 
              Nuestra IA analiza tu proyecto y calcula costos con{' '}
              <span className="text-emerald-600 font-semibold">precisión excepcional</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/rago/presupuesto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow duration-300 text-lg w-full sm:w-auto"
                >
                  <Calculator className="w-5 h-5" />
                  Crear Presupuesto
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-emerald-300 hover:text-emerald-700 transition-all duration-300 w-full sm:w-auto"
              >
                Conocer más
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Icon className="w-4 h-4 text-emerald-500" />
                      <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right - Interactive Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 relative overflow-hidden"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Presupuesto #2847</h3>
                      <p className="text-xs text-slate-400">Casa Residencial 120m²</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full">
                    IA Generado
                  </span>
                </div>

                {/* Budget Items Preview */}
                <div className="space-y-3 mb-6">
                  {[
                    { name: 'Obra Gruesa', pct: 35, color: 'bg-emerald-500', amount: '$4,200,000' },
                    { name: 'Instalaciones', pct: 20, color: 'bg-teal-500', amount: '$2,400,000' },
                    { name: 'Terminaciones', pct: 25, color: 'bg-cyan-500', amount: '$3,000,000' },
                    { name: 'Carpintería', pct: 12, color: 'bg-amber-500', amount: '$1,440,000' },
                    { name: 'Otros', pct: 8, color: 'bg-slate-400', amount: '$960,000' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                        <span className="text-sm font-semibold text-slate-900">{item.amount}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ delay: 1 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm font-semibold text-slate-500">TOTAL ESTIMADO</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                  >
                    $12,000,000
                  </motion.span>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-[80px]" />
              </motion.div>

              {/* Floating Mini Cards */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 px-4 py-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">IA Analizando...</p>
                  <p className="text-[10px] text-slate-400">Precios del mercado</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 px-4 py-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">¡Optimizado!</p>
                  <p className="text-[10px] text-slate-400">Ahorro del 15%</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RagoHero;
