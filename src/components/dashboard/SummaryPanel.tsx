import type { RetirementPathsResponse } from '../../types/retirement';
import { motion } from 'framer-motion';
import { Rocket, AlertCircle, Calendar, Target } from 'lucide-react';

interface SummaryPanelProps {
    summary: RetirementPathsResponse['summary'];
}

const SummaryPanel = ({ summary }: SummaryPanelProps) => {
    const yearsFromNow = summary.earliestRetirementYear - new Date().getFullYear();

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-space-900 via-space-900 to-space-800 border border-white/10 rounded-3xl shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-cosmic-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />

            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-cosmic-500 via-cyan-400 to-cosmic-500" />

            <div className="relative z-10 p-8 md:p-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    {/* Left side - Main info */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <div className="w-8 h-8 rounded-lg bg-cosmic-500/20 flex items-center justify-center">
                                <Rocket className="w-4 h-4 text-cosmic-400" />
                            </div>
                            <span className="text-sm font-bold text-cosmic-400 uppercase tracking-widest">
                                Optimal Trajectory Found
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-6"
                        >
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-6xl md:text-8xl font-bold text-white tracking-tighter">
                                    {summary.earliestRetirementAge}
                                </span>
                                <span className="text-2xl text-slate-400 font-light">years old</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Year {summary.earliestRetirementYear}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                <span className="flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    {yearsFromNow} years from now
                                </span>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-300 max-w-2xl leading-relaxed"
                        >
                            {summary.headline}
                        </motion.p>
                    </div>

                    {/* Right side - Assumptions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-sm w-full"
                    >
                        <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-4">
                            <AlertCircle className="w-4 h-4" />
                            Simulation Assumptions
                        </h3>
                        <ul className="space-y-3">
                            {summary.caveats.map((caveat, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-start text-sm text-slate-300"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 mr-3 flex-shrink-0" />
                                    {caveat}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SummaryPanel;
