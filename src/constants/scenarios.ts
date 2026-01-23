export const SCENARIO_COLORS = {
    baseline: {
        border: 'border-white/10',
        glow: '',
        badge: 'bg-white/10 text-slate-400',
        barColor: '#94A3B8', // slate-400
    },
    upskill: {
        border: 'border-cosmic-500/50',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
        badge: 'bg-cosmic-500/20 text-cosmic-300',
        barColor: '#A855F7', // cosmic-500
    },
    'geo-arbitrage': {
        border: 'border-cyan-400/50',
        glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]',
        badge: 'bg-cyan-400/20 text-cyan-300',
        barColor: '#22D3EE', // cyan-400
    },
} as const;

export type ScenarioId = keyof typeof SCENARIO_COLORS;
