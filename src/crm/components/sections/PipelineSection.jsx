'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingUp, Clock, DollarSign, Target, Filter, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { getBusinessConfig, getCurrentBusinessType } from '../../utils/businessConfig';
import { mockContacts } from '../../utils/mockData';

const PipelineSection = () => {
  const businessType = getCurrentBusinessType();
  const businessConfig = getBusinessConfig(businessType);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  // Agrupar contactos por etapa
  const contactsByStage = useMemo(() => {
    const grouped = {};
    businessConfig.stages.forEach(stage => {
      grouped[stage.id] = [];
    });

    mockContacts
      .filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'all' || contact.priority === filterPriority;
        return matchesSearch && matchesPriority;
      })
      .forEach(contact => {
        if (grouped[contact.stage]) {
          grouped[contact.stage].push(contact);
        }
      });

    return grouped;
  }, [businessConfig.stages, searchQuery, filterPriority]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = mockContacts.length;
    const stages = businessConfig.stages.length;
    const avgPerStage = (total / stages).toFixed(1);
    const highPriority = mockContacts.filter(c => c.priority === 'high').length;

    // Calcular valor total del pipeline (suma de budgets)
    const totalValue = mockContacts.reduce((sum, contact) => {
      const budget = contact.customFields?.budget || contact.customFields?.estimatedCost || contact.customFields?.projectValue || 0;
      return sum + budget;
    }, 0);

    return { total, stages, avgPerStage, highPriority, totalValue };
  }, [businessConfig.stages]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-400';
    }
  };

  const getStageProgress = (stageId) => {
    const stageIndex = businessConfig.stages.findIndex(s => s.id === stageId);
    return ((stageIndex + 1) / businessConfig.stages.length) * 100;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-3 md:p-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm overflow-y-auto max-h-[40vh] md:max-h-none">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
              Pipeline de Ventas
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              {businessConfig.name} • {stats.total} contactos activos
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">{/* Tarjetas de estadísticas */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg md:rounded-xl p-2.5 md:p-3 text-white shadow-lg"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
              <Target className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-[10px] md:text-xs font-medium opacity-90">Total</span>
            </div>
            <p className="text-xl md:text-2xl font-bold">{stats.total}</p>
            <p className="text-[10px] md:text-xs opacity-75">{stats.stages} etapas</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl p-2.5 md:p-3 text-white shadow-lg"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-[10px] md:text-xs font-medium opacity-90">Promedio</span>
            </div>
            <p className="text-xl md:text-2xl font-bold">{stats.avgPerStage}</p>
            <p className="text-[10px] md:text-xs opacity-75">por etapa</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg md:rounded-xl p-2.5 md:p-3 text-white shadow-lg"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-[10px] md:text-xs font-medium opacity-90 truncate">Alta Prioridad</span>
            </div>
            <p className="text-xl md:text-2xl font-bold">{stats.highPriority}</p>
            <p className="text-[10px] md:text-xs opacity-75">urgentes</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg md:rounded-xl p-2.5 md:p-3 text-white shadow-lg"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
              <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-[10px] md:text-xs font-medium opacity-90">Valor Total</span>
            </div>
            <p className="text-xl md:text-2xl font-bold">${(stats.totalValue / 1000).toFixed(0)}K</p>
            <p className="text-[10px] md:text-xs opacity-75">en pipeline</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar contacto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full sm:w-40 pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="all">Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pipeline Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <div className="h-full inline-flex gap-2 md:gap-3 p-3 md:p-6">
          {businessConfig.stages.map((stage, index) => {
            const contacts = contactsByStage[stage.id] || [];
            const progress = getStageProgress(stage.id);

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-64 sm:w-72 lg:w-80 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Stage Header */}
                <div
                  className="p-3 md:p-4 relative overflow-hidden"
                  style={{
                    backgroundColor: `${stage.color}15`,
                    borderBottom: `2px solid ${stage.color}40`
                  }}
                >
                  <div className="absolute top-0 right-0 text-4xl md:text-6xl opacity-10">
                    {stage.icon}
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                      <span className="text-xl md:text-2xl">{stage.icon}</span>
                      <h3 className="font-semibold text-slate-900 text-xs md:text-sm truncate">
                        {stage.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-[10px] md:text-xs">
                      <span className="text-slate-600 font-medium">
                        {contacts.length} contacto{contacts.length !== 1 ? 's' : ''}
                      </span>
                      <span 
                        className="font-bold px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs"
                        style={{ 
                          backgroundColor: `${stage.color}30`,
                          color: stage.color 
                        }}
                      >
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-1.5 md:space-y-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <AnimatePresence mode="popLayout">
                    {contacts.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-8 text-slate-400 text-sm"
                      >
                        Sin contactos
                      </motion.div>
                    ) : (
                      contacts.map((contact, idx) => (
                        <motion.div
                          key={contact.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: idx * 0.03 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-white border border-slate-200 rounded-lg p-2 md:p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-2 md:gap-3">
                            <div className="relative flex-shrink-0">
                              <div
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold text-[10px] md:text-xs shadow-md"
                                style={{
                                  backgroundImage: `linear-gradient(135deg, ${contact.color}dd, ${contact.color})`
                                }}
                              >
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 border-white ${getPriorityColor(contact.priority)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 text-xs md:text-sm truncate group-hover:text-teal-600 transition-colors">
                                {contact.name}
                              </h4>
                              <p className="text-[10px] md:text-xs text-slate-500 truncate">
                                {contact.lastMessage}
                              </p>
                              {contact.customFields && (
                                <div className="mt-1.5 md:mt-2 flex items-center gap-1 text-xs flex-wrap">
                                  {contact.customFields.budget && (
                                    <span className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium text-[10px] md:text-xs">
                                      <DollarSign className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                      ${(contact.customFields.budget / 1000).toFixed(0)}K
                                    </span>
                                  )}
                                  {contact.customFields.estimatedCost && (
                                    <span className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium text-[10px] md:text-xs">
                                      <DollarSign className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                      ${(contact.customFields.estimatedCost / 1000).toFixed(0)}K
                                    </span>
                                  )}
                                  {contact.customFields.projectValue && (
                                    <span className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium text-[10px] md:text-xs">
                                      <DollarSign className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                      ${(contact.customFields.projectValue / 1000).toFixed(0)}K
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Stage Footer */}
                {contacts.length > 0 && (
                  <div 
                    className="p-1.5 md:p-2 text-center text-[10px] md:text-xs font-medium"
                    style={{ 
                      backgroundColor: `${stage.color}10`,
                      color: stage.color 
                    }}
                  >
                    {index < businessConfig.stages.length - 1 ? (
                      <div className="flex items-center justify-center gap-0.5 md:gap-1">
                        <span>Siguiente</span>
                        <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      </div>
                    ) : (
                      <span>Etapa final</span>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PipelineSection;
