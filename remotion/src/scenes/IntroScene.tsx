import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { Starfield } from '../components';
import { colors } from '../lib/colors';
import { springConfigs } from '../lib/animations';

type IntroSceneProps = {
  durationInFrames: number;
};

export const IntroScene: React.FC<IntroSceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dramatic timing
  const line1Delay = 15;
  const line2Delay = 45;
  const numberDelay = 75;
  const line3Delay = 110;
  const fadeOutStart = durationInFrames - 20;

  // Line animations with dramatic spring
  const line1Progress = spring({
    frame: frame - line1Delay,
    fps,
    config: { damping: 100, stiffness: 200 },
  });

  const line2Progress = spring({
    frame: frame - line2Delay,
    fps,
    config: { damping: 100, stiffness: 200 },
  });

  const numberProgress = spring({
    frame: frame - numberDelay,
    fps,
    config: springConfigs.bouncy,
  });

  const line3Progress = spring({
    frame: frame - line3Delay,
    fps,
    config: springConfigs.smooth,
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Number counter animation
  const numberValue = interpolate(
    frame,
    [numberDelay, numberDelay + 30],
    [0, 16],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  // Dramatic scale pulse on the number
  const numberScale = 1 + Math.sin((frame - numberDelay) * 0.15) * 0.03;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Deep space background */}
      <Starfield starCount={180} fadeIn fadeInDuration={30} />

      {/* Dramatic center glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          background: `radial-gradient(circle, ${colors.cosmic500}15 0%, transparent 50%)`,
          filter: 'blur(60px)',
          opacity: interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      />

      {/* Main content - centered */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Line 1: "What if you could" */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 400,
            color: colors.slate300,
            letterSpacing: '0.02em',
            opacity: line1Progress,
            transform: `translateY(${interpolate(line1Progress, [0, 1], [30, 0])}px)`,
            marginBottom: 20,
          }}
        >
          What if you could
        </div>

        {/* Line 2: "retire" */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            background: colors.gradients.cosmicFull,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: line2Progress,
            transform: `translateY(${interpolate(line2Progress, [0, 1], [50, 0])}px) scale(${interpolate(line2Progress, [0, 1], [0.9, 1])})`,
            textShadow: `0 0 80px ${colors.cosmic500}40`,
            marginBottom: 30,
          }}
        >
          retire
        </div>

        {/* The big number + "years earlier" */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 24,
            opacity: numberProgress,
            transform: `scale(${interpolate(numberProgress, [0, 1], [0.8, 1]) * numberScale})`,
          }}
        >
          {/* The dramatic number */}
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: colors.cyan400,
              letterSpacing: '-0.05em',
              lineHeight: 0.9,
              textShadow: `0 0 60px ${colors.cyan400}60, 0 0 120px ${colors.cyan400}30`,
            }}
          >
            {Math.round(numberValue)}
          </div>

          {/* "years earlier?" */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 600,
              color: colors.white,
              letterSpacing: '-0.01em',
              opacity: line3Progress,
              transform: `translateX(${interpolate(line3Progress, [0, 1], [-20, 0])}px)`,
            }}
          >
            years earlier<span style={{ color: colors.cosmic400 }}>?</span>
          </div>
        </div>

        {/* Subtle tagline */}
        <div
          style={{
            marginTop: 60,
            fontSize: 20,
            fontWeight: 500,
            color: colors.slate400,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: interpolate(frame, [line3Delay + 20, line3Delay + 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          Discover your fastest path to freedom
        </div>
      </AbsoluteFill>

      {/* Animated accent lines */}
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '50%',
          width: interpolate(frame, [30, 70], [0, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${colors.cosmic500})`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '10%',
          top: '50%',
          width: interpolate(frame, [30, 70], [0, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          height: 2,
          background: `linear-gradient(270deg, transparent, ${colors.cyan400})`,
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};
