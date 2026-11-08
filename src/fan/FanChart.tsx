import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { SimResult } from './engine';
import { money } from './format';

export interface Overlay {
  id: string;
  label: string;
  color: string;
  result: SimResult;
}

interface Props {
  result: SimResult;
  overlays: Overlay[];
}

const M = { l: 58, r: 20, t: 20, b: 40 };

function niceCeil(v: number): number {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

export function FanChart({ result, overlays }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [scrub, setScrub] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(300, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const narrow = width < 560;
  const height = narrow ? 320 : Math.min(480, Math.max(340, Math.round(width * 0.52)));

  const { ages, threshold } = result;
  const startAge = ages[0];
  const focus = result.retireBy90pct ?? result.medianRetireAge ?? 80;
  const endAge = Math.min(ages[ages.length - 1], Math.max(startAge + 20, Math.ceil((focus + 6) / 5) * 5));
  const n = endAge - startAge + 1;

  const yMax = useMemo(() => niceCeil(threshold[0] * 2), [threshold]);
  const x = (age: number) => M.l + ((age - startAge) / (endAge - startAge)) * (width - M.l - M.r);
  const y = (v: number) => M.t + (1 - Math.min(v, yMax * 1.2) / yMax) * (height - M.t - M.b);

  const slice = <T,>(arr: T[]) => arr.slice(0, n);
  const line = (vals: number[]) => slice(vals).map((v, i) => `${i ? 'L' : 'M'}${x(startAge + i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const band = (lo: number[], hi: number[]) => {
    const top = slice(hi).map((v, i) => `${i ? 'L' : 'M'}${x(startAge + i).toFixed(1)},${y(v).toFixed(1)}`).join('');
    const bottom = slice(lo)
      .map((v, i) => [x(startAge + i), y(v)] as const)
      .reverse()
      .map(([px, py]) => `L${px.toFixed(1)},${py.toFixed(1)}`)
      .join('');
    return `${top}${bottom}Z`;
  };
  // "Enough" steps down at Social Security age, so draw it as a step line.
  const stepPath = (vals: number[]) =>
    slice(vals)
      .map((v, i) => {
        const age = startAge + i;
        if (i === 0) return `M${x(age)},${y(v)}`;
        return `H${x(age)}V${y(v)}`;
      })
      .join('');
  const stepLine = stepPath(threshold);
  const sameLine = (a: number[]) => a.every((v, i) => i >= n || Math.abs(v - threshold[i]) < 1);
  const ssIndex = slice(threshold).findIndex((v, i) => i > 0 && v < threshold[i - 1] - 1);

  const yTicks = Array.from({ length: 5 }, (_, i) => (yMax / 4) * i);
  const xTicks: number[] = [];
  const xStep = narrow ? 10 : 5;
  for (let a = Math.ceil(startAge / xStep) * xStep; a <= endAge; a += xStep) xTicks.push(a);

  const thrAt = (age: number) => threshold[Math.min(threshold.length - 1, age - startAge)];
  const med = result.medianRetireAge;
  const by90 = result.retireBy90pct;
  const markers: { age: number; label: string; kind: 'median' | 'p90' }[] = [];
  if (med !== null && med <= endAge) markers.push({ age: med, label: `Half of futures: ${med}`, kind: 'median' });
  if (by90 !== null && by90 <= endAge) markers.push({ age: by90, label: `9 in 10: ${by90}`, kind: 'p90' });

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * width;
    const age = Math.round(startAge + ((px - M.l) / (width - M.l - M.r)) * (endAge - startAge));
    setScrub(Math.max(startAge, Math.min(endAge, age)));
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    const cur = scrub ?? med ?? startAge;
    if (e.key === 'ArrowRight') setScrub(Math.min(endAge, cur + 1));
    else if (e.key === 'ArrowLeft') setScrub(Math.max(startAge, cur - 1));
    else if (e.key === 'Escape') setScrub(null);
    else return;
    e.preventDefault();
  };

  const s = scrub !== null ? scrub - startAge : null;
  const readout =
    s !== null
      ? {
          age: scrub!,
          mid: result.p50[s],
          lo: result.p10[s],
          hi: result.p90[s],
          enough: threshold[s],
        }
      : null;

  const summary = `Portfolio by age from ${startAge} to ${endAge}. ${
    med !== null ? `Half of futures reach enough by ${med}.` : 'The typical future does not reach enough by 85.'
  } ${by90 !== null ? `Nine in ten by ${by90}.` : ''}`;

  return (
    <div className="fan-chart" ref={wrapRef}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={summary}
        tabIndex={0}
        onPointerMove={onMove}
        onPointerLeave={() => setScrub(null)}
        onKeyDown={onKey}
        onBlur={() => setScrub(null)}
      >
        <defs>
          <clipPath id="fan-clip">
            <rect x={M.l} y={M.t - 2} width={width - M.l - M.r} height={height - M.t - M.b + 2} />
          </clipPath>
          <linearGradient id="fan-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f7f2" stopOpacity="1" />
            <stop offset="1" stopColor="#f4f7f2" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Graph paper */}
        <g className="fan-grid">
          {Array.from({ length: endAge - startAge + 1 }, (_, i) => startAge + i).map((a) => (
            <line key={`v${a}`} x1={x(a)} x2={x(a)} y1={M.t} y2={height - M.b} className={a % 5 === 0 ? 'major' : 'minor'} />
          ))}
          {Array.from({ length: 21 }, (_, i) => (yMax / 20) * i).map((v, i) => (
            <line key={`h${i}`} x1={M.l} x2={width - M.r} y1={y(v)} y2={y(v)} className={i % 5 === 0 ? 'major' : 'minor'} />
          ))}
        </g>

        <g clipPath="url(#fan-clip)">
          <path d={band(result.p10, result.p90)} className="fan-outer" />
          <path d={band(result.p25, result.p75)} className="fan-inner" />
          <rect x={M.l} y={M.t - 2} width={width - M.l - M.r} height={18} fill="url(#fan-fade)" />
          {overlays.map((o) => (
            <g key={o.id}>
              {!sameLine(o.result.threshold) && (
                <path d={stepPath(o.result.threshold)} fill="none" stroke={o.color} strokeWidth="1.5" opacity="0.8" />
              )}
              <path d={line(o.result.p50)} fill="none" stroke={o.color} strokeWidth="2" strokeDasharray="6 4" />
            </g>
          ))}
          <path d={line(result.p50)} className="fan-median" />
          <path d={stepLine} className="fan-enough" />
        </g>

        {/* Axes */}
        {yTicks.map((v) => (
          <text key={v} x={M.l - 10} y={y(v) + 4} textAnchor="end" className="fan-tick">
            {money(v)}
          </text>
        ))}
        {xTicks.map((a) => (
          <text key={a} x={x(a)} y={height - M.b + 22} textAnchor="middle" className="fan-tick">
            {a === xTicks[0] ? `Age ${a}` : a}
          </text>
        ))}

        {/* Labels on the chart itself */}
        <text x={M.l + 8} y={y(threshold[0]) - 10} className="fan-enough-label">
          Enough to stop working
        </text>
        {ssIndex > 0 && !narrow && (
          <text x={x(startAge + ssIndex) + 6} y={y(threshold[ssIndex]) + 18} className="fan-note">
            Social Security begins
          </text>
        )}
        {overlays.map((o) => {
          const age = o.result.medianRetireAge;
          if (age === null || age > endAge) return null;
          return (
            <g key={`m-${o.id}`}>
              <circle cx={x(age)} cy={y(o.result.threshold[age - startAge])} r="5" fill={o.color} stroke="#f4f7f2" strokeWidth="2" />
            </g>
          );
        })}
        {markers.map((m, i) => {
          const cx = x(m.age);
          const cy = y(thrAt(m.age));
          const other = markers[1 - i];
          const crowded = other && Math.abs(x(other.age) - cx) < 120;
          const above = m.kind === 'median' || !crowded;
          const ly = above ? cy - 16 - (crowded && m.kind === 'median' ? 18 : 0) : cy + 26;
          const anchor = cx > width - 140 ? 'end' : cx < M.l + 80 ? 'start' : 'middle';
          return (
            <g key={m.kind}>
              <line x1={cx} x2={cx} y1={cy} y2={height - M.b} className="fan-drop" />
              <circle cx={cx} cy={cy} r={m.kind === 'median' ? 6 : 5.5} className={`fan-dot ${m.kind}`} />
              <text x={cx} y={ly} textAnchor={anchor} className={`fan-mark ${m.kind}`}>
                {m.label}
              </text>
            </g>
          );
        })}

        {readout && (
          <g pointerEvents="none">
            <line x1={x(readout.age)} x2={x(readout.age)} y1={M.t} y2={height - M.b} className="fan-scrub" />
            <circle cx={x(readout.age)} cy={y(readout.mid)} r="4" fill="#16302b" />
          </g>
        )}
      </svg>

      <p className="fan-readout" aria-live="polite">
        {readout ? (
          <>
            At <strong>{readout.age}</strong>, a typical future holds <strong>{money(readout.mid)}</strong>, with most
            between {money(readout.lo)} and {money(readout.hi)}. Enough is {money(readout.enough)}.
          </>
        ) : (
          <>Move across the chart to read any age.</>
        )}
      </p>
    </div>
  );
}
