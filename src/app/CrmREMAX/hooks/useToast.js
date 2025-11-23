import { useState, useCallback } from 'react';

/**
 * Hook para manejar el estado y funciones del Toast
 */
export function useToast() {
    const [toastState, setToastState] = useState({
        isVisible: false,
        message: '',
        type: 'info'
    });

    const showToast = useCallback((message, type = 'info') => {
        setToastState({
            isVisible: true,
            message,
            type
        });
    }, []);

    const hideToast = useCallback(() => {
        setToastState(prev => ({ ...prev, isVisible: false }));
    }, []);

    return {
        toastState,
        showToast,
        hideToast
    };
}
