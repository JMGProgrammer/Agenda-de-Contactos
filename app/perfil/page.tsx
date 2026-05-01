"use client";
// app/perfil/page.tsx

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  updateProfile,
  changePassword,
  getCurrentUser,
} from "@/lib/auth";
import { processProfileImage, MAX_FILE_SIZE_MB } from "@/lib/image";
import Avatar from "@/components/Avatar";

type Banner =
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | null;

export default function PerfilPage() {
  const { session, loading, setSession } = useAuth();
  const router = useRouter();

  // Hidratar el formulario con los datos del usuario actual.
  // Usamos un initializer perezoso (corre solo en el cliente) para evitar
  // setState dentro de un effect, que en React 19 dispara warnings.
  const initialUser = () => {
    if (typeof window === "undefined") return null;
    return getCurrentUser();
  };
  const [name, setName] = useState(() => initialUser()?.name ?? "");
  const [email, setEmail] = useState(() => initialUser()?.email ?? "");
  const [photo, setPhoto] = useState<string>(
    () => initialUser()?.photo ?? "",
  );
  const [initialName, setInitialName] = useState(
    () => initialUser()?.name ?? "",
  );
  const [initialEmail, setInitialEmail] = useState(
    () => initialUser()?.email ?? "",
  );
  const [initialPhoto, setInitialPhoto] = useState<string>(
    () => initialUser()?.photo ?? "",
  );

  // Cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // UI state
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [profileBanner, setProfileBanner] = useState<Banner>(null);
  const [passwordBanner, setPasswordBanner] = useState<Banner>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect si no hay sesión
  useEffect(() => {
    if (!loading && !session) router.push("/login");
  }, [session, loading, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profileChanged =
    name.trim() !== initialName ||
    email.trim().toLowerCase() !== initialEmail ||
    photo !== initialPhoto;

  // ---- Foto ----
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reseteamos el input para permitir volver a elegir el mismo archivo si es necesario
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;

    setProfileBanner(null);
    setProcessingImage(true);
    const result = await processProfileImage(file);
    setProcessingImage(false);

    if (!result.success || !result.dataUrl) {
      setProfileBanner({
        kind: "error",
        text: result.error || "No se pudo cargar la imagen.",
      });
      return;
    }
    setPhoto(result.dataUrl);
  }

  function handleRemovePhoto() {
    setPhoto("");
    setProfileBanner(null);
  }

  // ---- Guardar perfil ----
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setProfileBanner(null);

    setSavingProfile(true);
    const result = updateProfile(session.userId, {
      name,
      email,
      photo,
    });
    setSavingProfile(false);

    if (!result.success || !result.session) {
      setProfileBanner({
        kind: "error",
        text: result.error || "No se pudo guardar.",
      });
      return;
    }

    // Actualizar sesión global
    setSession(result.session);
    setInitialName(result.session.name);
    setInitialEmail(result.session.email);
    setInitialPhoto(result.session.photo || "");
    setProfileBanner({ kind: "success", text: "Perfil actualizado." });
  }

  // ---- Cambiar contraseña ----
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setPasswordBanner(null);

    if (newPassword !== confirmPassword) {
      setPasswordBanner({
        kind: "error",
        text: "La nueva contraseña y su confirmación no coinciden.",
      });
      return;
    }

    setSavingPassword(true);
    const result = changePassword(session.userId, currentPassword, newPassword);
    setSavingPassword(false);

    if (!result.success) {
      setPasswordBanner({
        kind: "error",
        text: result.error || "No se pudo cambiar la contraseña.",
      });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordBanner({
      kind: "success",
      text: "Contraseña actualizada correctamente.",
    });
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Volver"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1
            className="text-white text-xl"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Perfil
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Card: Datos del perfil */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-white font-semibold text-lg mb-1">
            Información personal
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Actualizá tu foto, nombre y email.
          </p>

          {/* Avatar + acciones de foto */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-7">
            <Avatar name={name || "U"} photo={photo} size="xl" />
            <div className="flex-1 w-full">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={processingImage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {processingImage ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {photo ? "Cambiar foto" : "Subir foto"}
                    </>
                  )}
                </button>
                {photo && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-medium transition-colors"
                  >
                    Quitar foto
                  </button>
                )}
              </div>
              <p className="text-slate-500 text-xs mt-2">
                JPG, PNG o WebP. Máximo {MAX_FILE_SIZE_MB} MB. Se redimensiona
                automáticamente.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form de datos */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-slate-300 text-sm font-medium mb-1.5"
              >
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                placeholder="Tu nombre"
                autoComplete="name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-slate-300 text-sm font-medium mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            {profileBanner && (
              <div
                className={`text-sm rounded-xl px-4 py-3 ${
                  profileBanner.kind === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                }`}
              >
                {profileBanner.text}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!profileChanged || savingProfile || processingImage}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
              >
                {savingProfile ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </section>

        {/* Card: Cambio de contraseña */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-semibold text-lg">Contraseña</h2>
            <button
              type="button"
              onClick={() => setShowPasswords((v) => !v)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              {showPasswords ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <p className="text-slate-500 text-sm mb-6">
            Para cambiarla necesitás ingresar la actual.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-slate-300 text-sm font-medium mb-1.5"
              >
                Contraseña actual
              </label>
              <input
                id="currentPassword"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                autoComplete="current-password"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-slate-300 text-sm font-medium mb-1.5"
              >
                Nueva contraseña
              </label>
              <input
                id="newPassword"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-slate-300 text-sm font-medium mb-1.5"
              >
                Confirmar nueva contraseña
              </label>
              <input
                id="confirmPassword"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                autoComplete="new-password"
              />
            </div>

            {passwordBanner && (
              <div
                className={`text-sm rounded-xl px-4 py-3 ${
                  passwordBanner.kind === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                }`}
              >
                {passwordBanner.text}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  savingPassword
                }
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
              >
                {savingPassword ? "Cambiando..." : "Cambiar contraseña"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
