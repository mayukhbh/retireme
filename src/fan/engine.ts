// Stand-in simulation engine for the new UI.
//
// This file follows the contract in docs/CONTRACT.md so the interface can be built and
// reviewed before the full TypeScript engine port lands in src/engine/. When it does,
// change the import in src/fan/useSimulation.ts to point there and delete this file.
//
// Model (all in today's dollars, so inflation is never counted twice):
// - Each year the portfolio grows by a real return drawn from the risk profile, then the
//   year's savings are added.
// - "Enough" is annual spending divided by the withdrawal rate. From the Social Security
//   age it drops by the real benefit divided by the withdrawal rate. It never resets.
// - A path can retire in the first year its portfolio reaches "enough".

export type RiskProfile = 'Conservative' | 'Balanced' | 'Aggressive';
export type CostOfLiving = 'Low' | 'Medium' | 'High';

export interface Profile {
  currentAge: number;
  investableAssets: number;
  monthlySavings: number;
  annualIncome: number;
  lifestyleIntensity: number; // retirement spending vs today: 0 = 70%, 50 = same, 100 = 160%
  riskProfile: RiskProfile;
  costOfLiving: CostOfLiving;
}

export interface Assumptions {
  withdrawalRate: number;
  includeSocialSecurity: boolean;
  socialSecurityAge: number;
  socialSecurityShareOfIncome: number;
  inflation: number;
  paths: number;
  seed: number;
  maxAge: number;
}

export type Scenario = 'baseline' | 'upskill' | 'lowerCost';

export interface Lever {
  id: 'save500' | 'spendLess' | 'moveCheaper' | 'upskill' | 'moreGrowth';
  label: string;
  yearsGained: number;
}

export interface SimResult {
  ages: number[];
  p10: number[];
  p25: number[];
  p50: number[];
  p75: number[];
  p90: number[];
  threshold: number[];
  medianRetireAge: number | null;
  retireBy90pct: number | null;
  annualSpending: number;
  levers: Lever[];
}

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  withdrawalRate: 0.04,
  includeSocialSecurity: true,
  socialSecurityAge: 67,
  socialSecurityShareOfIncome: 0.3,
  inflation: 0.03,
  paths: 2000,
  seed: 20261108,
  maxAge: 85,
};

// Nominal market returns by risk profile, as in the original engine settings.
export const MARKET_RETURNS: Record<RiskProfile, { mean: number; std: number }> = {
  Conservative: { mean: 0.05, std: 0.06 },
  Balanced: { mean: 0.07, std: 0.12 },
  Aggressive: { mean: 0.09, std: 0.18 },
};

const GEO_SAVINGS: Record<CostOfLiving, number> = { Low: 0.45, Medium: 0.25, High: 0 };
const UPSKILL_INCOME = 0.12; // one advanced skill, as in the original engine

// 0 -> 0.7, 50 -> 1.0, 100 -> 1.6. The original engine used 0.7 + 0.9 * t, which made the
// midpoint 1.15 and let spending plus savings exceed income.
export const lifestyleMultiplier = (intensity: number) =>
  intensity <= 50 ? 0.7 + 0.3 * (intensity / 50) : 1 + 0.6 * ((intensity - 50) / 50);

/** Today's spending is what is left of income after saving. */
export function spendingToday(p: Profile): number {
  const base = p.annualIncome - p.monthlySavings * 12;
  return base > 0 ? base : p.annualIncome * 0.5;
}

/** What you plan to spend each year once you stop working, in today's dollars. */
export function annualSpending(p: Profile): number {
  return spendingToday(p) * lifestyleMultiplier(p.lifestyleIntensity);
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(next: () => number) {
  let u = 0;
  while (u === 0) u = next();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * next());
}

const quantile = (sorted: number[], q: number) => {
  const i = (sorted.length - 1) * q;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
};

interface Inputs {
  age: number;
  assets: number;
  yearlySavings: number;
  spending: number;
  income: number;
  risk: RiskProfile;
}

