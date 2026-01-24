import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, staticFile } from 'remotion';
import { Starfield, ScreenFrame } from '../components';
import { colors } from '../lib/colors';
import { springConfigs } from '../lib/animations';

type ResultsSceneProps = {
  durationInFrames: number;
};

export const ResultsScene: React.FC<ResultsSceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const labelDelay = 10;
  const ageDelay = 30;
  const screenshotDelay = 70;
  const statsDelay = 150;
  const calloutDelay = 280;
  const fadeOutStart = durationInFrames - 25;

  // Animations
  const labelProgress = spring({
    frame: frame - labelDelay,
    fps,
    config: springConfigs.smooth,
  });

  const ageProgress = spring({
    frame: frame - ageDelay,
    fps,
    config: springConfigs.bouncy,
  });

  // Age counter
  const ageValue = interpolate(
    frame,
    [ageDelay, ageDelay + 40],
    [65, 49],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  const screenshotProgress = spring({
    frame: frame - screenshotDelay,
    fps,
    config: { damping: 80 },
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Celebration pulse
  const celebrationPulse = 1 + Math.sin((frame - ageDelay) * 0.1) * 0.02;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Background */}
      <Starfield starCount={150} fadeIn={false} />

      {/* Success glow */}
      <div
        style={{
          position: 'absolute',
          left: '30%',
          top: '20%',
          width: 600,
          height: 400,
          background: `radial-gradient(ellipse, ${colors.emerald500}10 0%, transparent 50%)`,
          filter: 'blur(80px)',
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          padding: 60,
        }}
      >
        {/* Left side - Big number and headline */}
        <div
          style={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingRight: 40,
          }}
        >
          {/* Label */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.emerald500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 20,
              opacity: labelProgress,
              transform: `translateY(${interpolate(labelProgress, [0, 1], [15, 0])}px)`,
            }}
          >
            Your Optimal Retirement Age
          </div>

          {/* The BIG number */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              marginBottom: 24,
              opacity: ageProgress,
              transform: `scale(${interpolate(ageProgress, [0, 1], [0.8, 1]) * celebrationPulse})`,
            }}
          >
            <span
              style={{
                fontSize: 200,
                fontWeight: 900,
                letterSpacing: '-0.05em',
                lineHeight: 0.85,
                background: `linear-gradient(135deg, ${colors.emerald500} 0%, ${colors.cyan400} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: `0 0 80px ${colors.emerald500}40`,
              }}
            >
              {Math.round(ageValue)}
            </span>
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: colors.white,
              lineHeight: 1.3,
              marginBottom: 20,
              opacity: interpolate(ageProgress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp' }),
            }}
          >
            With the <span style={{ color: colors.cosmic400 }}>Skill-Boosted</span> path
          </div>

          {/* Stats row */}
          {frame > statsDelay && (
            <div
              style={{
                display: 'flex',
                gap: 40,
                marginTop: 20,
                opacity: spring({ frame: frame - statsDelay, fps, config: springConfigs.smooth }),
                transform: `translateY(${interpolate(
                  spring({ frame: frame - statsDelay, fps, config: springConfigs.smooth }),
                  [0, 1],
                  [20, 0]
                )}px)`,
              }}
            >
              {/* Success rate */}
              <div>
                <div style={{ fontSize: 48, fontWeight: 800, color: colors.cosmic400 }}>
                  92<span style={{ fontSize: 28 }}>%</span>
                </div>
                <div style={{ fontSize: 14, color: colors.slate400, marginTop: 4 }}>
                  Success Rate
                </div>
              </div>

              {/* Years saved */}
              <div>
                <div style={{ fontSize: 48, fontWeight: 800, color: colors.cyan400 }}>
                  16
                </div>
                <div style={{ fontSize: 14, color: colors.slate400, marginTop: 4 }}>
                  Years Saved
                </div>
              </div>

              {/* Scenarios */}
              <div>
                <div style={{ fontSize: 48, fontWeight: 800, color: colors.emerald500 }}>
                  100
                </div>
                <div style={{ fontSize: 14, color: colors.slate400, marginTop: 4 }}>
                  Scenarios Run
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Screenshot */}
        <div
          style={{
            width: '55%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              opacity: screenshotProgress,
              transform: `translateY(${interpolate(screenshotProgress, [0, 1], [60, 0])}px) scale(${interpolate(screenshotProgress, [0, 1], [0.95, 1])})`,
            }}
          >
            <ScreenFrame
              src={staticFile('screenshots/dashboard.png')}
              width={850}
              height={530}
              animate="none"
              kenBurns
              kenBurnsIntensity={0.05}
              showFrame
              showGlow
              glowColor={colors.cosmic500}
              borderRadius={12}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* Bottom callout */}
      {frame > calloutDelay && (
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: spring({ frame: frame - calloutDelay, fps, config: springConfigs.smooth }),
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(16px)',
              border: `2px solid ${colors.emerald500}40`,
              borderRadius: 20,
              padding: '20px 36px',
              boxShadow: `0 0 40px ${colors.emerald500}20`,
            }}
          >
            {/* Check icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: `${colors.emerald500}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.emerald500} strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div>
              <div style={{ fontSize: 14, color: colors.slate400, marginBottom: 4 }}>
                Compared to the baseline path
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.emerald500 }}>
                Retire <span style={{ color: colors.white }}>16 years</span> earlier
              </div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
