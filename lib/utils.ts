import { clsx, type ClassValue } from "clsx"
import crypto from "crypto"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex")
}
