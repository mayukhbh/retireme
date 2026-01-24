import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from 'remotion';
import { Starfield, ScreenFrame } from '../components';
import { colors } from '../lib/colors';
import { springConfigs } from '../lib/animations';

type HeroSceneProps = {
  durationInFrames: number;
};

export const HeroScene: React.FC<HeroSceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const solutionDelay = 5;
  const logoDelay = 30;
  const taglineDelay = 50;
  const screenshotDelay = 70;
  const pathsDelay = 160;
  const fadeOutStart = durationInFrames - 25;

  // Animations
  const solutionProgress = spring({
    frame: frame - solutionDelay,
    fps,
    config: springConfigs.smooth,
  });

  const logoProgress = spring({
    frame: frame - logoDelay,
    fps,
    config: springConfigs.bouncy,
  });

  const taglineProgress = spring({
    frame: frame - taglineDelay,
    fps,
    config: springConfigs.smooth,
  });

  const screenshotProgress = spring({
    frame: frame - screenshotDelay,
    fps,
    config: { damping: 80 },
  });

  // Screenshot subtle float
  const screenshotFloat = Math.sin((frame - screenshotDelay) * 0.025) * 6;

  // Fade out
  const fadeOut = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Paths animation
  const pathsProgress = spring({
    frame: frame - pathsDelay,
    fps,
    config: springConfigs.smooth,
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Background */}
      <Starfield starCount={120} fadeIn={false} />

      {/* Celebration glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1200,
          height: 800,
          background: `radial-gradient(ellipse, ${colors.cosmic500}10 0%, transparent 50%)`,
          filter: 'blur(80px)',
        }}
      />

      {/* Content - Centered layout */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 40,
        }}
      >
        {/* "Introducing" label */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.cosmic400,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: 12,
            opacity: solutionProgress,
            transform: `translateY(${interpolate(solutionProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          Introducing
        </div>

        {/* Logo */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            background: colors.gradients.cosmicFull,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 10,
            opacity: logoProgress,
            transform: `scale(${interpolate(logoProgress, [0, 1], [0.8, 1])})`,
          }}
        >
          RetireMe
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: colors.slate300,
            marginBottom: 30,
            opacity: taglineProgress,
            transform: `translateY(${interpolate(taglineProgress, [0, 1], [15, 0])}px)`,
          }}
        >
          AI-powered Monte Carlo simulations for your retirement
        </div>

        {/* Screenshot - FULL WIDTH centered */}
        <div
          style={{
            opacity: screenshotProgress,
            transform: `translateY(${interpolate(screenshotProgress, [0, 1], [60, 0]) + screenshotFloat}px) scale(${interpolate(screenshotProgress, [0, 1], [0.95, 1])})`,
          }}
        >
          <ScreenFrame
            src={staticFile('screenshots/landing.png')}
            width={1280}
            height={720}
            animate="none"
            kenBurns
            kenBurnsIntensity={0.05}
            showFrame
            showGlow
            glowColor={colors.cosmic500}
          />
        </div>

        {/* Three paths overlay - appears on top of screenshot */}
        {frame > pathsDelay && (
          <div
            style={{
              position: 'absolute',
              bottom: 100,
              display: 'flex',
              gap: 24,
              opacity: pathsProgress,
              transform: `translateY(${interpolate(pathsProgress, [0, 1], [30, 0])}px)`,
            }}
          >
            {/* Baseline */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${colors.slate400}30`,
                borderRadius: 16,
                padding: '16px 28px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: colors.slate400, letterSpacing: '0.1em', marginBottom: 6 }}>
                BASELINE
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: colors.slate400 }}>65</div>
              <div style={{ fontSize: 12, color: colors.slate400 }}>years old</div>
            </div>

            {/* Geo-Arbitrage */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${colors.cyan400}40`,
                borderRadius: 16,
                padding: '16px 28px',
                textAlign: 'center',
                boxShadow: `0 0 30px ${colors.cyan400}15`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: colors.cyan400, letterSpacing: '0.1em', marginBottom: 6 }}>
                GEO-ARBITRAGE
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: colors.cyan400 }}>55</div>
              <div style={{ fontSize: 12, color: colors.slate400 }}>years old</div>
            </div>

            {/* Skill-Boosted - BEST */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(16px)',
                border: `2px solid ${colors.cosmic500}50`,
                borderRadius: 16,
                padding: '20px 32px',
                textAlign: 'center',
                boxShadow: `0 0 40px ${colors.cosmic500}25`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: colors.cosmic400, letterSpacing: '0.1em', marginBottom: 6 }}>
                SKILL-BOOSTED
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, color: colors.cosmic400 }}>49</div>
              <div style={{ fontSize: 12, color: colors.slate400, marginBottom: 8 }}>years old</div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: colors.emerald500,
                  backgroundColor: `${colors.emerald500}20`,
                  padding: '4px 12px',
                  borderRadius: 20,
                  display: 'inline-block',
                }}
              >
                RECOMMENDED
              </div>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
