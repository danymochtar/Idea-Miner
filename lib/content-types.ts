export const NICHES = [
  "Kuliner / F&B",
  "Online Shop / E-commerce",
  "Jasa & Profesional",
  "Personal Brand / Coach",
  "Properti",
  "Lainnya",
] as const;

export const TONES = [
  "Santai & Friendly",
  "Profesional & Terpercaya",
  "Lucu / Gen-Z",
  "Elegan / Premium",
] as const;

export type ContentTypeId =
  | "caption"
  | "kalender"
  | "reels"
  | "iklan"
  | "dm";

export interface ContentType {
  id: ContentTypeId;
  label: string;
  description: string;
  emoji: string;
  instruction: string;
}

export const CONTENT_TYPES: ContentType[] = [
  {
    id: "caption",
    label: "Caption Jualan",
    description: "5 caption Instagram/TikTok siap posting + hashtag",
    emoji: "✍️",
    instruction: `Buatkan 5 caption media sosial yang siap posting untuk usaha ini.
Variasikan tujuannya: 2 caption soft-selling (storytelling/edukasi), 2 caption hard-selling (promo/penawaran), 1 caption engagement (pertanyaan/interaksi).
Setiap caption harus punya: hook kuat di baris pertama, isi yang relatable untuk target pasar Indonesia, CTA yang jelas, dan 8-12 hashtag relevan (campuran hashtag besar dan niche).
Beri label tiap caption: [CAPTION 1 — Soft Selling], dst.`,
  },
  {
    id: "kalender",
    label: "Kalender Konten 30 Hari",
    description: "Rencana konten sebulan penuh, tinggal eksekusi",
    emoji: "📅",
    instruction: `Buatkan kalender konten 30 hari untuk usaha ini.
Bagi ke dalam 3 pilar: EDUKASI (membangun trust), JUALAN (promosi produk/jasa), ENGAGEMENT (interaksi & relatability).
Format per hari: "Hari N — [PILAR] — Judul ide — Hook pembuka — Format (feed/reels/story) — CTA".
Susun per minggu (Minggu 1 sampai Minggu 4 + 2 hari bonus) dengan tema mingguan yang jelas.
Pastikan ritme seimbang: sekitar 40% edukasi, 30% jualan, 30% engagement.`,
  },
  {
    id: "reels",
    label: "Script Reels / TikTok",
    description: "3 script video pendek lengkap dengan hook & CTA",
    emoji: "🎬",
    instruction: `Buatkan 3 script video pendek (Reels/TikTok, durasi 20-40 detik) untuk usaha ini.
Variasikan formatnya: 1 video edukasi/tips, 1 video behind-the-scenes/proses, 1 video promosi produk.
Format tiap script:
[SCRIPT N — Judul]
HOOK (0-3 detik): kalimat pembuka yang bikin berhenti scroll
ISI (per scene): apa yang diucapkan/ditampilkan, termasuk teks overlay
CTA (akhir): ajakan yang jelas
IDE AUDIO: saran jenis musik/sound yang cocok.`,
  },
  {
    id: "iklan",
    label: "Copy Iklan Meta/TikTok Ads",
    description: "3 variasi copy iklan + headline siap pasang",
    emoji: "🎯",
    instruction: `Buatkan 3 variasi copy iklan (Meta Ads / TikTok Ads) untuk usaha ini.
Variasi 1: formula PAS (Problem-Agitate-Solution).
Variasi 2: formula AIDA (Attention-Interest-Desire-Action).
Variasi 3: gaya testimoni/social proof.
Format tiap variasi: PRIMARY TEXT (copy utama, maksimal ~125 kata), HEADLINE (maksimal 40 karakter), DESCRIPTION (maksimal 30 karakter), dan saran CTA button (mis. "Pesan Sekarang", "Chat WhatsApp").
Tutup dengan 3 saran targeting audiens untuk iklan ini.`,
  },
  {
    id: "dm",
    label: "Template Balasan DM/WA",
    description: "Balasan cepat untuk tanya harga, ongkir, komplain, follow-up",
    emoji: "💬",
    instruction: `Buatkan template balasan chat (DM Instagram / WhatsApp) untuk usaha ini.
Buat template untuk 6 situasi: (1) tanya harga, (2) tanya ongkir/pengiriman, (3) follow-up calon pembeli yang belum balas, (4) menangani komplain, (5) konfirmasi pesanan, (6) minta review/testimoni setelah pembelian.
Setiap template harus terdengar manusiawi (bukan robot), sesuai tone yang diminta, dan mengarahkan ke closing.
Beri label tiap template: [TEMPLATE — Situasi].`,
  },
];

export interface GenerateRequest {
  businessName: string;
  niche: string;
  description: string;
  tone: string;
  contentType: ContentTypeId;
}

export const SYSTEM_PROMPT = `Kamu adalah "Saku AI Konten Engine" — mesin konten dari Saku Media, agensi digital Indonesia yang membantu UMKM punya presence online yang kuat.

Tugasmu: menghasilkan konten pemasaran dalam Bahasa Indonesia yang natural, persuasif, dan siap pakai untuk pemilik usaha kecil-menengah di Indonesia.

Aturan output:
- Selalu tulis dalam Bahasa Indonesia yang luwes dan sesuai tone yang diminta. Gunakan istilah yang familiar di medsos Indonesia.
- Konten harus SIAP COPY-PASTE: jangan beri penjelasan teori, langsung hasilkan kontennya.
- Format dengan teks polos yang rapi: gunakan label dalam kurung siku, garis pemisah (───), dan emoji secukupnya untuk struktur — JANGAN gunakan tabel markdown atau sintaks markdown (#, **, |).
- Sesuaikan gaya bahasa dengan target pasar usaha tersebut (mis. kuliner kaki lima vs properti premium berbeda gaya).
- Sebut nama usaha secara natural di dalam konten.
- Akhiri output dengan satu baris "💡 Tips Saku:" berisi satu saran praktis memakai konten tersebut.`;

export function buildUserPrompt(req: GenerateRequest): string {
  const contentType = CONTENT_TYPES.find((c) => c.id === req.contentType);
  return `Data usaha:
- Nama usaha: ${req.businessName}
- Kategori: ${req.niche}
- Deskripsi usaha & produk: ${req.description}
- Tone yang diinginkan: ${req.tone}

Permintaan:
${contentType?.instruction ?? ""}`;
}
