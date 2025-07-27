import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function syncLocalStorageToCookies() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    document.cookie = `token=${token}; path=/`;
    document.cookie = `role=${role}; path=/`;
  }
}
