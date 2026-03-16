'use client';

import { motion } from 'framer-motion';
import { Clock, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import RagoNavbar from '@/components/rago/RagoNavbar';
import RagoFooter from '@/components/rago/RagoFooter';

export default function HistorialPage() {
  return (
    <>
      <RagoNavbar />
      <div className="pt-24 pb-20 min-h-[80vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Historial</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Tus Presupuestos
            </h1>
            <p className="text-slate-500 mb-12 max-w-md mx-auto">
              Aquí podrás ver todos los presupuestos que has generado anteriormente.
            </p>

            {/* Empty State */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Aún no tienes presupuestos
              </h3>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                Crea tu primer presupuesto inteligente y comenzará a aparecer aquí para que puedas consultarlo en cualquier momento.
              </p>
              <Link href="/rago/presupuesto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                >
                  Crear Primer Presupuesto
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>

            <p className="text-xs text-slate-400 mt-8">
              💡 Próximamente: guardado automático con cuenta de usuario
            </p>
          </motion.div>
        </div>
      </div>
      <RagoFooter />
    </>
  );
}
