import { interpolate, spring, Easing } from 'remotion';

// Standard spring configs
export const springConfigs = {
  smooth: { damping: 200 },                    // Smooth, no bounce
  snappy: { damping: 20, stiffness: 200 },     // Snappy, minimal bounce
  bouncy: { damping: 8 },                      // Bouncy entrance
  heavy: { damping: 15, stiffness: 80, mass: 2 }, // Heavy, slow
} as const;

// Common animation helpers
export const fadeIn = (
  frame: number,
  startFrame: number,
  durationFrames: number
) => {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const fadeOut = (
  frame: number,
  startFrame: number,
  durationFrames: number
) => {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const slideInFromBottom = (
  frame: number,
  fps: number,
  delay: number = 0
) => {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: springConfigs.smooth,
  });
  return interpolate(progress, [0, 1], [100, 0]);
};

export const slideInFromRight = (
  frame: number,
  fps: number,
  delay: number = 0
) => {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: springConfigs.smooth,
  });
  return interpolate(progress, [0, 1], [100, 0]);
};

export const slideInFromLeft = (
  frame: number,
  fps: number,
  delay: number = 0
) => {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: springConfigs.smooth,
  });
  return interpolate(progress, [0, 1], [-100, 0]);
};

export const scaleIn = (
  frame: number,
  fps: number,
  delay: number = 0
) => {
  return spring({
    frame: frame - delay,
    fps,
    config: springConfigs.smooth,
  });
};

export const scaleInBouncy = (
  frame: number,
  fps: number,
  delay: number = 0
) => {
  return spring({
    frame: frame - delay,
    fps,
    config: springConfigs.bouncy,
  });
};

// Ken Burns effect (slow zoom)
export const kenBurnsZoom = (
  frame: number,
  durationFrames: number,
  startScale: number = 1,
  endScale: number = 1.1
) => {
  return interpolate(frame, [0, durationFrames], [startScale, endScale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
};

// Typewriter effect helper
export const typewriter = (
  text: string,
  frame: number,
  fps: number,
  charsPerSecond: number = 20,
  delay: number = 0
) => {
  const adjustedFrame = Math.max(0, frame - delay);
  const charsPerFrame = charsPerSecond / fps;
  const visibleChars = Math.floor(adjustedFrame * charsPerFrame);
  return text.slice(0, Math.min(visibleChars, text.length));
};

// Counting animation
export const countUp = (
  frame: number,
  fps: number,
  endValue: number,
  durationSeconds: number = 1,
  delay: number = 0
) => {
  const adjustedFrame = Math.max(0, frame - delay);
  const durationFrames = durationSeconds * fps;
  const progress = interpolate(
    adjustedFrame,
    [0, durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );
  return Math.round(progress * endValue);
};

// Progress bar fill
export const progressFill = (
  frame: number,
  fps: number,
  targetPercent: number,
  durationSeconds: number = 1,
  delay: number = 0
) => {
  const adjustedFrame = Math.max(0, frame - delay);
  const durationFrames = durationSeconds * fps;
  return interpolate(
    adjustedFrame,
    [0, durationFrames],
    [0, targetPercent],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );
};

// Staggered animation delay calculator
export const staggerDelay = (
  index: number,
  delayPerItem: number = 5
) => {
  return index * delayPerItem;
};
