import { Composition, Folder } from 'remotion';
import { Demo } from './Demo';
import './styles/global.css';

// Video configuration
export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

// Scene durations in frames (at 30fps)
const SCENE_FRAMES = {
  intro: 8 * 30,      // 240 frames
  problem: 8 * 30,    // 240 frames
  hero: 12 * 30,      // 360 frames
  wizard: 22 * 30,    // 660 frames
  results: 15 * 30,   // 450 frames
  cta: 10 * 30,       // 300 frames
};

// Transition duration
const TRANSITION_FRAMES = 20;
const NUM_TRANSITIONS = 5;

// Calculate total duration (scenes minus transition overlaps)
const TOTAL_SCENE_FRAMES = Object.values(SCENE_FRAMES).reduce((a, b) => a + b, 0);
const TOTAL_DURATION_FRAMES = TOTAL_SCENE_FRAMES - (NUM_TRANSITIONS * TRANSITION_FRAMES);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="RetireMe">
        <Composition
          id="Demo"
          component={Demo}
          durationInFrames={TOTAL_DURATION_FRAMES}
          fps={VIDEO_CONFIG.fps}
          width={VIDEO_CONFIG.width}
          height={VIDEO_CONFIG.height}
          defaultProps={{}}
        />
      </Folder>
    </>
  );
};
