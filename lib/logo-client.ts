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

export interface LogoOption {
  id: string;
  label: string;
  hint: string;
}

// Jenis/komposisi logo (memengaruhi bentuk dasar konsep).
export const LOGO_TYPES: LogoOption[] = [
  {
    id: "auto",
    label: "Otomatis (AI pilih)",
    hint: "pilih jenis logo paling cocok untuk usaha ini",
  },
  {
    id: "combination",
    label: "Ikon + Teks",
    hint: "kombinasi simbol/ikon dengan nama usaha (combination mark)",
  },
  {
    id: "wordmark",
    label: "Wordmark (nama)",
    hint: "logo berbasis nama usaha lengkap dengan tipografi khas, tanpa ikon dominan",
  },
  {
    id: "lettermark",
    label: "Inisial / Monogram",
    hint: "logo dari inisial nama usaha (lettermark/monogram)",
  },
  {
    id: "emblem",
    label: "Emblem / Badge",
    hint: "logo dalam wadah/lingkaran/perisai (emblem), kesan solid & terpercaya",
  },
  {
    id: "mascot",
    label: "Maskot / Karakter",
    hint: "logo dengan karakter/maskot yang ramah dan mudah diingat",
  },
];

// Nuansa warna (psikologi warna).
export const COLOR_MOODS: LogoOption[] = [
  { id: "auto", label: "Otomatis", hint: "pilih palet warna paling pas" },
  {
    id: "hangat",
    label: "Hangat",
    hint: "palet hangat (merah/oranye/cokelat) — energik, ramah, menggugah selera",
  },
  {
    id: "sejuk",
    label: "Sejuk",
    hint: "palet sejuk (biru/hijau/teal) — tenang, segar, terpercaya",
  },
  {
    id: "berani",
    label: "Berani & Kontras",
    hint: "warna berani dengan kontras tinggi — mencolok dan modern",
  },
  {
    id: "pastel",
    label: "Pastel Lembut",
    hint: "warna pastel lembut — manis, kalem, cocok lifestyle/anak muda",
  },
  {
    id: "monokrom",
    label: "Monokrom",
    hint: "satu warna utama / hitam-putih — bersih, fleksibel, hemat cetak",
  },
  {
    id: "elegan",
    label: "Elegan",
    hint: "emas/hitam/krem — kesan mewah dan premium",
  },
];
