"use client"

import { useState, useEffect } from 'react';

/**
 * Componente para mostrar vista previa de enlaces con metadatos Open Graph
 */
export default function LinkPreview({ url, isOutgoing }) {
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        const fetchMetadata = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 segundos timeout
                
                const response = await fetch(`/api/og-image?url=${encodeURIComponent(url)}`, {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    console.warn(`Link preview response status: ${response.status}`);
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Link preview data:', data); // Debug
                
                if (isMounted && data.success && (data.title || data.ogImage)) {
                    setMetadata(data);
                } else if (isMounted) {
                    console.warn('Link preview data not valid:', data);
                }
            } catch (err) {
                // Silenciar errores, simplemente no mostrar vista previa
                if (err.name === 'AbortError') {
                    console.warn('Link preview timeout for:', url);
                } else {
                    console.warn('Link preview error:', err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (url) {
            fetchMetadata();
        }

        return () => {
            isMounted = false;
        };
    }, [url]);

    // Si no hay metadata después de cargar, mostrar solo enlace simple
    if (!loading && !metadata) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-sm underline break-all ${
                    isOutgoing ? 'text-blue-700 hover:text-blue-800' : 'text-blue-600 hover:text-blue-700'
                }`}
            >
                {url}
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
        );
    }

    // Si aún está cargando, mostrar enlace simple temporalmente
    if (loading) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-sm underline break-all ${
                    isOutgoing ? 'text-blue-700 hover:text-blue-800' : 'text-blue-600 hover:text-blue-700'
                }`}
            >
                {url}
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
        );
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md ${
                isOutgoing 
                    ? 'border-green-200 bg-white/60 hover:bg-white' 
                    : 'border-gray-200 bg-gray-50 hover:bg-white'
            } max-w-[320px] group`}
        >
            {/* Imagen de vista previa */}
            {metadata?.ogImage && (
                <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={metadata.ogImage}
                        alt={metadata.title || 'Vista previa'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Contenido de la vista previa */}
            <div className={`p-3 ${isOutgoing ? 'bg-white/60' : 'bg-gray-50'}`}>
                {/* Dominio */}
                {metadata?.domain && (
                    <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">
                        {metadata.domain}
                    </p>
                )}

                {/* Título */}
                {metadata?.title && (
                    <h3 className={`text-sm font-semibold mb-1.5 line-clamp-2 ${
                        isOutgoing ? 'text-gray-900' : 'text-gray-900'
                    }`}>
                        {metadata.title}
                    </h3>
                )}

                {/* Descripción */}
                {metadata?.description && (
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {metadata.description}
                    </p>
                )}

                {/* Ícono de enlace externo */}
                <div className="flex items-center gap-1.5 mt-2">
                    <svg 
                        className={`w-3.5 h-3.5 ${
                            isOutgoing ? 'text-green-600' : 'text-blue-600'
                        } group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className={`text-xs font-medium ${
                        isOutgoing ? 'text-green-700' : 'text-blue-600'
                    }`}>
                        Abrir enlace
                    </span>
                </div>
            </div>
        </a>
    );
}
