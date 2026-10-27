export type RGB = [number, number, number];

export interface IntroConfig {
  /** Text shown (and dissolved into petals). */
  text: string;
  /**
   * Milliseconds the intro stays on screen BEFORE the exit transition begins.
   * Timeline: 0 ─ fade-in ─ hold ─ petals peel off ─ duration ─ exit fade (fadeOutDuration) ─ gone.
   * So the intro is fully gone at `duration + animation.fadeOutDuration`.
   */
  duration: number;

  colors: {
    /** Full-screen backdrop (fades away on exit to reveal the site). */
    background: string;
    /** Main petal colour (crimson in the reference). */
    primary: string;
    /** Second petal colour (white in the reference). */
    secondary: string;
    /** Colour of the word before it dissolves. */
    text: string;
    /** Optional third petal colour (see animation.accentRatio) and the glow colour. */
    accent: string;
  };

  typography: {
    fontFamily: string; // "inherit" uses your site's font
    fontSize: string; // any CSS length, e.g. clamp(2.5rem, 8vw, 7rem)
    fontWeight: number | string;
    letterSpacing: string; // any CSS length, e.g. 0.12em
    /** Text centre as a fraction of the viewport (0–1). */
    position: { x: number; y: number };
  };

  animation: {
    fadeInDuration: number; // ms, word fades in
    fadeOutDuration: number; // ms, backdrop fades out revealing the site
    /** Overall strength: petal count, velocity and spread. 1 = reference look. */
    intensity: number;
    /** Playback rate of petal motion only (timeline durations are unaffected). */
    speed: number;
    /** When petals begin peeling off, as a fraction of `duration` (0–0.9). */
    dissolveAt: number;
    /** Upper bound on petal count (performance guard). */
    maxPetals: number;
    /** Petal length relative to the font size. */
    petalSize: number;
    /** Share of petals using colors.primary (rest use secondary). 0–1 */
    primaryRatio: number;
    /** Share of petals using colors.accent. 0 = reference look. 0–1 */
    accentRatio: number;
    /** Horizontal/vertical scatter multiplier. */
    spread: number;
    /** Wind direction in degrees. 0 = to the right, -90 = up. */
    windAngle: number;
    /** Soft accent-coloured glow behind the word. 0 = none (reference). 0–1 */
    glow: number;
  };

  behavior: {
    /** 'always' every page load · 'session' once per tab session · 'once' once ever. */
    frequency: 'always' | 'session' | 'once';
    storageKey: string;
    /** Block page scrolling underneath while the intro is covering the screen. */
    lockScroll: boolean;
    /** With prefers-reduced-motion: text-only fade, shown this long (ms). */
    reducedMotionDuration: number;
    zIndex: number;
  };
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
