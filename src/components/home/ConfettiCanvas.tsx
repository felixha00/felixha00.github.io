"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Matter from "matter-js";

// ── Icon renderers ───────────────────────────────────────────────────────────
// Each draws into a square canvas at `size` pixels, matching the SVG icons
// in the hero buttons (FrameIcon / CogIcon / BoxesIcon).

function drawDesignerPiece(ctx: CanvasRenderingContext2D, size: number, color: string) {
  const s = size / 24;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(22 * s, 6 * s); ctx.lineTo(2 * s, 6 * s); // top
  ctx.moveTo(22 * s, 18 * s); ctx.lineTo(2 * s, 18 * s); // bottom
  ctx.moveTo(6 * s, 2 * s); ctx.lineTo(6 * s, 22 * s); // left
  ctx.moveTo(18 * s, 2 * s); ctx.lineTo(18 * s, 22 * s); // right
  ctx.stroke();
}

function drawEngineerPiece(ctx: CanvasRenderingContext2D, size: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.save();
  ctx.scale(size / 24, size / 24);
  [
    "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
    "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    "M12 2v2", "M12 22v-2",
    "m17 20.66-1-1.73", "M11 10.27 7 3.34",
    "m20.66 17-1.73-1", "m3.34 7 1.73 1",
    "M14 12h8", "M2 12h2",
    "m20.66 7-1.73 1", "m3.34 17 1.73-1",
    "m17 3.34-1 1.73", "m11 13.73-4 6.93",
  ].forEach(d => ctx.stroke(new Path2D(d)));
  ctx.restore();
}

function drawMakerPiece(ctx: CanvasRenderingContext2D, size: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.save();
  ctx.scale(size / 24, size / 24);
  [
    "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z m4.03 3.58 -4.74 -2.85 m4.74 2.85 5-3 m-5 3v5.17",
    "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z m5 3-5-3 m5 3 4.74-2.85 M17 16.5v5.17",
    "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z M12 8 7.26 5.15 m4.74 2.85 4.74-2.85 M12 13.5V8",
  ].forEach(d => ctx.stroke(new Path2D(d)));
  ctx.restore();
}

// ── Config ───────────────────────────────────────────────────────────────────

export type ConfettiRole = "designer" | "engineer" | "maker";

const PIECE_SIZE = 46;
const MAX_BODIES = 140;
const SPAWN_COUNT = 22;
const BASE_GRAVITY = 2.8;
const PUSHER_R = 30;
// Fade begins at this fraction of canvas height, pieces are fully gone at bottom edge
const FADE_START = 0.72;

// 5 OKLCH variants per role
const COLOR_VARIANTS: Record<ConfettiRole, string[]> = {
  designer: [
    "oklch(0.88 0.14 22)",
    "oklch(0.83 0.17 15)",
    "oklch(0.93 0.10 30)",
    "oklch(0.79 0.19 11)",
    "oklch(0.91 0.12 36)",
  ],
  engineer: [
    "oklch(0.88 0.15 142)",
    "oklch(0.83 0.18 135)",
    "oklch(0.93 0.11 151)",
    "oklch(0.79 0.20 128)",
    "oklch(0.91 0.13 158)",
  ],
  maker: [
    "oklch(0.85 0.17 250)",
    "oklch(0.80 0.21 243)",
    "oklch(0.90 0.12 259)",
    "oklch(0.77 0.22 238)",
    "oklch(0.92 0.10 266)",
  ],
};

const VARIANT_COUNT = COLOR_VARIANTS.designer.length;

type DrawFn = (ctx: CanvasRenderingContext2D, size: number, color: string) => void;
const DRAWERS: Record<ConfettiRole, DrawFn> = {
  designer: drawDesignerPiece,
  engineer: drawEngineerPiece,
  maker: drawMakerPiece,
};

