import { createClient } from '@supabase/supabase-js'

// Configuración del cliente de Supabase
// Intenta primero las variables sin prefijo (para API routes server-side)
// Luego las con prefijo NEXT_PUBLIC_ (para client-side)
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON

// Cliente de Supabase (se creará solo si hay variables de entorno)
let supabaseClient = null

if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
        realtime: {
            params: {
                eventsPerSecond: 10
            }
        }
    })
    
    console.log('✅ Supabase client initialized with URL:', supabaseUrl?.substring(0, 30) + '...')
} else if (typeof window !== 'undefined') {
    // Solo mostrar error en el cliente, no en build
    console.warn('⚠️ Faltan variables de entorno de Supabase. Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON')
} else {
    // En el servidor, mostrar qué variables faltan
    console.warn('⚠️ Supabase env vars missing. URL:', !!supabaseUrl, 'Key:', !!supabaseAnonKey)
}

export { supabaseClient }

// Helper para verificar conexión
export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabaseClient
            .from('froit_email_campaigns')
            .select('count')
            .limit(1)
        
        if (error) {
            console.error('Error conectando a Supabase:', error)
            return false
        }
        
        console.log('✅ Conexión a Supabase exitosa')
        return true
    } catch (err) {
        console.error('Error al testear conexión:', err)
        return false
    }
}
