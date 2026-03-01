"use client";
// components/ContactoCard.tsx

import { Contacto } from "@/hooks/useContactos";

interface Props {
  contacto: Contacto;
  vistaGrid: boolean;
  onEdit: (c: Contacto) => void;
  onDelete: (id: string) => void;
  onToggleFavorito: (id: string) => void;
}

// Genera un color de fondo para el avatar según el nombre
function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-600",
    "bg-violet-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-amber-600",
    "bg-cyan-600",
    "bg-indigo-600",
    "bg-teal-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

function Avatar({
  contacto,
  size = "md",
}: {
  contacto: Contacto;
  size?: "sm" | "md" | "lg";
}) {
  const initials =
    `${contacto.nombre[0] || ""}${contacto.apellido[0] || ""}`.toUpperCase();
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-16 h-16 text-xl",
  };

  if (contacto.foto) {
    return (
      <img
        src={contacto.foto}
        alt={`${contacto.nombre} ${contacto.apellido}`}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-slate-700`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${getAvatarColor(contacto.nombre + contacto.apellido)} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-slate-700`}
    >
      {initials || "?"}
    </div>
  );
}

export default function ContactoCard({
  contacto,
  vistaGrid,
  onEdit,
  onDelete,
  onToggleFavorito,
}: Props) {
  if (vistaGrid) {
    return (
      <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Avatar contacto={contacto} size="md" />
          <button
            onClick={() => onToggleFavorito(contacto.id)}
            className="transition-transform hover:scale-110 active:scale-95"
            title={
              contacto.favorito ? "Quitar de favoritos" : "Agregar a favoritos"
            }
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                contacto.favorito
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-600 hover:text-amber-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-white text-base leading-tight">
            {contacto.nombre} {contacto.apellido}
          </h3>
          {contacto.email && (
            <p className="text-slate-400 text-sm mt-0.5 truncate">
              {contacto.email}
            </p>
          )}
          {contacto.telefono && (
            <p className="text-slate-500 text-xs mt-1">{contacto.telefono}</p>
          )}
        </div>

        {/* Grupos */}
        {contacto.grupos.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {contacto.grupos.slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-xs px-2 py-0.5 bg-blue-600/15 text-blue-400 border border-blue-600/25 rounded-full"
              >
                {g}
              </span>
            ))}
            {contacto.grupos.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-500 rounded-full">
                +{contacto.grupos.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-slate-800">
          <button
            onClick={() => onEdit(contacto)}
            className="flex-1 text-xs py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-medium"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(contacto.id)}
            className="flex-1 text-xs py-2 rounded-lg bg-slate-800 hover:bg-red-900/50 hover:text-red-400 text-slate-400 transition-colors font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    );
  }

  // VISTA LISTA
  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-5 py-4 flex items-center gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-black/20">
      <Avatar contacto={contacto} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white text-sm">
            {contacto.nombre} {contacto.apellido}
          </h3>
          {contacto.favorito && (
            <svg
              className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {contacto.email && (
            <span className="text-slate-400 text-xs truncate">
              {contacto.email}
            </span>
          )}
          {contacto.telefono && (
            <span className="text-slate-500 text-xs shrink-0">
              {contacto.telefono}
            </span>
          )}
        </div>
      </div>

      {/* Grupos en lista */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        {contacto.grupos.slice(0, 2).map((g) => (
          <span
            key={g}
            className="text-xs px-2 py-0.5 bg-blue-600/15 text-blue-400 border border-blue-600/25 rounded-full"
          >
            {g}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggleFavorito(contacto.id)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          title="Toggle favorito"
        >
          <svg
            className={`w-4 h-4 transition-colors ${contacto.favorito ? "text-amber-400 fill-amber-400" : "text-slate-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
        <button
          onClick={() => onEdit(contacto)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(contacto.id)}
          className="p-2 rounded-lg hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition-colors"
        >
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
