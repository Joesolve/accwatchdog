import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "SLE"): string {
  return new Intl.NumberFormat("en-SL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateSlug(text: string): string {
  const base = slugify(text);
  const suffix = Date.now().toString(36).slice(-4);
  return `${base}-${suffix}`;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export function generateReferenceNumber(prefix: string = "ACC"): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export const SIERRA_LEONE_REGIONS = [
  "Western Area Urban",
  "Western Area Rural",
  "Bo",
  "Bonthe",
  "Moyamba",
  "Pujehun",
  "Kenema",
  "Kailahun",
  "Kono",
  "Bombali",
  "Falaba",
  "Koinadugu",
  "Tonkolili",
  "Kambia",
  "Karene",
  "Port Loko",
] as const;

export const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Land",
  "Vehicle",
  "Equipment",
  "Other",
] as const;

export const PROPERTY_STATUSES = [
  "Available",
  "Under Auction",
  "Sold",
  "Reserved",
  "Withdrawn",
] as const;
