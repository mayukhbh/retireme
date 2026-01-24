import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Starfield } from '../components';
import { colors } from '../lib/colors';
import { springConfigs } from '../lib/animations';

type CtaSceneProps = {
  durationInFrames: number;
};

export const CtaScene: React.FC<CtaSceneProps> = (_props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const headlineDelay = 10;
  const sublineDelay = 35;
  const buttonDelay = 60;
  const logoDelay = 120;
  const taglineDelay = 150;

  // Animations
  const headlineProgress = spring({
    frame: frame - headlineDelay,
    fps,
    config: { damping: 80 },
  });

  const sublineProgress = spring({
    frame: frame - sublineDelay,
    fps,
    config: springConfigs.smooth,
  });

  const buttonProgress = spring({
    frame: frame - buttonDelay,
    fps,
    config: springConfigs.bouncy,
  });

  const logoProgress = spring({
    frame: frame - logoDelay,
    fps,
    config: springConfigs.smooth,
  });

  // Button pulse
  const buttonPulse = frame > buttonDelay + 30 ? 1 + Math.sin((frame - buttonDelay) * 0.12) * 0.03 : 1;
  const buttonGlow = frame > buttonDelay + 30 ? 40 + Math.sin((frame - buttonDelay) * 0.12) * 15 : 40;

  return (
    <AbsoluteFill>
      {/* Intensified starfield */}
      <Starfield starCount={250} fadeIn={false} />

      {/* Multiple cosmic glows */}
      <div
        style={{
          position: 'absolute',
          left: '30%',
          top: '30%',
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${colors.cosmic500}20 0%, transparent 50%)`,
          filter: 'blur(80px)',
          opacity: 0.6 + Math.sin(frame * 0.04) * 0.2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '25%',
          top: '40%',
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${colors.cyan400}15 0%, transparent 50%)`,
          filter: 'blur(60px)',
          opacity: 0.6 + Math.cos(frame * 0.04) * 0.2,
        }}
      />

      {/* Main content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Main headline */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 20,
            opacity: headlineProgress,
            transform: `translateY(${interpolate(headlineProgress, [0, 1], [40, 0])}px) scale(${interpolate(headlineProgress, [0, 1], [0.95, 1])})`,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: colors.white,
            }}
          >
            Your future is
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              background: colors.gradients.cosmicFull,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            waiting.
          </div>
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: colors.slate300,
            marginBottom: 50,
            opacity: sublineProgress,
            transform: `translateY(${interpolate(sublineProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          Run your free Monte Carlo simulation in under 3 minutes
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: buttonProgress,
            transform: `scale(${interpolate(buttonProgress, [0, 1], [0.8, 1]) * buttonPulse})`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.cosmic600} 0%, ${colors.cosmic500} 50%, ${colors.cyan500} 100%)`,
              padding: '24px 56px',
              borderRadius: 60,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: `0 0 ${buttonGlow}px ${colors.cosmic500}50, 0 0 ${buttonGlow * 2}px ${colors.cosmic500}25, 0 20px 40px rgba(0,0,0,0.4)`,
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {/* Rocket icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: colors.white,
                letterSpacing: '0.01em',
              }}
            >
              Start Free Simulation
            </span>
          </div>
        </div>

        {/* Logo and footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: logoProgress,
            transform: `translateY(${interpolate(logoProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: colors.gradients.cosmicFull,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 12,
            }}
          >
            RetireMe
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: colors.slate400,
              letterSpacing: '0.05em',
              opacity: spring({ frame: frame - taglineDelay, fps, config: springConfigs.smooth }),
            }}
          >
            Plot your financial future
          </div>
        </div>
      </AbsoluteFill>

      {/* Subtle animated particles floating outward */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const speed = 0.8 + (i % 3) * 0.3;
        const radius = 100 + frame * speed;
        const maxRadius = 800;
        const particleOpacity = interpolate(radius, [100, 400, maxRadius], [0, 0.6, 0], { extrapolateRight: 'clamp' });

        if (radius > maxRadius) return null;

        const x = Math.cos(angle + frame * 0.005) * radius;
        const y = Math.sin(angle + frame * 0.005) * radius;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              borderRadius: '50%',
              backgroundColor: i % 2 === 0 ? colors.cosmic400 : colors.cyan400,
              transform: `translate(${x}px, ${y}px)`,
              opacity: particleOpacity,
              boxShadow: `0 0 10px ${i % 2 === 0 ? colors.cosmic400 : colors.cyan400}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
