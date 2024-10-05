import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 6);

export function generateShortId(): string {
  return nanoid();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
