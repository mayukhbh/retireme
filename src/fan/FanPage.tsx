import { useEffect, useId, useState, type ReactNode } from 'react';
import '@fontsource-variable/bricolage-grotesque/index.css';
import './fan.css';
import { DEFAULT_ASSUMPTIONS, MARKET_RETURNS, annualSpending, lifestyleMultiplier, spendingToday, type Assumptions, type CostOfLiving, type Lever, type Profile, type RiskProfile } from './engine';
import { FanChart, type Overlay } from './FanChart';
import { money, moneyFull, years } from './format';
import { useSimulation } from './useSimulation';

const STORAGE_KEY = 'retireme-profile-v2';

const DEFAULT_PROFILE: Profile = {
  currentAge: 30,
  investableAssets: 25000,
  monthlySavings: 1000,
  annualIncome: 75000,
  lifestyleIntensity: 50,
  riskProfile: 'Balanced',
  costOfLiving: 'Medium',
};

const SCENARIO_COLORS = { upskill: '#2e5e9e', lowerCost: '#8a3b5c' } as const;

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable: use defaults */
  }
  return DEFAULT_PROFILE;
}

function Slider(props: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  hint?: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="fan-field">
      <div className="fan-field-row">
        <label htmlFor={id}>{props.label}</label>
        <output htmlFor={id}>{props.display}</output>
      </div>
      <input
        id={id}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
      {props.hint && <p className="fan-hint">{props.hint}</p>}
    </div>
  );
}

