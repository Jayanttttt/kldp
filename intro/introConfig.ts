import type { DeepPartial, IntroConfig } from './types';

/**
 * ✏️  EDIT ME. This is the single place to customise the intro.
 * Anything you leave out falls back to the reference-matched defaults in resolveConfig.ts.
 * The values below are the defaults, written out so you can see what is adjustable.
 */
export const introConfig: DeepPartial<IntroConfig> = {
  text: 'KULDEEP YADAV',
  duration: 3000, // ms before the exit transition starts (intro is gone at duration + fadeOutDuration)

  colors: {
    background: '#030304',
    primary: '#b3123c', // crimson petals
    secondary: '#ececec', // white petals
    text: '#c9c7be',
    accent: '#e0a458', // used by accentRatio / glow
  },

  typography: {
    fontFamily: "'AnimatedIntro Cinzel', Cinzel, 'Trajan Pro', 'Times New Roman', serif", // or "inherit"
    fontSize: 'clamp(2.5rem, 8vw, 7rem)',
    fontWeight: 500, // 400 | 500 | 700 are bundled for Cinzel
    letterSpacing: '0.12em',
    position: { x: 0.5, y: 0.5 },
  },

  animation: {
    fadeInDuration: 400,
    fadeOutDuration: 500,
    intensity: 1,
    speed: 1,
    dissolveAt: 0.4,
    maxPetals: 230,
    petalSize: 0.17,
    primaryRatio: 0.6,
    accentRatio: 0,
    spread: 1,
    windAngle: -8,
    glow: 0,
  },

  behavior: {
    frequency: 'always', // 'always' | 'session' | 'once'
    lockScroll: true,
    reducedMotionDuration: 700,
    zIndex: 10000,
  },
};
