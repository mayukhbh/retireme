import { useDeferredValue, useMemo } from 'react';
// Swap this import for the full engine in src/engine/ when it lands. Same contract.
import { simulate, type Assumptions, type Profile, type SimResult } from './engine';

export interface Simulations {
  baseline: SimResult;
  upskill: SimResult;
  lowerCost: SimResult;
  /** True while the chart is catching up with the latest input. */
  stale: boolean;
}

export function useSimulation(profile: Profile, assumptions: Assumptions): Simulations {
  // Deferring keeps sliders responsive; the chart follows a frame or two behind.
  const p = useDeferredValue(profile);
  const a = useDeferredValue(assumptions);
  const baseline = useMemo(() => simulate(p, a, 'baseline'), [p, a]);
  const upskill = useMemo(() => simulate(p, a, 'upskill'), [p, a]);
  const lowerCost = useMemo(() => simulate(p, a, 'lowerCost'), [p, a]);
  return { baseline, upskill, lowerCost, stale: p !== profile || a !== assumptions };
}
