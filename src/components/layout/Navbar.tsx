import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const isWizard = location.pathname === '/planner';
    const isDashboard = location.pathname === '/dashboard';
    const isHome = location.pathname === '/';

    const scrollToHowItWorks = (e: React.MouseEvent) => {
        if (isHome) {
            e.preventDefault();
            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-space-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            className="relative w-9 h-9 flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Outer orbit ring */}
                            <motion.div
                                className="absolute inset-0 border border-cosmic-500/50 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                            {/* Inner glow */}
                            <div className="absolute inset-1 bg-cosmic-500/10 rounded-full" />
                            {/* Center dot */}
                            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                        </motion.div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            Retire<span className="text-cosmic-400">Me</span>
                        </span>
                    </Link>

                    {!isWizard && (
                        <div className="flex items-center gap-6">
                            {!isDashboard && (
                                <a
                                    href={isHome ? "#how-it-works" : "/#how-it-works"}
                                    onClick={scrollToHowItWorks}
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block"
                                >
                                    How it works
                                </a>
                            )}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    to="/planner"
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cosmic-600/80 to-cosmic-500/80 border border-cosmic-500/30 text-sm font-semibold text-white hover:from-cosmic-500 hover:to-cosmic-400 transition-all shadow-[0_0_15px_rgba(147,51,234,0.2)] hover:shadow-[0_0_25px_rgba(147,51,234,0.4)]"
                                >
                                    {isDashboard ? 'New Simulation' : 'Start Planning'}
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
