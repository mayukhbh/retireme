import { motion } from 'framer-motion';
import { useState } from 'react';

interface OrbitNodeProps {
    size: number;
    color: string;
    glowColor: string;
    label: string;
    age: string;
    isRecommended?: boolean;
}

const OrbitNode = ({ size, color, glowColor, label, age, isRecommended }: OrbitNodeProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.2 }}
        >
            {/* Pulse ring for recommended */}
            {isRecommended && (
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            {/* Glow */}
            <div
                className="absolute inset-[-4px] rounded-full blur-md"
                style={{ backgroundColor: glowColor, opacity: isHovered ? 0.8 : 0.5 }}
            />

            {/* Core */}
            <div
                className="relative rounded-full"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    boxShadow: `0 0 ${size}px ${glowColor}`
                }}
            />

            {/* Tooltip */}
            <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 5,
                    scale: isHovered ? 1 : 0.9
                }}
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-2 bg-space-800/95 backdrop-blur-sm border border-white/10 rounded-lg whitespace-nowrap pointer-events-none z-50"
            >
                <div className="text-xs font-semibold text-white">{label}</div>
                <div className="text-xs mt-0.5" style={{ color }}>{age}</div>
                {isRecommended && (
                    <div className="text-[10px] text-cosmic-400 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-cosmic-400" />
                        Recommended
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

const HeroOrbitVisualization = () => {
    return (
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            {/* Ambient glow in center */}
            <div className="absolute w-32 h-32 bg-cosmic-500/20 rounded-full blur-3xl" />

            {/* Central Node: You */}
            <div className="absolute z-20 flex flex-col items-center">
                <motion.div
                    className="relative"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Outer ring */}
                    <motion.div
                        className="absolute inset-[-8px] border-2 border-white/30 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Core */}
                    <div className="w-5 h-5 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.9)]" />
                </motion.div>
                <span className="mt-4 text-xs font-semibold text-white/90 tracking-[0.2em] uppercase">You, Today</span>
            </div>

            {/* Orbit 1: Baseline - Inner orbit */}
            <motion.div
                className="absolute w-[180px] h-[180px] rounded-full"
                style={{
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    background: 'radial-gradient(circle, transparent 60%, rgba(148, 163, 184, 0.03) 100%)'
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                {/* Orbit trail effect */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute w-8 h-full bg-gradient-to-b from-transparent via-slate-400/20 to-transparent"
                        style={{ left: '50%', transform: 'translateX(-50%)' }}
                    />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <OrbitNode
                        size={12}
                        color="#94A3B8"
                        glowColor="rgba(148, 163, 184, 0.5)"
                        label="Baseline Path"
                        age="Age 65"
                    />
                </div>
            </motion.div>

            {/* Orbit 2: Geo-Arbitrage - Middle orbit */}
            <motion.div
                className="absolute w-[300px] h-[300px] rounded-full"
                style={{
                    border: '1px solid rgba(34, 211, 238, 0.2)',
                    background: 'radial-gradient(circle, transparent 60%, rgba(34, 211, 238, 0.02) 100%)'
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute bottom-[10%] right-[10%]">
                    <OrbitNode
                        size={16}
                        color="#22D3EE"
                        glowColor="rgba(34, 211, 238, 0.6)"
                        label="Geo-Arbitrage"
                        age="Age 55"
                    />
                </div>
            </motion.div>

            {/* Orbit 3: Upskilled - Outer orbit (Recommended) */}
            <motion.div
                className="absolute w-[420px] h-[420px] rounded-full"
                style={{
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    background: 'radial-gradient(circle, transparent 60%, rgba(168, 85, 247, 0.03) 100%)'
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute top-[15%] left-[8%]">
                    <OrbitNode
                        size={20}
                        color="#A855F7"
                        glowColor="rgba(168, 85, 247, 0.7)"
                        label="Skill-Boosted"
                        age="Age 49"
                        isRecommended
                    />
                </div>
            </motion.div>

            {/* Decorative outer ring */}
            <div className="absolute w-[480px] h-[480px] border border-white/5 rounded-full" />

            {/* Radial gradient overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
                }}
            />
        </div>
    );
};

export default HeroOrbitVisualization;
