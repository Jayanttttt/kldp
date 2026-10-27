"use client";

import { useEffect, useRef, useState } from "react";

const RADIUS = 24;
const CIRC = 2 * Math.PI * RADIUS;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      barRef.current?.setAttribute("stroke-dashoffset", String(CIRC * (1 - p)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="to-top"
      data-visible={visible}
    >
      <svg viewBox="0 0 54 54" aria-hidden="true">
        <circle className="ring-track" cx="27" cy="27" r={RADIUS} />
        <circle
          ref={barRef}
          className="ring-bar"
          cx="27"
          cy="27"
          r={RADIUS}
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC}
        />
      </svg>
      ↑
    </button>
  );
}
