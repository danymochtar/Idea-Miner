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
  | "dm"
  | "bio"
  | "review"
  | "promo"
  | "tagline"
  | "blast";

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
  {
    id: "bio",
    label: "Bio / Profil Usaha",
    description: "Bio Instagram/TikTok + paragraf 'About Us' siap pakai",
    emoji: "📇",
    instruction: `Buatkan materi profil usaha ini:
1. [BIO INSTAGRAM] — 3 opsi bio singkat (maksimal 150 karakter) dengan emoji, value proposition jelas, dan CTA/link.
2. [BIO TIKTOK] — 2 opsi bio pendek yang catchy.
3. [ABOUT US] — 1 paragraf "Tentang Kami" yang hangat dan meyakinkan untuk website/katalog (3-4 kalimat).
4. [TAGLINE] — 3 opsi tagline singkat yang mudah diingat.`,
  },
  {
    id: "review",
    label: "Balasan Review",
    description: "Balasan untuk review positif & komplain negatif",
    emoji: "⭐",
    instruction: `Buatkan template balasan review/ulasan pelanggan untuk usaha ini.
Buat untuk situasi berikut:
[REVIEW BINTANG 5] — 3 variasi balasan untuk review positif (ucapan terima kasih + ajakan repeat order).
[REVIEW NETRAL/3 BINTANG] — 2 variasi balasan yang apresiatif sekaligus menggali masukan.
[REVIEW NEGATIF/KOMPLAIN] — 3 variasi balasan yang empati, minta maaf, menawarkan solusi, dan menjaga nama baik usaha — TANPA terkesan defensif.
Semua balasan harus profesional, manusiawi, dan sesuai tone yang diminta.`,
  },
  {
    id: "promo",
    label: "Ide Promo & Diskon",
    description: "5 konsep campaign promo yang menjual",
    emoji: "🎁",
    instruction: `Buatkan 5 ide promo/campaign untuk usaha ini yang menarik dan realistis dijalankan UMKM.
Format tiap ide:
[PROMO N — Nama Campaign yang catchy]
- Mekanik: cara kerja promonya (mis. bundling, diskon, BOGO, flash sale, giveaway)
- Hook: kalimat promosi utama untuk medsos
- Target & momen: kapan/ke siapa promo ini paling cocok (mis. payday, weekend, hari besar)
- Estimasi dampak: kenapa promo ini bisa naikkan penjualan
Variasikan jenis promonya, jangan semua diskon.`,
  },
  {
    id: "tagline",
    label: "Nama Produk & Tagline",
    description: "Opsi nama produk/menu + slogan",
    emoji: "🏷️",
    instruction: `Bantu usaha ini menamai produk/menu dan membuat slogan.
Hasilkan:
[NAMA PRODUK] — 10 opsi nama produk/menu yang menarik, mudah diingat, dan relevan dengan usaha. Beri 1 baris alasan singkat per nama.
[SLOGAN/TAGLINE] — 5 opsi tagline singkat yang kuat.
[NAMA PAKET/BUNDLE] — 3 opsi nama paket bundling yang menggugah.
Sesuaikan gaya penamaan dengan target pasar dan tone usaha.`,
  },
  {
    id: "blast",
    label: "Blast WhatsApp",
    description: "3 pesan broadcast WA untuk promo & follow-up",
    emoji: "📢",
    instruction: `Buatkan 3 pesan broadcast WhatsApp (WA Blast) untuk usaha ini.
Variasikan tujuannya:
[BLAST 1 — Promo/Penawaran] — umumkan promo atau produk baru.
[BLAST 2 — Reminder/Follow-up] — ingatkan pelanggan lama untuk repeat order.
[BLAST 3 — Info/Edukasi] — kabar/tips bermanfaat yang halus mengarah ke jualan.
Setiap pesan harus: pembuka personal (mis. "Halo Kak 👋"), isi ringkas mudah dibaca di HP, ada CTA jelas (link/format order), dan tidak terkesan spam. Panjang pas untuk WA (tidak terlalu panjang).`,
  },
];

export interface RefineAction {
  id: string;
  label: string;
  emoji: string;
  instruction: string;
}

// Quick one-tap tweaks applied to an already-generated result.
export const REFINE_ACTIONS: RefineAction[] = [
  {
    id: "pendek",
    label: "Lebih pendek",
    emoji: "✂️",
    instruction:
      "Buat versi yang lebih singkat dan padat, langsung ke poin, tanpa menghilangkan inti pesan.",
  },
  {
    id: "emoji",
    label: "Tambah emoji",
    emoji: "✨",
    instruction:
      "Tambahkan emoji yang relevan dan menarik di tempat yang pas agar lebih hidup, tapi jangan berlebihan.",
  },
  {
    id: "formal",
    label: "Lebih formal",
    emoji: "🎩",
    instruction:
      "Ubah gaya bahasa menjadi lebih formal, sopan, dan profesional.",
  },
  {
    id: "santai",
    label: "Lebih santai",
    emoji: "😎",
    instruction:
      "Ubah gaya bahasa menjadi lebih santai, akrab, dan friendly.",
  },
  {
    id: "variasi",
    label: "Versi lain",
    emoji: "🔀",
    instruction:
      "Buat versi alternatif yang benar-benar berbeda pendekatannya, dengan angle dan pilihan kata yang baru.",
  },
];

export function buildRefinePrompt(
  previousOutput: string,
  instruction: string,
): string {
  return `Berikut konten yang sudah dibuat sebelumnya:

"""
${previousOutput}
"""

Tugas: ${instruction}

Pertahankan bahasa, format, dan struktur label yang sama seperti konten asli. Langsung keluarkan hasil revisinya saja, tanpa kalimat pembuka.`;
}

export type OutputLang = "id" | "en";

export const OUTPUT_LANGS: { id: OutputLang; label: string; flag: string }[] = [
  { id: "id", label: "Indonesia", flag: "🇮🇩" },
  { id: "en", label: "English", flag: "🇬🇧" },
];

export interface GenerateRequest {
  businessName: string;
  niche: string;
  description: string;
  tone: string;
  contentType: ContentTypeId;
  language: string;
  outputLang: OutputLang;
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

const SYSTEM_PROMPT_ID = `Kamu adalah "Saku AI Konten Engine" — mesin konten dari Saku Media, agensi digital Indonesia yang membantu UMKM punya presence online yang kuat.

Tugasmu: menghasilkan konten pemasaran dalam Bahasa Indonesia yang natural, persuasif, dan siap pakai untuk pemilik usaha kecil-menengah di Indonesia.

Aturan output:
- Selalu tulis dalam Bahasa Indonesia yang luwes dan sesuai tone yang diminta. Gunakan istilah yang familiar di medsos Indonesia.
- Konten harus SIAP COPY-PASTE: jangan beri penjelasan teori, langsung hasilkan kontennya.
- Format dengan teks polos yang rapi: gunakan label dalam kurung siku, garis pemisah (───), dan emoji secukupnya untuk struktur — JANGAN gunakan tabel markdown atau sintaks markdown (#, **, |).
- Sesuaikan gaya bahasa dengan target pasar usaha tersebut (mis. kuliner kaki lima vs properti premium berbeda gaya).
- Sebut nama usaha secara natural di dalam konten.
- Akhiri output dengan satu baris "💡 Tips Saku:" berisi satu saran praktis memakai konten tersebut.`;

const SYSTEM_PROMPT_EN = `You are "Saku AI Konten Engine" — the content engine of Saku Media, an Indonesian digital agency that helps small businesses build a strong online presence.

Your task: produce natural, persuasive, ready-to-use marketing content in ENGLISH for small and medium business owners.

Output rules:
- Always write in fluent, natural English that matches the requested tone. Use everyday social-media language.
- Content must be READY TO COPY-PASTE: don't explain theory, just produce the content.
- Format as clean plain text: use bracketed labels, divider lines (───), and a few emojis for structure — do NOT use markdown tables or markdown syntax (#, **, |).
- Match the writing style to the business's target market (e.g. a street-food stall vs a premium property differ in voice).
- Mention the business name naturally within the content.
- End the output with one line "💡 Saku Tip:" containing one practical tip for using the content.`;

export function getSystemPrompt(lang: OutputLang): string {
  return lang === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ID;
}

export function buildUserPrompt(req: GenerateRequest): string {
  const contentType = CONTENT_TYPES.find((c) => c.id === req.contentType);
  if (req.outputLang === "en") {
    return `Business data:
- Business name: ${req.businessName}
- Category: ${req.niche}
- Business & product description: ${req.description}
- Desired tone: ${req.tone}
- Writing style: natural, fluent English suited to the target market.

Request (produce all output in English):
${contentType?.instruction ?? ""}`;
  }
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
