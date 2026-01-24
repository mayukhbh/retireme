import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img } from 'remotion';
import { colors } from '../lib/colors';
import { springConfigs, kenBurnsZoom } from '../lib/animations';

type ScreenFrameProps = {
  src: string;
  width?: number;
  height?: number;
  animate?: 'fadeIn' | 'slideUp' | 'slideRight' | 'scaleIn' | 'none';
  delay?: number;
  kenBurns?: boolean;
  kenBurnsIntensity?: number;
  showFrame?: boolean;
  frameColor?: string;
  glowColor?: string;
  showGlow?: boolean;
  borderRadius?: number;
  style?: React.CSSProperties;
};

export const ScreenFrame: React.FC<ScreenFrameProps> = ({
  src,
  width = 1200,
  height = 675,
  animate = 'none',
  delay = 0,
  kenBurns = true,
  kenBurnsIntensity = 0.08,
  showFrame = true,
  frameColor = colors.space800,
  glowColor = colors.cosmic500,
  showGlow = true,
  borderRadius = 16,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation calculations
  let opacity = 1;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;

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
    translateY = interpolate(progress, [0, 1], [100, 0]);
  } else if (animate === 'slideRight') {
    const progress = spring({
      frame: frame - delay,
      fps,
      config: springConfigs.smooth,
    });
    opacity = progress;
    translateX = interpolate(progress, [0, 1], [-100, 0]);
  } else if (animate === 'scaleIn') {
    const progress = spring({
      frame: frame - delay,
      fps,
      config: springConfigs.smooth,
    });
    opacity = progress;
    scale = interpolate(progress, [0, 1], [0.85, 1]);
  }

  // Ken Burns effect
  const kenBurnsScale = kenBurns
    ? kenBurnsZoom(
        Math.max(0, frame - delay),
        durationInFrames - delay,
        1,
        1 + kenBurnsIntensity
      )
    : 1;

  const framePadding = showFrame ? 12 : 0;
  const totalWidth = width + framePadding * 2;
  const totalHeight = height + framePadding * 2 + (showFrame ? 32 : 0);

  return (
    <div
      style={{
        width: totalWidth,
        height: totalHeight,
        opacity,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        ...style,
      }}
    >
      {/* Device frame */}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: showFrame ? frameColor : 'transparent',
          borderRadius: showFrame ? borderRadius + 8 : borderRadius,
          padding: framePadding,
          paddingTop: showFrame ? framePadding + 32 : framePadding,
          position: 'relative',
          ...(showGlow && {
            boxShadow: `0 0 60px ${glowColor}25, 0 0 120px ${glowColor}10, 0 25px 50px rgba(0, 0, 0, 0.5)`,
          }),
        }}
      >
        {/* Browser dots */}
        {showFrame && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 16,
              display: 'flex',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#FF5F57',
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#FEBC2E',
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#28C840',
              }}
            />
          </div>
        )}

        {/* Screenshot container with overflow hidden for Ken Burns */}
        <div
          style={{
            width,
            height,
            borderRadius,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Img
            src={src}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${kenBurnsScale})`,
              transformOrigin: 'center center',
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Highlight overlay for pointing to specific parts of a screenshot
type HighlightOverlayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  delay?: number;
  color?: string;
  label?: string;
};

export const HighlightOverlay: React.FC<HighlightOverlayProps> = ({
  x,
  y,
  width,
  height,
  delay = 0,
  color = colors.cosmic500,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: springConfigs.smooth,
  });

  const pulseOpacity = 0.3 + Math.sin((frame - delay) * 0.15) * 0.2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity: progress,
        pointerEvents: 'none',
      }}
    >
      {/* Highlight border */}
      <div
        style={{
          width: '100%',
          height: '100%',
          border: `3px solid ${color}`,
          borderRadius: 8,
          boxShadow: `0 0 20px ${color}${Math.round(pulseOpacity * 255).toString(16).padStart(2, '0')}`,
        }}
      />

      {/* Label */}
      {label && (
        <div
          style={{
            position: 'absolute',
            top: -36,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: color,
            color: colors.white,
            padding: '6px 16px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
