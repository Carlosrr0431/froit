// Funciones utilitarias del CRM

/**
 * Verifica si un mensaje es de un grupo
 */
export function isGroupMessage(remoteJid) {
    return remoteJid?.includes('@g.us');
}

/**
 * Extrae el número de teléfono de un JID
 */
export function extractPhoneNumber(jid) {
    if (!jid) return null;
    const match = jid.match(/(\d+)/);
    return match ? match[1] : null;
}

/**
 * Normaliza un número de teléfono
 */
export function normalizePhoneNumber(phone) {
    if (!phone) return '';
    return String(phone).trim().replace(/[@].*$/, '').replace(/[^0-9]/g, '');
}

/**
 * Formatea una fecha para mostrarla en el chat
 */
export function formatChatDate(date) {
    const now = new Date();
    const messageDate = new Date(date);
    
    const isToday = now.toDateString() === messageDate.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === messageDate.toDateString();
    
    if (isToday) {
        return `Hoy ${messageDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    } else if (isYesterday) {
        return `Ayer ${messageDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    } else {
        return messageDate.toLocaleDateString('es-AR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Obtiene las iniciales de un nombre
 */
export function getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

/**
 * Genera un color aleatorio para avatares
 */
export function getRandomColor(seed) {
    const colors = [
        '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
    ];
    
    if (!seed) return colors[Math.floor(Math.random() * colors.length)];
    
    // Generar un índice basado en el seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
}
