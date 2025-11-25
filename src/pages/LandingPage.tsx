import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import HeroOrbitVisualization from '../components/visuals/HeroOrbitVisualization';
import HowItWorksOrbit from '../components/visuals/HowItWorksOrbit';

const LandingPage = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden min-h-[90vh] flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left: Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-6">
                                Reimagine Retirement
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                                Plot the trajectory of your <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-500 to-cyan-400">
                                    financial future.
                                </span>
                            </h1>
                            <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed font-light">
                                RetireMe simulates thousands of possible futures based on your skills, assets, and lifestyle—then charts the most efficient paths to freedom.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <Link
                                    to="/planner"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-cosmic-600 rounded-full hover:bg-cosmic-500 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:-translate-y-1"
                                >
                                    Start Simulation <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                                <button className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-300 hover:text-white transition-colors gap-2 group">
                                    <PlayCircle className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
                                    Watch a Sample Path
                                </button>
                            </div>
                            <div className="mt-6 text-xs text-slate-500 font-medium tracking-wide">
                                NO ACCOUNT NEEDED • TAKES UNDER 2 MINUTES
                            </div>
                        </motion.div>

                        {/* Right: Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="flex justify-center lg:justify-end"
                        >
                            <HeroOrbitVisualization />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Strip */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-900/50 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Your Journey to Freedom</h2>
                        <p className="text-slate-400">Advanced modeling, simplified into a clear flight plan.</p>
                    </div>
                    <HowItWorksOrbit />
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
