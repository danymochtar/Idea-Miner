# Saku AI Konten Engine 🪄

Pilot project **Saku Media** — web app pembuat konten medsos untuk UMKM Indonesia, ditenagai **Claude (Anthropic)**.

Isi data usaha → pilih jenis konten → AI menghasilkan konten Bahasa Indonesia siap copy-paste:

- ✍️ **Caption Jualan** — 5 caption IG/TikTok + hashtag
- 📅 **Kalender Konten 30 Hari** — rencana sebulan dengan 3 pilar konten
- 🎬 **Script Reels/TikTok** — 3 script video pendek (hook, isi, CTA)
- 🎯 **Copy Iklan** — 3 variasi copy Meta/TikTok Ads (PAS, AIDA, testimoni)
- 💬 **Template Balasan DM/WA** — 6 situasi chat penjualan

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Anthropic TypeScript SDK** — model `claude-opus-4-8`, adaptive thinking, streaming response
- Desktop & mobile friendly (responsive)

## Menjalankan Lokal

```bash
npm install
cp .env.example .env   # isi ANTHROPIC_API_KEY
npm run dev
```

Buka http://localhost:3000.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di [vercel.com](https://vercel.com) → **Add New Project** → import repo ini. Framework terdeteksi otomatis (Next.js).
3. Di **Settings → Environment Variables**, tambahkan:
   - `ANTHROPIC_API_KEY` = API key dari [platform.claude.com](https://platform.claude.com)
4. Deploy. Selesai ✅

> Catatan: route `/api/generate` memakai `maxDuration = 300` untuk generasi panjang (kalender 30 hari). Di plan Hobby, fungsi dibatasi lebih pendek — kalau generasi panjang terpotong, upgrade ke Pro atau aktifkan Fluid Compute.

## Arsitektur Singkat

```
app/
  page.tsx               → UI form + panel hasil (client, streaming fetch)
  api/generate/route.ts  → POST: validasi input → Anthropic messages.stream()
                           → ReadableStream teks ke browser
lib/
  content-types.ts       → definisi 5 jenis konten + system prompt Bahasa Indonesia
```

- System prompt di-cache dengan `cache_control: ephemeral` (hemat token antar request).
- Output di-stream token-per-token ke browser supaya terasa instan.

---

Bagian dari strategi produk **[Idea Miner × Saku Media](./IDEA-MINER-SAKU-MEDIA.md)**.
