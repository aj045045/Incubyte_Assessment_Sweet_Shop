import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addTokenAndRole() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    document.cookie = `token=${token}; path=/`;
    document.cookie = `role=${role}; path=/`;
  }
}

export function removeTokenAndRole() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

export function getTokenAndRole(): { token: string | null; role: string | null } {
  // Try localStorage first
  let token = localStorage.getItem("token");
  let role = localStorage.getItem("role");

  // Fallback to cookies if not found in localStorage
  if (!token || !role) {
    const cookieMap = document.cookie
      .split("; ")
      .reduce<Record<string, string>>((acc, cookieStr) => {
        const [key, value] = cookieStr.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});

    token = token || cookieMap["token"] || null;
    role = role || cookieMap["role"] || null;
  }

  return { token, role };
}

