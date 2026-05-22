import { ImageResponse } from "next/og";

export const alt = "felix ha";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#191b1f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          position: "relative",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#3a3f4a",
            fontFamily: "monospace",
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span>felixha00.github.io</span>
          <span>PORTFOLIO</span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Eyebrow label */}
        <div
          style={{
            color: "#4a505c",
            fontSize: 15,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "monospace",
            marginBottom: 20,
          }}
        >
          DESIGN · CODE · BUILD
        </div>

        {/* Name */}
        <div
          style={{
            color: "#eef0f3",
            fontSize: 112,
            fontWeight: 700,
            letterSpacing: "-4px",
            lineHeight: 0.88,
            fontFamily: "monospace",
          }}
        >
          felix ha
        </div>

        {/* Bottom rule + footer */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 18,
            borderTop: "1px solid #252830",
            display: "flex",
            justifyContent: "space-between",
            color: "#3a3f4a",
            fontFamily: "monospace",
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span>SOFTWARE · HARDWARE · BRAND · VENTURES</span>
          <span>2025</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
