import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors } from '../lib/colors';
import { springConfigs } from '../lib/animations';
import { typography } from '../lib/fonts';

// Simple SVG icons as components
const Icons = {
  chart: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  brain: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M12 5v13" />
    </svg>
  ),
  globe: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  shield: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  warning: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  calculator: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  ),
  sparkles: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  ),
  rocket: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
};

type IconName = keyof typeof Icons;

type FeatureHighlightProps = {
  icon: IconName;
  title: string;
  description?: string;
  iconColor?: string;
  animate?: 'fadeIn' | 'scaleIn' | 'slideUp' | 'none';
  delay?: number;
  variant?: 'default' | 'problem' | 'solution';
  style?: React.CSSProperties;
};

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  icon,
  title,
  description,
  iconColor,
  animate = 'none',
  delay = 0,
  variant = 'default',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Variant-specific colors
  const variantColors = {
    default: { icon: colors.cosmic500, bg: `${colors.cosmic500}20` },
    problem: { icon: colors.red500, bg: `${colors.red500}20` },
    solution: { icon: colors.emerald500, bg: `${colors.emerald500}20` },
  };

  const variantStyle = variantColors[variant];
  const finalIconColor = iconColor || variantStyle.icon;

  // Animation calculations
  let opacity = 1;
  let scale = 1;
  let translateY = 0;

  if (animate === 'fadeIn') {
    opacity = spring({
      frame: frame - delay,
      fps,
      config: springConfigs.smooth,
    });
  } else if (animate === 'scaleIn') {
    const progress = spring({
      frame: frame - delay,
      fps,
      config: springConfigs.bouncy,
    });
    opacity = progress;
    scale = interpolate(progress, [0, 1], [0.5, 1]);
  } else if (animate === 'slideUp') {
    const progress = spring({
      frame: frame - delay,
      fps,
      config: springConfigs.smooth,
    });
    opacity = progress;
    translateY = interpolate(progress, [0, 1], [30, 0]);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        ...style,
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          backgroundColor: variantStyle.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: finalIconColor,
          marginBottom: 16,
        }}
      >
        {Icons[icon]}
      </div>

      {/* Title */}
      <div
        style={{
          ...typography.subheadline,
          fontSize: 20,
          color: colors.white,
          marginBottom: description ? 8 : 0,
        }}
      >
        {title}
      </div>

      {/* Description */}
      {description && (
        <div
          style={{
            ...typography.body,
            fontSize: 14,
            color: colors.slate400,
            maxWidth: 200,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
};

// Problem card with X icon
type ProblemCardProps = {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
};

export const ProblemCard: React.FC<ProblemCardProps> = ({
  text,
  delay = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: springConfigs.smooth,
  });

  const translateX = interpolate(progress, [0, 1], [-50, 0]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: progress,
        transform: `translateX(${translateX}px)`,
        ...style,
      }}
    >
      {/* X icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: `${colors.red500}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.red500,
          flexShrink: 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </div>

      {/* Text */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: colors.white,
        }}
      >
        {text}
      </div>
    </div>
  );
};
