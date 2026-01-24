import { useState } from 'react';
import type { RetirementScenario } from '../../types/retirement';
import { ChevronDown, Target, TrendingUp, Sparkles, Globe, BarChart3, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioCardProps {
    scenario: RetirementScenario;
    rank?: number;
}

const ScenarioCard = ({ scenario, rank = 0 }: ScenarioCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getScenarioConfig = () => {
        if (scenario.id === 'upskill') {
            return {
                borderColor: 'border-cosmic-500/40',
                glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
                hoverGlow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]',
                badgeBg: 'bg-cosmic-500/15',
                badgeText: 'text-cosmic-300',
                badgeBorder: 'border-cosmic-500/30',
                accentColor: '#A855F7',
                icon: Sparkles
            };
        }
        if (scenario.id === 'geo-arbitrage') {
            return {
                borderColor: 'border-cyan-400/40',
                glowColor: 'shadow-[0_0_30px_rgba(34,211,238,0.15)]',
                hoverGlow: 'hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]',
                badgeBg: 'bg-cyan-400/15',
                badgeText: 'text-cyan-300',
                badgeBorder: 'border-cyan-400/30',
                accentColor: '#22D3EE',
                icon: Globe
            };
        }
        return {
            borderColor: 'border-white/10',
            glowColor: '',
            hoverGlow: 'hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]',
            badgeBg: 'bg-white/10',
            badgeText: 'text-slate-300',
            badgeBorder: 'border-white/10',
            accentColor: '#94A3B8',
            icon: BarChart3
        };
    };

    const config = getScenarioConfig();
    const Icon = config.icon;
    const isBestOption = rank === 0;

    // Format probability as a visual bar
    const probPercent = Math.min(scenario.probabilityScore, 100);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`relative bg-space-900/60 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-300 ${config.borderColor} ${config.glowColor} ${config.hoverGlow}`}
        >
            {/* Best option badge */}
            {isBestOption && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cosmic-500 via-cyan-400 to-cosmic-500" />
            )}

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${config.badgeBg} border ${config.badgeBorder} flex items-center justify-center`}>
                            <Icon className={`h-5 w-5 ${config.badgeText}`} />
                        </div>
                        <div>
                            <span className={`text-sm font-semibold ${config.badgeText}`}>
                                {scenario.label}
                            </span>
                            {isBestOption && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    Best
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white tracking-tight">
                            {scenario.targetRetirementAge}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">years old</div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {scenario.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <Target className="h-3.5 w-3.5" />
                            Monthly Savings
                        </div>
                        <div className="text-lg font-semibold text-white">
                            ${scenario.requiredMonthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Success Rate
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-lg font-semibold text-white">{scenario.probabilityScore}%</div>
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: config.accentColor }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${probPercent}%` }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Actions */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Key Actions</h4>
                    {scenario.keyActions.slice(0, 3).map((action, idx) => (
                        <div key={idx} className="flex items-start text-sm text-slate-300 gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: config.accentColor }} />
                            <span>{action}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Toggle */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 border-t border-white/5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
            >
                {isExpanded ? 'Hide Timeline' : 'View Timeline'}
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.div>
            </motion.button>

            {/* Expanded Timeline */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-black/30"
                    >
                        <div className="p-6 border-t border-white/5 space-y-5">
                            {scenario.timeline.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative pl-6"
                                >
                                    {/* Timeline line */}
                                    {idx < scenario.timeline.length - 1 && (
                                        <div className="absolute left-[5px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-white/20 to-transparent" />
                                    )}
                                    {/* Timeline dot */}
                                    <div
                                        className="absolute left-0 top-1 w-3 h-3 rounded-full border-2"
                                        style={{ borderColor: config.accentColor, backgroundColor: '#020616' }}
                                    />
                                    <h5 className="text-sm font-semibold text-white mb-2">{item.period}</h5>
                                    <ul className="space-y-1.5">
                                        {item.actions.map((action, actionIdx) => (
                                            <li key={actionIdx} className="text-sm text-slate-400 leading-relaxed flex items-start gap-2">
                                                <span className="text-slate-600">•</span>
                                                {action}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ScenarioCard;
