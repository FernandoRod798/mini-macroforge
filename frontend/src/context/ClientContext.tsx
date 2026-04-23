import { createContext, useContext, useState } from 'react'
import type { Client } from '@/types/client'

// Define qué datos y funciones viven en el contexto
interface ClientContextType {
    selectedClient: Client | null
    setSelectedClient: (client: Client | null) => void
}

// Crea el contexto con un valor inicial null
// createContext es el contenedor — no guarda datos todavía
const ClientContext = createContext<ClientContextType | null>(null)

// El Provider es el componente que envuelve la app
// y hace que el contexto esté disponible para todos sus hijos
export function ClientProvider({ children }: { children: React.ReactNode }) {
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)

    return (
        <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
            {children}
        </ClientContext.Provider>
    )
}

// Hook personalizado para leer el contexto
// En lugar de llamar useContext(ClientContext) en cada componente
// llamamos useClientContext() — más limpio y con validación incluida
export function useClientContext(): ClientContextType {
    const context = useContext(ClientContext)

    // Si alguien usa el hook fuera del Provider, lanza un error claro
    // En lugar de un error críptico de "cannot read null"
    if (!context) {
        throw new Error('useClientContext debe usarse dentro de ClientProvider')
    }

    return context
}