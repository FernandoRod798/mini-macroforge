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
import type { Exercise } from '@/types/client'

// El formulario solo necesita name, sets y reps
// id y client_id los maneja el backend
type ExerciseFormData = Omit<Exercise, 'id' | 'client_id'>

interface ExerciseFormProps {
  clientId: number      // para saber a qué cliente asignar el ejercicio
  onCreated: () => void // para recargar los datos del cliente al guardar
}

const INITIAL_FORM: ExerciseFormData = {
  name: '',
  sets: 3,
  reps: 10,
}

function ExerciseForm({ clientId, onCreated }: ExerciseFormProps) {
  const [formData, setFormData] = useState<ExerciseFormData>(INITIAL_FORM)
  const [open, setOpen]         = useState<boolean>(false)
  const [loading, setLoading]   = useState<boolean>(false)

  // Handler genérico — mismo patrón que ClientForm
  // un solo handler para todos los inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value,
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    await clientService.addExercise(clientId, formData)
    setLoading(false)
    setFormData(INITIAL_FORM)
    setOpen(false)
    onCreated() // avisa al padre para recargar los datos del cliente
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">+ Agregar ejercicio</Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Agregar ejercicio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>Nombre del ejercicio</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Press de banca, Sentadilla..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Series</Label>
              <Input
                name="sets"
                type="number"
                value={formData.sets}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label>Repeticiones</Label>
              <Input
                name="reps"
                type="number"
                value={formData.reps}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar ejercicio'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExerciseForm