# Saku AI Konten Engine 🪄

Pilot project **Saku Media** — web app pembuat konten medsos untuk UMKM Indonesia, ditenagai **Claude (Anthropic)**.

Isi data usaha → pilih jenis konten → AI menghasilkan konten Bahasa Indonesia siap copy-paste:

**10 jenis konten:**

- ✍️ Caption Jualan · 📅 Kalender Konten 30 Hari · 🎬 Script Reels/TikTok · 🎯 Copy Iklan (PAS/AIDA/testimoni) · 💬 Template Balasan DM/WA
- 📇 Bio/Profil Usaha · ⭐ Balasan Review · 🎁 Ide Promo & Diskon · 🏷️ Nama Produk & Tagline · 📢 Blast WhatsApp

**🎨 Logo Maker** (halaman `/logo`):

- Brief lengkap ala desainer pro: **nama, deskripsi usaha, target pasar, jenis logo** (wordmark/monogram/ikon+teks/emblem/maskot), **nuansa warna**, gaya, + catatan "harus ada/dihindari"
- Prompt menerapkan prinsip desain logo (sederhana, mudah diingat, relevan, scalable, jalan di 1 warna) & hindari klise/AI-slop
- AI bikin **3 konsep logo SVG** berbeda pendekatan, masing-masing dengan **penjelasan filosofi/makna**; hasil vektor (tajam di ukuran apa pun), unduh `.svg` per konsep, atau "buat 3 konsep lain"
- Kualitas dinaikkan lewat **adaptive thinking + effort tinggi** (model "memikirkan" makna & komposisi dulu sebelum menggambar) — bisa pakai model paling pintar via `AI_LOGO_MODEL` (mis. `anthropic/claude-fable-5`)
- Aman: SVG di-sanitasi server (buang `<script>`/handler) **dan** di-render via `<img>` data-URL (browser menonaktifkan script)

**Dua engine logo (bisa dipilih di UI):**

- ✏️ **Vektor (SVG) — Claude:** keluar vektor + filosofi tiap konsep, bisa diedit & skalakan tanpa batas, nama usaha akurat. Pakai adaptive thinking + effort tinggi.
- 🖼️ **Gambar (PNG) — Google "Nano Banana"** (`gemini-2.5-flash-image`): lebih ilustratif/artistik, hasil PNG siap medsos. Butuh `GEMINI_API_KEY` tersendiri. Catatan: model gambar kadang salah eja nama — selalu cek hasilnya.

> Trade-off: vektor = siap pakai sebagai logo resmi (scalable, editable); gambar Nano Banana = lebih "cakep" tapi raster & ejaan bisa meleset. Sediakan keduanya, biar user pilih sesuai kebutuhan.

**Fitur platform:**

- 🔁 **Refine 1-tap** — sesuaikan hasil: lebih pendek, tambah emoji, lebih formal/santai, atau buat versi lain
- 💼 **Brand Profile** — simpan profil usaha (cocok untuk agensi yang pegang banyak klien), pakai ulang sekali klik
- 🚀 **Preset 1-klik** — contoh usaha (Kedai Kopi, Online Shop, Properti, Coach) untuk demo cepat
- 🌐 **Bahasa output** — Indonesia 🇮🇩 atau English 🇬🇧 (untuk semua jenis konten)
- 🗣️ **Gaya bahasa** (mode Indonesia) — santai/formal, gaul Jaksel, atau campur Jawa/Sunda
- ↓ **Download** hasil `.txt` / `.md` + salin sekali klik
- 🕘 **Riwayat** generate tersimpan di browser, bisa dibuka lagi
- 💳 **Tier Free/Pro** — meter kuota harian + modal upgrade (Saku Klub Konten, Rp 49rb/bln)

> Catatan: meter kuota & status Pro saat ini **client-side (localStorage)** untuk demo pilot — belum ada enforcement server / payment. Untuk produksi, pindahkan ke auth + DB + payment (mis. Lynk.id/Mayar) dan rate-limit per-akun di server.

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Vercel AI Gateway** (endpoint Anthropic Messages API-compatible) via **Anthropic TypeScript SDK** — model `anthropic/claude-opus-4.8`, streaming response (token pertama instan, tanpa thinking delay)
- Desktop & mobile friendly (responsive)

## Menjalankan Lokal

```bash
npm install
cp .env.example .env   # isi AI_GATEWAY_API_KEY
npm run dev
```

Buka http://localhost:3000.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di [vercel.com](https://vercel.com) → **Add New Project** → import repo ini. Framework terdeteksi otomatis (Next.js).
3. Buat API key di **Vercel Dashboard → AI Gateway → API Keys**.
4. Di **Settings → Environment Variables**, tambahkan:
   - `AI_GATEWAY_API_KEY` = API key dari AI Gateway
   - *(opsional)* `AI_MODEL` = `anthropic/claude-opus-4.8` — ganti kalau mau model lain
5. Deploy. Selesai ✅

> Aplikasi memanggil Anthropic **lewat Vercel AI Gateway** (`https://ai-gateway.vercel.sh`), jadi dapat observability, spend limit, dan fallback bawaan Vercel. Model id pakai format `creator/model` (mis. `anthropic/claude-opus-4.8`).

> Catatan: route `/api/generate` memakai `maxDuration = 300` untuk generasi panjang (kalender 30 hari). Di plan Hobby, fungsi dibatasi lebih pendek — kalau generasi panjang terpotong, upgrade ke Pro atau aktifkan Fluid Compute.

## Arsitektur Singkat

```
app/
  page.tsx               → Buat Konten: form + panel hasil (streaming)
  logo/page.tsx          → Logo Maker: form + galeri 3 konsep SVG
  api/generate/route.ts  → POST konten: generate & refine → messages.stream()
  api/logo/route.ts      → POST logo: 3 SVG → extract + sanitasi
  opengraph-image.tsx    → OG image dinamis (next/og) untuk preview link
  icon.svg               → favicon / logo mark Saku Media
components/
  Nav.tsx                → tab Buat Konten / Logo Maker
lib/
  content-types.ts       → 10 jenis konten + refine + system prompt (Bahasa Indonesia)
  logo.ts                → prompt logo + extractSafeSvgs/sanitizeSvg (server)
  logo-client.ts         → daftar gaya logo (client-safe)
```

- System prompt di-cache dengan `cache_control: ephemeral` (hemat token antar request).
- Output di-stream token-per-token ke browser supaya terasa instan.

---

Bagian dari strategi produk **[Idea Miner × Saku Media](./IDEA-MINER-SAKU-MEDIA.md)**.
