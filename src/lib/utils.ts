import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Deterministically format price with Vietnamese thousand separator (.)
 * This prevents SSR hydration mismatches across different server and browser locales.
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || isNaN(Number(price))) return '0';
  const num = Math.round(Number(price));
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