function run(inp: Inputs, a: Assumptions, keepSeries: boolean) {
  const years = Math.max(1, a.maxAge - inp.age);
  const { mean, std } = MARKET_RETURNS[inp.risk];
  const realMean = (1 + mean) / (1 + a.inflation) - 1;
  const ss = a.includeSocialSecurity ? inp.income * a.socialSecurityShareOfIncome : 0;
  const threshold: number[] = [];
  for (let y = 0; y <= years; y++) {
    const age = inp.age + y;
    const offset = age >= a.socialSecurityAge ? Math.min(ss, inp.spending) : 0;
    threshold.push((inp.spending - offset) / a.withdrawalRate);
  }

  const next = rng(a.seed);
  const series: Float64Array[] = keepSeries ? Array.from({ length: years + 1 }, () => new Float64Array(a.paths)) : [];
  const retireAges: number[] = [];

  for (let p = 0; p < a.paths; p++) {
    let v = inp.assets;
    let retired: number | null = v >= threshold[0] ? inp.age : null;
    if (keepSeries) series[0][p] = v;
    for (let y = 1; y <= years; y++) {
      const r = realMean + std * gauss(next);
      v = Math.max(0, v * (1 + r) + inp.yearlySavings);
      if (keepSeries) series[y][p] = v;
      if (retired === null && v >= threshold[y]) {
        retired = inp.age + y;
        if (!keepSeries) break;
      }
    }
    retireAges.push(retired ?? Infinity);
  }

  retireAges.sort((x, y) => x - y);
  const ageAt = (q: number) => {
    const v = retireAges[Math.min(retireAges.length - 1, Math.ceil(retireAges.length * q) - 1)];
    return Number.isFinite(v) ? v : null;
  };
  return { threshold, series, median: ageAt(0.5), by90: ageAt(0.9) };
}

function inputsFor(p: Profile, scenario: Scenario): Inputs {
  let spending = annualSpending(p);
  let yearlySavings = p.monthlySavings * 12;
  let income = p.annualIncome;
  if (scenario === 'upskill') {
    const extra = income * UPSKILL_INCOME;
    income += extra;
    yearlySavings += extra * 0.5; // assume half of a raise is saved
  }
  if (scenario === 'lowerCost') {
    const cut = (GEO_SAVINGS.Low - GEO_SAVINGS[p.costOfLiving]) / (1 - GEO_SAVINGS[p.costOfLiving]);
    const saved = spending * cut;
    spending -= saved;
    yearlySavings += saved;
  }
  return { age: p.currentAge, assets: p.investableAssets, yearlySavings, spending, income, risk: p.riskProfile };
}

export function simulate(profile: Profile, assumptions: Assumptions = DEFAULT_ASSUMPTIONS, scenario: Scenario = 'baseline'): SimResult {
  const inp = inputsFor(profile, scenario);
  const main = run(inp, assumptions, true);

  const ages = main.threshold.map((_, y) => profile.currentAge + y);
  const sorted = main.series.map((col) => {
    const c = Float64Array.from(col);
    c.sort();
    return c as unknown as number[];
  });
  const pct = (q: number) => sorted.map((col) => quantile(col, q));

  // Levers compare medians on a smaller sample with the same seed, so they stay fast and
  // consistent with each other.
  const leverAssumptions = { ...assumptions, paths: Math.min(assumptions.paths, 800) };
  const base = run(inp, leverAssumptions, false).median;
  const gain = (alt: Inputs) => {
    const m = run(alt, leverAssumptions, false).median;
    if (base === null) return m === null ? 0 : assumptions.maxAge - m;
    if (m === null) return 0;
    return Math.max(0, base - m);
  };

  const levers: Lever[] = [
    { id: 'save500', label: 'Save $500 more a month', yearsGained: gain({ ...inp, yearlySavings: inp.yearlySavings + 6000 }) },
    {
      id: 'spendLess',
      label: 'Spend 10% less',
      yearsGained: gain({ ...inp, spending: inp.spending * 0.9, yearlySavings: inp.yearlySavings + inp.spending * 0.1 }),
    },
    { id: 'moveCheaper', label: 'Move somewhere cheaper', yearsGained: profile.costOfLiving === 'Low' ? 0 : gain(inputsFor(profile, 'lowerCost')) },
    { id: 'upskill', label: 'Learn one advanced skill', yearsGained: gain(inputsFor(profile, 'upskill')) },
    { id: 'moreGrowth', label: 'Invest for more growth', yearsGained: profile.riskProfile === 'Aggressive' ? 0 : gain({ ...inp, risk: 'Aggressive' }) },
  ].sort((a, b) => b.yearsGained - a.yearsGained) as Lever[];

  return {
    ages,
    p10: pct(0.1),
    p25: pct(0.25),
    p50: pct(0.5),
    p75: pct(0.75),
    p90: pct(0.9),
    threshold: main.threshold,
    medianRetireAge: main.median,
    retireBy90pct: main.by90,
    annualSpending: inp.spending,
    levers,
  };
}
