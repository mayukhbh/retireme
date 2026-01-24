import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Zap, TrendingUp, Globe } from 'lucide-react';
import { useRef } from 'react';
import HeroOrbitVisualization from '../components/visuals/HeroOrbitVisualization';
import HowItWorksOrbit from '../components/visuals/HowItWorksOrbit';

const features = [
    {
        icon: Zap,
        title: "Monte Carlo Simulation",
        description: "100 randomized market scenarios give you real probability distributions, not just guesses."
    },
    {
        icon: TrendingUp,
        title: "Skill-Based Projections",
        description: "See how leveraging your expertise could accelerate your path to financial independence."
    },
    {
        icon: Globe,
        title: "Geo-Arbitrage Analysis",
        description: "Discover how relocating could slash years off your working life."
    },
    {
        icon: Shield,
        title: "Privacy First",
        description: "No account required. Your data never leaves your session."
    }
];

const LandingPage = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-16 pb-32 overflow-hidden min-h-[90vh] flex items-center">
                <motion.div
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left: Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-cosmic-400 uppercase mb-6 px-3 py-1.5 rounded-full bg-cosmic-500/10 border border-cosmic-500/20"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-cosmic-400 animate-pulse" />
                                AI-Powered Planning
                            </motion.span>

                            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                                Plot the trajectory of your{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-500 via-cosmic-400 to-cyan-400">
                                    financial future.
                                </span>
                            </h1>

                            <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed font-light">
                                RetireMe runs Monte Carlo simulations across 100 market scenarios to chart your most efficient paths to freedom—based on your skills, assets, and lifestyle goals.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        to="/planner"
                                        className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-cosmic-600 to-cosmic-500 rounded-full hover:from-cosmic-500 hover:to-cosmic-400 transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] hover:-translate-y-0.5"
                                    >
                                        Start Free Simulation <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </motion.div>
                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-slate-300 hover:text-white transition-colors gap-2 group"
                                >
                                    See how it works
                                    <motion.span
                                        animate={{ y: [0, 3, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        ↓
                                    </motion.span>
                                </a>
                            </div>

                            <div className="mt-8 flex items-center gap-6 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    No account required
                                </span>
                                <span className="flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    Results in 2 minutes
                                </span>
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
                </motion.div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 relative scroll-mt-16">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-900/50 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase mb-4 block">
                            The Process
                        </span>
                        <h2 className="text-4xl font-bold text-white mb-4">Your Journey to Freedom</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Advanced Monte Carlo modeling, simplified into a clear 4-step flight plan.
                        </p>
                    </motion.div>
                    <HowItWorksOrbit />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-xs font-bold tracking-[0.2em] text-cosmic-400 uppercase mb-4 block">
                            Why RetireMe
                        </span>
                        <h2 className="text-4xl font-bold text-white mb-4">Built for Serious Planning</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Not another simple calculator. Real simulation technology used by financial advisors.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-cosmic-500/10 border border-cosmic-500/20 flex items-center justify-center mb-4 group-hover:bg-cosmic-500/20 transition-colors">
                                        <Icon className="w-6 h-6 text-cosmic-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center"
                    >
                        <Link
                            to="/planner"
                            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-cosmic-600 to-cosmic-500 rounded-full hover:from-cosmic-500 hover:to-cosmic-400 transition-all shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.5)]"
                        >
                            Start Your Free Simulation
                            <ArrowRight className="ml-3 h-5 w-5" />
                        </Link>
                        <p className="mt-4 text-sm text-slate-500">
                            No credit card • No signup • 100% private
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