function Segmented<T extends string>(props: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; hint?: ReactNode }) {
  const name = useId();
  return (
    <fieldset className="fan-field fan-seg">
      <legend>{props.label}</legend>
      <div className="fan-seg-row">
        {props.options.map((o) => (
          <label key={o.value} className={props.value === o.value ? 'is-on' : undefined}>
            <input type="radio" name={name} value={o.value} checked={props.value === o.value} onChange={() => props.onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
      {props.hint && <p className="fan-hint">{props.hint}</p>}
    </fieldset>
  );
}

const spendLabel = (intensity: number) => {
  const pct = Math.round(lifestyleMultiplier(intensity) * 100);
  return pct === 100 ? 'Same as today' : `${pct}% of today`;
};

/** Find the slider position that gives a target spending multiplier. */
const intensityFor = (mult: number) => {
  const m = Math.max(0.7, Math.min(1.6, mult));
  return Math.round(m <= 1 ? ((m - 0.7) / 0.3) * 50 : 50 + ((m - 1) / 0.6) * 50);
};

export default function FanPage() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);
  const [shown, setShown] = useState<{ upskill: boolean; lowerCost: boolean }>({ upskill: false, lowerCost: false });
  const sims = useSimulation(profile, assumptions);
  const r = sims.baseline;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  }, [profile]);

  useEffect(() => {
    document.title = 'RetireMe: when can you stop working?';
  }, []);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setProfile((p) => ({ ...p, [k]: v }));

  const overlays: Overlay[] = [];
  if (shown.upskill) overlays.push({ id: 'upskill', label: 'Learn one advanced skill', color: SCENARIO_COLORS.upskill, result: sims.upskill });
  if (shown.lowerCost && profile.costOfLiving !== 'Low')
    overlays.push({ id: 'lowerCost', label: 'Move somewhere cheaper', color: SCENARIO_COLORS.lowerCost, result: sims.lowerCost });

  const spending = annualSpending(profile);
  const med = r.medianRetireAge;
  const by90 = r.retireBy90pct;
  const yearsAway = med !== null ? med - profile.currentAge : null;

  const headline =
    med === null
      ? `On this plan, most futures never reach enough by ${assumptions.maxAge}.`
      : yearsAway === 0
        ? 'You likely have enough to stop working now.'
        : `You can likely stop working at ${med}.`;
  const sub =
    med === null
      ? 'Try saving more or spending less once you stop. The list below shows what helps most.'
      : `That's the typical future, ${years(yearsAway!)} from now. ${
          by90 !== null ? `In 9 of 10 futures you can by ${by90}.` : `1 in 10 futures still falls short at ${assumptions.maxAge}.`
        }`;

  const applyLever = (l: Lever) => {
    if (l.id === 'save500') set('monthlySavings', profile.monthlySavings + 500);
    if (l.id === 'spendLess') set('lifestyleIntensity', intensityFor(lifestyleMultiplier(profile.lifestyleIntensity) * 0.9));
    if (l.id === 'moreGrowth') set('riskProfile', 'Aggressive');
    if (l.id === 'upskill') setShown((s) => ({ ...s, upskill: true }));
    if (l.id === 'moveCheaper') setShown((s) => ({ ...s, lowerCost: true }));
  };
  const leverAction = (l: Lever) => (l.id === 'upskill' || l.id === 'moveCheaper' ? 'Show on chart' : 'Apply');
  const maxGain = Math.max(1, ...r.levers.map((l) => l.yearsGained));

  return (
    <div className="fan">
      <header className="fan-top">
        <span className="fan-brand">RetireMe</span>
        <a href="#assumptions" className="fan-link">
          How the math works
        </a>
      </header>

      <div className="fan-layout">
        <section className="fan-result" aria-labelledby="fan-headline">
          <h1 id="fan-headline" className="fan-headline">
            {headline}
          </h1>
          <p className="fan-sub">
            {sub} This assumes you spend {moneyFull(spending)} a year in today&apos;s dollars once you stop.
          </p>

          <div className="fan-scenarios" role="group" aria-label="Compare with">
            <span className="fan-scenarios-label">Compare with</span>
            <button
              type="button"
              className="fan-chip"
              aria-pressed={shown.upskill}
              onClick={() => setShown((s) => ({ ...s, upskill: !s.upskill }))}
              style={{ ['--chip' as string]: SCENARIO_COLORS.upskill }}
            >
              <i aria-hidden="true" />
              Learn one advanced skill
              {shown.upskill && sims.upskill.medianRetireAge !== null && <b>{sims.upskill.medianRetireAge}</b>}
            </button>
            <button
              type="button"
              className="fan-chip"
              aria-pressed={shown.lowerCost}
              disabled={profile.costOfLiving === 'Low'}
              onClick={() => setShown((s) => ({ ...s, lowerCost: !s.lowerCost }))}
              style={{ ['--chip' as string]: SCENARIO_COLORS.lowerCost }}
            >
              <i aria-hidden="true" />
              Move somewhere cheaper
              {shown.lowerCost && sims.lowerCost.medianRetireAge !== null && <b>{sims.lowerCost.medianRetireAge}</b>}
            </button>
          </div>

          <div className={`fan-chartwrap${sims.stale ? ' is-stale' : ''}`}>
            <FanChart result={r} overlays={overlays} />
            <div className="fan-key" aria-hidden="true">
              <span><i className="k-median" />Typical future</span>
              <span><i className="k-inner" />Half of futures</span>
              <span><i className="k-outer" />8 in 10 futures</span>
              <span><i className="k-enough" />Enough to stop working</span>
            </div>
          </div>


        </section>

          <section className="fan-levers" aria-labelledby="fan-levers-title">
          <h2 id="fan-levers-title">What would change this most</h2>
          <p className="fan-levers-sub">Each change on its own, measured against the typical future.</p>
          <ol>
            {r.levers.map((l) => (
              <li key={l.id} className={l.yearsGained === 0 ? 'is-none' : undefined}>
                <span className="fan-lever-label">{l.label}</span>
                <span className="fan-lever-bar" aria-hidden="true">
                  <span style={{ width: `${(l.yearsGained / maxGain) * 100}%` }} />
                </span>
                <span className="fan-lever-gain">{l.yearsGained === 0 ? 'No change' : `${years(l.yearsGained)} sooner`}</span>
                {l.yearsGained > 0 && (
                  <button type="button" className="fan-lever-btn" onClick={() => applyLever(l)}>
                    {leverAction(l)}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </section>

        <aside className="fan-inputs" aria-label="Your numbers">
          <h2 className="fan-inputs-title">Your numbers</h2>
          <Slider label="Age" value={profile.currentAge} display={String(profile.currentAge)} min={18} max={70} step={1} onChange={(v) => set('currentAge', v)} />
          <Slider
            label="Saved and invested"
            value={profile.investableAssets}
            display={moneyFull(profile.investableAssets)}
            min={0}
            max={2_000_000}
            step={5000}
            onChange={(v) => set('investableAssets', v)}
          />
          <Slider
            label="Income a year"
            value={profile.annualIncome}
            display={moneyFull(profile.annualIncome)}
            min={20000}
            max={400000}
            step={1000}
            onChange={(v) => set('annualIncome', v)}
          />
          <Slider
            label="Saving a month"
            value={profile.monthlySavings}
            display={moneyFull(profile.monthlySavings)}
            min={0}
            max={10000}
            step={50}
            hint={`You spend about ${money(spendingToday(profile))} a year today.`}
            onChange={(v) => set('monthlySavings', v)}
          />
          <Slider
            label="Spending once you stop"
            value={profile.lifestyleIntensity}
            display={spendLabel(profile.lifestyleIntensity)}
            min={0}
            max={100}
            step={1}
            onChange={(v) => set('lifestyleIntensity', v)}
          />
          <Segmented<RiskProfile>
            label="How you invest"
            value={profile.riskProfile}
            options={[
              { value: 'Conservative', label: 'Steady' },
              { value: 'Balanced', label: 'Balanced' },
              { value: 'Aggressive', label: 'Growth' },
            ]}
            hint={`Average ${Math.round(MARKET_RETURNS[profile.riskProfile].mean * 100)}% a year before inflation, with bigger swings toward Growth.`}
            onChange={(v) => set('riskProfile', v)}
          />
          <Segmented<CostOfLiving>
            label="Cost of living where you are"
            value={profile.costOfLiving}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ]}
            hint="Used to estimate what moving somewhere cheaper would save."
            onChange={(v) => set('costOfLiving', v)}
          />
          <button type="button" className="fan-reset" onClick={() => setProfile(DEFAULT_PROFILE)}>
            Reset to example numbers
          </button>
        </aside>
      </div>

      <section className="fan-assume" id="assumptions" aria-labelledby="fan-assume-title">
        <h2 id="fan-assume-title">How the math works</h2>
        <div className="fan-assume-grid">
          <div>
            <p>
              We play out {assumptions.paths.toLocaleString('en-US')} possible futures for your savings, each with its own run of good
              and bad market years. Everything is in today&apos;s dollars, so a number later on buys what it would buy now.
            </p>
            <p>
              You have enough to stop working once your savings could pay your yearly spending at a{' '}
              {(assumptions.withdrawalRate * 100).toFixed(1)}% withdrawal rate. From age {assumptions.socialSecurityAge}, Social
              Security covers part of that spending, so you need less.
            </p>
            <p className="fan-hint">This is a planning sketch, not financial advice.</p>
          </div>
          <div className="fan-assume-controls">
            <Segmented<string>
              label="Withdrawal rate"
              value={String(assumptions.withdrawalRate)}
              options={[
                { value: '0.035', label: '3.5%' },
                { value: '0.04', label: '4%' },
                { value: '0.045', label: '4.5%' },
              ]}
              hint="Lower is more cautious and needs more saved."
              onChange={(v) => setAssumptions((a) => ({ ...a, withdrawalRate: Number(v) }))}
            />
            <label className="fan-check">
              <input
                type="checkbox"
                checked={assumptions.includeSocialSecurity}
                onChange={(e) => setAssumptions((a) => ({ ...a, includeSocialSecurity: e.target.checked }))}
              />
              Count Social Security from age {assumptions.socialSecurityAge}, at about{' '}
              {Math.round(assumptions.socialSecurityShareOfIncome * 100)}% of your income
            </label>
            <dl className="fan-facts">
              <div><dt>Inflation</dt><dd>{Math.round(assumptions.inflation * 100)}% a year</dd></div>
              <div><dt>Steady returns</dt><dd>5% average, 6% swings</dd></div>
              <div><dt>Balanced returns</dt><dd>7% average, 12% swings</dd></div>
              <div><dt>Growth returns</dt><dd>9% average, 18% swings</dd></div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
