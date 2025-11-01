'use client';

import { motion } from 'framer-motion';
import { Home, MapPin, DollarSign, Maximize, BedDouble, Bath, Car, Plus, Search, Filter, Heart } from 'lucide-react';
import { useState } from 'react';

const PropertiesSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const properties = [
    {
      id: 1,
      title: 'Departamento 2 ambientes',
      location: 'Palermo, CABA',
      price: 180000,
      type: 'apartment',
      size: 55,
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      status: 'available',
      image: '#3b82f6',
      featured: true
    },
    {
      id: 2,
      title: 'Casa 3 ambientes con jardín',
      location: 'Belgrano, CABA',
      price: 320000,
      type: 'house',
      size: 120,
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      status: 'available',
      image: '#10b981',
      featured: false
    },
    {
      id: 3,
      title: 'Loft moderno en Recoleta',
      location: 'Recoleta, CABA',
      price: 250000,
      type: 'loft',
      size: 75,
      bedrooms: 1,
      bathrooms: 1,
      parking: 1,
      status: 'reserved',
      image: '#f59e0b',
      featured: true
    },
    {
      id: 4,
      title: 'Penthouse con terraza',
      location: 'Puerto Madero, CABA',
      price: 580000,
      type: 'penthouse',
      size: 150,
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
      status: 'available',
      image: '#8b5cf6',
      featured: true
    },
    {
      id: 5,
      title: 'Departamento 1 ambiente',
      location: 'Caballito, CABA',
      price: 120000,
      type: 'apartment',
      size: 35,
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      status: 'sold',
      image: '#ec4899',
      featured: false
    },
    {
      id: 6,
      title: 'Casa 4 ambientes con pileta',
      location: 'San Isidro, GBA Norte',
      price: 450000,
      type: 'house',
      size: 200,
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
      status: 'available',
      image: '#06b6d4',
      featured: false
    },
  ];

  const stats = [
    { label: 'Disponibles', value: properties.filter(p => p.status === 'available').length, color: 'green' },
    { label: 'Reservadas', value: properties.filter(p => p.status === 'reserved').length, color: 'orange' },
    { label: 'Vendidas', value: properties.filter(p => p.status === 'sold').length, color: 'blue' },
    { label: 'Valor total', value: `$${(properties.reduce((sum, p) => sum + p.price, 0) / 1000000).toFixed(1)}M`, color: 'purple' },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      available: { label: 'Disponible', color: 'bg-green-100 text-green-700' },
      reserved: { label: 'Reservada', color: 'bg-orange-100 text-orange-700' },
      sold: { label: 'Vendida', color: 'bg-blue-100 text-blue-700' },
    };
    return badges[status];
  };

  const getTypeLabel = (type) => {
    const types = {
      apartment: 'Departamento',
      house: 'Casa',
      loft: 'Loft',
      penthouse: 'Penthouse',
    };
    return types[type] || type;
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || property.type === filterType;
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
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Catálogo de Propiedades</h1>
            <p className="text-slate-600">Explora todas las propiedades disponibles</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nueva propiedad
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => {
            const colorClasses = {
              green: 'from-green-500 to-green-600',
              orange: 'from-orange-500 to-orange-600',
              blue: 'from-blue-500 to-blue-600',
              purple: 'from-purple-500 to-purple-600',
            };

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                <p className="text-xs md:text-sm text-slate-600 mb-2">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</p>
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
              placeholder="Buscar propiedades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="apartment">Departamentos</option>
              <option value="house">Casas</option>
              <option value="loft">Lofts</option>
              <option value="penthouse">Penthouses</option>
            </select>
            <button className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProperties.map((property, index) => {
            const statusBadge = getStatusBadge(property.status);

            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ y: -8 }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden" style={{ backgroundColor: property.image }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>

                  {property.featured && (
                    <div className="absolute top-3 right-12 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                      ★ Destacada
                    </div>
                  )}

                  {/* Price */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <p className="text-xs text-slate-600 mb-0.5">Precio</p>
                      <p className="text-lg font-bold text-slate-900">
                        USD ${(property.price / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>

                  {/* Home Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                    <Home className="w-24 h-24 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <span className="text-xs text-cyan-600 font-medium">
                      {getTypeLabel(property.type)}
                    </span>
                    <h3 className="font-semibold text-slate-900 mt-1 mb-2 text-base md:text-lg">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100">
                    <div className="text-center">
                      <Maximize className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">{property.size}m²</p>
                    </div>
                    <div className="text-center">
                      <BedDouble className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">{property.bedrooms}</p>
                    </div>
                    <div className="text-center">
                      <Bath className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">{property.bathrooms}</p>
                    </div>
                    <div className="text-center">
                      <Car className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">{property.parking}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all text-sm">
                    Ver detalles
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No se encontraron propiedades</h3>
            <p className="text-slate-600">Intenta ajustar los filtros de búsqueda</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PropertiesSection;
