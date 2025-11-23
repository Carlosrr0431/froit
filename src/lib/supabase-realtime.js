import { createClient } from "@supabase/supabase-js"

// Singleton global para Supabase Realtime - Una sola instancia
let supabaseRealtimeInstance = null

export const getSupabaseRealtimeClient = () => {
    if (typeof window === 'undefined') {
        return null
    }

    if (!supabaseRealtimeInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON
        
        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('❌ Supabase: Variables de entorno no configuradas')
            return null
        }

        supabaseRealtimeInstance = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            },
            realtime: {
                params: {
                    eventsPerSecond: 10
                }
            }
        })

        console.log('✅ Supabase Realtime Client inicializado (singleton)')
    }

    return supabaseRealtimeInstance
}

// Limpiar instancia si es necesario
export const resetSupabaseRealtimeClient = () => {
    if (supabaseRealtimeInstance) {
        supabaseRealtimeInstance.removeAllChannels()
        supabaseRealtimeInstance = null
        console.log('🧹 Supabase Realtime Client limpiado')
    }
}
