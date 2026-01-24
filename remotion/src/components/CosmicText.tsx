import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors } from '../lib/colors';
import { typography } from '../lib/fonts';
import { springConfigs, typewriter } from '../lib/animations';

type CosmicTextProps = {
  children: string;
  variant?: 'hero' | 'headline' | 'subheadline' | 'body' | 'label' | 'stat';
  gradient?: boolean;
  glow?: boolean;
  glowColor?: string;
  animate?: 'fadeIn' | 'slideUp' | 'typewriter' | 'none';
  delay?: number;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  style?: React.CSSProperties;
};

export const CosmicText: React.FC<CosmicTextProps> = ({
  children,
  variant = 'body',
  gradient = false,
  glow = false,
  glowColor = colors.cosmic500,
  animate = 'none',
  delay = 0,
  textAlign = 'center',
  color = colors.white,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const variantStyle = typography[variant];

  // Animation calculations
  let opacity = 1;
  let translateY = 0;
  let displayText = children;

  if (animate === 'fadeIn') {
    opacity = spring({
      frame: frame - delay,
      fps,
      config: springConfigs.smooth,
    });
  } else if (animate === 'slideUp') {
    const progress = spring({
      frame: frame - delay,
      fps,
      config: springConfigs.smooth,
    });
    opacity = progress;
    translateY = interpolate(progress, [0, 1], [40, 0]);
  } else if (animate === 'typewriter') {
    displayText = typewriter(children, frame, fps, 25, delay);
    opacity = frame >= delay ? 1 : 0;
  }

  const baseStyle: React.CSSProperties = {
    ...variantStyle,
    color: gradient ? 'transparent' : color,
    textAlign,
    opacity,
    transform: `translateY(${translateY}px)`,
    ...(gradient && {
      background: colors.gradients.cosmicFull,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }),
    ...(glow && {
      textShadow: `0 0 40px ${glowColor}60, 0 0 80px ${glowColor}30`,
    }),
    ...style,
  };

  return <div style={baseStyle}>{displayText}</div>;
};

// Animated number counter component
type NumberCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
  durationFrames?: number;
  color?: string;
  glow?: boolean;
  style?: React.CSSProperties;
};

export const NumberCounter: React.FC<NumberCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  delay = 0,
  durationFrames = 45,
  color = colors.white,
  glow = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  const progress = interpolate(
    adjustedFrame,
    [0, durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const displayValue = Math.round(progress * value);

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: springConfigs.smooth,
  });

  const scale = spring({
    frame: frame - delay,
    fps,
    config: springConfigs.bouncy,
  });

  return (
    <div
      style={{
        ...typography.stat,
        color,
        opacity,
        transform: `scale(${0.8 + scale * 0.2})`,
        ...(glow && {
          textShadow: `0 0 60px ${colors.cosmic500}50`,
        }),
        ...style,
      }}
    >
      {prefix}{displayValue}{suffix}
    </div>
  );
};
