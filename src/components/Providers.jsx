"use client"

import { SessionProvider } from 'next-auth/react'

/**
 * Providers - Proveedor de contextos globales
 * Envuelve la aplicación con los providers necesarios
 */
export default function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
