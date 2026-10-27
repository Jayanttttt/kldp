import { parseColor } from './resolveConfig';
import type { IntroConfig, RGB } from './types';

const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
const easeInOut = (x: number) => {
  const t = clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Petal {
  ox: number; // origin (css px) = the bit of letter it peels from
  oy: number;
  launch: number; // ms since start
  erase: number; // radius erased from the word when it launches
  vx: number; // initial velocity (px/s)
  vy: number;
  drag: number; // 1/s
  windK: number; // how strongly the wind carries it
  fl: number; // flutter frequency
  flAmp: number;
  flPh: number;
  rot0: number;
  omega: number;
  flip0: number;
  flipW: number;
  len: number;
  kind: 0 | 1 | 2;
}

export interface EngineHooks {
  onExitStart(): void;
  onDone(): void;
}
export interface EngineEnv {
  raf?: (cb: (t: number) => void) => number;
  caf?: (id: number) => void;
  createCanvas?: () => HTMLCanvasElement;
  size?: () => { w: number; h: number; dpr: number };
}

/**
 * The whole animation is a pure function of elapsed time `t` (update(t)); the rAF loop only advances t.
 * Petals have no integrated state: position = f(age), so resizes/frame drops can never desync them.
 */
export class PetalEngine {
  private ctx: CanvasRenderingContext2D;
  private layer!: HTMLCanvasElement; // the word, progressively erased as petals launch
  private lctx!: CanvasRenderingContext2D;
  private raf = 0;
  private t = 0;
  private lastNow = -1;
  private destroyed = false;
  private exited = false;
  private petals: Petal[] = [];
  private eraseIdx = 0;
  private needsText = true;
  private clearedAll = false;
  private resizeTimer = 0;

  // layout
  private W = 0;
  private H = 0;
  private dpr = 1;
  private fs = 64;
  private cx = 0;
  private cy = 0;
  private bbox = { x: 0, y: 0, w: 0, h: 0 };
  private chars: { ch: string; x: number }[] = [];
  private baseline = 0;

  // resolved colours / timeline
  private rgb: Record<'primary' | 'secondary' | 'text' | 'accent', RGB>;
  private shades: string[][] = [];
  private duration: number;
  private fadeIn: number;
  private fadeOut: number;
  private dissolveStart: number;
  private launchEnd = 0;
  private wind = { x: 1, y: 0 };

  constructor(
    private root: HTMLElement,
    private canvas: HTMLCanvasElement,
    private bg: HTMLElement,
    private probe: HTMLElement,
    private cfg: IntroConfig,
    private reduced: boolean,
    private hooks: EngineHooks,
    private env: EngineEnv = {},
  ) {
    this.ctx = canvas.getContext('2d')!;
    const col = (v: string, d: RGB): RGB => parseColor(v) ?? d;
    this.rgb = {
      primary: col(cfg.colors.primary, [179, 18, 60]),
      secondary: col(cfg.colors.secondary, [236, 236, 236]),
      text: col(cfg.colors.text, [201, 199, 190]),
      accent: col(cfg.colors.accent, [224, 164, 88]),
    };
    // petals darken as they turn edge-on (white ones go grey, like the reference)
    const kinds: RGB[] = [this.rgb.primary, this.rgb.secondary, this.rgb.accent];
    this.shades = kinds.map((c) =>
      Array.from({ length: 8 }, (_, i) => {
        const k = 1 - (1 - i / 7) * 0.55;
        return `rgb(${Math.round(c[0] * k)},${Math.round(c[1] * k)},${Math.round(c[2] * k)})`;
      }),
    );
    const a = cfg.animation;
    this.duration = reduced ? cfg.behavior.reducedMotionDuration : cfg.duration;
    this.fadeIn = reduced ? Math.min(a.fadeInDuration, 250) : a.fadeInDuration;
    this.fadeOut = reduced ? Math.min(a.fadeOutDuration, 300) : a.fadeOutDuration;
    this.dissolveStart = this.duration * a.dissolveAt;
    const ang = (a.windAngle * Math.PI) / 180;
    this.wind = { x: Math.cos(ang), y: Math.sin(ang) };
  }

  /* ------------------------------ lifecycle ------------------------------ */

  start() {
    this.build();
    if (this.cfg.behavior.lockScroll) {
      this.root.addEventListener('wheel', this.prevent, { passive: false });
      this.root.addEventListener('touchmove', this.prevent, { passive: false });
    }
    window.addEventListener('resize', this.onResize);
    this.update(0);
    this.raf = this.requestFrame(this.frame);
  }

  destroy() {
    this.destroyed = true;
    this.cancelFrame(this.raf);
    clearTimeout(this.resizeTimer);
    this.root.removeEventListener('wheel', this.prevent);
    this.root.removeEventListener('touchmove', this.prevent);
    window.removeEventListener('resize', this.onResize);
  }

  private requestFrame(cb: (t: number) => void) {
    return (this.env.raf ?? window.requestAnimationFrame.bind(window))(cb);
  }
  private cancelFrame(id: number) {
    (this.env.caf ?? window.cancelAnimationFrame.bind(window))(id);
  }
  private prevent = (e: Event) => e.preventDefault();

  private onResize = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => {
      if (this.destroyed) return;
      this.build();
      this.update(this.t);
    }, 100);
  };

  private frame = (now: number) => {
    if (this.destroyed) return;
    this.raf = this.requestFrame(this.frame);
    if (this.lastNow < 0) this.lastNow = now;
    let dt = now - this.lastNow;
    this.lastNow = now;
    if (dt > 250) dt = 16.7; // tab was hidden / main thread stalled: pause instead of skipping the animation
    this.t += dt;
    this.update(this.t);
  };

  /* ------------------------------- layout -------------------------------- */

  private measure() {
    const rect = this.env.size?.() ?? {
      w: this.root.clientWidth || window.innerWidth,
      h: this.root.clientHeight || window.innerHeight,
      dpr: Math.min(window.devicePixelRatio || 1, 3),
    };
    return rect;
  }

  private build() {
    const { w, h, dpr } = this.measure();
    this.W = w;
    this.H = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);

    const cs = getComputedStyle(this.probe);
    let fs = parseFloat(cs.fontSize) || 64;
    const family = cs.fontFamily || 'serif';
    const weight = cs.fontWeight || '500';
    const ls = parseFloat(cs.letterSpacing) || 0;
    const text = this.cfg.text;
    const glyphs = Array.from(text);

    const mk = (): HTMLCanvasElement => this.env.createCanvas?.() ?? document.createElement('canvas');
    const tmp = mk();
    tmp.width = tmp.height = 4;
    const mctx = tmp.getContext('2d')!;
    const widths = (px: number) => {
      mctx.font = `${weight} ${px}px ${family}`;
      return glyphs.map((g) => mctx.measureText(g).width);
    };
    let ws = widths(fs);
    let total = ws.reduce((a, b) => a + b, 0) + ls * (glyphs.length - 1);
    const maxW = w * 0.9;
    if (total > maxW) {
      const k = maxW / total; // auto-fit long phrases on narrow screens
      fs *= k;
      ws = widths(fs);
      total = ws.reduce((a, b) => a + b, 0) + ls * k * (glyphs.length - 1);
      this.fontOverride = { fs, ls: ls * k };
    } else this.fontOverride = { fs, ls };
    this.fs = fs;
    const spacing = this.fontOverride.ls;
    mctx.font = `${weight} ${fs}px ${family}`;
    const capH = mctx.measureText('H').actualBoundingBoxAscent || fs * 0.7;

    this.cx = w * this.cfg.typography.position.x;
    this.cy = h * this.cfg.typography.position.y;
    this.baseline = this.cy + capH / 2;
    let x = this.cx - total / 2;
    this.chars = glyphs.map((ch, i) => {
      const item = { ch, x };
      x += ws[i] + spacing;
      return item;
    });
    const padX = fs * 0.3;
    this.bbox = {
      x: Math.max(0, this.cx - total / 2 - padX),
      y: Math.max(0, this.baseline - fs * 1.05),
      w: Math.min(w, total + padX * 2),
      h: Math.min(h, fs * 1.5),
    };
    this.fontStr = `${weight} ${fs}px ${family}`;

    // word layer (visible) + sampling canvas (CPU readback)
    this.layer = mk();
    this.layer.width = this.canvas.width;
    this.layer.height = this.canvas.height;
    this.lctx = this.layer.getContext('2d')!;
    this.drawWord(this.lctx, '#fff');
    this.petals = this.reduced ? [] : this.samplePetals(mk, w, h, dpr);
    this.launchEnd = this.petals.length ? this.petals[this.petals.length - 1].launch : 0;
    this.eraseIdx = 0;
    this.needsText = true;
    this.clearedAll = false;
  }

  private fontOverride = { fs: 64, ls: 0 };
  private fontStr = '';

  private drawWord(ctx: CanvasRenderingContext2D, fill: string) {
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.W, this.H);
    ctx.font = this.fontStr;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = fill;
    for (const c of this.chars) ctx.fillText(c.ch, c.x, this.baseline);
  }

  /** Turn the word's pixels into petals: one per grid cell, placed at the cell's ink centroid. */
  private samplePetals(mk: () => HTMLCanvasElement, w: number, h: number, dpr: number): Petal[] {
    const a = this.cfg.animation;
    const rand = mulberry32(1337 + this.cfg.text.length * 17);
    const sc = mk();
    sc.width = Math.round(this.bbox.w * dpr);
    sc.height = Math.round(this.bbox.h * dpr);
    const sctx = sc.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    sctx.setTransform(dpr, 0, 0, dpr, -this.bbox.x * dpr, -this.bbox.y * dpr);
    sctx.font = this.fontStr;
    sctx.textBaseline = 'alphabetic';
    sctx.fillStyle = '#fff';
    for (const c of this.chars) sctx.fillText(c.ch, c.x, this.baseline);
    const img = sctx.getImageData(0, 0, sc.width, sc.height).data;

    const target = Math.max(20, Math.round(a.maxPetals * Math.min(1.5, a.intensity)));
    let cell = this.fs * 0.075; // css px
    let cells: { x: number; y: number }[] = [];
    for (let attempt = 0; attempt < 5; attempt++) {
      const cd = Math.max(1, cell * dpr);
      const gw = Math.ceil(sc.width / cd);
      const gh = Math.ceil(sc.height / cd);
      const sa = new Float32Array(gw * gh);
      const sx = new Float32Array(gw * gh);
      const sy = new Float32Array(gw * gh);
      for (let y = 0; y < sc.height; y++) {
        const gy = Math.floor(y / cd);
        for (let x = 0; x < sc.width; x++) {
          const al = img[(y * sc.width + x) * 4 + 3];
          if (al < 24) continue;
          const gi = gy * gw + Math.floor(x / cd);
          sa[gi] += al;
          sx[gi] += x * al;
          sy[gi] += y * al;
        }
      }
      cells = [];
      for (let i = 0; i < sa.length; i++) {
        if (sa[i] > 0) cells.push({ x: sx[i] / sa[i] / dpr + this.bbox.x, y: sy[i] / sa[i] / dpr + this.bbox.y });
      }
      if (cells.length <= target) break;
      cell *= Math.sqrt(cells.length / target) * 1.02;
    }

    const fs = this.fs;
    const span = Math.max(1, (this.duration - this.dissolveStart) * 0.6); // launch window
    const x0 = this.cx - (this.bbox.w - fs * 0.6) / 2;
    const xw = Math.max(1, this.bbox.w - fs * 0.6);
    const g = () => (rand() + rand() + rand() - 1.5) / 1.5; // ~gaussian in [-1,1]
    const speedK = a.intensity;
    const petals: Petal[] = cells.map((c) => {
      const u = clamp((c.x - x0) / xw, 0, 1);
      const noise =
        0.5 + 0.25 * Math.sin(c.x * 0.021 + 1.3) + 0.25 * Math.sin(c.y * 0.05 + c.x * 0.013 + 2.1);
      const lt = clamp(0.45 * noise + 0.35 * u + 0.2 * rand(), 0, 1);
      const r = rand();
      const kind: 0 | 1 | 2 =
        r < a.accentRatio ? 2 : rand() < a.primaryRatio ? 0 : 1;
      const len = fs * a.petalSize * (0.7 + rand() * 0.6);
      return {
        ox: c.x,
        oy: c.y,
        launch: this.dissolveStart + lt * span,
        erase: cell * 0.82,
        vx: g() * fs * 3.1 * a.spread * speedK,
        vy: (g() * 1.1 - 0.3) * fs * 1.5 * a.spread * speedK,
        drag: 1.3 + rand() * 0.9,
        windK: 0.25 + rand() * 0.55,
        fl: 3 + rand() * 4,
        flAmp: fs * (0.04 + rand() * 0.14),
        flPh: rand() * TAU,
        rot0: rand() * TAU,
        omega: (rand() < 0.5 ? -1 : 1) * (1.5 + rand() * 4.5),
        flip0: rand() * TAU,
        flipW: 3 + rand() * 6,
        len,
        kind,
      };
    });
    petals.sort((p, q) => p.launch - q.launch);
    void h;
    void w;
    return petals;
  }

  /* -------------------------------- render -------------------------------- */

  /** Draw the scene at `t` ms since start. Pure with respect to t. */
  update(t: number) {
    if (this.destroyed) return;
    const ctx = this.ctx;
    const { W, H, dpr } = this;
    const a = this.cfg.animation;
    const end = this.duration + this.fadeOut;

    if (!this.exited && t >= this.duration) {
      this.exited = true;
      this.root.removeEventListener('wheel', this.prevent);
      this.root.removeEventListener('touchmove', this.prevent);
      this.hooks.onExitStart();
    }
    const exitP = this.fadeOut > 0 ? clamp((t - this.duration) / this.fadeOut, 0, 1) : t >= this.duration ? 1 : 0;
    const bgOpacity = 1 - easeInOut(exitP);
    this.bg.style.opacity = String(bgOpacity);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // --- the word: fade in, then erased in patches as petals launch ---
    if (this.needsText) {
      this.drawWord(this.lctx, this.cssText());
      this.eraseIdx = 0;
      this.needsText = false;
    }
    const lctx = this.lctx;
    if (!this.reduced) {
      lctx.globalCompositeOperation = 'destination-out';
      lctx.fillStyle = '#000';
      while (this.eraseIdx < this.petals.length && this.petals[this.eraseIdx].launch <= t) {
        const p = this.petals[this.eraseIdx++];
        lctx.beginPath();
        lctx.arc(p.ox, p.oy, p.erase, 0, TAU);
        lctx.fill();
      }
      lctx.globalCompositeOperation = 'source-over';
      if (!this.clearedAll && this.petals.length && t >= this.launchEnd + 120) {
        lctx.clearRect(0, 0, W, H); // sweep up any slivers once the last petal is away
        this.clearedAll = true;
      }
    }
    const fadeP = this.fadeIn > 0 ? easeOut(t / this.fadeIn) : 1;
    const textAlpha = this.reduced ? fadeP * bgOpacity : fadeP;

    if (a.glow > 0) {
      const eroded = this.reduced ? 0 : clamp((t - this.dissolveStart) / Math.max(1, this.launchEnd - this.dissolveStart), 0, 1);
      const [r, g, b] = this.rgb.accent;
      const rad = Math.max(this.bbox.w, this.fs * 3) * 0.7;
      const gr = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, rad);
      const al = 0.28 * a.glow * fadeP * (1 - eroded) * (this.reduced ? bgOpacity : 1);
      gr.addColorStop(0, `rgba(${r},${g},${b},${al})`);
      gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gr;
      ctx.fillRect(this.cx - rad, this.cy - rad, rad * 2, rad * 2);
    }

    if (textAlpha > 0.001 && !this.clearedAll) {
      const s = 0.96 + 0.04 * fadeP;
      ctx.save();
      ctx.globalAlpha = textAlpha;
      ctx.translate(this.cx, this.cy);
      ctx.scale(s, s);
      ctx.translate(-this.cx, -this.cy);
      const b = this.bbox;
      ctx.drawImage(this.layer, b.x * dpr, b.y * dpr, b.w * dpr, b.h * dpr, b.x, b.y, b.w, b.h);
      ctx.restore();
    }

    // --- petals: position/rotation/flip are closed-form functions of age ---
    if (!this.reduced && this.petals.length) {
      const tail = clamp((end - t) / 350, 0, 1); // everything has vanished by the time the intro is removed
      const fs = this.fs;
      const windSpeed = fs * 1.1 * a.intensity;
      const g = fs * 0.35;
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        if (p.launch > t) break;
        const age = ((t - p.launch) / 1000) * a.speed;
        const e = 1 - Math.exp(-p.drag * age);
        const k = e / p.drag;
        const sway = Math.sin(age * p.fl + p.flPh) * p.flAmp * (1 - Math.exp(-age * 2.5));
        const x = p.ox + p.vx * k + this.wind.x * windSpeed * age * p.windK;
        const y = p.oy + p.vy * k + this.wind.y * windSpeed * age * p.windK + 0.5 * g * age * age + sway;
        const emerge = easeOut(age / 0.18);
        const alpha = emerge * tail;
        if (alpha <= 0.01) continue;
        const flip = Math.abs(Math.cos(p.flip0 + p.flipW * age));
        const sy = Math.max(0.14, flip);
        const th = p.rot0 + p.omega * age;
        const ca = Math.cos(th);
        const sa = Math.sin(th);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.shades[p.kind][Math.round(flip * 7)];
        ctx.setTransform(dpr * ca, dpr * sa, -dpr * sa * sy, dpr * ca * sy, dpr * x, dpr * y);
        const L = (p.len * (0.35 + 0.65 * emerge)) / 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, L, L * 0.5, 0, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    if (t >= end && !this.destroyed) {
      this.destroy();
      this.hooks.onDone();
    }
  }

  private cssText() {
    const [r, g, b] = this.rgb.text;
    return `rgb(${r},${g},${b})`;
  }
}
