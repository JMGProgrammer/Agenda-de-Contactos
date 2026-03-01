// lib/auth.ts
// Gestión de usuarios en localStorage

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
}

const USERS_KEY = "agenda_users";
const SESSION_KEY = "agenda_session";

// Simple hash (no usar en producción real — válido para portafolio/demo)
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(
  name: string,
  email: string,
  password: string,
): { success: boolean; error?: string } {
  const users = getUsers();
  const exists = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (exists) return { success: false, error: "El email ya está registrado." };

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  return { success: true };
}

export function loginUser(
  email: string,
  password: string,
): { success: boolean; session?: AuthSession; error?: string } {
  const users = getUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.passwordHash === simpleHash(password),
  );

  if (!user)
    return { success: false, error: "Email o contraseña incorrectos." };

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, session };
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Clave de contactos única por usuario
export function getContactsKey(userId: string): string {
  return `agenda_contacts_${userId}`;
}
