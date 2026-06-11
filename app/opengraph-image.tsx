import { ImageResponse } from "next/og";

export const alt = "Saku AI Konten Engine — by Saku Media";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b3d36",
          color: "white",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "#f5a623",
              color: "#06241f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>Saku Media</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 68, fontWeight: 700, lineHeight: 1.15 }}>
          Konten medsos sebulan,
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, color: "#f5a623" }}>
          jadi dalam satu sore.
        </div>
        <div style={{ marginTop: 36, fontSize: 30, color: "rgba(255,255,255,0.85)" }}>
          AI Konten Engine untuk UMKM Indonesia — caption, kalender, iklan, logo.
        </div>
      </div>
    ),
    { ...size },
  );
}
