"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Matter from "matter-js";
import { useLenis } from "lenis/react";
import { Button } from "@/components/ui/button";

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

const PIECE_SIZE = 46;   // px — square canvas for each piece
const MAX_BODIES = 140;
const SPAWN_COUNT = 22;
const BASE_GRAVITY = 2.8;
const PUSHER_R = 30;   // mouse interaction circle radius

// 5 OKLCH variants per role: subtle shifts in lightness, chroma, and hue
// so a burst always has a small spread of shades rather than one flat colour.
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
  const wallsRef = useRef<{ ground: Matter.Body; left: Matter.Body; right: Matter.Body } | null>(null);
  const pusherRef = useRef<Matter.Body | null>(null);
  const rafRef = useRef<number>(0);
  const cleaningRef = useRef(false);
  const bodyCountRef = useRef(0);
  const curMouseRef = useRef({ x: -2000, y: -2000 });
  const prevMouseRef = useRef({ x: -2000, y: -2000 });
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [hasConfetti, setHasConfetti] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  // SSR guard — false on server, true on client, no extra render cycle
  const isClient = useSyncExternalStore(() => () => { }, () => true, () => false);

  // Physics engine + canvas render loop
  // `isClient` in deps: during Next.js hydration useSyncExternalStore returns the server
  // snapshot (false), so the first pass renders null — no canvas, canvasRef.current is null.
  // React re-renders synchronously with the client snapshot (true) AFTER passive effects fire,
  // so the [] effect misses the canvas. Listing isClient re-runs the effect once it flips true.
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

    const ground = Matter.Bodies.rectangle(w / 2, h + 25, w * 3, 50, {
      isStatic: true, friction: 0.5, restitution: 0.12, label: "ground",
    });
    const leftWall = Matter.Bodies.rectangle(-25, h / 2, 50, h * 2, { isStatic: true, label: "wall" });
    const rightWall = Matter.Bodies.rectangle(w + 25, h / 2, 50, h * 2, { isStatic: true, label: "wall" });
    wallsRef.current = { ground, left: leftWall, right: rightWall };

    // Kinematic mouse pusher (static, but we drive position + velocity manually)
    const pusher = Matter.Bodies.circle(-2000, -2000, PUSHER_R, {
      isStatic: true,
      label: "pusher",
      restitution: 0.8,
      friction: 0,
      frictionStatic: 0,
    });
    pusherRef.current = pusher;

    Matter.World.add(engine.world, [ground, leftWall, rightWall, pusher]);

    // Drive pusher kinematically each tick:
    // setPosition moves the body (updates vertices/bounds), then we manually
    // rewind positionPrev so Matter.js collision resolver sees real velocity.
    Matter.Events.on(engine, "beforeUpdate", () => {
      const p = pusherRef.current;
      if (!p) return;
      const cur = curMouseRef.current;
      const prev = prevMouseRef.current;

      Matter.Body.setPosition(p, { x: cur.x, y: cur.y });

      // positionPrev is internal — not in @types/matter-js but always present at runtime
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
      for (const body of bodies) {
        const role = bodyRolesRef.current.get(body.id);
        if (!role) continue;
        const variant = bodyVariantRef.current.get(body.id) ?? 0;
        const img = imagesRef.current[role]?.[variant];
        if (!img) continue;
        ctx.save();
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
      Matter.Body.setPosition(wallsRef.current.ground, { x: nw / 2, y: nh + 25 });
      Matter.Body.setPosition(wallsRef.current.left, { x: -25, y: nh / 2 });
      Matter.Body.setPosition(wallsRef.current.right, { x: nw + 25, y: nh / 2 });
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(exitTimerRef.current);
      window.removeEventListener("resize", handleResize);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      engineRef.current = null; // null out so stale-engine guards work on re-init
      bodyRolesRef.current = new Map();
      bodyVariantRef.current = new Map();
      bodyCountRef.current = 0;
      cleaningRef.current = false; // reset if unmounted mid-cleanup so remount isn't permanently blocked
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
      if (!engineRef.current || cleaningRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Cancel any in-progress exit so re-spawning feels immediate
      clearTimeout(exitTimerRef.current);
      setIsExiting(false);

      const toAdd: Matter.Body[] = [];

      for (let i = 0; i < SPAWN_COUNT; i++) {
        const a = (Math.PI * 2 * i) / SPAWN_COUNT + (Math.random() - 0.5) * 1.1;
        const speed = 7 + Math.random() * 15;
        const variant = Math.floor(Math.random() * VARIANT_COUNT);

        // Cog → circle body so it rolls naturally
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
      setHasConfetti(true);
    }

    window.addEventListener("confetti:spawn", handleSpawn);
    return () => window.removeEventListener("confetti:spawn", handleSpawn);
  }, []);

  // Scroll impulse — strong enough to visibly jostle and spin the pile
  useLenis(({ velocity }) => {
    if (!engineRef.current || bodyCountRef.current === 0 || Math.abs(velocity) < 0.5) return;
    const bodies = Matter.Composite.allBodies(engineRef.current.world).filter(b => !b.isStatic);
    if (!bodies.length) return;

    const fy = -velocity * 0.00055;
    for (const body of bodies) {
      Matter.Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.00025,
        y: fy,
      });
      // Spin pieces on scroll
      Matter.Body.setAngularVelocity(
        body,
        body.angularVelocity + (Math.random() - 0.5) * 0.18
      );
    }
  });

  // Cleanup: yank gravity up, remove ground, let everything fall off screen,
  // and slide the canvas out so the exit feels deliberate rather than abrupt.
  const handleCleanup = useCallback(() => {
    if (!engineRef.current || !wallsRef.current || cleaningRef.current) return;
    cleaningRef.current = true;
    setHasConfetti(false);
    setIsExiting(true);

    Matter.Composite.remove(engineRef.current.world, wallsRef.current.ground);
    engineRef.current.gravity.y = 22;

    exitTimerRef.current = setTimeout(() => {
      if (!engineRef.current) return;
      const bodies = Matter.Composite.allBodies(engineRef.current.world).filter(b => !b.isStatic);
      bodies.forEach(b => {
        bodyRolesRef.current.delete(b.id);
        bodyVariantRef.current.delete(b.id);
        Matter.Composite.remove(engineRef.current!.world, b);
      });

      engineRef.current.gravity.y = BASE_GRAVITY;

      if (wallsRef.current) {
        const nw = window.innerWidth;
        const nh = window.innerHeight;
        const newGround = Matter.Bodies.rectangle(nw / 2, nh + 25, nw * 3, 50, {
          isStatic: true, friction: 0.5, restitution: 0.12, label: "ground",
        });
        wallsRef.current.ground = newGround;
        Matter.World.add(engineRef.current.world, newGround);
      }

      bodyCountRef.current = 0;
      cleaningRef.current = false;
    }, 700);
  }, []);

  if (!isClient) return null;

  return createPortal(
    <>
      <canvas
        ref={canvasRef}
        style={{
          transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)",
          opacity: isExiting ? 0 : undefined,
          transform: isExiting ? "translateY(1rem)" : undefined,
        }}
        className="pointer-events-none fixed inset-0 z-[9000]"
        aria-hidden="true"
      />
      {hasConfetti && (
        <Button
          variant="default"
          size="lg"
          onClick={handleCleanup}
          className="animate-in fade-in slide-in-from-bottom-4 duration-300 fixed bottom-0 left-1/2 -translate-x-1/2 z-[9001] rounded-b-none shadow-[0_-2px_12px_oklch(0_0_0/0.08)]"
        >
          Clean It Up!
        </Button>
      )}
    </>,
    document.body
  );
}
