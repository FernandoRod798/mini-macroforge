import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { clientService } from '@/services/clientService'
import type { Client } from '@/types/client'

// El tipo del formulario es Client sin los campos que genera el backend
type FormData = Omit<Client, 'id' | 'bmr' | 'tdee' | 'target_calories' | 'created_at'>

// Props que recibe este componente desde su padre
// onCreated se llama cuando el cliente se crea exitosamente
// para que el padre pueda refrescar la lista
interface ClientFormProps {
    onCreated: () => void
}

// Valores iniciales del formulario — todos vacíos o con default lógico
// Tenerlos en una constante permite resetear el form fácilmente
const INITIAL_FORM: FormData = {
    name: '',
    email: '',
    age: 0,
    weight: 0,
    height: 0,
    sex: 'male',
    activity_level: 'moderate',
    training_hours: 0,
    meals_per_day: 3,
    preferred_foods: '',
    goal: 'maintain',
}

function ClientForm({ onCreated }: ClientFormProps) {
    // Un solo useState maneja todos los campos del formulario
    // En lugar de tener 10 useState separados, usamos un objeto
    // Esto es más limpio y fácil de resetear
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    // Handler genérico para inputs de texto y número
    // e.target.name corresponde al atributo name del input
    // e.target.value es lo que el usuario escribió
    // Con spread ...prev conservamos todos los campos anteriores
    // y solo actualizamos el que cambió
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            // Si el input es numérico lo convertimos a number
            // porque los inputs HTML siempre devuelven strings
            [name]: e.target.type === 'number' ? Number(value) : value,
        }))
    }

    // Handler para los Select de shadcn — reciben el valor directo
    // no un evento como los inputs normales
    function handleSelect(name: keyof FormData, value: string) {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit() {
        setLoading(true)
        await clientService.create(formData)
        setLoading(false)
        setFormData(INITIAL_FORM) // resetea el formulario
        setOpen(false)            // cierra el dialog
        onCreated()               // avisa al padre para que recargue la lista
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Nuevo cliente</Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Registrar cliente</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">

                    {/* Datos personales */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Nombre</Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Juan Pérez"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="juan@email.com"
                            />
                        </div>
                    </div>

                    {/* Datos físicos */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label>Edad</Label>
                            <Input
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Peso (kg)</Label>
                            <Input
                                name="weight"
                                type="number"
                                value={formData.weight}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Estatura (cm)</Label>
                            <Input
                                name="height"
                                type="number"
                                value={formData.height}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Sexo y objetivo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Sexo</Label>
                            <Select
                                value={formData.sex}
                                onValueChange={val => handleSelect('sex', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Masculino</SelectItem>
                                    <SelectItem value="female">Femenino</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Objetivo</Label>
                            <Select
                                value={formData.goal}
                                onValueChange={val => handleSelect('goal', val as Client['goal'])}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gain_muscle">Ganar músculo</SelectItem>
                                    <SelectItem value="lose_fat">Perder grasa</SelectItem>
                                    <SelectItem value="maintain">Mantener</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Actividad */}
                    <div className="space-y-1">
                        <Label>Nivel de actividad</Label>
                        <Select
                            value={formData.activity_level}
                            onValueChange={val => handleSelect('activity_level', val)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sedentary">Sedentario — sin ejercicio</SelectItem>
                                <SelectItem value="light">Ligero — 1 a 3 días/semana</SelectItem>
                                <SelectItem value="moderate">Moderado — 3 a 5 días/semana</SelectItem>
                                <SelectItem value="active">Activo — 6 a 7 días/semana</SelectItem>
                                <SelectItem value="very_active">Muy activo — trabajo físico + ejercicio</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Entrenamiento y alimentación */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Horas de entrenamiento/semana</Label>
                            <Input
                                name="training_hours"
                                type="number"
                                value={formData.training_hours}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Comidas al día</Label>
                            <Input
                                name="meals_per_day"
                                type="number"
                                value={formData.meals_per_day}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Alimentos preferidos */}
                    <div className="space-y-1">
                        <Label>Alimentos preferidos</Label>
                        <Input
                            name="preferred_foods"
                            value={formData.preferred_foods}
                            onChange={handleChange}
                            placeholder="pollo, arroz, huevos, avena..."
                        />
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar cliente'}
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ClientForm