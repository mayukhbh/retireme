import { useProfile } from '../../context/ProfileContext';
import { MapPin, Sparkles, Leaf, Coffee, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cosmic-500/50 focus:border-cosmic-500 transition-all duration-200";

const StepLifestyle = () => {
    const { profile, updateProfile } = useProfile();

    const handleLocationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateProfile({ preferredLocations: e.target.value.split(',').map(s => s.trim()).filter(Boolean) });
    };

    const getLifestyleInfo = () => {
        if (profile.lifestyleIntensity < 33) {
            return {
                label: 'Frugal',
                icon: Leaf,
                color: 'text-emerald-400',
                bgColor: 'bg-emerald-400/10',
                borderColor: 'border-emerald-400/30',
                description: "You prefer a simple life with minimal expenses. Prioritizing freedom and experiences over material goods.",
                multiplier: '0.8x'
            };
        }
        if (profile.lifestyleIntensity < 66) {
            return {
                label: 'Comfortable',
                icon: Coffee,
                color: 'text-cyan-400',
                bgColor: 'bg-cyan-400/10',
                borderColor: 'border-cyan-400/30',
                description: "You want a balanced life with occasional travel and dining out, enjoying life without excessive luxury.",
                multiplier: '1.0x'
            };
        }
        return {
            label: 'Luxe',
            icon: Crown,
            color: 'text-amber-400',
            bgColor: 'bg-amber-400/10',
            borderColor: 'border-amber-400/30',
            description: "You want the finer things in life: frequent travel, premium housing, and high-end experiences.",
            multiplier: '1.5x'
        };
    };

    const lifestyleInfo = getLifestyleInfo();
    const LifestyleIcon = lifestyleInfo.icon;

    // Calculate slider position for custom track
    const sliderPercent = profile.lifestyleIntensity;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Locations Section */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cosmic-500" />
                    Dream Retirement Locations
                </label>
                <input
                    type="text"
                    value={profile.preferredLocations.join(', ')}
                    onChange={handleLocationsChange}
                    placeholder="e.g. Bali, Lisbon, Austin, Chiang Mai"
                    className={inputClasses}
                />
                <p className="text-xs text-slate-500">
                    Comma-separated list. We'll analyze cost-of-living to find geo-arbitrage opportunities.
                </p>

                {profile.preferredLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {profile.preferredLocations.filter(Boolean).map((location, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-sm text-cyan-300 flex items-center gap-1.5"
                            >
                                <MapPin className="h-3 w-3" />
                                {location}
                            </motion.span>
                        ))}
                    </div>
                )}
            </div>

            {/* Lifestyle Intensity Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-cosmic-500" />
                        Lifestyle Intensity
                    </label>
                    <motion.span
                        key={lifestyleInfo.label}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-2 ${lifestyleInfo.bgColor} ${lifestyleInfo.color} border ${lifestyleInfo.borderColor}`}
                    >
                        <LifestyleIcon className="h-4 w-4" />
                        {lifestyleInfo.label}
                    </motion.span>
                </div>

                {/* Custom Slider */}
                <div className="relative pt-2 pb-1">
                    <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
                        {/* Gradient track fill */}
                        <motion.div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500"
                            initial={false}
                            animate={{ width: `${sliderPercent}%` }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={profile.lifestyleIntensity}
                        onChange={(e) => updateProfile({ lifestyleIntensity: Number(e.target.value) })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {/* Custom thumb */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg shadow-black/30 border-2 border-white/50 pointer-events-none"
                        initial={false}
                        animate={{ left: `calc(${sliderPercent}% - 10px)` }}
                        transition={{ duration: 0.2 }}
                    />
                </div>

                {/* Labels */}
                <div className="flex justify-between text-xs font-medium">
                    <span className={profile.lifestyleIntensity < 33 ? 'text-emerald-400' : 'text-slate-500'}>Frugal</span>
                    <span className={profile.lifestyleIntensity >= 33 && profile.lifestyleIntensity < 66 ? 'text-cyan-400' : 'text-slate-500'}>Comfortable</span>
                    <span className={profile.lifestyleIntensity >= 66 ? 'text-amber-400' : 'text-slate-500'}>Luxe</span>
                </div>

                {/* Description Card */}
                <motion.div
                    key={lifestyleInfo.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-5 rounded-xl border ${lifestyleInfo.borderColor} ${lifestyleInfo.bgColor}`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${lifestyleInfo.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <LifestyleIcon className={`h-6 w-6 ${lifestyleInfo.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {lifestyleInfo.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                                Expense multiplier: <span className={lifestyleInfo.color}>{lifestyleInfo.multiplier}</span> of baseline
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default StepLifestyle;
