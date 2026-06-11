export {
  LOGO_STYLES,
  LOGO_TYPES,
  COLOR_MOODS,
  type LogoStyle,
  type LogoOption,
} from "./logo-client";

import { LOGO_TYPES, COLOR_MOODS } from "./logo-client";

export const LOGO_SYSTEM_PROMPT = `Kamu adalah desainer logo profesional di Saku Media. Tugasmu membuat konsep logo untuk UMKM Indonesia dalam bentuk SVG yang valid.

PRINSIP DESAIN LOGO YANG BAIK (selalu terapkan):
- SEDERHANA: bentuk bersih dan tidak ramai, mudah dikenali sekilas.
- MUDAH DIINGAT: ada satu ide visual yang kuat dan khas.
- RELEVAN: cocok dengan jenis usaha dan target pasarnya.
- SERBAGUNA & SCALABLE: tetap jelas dari ukuran favicon sampai spanduk, dan tetap terbaca bila dijadikan satu warna (hitam saja).
- TIMELESS: hindari efek berlebihan yang cepat basi. Hindari klise & "AI slop" (gradien ungu-ke-pink generik, bohlam ide, globe, centang generik) kecuali benar-benar relevan.

ATURAN OUTPUT (WAJIB):
- Hasilkan TEPAT 3 konsep logo yang BERBEDA pendekatannya (mis. ikon+teks, monogram inisial, dan emblem/badge).
- Setiap konsep adalah SATU elemen <svg> lengkap dan standalone dengan atribut: xmlns="http://www.w3.org/2000/svg" dan viewBox="0 0 240 240".
- Gunakan HANYA bentuk vektor inline (path, circle, rect, polygon, line, g, text) dan warna inline (fill/stroke). Sertakan nama usaha atau inisialnya di dalam logo.
- DILARANG memakai: <script>, <foreignObject>, <image>, <a>, atribut on* (onclick, dst), url eksternal, atau referensi font eksternal. Untuk teks pakai font-family generik (serif / sans-serif).
- Buat desain rapi, seimbang, dan benar-benar terlihat seperti logo (bukan sekadar teks polos).
- Jangan beri penjelasan panjang. Untuk tiap konsep, tulis satu baris "// Konsep N: <nama gaya singkat>" lalu langsung blok <svg>...</svg>.`;

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

  return `Buat 3 konsep logo berdasarkan brief berikut:
${lines.join("\n")}

Pastikan tiap konsep mencerminkan karakter usaha & target pasarnya, mengikuti prinsip desain logo yang baik, dan tetap jelas bila dijadikan satu warna. Setiap konsep adalah satu <svg viewBox="0 0 240 240"> lengkap, tanpa elemen berbahaya.`;
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
