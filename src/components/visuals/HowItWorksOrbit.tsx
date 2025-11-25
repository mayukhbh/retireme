import { motion } from 'framer-motion';

const phases = [
    { id: 1, title: 'Input', desc: 'Map your current coordinates.' },
    { id: 2, title: 'Simulate', desc: 'Fire thousands of trajectories.' },
    { id: 3, title: 'Compare', desc: 'Find the most efficient orbit.' },
    { id: 4, title: 'Act', desc: 'Execute your flight plan.' },
];

const HowItWorksOrbit = () => {
    return (
        <div className="relative py-20">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {phases.map((phase, index) => (
                    <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex flex-col items-center text-center group"
                    >
                        <div className="w-4 h-4 rounded-full bg-space-950 border-2 border-white/30 group-hover:border-cosmic-500 group-hover:scale-125 transition-all duration-300 relative mb-6 shadow-[0_0_0_4px_rgba(2,6,22,1)]">
                            <div className="absolute inset-0 bg-cosmic-500 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{phase.title}</h3>
                        <p className="text-sm text-slate-400 max-w-[200px]">{phase.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HowItWorksOrbit;
