import { Link, Navigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import SummaryPanel from '../components/dashboard/SummaryPanel';
import ScenarioCard from '../components/dashboard/ScenarioCard';
import ComparisonChart from '../components/dashboard/ComparisonChart';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
    const { results } = useProfile();

    if (!results) {
        return <Navigate to="/planner" replace />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link to="/planner" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Planner
                </Link>
                <h1 className="text-3xl font-bold text-white tracking-tight">Your Trajectories</h1>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
            >
                <SummaryPanel summary={results.summary} />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {results.scenarios.map((scenario, index) => (
                    <motion.div
                        key={scenario.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                        <ScenarioCard scenario={scenario} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl"
            >
                <h2 className="text-xl font-bold text-white mb-6">Trajectory Comparison</h2>
                <div className="h-[400px]">
                    <ComparisonChart scenarios={results.scenarios} />
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
