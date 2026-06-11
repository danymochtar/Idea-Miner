"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONTENT_TYPES,
  NICHES,
  TONES,
  type ContentTypeId,
} from "@/lib/content-types";

export default function Home() {
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState<string>(NICHES[0]);
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState<string>(TONES[0]);
  const [contentType, setContentType] = useState<ContentTypeId>("caption");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Stick the output panel to the bottom while streaming — but only if the user
  // hasn't scrolled up to re-read earlier content.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !loading) return;
    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [output, loading]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOutput("");
    setCopied(false);
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // On mobile, jump to the output panel so streaming is visible
    outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          niche,
          description,
          tone,
          contentType,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Gagal (HTTP ${res.status})`);
      }
      if (!res.body) throw new Error("Browser tidak mendukung streaming.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setLoading(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Gagal menyalin — silakan blok teks dan salin manual.");
    }
  }

  const selectedType = CONTENT_TYPES.find((c) => c.id === contentType);

  return (
    <main>
      {/* Header */}
      <header className="bg-saku-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-brand font-display text-xl font-bold text-saku-950">
              S
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-tight">
                Saku Media
              </p>
              <p className="text-xs text-saku-100/80 leading-tight">
                AI Konten Engine
              </p>
            </div>
          </div>
          <span className="rounded-full border border-amber-brand/60 px-3 py-1 text-xs font-medium text-amber-brand">
            Pilot Internal
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-saku-900 text-white">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16">
          <h1 className="font-display max-w-2xl text-3xl font-bold leading-snug sm:text-4xl">
            Konten medsos sebulan,
            <span className="text-amber-brand"> jadi dalam satu sore.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-saku-100/90 sm:text-base">
            Isi data usahamu, pilih jenis konten, dan biarkan AI menyusun
            caption, kalender konten, script video, sampai copy iklan — dalam
            Bahasa Indonesia yang siap posting.
          </p>
        </div>
      </section>

      {/* App */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <form
            onSubmit={handleGenerate}
            className="lg:col-span-2 rounded-2xl border border-saku-900/10 bg-white p-5 shadow-sm sm:p-6"
          >
            <h2 className="font-display text-lg font-bold text-saku-900">
              Data Usaha
            </h2>

            <label className="mt-4 block text-sm font-medium text-saku-900">
              Nama usaha
              <input
                required
                maxLength={200}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="contoh: Kopi Senja, Hijab Aira…"
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
                {NICHES.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium text-saku-900">
              Ceritakan usahamu
              <textarea
                required
                maxLength={2000}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Produk/jasa apa yang dijual, siapa target pembelinya, apa keunggulannya…"
                className="mt-1 w-full resize-y rounded-lg border border-saku-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-saku-600 focus:ring-2 focus:ring-saku-100"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-saku-900">
              Tone konten
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-saku-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-saku-600 focus:ring-2 focus:ring-saku-100"
              >
                {TONES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>

            <p className="mt-5 text-sm font-medium text-saku-900">
              Jenis konten
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {CONTENT_TYPES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setContentType(c.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    contentType === c.id
                      ? "border-saku-600 bg-saku-50 ring-2 ring-saku-100"
                      : "border-saku-900/10 bg-white hover:border-saku-600/40"
                  }`}
                >
                  <span className="text-sm font-semibold text-saku-900">
                    {c.emoji} {c.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-saku-900/60">
                    {c.description}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-amber-brand px-4 py-3 text-sm font-bold text-saku-950 shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sedang membuat konten…" : "✨ Buatkan Konten"}
            </button>
          </form>

          {/* Output */}
          <div
            ref={outputRef}
            className="lg:col-span-3 flex min-h-[60vh] flex-col rounded-2xl border border-saku-900/10 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-saku-900/10 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-lg font-bold text-saku-900">
                  Hasil Konten
                </h2>
                {selectedType && (
                  <p className="text-xs text-saku-900/60">
                    {selectedType.emoji} {selectedType.label}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {loading && (
                  <button
                    onClick={handleStop}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    ■ Stop
                  </button>
                )}
                {output && !loading && (
                  <button
                    onClick={handleCopy}
                    className="rounded-lg bg-saku-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-saku-700"
                  >
                    {copied ? "✓ Tersalin!" : "⧉ Salin Semua"}
                  </button>
                )}
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-auto px-5 py-4 sm:px-6"
            >
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {!error && !output && !loading && (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <span className="text-4xl">🪄</span>
                  <p className="mt-3 max-w-xs text-sm text-saku-900/50">
                    Hasil kontenmu akan muncul di sini. Isi form, pilih jenis
                    konten, lalu klik{" "}
                    <span className="font-semibold">Buatkan Konten</span>.
                  </p>
                </div>
              )}
              {loading && !output && (
                <div className="flex items-center gap-2 text-sm text-saku-900/60">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-brand" />
                  Saku AI sedang meracik konten untukmu…
                </div>
              )}
              {output && (
                <pre className="whitespace-pre-wrap break-words font-body text-sm leading-relaxed text-saku-950">
                  {output}
                  {loading && (
                    <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-amber-brand align-text-bottom" />
                  )}
                </pre>
              )}
            </div>
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
