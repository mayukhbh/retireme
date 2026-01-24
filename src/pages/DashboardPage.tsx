import { Link, Navigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import SummaryPanel from '../components/dashboard/SummaryPanel';
import ScenarioCard from '../components/dashboard/ScenarioCard';
import ComparisonChart from '../components/dashboard/ComparisonChart';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
    const { results, resetProfile } = useProfile();

    if (!results) {
        return <Navigate to="/planner" replace />;
    }

    const handleStartOver = () => {
        resetProfile();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
                <div>
                    <Link
                        to="/planner"
                        className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-2 group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Adjust Inputs
                    </Link>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Your Retirement Trajectories</h1>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStartOver}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Start Over
                    </motion.button>
                </div>
            </motion.div>

            {/* Summary Panel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
            >
                <SummaryPanel summary={results.summary} />
            </motion.div>

            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
            >
                <h2 className="text-xl font-bold text-white">Compare Your Options</h2>
                <p className="text-sm text-slate-400 mt-1">Each scenario shows a different path to financial independence</p>
            </motion.div>

            {/* Scenario Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {results.scenarios.map((scenario, index) => (
                    <motion.div
                        key={scenario.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                        <ScenarioCard scenario={scenario} rank={index} />
                    </motion.div>
                ))}
            </div>

            {/* Comparison Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Trajectory Comparison</h2>
                        <p className="text-sm text-slate-400 mt-1">Retirement age by scenario</p>
                    </div>
                </div>
                <div className="h-[450px]">
                    <ComparisonChart scenarios={results.scenarios} />
                </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl"
            >
                <p className="text-xs text-amber-400/80 text-center">
                    <strong>Disclaimer:</strong> These projections are for informational purposes only and do not constitute financial advice.
                    Results are based on Monte Carlo simulations with historical volatility assumptions. Consult a qualified financial advisor for personalized guidance.
                </p>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
