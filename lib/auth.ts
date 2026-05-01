// lib/auth.ts
// Gestión de usuarios en localStorage

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  photo?: string; // base64 dataURL o "" / undefined si no tiene
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  photo?: string;
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
    photo: "",
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
    photo: user.photo || "",
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

// Persiste la sesión actualizada en localStorage
function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Devuelve el usuario actual (con todos sus datos, no solo la sesión)
export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find((u) => u.id === session.userId) || null;
}

// ---------- Actualización de perfil ----------

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  photo?: string; // dataURL base64; pasar "" para quitar la foto
}

export function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): { success: boolean; error?: string; session?: AuthSession } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { success: false, error: "Usuario no encontrado." };

  const user = users[idx];

  // Validaciones
  if (input.name !== undefined) {
    const trimmed = input.name.trim();
    if (!trimmed)
      return { success: false, error: "El nombre no puede estar vacío." };
    if (trimmed.length < 2)
      return {
        success: false,
        error: "El nombre debe tener al menos 2 caracteres.",
      };
  }

  if (input.email !== undefined) {
    const trimmedEmail = input.email.trim().toLowerCase();
    if (!trimmedEmail)
      return { success: false, error: "El email no puede estar vacío." };

    // Validación básica de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail))
      return { success: false, error: "El email no es válido." };

    // Validar duplicados (ignorando al usuario actual)
    const duplicate = users.find(
      (u) => u.id !== userId && u.email.toLowerCase() === trimmedEmail,
    );
    if (duplicate)
      return {
        success: false,
        error: "Ya existe otra cuenta con ese email.",
      };
  }

  // Aplicar cambios
  const updated: User = {
    ...user,
    name: input.name !== undefined ? input.name.trim() : user.name,
    email:
      input.email !== undefined ? input.email.trim().toLowerCase() : user.email,
    photo: input.photo !== undefined ? input.photo : user.photo,
  };

  users[idx] = updated;
  saveUsers(users);

  // Actualizar sesión
  const newSession: AuthSession = {
    userId: updated.id,
    email: updated.email,
    name: updated.name,
    photo: updated.photo || "",
  };
  saveSession(newSession);

  return { success: true, session: newSession };
}

export function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): { success: boolean; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { success: false, error: "Usuario no encontrado." };

  const user = users[idx];

  if (user.passwordHash !== simpleHash(currentPassword))
    return { success: false, error: "La contraseña actual es incorrecta." };

  if (newPassword.length < 6)
    return {
      success: false,
      error: "La nueva contraseña debe tener al menos 6 caracteres.",
    };

  if (currentPassword === newPassword)
    return {
      success: false,
      error: "La nueva contraseña debe ser distinta de la actual.",
    };

  users[idx] = { ...user, passwordHash: simpleHash(newPassword) };
  saveUsers(users);

  return { success: true };
}

// Clave de contactos única por usuario
export function getContactsKey(userId: string): string {
  return `agenda_contacts_${userId}`;
}
