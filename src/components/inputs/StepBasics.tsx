import { useProfile } from '../../context/ProfileContext';
import type { RiskProfile } from '../../types/retirement';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, TrendingUp, Wallet, PiggyBank, Shield } from 'lucide-react';

const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cosmic-500/50 focus:border-cosmic-500 transition-all duration-200";
const selectClasses = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500/50 focus:border-cosmic-500 transition-all duration-200 appearance-none cursor-pointer";
const labelClasses = "block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2";

const StepBasics = () => {
    const { profile, updateProfile } = useProfile();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateProfile({
            [name]: name === 'currentAge' || name === 'targetRetirementAge' || name === 'annualIncome' || name === 'investableAssets' || name === 'monthlySavings'
                ? Number(value)
                : value
        });
    };

    const riskDescriptions: Record<RiskProfile, string> = {
        Conservative: "Lower returns, lower risk",
        Balanced: "Moderate growth potential",
        Aggressive: "Higher returns, higher volatility"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Age Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>
                        <Calendar className="h-4 w-4 text-cosmic-500" />
                        Current Age
                    </label>
                    <input
                        type="number"
                        name="currentAge"
                        value={profile.currentAge}
                        onChange={handleChange}
                        className={inputClasses}
                        min="18"
                        max="100"
                    />
                </div>
                <div>
                    <label className={labelClasses}>
                        <TrendingUp className="h-4 w-4 text-cyan-400" />
                        Target Retirement Age
                    </label>
                    <input
                        type="number"
                        name="targetRetirementAge"
                        value={profile.targetRetirementAge || ''}
                        onChange={handleChange}
                        placeholder="Leave blank for earliest possible"
                        className={inputClasses}
                    />
                </div>
            </div>

            {/* Location Section */}
            <div>
                <label className={labelClasses}>
                    <MapPin className="h-4 w-4 text-cosmic-500" />
                    Current Location
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="country"
                        value={profile.country}
                        onChange={handleChange}
                        placeholder="Country"
                        className={inputClasses}
                    />
                    <div className="relative">
                        <select
                            name="costOfLiving"
                            value={profile.costOfLiving}
                            onChange={handleChange}
                            className={selectClasses}
                        >
                            <option value="Low">Low Cost of Living</option>
                            <option value="Medium">Medium Cost of Living</option>
                            <option value="High">High Cost of Living</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className={labelClasses}>
                        <DollarSign className="h-4 w-4 text-emerald-400" />
                        Annual Income
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                            type="number"
                            name="annualIncome"
                            value={profile.annualIncome}
                            onChange={handleChange}
                            className={`${inputClasses} pl-8`}
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClasses}>
                        <Wallet className="h-4 w-4 text-amber-400" />
                        Investable Assets
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                            type="number"
                            name="investableAssets"
                            value={profile.investableAssets}
                            onChange={handleChange}
                            className={`${inputClasses} pl-8`}
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClasses}>
                        <PiggyBank className="h-4 w-4 text-pink-400" />
                        Monthly Savings
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                            type="number"
                            name="monthlySavings"
                            value={profile.monthlySavings}
                            onChange={handleChange}
                            className={`${inputClasses} pl-8`}
                        />
                    </div>
                </div>
            </div>

            {/* Risk Profile Section */}
            <div>
                <label className={labelClasses}>
                    <Shield className="h-4 w-4 text-cosmic-500" />
                    Investment Risk Profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['Conservative', 'Balanced', 'Aggressive'] as RiskProfile[]).map((risk) => (
                        <motion.button
                            key={risk}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateProfile({ riskProfile: risk })}
                            className={`relative py-4 px-4 rounded-xl border text-sm font-medium transition-all duration-300 overflow-hidden ${profile.riskProfile === risk
                                ? 'bg-cosmic-500/20 border-cosmic-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                                }`}
                        >
                            {profile.riskProfile === risk && (
                                <motion.div
                                    layoutId="riskIndicator"
                                    className="absolute inset-0 bg-gradient-to-r from-cosmic-500/10 to-cyan-400/10"
                                    transition={{ type: "spring", duration: 0.5 }}
                                />
                            )}
                            <span className="relative z-10 block font-semibold">{risk}</span>
                            <span className="relative z-10 block text-xs mt-1 opacity-70">{riskDescriptions[risk]}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default StepBasics;
