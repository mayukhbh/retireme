import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { generateRetirementPaths } from '../api/retirement';
import StepBasics from '../components/inputs/StepBasics';
import StepSkills from '../components/inputs/StepSkills';
import StepLifestyle from '../components/inputs/StepLifestyle';
import { ChevronRight, ChevronLeft, Rocket, User, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
    { id: 'basics', title: 'Financial Basics', icon: User, description: 'Your current situation' },
    { id: 'skills', title: 'Skills & Career', icon: Sparkles, description: 'Unlock income potential' },
    { id: 'lifestyle', title: 'Lifestyle Goals', icon: MapPin, description: 'Define your dream life' },
];

const stepVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 30 : -30,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 30 : -30,
        opacity: 0
    })
};

const PlannerPage = () => {
    const navigate = useNavigate();
    const { profile, setResults } = useProfile();
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        } else {
            setIsLoading(true);
            setError(null);
            try {
                const data = await generateRetirementPaths(profile);
                setResults(data);
                navigate('/dashboard');
            } catch (err) {
                console.error("Failed to generate paths", err);
                setError("Failed to generate trajectories. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    };

    const isStepValid = () => {
        if (currentStep === 0) {
            return profile.currentAge > 0 && profile.annualIncome > 0;
        }
        return true;
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <StepBasics />;
            case 1:
                return <StepSkills />;
            case 2:
                return <StepLifestyle />;
            default:
                return null;
        }
    };

    const CurrentIcon = steps[currentStep].icon;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Enhanced Step Indicator */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = index === currentStep;
                        const isComplete = index < currentStep;

                        return (
                            <div key={step.id} className="flex-1 relative">
                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div className="absolute top-5 left-[calc(50%+24px)] right-0 h-[2px]">
                                        <div className="absolute inset-0 bg-white/10" />
                                        <motion.div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cosmic-500 to-cyan-400"
                                            initial={{ width: '0%' }}
                                            animate={{ width: isComplete ? '100%' : '0%' }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col items-center relative z-10">
                                    <motion.div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${isActive
                                            ? 'bg-cosmic-500/20 border-cosmic-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                            : isComplete
                                                ? 'bg-cosmic-500 border-cosmic-500'
                                                : 'bg-white/5 border-white/20'
                                            }`}
                                        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                                        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                                    >
                                        <StepIcon className={`w-5 h-5 ${isActive ? 'text-cosmic-400' : isComplete ? 'text-white' : 'text-slate-500'
                                            }`} />
                                    </motion.div>
                                    <span className={`mt-3 text-xs font-semibold tracking-wide transition-colors ${isActive ? 'text-white' : isComplete ? 'text-slate-300' : 'text-slate-500'
                                        }`}>
                                        {step.title}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Glass Card */}
            <motion.div
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 min-h-[500px] flex flex-col shadow-2xl relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cosmic-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-cosmic-500/20 border border-cosmic-500/30 flex items-center justify-center">
                        <CurrentIcon className="w-6 h-6 text-cosmic-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {steps[currentStep].title}
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">
                            {steps[currentStep].description}
                        </p>
                    </div>
                </div>

                {/* Step Content with Animation */}
                <div className="flex-grow relative z-10">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-10 pt-6 border-t border-white/10 relative z-10">
                    <motion.button
                        whileHover={{ x: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBack}
                        disabled={currentStep === 0 || isLoading}
                        className={`flex items-center px-6 py-3 text-slate-400 font-medium rounded-xl hover:text-white hover:bg-white/5 transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''
                            }`}
                    >
                        <ChevronLeft className="h-5 w-5 mr-1" /> Back
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNext}
                        disabled={!isStepValid() || isLoading}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cosmic-600 to-cosmic-500 text-white font-bold rounded-full hover:from-cosmic-500 hover:to-cosmic-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_25px_rgba(147,51,234,0.4)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)] min-w-[180px] justify-center"
                    >
                        {isLoading ? (
                            <>
                                <motion.div
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <span>Calculating...</span>
                            </>
                        ) : currentStep === steps.length - 1 ? (
                            <>
                                <Rocket className="h-5 w-5" />
                                Launch Simulation
                            </>
                        ) : (
                            <>
                                Continue
                                <ChevronRight className="h-5 w-5" />
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>

            {/* Progress indicator */}
            <div className="mt-6 flex justify-center gap-2">
                {steps.map((_, index) => (
                    <motion.div
                        key={index}
                        className={`h-1 rounded-full transition-all duration-300 ${index === currentStep
                            ? 'w-8 bg-cosmic-500'
                            : index < currentStep
                                ? 'w-4 bg-cosmic-500/50'
                                : 'w-4 bg-white/10'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default PlannerPage;
