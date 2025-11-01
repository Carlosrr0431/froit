'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, DollarSign, Users, Calendar, Trophy, Medal } from 'lucide-react';

const RankingSection = () => {
  const currentUser = {
    name: 'Carlos Fernández',
    position: 3,
    sales: 15,
    revenue: 180000,
    target: 200000,
    progress: 90,
    trend: '+12%'
  };

  const topSellers = [
    { id: 1, name: 'María González', sales: 23, revenue: 280000, avatar: '#3b82f6', trend: '+18%' },
    { id: 2, name: 'Juan Pérez', sales: 19, revenue: 220000, avatar: '#10b981', trend: '+15%' },
    { id: 3, name: 'Carlos Fernández', sales: 15, revenue: 180000, avatar: '#f59e0b', trend: '+12%', isCurrentUser: true },
    { id: 4, name: 'Ana Martínez', sales: 14, revenue: 165000, avatar: '#8b5cf6', trend: '+10%' },
    { id: 5, name: 'Luis Rodríguez', sales: 12, revenue: 145000, avatar: '#ec4899', trend: '+8%' },
  ];

  const stats = [
    { label: 'Ventas del mes', value: currentUser.sales, icon: Target, color: 'blue' },
    { label: 'Ingresos generados', value: `$${(currentUser.revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'green' },
    { label: 'Clientes activos', value: '28', icon: Users, color: 'purple' },
    { label: 'Días del mes', value: '18/30', icon: Calendar, color: 'orange' },
  ];

  const getPositionBadge = (position) => {
    const badges = {
      1: { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-100' },
      2: { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-100' },
      3: { icon: Medal, color: 'text-orange-600', bg: 'bg-orange-100' },
    };
    return badges[position] || { icon: Award, color: 'text-slate-400', bg: 'bg-slate-100' };
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Ranking de Ventas</h1>
          <p className="text-slate-600">Noviembre 2025 • Tu desempeño este mes</p>
        </motion.div>

        {/* Current Position Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                {(() => {
                  const badge = getPositionBadge(currentUser.position);
                  const Icon = badge.icon;
                  return <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />;
                })()}
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Tu posición actual</p>
                <h2 className="text-4xl md:text-5xl font-bold">#{currentUser.position}</h2>
                <p className="text-white/90 text-sm mt-1">{currentUser.trend} vs mes anterior</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-white/80 text-sm mb-1">Meta del mes</p>
              <div className="text-2xl md:text-3xl font-bold mb-2">
                ${(currentUser.revenue / 1000).toFixed(0)}K / ${(currentUser.target / 1000).toFixed(0)}K
              </div>
              <div className="w-full md:w-48 h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentUser.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <p className="text-white/90 text-sm mt-1">{currentUser.progress}% completado</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              green: 'from-green-500 to-green-600',
              purple: 'from-purple-500 to-purple-600',
              orange: 'from-orange-500 to-orange-600',
            };

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 hover:shadow-lg transition-shadow"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <p className="text-xs md:text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Top Sellers Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
        >
          <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg md:text-xl font-semibold text-slate-900">Top 5 Vendedores</h3>
            <p className="text-sm text-slate-600">Ranking del mes actual</p>
          </div>

          <div className="divide-y divide-slate-100">
            {topSellers.map((seller, index) => {
              const badge = getPositionBadge(index + 1);
              const BadgeIcon = badge.icon;

              return (
                <motion.div
                  key={seller.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 md:p-6 hover:bg-slate-50 transition-colors ${
                    seller.isCurrentUser ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Position Badge */}
                    <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full ${badge.bg} flex items-center justify-center`}>
                      <BadgeIcon className={`w-6 h-6 md:w-7 md:h-7 ${badge.color}`} />
                    </div>

                    {/* Avatar */}
                    <div
                      className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base"
                      style={{ background: seller.avatar }}
                    >
                      {seller.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900 text-sm md:text-base truncate">
                          {seller.name}
                        </h4>
                        {seller.isCurrentUser && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            Tú
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3 md:w-4 md:h-4" />
                          {seller.sales} ventas
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                          ${(seller.revenue / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>

                    {/* Trend */}
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1 text-green-600 font-semibold text-sm md:text-base">
                        <TrendingUp className="w-4 h-4" />
                        {seller.trend}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 text-center"
        >
          <Award className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            ¡Vas muy bien! 🎉
          </h3>
          <p className="text-slate-600 text-sm md:text-base">
            Solo necesitas <strong>$20K más</strong> para alcanzar tu meta. ¡Sigue así!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RankingSection;
