"use client";
// components/ContactoDetalle.tsx

import { Contacto } from "@/hooks/useContactos";

interface Props {
  contacto: Contacto;
  onClose: () => void;
  onEdit: (c: Contacto) => void;
  onDelete: (id: string) => void;
  onToggleFavorito: (id: string) => void;
}

function getAvatarColor(name: string): string {
  const colors = [
    "from-blue-600 to-blue-400",
    "from-violet-600 to-violet-400",
    "from-emerald-600 to-emerald-400",
    "from-rose-600 to-rose-400",
    "from-amber-600 to-amber-400",
    "from-cyan-600 to-cyan-400",
    "from-indigo-600 to-indigo-400",
    "from-teal-600 to-teal-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-800 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm text-slate-200 break-words">{value}</p>
      </div>
    </div>
  );
}

export default function ContactoDetalle({
  contacto,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorito,
}: Props) {
  const initials =
    `${contacto.nombre[0] || ""}${contacto.apellido[0] || ""}`.toUpperCase();
  const gradiente = getAvatarColor(contacto.nombre + contacto.apellido);
  const fechaAlta = new Date(contacto.fechaCreacion).toLocaleDateString(
    "es-UY",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header con gradiente */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-6 pt-6 pb-8 border-b border-slate-800">
          {/* Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            {contacto.foto ? (
              <img
                src={contacto.foto}
                alt={`${contacto.nombre} ${contacto.apellido}`}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-700 mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradiente} flex items-center justify-center text-2xl font-bold text-white ring-4 ring-slate-700 mb-4`}
              >
                {initials || "?"}
              </div>
            )}

            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {contacto.nombre} {contacto.apellido}
            </h2>

            {/* Grupos */}
            {contacto.grupos.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {contacto.grupos.map((g) => (
                  <span
                    key={g}
                    className="text-xs px-2.5 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Fecha de alta */}
            <p className="text-slate-500 text-xs mt-3">
              Agregado el {fechaAlta}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="px-6 py-2 max-h-64 overflow-y-auto">
          {contacto.email && (
            <InfoRow
              label="Email"
              value={contacto.email}
              icon={
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />
          )}
          {contacto.telefono && (
            <InfoRow
              label="Teléfono"
              value={contacto.telefono}
              icon={
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              }
            />
          )}
          {contacto.direccion && (
            <InfoRow
              label="Dirección"
              value={contacto.direccion}
              icon={
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            />
          )}
          {contacto.notas && (
            <InfoRow
              label="Notas"
              value={contacto.notas}
              icon={
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-5 border-t border-slate-800 flex gap-3">
          {/* Favorito */}
          <button
            onClick={() => onToggleFavorito(contacto.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              contacto.favorito
                ? "bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25"
                : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-amber-400"
            }`}
          >
            <svg
              className={`w-4 h-4 ${contacto.favorito ? "fill-amber-400" : ""}`}
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
            {contacto.favorito ? "Favorito" : "Favorito"}
          </button>

          {/* Editar */}
          <button
            onClick={() => {
              onEdit(contacto);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all"
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
            Editar
          </button>

          {/* Eliminar */}
          <button
            onClick={() => {
              onDelete(contacto.id);
              onClose();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 hover:text-red-300 text-sm font-medium transition-all"
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
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
