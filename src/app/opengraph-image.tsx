import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";

export const alt = "felix ha: designer, engineer, maker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

const fontsDir = path.join(process.cwd(), "node_modules/geist/dist/fonts/geist-mono");
const geistMonoBold = readFileSync(path.join(fontsDir, "GeistMono-Bold.ttf"));
const geistMonoRegular = readFileSync(path.join(fontsDir, "GeistMono-Regular.ttf"));

const BG = "#191b1f";
const FG = "#eef0f3";
const MUTED = "#5e6470";
const DIM = "#252830";
const ROLE_TEXT = "#1c1a18";

// role identity colours
const DESIGNER = "#f07050";
const DESIGNER_SHADOW = "#8b3018";
const ENGINEER = "#55c070";
const ENGINEER_SHADOW = "#186838";
const MAKER = "#6b80f5";
const MAKER_SHADOW = "#1a32a0";

type PillProps = {
  label: string;
  bg: string;
  shadow: string;
};

function Pill({ label, bg, shadow }: PillProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: bg,
        color: ROLE_TEXT,
        borderRadius: 7,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 26,
        fontWeight: 400,
        fontFamily: "GeistMono",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 0 ${shadow}`,
      }}
    >
      {label}
    </div>
  );
}

export default function Image() {
  const domain =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") ??
    "felixha.com";

  return new ImageResponse(
    (
      <div
        style={{
          background: BG,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 64px",
          fontFamily: "GeistMono",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: MUTED,
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>{domain}</span>
          <span>Portfolio</span>
        </div>

        {/* Center: name + role pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div
            style={{
              color: FG,
              fontSize: 108,
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 0.88,
              fontFamily: "GeistMono",
            }}
          >
            felix ha
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Pill label="Designer" bg={DESIGNER} shadow={DESIGNER_SHADOW} />
            <Pill label="Engineer" bg={ENGINEER} shadow={ENGINEER_SHADOW} />
            <Pill label="Maker" bg={MAKER} shadow={MAKER_SHADOW} />
          </div>
        </div>

        {/* Bottom: disciplines + year */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: DIM,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            borderTop: `1px solid ${DIM}`,
            paddingTop: 16,
          }}
        >
          <span>Software · Hardware · Brand · Ventures</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "GeistMono", data: geistMonoBold, weight: 700, style: "normal" },
        { name: "GeistMono", data: geistMonoRegular, weight: 400, style: "normal" },
      ],
    }
  );
}
