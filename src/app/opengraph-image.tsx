import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #6d28d9 50%, #0f172a 100%)",
        color: "white",
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        textAlign: "center",
      }}
    >
      <div
        style={{
          padding: "40px 80px",
          borderRadius: 24,
          background: "rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        Your Portfolio
      </div>
    </div>,
    size,
  );
}
