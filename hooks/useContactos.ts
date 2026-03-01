"use client";
// hooks/useContactos.ts

import { useState, useEffect, useCallback } from "react";
import { getContactsKey } from "@/lib/auth";

export interface Contacto {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  foto: string; // URL o ""
  direccion: string;
  notas: string;
  grupos: string[];
  favorito: boolean;
  fechaCreacion: string;
}

export type ContactoInput = Omit<Contacto, "id" | "fechaCreacion">;

function loadContactos(userId: string): Contacto[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(getContactsKey(userId));
  return raw ? JSON.parse(raw) : [];
}

function saveContactos(userId: string, contactos: Contacto[]): void {
  localStorage.setItem(getContactsKey(userId), JSON.stringify(contactos));
}

export function useContactos(userId: string | undefined) {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [search, setSearch] = useState("");
  const [grupoActivo, setGrupoActivo] = useState<string>("todos");
  const [orden, setOrden] = useState<"az" | "za">("az");
  const [vistaGrid, setVistaGrid] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setContactos(loadContactos(userId));
    // Restaurar preferencia de vista
    const savedVista = localStorage.getItem("agenda_vista");
    if (savedVista) setVistaGrid(savedVista === "grid");
  }, [userId]);

  function persist(updated: Contacto[]) {
    if (!userId) return;
    setContactos(updated);
    saveContactos(userId, updated);
  }

  const agregar = useCallback(
    (input: ContactoInput) => {
      const nuevo: Contacto = {
        ...input,
        id: crypto.randomUUID(),
        fechaCreacion: new Date().toISOString(),
      };
      persist([...contactos, nuevo]);
    },
    [contactos, userId],
  );

  const editar = useCallback(
    (id: string, input: ContactoInput) => {
      persist(contactos.map((c) => (c.id === id ? { ...c, ...input } : c)));
    },
    [contactos, userId],
  );

  const eliminar = useCallback(
    (id: string) => {
      persist(contactos.filter((c) => c.id !== id));
    },
    [contactos, userId],
  );

  const toggleFavorito = useCallback(
    (id: string) => {
      persist(
        contactos.map((c) =>
          c.id === id ? { ...c, favorito: !c.favorito } : c,
        ),
      );
    },
    [contactos, userId],
  );

  function toggleVista() {
    const next = !vistaGrid;
    setVistaGrid(next);
    localStorage.setItem("agenda_vista", next ? "grid" : "list");
  }

  // Todos los grupos únicos
  const grupos = Array.from(new Set(contactos.flatMap((c) => c.grupos))).sort();

  // Filtrado + orden
  const contactosFiltrados = contactos
    .filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        c.apellido.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.telefono.includes(q);

      const matchGrupo =
        grupoActivo === "todos"
          ? true
          : grupoActivo === "favoritos"
            ? c.favorito
            : c.grupos.includes(grupoActivo);

      return matchSearch && matchGrupo;
    })
    .sort((a, b) => {
      const nameA = `${a.apellido} ${a.nombre}`.toLowerCase();
      const nameB = `${b.apellido} ${b.nombre}`.toLowerCase();
      return orden === "az"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  return {
    contactos: contactosFiltrados,
    totalContactos: contactos.length,
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
  };
}
