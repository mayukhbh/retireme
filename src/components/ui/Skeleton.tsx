const Skeleton = ({ className = '' }: { className?: string }) => {
    return (
        <div
            className={`animate-pulse bg-white/5 rounded ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
};

export const ScenarioCardSkeleton = () => {
    return (
        <div className="relative bg-space-900/50 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-6 w-24" />
                    <div className="text-right">
                        <Skeleton className="h-9 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>

                <Skeleton className="h-10 w-full mb-6" />

                <div className="space-y-3 mb-6">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>

            <div className="w-full py-3 bg-white/5 border-t border-white/5 flex items-center justify-center">
                <Skeleton className="h-4 w-32" />
            </div>
        </div>
    );
};

export const SummaryPanelSkeleton = () => {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                    <Skeleton className="h-32 w-32 rounded-full" />
                </div>
                <div className="flex-1 space-y-4 w-full">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                    <div className="pt-4">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ComparisonChartSkeleton = () => {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="h-[400px] flex items-end justify-around gap-8 px-8">
                <Skeleton className="h-3/4 w-full" />
                <Skeleton className="h-2/3 w-full" />
                <Skeleton className="h-1/2 w-full" />
            </div>
        </div>
    );
};

export default Skeleton;
