import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматирование даты в русском формате
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

/**
 * Форматирование числа с разделителем тысяч
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("ru-RU").format(num);
}
