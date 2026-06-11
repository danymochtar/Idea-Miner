import { COLOR_MOODS, LOGO_STYLES, LOGO_TYPES } from "./logo-client";

export interface LogoImageBrief {
  businessName: string;
  niche: string;
  description: string;
  target?: string;
  styleId?: string;
  typeId?: string;
  colorId?: string;
  notes?: string;
}

// Three angles so the 3 generated images differ meaningfully.
const CONCEPT_ANGLES = [
  "konsep ikonik: satu simbol kuat yang relevan dengan usaha, dipadukan dengan nama usaha di bawahnya",
  "konsep monogram: inisial nama usaha digayakan secara kreatif menjadi mark yang khas",
  "konsep emblem/badge: nama dan elemen visual disusun dalam wadah (lingkaran/perisai) yang solid",
];

export function buildImagePrompt(
  brief: LogoImageBrief,
  conceptIndex: number,
): string {
  const style =
    LOGO_STYLES.find((s) => s.id === brief.styleId)?.hint ?? "modern & clean";
  const type =
    LOGO_TYPES.find((t) => t.id === brief.typeId && t.id !== "auto")?.hint ?? "";
  const color =
    COLOR_MOODS.find((c) => c.id === brief.colorId && c.id !== "auto")?.hint ??
    "palet warna yang harmonis dan relevan";
  const angle = CONCEPT_ANGLES[conceptIndex % CONCEPT_ANGLES.length];

  const parts = [
    `Desain sebuah LOGO profesional untuk usaha bernama "${brief.businessName}".`,
    `Jenis usaha: ${brief.niche}. Deskripsi: ${brief.description}.`,
    brief.target?.trim() ? `Target pasar: ${brief.target.trim()}.` : "",
    `Pendekatan: ${angle}.`,
    type ? `Jenis logo: ${type}.` : "",
    `Gaya visual: ${style}. Nuansa warna: ${color}.`,
    brief.notes?.trim() ? `Catatan: ${brief.notes.trim()}.` : "",
    `Penting: ini adalah LOGO (bukan ilustrasi penuh). Desain rata, bersih, dan sederhana di atas latar PUTIH polos. Komposisi terpusat, banyak ruang kosong, maksimal 2-3 warna. Tampilkan teks "${brief.businessName}" dengan ejaan yang BENAR dan tipografi rapi. Hindari mockup, bayangan berlebihan, gradien norak, dan elemen yang terlalu ramai. Logo harus tetap terbaca walau diperkecil.`,
  ];
  return parts.filter(Boolean).join(" ");
}

export const NUM_IMAGE_CONCEPTS = 3;
