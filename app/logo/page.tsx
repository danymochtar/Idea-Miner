"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import {
  COLOR_MOODS,
  LOGO_STYLES,
  LOGO_TYPES,
  NICHES_FALLBACK,
} from "@/lib/logo-client";

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function LogoMaker() {
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState<string>(NICHES_FALLBACK[0]);
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [style, setStyle] = useState<string>(LOGO_STYLES[0].id);
  const [logoType, setLogoType] = useState<string>(LOGO_TYPES[0].id);
  const [colorMood, setColorMood] = useState<string>(COLOR_MOODS[0].id);
  const [notes, setNotes] = useState("");

  const [logos, setLogos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setLogos([]);
    try {
      const res = await fetch("/api/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          niche,
          description,
          target,
          style,
          logoType,
          colorMood,
          notes,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? `Gagal (HTTP ${res.status})`);
      }
      setLogos(data.logos ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  function downloadSvg(svg: string, index: number) {
    const slug =
      (businessName.trim() || "logo")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "logo";
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-logo-${index + 1}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      {/* Header */}
      <header className="bg-saku-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-brand font-display text-xl font-bold text-saku-950">
              S
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-tight">
                Saku Media
              </p>
              <p className="text-xs leading-tight text-saku-100/80">
                Logo Maker
              </p>
            </div>
          </div>
          <span className="rounded-full border border-amber-brand/60 px-3 py-1 text-xs font-medium text-amber-brand">
            Pilot Internal
          </span>
        </div>
      </header>
      <Nav />

      {/* Hero */}
      <section className="bg-saku-900 text-white">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14">
          <h1 className="font-display max-w-2xl text-3xl font-bold leading-snug sm:text-4xl">
            Logo usaha,
            <span className="text-amber-brand"> jadi dalam semenit.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-saku-100/90 sm:text-base">
            Ketik nama usaha & pilih gaya — AI bikinkan 3 konsep logo SVG yang
            bisa langsung diunduh dan dipakai di medsos, kemasan, atau profil.
          </p>
        </div>
      </section>

      {/* App */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <form
            onSubmit={handleGenerate}
            className="rounded-2xl border border-saku-900/10 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2"
          >
            <h2 className="font-display text-lg font-bold text-saku-900">
              Buat Logo
            </h2>

            <label className="mt-4 block text-sm font-medium text-saku-900">
              Nama usaha
              <input
                required
                maxLength={200}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="contoh: Kopi Senja"
                className="mt-1 w-full rounded-lg border border-saku-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-saku-600 focus:ring-2 focus:ring-saku-100"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-saku-900">
              Kategori usaha
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="mt-1 w-full rounded-lg border border-saku-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-saku-600 focus:ring-2 focus:ring-saku-100"
              >
                {NICHES_FALLBACK.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium text-saku-900">
              Deskripsi usaha
              <textarea
                required
                maxLength={2000}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jualan apa, apa keunggulannya, kesan/karakter yang diinginkan…"
                className="mt-1 w-full resize-y rounded-lg border border-saku-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-saku-600 focus:ring-2 focus:ring-saku-100"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-saku-900">
              Target pasar{" "}
              <span className="font-normal text-saku-900/40">(opsional)</span>
              <input
                maxLength={200}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="contoh: anak muda 18–25, ibu rumah tangga…"
                className="mt-1 w-full rounded-lg border border-saku-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-saku-600 focus:ring-2 focus:ring-saku-100"
              />
            </label>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-saku-900">
                Jenis logo
                <select
                  value={logoType}
                  onChange={(e) => setLogoType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-saku-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-saku-600 focus:ring-2 focus:ring-saku-100"
                >
                  {LOGO_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-saku-900">
                Nuansa warna
                <select
                  value={colorMood}
                  onChange={(e) => setColorMood(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-saku-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-saku-600 focus:ring-2 focus:ring-saku-100"
                >
                  {COLOR_MOODS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="mt-5 text-sm font-medium text-saku-900">Gaya logo</p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LOGO_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    style === s.id
                      ? "border-saku-600 bg-saku-50 ring-2 ring-saku-100"
                      : "border-saku-900/10 bg-white hover:border-saku-600/40"
                  }`}
                >
                  <span className="text-sm font-semibold text-saku-900">
                    {s.emoji} {s.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-saku-900/60">
                    {s.hint}
                  </span>
                </button>
              ))}
            </div>

            <label className="mt-4 block text-sm font-medium text-saku-900">
              Harus ada / dihindari{" "}
              <span className="font-normal text-saku-900/40">(opsional)</span>
              <input
                maxLength={300}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="contoh: ada gambar cangkir kopi; hindari warna merah"
                className="mt-1 w-full rounded-lg border border-saku-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-saku-600 focus:ring-2 focus:ring-saku-100"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-amber-brand px-4 py-3 text-sm font-bold text-saku-950 shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sedang mendesain logo…" : "🎨 Buatkan Logo"}
            </button>
            <p className="mt-2 text-center text-xs text-saku-900/50">
              Hasil berupa file SVG (vektor) — tajam di ukuran berapa pun.
            </p>
          </form>

          {/* Output */}
          <div className="lg:col-span-3">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {!error && logos.length === 0 && !loading && (
              <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-saku-900/15 bg-white/60 p-8 text-center">
                <span className="text-4xl">🎨</span>
                <p className="mt-3 max-w-xs text-sm text-saku-900/50">
                  3 konsep logo akan muncul di sini. Isi nama usaha, pilih gaya,
                  lalu klik <span className="font-semibold">Buatkan Logo</span>.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-saku-900/10 bg-white">
                <div className="flex items-center gap-2 text-sm text-saku-900/60">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-brand" />
                  Saku AI sedang mendesain 3 konsep logo…
                </div>
              </div>
            )}

            {logos.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {logos.map((svg, i) => (
                  <div
                    key={i}
                    className="flex flex-col rounded-2xl border border-saku-900/10 bg-white p-4 shadow-sm"
                  >
                    <div className="flex aspect-square items-center justify-center rounded-xl bg-cream p-3">
                      {/* SVG rendered via <img> → browser disables scripts (safe) */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={svgToDataUrl(svg)}
                        alt={`Konsep logo ${i + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <button
                      onClick={() => downloadSvg(svg, i)}
                      className="mt-3 w-full rounded-lg bg-saku-600 px-3 py-2 text-xs font-semibold text-white hover:bg-saku-700"
                    >
                      ↓ Unduh SVG #{i + 1}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {logos.length > 0 && (
              <button
                onClick={() =>
                  handleGenerate({
                    preventDefault: () => {},
                  } as React.FormEvent)
                }
                disabled={loading}
                className="mt-4 w-full rounded-xl border border-saku-900/15 bg-white px-4 py-2.5 text-sm font-semibold text-saku-900 hover:bg-saku-50 disabled:opacity-60"
              >
                🔄 Buat 3 konsep lain
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-saku-900/10 py-6">
        <p className="text-center text-xs text-saku-900/50">
          © {new Date().getFullYear()} Saku Media — IT, Web Development &
          Social Media Management. Powered by Claude (Anthropic).
        </p>
      </footer>
    </main>
  );
}
