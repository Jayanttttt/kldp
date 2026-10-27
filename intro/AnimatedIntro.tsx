"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PetalEngine } from "./petalEngine";
import { resolveConfig } from "./resolveConfig";
import type { DeepPartial, IntroConfig } from "./types";
import "./intro.css";

const emptySubscribe = () => () => {};

export interface AnimatedIntroProps {
  /** Partial config; anything omitted uses the reference-matched defaults. Read once on mount. */
  config?: DeepPartial<IntroConfig>;
  /** Called once when the intro has finished and been removed from the DOM. */
  onComplete?: () => void;
}

function alreadyPlayed(cfg: IntroConfig): boolean {
  if (typeof window === "undefined") return false;
  const { frequency, storageKey } = cfg.behavior;
  if (frequency === "always") return false;
  try {
    const store =
      frequency === "once" ? window.localStorage : window.sessionStorage;
    return store.getItem(storageKey) === "1";
  } catch {
    return false; // storage blocked: just play
  }
}
function markPlayed(cfg: IntroConfig) {
  if (typeof window === "undefined") return;
  const { frequency, storageKey } = cfg.behavior;
  if (frequency === "always") return;
  try {
    (frequency === "once"
      ? window.localStorage
      : window.sessionStorage
    ).setItem(storageKey, "1");
  } catch {
    /* ignore */
  }
}

/**
 * Full-screen petal-dissolve intro. Mount once near the root, as a SIBLING of your app:
 *   <AnimatedIntro config={introConfig} />
 * It overlays the page, plays automatically, fades out, then renders nothing (no leftover overlay).
 */
export default function AnimatedIntro({
  config,
  onComplete,
}: AnimatedIntroProps) {
  // Config is resolved once on mount; subsequent renders keep the same config.
  const [cfg] = useState(() => resolveConfig(config));
  const [done, setDone] = useState(false);

  const isAlreadyPlayed = useSyncExternalStore(
    emptySubscribe,
    () => alreadyPlayed(cfg),
    () => false,
  );

  const active = !done && !isAlreadyPlayed;

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const bg = bgRef.current;
    const probe = probeRef.current;
    if (!root || !canvas || !bg || !probe) return;

    let cancelled = false;
    let engine: PetalEngine | null = null;
    let timeout = 0;
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    // Wait (briefly) for the bundled font so the first frame already uses it; never block longer than 1.2 s.
    const cs = getComputedStyle(probe);
    const fontLoad = document.fonts
      ? document.fonts
          .load(`${cs.fontWeight} 64px ${cs.fontFamily}`, cfg.text)
          .catch(() => undefined)
      : Promise.resolve();
    const timer = new Promise<void>((res) => {
      timeout = window.setTimeout(res, 1200);
    });

    Promise.race([fontLoad, timer]).then(() => {
      window.clearTimeout(timeout);
      if (cancelled) return;
      engine = new PetalEngine(root, canvas, bg, probe, cfg, reduced, {
        onExitStart: () => {
          root.style.pointerEvents = "none"; // site is interactive from the moment the fade-out begins
        },
        onDone: () => {
          markPlayed(cfg);
          setDone(true);
          onCompleteRef.current?.();
        },
      });
      engine.start();
    });

    return () => {
      // Runs on unmount AND between React Strict Mode's double-invoke: stops rAF, timers, listeners.
      cancelled = true;
      window.clearTimeout(timeout);
      engine?.destroy();
    };
  }, [active, cfg]);

  if (!active) return null;

  const t = cfg.typography;
  return (
    <div
      ref={rootRef}
      className="ai-root"
      style={{ zIndex: cfg.behavior.zIndex, pointerEvents: "auto" }}
      role="status"
      aria-live="polite"
    >
      <span className="ai-sr">{cfg.text}</span>
      <div
        ref={bgRef}
        className="ai-bg"
        style={{ background: cfg.colors.background }}
      />
      <canvas ref={canvasRef} className="ai-canvas" aria-hidden="true" />
      <div
        ref={probeRef}
        className="ai-probe"
        aria-hidden="true"
        style={{
          fontFamily: t.fontFamily,
          fontSize: t.fontSize,
          fontWeight: t.fontWeight,
          letterSpacing: t.letterSpacing,
        }}
      >
        {cfg.text}
      </div>
    </div>
  );
}
