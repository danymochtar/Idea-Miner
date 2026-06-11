export { LOGO_STYLES, type LogoStyle } from "./logo-client";

export const LOGO_SYSTEM_PROMPT = `Kamu adalah desainer logo profesional di Saku Media. Tugasmu membuat konsep logo untuk UMKM Indonesia dalam bentuk SVG yang valid.

ATURAN OUTPUT (WAJIB):
- Hasilkan TEPAT 3 konsep logo yang berbeda.
- Setiap konsep adalah SATU elemen <svg> lengkap dan standalone dengan atribut: xmlns="http://www.w3.org/2000/svg" dan viewBox="0 0 240 240".
- Gunakan HANYA bentuk vektor inline (path, circle, rect, polygon, text, g) dan warna inline (fill/stroke). Sertakan nama usaha atau inisialnya di dalam logo.
- DILARANG memakai: <script>, <foreignObject>, <image>, <a>, atribut on* (onclick, dst), url eksternal, atau referensi font eksternal. Untuk teks, pakai font-family generik (serif / sans-serif).
- Buat desain rapi, seimbang, dan benar-benar terlihat seperti logo (bukan sekadar teks polos).
- Jangan beri penjelasan panjang. Untuk tiap konsep, tulis satu baris "// Konsep N: <nama gaya singkat>" lalu langsung blok <svg>...</svg>.`;

export function buildLogoPrompt(
  businessName: string,
  niche: string,
  styleHint: string,
): string {
  return `Buat 3 konsep logo untuk usaha berikut:
- Nama usaha: ${businessName}
- Kategori: ${niche}
- Gaya yang diinginkan: ${styleHint}

Ingat: setiap konsep adalah satu <svg viewBox="0 0 240 240"> lengkap, tanpa script/elemen berbahaya. Variasikan ketiga konsep (mis. ikon+teks, monogram inisial, dan emblem/badge).`;
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
