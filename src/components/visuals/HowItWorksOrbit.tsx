import { motion } from 'framer-motion';
import { Crosshair, Zap, GitCompare, Rocket } from 'lucide-react';

const phases = [
    {
        id: 1,
        title: 'Input',
        desc: 'Map your current financial coordinates.',
        icon: Crosshair,
        color: '#A855F7',
        glowColor: 'rgba(168, 85, 247, 0.3)'
    },
    {
        id: 2,
        title: 'Simulate',
        desc: 'Run 100 Monte Carlo trajectories.',
        icon: Zap,
        color: '#22D3EE',
        glowColor: 'rgba(34, 211, 238, 0.3)'
    },
    {
        id: 3,
        title: 'Compare',
        desc: 'Find the most efficient orbit.',
        icon: GitCompare,
        color: '#10B981',
        glowColor: 'rgba(16, 185, 129, 0.3)'
    },
    {
        id: 4,
        title: 'Act',
        desc: 'Execute your personalized flight plan.',
        icon: Rocket,
        color: '#F59E0B',
        glowColor: 'rgba(245, 158, 11, 0.3)'
    },
];

const HowItWorksOrbit = () => {
    return (
        <div className="relative py-16">
            {/* Connecting Line with gradient */}
            <div className="absolute top-[72px] left-[12.5%] right-[12.5%] h-[2px] hidden md:block overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cosmic-500/50 via-cyan-400/50 to-amber-500/50" />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {phases.map((phase, index) => {
                    const Icon = phase.icon;
                    return (
                        <motion.div
                            key={phase.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Number badge */}
                            <motion.div
                                className="absolute -top-2 text-xs font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/10"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: index * 0.15 + 0.3 }}
                            >
                                0{phase.id}
                            </motion.div>

                            {/* Icon container */}
                            <motion.div
                                className="relative mb-6"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                {/* Glow effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ backgroundColor: phase.glowColor }}
                                />

                                {/* Icon box */}
                                <div
                                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:border-opacity-50"
                                    style={{
                                        backgroundColor: `${phase.color}10`,
                                        borderColor: `${phase.color}30`,
                                    }}
                                >
                                    <Icon
                                        className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                                        style={{ color: phase.color }}
                                    />
                                </div>

                                {/* Connecting dot for line */}
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-[7px] w-3 h-3 rounded-full border-2 hidden md:block"
                                    style={{
                                        backgroundColor: '#020616',
                                        borderColor: phase.color
                                    }}
                                />
                            </motion.div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                                {phase.title}
                            </h3>
                            <p className="text-sm text-slate-400 max-w-[180px] leading-relaxed">
                                {phase.desc}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default HowItWorksOrbit;
