import { useProfile } from '../../context/ProfileContext';
import type { RiskProfile } from '../../types/retirement';

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

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Current Age</label>
                    <input
                        type="number"
                        name="currentAge"
                        value={profile.currentAge}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all"
                        min="18"
                        max="100"
                        aria-label="Current age"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Target Retirement Age</label>
                    <input
                        type="number"
                        name="targetRetirementAge"
                        value={profile.targetRetirementAge || ''}
                        onChange={handleChange}
                        placeholder="Optional (Default: ASAP)"
                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all"
                        aria-label="Target retirement age (optional)"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Current Country</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="country"
                        value={profile.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all"
                        aria-label="Current country"
                        required
                    />
                    <select
                        name="costOfLiving"
                        value={profile.costOfLiving}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all"
                        aria-label="Cost of living level"
                    >
                        <option value="Low" className="bg-space-900">Low Cost of Living</option>
                        <option value="Medium" className="bg-space-900">Medium Cost of Living</option>
                        <option value="High" className="bg-space-900">High Cost of Living</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Annual Income ($)</label>
                    <input
                        type="number"
                        name="annualIncome"
                        value={profile.annualIncome}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all"
                        min="0"
                        aria-label="Annual income in dollars"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Investable Assets ($)</label>
                    <input
                        type="number"
                        name="investableAssets"
                        value={profile.investableAssets}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all"
                        min="0"
                        aria-label="Investable assets in dollars"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Monthly Savings ($)</label>
                    <input
                        type="number"
                        name="monthlySavings"
                        value={profile.monthlySavings}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all"
                        min="0"
                        aria-label="Monthly savings in dollars"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Risk Preference</label>
                <div className="grid grid-cols-3 gap-4" role="group" aria-label="Risk preference selection">
                    {(['Conservative', 'Balanced', 'Aggressive'] as RiskProfile[]).map((risk) => (
                        <button
                            key={risk}
                            type="button"
                            onClick={() => updateProfile({ riskProfile: risk })}
                            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${profile.riskProfile === risk
                                ? 'bg-cosmic-500/20 border-cosmic-500 text-cosmic-300 ring-1 ring-cosmic-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-cosmic-500/50'
                                }`}
                            aria-pressed={profile.riskProfile === risk}
                        >
                            {risk}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StepBasics;
