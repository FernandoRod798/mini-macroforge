export interface Client {
    id: number
    name: string
    email: string
    age: number
    weight: number
    height: number
    sex: string
    activity_level: string
    training_hours: number
    meals_per_day: number
    preferred_foods: string
    goal: 'gain_muscle' | 'lose_fat' | 'maintain'
    bmr: number
    tdee: number
    target_calories: number
    created_at: string
}

export interface Exercise {
    id: number
    name: string
    sets: number
    reps: number
    client_id: number
}

export interface Meal {
    id: number
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    client_id: number
}