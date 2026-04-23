import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { clientService } from '@/services/clientService'
import { useClientContext } from '@/context/ClientContext'
import { goalLabel } from '@/lib/utils'
import ExerciseForm from '@/components/ExerciseForm'
import MealForm from '@/components/MealForm'
import type { Client, Exercise, Meal } from '@/types/client'

type ClientDetail = Client & {
    exercises: Exercise[]
    meals: Meal[]
}

function ClientDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    // Leemos el cliente seleccionado del contexto
    // Tiene los datos básicos del cliente inmediatamente
    // sin esperar la llamada al API
    const { selectedClient } = useClientContext()

    const [client, setClient] = useState<ClientDetail | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const loadClient = useCallback(async () => {
        if (!id) return
        setLoading(true)
        const data = await clientService.getById(Number(id))
        setClient(data)
        setLoading(false)
    }, [id])

    useEffect(() => {
        loadClient()
    }, [loadClient])

    // Mientras carga el detalle completo, muestra el nombre
    // que ya tenemos en el contexto — mejor experiencia de usuario
    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground p-8 max-w-3xl mx-auto">
                <Button variant="ghost" className="mb-6 pl-0" onClick={() => navigate('/')}>
                    ← Volver
                </Button>
                {selectedClient && (
                    <h1 className="text-2xl font-semibold">{selectedClient.name}</h1>
                )}
                <p className="text-muted-foreground text-sm mt-2">Cargando detalle...</p>
            </div>
        )
    }

    if (!client) {
        return <p className="text-muted-foreground text-sm p-8">Cliente no encontrado.</p>
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-8 max-w-3xl mx-auto">

            <Button variant="ghost" className="mb-6 pl-0" onClick={() => navigate('/')}>
                ← Volver
            </Button>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">{client.name}</h1>
                    <p className="text-muted-foreground mt-1">{client.email}</p>
                </div>
                <Badge variant="outline">{goalLabel(client.goal)}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">BMR</p>
                        <p className="text-xl font-semibold mt-1">{client.bmr}</p>
                        <p className="text-xs text-muted-foreground">kcal en reposo</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">TDEE</p>
                        <p className="text-xl font-semibold mt-1">{client.tdee}</p>
                        <p className="text-xs text-muted-foreground">kcal gasto total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">Objetivo calórico</p>
                        <p className="text-xl font-semibold mt-1">{client.target_calories}</p>
                        <p className="text-xs text-muted-foreground">kcal por día</p>
                    </CardContent>
                </Card>
            </div>

            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Rutina</h2>
                    <ExerciseForm clientId={client.id} onCreated={loadClient} />
                </div>

                {client.exercises.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Sin ejercicios asignados aún.</p>
                ) : (
                    <div className="space-y-2">
                        {client.exercises.map(ex => (
                            <Card key={ex.id}>
                                <CardContent className="py-3 flex items-center justify-between">
                                    <p className="font-medium text-sm">{ex.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {ex.sets} series × {ex.reps} reps
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            <Separator className="mb-8" />

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Plan de alimentación</h2>
                    <MealForm clientId={client.id} onCreated={loadClient} />
                </div>

                {client.meals.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Sin comidas asignadas aún.</p>
                ) : (
                    <div className="space-y-2">
                        {client.meals.map(meal => (
                            <Card key={meal.id}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{meal.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 flex gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Calorías</p>
                                        <p className="text-sm font-medium">{meal.calories}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Proteína</p>
                                        <p className="text-sm font-medium">{meal.protein}g</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Carbos</p>
                                        <p className="text-sm font-medium">{meal.carbs}g</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Grasa</p>
                                        <p className="text-sm font-medium">{meal.fat}g</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

        </div>
    )
}

export default ClientDetail