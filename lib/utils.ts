import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea una fecha en formato YYYY-MM-DD a formato legible
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formatea una hora en formato HH:MM:SS a HH:MM
 */
export function formatTime(time: string): string {
  return time.substring(0, 5); // Retorna HH:MM
}
