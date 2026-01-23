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
                <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" /> Dream Retirement Locations
                </label>
                <input
                    type="text"
                    value={profile.preferredLocations.join(', ')}
                    onChange={handleLocationsChange}
                    placeholder="e.g. Bali, Lisbon, Austin (comma separated)"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all"
                    aria-label="Dream retirement locations"
                />
                <p className="text-xs text-slate-400">
                    We'll use cost-of-living data from these places to estimate your needs.
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-slate-400" /> Lifestyle Intensity
                    </label>
                    <span className="text-sm font-semibold text-cosmic-300 bg-cosmic-500/20 px-3 py-1 rounded-full border border-cosmic-500/30">
                        {profile.lifestyleIntensity < 33 ? 'Frugal' : profile.lifestyleIntensity < 66 ? 'Comfortable' : 'Luxe'}
                    </span>
                </div>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={profile.lifestyleIntensity}
                    onChange={(e) => updateProfile({ lifestyleIntensity: Number(e.target.value) })}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cosmic-500"
                    aria-label="Lifestyle intensity slider"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={profile.lifestyleIntensity}
                />

                <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
                    <span>Frugal</span>
                    <span>Comfortable</span>
                    <span>Luxe</span>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-sm text-slate-300 italic">
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
