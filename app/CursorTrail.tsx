"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 *  1. PALETTE — replace these with your portfolio's real colors.
 *     Order matters: the trail cycles through them from head to tail.
 *
 *     Optional: if your CSS already defines variables (e.g. in :root or
 *     .dark), list their names in CSS_VARS and the component will read
 *     them at runtime. Anything it can't find falls back to FALLBACK.
 * ------------------------------------------------------------------ */
const CSS_VARS: string[] = ["--accent", "--accent-2", "--accent-3"];

const FALLBACK: string[] = [
  "#34d399", // primary accent
  "#22d3ee", // secondary accent
  "#a78bfa", // tertiary accent
];

/* ------------------------------------------------------------------ *
 *  2. TUNING
 * ------------------------------------------------------------------ */
const CONFIG = {
  maxParticles: 90, // hard cap, keeps it cheap
  spawnPerMove: 2, // particles added per mouse event
  lifeMs: 650, // how long a particle lives
  minSize: 3,
  maxSize: 9,
  drift: 0.35, // how far particles wander (px per frame)
  glow: 14, // blur radius for the glow
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  born: number;
  color: string;
};

/* ------------------------------------------------------------------ *
 *  helpers
 * ------------------------------------------------------------------ */
function readPalette(): string[] {
  const styles = getComputedStyle(document.documentElement);
  const found = CSS_VARS.map((name) =>
    styles.getPropertyValue(name).trim(),
  ).filter(Boolean);
  return found.length ? found : FALLBACK;
}

function isDarkMode(): boolean {
  const root = document.documentElement;
  if (root.classList.contains("dark")) return true;
  if (root.classList.contains("light")) return false;
  const attr = root.getAttribute("data-theme");
  if (attr) return attr === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function hexToRgba(color: string, alpha: number): string {
  // Accepts #rgb, #rrggbb. Anything else (hsl(), rgb()) is returned with globalAlpha handling.
  const m = color.replace("#", "");
  if (/^[0-9a-f]{3}$/i.test(m)) {
    const [r, g, b] = m.split("").map((c) => parseInt(c + c, 16));
    return `rgba(${r},${g},${b},${alpha})`;
  }
  if (/^[0-9a-f]{6}$/i.test(m)) {
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
}

/* ------------------------------------------------------------------ *
 *  component
 * ------------------------------------------------------------------ */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Skip on touch devices and for people who prefer reduced motion.
    const noHover = window.matchMedia("(hover: none)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (noHover || reduceMotion) return;

    let palette = readPalette();
    let dark = isDarkMode();
    let particles: Particle[] = [];
    let rafId = 0;
    let colorIndex = 0;
    let lastX = -1;
    let lastY = -1;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number) => {
      for (let i = 0; i < CONFIG.spawnPerMove; i++) {
        if (particles.length >= CONFIG.maxParticles) particles.shift();
        const color = palette[colorIndex % palette.length];
        colorIndex++;
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * CONFIG.drift * 2,
          vy: (Math.random() - 0.5) * CONFIG.drift * 2,
          size:
            CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize),
          born: performance.now(),
          color,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!dark) return;
      // Fill the gap on fast moves so the trail stays continuous.
      if (lastX >= 0) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const steps = Math.min(Math.floor(Math.hypot(dx, dy) / 14), 6);
        for (let s = 1; s <= steps; s++) {
          spawn(lastX + (dx * s) / (steps + 1), lastY + (dy * s) / (steps + 1));
        }
      }
      spawn(e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onLeave = () => {
      lastX = -1;
      lastY = -1;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      if (dark) {
        ctx.globalCompositeOperation = "lighter"; // colors add up → neon glow on dark bg
        particles = particles.filter((p) => now - p.born < CONFIG.lifeMs);

        for (const p of particles) {
          const t = (now - p.born) / CONFIG.lifeMs; // 0 → 1
          const ease = 1 - t * t; // fades slowly, then drops
          p.x += p.vx;
          p.y += p.vy;

          ctx.shadowBlur = CONFIG.glow;
          ctx.shadowColor = hexToRgba(p.color, ease * 0.9);
          ctx.fillStyle = hexToRgba(p.color, ease * 0.75);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(p.size * ease, 0.1), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = "source-over";
      } else {
        particles = [];
      }

      rafId = requestAnimationFrame(draw);
    };

    // Re-check theme + palette when the theme toggles (class / data-theme change).
    const observer = new MutationObserver(() => {
      dark = isDarkMode();
      palette = readPalette();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSchemeChange = () => {
      dark = isDarkMode();
      palette = readPalette();
    };
    mq.addEventListener("change", onSchemeChange);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      mq.removeEventListener("change", onSchemeChange);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
