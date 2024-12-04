import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// cn sirve para concatenar estilos que vengas por porps
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
