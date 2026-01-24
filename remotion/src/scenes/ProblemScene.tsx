import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Starfield } from '../components';
import { colors } from '../lib/colors';

type ProblemSceneProps = {
  durationInFrames: number;
};

const problems = [
  { text: 'Guesswork', subtext: 'Most calculators use oversimplified assumptions' },
  { text: 'Uncertainty', subtext: 'Market volatility completely ignored' },
  { text: 'One-size-fits-all', subtext: 'No paths tailored to your skills' },
];

export const ProblemScene: React.FC<ProblemSceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const headerDelay = 10;
  const problemsStartDelay = 50;
  const problemStagger = 35;
  const fadeOutStart = durationInFrames - 20;

  // Header animation
  const headerProgress = spring({
    frame: frame - headerDelay,
    fps,
    config: { damping: 100 },
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Darker, moodier background */}
      <Starfield starCount={60} fadeIn={false} />

      {/* Dark vignette overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, ${colors.spaceBg}80 0%, ${colors.spaceBg} 70%)`,
        }}
      />

      {/* Red warning glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '60%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 400,
          background: `radial-gradient(ellipse, ${colors.red500}08 0%, transparent 60%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: 80,
            textAlign: 'center',
            opacity: headerProgress,
            transform: `translateY(${interpolate(headerProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: colors.red500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            The Problem
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: colors.white,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Traditional retirement planning
            <br />
            <span style={{ color: colors.slate400 }}>is broken.</span>
          </div>
        </div>

        {/* Problems grid */}
        <div
          style={{
            display: 'flex',
            gap: 60,
            justifyContent: 'center',
          }}
        >
          {problems.map((problem, index) => {
            const delay = problemsStartDelay + index * problemStagger;
            const progress = spring({
              frame: frame - delay,
              fps,
              config: { damping: 80 },
            });

            return (
              <div
                key={problem.text}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  width: 280,
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
                }}
              >
                {/* X icon */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    backgroundColor: `${colors.red500}15`,
                    border: `2px solid ${colors.red500}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.red500} strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </div>

                {/* Problem title */}
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: colors.white,
                    marginBottom: 12,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {problem.text}
                </div>

                {/* Subtext */}
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: colors.slate400,
                    lineHeight: 1.5,
                  }}
                >
                  {problem.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
