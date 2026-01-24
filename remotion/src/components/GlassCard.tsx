import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors } from '../lib/colors';
import { springConfigs } from '../lib/animations';

type GlassCardProps = {
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  padding?: number;
  borderRadius?: number;
  animate?: 'fadeIn' | 'scaleIn' | 'slideUp' | 'none';
  delay?: number;
  glowColor?: string;
  showGlow?: boolean;
  borderColor?: string;
  style?: React.CSSProperties;
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  width = 'auto',
  height = 'auto',
  padding = 32,
  borderRadius = 24,
  animate = 'none',
  delay = 0,
  glowColor = colors.cosmic500,
  showGlow = false,
  borderColor = 'rgba(255, 255, 255, 0.15)',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
      config: springConfigs.smooth,
    });
    opacity = progress;
    scale = interpolate(progress, [0, 1], [0.9, 1]);
  } else if (animate === 'slideUp') {
    const progress = spring({
      frame: frame - delay,
      fps,
      config: springConfigs.smooth,
    });
    opacity = progress;
    translateY = interpolate(progress, [0, 1], [60, 0]);
  }

  return (
    <div
      style={{
        width,
        height,
        padding,
        borderRadius,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${borderColor}`,
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        ...(showGlow && {
          boxShadow: `0 0 40px ${glowColor}30, 0 0 80px ${glowColor}15`,
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Accent bar for cards
type AccentBarProps = {
  color?: string;
  width?: number | string;
  height?: number;
  borderRadius?: number;
};

export const AccentBar: React.FC<AccentBarProps> = ({
  color = colors.cosmic500,
  width = '100%',
  height = 4,
  borderRadius = 2,
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${color}, ${colors.cyan400})`,
      }}
    />
  );
};
