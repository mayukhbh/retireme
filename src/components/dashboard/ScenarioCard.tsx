import { useState } from 'react';
import type { RetirementScenario } from '../../types/retirement';
import { ChevronDown, ChevronUp, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioCardProps {
    scenario: RetirementScenario;
}

const ScenarioCard = ({ scenario }: ScenarioCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getBorderColor = () => {
        if (scenario.id === 'upskill') return 'border-cosmic-500/50';
        if (scenario.id === 'geo-arbitrage') return 'border-cyan-400/50';
        return 'border-white/10';
    };

    const getGlowColor = () => {
        if (scenario.id === 'upskill') return 'shadow-[0_0_20px_rgba(168,85,247,0.2)]';
        if (scenario.id === 'geo-arbitrage') return 'shadow-[0_0_20px_rgba(34,211,238,0.2)]';
        return '';
    };

    return (
        <div
            className={`relative bg-space-900/50 backdrop-blur-md border rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${getBorderColor()} ${getGlowColor()}`}
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${scenario.id === 'upskill' ? 'bg-cosmic-500/20 text-cosmic-300' :
                            scenario.id === 'geo-arbitrage' ? 'bg-cyan-400/20 text-cyan-300' :
                                'bg-white/10 text-slate-400'
                        }`}>
                        {scenario.label}
                    </span>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">Age {scenario.targetRetirementAge}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Target</div>
                    </div>
                </div>

                <p className="text-slate-400 text-sm mb-6 min-h-[40px] leading-relaxed">
                    {scenario.description}
                </p>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-300">
                        <Target className="h-4 w-4 mr-3 text-slate-500" />
                        <span>Save <span className="text-white font-semibold">${scenario.requiredMonthlySavings.toLocaleString()}</span> / month</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                        <TrendingUp className="h-4 w-4 mr-3 text-slate-500" />
                        <span>{scenario.probabilityScore}% Success Probability</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Actions</h4>
                    {scenario.keyActions.slice(0, 2).map((action, idx) => (
                        <div key={idx} className="flex items-start text-sm text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 mr-2 flex-shrink-0" />
                            {action}
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border-t border-white/5 flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-widest transition-colors"
            >
                {isExpanded ? 'Hide Details' : 'View Timeline'}
                {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/20"
                    >
                        <div className="p-6 border-t border-white/5 space-y-6">
                            {scenario.timeline.map((item, idx) => (
                                <div key={idx} className="relative pl-6 border-l border-white/10">
                                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-space-950 border border-slate-500" />
                                    <h5 className="text-sm font-bold text-white mb-2">{item.period}</h5>
                                    <ul className="space-y-1">
                                        {item.actions.map((action, actionIdx) => (
                                            <li key={actionIdx} className="text-sm text-slate-400 leading-relaxed">
                                                {action}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScenarioCard;
