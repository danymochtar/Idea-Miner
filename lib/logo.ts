export {
  LOGO_STYLES,
  LOGO_TYPES,
  COLOR_MOODS,
  type LogoStyle,
  type LogoOption,
} from "./logo-client";

import { LOGO_TYPES, COLOR_MOODS } from "./logo-client";

export const LOGO_SYSTEM_PROMPT = `Kamu adalah desainer logo profesional di Saku Media — setara desainer brand senior. Tugasmu membuat konsep logo untuk UMKM Indonesia dalam bentuk SVG yang valid DAN bermakna.

CARA BERPIKIR (lakukan dulu sebelum menggambar):
1. Pahami inti usaha, karakter brand, dan target pasarnya.
2. Tentukan SATU ide besar / simbolisme untuk tiap konsep (mis. bentuk yang mewakili nilai usaha, negative space yang pintar, monogram bermakna). Ini yang membuat logo terasa "punya filosofi", bukan asal bentuk.
3. Baru terjemahkan ide itu jadi bentuk geometris yang rapi.

PRINSIP DESAIN (wajib):
- SEDERHANA & ELEGAN: sedikit elemen, komposisi seimbang, banyak ruang napas. Hindari detail ribet yang hilang saat diperkecil.
- BERMAKNA: setiap bentuk ada alasannya. Manfaatkan negative space, simetri, atau golden ratio bila relevan.
- RELEVAN dengan usaha & target pasar.
- SCALABLE: tetap jelas dari favicon sampai spanduk, dan tetap terbaca bila dijadikan SATU warna (hitam saja).
- PALET TERBATAS: maksimal 2–3 warna yang harmonis.
- TIMELESS: hindari klise & "AI slop" — gradien ungu-ke-pink generik, bohlam ide, globe, centang generik, clip-art kasar. Tipografi harus rapi dan sejajar (jangan gepeng/miring asal).

ATURAN OUTPUT (WAJIB, ikuti persis):
- Hasilkan TEPAT 3 konsep BERBEDA pendekatannya (mis. ikon+teks, monogram inisial, emblem/badge).
- Untuk SETIAP konsep tulis dalam format ini:
=== KONSEP N ===
Filosofi: <1–2 kalimat menjelaskan makna/simbolisme & kenapa cocok>
<svg ...>...</svg>
- Setiap <svg> harus lengkap & standalone: xmlns="http://www.w3.org/2000/svg" dan viewBox="0 0 240 240".
- Gunakan HANYA bentuk vektor inline (path, circle, rect, polygon, line, g, text) + warna inline. Sertakan nama usaha atau inisialnya.
- DILARANG: <script>, <foreignObject>, <image>, <a>, atribut on*, url eksternal, atau font eksternal. Untuk teks pakai font-family generik (serif / sans-serif).`;

export interface LogoBrief {
  businessName: string;
  niche: string;
  description: string;
  target?: string;
  styleHint: string;
  typeId?: string;
  colorId?: string;
  notes?: string;
}

export function buildLogoPrompt(brief: LogoBrief): string {
  const typeHint =
    LOGO_TYPES.find((t) => t.id === brief.typeId)?.hint ??
    "pilih jenis logo paling cocok untuk usaha ini";
  const colorHint =
    COLOR_MOODS.find((c) => c.id === brief.colorId)?.hint ??
    "pilih palet warna paling pas";

  const lines = [
    `- Nama usaha: ${brief.businessName}`,
    `- Kategori: ${brief.niche}`,
    `- Deskripsi usaha & produk: ${brief.description}`,
  ];
  if (brief.target?.trim()) lines.push(`- Target pasar: ${brief.target.trim()}`);
  lines.push(`- Gaya visual: ${brief.styleHint}`);
  lines.push(`- Jenis logo: ${typeHint}`);
  lines.push(`- Nuansa warna: ${colorHint}`);
  if (brief.notes?.trim())
    lines.push(`- Catatan khusus (harus ada / dihindari): ${brief.notes.trim()}`);

  return `Rancang 3 konsep logo berdasarkan brief berikut:
${lines.join("\n")}

Pikirkan dulu ide besar & filosofinya tiap konsep, lalu gambar SVG yang mewujudkannya. Pastikan ketiga konsep beda pendekatan, terasa premium & bermakna (bukan sekadar teks polos), dan tetap jelas bila dijadikan satu warna. Ikuti format output: "=== KONSEP N ===", lalu "Filosofi: ...", lalu blok <svg viewBox="0 0 240 240">.`;
}

export interface LogoConcept {
  philosophy: string;
  svg: string;
}

/**
 * Pairs each "Filosofi: ..." rationale with the SVG that follows it. Falls back
 * to bare SVG extraction if the model didn't follow the format. SVGs are
 * sanitized and also rendered via <img> client-side (non-scripting mode).
 */
export function extractConcepts(text: string): LogoConcept[] {
  const out: LogoConcept[] = [];
  const re = /Filosofi\s*[:\-]\s*([\s\S]*?)\s*(<svg[\s\S]*?<\/svg>)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({
      philosophy: cleanPhilosophy(m[1]),
      svg: sanitizeSvg(m[2]),
    });
  }
  if (out.length === 0) {
    for (const svg of text.match(/<svg[\s\S]*?<\/svg>/gi) ?? []) {
      out.push({ philosophy: "", svg: sanitizeSvg(svg) });
    }
  }
  return out.filter((c) => c.svg.length > 0).slice(0, 3);
}

function cleanPhilosophy(s: string): string {
  return s
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}

/**
 * Extracts every <svg>...</svg> block from model text and strips anything that
 * could execute. SVGs are rendered client-side via <img> (non-scripting mode),
 * so this is defense-in-depth.
 */
export function extractSafeSvgs(text: string): string[] {
  const matches = text.match(/<svg[\s\S]*?<\/svg>/gi) ?? [];
  return matches
    .map(sanitizeSvg)
    .filter((s) => s.length > 0)
    .slice(0, 3);
}

export function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/<\/?(?:image|a|iframe|use)\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/(?:href|xlink:href)\s*=\s*"(?!#)[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
}
