// Client-safe logo metadata (no prompts / server logic) — imported by both the
// Logo Maker page and the server route so the style list stays in one place.

export interface LogoStyle {
  id: string;
  label: string;
  emoji: string;
  hint: string;
}

export const LOGO_STYLES: LogoStyle[] = [
  {
    id: "minimalis",
    label: "Minimalis",
    emoji: "⬜",
    hint: "clean, modern, garis simpel, 1–2 warna, banyak ruang kosong",
  },
  {
    id: "playful",
    label: "Playful / Ceria",
    emoji: "🎈",
    hint: "warna cerah, bentuk membulat, friendly, cocok anak muda & kuliner",
  },
  {
    id: "elegan",
    label: "Elegan / Mewah",
    emoji: "💎",
    hint: "kesan premium, warna emas/hitam/krem, tipografi serif, simetris",
  },
  {
    id: "vintage",
    label: "Vintage / Klasik",
    emoji: "🏛️",
    hint: "gaya badge/emblem, lingkaran, retro, kesan terpercaya",
  },
  {
    id: "bold",
    label: "Bold / Tegas",
    emoji: "⚡",
    hint: "tebal, kontras tinggi, geometris, energik",
  },
];

export const NICHES_FALLBACK = [
  "Kuliner / F&B",
  "Online Shop / E-commerce",
  "Jasa & Profesional",
  "Personal Brand / Coach",
  "Properti",
  "Lainnya",
] as const;
