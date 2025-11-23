"use client"

import { useState, useEffect, useMemo } from 'react';
import { Building2, Search, MapPin, Bed, Bath, Car, X, ExternalLink, Filter, ChevronDown, Settings, Plus, Edit2 } from 'lucide-react';
import { supabaseClient } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Vista de Propiedades - Búsqueda y filtrado de propiedades
 */
export default function PropiedadesView({ onSelectPropiedad }) {
    const [loading, setLoading] = useState(true);
    const [propiedades, setPropiedades] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filtros, setFiltros] = useState({
        tipo: 'todos',
        precioMin: '',
        precioMax: '',
        operacion: 'todos',
        estado: 'todos'
    });
    const [showFiltros, setShowFiltros] = useState(false);

    // ✅ NUEVO: Estado para toast notification
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success'); // 'success' o 'error'

    // ✅ NUEVO: Estados para etiquetas
    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(false);

    // ✅ NUEVO: Estados para tipos de cliente
    const [dynamicClientTypes, setDynamicClientTypes] = useState(['Comprador', 'Vendedor', 'Inversor']);
    const [selectedClientType, setSelectedClientType] = useState('No especificado');
    const [loadingClientTypes, setLoadingClientTypes] = useState(false);

    // ✅ NUEVO: Estados para etapas del proceso
    const [salesSteps, setSalesSteps] = useState([
        "1. Contacto inicial",
        "2. Calificación del prospecto",
        "3. Presentación de la solución",
        "4. Manejo de objeciones",
        "5. Cierre de la venta",
        "6. Seguimiento postventa",
    ]);
    const [selectedSalesStep, setSelectedSalesStep] = useState(salesSteps[0]);
    const [clientTypeSteps, setClientTypeSteps] = useState({});

    // Obtener tipos únicos de propiedades
    const tiposUnicos = useMemo(() => {
        const tipos = [...new Set(propiedades.map(p => p.tipo).filter(Boolean))];
        return tipos.sort();
    }, [propiedades]);

    // Cargar propiedades desde Supabase
    useEffect(() => {
        cargarPropiedades();
        cargarEtiquetas();
        cargarTiposCliente();
    }, []);

    // ✅ NUEVO: Cargar etiquetas desde Supabase
    const cargarEtiquetas = async () => {
        setLoadingTags(true);
        try {
            const { data, error } = await supabaseClient
                .from('etiquetas')
                .select('*')
                .order('nombre');

            if (error) {
                console.error('Error cargando etiquetas:', error);
            } else {
                setAllTags(data || []);
                console.log('✅ Etiquetas cargadas:', data?.length || 0);
            }
        } catch (error) {
            console.error('Error en cargarEtiquetas:', error);
        } finally {
            setLoadingTags(false);
        }
    };

    // ✅ NUEVO: Cargar tipos de cliente desde Supabase
    const cargarTiposCliente = async () => {
        setLoadingClientTypes(true);
        try {
            const { data, error } = await supabaseClient
                .from('tipos_clientes_personalizados')
                .select('*')
                .eq('activo', true)
                .order('nombre_tipo');

            if (error) {
                console.error('Error cargando tipos de cliente:', error);
            } else if (data && data.length > 0) {
                const tipos = data.map(t => t.nombre_tipo);
                setDynamicClientTypes(tipos);
                console.log('✅ Tipos de cliente cargados:', tipos);
            }
        } catch (error) {
            console.error('Error en cargarTiposCliente:', error);
        } finally {
            setLoadingClientTypes(false);
        }
    };

    // ✅ NUEVO: Manejar selección de tipo de cliente
    const handleSelectClientType = (type) => {
        setSelectedClientType(type);
        console.log('Tipo de cliente seleccionado:', type);
        
        // Si hay pasos específicos para este tipo, cargarlos
        if (clientTypeSteps[type]) {
            setSalesSteps(clientTypeSteps[type]);
            setSelectedSalesStep(clientTypeSteps[type][0]);
        }
    };

    // ✅ NUEVO: Manejar selección de etapa del proceso
    const handleSelectSalesStep = (step) => {
        setSelectedSalesStep(step);
        console.log('Etapa seleccionada:', step);
    };

    // ✅ NUEVO: Manejar toggle de etiquetas
    const handleToggleTag = (tagId) => {
        setSelectedTags(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            } else {
                return [...prev, tagId];
            }
        });
    };

    // ✅ NUEVO: Función para compartir propiedad (copiar mensaje formateado)
    const handleShareProperty = (e, propiedad) => {
        e.stopPropagation(); // Prevenir que se active el onClick de la tarjeta

        // Crear el mensaje formateado de la propiedad
        const mensaje = `🏠 *${propiedad.tipo}* en ${propiedad.ubicacion}

💵 *Precio:* ${propiedad.moneda} ${propiedad.precio.toLocaleString()}
${propiedad.dormitorios > 0 ? `🛏 *Dormitorios:* ${propiedad.dormitorios}\n` : ''}${propiedad.banos > 0 ? `🛁 *Baños:* ${propiedad.banos}\n` : ''}${propiedad.cochera > 0 ? `🚗 *Cochera:* ${propiedad.cochera}\n` : ''}📏 *Superficie:* ${propiedad.superficie}m²
${propiedad.tipoOperacion ? `💼 *Operación:* ${propiedad.tipoOperacion}\n` : ''}
📍 *Ubicación:* ${propiedad.ubicacion}
${propiedad.descripcion ? `\n📝 ${propiedad.descripcion}\n` : ''}${propiedad.link ? `\n🔗 *Ver más:* ${propiedad.link}` : ''}`;

        // Copiar al portapapeles
        navigator.clipboard.writeText(mensaje).then(() => {
            setToastMessage('✅ Mensaje copiado al portapapeles');
            setToastType('success');
            setShowToast(true);
            
            // Ocultar automáticamente después de 3 segundos
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }).catch(err => {
            console.error('Error copiando al portapapeles:', err);
            setToastMessage('❌ Error al copiar el mensaje');
            setToastType('error');
            setShowToast(true);
            
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        });
    };

    // Cerrar filtros al hacer scroll
    useEffect(() => {
        const handleScroll = () => {
            if (showFiltros) {
                setShowFiltros(false);
            }
        };

        const scrollContainer = document.querySelector('.propiedades-scroll-container');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [showFiltros]);

    const cargarPropiedades = async () => {
        setLoading(true);
        try {
            console.log('🔄 Iniciando carga de propiedades...');
            
            const { data, error } = await supabaseClient
                .from('embeddingsagentesia')
                .select('*')
                .order('id', { ascending: false });

            if (error) {
                console.error('❌ Error cargando propiedades:', error);
                setPropiedades([]);
                setLoading(false);
                return;
            }

            console.log('✅ Propiedades cargadas desde BD:', data?.length || 0);

            if (!data || data.length === 0) {
                console.log('⚠️ No hay propiedades en la base de datos');
                setPropiedades([]);
                setLoading(false);
                return;
            }

            // Transformar datos de Supabase al formato del componente
            const propiedadesFormateadas = data.map(prop => {
                // Parsear raw_row si existe para obtener información adicional
                let rawData = {};
                try {
                    if (prop.raw_row) {
                        rawData = typeof prop.raw_row === 'string' ? JSON.parse(prop.raw_row) : prop.raw_row;
                    }
                } catch (e) {
                    console.warn('⚠️ Error parseando raw_row para propiedad', prop.id, ':', e);
                }

                return {
                    id: prop.id,
                    titulo: `${prop.tipopropiedad || 'Propiedad'} - ${prop.ubicacion || ''}`,
                    tipo: prop.tipopropiedad || 'Otro',
                    ubicacion: prop.ubicacion || 'Ubicación no especificada',
                    precio: parseFloat(prop.precio) || 0,
                    moneda: 'USD',
                    dormitorios: parseInt(prop.dormitorios) || 0,
                    banos: parseInt(rawData.banos || rawData.Banos || prop.banos) || 0,
                    cochera: parseInt(rawData.cocheras || rawData.Cocheras || prop.cocheras) || 0,
                    superficie: parseInt(prop.totalconstruido || prop.terreno) || 0,
                    imagen: prop.linkimagen || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
                    descripcion: prop.descripcion || `${prop.ambientes || 0} ambientes - ${prop.dormitorios || 0} dormitorios - ${prop.totalconstruido || 0}m² construidos`,
                    link: prop.link || null,
                    diasMercado: parseInt(prop.diasmercado) || 0,
                    tipoOperacion: prop.tipooperacion || 'Venta',
                    status: prop.status_listing || 'Activa'
                };
            });

            console.log('✅ Propiedades transformadas:', propiedadesFormateadas.length);
            console.log('📊 Primera propiedad:', propiedadesFormateadas[0]);
            
            setPropiedades(propiedadesFormateadas);
        } catch (error) {
            console.error('❌ Error en cargarPropiedades:', error);
            setPropiedades([]);
        } finally {
            setLoading(false);
            console.log('✅ Carga de propiedades finalizada');
        }
    };

    const propiedadesFiltradas = propiedades.filter(propiedad => {
        // Filtro por búsqueda
        const matchSearch = searchQuery === '' ||
            propiedad.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            propiedad.ubicacion.toLowerCase().includes(searchQuery.toLowerCase());

        // Filtro por tipo
        const matchTipo = filtros.tipo === 'todos' || propiedad.tipo === filtros.tipo;

        // Filtro por precio
        const matchPrecio = (
            (!filtros.precioMin || propiedad.precio >= parseInt(filtros.precioMin)) &&
            (!filtros.precioMax || propiedad.precio <= parseInt(filtros.precioMax))
        );



        // Filtro por tipo de operación
        const matchOperacion = filtros.operacion === 'todos' ||
            (propiedad.tipoOperacion || '').toLowerCase().includes(filtros.operacion.toLowerCase());

        // Filtro por estado
        const matchEstado = filtros.estado === 'todos' || propiedad.status === filtros.estado;

        return matchSearch && matchTipo && matchPrecio && matchOperacion && matchEstado;
    });

    const limpiarFiltros = () => {
        setFiltros({
            tipo: 'todos',
            precioMin: '',
            precioMax: '',
            operacion: 'todos',
            estado: 'todos'
        });
        setSearchQuery('');
    };

    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-6 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Barra de búsqueda y botón de filtros */}
                    <div className="flex gap-3 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar por título o ubicación..."
                                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <button
                            onClick={() => setShowFiltros(!showFiltros)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${showFiltros
                                    ? 'bg-white text-blue-600'
                                    : 'bg-white/20 hover:bg-white/30 text-white'
                                }`}
                        >
                            <Filter size={20} />
                            Filtros
                        </button>
                    </div>

                    {/* Panel de filtros mejorado */}
                    {showFiltros && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <div className="flex flex-wrap items-end gap-4 mb-4">
                                {/* Tipo de propiedad */}
                                <div className="flex-1 min-w-[150px] space-y-2">
                                    <label className="text-sm font-semibold block">Tipo de propiedad</label>
                                    <select
                                        value={filtros.tipo}
                                        onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-sm border-0 font-medium"
                                    >
                                        <option value="todos">Todos</option>
                                        {tiposUnicos.map(tipo => (
                                            <option key={tipo} value={tipo}>{tipo}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Operación */}
                                <div className="flex-1 min-w-[130px] space-y-2">
                                    <label className="text-sm font-semibold block">Operación</label>
                                    <select
                                        value={filtros.operacion}
                                        onChange={(e) => setFiltros({ ...filtros, operacion: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-sm border-0 font-medium"
                                    >
                                        <option value="todos">Todas</option>
                                        <option value="venta">Venta</option>
                                        <option value="alquiler">Alquiler</option>
                                    </select>
                                </div>

                                {/* Estado */}
                                <div className="flex-1 min-w-[130px] space-y-2">
                                    <label className="text-sm font-semibold block">Estado</label>
                                    <select
                                        value={filtros.estado}
                                        onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-sm border-0 font-medium"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="Activa">Activa</option>
                                        <option value="Reservada">Reservada</option>
                                    </select>
                                </div>

                                {/* Precio mínimo */}
                                <div className="flex-1 min-w-[130px] space-y-2">
                                    <label className="text-sm font-semibold block">Precio mín (USD)</label>
                                    <input
                                        type="number"
                                        value={filtros.precioMin}
                                        onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
                                        placeholder="Min"
                                        className="w-full px-3 py-2.5 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-sm border-0 font-medium placeholder:text-gray-400"
                                    />
                                </div>

                                {/* Precio máximo */}
                                <div className="flex-1 min-w-[130px] space-y-2">
                                    <label className="text-sm font-semibold block">Precio máx (USD)</label>
                                    <input
                                        type="number"
                                        value={filtros.precioMax}
                                        onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
                                        placeholder="Max"
                                        className="w-full px-3 py-2.5 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-sm border-0 font-medium placeholder:text-gray-400"
                                    />
                                </div>


                            </div>

                            {/* Botón limpiar filtros */}
                            <div className="flex justify-end">
                                <button
                                    onClick={limpiarFiltros}
                                    className="px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm"
                                >
                                    <X size={16} />
                                    Limpiar filtros
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6 propiedades-scroll-container">
                <div className="max-w-7xl mx-auto">
                    {/* Resultados */}
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-gray-600">
                            {propiedadesFiltradas.length} {propiedadesFiltradas.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Cargando propiedades...</p>
                        </div>
                    ) : propiedadesFiltradas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Building2 size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No se encontraron propiedades</h3>
                            <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
                            <button
                                onClick={limpiarFiltros}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {propiedadesFiltradas.map((propiedad) => (
                                <div
                                    key={propiedad.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                    onClick={() => onSelectPropiedad?.(propiedad)}
                                >
                                    {/* Imagen */}
                                    <div className="relative h-64 overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={propiedad.imagen}
                                            alt={propiedad.titulo}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';
                                            }}
                                        />
                                        {/* Badge de tipo */}
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                                            {propiedad.tipo}
                                        </div>
                                        {/* Badge de estado */}
                                        {propiedad.status && (
                                            <div className={`absolute top-3 right-3 px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 ${propiedad.status === 'Reservada'
                                                    ? 'bg-orange-500'
                                                    : propiedad.status === 'Activa'
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-500'
                                                }`}>
                                                <span className="w-2 h-2 bg-white rounded-full"></span>
                                                {propiedad.status}
                                            </div>
                                        )}
                                        {/* Badge de operación */}
                                        {propiedad.tipoOperacion && (
                                            <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-lg">
                                                {propiedad.tipoOperacion}
                                            </div>
                                        )}
                                        {/* Botón de compartir */}
                                        <button
                                            onClick={(e) => handleShareProperty(e, propiedad)}
                                            className="absolute bottom-3 right-3 p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 active:scale-95"
                                            title="Compartir propiedad"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-4">
                                        {/* Precio */}
                                        <div className="mb-3">
                                            <p className="text-2xl font-bold text-blue-600">
                                                {propiedad.moneda} {propiedad.precio.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Título */}
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                                            {propiedad.titulo}
                                        </h3>

                                        {/* Ubicación */}
                                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                                            <MapPin size={16} className="flex-shrink-0" />
                                            <p className="text-sm truncate">{propiedad.ubicacion}</p>
                                        </div>

                                        {/* Características */}
                                        <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                                            {propiedad.dormitorios > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Bed size={16} className="text-gray-500" />
                                                    <span>{propiedad.dormitorios}</span>
                                                </div>
                                            )}
                                            {propiedad.banos > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Bath size={16} className="text-gray-500" />
                                                    <span>{propiedad.banos}</span>
                                                </div>
                                            )}
                                            {propiedad.cochera > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Car size={16} className="text-gray-500" />
                                                    <span>{propiedad.cochera}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 ml-auto">
                                                <span className="font-semibold">{propiedad.superficie}m²</span>
                                            </div>
                                        </div>

                                        {/* Descripción */}
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                            {propiedad.descripcion}
                                        </p>

                                        {/* Días en mercado */}
                                        {propiedad.diasMercado > 0 && (
                                            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs text-gray-600">
                                                    {propiedad.diasMercado} {propiedad.diasMercado === 1 ? 'día' : 'días'} en mercado
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-50" style={{
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
                        toastType === 'success' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                            : 'bg-gradient-to-r from-red-500 to-rose-600'
                    } text-white transform transition-all duration-300`}>
                        {toastType === 'success' ? (
                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <p className="font-semibold text-sm">{toastMessage}</p>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
