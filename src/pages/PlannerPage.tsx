import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { generateRetirementPaths } from '../api/retirement';
import StepBasics from '../components/inputs/StepBasics';
import StepSkills from '../components/inputs/StepSkills';
import StepLifestyle from '../components/inputs/StepLifestyle';
import ToastContainer from '../components/ui/ToastContainer';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Toast {
    id: string;
    message: string;
    type: 'error' | 'success' | 'info';
    duration?: number;
}

const steps = [
    { id: 'basics', title: 'Basics' },
    { id: 'skills', title: 'Skills' },
    { id: 'lifestyle', title: 'Lifestyle' },
];

const PlannerPage = () => {
    const navigate = useNavigate();
    const { profile, setResults } = useProfile();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: 'error' | 'success' | 'info' = 'info', duration = 5000) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const validateStep = (): string | null => {
        if (currentStep === 0) {
            if (!profile.currentAge || profile.currentAge < 18 || profile.currentAge > 100) {
                return 'Please enter a valid age between 18 and 100';
            }
            if (profile.targetRetirementAge && profile.targetRetirementAge <= profile.currentAge) {
                return 'Target retirement age must be greater than current age';
            }
            if (!profile.country || profile.country.trim() === '') {
                return 'Please enter your current country';
            }
            if (!profile.annualIncome || profile.annualIncome <= 0) {
                return 'Please enter a valid annual income';
            }
            if (profile.investableAssets < 0 || profile.monthlySavings < 0) {
                return 'Assets and savings cannot be negative';
            }
        }
        return null;
    };

    const handleNext = async () => {
        const validationError = validateStep();
        if (validationError) {
            addToast(validationError, 'error');
            return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsLoading(true);
            try {
                const data = await generateRetirementPaths(profile);
                setResults(data);
                addToast('Retirement trajectory generated successfully!', 'success', 2000);
                setTimeout(() => navigate('/dashboard'), 500);
            } catch (error) {
                console.error("Failed to generate paths", error);
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Failed to generate retirement paths. Please try again.';
                addToast(errorMessage, 'error', 7000);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const isStepValid = () => {
        if (currentStep === 0) {
            return profile.currentAge > 0 && profile.annualIncome > 0;
        }
        return true;
    };

    return (
        <>
            <ToastContainer toasts={toasts} onClose={removeToast} />
            <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {/* Cosmic Step Indicator */}
            <div className="mb-12 flex justify-center">
                <div className="relative flex items-center gap-12">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10" />

                    {steps.map((step, index) => (
                        <div key={step.id} className="relative group">
                            <motion.div
                                className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${index <= currentStep
                                        ? 'bg-cosmic-500 border-cosmic-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] scale-125'
                                        : 'bg-space-950 border-slate-600'
                                    }`}
                            >
                                {index === currentStep && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full border border-cosmic-500"
                                        initial={{ scale: 1, opacity: 1 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                )}
                            </motion.div>
                            <div className={`absolute top-8 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-colors duration-300 ${index <= currentStep ? 'text-white' : 'text-slate-500'
                                }`}>
                                {step.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Glass Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 min-h-[400px] flex flex-col shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">{steps[currentStep].title}</h2>

                <div className="flex-grow">
                    {currentStep === 0 && <StepBasics />}
                    {currentStep === 1 && <StepSkills />}
                    {currentStep === 2 && <StepLifestyle />}
                </div>

                <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
                    {currentStep > 0 ? (
                        <button
                            onClick={handleBack}
                            disabled={isLoading}
                            className="flex items-center px-6 py-3 text-slate-400 font-medium rounded-lg hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Go back to previous step"
                        >
                            <ChevronLeft className="h-5 w-5 mr-1" /> Back
                        </button>
                    ) : (
                        <div />
                    )}

                    <button
                        onClick={handleNext}
                        disabled={!isStepValid() || isLoading}
                        className="flex items-center px-8 py-3 bg-cosmic-600 text-white font-bold rounded-full hover:bg-cosmic-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] active:scale-95 min-w-[140px] justify-center"
                        aria-label={currentStep === steps.length - 1 ? 'Generate retirement trajectory' : 'Go to next step'}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                        ) : currentStep === steps.length - 1 ? (
                            'Generate Trajectory'
                        ) : (
                            <>Next <ChevronRight className="h-5 w-5 ml-1" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default PlannerPage;
