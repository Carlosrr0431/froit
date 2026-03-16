'use client';

import { Building2 } from 'lucide-react';
import Link from 'next/link';

const RagoFooter = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold">RAGO</span>
              <p className="text-xs text-slate-400">Presupuestos Inteligentes</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-slate-400">
            <Link href="/rago" className="hover:text-emerald-400 transition-colors">
              Inicio
            </Link>
            <Link href="/rago/presupuesto" className="hover:text-emerald-400 transition-colors">
              Presupuestos
            </Link>
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              FroIT
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} RAGO by{' '}
            <Link href="/" className="text-emerald-400 hover:underline">
              FroIT
            </Link>
            . Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RagoFooter;
