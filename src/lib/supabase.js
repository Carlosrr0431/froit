import { createClient } from '@supabase/supabase-js'

// Configuración del cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltan variables de entorno de Supabase. Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON')
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
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

// Helper para verificar conexión
export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabaseClient
            .from('email_campaigns')
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
