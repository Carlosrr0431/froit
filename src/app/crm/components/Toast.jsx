import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Componente Toast para notificaciones
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de toast: 'success', 'error', 'warning', 'info'
 * @param {boolean} isVisible - Si el toast está visible
 * @param {function} onClose - Función para cerrar el toast
 */
export default function Toast({ message, type = 'info', isVisible, onClose }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000); // Auto-cerrar después de 4 segundos
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const typeStyles = {
        success: {
            bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
            border: 'border-green-200/50',
            icon: 'text-green-600',
            iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
            iconComponent: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        error: {
            bg: 'bg-gradient-to-r from-red-50 to-rose-50',
            border: 'border-red-200/50',
            icon: 'text-red-600',
            iconBg: 'bg-gradient-to-br from-red-100 to-rose-100',
            iconComponent: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )
        },
        warning: {
            bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
            border: 'border-amber-200/50',
            icon: 'text-amber-600',
            iconBg: 'bg-gradient-to-br from-amber-100 to-orange-100',
            iconComponent: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
            border: 'border-blue-200/50',
            icon: 'text-blue-600',
            iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
            iconComponent: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    };

    const style = typeStyles[type] || typeStyles.info;

    return (
        <div className="fixed top-4 right-4 z-50 pointer-events-none animate-slide-in-right">
            <div className={`${style.bg} ${style.border} border-2 rounded-2xl shadow-2xl p-4 flex items-start gap-3 min-w-[320px] max-w-md pointer-events-auto backdrop-blur-md`}>
                <div className={`${style.iconBg} ${style.icon} w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                    {style.iconComponent}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`${style.icon} text-sm font-medium leading-relaxed break-words`}>
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className={`${style.icon} hover:opacity-70 transition-opacity flex-shrink-0 p-1 hover:bg-black/5 rounded-lg`}
                    aria-label="Cerrar notificación"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
