import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors } from '../lib/colors';
import { springConfigs } from '../lib/animations';

type OrbitPath = {
  label: string;
  age: number;
  radius: number;
  color: string;
  recommended?: boolean;
};

type OrbitRingsProps = {
  animate?: boolean;
  delay?: number;
  showLabels?: boolean;
  highlightRecommended?: boolean;
  centerLabel?: string;
  style?: React.CSSProperties;
};

const defaultPaths: OrbitPath[] = [
  { label: 'Baseline Path', age: 65, radius: 100, color: colors.slate400 },
  { label: 'Geo-Arbitrage', age: 55, radius: 160, color: colors.cyan400 },
  { label: 'Skill-Boosted', age: 49, radius: 220, color: colors.cosmic500, recommended: true },
];

export const OrbitRings: React.FC<OrbitRingsProps> = ({
  animate = true,
  delay = 0,
  showLabels = true,
  highlightRecommended = true,
  centerLabel = 'You, Today',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerSize = 500;
  const center = containerSize / 2;

  // Entrance animation
  const entranceProgress = spring({
    frame: frame - delay,
    fps,
    config: springConfigs.smooth,
  });

  // Rotation animation
  const baseRotation = animate ? (frame - delay) * 0.3 : 0;

  return (
    <div
      style={{
        width: containerSize,
        height: containerSize,
        position: 'relative',
        opacity: entranceProgress,
        transform: `scale(${interpolate(entranceProgress, [0, 1], [0.8, 1])})`,
        ...style,
      }}
    >
      {/* Orbit rings */}
      {defaultPaths.map((path, index) => {
        const ringDelay = delay + index * 8;
        const ringProgress = spring({
          frame: frame - ringDelay,
          fps,
          config: springConfigs.smooth,
        });

        // Each ring rotates at different speeds
        const rotation = baseRotation * (1 - index * 0.2);
        const reverseRotation = index % 2 === 1;

        // Pulse effect for recommended
        const pulseScale = path.recommended && highlightRecommended
          ? 1 + Math.sin((frame - delay) * 0.1) * 0.02
          : 1;

        return (
          <React.Fragment key={path.label}>
            {/* Orbit circle */}
            <div
              style={{
                position: 'absolute',
                left: center - path.radius,
                top: center - path.radius,
                width: path.radius * 2,
                height: path.radius * 2,
                borderRadius: '50%',
                border: `2px solid ${path.color}40`,
                opacity: ringProgress,
                transform: `scale(${interpolate(ringProgress, [0, 1], [0.5, 1]) * pulseScale})`,
                ...(path.recommended && highlightRecommended && {
                  boxShadow: `0 0 30px ${path.color}30`,
                }),
              }}
            />

            {/* Orbiting node */}
            <div
              style={{
                position: 'absolute',
                left: center,
                top: center,
                width: 0,
                height: 0,
                opacity: ringProgress,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  transform: `rotate(${reverseRotation ? -rotation : rotation}deg) translateX(${path.radius}px)`,
                  transformOrigin: '0 0',
                }}
              >
                {/* Node */}
                <div
                  style={{
                    width: path.recommended ? 20 : 14,
                    height: path.recommended ? 20 : 14,
                    borderRadius: '50%',
                    backgroundColor: path.color,
                    boxShadow: `0 0 20px ${path.color}80`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />

                {/* Label */}
                {showLabels && (
                  <div
                    style={{
                      position: 'absolute',
                      top: path.recommended ? -45 : -35,
                      left: '50%',
                      transform: `translateX(-50%) rotate(${reverseRotation ? rotation : -rotation}deg)`,
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: path.color,
                        marginBottom: 2,
                      }}
                    >
                      {path.label}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: colors.white,
                      }}
                    >
                      Age {path.age}
                    </div>
                    {path.recommended && highlightRecommended && (
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 10,
                          fontWeight: 600,
                          color: colors.cosmic400,
                          backgroundColor: `${colors.cosmic500}30`,
                          padding: '2px 8px',
                          borderRadius: 10,
                          display: 'inline-block',
                        }}
                      >
                        RECOMMENDED
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Center point */}
      <div
        style={{
          position: 'absolute',
          left: center,
          top: center,
          transform: 'translate(-50%, -50%)',
          opacity: entranceProgress,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: colors.white,
            boxShadow: `0 0 20px ${colors.white}60`,
          }}
        />
        {showLabels && (
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 12,
              fontWeight: 500,
              color: colors.slate400,
              whiteSpace: 'nowrap',
            }}
          >
            {centerLabel}
          </div>
        )}
      </div>
    </div>
  );
};
