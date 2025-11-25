import { motion } from 'framer-motion';

const HeroOrbitVisualization = () => {
    return (
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            {/* Central Node: You */}
            <div className="absolute z-20 flex flex-col items-center">
                <motion.div
                    className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="mt-2 text-xs font-medium text-white/80 tracking-widest uppercase">You, Today</span>
            </div>

            {/* Orbit 1: Baseline */}
            <div className="absolute w-[200px] h-[200px] border border-white/10 rounded-full animate-slow-spin">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full shadow-[0_0_10px_rgba(148,163,184,0.5)] group cursor-pointer">
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-space-800 border border-white/10 rounded text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Baseline • Age 65
                    </div>
                </div>
            </div>

            {/* Orbit 2: Geo-Arbitrage */}
            <div className="absolute w-[320px] h-[320px] border border-cyan-400/20 rounded-full animate-reverse-spin">
                <div className="absolute bottom-[15%] right-[15%] w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)] group cursor-pointer">
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-space-800 border border-cyan-400/30 rounded text-xs text-cyan-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Geo-Arbitrage • Age 55
                    </div>
                </div>
            </div>

            {/* Orbit 3: Upskilled (Recommended) */}
            <div className="absolute w-[440px] h-[440px] border border-cosmic-500/30 rounded-full animate-slow-spin">
                <div className="absolute top-[20%] left-[10%] w-5 h-5 bg-cosmic-500 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.8)] group cursor-pointer">
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-space-800 border border-cosmic-500/30 rounded text-xs text-cosmic-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Skill-Boosted • Age 49
                    </div>
                </div>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute inset-0 bg-radial-gradient from-cosmic-500/10 to-transparent opacity-30 pointer-events-none" />
        </div>
    );
};

export default HeroOrbitVisualization;
