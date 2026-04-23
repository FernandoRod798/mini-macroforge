import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Client } from '@/types/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Traduce el valor del goal a texto legible
export function goalLabel(goal: Client['goal']): string {
  if (goal === 'gain_muscle') return 'Ganar músculo'
  if (goal === 'lose_fat')    return 'Perder grasa'
  return 'Mantener'
}