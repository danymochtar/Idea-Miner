import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saku AI Konten Engine — by Saku Media",
  description:
    "Bikin 30 hari konten medsos, caption jualan, script Reels, dan copy iklan dalam hitungan menit. Powered by AI, dibuat untuk UMKM Indonesia.",
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
