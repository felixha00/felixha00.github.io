"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const HOBBIES = [
  { emoji: "🧗", label: "ROCK CLIMBING", code: "CLM" },
  { emoji: "🎛️", label: "RAVING", code: "RAV" },
  { emoji: "🎮", label: "GAMING", code: "GAM" },
  { emoji: "💻", label: "DEV", code: "DEV" },
  { emoji: "🖌️", label: "GRAPHIC DESIGN", code: "GFX" },
  { emoji: "🔧", label: "MAKING", code: "FAB" },
  { emoji: "🏋️", label: "WEIGHTLIFTING", code: "WLT" },
  { emoji: "🤸", label: "CALISTHENICS", code: "CAL" },
  { emoji: "🖥️", label: "HOMELAB", code: "SRV" },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_./";

function useScramble(target: string | null) {
  const [text, setText] = useState<string>("");
  const [settled, setSettled] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    if (!target) {
      setText("");
      setSettled(false);
      return;
    }

    setSettled(false);
    let iter = 0;
    const maxIter = target.length * 3;

    const tick = () => {
      iter++;
      const done = Math.floor(iter / 3);
      const out = target
        .split("")
        .map((ch, i) => {
          if (i < done) return ch;
          if (ch === " ") return " ";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setText(out);
      if (iter < maxIter) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setText(target);
        setSettled(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return { text, settled };
}

export function HobbiesCard() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const { text, settled } = useScramble(hovered);

  const procLabel = hovered
    ? `PROC_${hovered.replace(/\s+/g, "_")}`
    : "HOVER TO PROBE";

  return (
    <Card className="rounded-none overflow-hidden col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Interests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Readout display */}
        <div className="px-6 py-4">
          <div className="flex items-baseline gap-1 min-h-9">
            {hovered ? (
              <span className="font-display text-3xl leading-none tracking-tight">
                {text}
              </span>
            ) : (
              <span
                className="font-display text-3xl leading-none tracking-tight"
                style={{ color: "oklch(0.556 0 0 / 0.3)" }}
              >
                [ IDLE ]
              </span>
            )}
            <span
              className="font-display text-2xl leading-none"
              style={{
                color: "oklch(0.556 0 0 / 0.4)",
                animation: settled || !hovered ? "hobby-blink 1.1s step-end infinite" : "none",
              }}
            >
              _
            </span>
          </div>
          <div className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {procLabel}
          </div>
        </div>

        <Separator />

        {/* Infinite emoji ticker */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => {
            setPaused(false);
            setHovered(null);
          }}
        >
          <div
            className="flex"
            style={{
              width: "max-content",
              animation: `hobby-scroll 28s linear infinite`,
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {[...HOBBIES, ...HOBBIES].map((h, i) => (
              <button
                key={i}
                type="button"
                tabIndex={i < HOBBIES.length ? 0 : -1}
                aria-label={h.label}
                className="relative flex flex-col items-center justify-center w-[76px] h-[76px] shrink-0 cursor-default select-none border-0 bg-transparent focus-visible:outline-none"
                onMouseEnter={() => setHovered(h.label)}
                onFocus={() => {
                  setPaused(true);
                  setHovered(h.label);
                }}
                onBlur={() => {
                  setPaused(false);
                  setHovered(null);
                }}
              >
                <span
                  className="text-[2rem] leading-none transition-transform duration-100"
                  style={{
                    transform: hovered === h.label ? "scale(1.15)" : "scale(1)",
                    opacity: hovered && hovered !== h.label ? 0.35 : 1,
                    transition: "transform 100ms, opacity 100ms",
                  }}
                >
                  {h.emoji}
                </span>
                <span
                  className="font-mono text-[8px] uppercase tracking-widest mt-1.5 transition-opacity duration-100"
                  style={{ opacity: hovered === h.label ? 0.75 : 0.2 }}
                >
                  {h.code}
                </span>
                <span
                  className="absolute inset-x-2 bottom-0 h-px bg-foreground transition-opacity duration-100"
                  style={{ opacity: hovered === h.label ? 0.5 : 0 }}
                />
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
