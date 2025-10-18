'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MessageSquare, Clock, Zap, Target } from 'lucide-react';

const Stats = () => {
  const responseTimeData = [
    { name: 'Ene', tradicional: 45, froit: 2 },
    { name: 'Feb', tradicional: 52, froit: 1.8 },
    { name: 'Mar', tradicional: 48, froit: 1.5 },
    { name: 'Abr', tradicional: 61, froit: 1.2 },
    { name: 'May', tradicional: 55, froit: 0.8 },
    { name: 'Jun', tradicional: 67, froit: 0.5 }
  ];

  const conversionData = [
    { name: 'Q1', leads: 1200, conversion: 15 },
    { name: 'Q2', leads: 1800, conversion: 28 },
    { name: 'Q3', leads: 2400, conversion: 35 },
    { name: 'Q4', leads: 3200, conversion: 42 }
  ];

  const satisfactionData = [
    { name: 'Excelente', value: 68, color: '#10B981' },
    { name: 'Bueno', value: 24, color: '#3B82F6' },
    { name: 'Regular', value: 6, color: '#F59E0B' },
    { name: 'Malo', value: 2, color: '#EF4444' }
  ];

  const metrics = [
    {
      icon: MessageSquare,
      title: 'Mensajes Automatizados',
      value: '24/7',
      subtitle: 'Disponibilidad continua',
      change: 'Sin límite',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Gestión de Contactos',
      value: 'Ilimitada',
      subtitle: 'Capacidad del CRM',
      change: 'Escalable',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: 'Tiempo de Respuesta',
      value: '< 2 seg',
      subtitle: 'Promedio de la IA',
      change: 'Instantáneo',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Redes Conectadas',
      value: 'Multi',
      subtitle: 'Publicación centralizada',
      change: 'Todas',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjBmMGYwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50 dark:opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
            Capacidades del Sistema
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Tecnología que</span>
            <br />
            <span className="gradient-text">optimiza tu operación</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Características técnicas de nuestra plataforma de automatización 
            con inteligencia artificial para WhatsApp Business.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${metric.color} mb-4`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {metric.title}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.subtitle}
                  </span>
                  <span className={`text-sm font-semibold ${
                    metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Response Time Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-blue-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tiempo de Respuesta
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Comparación de tiempos de respuesta entre gestión manual y automatizada (minutos)
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar 
                  dataKey="tradicional" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                  name="Método Tradicional"
                />
                <Bar 
                  dataKey="froit" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  name="Con FroIT"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Conversion Rate Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Captura de Leads
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Capacidad de procesamiento y registro de contactos
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversion" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  name="Tasa de Conversión %"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Satisfaction Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-yellow-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Eficiencia del Sistema
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Distribución de rendimiento operativo
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 md:pl-8">
              <div className="space-y-4">
                {satisfactionData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300 mr-2">
                      {item.name}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-semibold">
                  Rendimiento optimizado
                </p>
                <p className="text-green-600 dark:text-green-300 text-sm">
                  Sistema de alta disponibilidad
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Solicita información detallada
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Conoce cómo podemos adaptar nuestra plataforma de automatización 
              a las necesidades específicas de tu negocio.
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
              Solicitar Consultoría
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;