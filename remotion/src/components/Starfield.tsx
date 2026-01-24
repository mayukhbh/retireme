import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';
import { colors } from '../lib/colors';

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleOffset: number;
  color: string;
};

type StarfieldProps = {
  starCount?: number;
  fadeIn?: boolean;
  fadeInDuration?: number;
};

export const Starfield: React.FC<StarfieldProps> = ({
  starCount = 150,
  fadeIn = true,
  fadeInDuration = 30,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Generate stars deterministically
  const stars = useMemo(() => {
    const generatedStars: Star[] = [];
    const starColors = [colors.white, colors.cosmic400, colors.cyan400];

    for (let i = 0; i < starCount; i++) {
      // Use deterministic pseudo-random based on index
      const seed = i * 9301 + 49297;
      const rand = () => ((seed * (i + 1)) % 233280) / 233280;

      generatedStars.push({
        x: rand() * width,
        y: rand() * height,
        size: 1 + rand() * 2.5,
        opacity: 0.3 + rand() * 0.7,
        speed: 0.2 + rand() * 0.5,
        twinkleOffset: rand() * 100,
        color: starColors[Math.floor(rand() * starColors.length)],
      });
    }
    return generatedStars;
  }, [starCount, width, height]);

  // Fade in effect
  const containerOpacity = fadeIn
    ? interpolate(frame, [0, fadeInDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.spaceBg,
        opacity: containerOpacity,
      }}
    >
      {/* Gradient overlay for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${colors.space900} 0%, ${colors.spaceBg} 70%)`,
        }}
      />

      {/* Stars */}
      {stars.map((star, index) => {
        // Twinkle animation
        const twinkleSpeed = 2; // seconds per cycle
        const twinkleCycle = ((frame / fps) * twinkleSpeed + star.twinkleOffset) % 1;
        const twinkleOpacity = 0.5 + Math.sin(twinkleCycle * Math.PI * 2) * 0.5;

        // Subtle parallax movement
        const parallaxY = (frame * star.speed * 0.5) % height;
        const adjustedY = (star.y + parallaxY) % height;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: star.x,
              top: adjustedY,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: star.color,
              opacity: star.opacity * twinkleOpacity,
              boxShadow: star.size > 2
                ? `0 0 ${star.size * 2}px ${star.color}`
                : 'none',
            }}
          />
        );
      })}

      {/* Cosmic glow spots */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.cosmic500}15 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '20%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.cyan400}12 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }}
      />
    </AbsoluteFill>
  );
};