function makePieceImage(role: ConfettiRole, color: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = PIECE_SIZE;
  c.height = PIECE_SIZE;
  const ctx = c.getContext("2d");
  if (ctx) DRAWERS[role](ctx, PIECE_SIZE, color);
  return c;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodyRolesRef = useRef<Map<number, ConfettiRole>>(new Map());
  const bodyVariantRef = useRef<Map<number, number>>(new Map());
  const imagesRef = useRef<Record<ConfettiRole, HTMLCanvasElement[]> | null>(null);
  const wallsRef = useRef<{ left: Matter.Body; right: Matter.Body } | null>(null);
  const pusherRef = useRef<Matter.Body | null>(null);
  const rafRef = useRef<number>(0);
  const bodyCountRef = useRef(0);
  const curMouseRef = useRef({ x: -2000, y: -2000 });
  const prevMouseRef = useRef({ x: -2000, y: -2000 });

  // SSR guard — false on server, true on client, no extra render cycle
  const isClient = useSyncExternalStore(() => () => { }, () => true, () => false);

  useEffect(() => {
    if (!canvasRef.current) return;

    imagesRef.current = {
      designer: COLOR_VARIANTS.designer.map(c => makePieceImage("designer", c)),
      engineer: COLOR_VARIANTS.engineer.map(c => makePieceImage("engineer", c)),
      maker: COLOR_VARIANTS.maker.map(c => makePieceImage("maker", c)),
    };

    const engine = Matter.Engine.create({ gravity: { x: 0, y: BASE_GRAVITY } });
    engineRef.current = engine;

    const runner = Matter.Runner.create({ delta: 1000 / 60 });
    runnerRef.current = runner;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // No ground — pieces fall through the viewport and are culled in the render tick
    const leftWall = Matter.Bodies.rectangle(-25, h / 2, 50, h * 2, { isStatic: true, label: "wall" });
    const rightWall = Matter.Bodies.rectangle(w + 25, h / 2, 50, h * 2, { isStatic: true, label: "wall" });
    wallsRef.current = { left: leftWall, right: rightWall };

    // Kinematic mouse pusher (static, but we drive position + velocity manually)
    const pusher = Matter.Bodies.circle(-2000, -2000, PUSHER_R, {
      isStatic: true,
      label: "pusher",
      restitution: 0.8,
      friction: 0,
      frictionStatic: 0,
    });
    pusherRef.current = pusher;

    Matter.World.add(engine.world, [leftWall, rightWall, pusher]);

    // Drive pusher kinematically each tick
    Matter.Events.on(engine, "beforeUpdate", () => {
      const p = pusherRef.current;
      if (!p) return;
      const cur = curMouseRef.current;
      const prev = prevMouseRef.current;

      Matter.Body.setPosition(p, { x: cur.x, y: cur.y });

      const pp = (p as unknown as { positionPrev: Matter.Vector }).positionPrev;
      pp.x = prev.x;
      pp.y = prev.y;

      prevMouseRef.current = { ...cur };
    });

    Matter.Runner.run(runner, engine);

    const canvas = canvasRef.current!;
    canvas.width = w;
    canvas.height = h;

    function tick() {
      if (document.hidden) { rafRef.current = requestAnimationFrame(tick); return; }
      const ctx = canvas.getContext("2d");
      if (!ctx || !engineRef.current || !imagesRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bodies = Matter.Composite.allBodies(engineRef.current.world).filter(b => !b.isStatic);
      const fadeZone = canvas.height * FADE_START;
      const fadeRange = canvas.height * (1 - FADE_START) + PIECE_SIZE;

      for (const body of bodies) {
        const role = bodyRolesRef.current.get(body.id);
        if (!role) continue;

        // Cull once fully past the bottom edge
        if (body.position.y > canvas.height + PIECE_SIZE) {
          bodyRolesRef.current.delete(body.id);
          bodyVariantRef.current.delete(body.id);
          Matter.Composite.remove(engineRef.current.world, body);
          bodyCountRef.current = Math.max(0, bodyCountRef.current - 1);
          continue;
        }

        const variant = bodyVariantRef.current.get(body.id) ?? 0;
        const img = imagesRef.current[role]?.[variant];
        if (!img) continue;

        const alpha = body.position.y < fadeZone
          ? 1
          : Math.max(0, 1 - (body.position.y - fadeZone) / fadeRange);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        ctx.drawImage(img, -PIECE_SIZE / 2, -PIECE_SIZE / 2, PIECE_SIZE, PIECE_SIZE);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    function handleResize() {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      canvas.width = nw;
      canvas.height = nh;
      if (!wallsRef.current) return;
      Matter.Body.setPosition(wallsRef.current.left, { x: -25, y: nh / 2 });
      Matter.Body.setPosition(wallsRef.current.right, { x: nw + 25, y: nh / 2 });
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      engineRef.current = null;
      bodyRolesRef.current = new Map();
      bodyVariantRef.current = new Map();
      bodyCountRef.current = 0;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  // Mouse tracking (reads through pointer-events:none canvas)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      prevMouseRef.current = { ...curMouseRef.current };
      curMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const leave = () => {
      curMouseRef.current = { x: -2000, y: -2000 };
      prevMouseRef.current = { x: -2000, y: -2000 };
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  // Confetti spawn
  useEffect(() => {
    function handleSpawn(e: Event) {
      const { role, x, y } = (e as CustomEvent<{ role: ConfettiRole; x: number; y: number }>).detail;
      if (!engineRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const toAdd: Matter.Body[] = [];

      for (let i = 0; i < SPAWN_COUNT; i++) {
        const a = (Math.PI * 2 * i) / SPAWN_COUNT + (Math.random() - 0.5) * 1.1;
        const speed = 7 + Math.random() * 15;
        const variant = Math.floor(Math.random() * VARIANT_COUNT);

        const body = role === "engineer"
          ? Matter.Bodies.circle(
            x + (Math.random() - 0.5) * 80, y, PIECE_SIZE / 2,
            { restitution: 0.8, friction: 0.06, frictionAir: 0.010, angle: Math.random() * Math.PI * 2 }
          )
          : Matter.Bodies.rectangle(
            x + (Math.random() - 0.5) * 80, y, PIECE_SIZE, PIECE_SIZE,
            { restitution: 0.70, friction: 0.09, frictionAir: 0.011, angle: Math.random() * Math.PI * 2 }
          );

        Matter.Body.setVelocity(body, {
          x: Math.cos(a) * speed,
          y: -Math.abs(Math.sin(a)) * speed - 6 - Math.random() * 5,
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.7);

        bodyRolesRef.current.set(body.id, role);
        bodyVariantRef.current.set(body.id, variant);
        toAdd.push(body);
      }

      const existing = Matter.Composite.allBodies(engineRef.current.world).filter(b => !b.isStatic);
      const excess = existing.length + toAdd.length - MAX_BODIES;
      if (excess > 0) {
        existing.slice(0, excess).forEach(b => {
          bodyRolesRef.current.delete(b.id);
          bodyVariantRef.current.delete(b.id);
          Matter.Composite.remove(engineRef.current!.world, b);
        });
      }

      Matter.World.add(engineRef.current.world, toAdd);
      bodyCountRef.current = Math.min(existing.length - Math.max(0, excess) + toAdd.length, MAX_BODIES);
    }

    window.addEventListener("confetti:spawn", handleSpawn);
    return () => window.removeEventListener("confetti:spawn", handleSpawn);
  }, []);

  if (!isClient) return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9000]"
      aria-hidden="true"
    />,
    document.body
  );
}
