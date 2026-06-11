import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://saku-media.vercel.app",
  ),
  title: "Saku AI Konten Engine — by Saku Media",
  description:
    "Bikin 30 hari konten medsos, caption jualan, script Reels, copy iklan, sampai logo dalam hitungan menit. Powered by AI, dibuat untuk UMKM Indonesia.",
  openGraph: {
    title: "Saku AI Konten Engine — by Saku Media",
    description:
      "AI Konten Engine untuk UMKM Indonesia — caption, kalender konten, copy iklan, sampai logo. Powered by Claude.",
    type: "website",
    locale: "id_ID",
    siteName: "Saku Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saku AI Konten Engine — by Saku Media",
    description:
      "Bikin konten medsos & logo UMKM dalam hitungan menit, pakai AI.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
