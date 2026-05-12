"use client";

export type SessionUser = {
  user_id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
};

const SESSION_KEY = "user";

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SessionUser;
    if (!parsed?.user_id || !parsed?.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearSessionUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
