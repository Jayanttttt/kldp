"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative layers + tiny global behaviours (no text content):
 *  - aurora blobs / grid / grain behind the whole page
 *  - scroll progress bar
 *  - cursor spotlight + 3D tilt for any element with [data-glow] / [data-tilt]
 */
export default function Ambient() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;

    /* ---------- scroll progress ---------- */
    let scrollRaf = 0;
    const updateProgress = () => {
      scrollRaf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar?.style.setProperty("--p", String(p));
    };
    const onScroll = () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(updateProgress);
    };

    /* ---------- spotlight + tilt ---------- */
    let moveRaf = 0;
    let pending: PointerEvent | null = null;

    const applyMove = () => {
      moveRaf = 0;
      const e = pending;
      if (!e) return;
      const el = (e.target as Element | null)?.closest?.(
        "[data-glow]",
      ) as HTMLElement | null;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);

      if (el.hasAttribute("data-tilt")) {
        const px = x / r.width - 0.5;
        const py = y / r.height - 0.5;
        el.style.setProperty("--ry", `${(px * 7).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-py * 7).toFixed(2)}deg`);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pending = e;
      if (!moveRaf) moveRaf = requestAnimationFrame(applyMove);
    };

    const onOut = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(
        "[data-tilt]",
      ) as HTMLElement | null;
      if (el && !el.contains(e.relatedTarget as Node | null)) {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      }
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });

    return () => {
      cancelAnimationFrame(scrollRaf);
      cancelAnimationFrame(moveRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <>
      <div className="stage" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid" />
        <div className="noise" />
      </div>
      <div ref={barRef} className="progress" aria-hidden="true" />
    </>
  );
}
