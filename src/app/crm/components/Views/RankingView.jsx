"use client"

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, MessageSquare, Star, Calendar, Home, Award, Loader2 } from 'lucide-react';
import { supabaseClient } from '@/lib/supabase';

// Mapeo de nombres de meses
const mesesMap = {
    'Ene': 'Enero',
    'Feb': 'Febrero',
    'Mar': 'Marzo',
    'Abr': 'Abril',
    'May': 'Mayo',
    'Jun': 'Junio',
    'Jul': 'Julio',
    'Ago': 'Agosto',
    'Sep': 'Septiembre',
    'Oct': 'Octubre',
    'Nov': 'Noviembre',
    'Dic': 'Diciembre'
};

/**
 * Vista de Ranking - Clasificación de agentes con datos reales de Supabase
 */
export default function RankingView() {
    const [loading, setLoading] = useState(true);
    const [agentesData, setAgentesData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [tipoRanking, setTipoRanking] = useState('propiedades'); // 'propiedades' o 'cierres'

    // Cargar datos desde Supabase
    useEffect(() => {
        cargarRanking();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMonth, selectedYear, tipoRanking]);

    const cargarRanking = async () => {
        setLoading(true);
        try {
            const tabla = tipoRanking === 'propiedades' ? 'propiedades_agentes' : 'cierres_agentes';
            const columnaOrden = tipoRanking === 'propiedades' ? 'propiedades_activas' : 'cierres_realizados';

            let query = supabaseClient
                .from(tabla)
                .select('*')
                .order(columnaOrden, { ascending: false });

            // Aplicar filtros si están seleccionados
            if (selectedMonth) {
                query = query.eq('mes', selectedMonth);
            }
            if (selectedYear) {
                query = query.eq('anio', selectedYear);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Filtrar la fila "Total" que no es un agente real
            const dataFiltrada = (data || []).filter(item =>
                !item.nombre_agente?.toLowerCase().includes('total') &&
                !item.agente_id?.toLowerCase().includes('total')
            );

            setAgentesData(dataFiltrada);
        } catch (error) {
            console.error('Error cargando ranking:', error);
            setAgentesData([]);
        } finally {
            setLoading(false);
        }
    };

    // Calcular estadísticas
    const totalAgentes = agentesData.length;
    const totalPropiedades = agentesData.reduce((sum, agent) => sum + (parseInt(agent.propiedades_activas) || 0), 0);
    const totalCierres = agentesData.reduce((sum, agent) => sum + (parseInt(agent.cierres_realizados) || 0), 0);

    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600 text-white px-6 py-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">
                                {tipoRanking === 'propiedades' ? '🏆 Ranking de Propiedades' : '🎯 Ranking de Cierres'}
                            </h2>
                            <p className="text-sm text-white/90">
                                {tipoRanking === 'propiedades'
                                    ? 'Top performers del mes - Cartera activa'
                                    : 'Top performers del mes - Cierres realizados'}
                            </p>
                        </div>
                    </div>

                    {/* Controles */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Tipo de Ranking */}
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                onClick={() => setTipoRanking('propiedades')}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${tipoRanking === 'propiedades'
                                        ? 'bg-white text-orange-600 shadow-md'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Home className="w-4 h-4" />
                                    <span>Cartera Activa</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setTipoRanking('cierres')}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${tipoRanking === 'cierres'
                                        ? 'bg-white text-orange-600 shadow-md'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Award className="w-4 h-4" />
                                    <span>Cierres</span>
                                </div>
                            </button>
                        </div>

                        {/* Mes */}
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-3 py-2.5 border-2 border-white/30 rounded-lg text-sm font-medium focus:ring-2 focus:ring-white/50 bg-white/20 text-white backdrop-blur-sm"
                        >
                            <option value="" className="text-gray-900">Todos los meses</option>
                            {Object.entries(mesesMap).map(([corto, completo]) => (
                                <option key={corto} value={corto} className="text-gray-900">{completo}</option>
                            ))}
                        </select>

                        {/* Año */}
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="px-3 py-2.5 border-2 border-white/30 rounded-lg text-sm font-medium focus:ring-2 focus:ring-white/50 bg-white/20 text-white backdrop-blur-sm"
                        >
                            {[2024, 2025, 2026].map(year => (
                                <option key={year} value={year} className="text-gray-900">{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Estadísticas generales */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Total Agentes</p>
                                <p className="text-2xl font-bold text-gray-900">{totalAgentes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 rounded-lg">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Total Propiedades</p>
                                <p className="text-2xl font-bold text-gray-900">{totalPropiedades}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Total Cierres</p>
                                <p className="text-2xl font-bold text-gray-900">{totalCierres}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido - Lista de Ranking */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                            <p className="text-gray-600">Cargando ranking...</p>
                        </div>
                    ) : agentesData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Trophy size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No hay datos disponibles</h3>
                            <p className="text-gray-600">Selecciona un mes y año para ver el ranking</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {agentesData.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className={`relative group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${index === 0 ? 'bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-400 shadow-lg' :
                                            index === 1 ? 'bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-2 border-gray-400 shadow-md' :
                                                index === 2 ? 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-400 shadow-md' :
                                                    'bg-gradient-to-r from-blue-50/30 to-indigo-50/30 border border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Medalla/Posición */}
                                        <div className="flex-shrink-0">
                                            {index === 0 ? (
                                                <div className="relative">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl">
                                                        <Trophy className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg">
                                                        1°
                                                    </div>
                                                </div>
                                            ) : index === 1 ? (
                                                <div className="relative">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
                                                        <Trophy className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg">
                                                        2°
                                                    </div>
                                                </div>
                                            ) : index === 2 ? (
                                                <div className="relative">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                        <Trophy className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg">
                                                        3°
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                                                    <span className="text-2xl font-black text-white">#{index + 1}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Información del agente */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 truncate">{item.nombre_agente}</h3>
                                            <p className="text-sm text-gray-500">ID: {item.agente_id}</p>
                                        </div>

                                        {/* Estadísticas principales */}
                                        {tipoRanking === 'propiedades' ? (
                                            <div className="flex-shrink-0">
                                                <div className={`px-6 py-3 rounded-xl font-black text-2xl shadow-lg ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                                                        index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white' :
                                                            index === 2 ? 'bg-gradient-to-r from-orange-400 to-amber-600 text-white' :
                                                                'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                                    }`}>
                                                    {item.propiedades_activas || 0}
                                                </div>
                                                <p className="text-center text-xs font-bold text-gray-600 mt-2">Propiedades</p>
                                            </div>
                                        ) : (
                                            <div className="flex gap-4">
                                                <div className="text-center">
                                                    <div className={`px-4 py-2 rounded-lg font-bold text-xl ${index < 3 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {item.cierres_realizados || 0}
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">Cierres</p>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`px-4 py-2 rounded-lg font-bold text-xl ${index < 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {item.propiedades_activas || 0}
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">Activas</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
