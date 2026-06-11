# Saku AI Konten Engine 🪄

Pilot project **Saku Media** — web app pembuat konten medsos untuk UMKM Indonesia, ditenagai **Claude (Anthropic)**.

Isi data usaha → pilih jenis konten → AI menghasilkan konten Bahasa Indonesia siap copy-paste:

**10 jenis konten:**

- ✍️ Caption Jualan · 📅 Kalender Konten 30 Hari · 🎬 Script Reels/TikTok · 🎯 Copy Iklan (PAS/AIDA/testimoni) · 💬 Template Balasan DM/WA
- 📇 Bio/Profil Usaha · ⭐ Balasan Review · 🎁 Ide Promo & Diskon · 🏷️ Nama Produk & Tagline · 📢 Blast WhatsApp

**Fitur platform:**

- 🔁 **Refine 1-tap** — sesuaikan hasil: lebih pendek, tambah emoji, lebih formal/santai, atau buat versi lain
- 💼 **Brand Profile** — simpan profil usaha (cocok untuk agensi yang pegang banyak klien), pakai ulang sekali klik
- 🚀 **Preset 1-klik** — contoh usaha (Kedai Kopi, Online Shop, Properti, Coach) untuk demo cepat
- 🗣️ **Gaya bahasa** — Indonesia santai/formal, gaul Jaksel, atau campur Jawa/Sunda
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
  page.tsx               → UI form + panel hasil (client, streaming fetch)
  api/generate/route.ts  → POST: validasi input → messages.stream() via AI Gateway
                           → ReadableStream teks ke browser
lib/
  content-types.ts       → definisi 5 jenis konten + system prompt Bahasa Indonesia
```

- System prompt di-cache dengan `cache_control: ephemeral` (hemat token antar request).
- Output di-stream token-per-token ke browser supaya terasa instan.

---

Bagian dari strategi produk **[Idea Miner × Saku Media](./IDEA-MINER-SAKU-MEDIA.md)**.
