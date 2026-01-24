import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import type { RetirementScenario } from '../../types/retirement';
import { motion } from 'framer-motion';

interface ComparisonChartProps {
    scenarios: RetirementScenario[];
}

const ComparisonChart = ({ scenarios }: ComparisonChartProps) => {
    // Sort by retirement age for visual comparison
    const sortedScenarios = [...scenarios].sort((a, b) => a.targetRetirementAge - b.targetRetirementAge);

    const data = sortedScenarios.map(s => ({
        name: s.label.replace(' Path', '').replace(' Accelerator', ''),
        age: s.targetRetirementAge,
        savings: s.requiredMonthlySavings,
        probability: s.probabilityScore,
        id: s.id
    }));

    const getBarColor = (id: string) => {
        if (id === 'upskill') return '#A855F7';
        if (id === 'geo-arbitrage') return '#22D3EE';
        return '#64748B';
    };

    const getGradientId = (id: string) => {
        if (id === 'upskill') return 'url(#cosmicGradient)';
        if (id === 'geo-arbitrage') return 'url(#cyanGradient)';
        return 'url(#slateGradient)';
    };

    const minAge = Math.min(...data.map(d => d.age));
    const yearsSaved = data.map(d => d.age - minAge);

    return (
        <div className="h-full">
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-6">
                {data.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getBarColor(item.id) }}
                        />
                        <span className="text-sm text-slate-400">{item.name}</span>
                        {idx === 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 ml-1">
                                Best
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={data}
                    margin={{ top: 30, right: 30, left: 30, bottom: 20 }}
                    barCategoryGap="20%"
                >
                    <defs>
                        <linearGradient id="cosmicGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#A855F7" stopOpacity={1} />
                            <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22D3EE" stopOpacity={1} />
                            <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="slateGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#64748B" stopOpacity={1} />
                            <stop offset="100%" stopColor="#475569" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(255,255,255,0.06)"
                    />

                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 13, fontWeight: 500 }}
                        dy={10}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 11 }}
                        domain={[Math.min(...data.map(d => d.age)) - 5, Math.max(...data.map(d => d.age)) + 5]}
                        tickFormatter={(value) => `${value}`}
                        dx={-10}
                    />

                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{
                            backgroundColor: 'rgba(11, 17, 32, 0.95)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            color: '#fff',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                            padding: '16px'
                        }}
                        itemStyle={{ color: '#fff' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const item = payload[0].payload;
                                return (
                                    <div className="bg-space-800/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
                                        <div className="text-white font-semibold mb-2">{item.name}</div>
                                        <div className="space-y-1.5 text-sm">
                                            <div className="flex justify-between gap-4">
                                                <span className="text-slate-400">Retirement Age:</span>
                                                <span className="text-white font-medium">{item.age}</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <span className="text-slate-400">Monthly Savings:</span>
                                                <span className="text-white font-medium">${item.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <span className="text-slate-400">Success Rate:</span>
                                                <span className="text-white font-medium">{item.probability}%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    <Bar
                        dataKey="age"
                        radius={[12, 12, 0, 0]}
                        maxBarSize={80}
                    >
                        <LabelList
                            dataKey="age"
                            position="top"
                            fill="#fff"
                            fontSize={16}
                            fontWeight={700}
                            formatter={(value) => `Age ${value}`}
                            offset={10}
                        />
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getGradientId(entry.id)}
                                style={{
                                    filter: index === 0 ? 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))' : 'none'
                                }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Years saved comparison */}
            {yearsSaved.some(y => y > 0) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                >
                    <div className="text-sm text-emerald-400 text-center">
                        Choosing the best path could save you up to{' '}
                        <span className="font-bold">{Math.max(...yearsSaved)} years</span> of work
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ComparisonChart;
