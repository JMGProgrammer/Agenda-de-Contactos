"use client";
// components/ModalContacto.tsx

import { useState, useEffect } from "react";
import { Contacto, ContactoInput } from "@/hooks/useContactos";

interface Props {
  contacto?: Contacto | null; // null = crear, Contacto = editar
  onClose: () => void;
  onSave: (input: ContactoInput) => void;
}

const emptyForm: ContactoInput = {
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  foto: "",
  direccion: "",
  notas: "",
  grupos: [],
  favorito: false,
};

export default function ModalContacto({ contacto, onClose, onSave }: Props) {
  const [form, setForm] = useState<ContactoInput>(emptyForm);
  const [grupoInput, setGrupoInput] = useState("");

  useEffect(() => {
    if (contacto) {
      const { id, fechaCreacion, ...rest } = contacto;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [contacto]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function addGrupo() {
    const g = grupoInput.trim();
    if (g && !form.grupos.includes(g)) {
      setForm((prev) => ({ ...prev, grupos: [...prev.grupos, g] }));
    }
    setGrupoInput("");
  }

  function removeGrupo(g: string) {
    setForm((prev) => ({
      ...prev,
      grupos: prev.grupos.filter((x) => x !== g),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onSave(form);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2
            className="text-white font-semibold text-lg"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {contacto ? "Editar contacto" : "Nuevo contacto"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Juan"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Apellido
              </label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Pérez"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Email + Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="juan@email.com"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Teléfono
              </label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="+598 99 000 000"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Foto URL */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Foto (URL)
            </label>
            <input
              name="foto"
              value={form.foto}
              onChange={handleChange}
              placeholder="https://ejemplo.com/foto.jpg"
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Dirección
            </label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Av. 18 de Julio 1234, Montevideo"
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          {/* Grupos */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Grupos / Etiquetas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={grupoInput}
                onChange={(e) => setGrupoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addGrupo();
                  }
                }}
                placeholder="Trabajo, VIP, Familia..."
                className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
              <button
                type="button"
                onClick={addGrupo}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors"
              >
                + Agregar
              </button>
            </div>
            {form.grupos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.grupos.map((g) => (
                  <span
                    key={g}
                    className="flex items-center gap-1.5 text-xs px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-600/30 rounded-full"
                  >
                    {g}
                    <button
                      type="button"
                      onClick={() => removeGrupo(g)}
                      className="hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Notas
            </label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              placeholder="Información adicional..."
              rows={3}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all resize-none"
            />
          </div>

          {/* Favorito */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.favorito}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, favorito: e.target.checked }))
                }
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                  form.favorito ? "bg-blue-600" : "bg-slate-700"
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  form.favorito ? "translate-x-5" : ""
                }`}
              />
            </div>
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Marcar como favorito
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              {contacto ? "Guardar cambios" : "Crear contacto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
