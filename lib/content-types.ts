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

export interface LanguageStyle {
  id: string;
  label: string;
  instruction: string;
}

export const LANGUAGE_STYLES: LanguageStyle[] = [
  {
    id: "santai",
    label: "Indonesia Santai",
    instruction:
      "Gunakan Bahasa Indonesia sehari-hari yang santai dan akrab, seperti ngobrol dengan teman.",
  },
  {
    id: "baku",
    label: "Indonesia Formal",
    instruction:
      "Gunakan Bahasa Indonesia yang baku, sopan, dan profesional.",
  },
  {
    id: "jaksel",
    label: "Gaul Jaksel",
    instruction:
      "Gunakan gaya bahasa gaul anak Jakarta Selatan: sesekali campur istilah Inggris yang umum (which is, literally, prefer, worth it, vibes), tetap natural dan tidak berlebihan.",
  },
  {
    id: "jawa",
    label: "Campur Jawa",
    instruction:
      "Gunakan Bahasa Indonesia dengan sentuhan Bahasa Jawa yang ramah (mis. monggo, matur nuwun, rek, jos) secukupnya, cocok untuk pasar Jawa.",
  },
  {
    id: "sunda",
    label: "Campur Sunda",
    instruction:
      "Gunakan Bahasa Indonesia dengan sentuhan Bahasa Sunda yang ramah (mis. mangga, hatur nuhun, euy, cik) secukupnya, cocok untuk pasar Jawa Barat.",
  },
];

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
  language: string;
}

export interface Preset {
  label: string;
  emoji: string;
  businessName: string;
  niche: string;
  description: string;
  tone: string;
  contentType: ContentTypeId;
  language: string;
}

// One-click demo examples — auto-fill the form for fast internal showcasing.
export const PRESETS: Preset[] = [
  {
    label: "Kedai Kopi",
    emoji: "☕",
    businessName: "Kopi Senja",
    niche: "Kuliner / F&B",
    description:
      "Kedai kopi kekinian dengan menu andalan kopi susu gula aren. Target anak muda & mahasiswa, harga terjangkau, suasana cozy buat nongkrong dan WFC.",
    tone: "Lucu / Gen-Z",
    contentType: "caption",
    language: "jaksel",
  },
  {
    label: "Online Shop Hijab",
    emoji: "🧕",
    businessName: "Hijab Aira",
    niche: "Online Shop / E-commerce",
    description:
      "Toko online hijab voal premium motif eksklusif. Target wanita muslimah 20-40 tahun yang suka tampil rapi & adem dipakai seharian. Jualan via Instagram & WhatsApp.",
    tone: "Santai & Friendly",
    contentType: "kalender",
    language: "santai",
  },
  {
    label: "Agen Properti",
    emoji: "🏡",
    businessName: "Griya Asri Property",
    niche: "Properti",
    description:
      "Agen properti perumahan cluster di pinggiran kota. Target keluarga muda yang cari rumah pertama, KPR DP ringan, lokasi dekat tol & sekolah.",
    tone: "Elegan / Premium",
    contentType: "iklan",
    language: "baku",
  },
  {
    label: "Coach Bisnis",
    emoji: "🎤",
    businessName: "Coach Bima",
    niche: "Personal Brand / Coach",
    description:
      "Business coach untuk pemilik UMKM yang ingin scale-up lewat sistem & digital marketing. Jualan kelas online & mentoring 1-on-1.",
    tone: "Profesional & Terpercaya",
    contentType: "reels",
    language: "santai",
  },
];

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
  const language = LANGUAGE_STYLES.find((l) => l.id === req.language);
  return `Data usaha:
- Nama usaha: ${req.businessName}
- Kategori: ${req.niche}
- Deskripsi usaha & produk: ${req.description}
- Tone yang diinginkan: ${req.tone}
- Gaya bahasa: ${language?.label ?? "Indonesia Santai"} — ${
    language?.instruction ?? ""
  }

Permintaan:
${contentType?.instruction ?? ""}`;
}
