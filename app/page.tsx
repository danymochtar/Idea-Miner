"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import {
  CONTENT_TYPES,
  LANGUAGE_STYLES,
  NICHES,
  OUTPUT_LANGS,
  PRESETS,
  REFINE_ACTIONS,
  TONES,
  type ContentTypeId,
  type OutputLang,
  type Preset,
} from "@/lib/content-types";

interface HistoryItem {
  id: string;
  ts: number;
  businessName: string;
  typeLabel: string;
  output: string;
}

interface BrandProfile {
  id: string;
  businessName: string;
  niche: string;
  description: string;
  tone: string;
  language: string;
}

interface Quota {
  date: string;
  count: number;
}

const HISTORY_KEY = "saku-history-v1";
const PROFILES_KEY = "saku-profiles-v1";
const QUOTA_KEY = "saku-quota-v1";
const PRO_KEY = "saku-pro-v1";
const FREE_LIMIT = 8;
const ERROR_ONLY = /^\[[^\]]*\]$/; // a pure inline-error response (one bracketed line)

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Home() {
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState<string>(NICHES[0]);
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState<string>(TONES[0]);
  const [contentType, setContentType] = useState<ContentTypeId>("caption");
  const [language, setLanguage] = useState<string>(LANGUAGE_STYLES[0].id);
  const [outputLang, setOutputLang] = useState<OutputLang>("id");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [profiles, setProfiles] = useState<BrandProfile[]>([]);
  const [quota, setQuota] = useState<Quota>({ date: todayStr(), count: 0 });
  const [isPro, setIsPro] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ---- Load persisted state once ----
  useEffect(() => {
    try {
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) setHistory(JSON.parse(h));
      const p = localStorage.getItem(PROFILES_KEY);
      if (p) setProfiles(JSON.parse(p));
      setIsPro(localStorage.getItem(PRO_KEY) === "1");
      const q = localStorage.getItem(QUOTA_KEY);
      if (q) {
        const parsed: Quota = JSON.parse(q);
        setQuota(parsed.date === todayStr() ? parsed : { date: todayStr(), count: 0 });
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  // Stick the output panel to the bottom while streaming — unless the user
  // scrolled up to re-read earlier content.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !loading) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [output, loading]);

  const usedToday = quota.date === todayStr() ? quota.count : 0;
  const remaining = isPro ? Infinity : Math.max(0, FREE_LIMIT - usedToday);

  // ---- Quota ----
  function ensureQuota(): boolean {
    if (remaining <= 0) {
      setShowUpgrade(true);
      return false;
    }
    return true;
  }

  function consumeQuota() {
    if (isPro) return;
    setQuota(() => {
      const base = quota.date === todayStr() ? quota.count : 0;
      const next: Quota = { date: todayStr(), count: base + 1 };
      try {
        localStorage.setItem(QUOTA_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function activatePro() {
    setIsPro(true);
    setShowUpgrade(false);
    try {
      localStorage.setItem(PRO_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  // ---- Brand profiles ----
  function saveProfile() {
    if (!businessName.trim()) {
      setError("Isi nama usaha dulu sebelum menyimpan profil.");
      return;
    }
    const item: BrandProfile = {
      id: crypto.randomUUID(),
      businessName: businessName.trim(),
      niche,
      description,
      tone,
      language,
    };
    setProfiles((prev) => {
      const next = [item, ...prev].slice(0, 10);
      try {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function loadProfile(p: BrandProfile) {
    setBusinessName(p.businessName);
    setNiche(p.niche);
    setDescription(p.description);
    setTone(p.tone);
    setLanguage(p.language);
    setError(null);
  }

  function deleteProfile(id: string) {
    setProfiles((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function applyPreset(p: Preset) {
    setBusinessName(p.businessName);
    setNiche(p.niche);
    setDescription(p.description);
    setTone(p.tone);
    setContentType(p.contentType);
    setLanguage(p.language);
    setOutputLang("id");
    setError(null);
  }

  // ---- History ----
  function saveToHistory(text: string) {
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      ts: Date.now(),
      businessName: businessName.trim() || "Tanpa nama",
      typeLabel:
        CONTENT_TYPES.find((c) => c.id === contentType)?.label ?? "Konten",
      output: text,
    };
    setHistory((prev) => {
      const next = [item, ...prev].slice(0, 15);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      /* ignore */
    }
  }

  // ---- Streaming core (shared by generate + refine) ----
  function beginRequest(): AbortSignal {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    return controller.signal;
  }

  async function streamInto(
    body: Record<string, unknown>,
    signal: AbortSignal,
  ): Promise<string> {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? `Gagal (HTTP ${res.status})`);
    }
    if (!res.body) throw new Error("Browser tidak mendukung streaming.");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      full += decoder.decode(value, { stream: true });
      setOutput(full);
    }
    return full;
  }

  /** Returns true if `full` is real content (not a pure inline error). */
  function finalize(full: string): boolean {
    const trimmed = full.trim();
    if (ERROR_ONLY.test(trimmed)) {
      setError(trimmed.replace(/^\[|\]$/g, ""));
      setOutput("");
      return false;
    }
    return trimmed.length > 0;
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!ensureQuota()) return;
    setError(null);
    setOutput("");
    setCopied(false);
    setLoading(true);
    const signal = beginRequest();
    outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    let full = "";
    try {
      full = await streamInto(
        {
          businessName,
          niche,
          description,
          tone,
          contentType,
          language,
          outputLang,
        },
        signal,
      );
      if (finalize(full)) {
        saveToHistory(full);
        consumeQuota();
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        if (full.trim()) saveToHistory(full);
        return;
      }
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefine(actionId: string) {
    if (!output || loading) return;
    if (!ensureQuota()) return;
    const prev = output;
    setError(null);
    setCopied(false);
    setLoading(true);
    setOutput("");
    const signal = beginRequest();

    let full = "";
    try {
      full = await streamInto(
        { refine: actionId, previousOutput: prev, outputLang },
        signal,
      );
      if (finalize(full)) {
        saveToHistory(full);
        consumeQuota();
      } else {
        setOutput(prev); // restore original on inline error
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setOutput(full.trim() || prev);
        return;
      }
      setOutput(prev);
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

  function handleDownload(ext: "txt" | "md") {
    const slug =
      (businessName.trim() || "saku-konten")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "konten";
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-${contentType}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const selectedType = CONTENT_TYPES.find((c) => c.id === contentType);
  const hasOutput = output.length > 0 && !loading;

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
                AI Konten Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              {isPro ? (
                <span className="text-xs font-semibold text-amber-brand">
                  ★ Pro · Tanpa batas
                </span>
              ) : (
                <span className="text-xs text-saku-100/80">
                  Kuota: {usedToday}/{FREE_LIMIT} hari ini
                </span>
              )}
            </div>
            {!isPro && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="rounded-full bg-amber-brand px-3 py-1 text-xs font-bold text-saku-950 hover:brightness-105"
              >
                Upgrade Pro
              </button>
            )}
          </div>
        </div>
      </header>
      <Nav />

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
        {/* Saved profiles */}
        {profiles.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-saku-900">
              💼 Profil usaha tersimpan:
            </p>
            <div className="flex flex-wrap gap-2">
              {profiles.map((p) => (
                <span
                  key={p.id}
                  className="group inline-flex items-center gap-1 rounded-full border border-saku-600/30 bg-saku-50 py-1 pl-3 pr-1 text-xs font-medium text-saku-900"
                >
                  <button
                    type="button"
                    onClick={() => loadProfile(p)}
                    className="hover:underline"
                  >
                    {p.businessName}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProfile(p.id)}
                    aria-label="Hapus profil"
                    className="flex h-4 w-4 items-center justify-center rounded-full text-saku-900/40 hover:bg-red-100 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Presets */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-saku-900">
            🚀 Coba cepat (contoh usaha):
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className="rounded-full border border-saku-900/15 bg-white px-3 py-1.5 text-xs font-medium text-saku-900 shadow-sm transition hover:border-saku-600 hover:bg-saku-50"
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <form
            onSubmit={handleGenerate}
            className="rounded-2xl border border-saku-900/10 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-saku-900">
                Data Usaha
              </h2>
              <button
                type="button"
                onClick={saveProfile}
                className="text-xs font-semibold text-saku-600 hover:underline"
              >
                💾 Simpan profil
              </button>
            </div>

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

            {/* Output language */}
            <div className="mt-4 text-sm font-medium text-saku-900">
              Bahasa output
              <div className="mt-1 grid grid-cols-2 gap-2 rounded-xl bg-cream p-1">
                {OUTPUT_LANGS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOutputLang(o.id)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      outputLang === o.id
                        ? "bg-saku-600 text-white shadow-sm"
                        : "text-saku-900/70 hover:text-saku-900"
                    }`}
                  >
                    {o.flag} {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-saku-900">
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

              {outputLang === "id" && (
                <label className="block text-sm font-medium text-saku-900">
                  Gaya bahasa
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-saku-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-saku-600 focus:ring-2 focus:ring-saku-100"
                  >
                    {LANGUAGE_STYLES.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            <p className="mt-5 text-sm font-medium text-saku-900">
              Jenis konten
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
            {!isPro && (
              <p className="mt-2 text-center text-xs text-saku-900/50">
                Sisa kuota gratis hari ini: {remaining}/{FREE_LIMIT}
              </p>
            )}
          </form>

          {/* Output */}
          <div
            ref={outputRef}
            className="flex min-h-[60vh] flex-col rounded-2xl border border-saku-900/10 bg-white shadow-sm lg:col-span-3"
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
              <div className="flex flex-wrap justify-end gap-2">
                {loading && (
                  <button
                    onClick={handleStop}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    ■ Stop
                  </button>
                )}
                {hasOutput && (
                  <>
                    <button
                      onClick={() => handleDownload("txt")}
                      className="rounded-lg border border-saku-900/15 px-3 py-1.5 text-xs font-semibold text-saku-900 hover:bg-saku-50"
                    >
                      ↓ .txt
                    </button>
                    <button
                      onClick={() => handleDownload("md")}
                      className="rounded-lg border border-saku-900/15 px-3 py-1.5 text-xs font-semibold text-saku-900 hover:bg-saku-50"
                    >
                      ↓ .md
                    </button>
                    <button
                      onClick={handleCopy}
                      className="rounded-lg bg-saku-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-saku-700"
                    >
                      {copied ? "✓ Tersalin!" : "⧉ Salin"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Refine toolbar */}
            {hasOutput && (
              <div className="flex flex-wrap items-center gap-2 border-b border-saku-900/10 bg-cream/60 px-5 py-3 sm:px-6">
                <span className="text-xs font-medium text-saku-900/60">
                  Sesuaikan:
                </span>
                {REFINE_ACTIONS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleRefine(a.id)}
                    className="rounded-full border border-saku-900/15 bg-white px-3 py-1 text-xs font-medium text-saku-900 transition hover:border-saku-600 hover:bg-saku-50"
                  >
                    {a.emoji} {a.label}
                  </button>
                ))}
              </div>
            )}

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
                <pre className="font-body whitespace-pre-wrap break-words text-sm leading-relaxed text-saku-950">
                  {output}
                  {loading && (
                    <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-amber-brand align-text-bottom" />
                  )}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8 rounded-2xl border border-saku-900/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-saku-900">
                🕘 Riwayat ({history.length})
              </h2>
              <button
                onClick={clearHistory}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Hapus semua
              </button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    setOutput(h.output);
                    setError(null);
                    outputRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="rounded-xl border border-saku-900/10 bg-cream px-4 py-3 text-left transition hover:border-saku-600"
                >
                  <p className="truncate text-sm font-semibold text-saku-900">
                    {h.businessName}
                  </p>
                  <p className="text-xs text-saku-900/60">
                    {h.typeLabel} ·{" "}
                    {new Date(h.ts).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-saku-900/50">
                    {h.output.slice(0, 120)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-saku-900/10 py-6">
        <p className="text-center text-xs text-saku-900/50">
          © {new Date().getFullYear()} Saku Media — IT, Web Development &
          Social Media Management. Powered by Claude (Anthropic).
        </p>
      </footer>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-saku-950/60 p-4"
          onClick={() => setShowUpgrade(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">★</span>
              <h3 className="font-display text-xl font-bold text-saku-900">
                Saku Klub Konten — Pro
              </h3>
            </div>
            <p className="mt-2 text-sm text-saku-900/70">
              {remaining <= 0
                ? "Kuota gratis hari ini sudah habis. Upgrade untuk lanjut tanpa batas."
                : "Buka semua fitur tanpa batas pemakaian."}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-saku-900">
              <li>✓ Generate & refine tanpa batas</li>
              <li>✓ Semua jenis konten + gaya bahasa</li>
              <li>✓ Template & prompt baru tiap bulan</li>
              <li>✓ Prioritas dukungan dari Saku Media</li>
            </ul>
            <div className="mt-5 rounded-xl bg-saku-50 px-4 py-3 text-center">
              <span className="font-display text-2xl font-bold text-saku-900">
                Rp 49.000
              </span>
              <span className="text-sm text-saku-900/60"> /bulan</span>
            </div>
            <button
              onClick={activatePro}
              className="mt-5 w-full rounded-xl bg-amber-brand px-4 py-3 text-sm font-bold text-saku-950 hover:brightness-105"
            >
              Aktifkan Pro (demo)
            </button>
            <button
              onClick={() => setShowUpgrade(false)}
              className="mt-2 w-full rounded-xl px-4 py-2 text-sm font-medium text-saku-900/60 hover:bg-saku-50"
            >
              Nanti dulu
            </button>
            <p className="mt-3 text-center text-[11px] text-saku-900/40">
              *Demo pilot — pembayaran belum aktif. Integrasi payment (mis.
              Lynk.id / Mayar) menyusul.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
