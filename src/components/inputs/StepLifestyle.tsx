import { useProfile } from '../../context/ProfileContext';
import { MapPin, Wallet } from 'lucide-react';

const StepLifestyle = () => {
    const { profile, updateProfile } = useProfile();

    const handleLocationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateProfile({ preferredLocations: e.target.value.split(',').map(s => s.trim()) });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" /> Dream Retirement Locations
                </label>
                <input
                    type="text"
                    value={profile.preferredLocations.join(', ')}
                    onChange={handleLocationsChange}
                    placeholder="e.g. Bali, Lisbon, Austin (comma separated)"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <p className="text-xs text-slate-500">
                    We'll use cost-of-living data from these places to estimate your needs.
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-slate-500" /> Lifestyle Intensity
                    </label>
                    <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        {profile.lifestyleIntensity < 33 ? 'Frugal' : profile.lifestyleIntensity < 66 ? 'Comfortable' : 'Luxe'}
                    </span>
                </div>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={profile.lifestyleIntensity}
                    onChange={(e) => updateProfile({ lifestyleIntensity: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />

                <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
                    <span>Frugal</span>
                    <span>Comfortable</span>
                    <span>Luxe</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600 italic">
                    {profile.lifestyleIntensity < 33
                        ? "You prefer a simple life with minimal expenses. Prioritizing freedom over material goods."
                        : profile.lifestyleIntensity < 66
                            ? "You want a balanced life with occasional travel and dining out, but no excessive luxury."
                            : "You want the finer things in life: frequent travel, premium housing, and high-end experiences."}
                </div>
            </div>
        </div>
    );
};

export default StepLifestyle;
