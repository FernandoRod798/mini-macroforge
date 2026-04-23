import type { Client, Exercise, Meal } from '@/types/client'

const API_URL = 'https://mini-macroforge-production.up.railway.app'

// Omit<> es un utilitario de TypeScript que crea un tipo nuevo
// basado en uno existente pero removiendo campos específicos.
// Ej: Omit<Client, 'id' | 'bmr'> = Client sin los campos id y bmr.
// Lo usamos en create() porque esos campos los genera el backend,
// no los manda el frontend.
type CreateClientData = Omit<Client, 'id' | 'bmr' | 'tdee' | 'target_calories' | 'created_at'>
type CreateExerciseData = Omit<Exercise, 'id' | 'client_id'>
type CreateMealData = Omit<Meal, 'id' | 'client_id'>

// Tipo del detalle de un cliente — extiende Client agregando
// sus ejercicios y comidas anidados en el mismo objeto
type ClientDetail = Client & {
    exercises: Exercise[]
    meals: Meal[]
}

export const clientService = {

    // Obtiene la lista completa de clientes ordenada por fecha de registro
    async getAll(): Promise<Client[]> {
        const res = await fetch(`${API_URL}/clients`)
        return res.json()
    },

    // Obtiene el detalle de un cliente por su id,
    // incluyendo su rutina y plan de alimentación
    async getById(id: number): Promise<ClientDetail> {
        const res = await fetch(`${API_URL}/clients/${id}`)
        return res.json()
    },

    // Crea un cliente nuevo y devuelve el objeto creado
    // con su id y cálculos de BMR/TDEE ya incluidos
    async create(data: CreateClientData): Promise<Client> {
        const res = await fetch(`${API_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        return res.json()
    },

    // Borra un cliente y todos sus ejercicios y comidas
    // gracias al cascade delete definido en el modelo de Flask
    async delete(id: number): Promise<void> {
        await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE' })
    },

    // Agrega un ejercicio a la rutina de un cliente específico
    async addExercise(clientId: number, data: CreateExerciseData): Promise<Exercise> {
        const res = await fetch(`${API_URL}/clients/${clientId}/exercises`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        return res.json()
    },

    // Agrega una comida al plan de alimentación de un cliente
    async addMeal(clientId: number, data: CreateMealData): Promise<Meal> {
        const res = await fetch(`${API_URL}/clients/${clientId}/meals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        return res.json()
    },
}