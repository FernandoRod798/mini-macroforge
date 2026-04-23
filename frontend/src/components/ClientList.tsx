import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useClientContext } from '@/context/ClientContext'
import { goalLabel } from '@/lib/utils'
import type { Client } from '@/types/client'

interface ClientListProps {
  clients: Client[]
  loading: boolean
}

function ClientList({ clients, loading }: ClientListProps) {
  const navigate = useNavigate()
  // Leemos setSelectedClient del contexto
  // sin que nadie nos lo haya pasado como prop
  const { setSelectedClient } = useClientContext()

  function handleClientClick(client: Client) {
    // Guardamos el cliente en el contexto antes de navegar
    // Así ClientDetail puede leerlo instantáneamente
    // sin esperar la llamada al API
    setSelectedClient(client)
    navigate(`/clients/${client.id}`)
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">Cargando clientes...</p>
  }

  if (clients.length === 0) {
    return <p className="text-muted-foreground text-sm">No hay clientes registrados aún.</p>
  }

  return (
    <div className="space-y-3">
      {clients.map(client => (
        <Card
          key={client.id}
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => handleClientClick(client)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                {client.name}
              </CardTitle>
              <Badge variant="outline">{goalLabel(client.goal)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </CardHeader>

          <Separator />

          <CardContent className="pt-3">
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-muted-foreground">BMR</p>
                <p className="text-sm font-medium">{client.bmr} kcal</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">TDEE</p>
                <p className="text-sm font-medium">{client.tdee} kcal</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Objetivo</p>
                <p className="text-sm font-medium">{client.target_calories} kcal</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Comidas/día</p>
                <p className="text-sm font-medium">{client.meals_per_day}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ClientList