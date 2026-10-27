"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: number;
};

const LINK = 135; // px, max distance for a link between two nodes
const MOUSE_R = 190; // px, cursor influence radius

/**
 * Decorative "data constellation" canvas for the hero.
 * Nodes drift, link up when close, and are drawn toward the cursor.
 * Pauses off-screen / hidden tab, static for reduced-motion.
 */
export default function DataField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let running = false;
    let inView = true;
    const mouse = { x: -9999, y: -9999 };
    let colors = ["#22d3ee", "#8b5cf6", "#f472b6"];

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      const c = ["--accent-2", "--accent", "--accent-3"]
        .map((n) => s.getPropertyValue(n).trim())
        .filter(Boolean);
      if (c.length === 3) colors = c;
    };

    const init = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(120, Math.max(30, (w * h) / 13000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 0.9 + Math.random() * 1.7,
        c: Math.floor(Math.random() * 3),
      }));
      readColors();
    };

    const frame = (animate: boolean) => {
      const dark = document.documentElement.classList.contains("dark");
      const nodeA = dark ? 0.9 : 0.65;
      const lineA = dark ? 0.42 : 0.3;

      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (animate) {
          // gentle pull toward the cursor
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_R && d > 1) {
            const f = (1 - d / MOUSE_R) * 0.035;
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
          }
          n.vx *= 0.985;
          n.vy *= 0.985;
          // keep a minimum drift so the field never freezes
          if (Math.abs(n.vx) + Math.abs(n.vy) < 0.08) {
            n.vx += (Math.random() - 0.5) * 0.04;
            n.vy += (Math.random() - 0.5) * 0.04;
          }
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -10) n.x = w + 10;
          else if (n.x > w + 10) n.x = -10;
          if (n.y < -10) n.y = h + 10;
          else if (n.y > h + 10) n.y = -10;
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * lineA;
            ctx.strokeStyle = colors[a.c];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // link to cursor
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < MOUSE_R) {
          ctx.globalAlpha = (1 - md / MOUSE_R) * (lineA + 0.25);
          ctx.strokeStyle = colors[0];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = colors[n.c];
        ctx.globalAlpha = nodeA * 0.16;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = nodeA;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      frame(true);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    init();
    frame(false);
    start();

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(parent);

    const ro = new ResizeObserver(() => {
      init();
      if (reduce) frame(false);
    });
    ro.observe(parent);

    // refresh palette when the theme flips
    const mo = new MutationObserver(() => {
      readColors();
      if (reduce) frame(false);
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
