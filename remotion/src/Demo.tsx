import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import {
  IntroScene,
  ProblemScene,
  HeroScene,
  WizardScene,
  ResultsScene,
  CtaScene,
} from './scenes';
import './styles/global.css';

// Scene durations in seconds (converted to frames in component)
const SCENE_DURATIONS = {
  intro: 8,      // 240 frames
  problem: 8,    // 240 frames
  hero: 12,      // 360 frames
  wizard: 22,    // 660 frames
  results: 15,   // 450 frames
  cta: 10,       // 300 frames
} as const;

// Transition duration in frames
const TRANSITION_DURATION = 20;

export const Demo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Convert seconds to frames
  const sceneDurations = {
    intro: SCENE_DURATIONS.intro * fps,
    problem: SCENE_DURATIONS.problem * fps,
    hero: SCENE_DURATIONS.hero * fps,
    wizard: SCENE_DURATIONS.wizard * fps,
    results: SCENE_DURATIONS.results * fps,
    cta: SCENE_DURATIONS.cta * fps,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#020616' }}>
      <TransitionSeries>
        {/* Scene 1: Intro Hook */}
        <TransitionSeries.Sequence durationInFrames={sceneDurations.intro}>
          <IntroScene durationInFrames={sceneDurations.intro} />
        </TransitionSeries.Sequence>

        {/* Transition: Fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 2: Problem Statement */}
        <TransitionSeries.Sequence durationInFrames={sceneDurations.problem}>
          <ProblemScene durationInFrames={sceneDurations.problem} />
        </TransitionSeries.Sequence>

        {/* Transition: Fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 3: Hero / Landing Page Reveal */}
        <TransitionSeries.Sequence durationInFrames={sceneDurations.hero}>
          <HeroScene durationInFrames={sceneDurations.hero} />
        </TransitionSeries.Sequence>

        {/* Transition: Slide from right */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 4: Wizard Walkthrough */}
        <TransitionSeries.Sequence durationInFrames={sceneDurations.wizard}>
          <WizardScene durationInFrames={sceneDurations.wizard} />
        </TransitionSeries.Sequence>

        {/* Transition: Fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 5: Results Dashboard */}
        <TransitionSeries.Sequence durationInFrames={sceneDurations.results}>
          <ResultsScene durationInFrames={sceneDurations.results} />
        </TransitionSeries.Sequence>

        {/* Transition: Fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 6: CTA Outro */}
        <TransitionSeries.Sequence durationInFrames={sceneDurations.cta}>
          <CtaScene durationInFrames={sceneDurations.cta} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
