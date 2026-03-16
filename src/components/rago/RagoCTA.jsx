'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Building2, Sparkles } from 'lucide-react';
import Link from 'next/link';

const RagoCTA = () => {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-10 sm:p-16 overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear_gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
          />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full mb-6 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold text-white/90">Comienza gratis</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              ¿Listo para revolucionar
              <br />
              tus presupuestos?
            </h2>

            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Únete a cientos de profesionales que ya usan RAGO para crear presupuestos de construcción
              más precisos, rápidos y profesionales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rago/presupuesto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
                >
                  <Building2 className="w-5 h-5" />
                  Crear Mi Primer Presupuesto
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            <p className="text-sm text-white/50 mt-6">
              Sin tarjeta de crédito • Resultado inmediato
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RagoCTA;
