import type { RetirementPathsResponse } from '../../types/retirement';

interface SummaryPanelProps {
    summary: RetirementPathsResponse['summary'];
}

const SummaryPanel = ({ summary }: SummaryPanelProps) => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-space-900 to-space-800 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cosmic-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                    <h2 className="text-sm font-bold text-cosmic-500 uppercase tracking-widest mb-2">Optimal Trajectory</h2>
                    <div className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                        Age {summary.earliestRetirementAge}
                        <span className="text-2xl md:text-3xl text-slate-500 font-normal ml-3">in {summary.earliestRetirementYear}</span>
                    </div>
                    <p className="text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
                        {summary.headline}
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/5 max-w-sm w-full">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Critical Assumptions</h3>
                    <ul className="space-y-2">
                        {summary.caveats.map((caveat, index) => (
                            <li key={index} className="flex items-start text-sm text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 mr-2 flex-shrink-0" />
                                {caveat}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SummaryPanel;
