"use client";
// components/Avatar.tsx
// Avatar reutilizable: muestra la foto si existe, si no la inicial con el gradiente del Sidebar.

interface Props {
  name: string;
  photo?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-base",
  lg: "w-20 h-20 text-2xl",
  xl: "w-28 h-28 text-4xl",
};

export default function Avatar({ name, photo, size = "md", className = "" }: Props) {
  const initial = name?.[0]?.toUpperCase() || "U";
  const sizeCls = sizeClasses[size];

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${sizeCls} rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeCls} rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold shrink-0 ${className}`}
    >
      {initial}
    </div>
  );
}
