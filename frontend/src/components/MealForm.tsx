import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { clientService } from '@/services/clientService'
import type { Meal } from '@/types/client'

type MealFormData = Omit<Meal, 'id' | 'client_id'>

interface MealFormProps {
    clientId: number
    onCreated: () => void
}

const INITIAL_FORM: MealFormData = {
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
}

function MealForm({ clientId, onCreated }: MealFormProps) {
    const [formData, setFormData] = useState<MealFormData>(INITIAL_FORM)
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: e.target.type === 'number' ? Number(value) : value,
        }))
    }

    async function handleSubmit() {
        setLoading(true)
        await clientService.addMeal(clientId, formData)
        setLoading(false)
        setFormData(INITIAL_FORM)
        setOpen(false)
        onCreated()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">+ Agregar comida</Button>
            </DialogTrigger>

            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Agregar comida</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <Label>Nombre de la comida</Label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Desayuno, Almuerzo, Cena..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Calorías</Label>
                            <Input
                                name="calories"
                                type="number"
                                value={formData.calories}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Proteína (g)</Label>
                            <Input
                                name="protein"
                                type="number"
                                value={formData.protein}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Carbohidratos (g)</Label>
                            <Input
                                name="carbs"
                                type="number"
                                value={formData.carbs}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Grasa (g)</Label>
                            <Input
                                name="fat"
                                type="number"
                                value={formData.fat}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar comida'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MealForm