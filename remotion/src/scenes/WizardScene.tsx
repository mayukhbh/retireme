import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from 'remotion';
import { Starfield, ScreenFrame } from '../components';
import { colors } from '../lib/colors';

type WizardSceneProps = {
  durationInFrames: number;
};

type WizardStep = {
  number: string;
  title: string;
  description: string;
  screenshot: string;
  accentColor: string;
};

const wizardSteps: WizardStep[] = [
  {
    number: '01',
    title: 'Your Finances',
    description: 'Income, savings, and risk tolerance',
    screenshot: 'wizard-step1.png',
    accentColor: colors.cosmic500,
  },
  {
    number: '02',
    title: 'Your Skills',
    description: 'Career growth potential',
    screenshot: 'wizard-step2.png',
    accentColor: colors.cyan400,
  },
  {
    number: '03',
    title: 'Your Dreams',
    description: 'Lifestyle and location goals',
    screenshot: 'wizard-step3.png',
    accentColor: colors.emerald500,
  },
];

export const WizardScene: React.FC<WizardSceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate step timing
  const stepDuration = Math.floor(durationInFrames / 3);
  const currentStepIndex = Math.min(Math.floor(frame / stepDuration), 2);
  const localFrame = frame % stepDuration;

  const currentStep = wizardSteps[currentStepIndex];

  // Animations
  const stepEntranceProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 80 },
  });

  // Fade out at scene end
  const fadeOutStart = durationInFrames - 20;
  const fadeOut = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Background */}
      <Starfield starCount={80} fadeIn={false} />

      {/* Accent glow based on current step */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 600,
          background: `radial-gradient(circle, ${currentStep.accentColor}12 0%, transparent 50%)`,
          filter: 'blur(80px)',
        }}
      />

      {/* Content - CENTERED LAYOUT */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 50,
        }}
      >
        {/* Top section - Step info */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          {/* Section label + Step indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: colors.slate400,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              How It Works
            </div>
            <div style={{ width: 1, height: 16, backgroundColor: colors.slate400 + '40' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              {wizardSteps.map((step, index) => (
                <div
                  key={step.number}
                  style={{
                    width: index === currentStepIndex ? 32 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: index <= currentStepIndex ? step.accentColor : `${colors.white}20`,
                    boxShadow: index === currentStepIndex ? `0 0 12px ${step.accentColor}60` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Step number + title */}
          <div
            style={{
              opacity: stepEntranceProgress,
              transform: `translateY(${interpolate(stepEntranceProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: currentStep.accentColor,
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}
            >
              STEP {currentStep.number}
            </div>
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: colors.white,
                letterSpacing: '-0.02em',
              }}
            >
              {currentStep.title}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: colors.slate400,
                marginTop: 8,
              }}
            >
              {currentStep.description}
            </div>
          </div>
        </div>

        {/* Screenshot - LARGE and CENTERED */}
        <div
          style={{
            opacity: stepEntranceProgress,
            transform: `translateY(${interpolate(stepEntranceProgress, [0, 1], [40, 0])}px) scale(${interpolate(stepEntranceProgress, [0, 1], [0.95, 1])})`,
          }}
        >
          <ScreenFrame
            src={staticFile(`screenshots/${currentStep.screenshot}`)}
            width={1200}
            height={650}
            animate="none"
            kenBurns
            kenBurnsIntensity={0.04}
            showFrame
            showGlow
            glowColor={currentStep.accentColor}
            borderRadius={12}
          />
        </div>
      </AbsoluteFill>

      {/* Step transition flash */}
      {localFrame < 6 && currentStepIndex > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: currentStep.accentColor,
            opacity: interpolate(localFrame, [0, 6], [0.15, 0]),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
