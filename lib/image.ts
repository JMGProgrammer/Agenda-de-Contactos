// lib/image.ts
// Utilidades para procesar la imagen de perfil antes de guardarla

export const MAX_FILE_SIZE_MB = 2;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_DIMENSION = 512; // px — suficiente para avatar y compatible con BD futura

export interface ProcessImageResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
}

/**
 * Lee un File, lo valida (tipo y tamaño), lo redimensiona a máx 512x512
 * conservando proporción y lo devuelve como dataURL JPEG (calidad 0.85).
 * El JPEG resultante suele pesar bastante menos que el original — ideal para localStorage.
 */
export async function processProfileImage(
  file: File,
): Promise<ProcessImageResult> {
  // Validar tipo
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "El archivo debe ser una imagen." };
  }

  // Validar tamaño antes de procesar
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `La imagen no puede superar ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  try {
    const dataUrl = await fileToDataUrl(file);
    const resized = await resizeImage(dataUrl, MAX_DIMENSION);
    return { success: true, dataUrl: resized };
  } catch {
    return { success: false, error: "No se pudo procesar la imagen." };
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read error"));
    reader.readAsDataURL(file);
  });
}

function resizeImage(dataUrl: string, maxSide: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Redimensionar conservando proporción
      if (width > maxSide || height > maxSide) {
        if (width > height) {
          height = Math.round((height * maxSide) / width);
          width = maxSide;
        } else {
          width = Math.round((width * maxSide) / height);
          height = maxSide;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("no canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      // JPEG con calidad 0.85 — peso muy razonable para localStorage
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("image load error"));
    img.src = dataUrl;
  });
}
