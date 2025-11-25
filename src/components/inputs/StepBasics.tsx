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
                    <label className="block text-sm font-medium text-slate-700">Current Age</label>
                    <input
                        type="number"
                        name="currentAge"
                        value={profile.currentAge}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        min="18"
                        max="100"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Target Retirement Age</label>
                    <input
                        type="number"
                        name="targetRetirementAge"
                        value={profile.targetRetirementAge || ''}
                        onChange={handleChange}
                        placeholder="Optional (Default: ASAP)"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Current Country</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="country"
                        value={profile.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    <select
                        name="costOfLiving"
                        value={profile.costOfLiving}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                    >
                        <option value="Low">Low Cost of Living</option>
                        <option value="Medium">Medium Cost of Living</option>
                        <option value="High">High Cost of Living</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Annual Income ($)</label>
                    <input
                        type="number"
                        name="annualIncome"
                        value={profile.annualIncome}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Investable Assets ($)</label>
                    <input
                        type="number"
                        name="investableAssets"
                        value={profile.investableAssets}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Monthly Savings ($)</label>
                    <input
                        type="number"
                        name="monthlySavings"
                        value={profile.monthlySavings}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Risk Preference</label>
                <div className="grid grid-cols-3 gap-4">
                    {(['Conservative', 'Balanced', 'Aggressive'] as RiskProfile[]).map((risk) => (
                        <button
                            key={risk}
                            onClick={() => updateProfile({ riskProfile: risk })}
                            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${profile.riskProfile === risk
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
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
