'use client';

import { motion } from 'framer-motion';
import { Users, Search, Filter, Plus, Mail, Phone, MapPin, Building, Star, TrendingUp, Clock } from 'lucide-react';
import { useState } from 'react';

const ClientsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const clients = [
    {
      id: 1,
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+54 11 1234-5678',
      company: 'Tech Solutions SA',
      location: 'Palermo, CABA',
      status: 'active',
      rating: 5,
      properties: 3,
      lastContact: '2 días',
      totalValue: 850000,
      avatar: '#3b82f6'
    },
    {
      id: 2,
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+54 11 2345-6789',
      company: 'Inversiones del Sur',
      location: 'Belgrano, CABA',
      status: 'active',
      rating: 5,
      properties: 2,
      lastContact: '5 días',
      totalValue: 620000,
      avatar: '#10b981'
    },
    {
      id: 3,
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      phone: '+54 11 3456-7890',
      company: 'Constructora MN',
      location: 'Recoleta, CABA',
      status: 'potential',
      rating: 4,
      properties: 1,
      lastContact: '1 semana',
      totalValue: 450000,
      avatar: '#f59e0b'
    },
    {
      id: 4,
      name: 'Luis Rodríguez',
      email: 'luis.rodriguez@email.com',
      phone: '+54 11 4567-8901',
      company: 'Grupo Inmobiliario LR',
      location: 'Caballito, CABA',
      status: 'active',
      rating: 5,
      properties: 4,
      lastContact: '3 días',
      totalValue: 1200000,
      avatar: '#8b5cf6'
    },
    {
      id: 5,
      name: 'Carla Suárez',
      email: 'carla.suarez@email.com',
      phone: '+54 11 5678-9012',
      company: 'Desarrollo Urbano CS',
      location: 'Puerto Madero, CABA',
      status: 'inactive',
      rating: 3,
      properties: 1,
      lastContact: '2 meses',
      totalValue: 320000,
      avatar: '#ec4899'
    },
    {
      id: 6,
      name: 'Roberto Silva',
      email: 'roberto.silva@email.com',
      phone: '+54 11 6789-0123',
      company: 'Silva Inversiones',
      location: 'San Telmo, CABA',
      status: 'potential',
      rating: 4,
      properties: 2,
      lastContact: '1 día',
      totalValue: 580000,
      avatar: '#06b6d4'
    },
  ];

  const stats = [
    { label: 'Total clientes', value: clients.length, icon: Users, color: 'blue' },
    { label: 'Activos', value: clients.filter(c => c.status === 'active').length, icon: TrendingUp, color: 'green' },
    { label: 'Potenciales', value: clients.filter(c => c.status === 'potential').length, icon: Star, color: 'purple' },
    { label: 'Valor total', value: `$${(clients.reduce((sum, c) => sum + c.totalValue, 0) / 1000000).toFixed(1)}M`, icon: Building, color: 'orange' },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Activo', color: 'bg-green-100 text-green-700' },
      potential: { label: 'Potencial', color: 'bg-blue-100 text-blue-700' },
      inactive: { label: 'Inactivo', color: 'bg-gray-100 text-gray-700' },
    };
    return badges[status];
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Gestión de Clientes</h1>
            <p className="text-slate-600">Administra tu cartera de clientes</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nuevo cliente
          </motion.button>
        </motion.div>

        {/* Stats */}
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
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
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

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="potential">Potenciales</option>
              <option value="inactive">Inactivos</option>
            </select>
            <button className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </motion.div>

        {/* Clients Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredClients.map((client, index) => {
            const statusBadge = getStatusBadge(client.status);

            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-xl transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: client.avatar }}
                  >
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>

                {/* Client Info */}
                <h3 className="font-semibold text-slate-900 mb-1 text-base md:text-lg">
                  {client.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{client.company}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < client.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{client.location}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Propiedades</p>
                    <p className="text-lg font-bold text-slate-900">{client.properties}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Valor total</p>
                    <p className="text-lg font-bold text-slate-900">${(client.totalValue / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                {/* Last Contact */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Último contacto: {client.lastContact}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No se encontraron clientes</h3>
            <p className="text-slate-600">Intenta ajustar los filtros de búsqueda</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClientsSection;
