import type { DeepPartial, IntroConfig, RGB } from './types';

/** Reference-matched defaults. */
export const DEFAULT_INTRO_CONFIG: IntroConfig = {
  text: 'KULDEEP',
  duration: 3000,
  colors: {
    background: '#030304',
    primary: '#b3123c',
    secondary: '#ececec',
    text: '#c9c7be',
    accent: '#e0a458',
  },
  typography: {
    fontFamily: "'AnimatedIntro Cinzel', Cinzel, 'Trajan Pro', 'Times New Roman', serif",
    fontSize: 'clamp(2.5rem, 8vw, 7rem)',
    fontWeight: 500,
    letterSpacing: '0.12em',
    position: { x: 0.5, y: 0.5 },
  },
  animation: {
    fadeInDuration: 400,
    fadeOutDuration: 500,
    intensity: 1,
    speed: 1,
    dissolveAt: 0.4,
    maxPetals: 8000,
    petalSize: 0.17,
    primaryRatio: 0.6,
    accentRatio: 0,
    spread: 1,
    windAngle: -8,
    glow: 0,
  },
  behavior: {
    frequency: 'always',
    storageKey: 'animated-intro-played',
    lockScroll: true,
    reducedMotionDuration: 700,
    zIndex: 10000,
  },
};

let probe: CanvasRenderingContext2D | null = null;

/** Parse any CSS colour (hex, rgb, hsl, named…) to RGB. Returns null if invalid. */
export function parseColor(input: string): RGB | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim().toLowerCase();

  // 1. Hex parsing (#rgb, #rgba, #rrggbb, #rrggbbaa)
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (/^[0-9a-f]{3}$/.test(hex)) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    if (/^[0-9a-f]{4}$/.test(hex)) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    if (/^[0-9a-f]{6}$/.test(hex) || /^[0-9a-f]{8}$/.test(hex)) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
    return null;
  }

  // 2. rgb / rgba parsing
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return [
      Math.min(255, parseInt(rgbMatch[1], 10)),
      Math.min(255, parseInt(rgbMatch[2], 10)),
      Math.min(255, parseInt(rgbMatch[3], 10)),
    ];
  }

  // 3. Fallback to canvas probe in browser environment (named colours, hsl, etc.)
  if (typeof document !== 'undefined') {
    if (!probe) probe = document.createElement('canvas').getContext('2d');
    if (!probe) return null;
    probe.fillStyle = '#000';
    probe.fillStyle = trimmed;
    const a = String(probe.fillStyle);
    probe.fillStyle = '#fff';
    probe.fillStyle = trimmed;
    if (a !== String(probe.fillStyle)) return null; // browser rejected it both times -> invalid
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = trimmed;
    probe.fillRect(0, 0, 1, 1);
    const d = probe.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  }

  return null;
}

const warn = (msg: string) => {
  if (typeof console !== 'undefined') console.warn(`[AnimatedIntro] ${msg}`);
};
const num = (name: string, v: unknown, def: number, min: number, max: number) => {
  if (v === undefined) return def;
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    warn(`"${name}" must be a number; using ${def}.`);
    return def;
  }
  if (v < min || v > max) warn(`"${name}" clamped to ${min}–${max}.`);
  return Math.min(max, Math.max(min, v));
};
const str = (name: string, v: unknown, def: string) => {
  if (v === undefined) return def;
  if (typeof v !== 'string' || !v.trim()) {
    warn(`"${name}" must be a non-empty string; using default.`);
    return def;
  }
  return v;
};
const color = (name: string, v: unknown, def: string) => {
  if (v === undefined) return def;
  if (typeof v === 'string' && parseColor(v)) return v;
  warn(`"${name}" is not a valid CSS colour; using ${def}.`);
  return def;
};

/** Merge user config over defaults and validate every value. Safe to call with partial or no config. */
export function resolveConfig(user: DeepPartial<IntroConfig> = {}): IntroConfig {
  const d = DEFAULT_INTRO_CONFIG;
  const c = user.colors ?? {};
  const t = user.typography ?? {};
  const a = user.animation ?? {};
  const b = user.behavior ?? {};
  const pos = t.position ?? {};
  const freq = b.frequency;
  return {
    text: str('text', user.text, d.text),
    duration: num('duration', user.duration, d.duration, 0, 60000),
    colors: {
      background: color('colors.background', c.background, d.colors.background),
      primary: color('colors.primary', c.primary, d.colors.primary),
      secondary: color('colors.secondary', c.secondary, d.colors.secondary),
      text: color('colors.text', c.text, d.colors.text),
      accent: color('colors.accent', c.accent, d.colors.accent),
    },
    typography: {
      fontFamily: str('typography.fontFamily', t.fontFamily, d.typography.fontFamily),
      fontSize: str('typography.fontSize', t.fontSize, d.typography.fontSize),
      fontWeight:
        typeof t.fontWeight === 'number' || typeof t.fontWeight === 'string' ? t.fontWeight : d.typography.fontWeight,
      letterSpacing: str('typography.letterSpacing', t.letterSpacing, d.typography.letterSpacing),
      position: {
        x: num('typography.position.x', pos.x, d.typography.position.x, 0, 1),
        y: num('typography.position.y', pos.y, d.typography.position.y, 0, 1),
      },
    },
    animation: {
      fadeInDuration: num('animation.fadeInDuration', a.fadeInDuration, d.animation.fadeInDuration, 0, 10000),
      fadeOutDuration: num('animation.fadeOutDuration', a.fadeOutDuration, d.animation.fadeOutDuration, 0, 10000),
      intensity: num('animation.intensity', a.intensity, d.animation.intensity, 0.1, 3),
      speed: num('animation.speed', a.speed, d.animation.speed, 0.2, 3),
      dissolveAt: num('animation.dissolveAt', a.dissolveAt, d.animation.dissolveAt, 0, 0.9),
      maxPetals: Math.round(num('animation.maxPetals', a.maxPetals, d.animation.maxPetals, 20, 1200)),
      petalSize: num('animation.petalSize', a.petalSize, d.animation.petalSize, 0.05, 0.6),
      primaryRatio: num('animation.primaryRatio', a.primaryRatio, d.animation.primaryRatio, 0, 1),
      accentRatio: num('animation.accentRatio', a.accentRatio, d.animation.accentRatio, 0, 1),
      spread: num('animation.spread', a.spread, d.animation.spread, 0.2, 3),
      windAngle: num('animation.windAngle', a.windAngle, d.animation.windAngle, -360, 360),
      glow: num('animation.glow', a.glow, d.animation.glow, 0, 1),
    },
    behavior: {
      frequency: freq === 'session' || freq === 'once' || freq === 'always' ? freq : d.behavior.frequency,
      storageKey: str('behavior.storageKey', b.storageKey, d.behavior.storageKey),
      lockScroll: typeof b.lockScroll === 'boolean' ? b.lockScroll : d.behavior.lockScroll,
      reducedMotionDuration: num(
        'behavior.reducedMotionDuration', b.reducedMotionDuration, d.behavior.reducedMotionDuration, 0, 10000,
      ),
      zIndex: Math.round(num('behavior.zIndex', b.zIndex, d.behavior.zIndex, 0, 2147483647)),
    },
  };
}
