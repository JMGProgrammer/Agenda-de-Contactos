"use client";
// app/page.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useContactos, Contacto, ContactoInput } from "@/hooks/useContactos";
import Sidebar from "@/components/Sidebar";
import ContactoCard from "@/components/ContactoCard";
import ModalContacto from "@/components/ModalContacto";

export default function HomePage() {
  const { session, loading, logout } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [contactoEditando, setContactoEditando] = useState<Contacto | null>(
    null,
  );
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const {
    contactos,
    totalContactos,
    grupos,
    search,
    setSearch,
    grupoActivo,
    setGrupoActivo,
    orden,
    setOrden,
    vistaGrid,
    toggleVista,
    agregar,
    editar,
    eliminar,
    toggleFavorito,
  } = useContactos(session?.userId);

  // Protección de ruta
  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
  }, [session, loading, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  function handleSave(input: ContactoInput) {
    if (contactoEditando) {
      editar(contactoEditando.id, input);
    } else {
      agregar(input);
    }
    setContactoEditando(null);
  }

  function handleEdit(c: Contacto) {
    setContactoEditando(c);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    setConfirmDelete(id);
  }

  function confirmDeleteAction() {
    if (confirmDelete) {
      eliminar(confirmDelete);
      setConfirmDelete(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        grupos={grupos}
        grupoActivo={grupoActivo}
        setGrupoActivo={setGrupoActivo}
        totalContactos={totalContactos}
        userName={session.name}
        onLogout={logout}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-10 px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, email o teléfono..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Orden */}
              <button
                onClick={() => setOrden(orden === "az" ? "za" : "az")}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 text-sm transition-colors font-medium"
                title={`Ordenar ${orden === "az" ? "Z→A" : "A→Z"}`}
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
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                  />
                </svg>
                {orden === "az" ? "A→Z" : "Z→A"}
              </button>

              {/* Vista toggle */}
              <button
                onClick={toggleVista}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-colors"
                title={vistaGrid ? "Vista lista" : "Vista tarjetas"}
              >
                {vistaGrid ? (
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                )}
              </button>

              {/* Nuevo contacto */}
              <button
                onClick={() => {
                  setContactoEditando(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 active:scale-[0.98]"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nuevo
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-6 py-6">
          {/* Section title */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-slate-300 text-sm font-medium">
              {grupoActivo === "todos"
                ? "Todos los contactos"
                : grupoActivo === "favoritos"
                  ? "Favoritos"
                  : `Grupo: ${grupoActivo}`}
              <span className="ml-2 text-slate-600">({contactos.length})</span>
            </h2>
          </div>

          {/* Empty state */}
          {contactos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">
                {search
                  ? "No se encontraron contactos"
                  : "No hay contactos aún"}
              </p>
              <p className="text-slate-600 text-sm mt-1">
                {search
                  ? "Probá con otro término de búsqueda"
                  : 'Hacé clic en "Nuevo" para agregar tu primer contacto'}
              </p>
            </div>
          )}

          {/* Grid / List */}
          {contactos.length > 0 && (
            <div
              className={
                vistaGrid
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-2"
              }
            >
              {contactos.map((c) => (
                <ContactoCard
                  key={c.id}
                  contacto={c}
                  vistaGrid={vistaGrid}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorito={toggleFavorito}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <ModalContacto
          contacto={contactoEditando}
          onClose={() => {
            setModalOpen(false);
            setContactoEditando(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/15 mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-400"
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
            </div>
            <h3 className="text-white font-semibold text-center text-lg mb-1">
              Eliminar contacto
            </h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteAction}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
