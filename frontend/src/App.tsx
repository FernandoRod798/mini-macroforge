import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import ClientList from './components/ClientList'
import ClientForm from './components/ClientForm'
import ClientDetail from './pages/ClientDetail'
import { clientService } from '@/services/clientService'
import type { Client } from '@/types/client'

function App() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const loadClients = useCallback(async () => {
    const data = await clientService.getAll()
    setClients(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  return (
    <Routes>
      {/* Ruta principal — lista de clientes */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-background text-foreground p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold">Mini MacroForge</h1>
                <p className="text-muted-foreground mt-1">Coach Panel</p>
              </div>
              <ClientForm onCreated={loadClients} />
            </div>
            <h2 className="text-lg font-medium mb-4">Clientes</h2>
            <ClientList clients={clients} loading={loading} />
          </div>
        }
      />

      {/* Ruta de detalle — :id es el parámetro dinámico */}
      <Route path="/clients/:id" element={<ClientDetail />} />
    </Routes>
  )
}

export default App