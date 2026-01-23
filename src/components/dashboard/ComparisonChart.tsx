import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { RetirementScenario } from '../../types/retirement';
import { SCENARIO_COLORS, type ScenarioId } from '../../constants/scenarios';

interface ComparisonChartProps {
    scenarios: RetirementScenario[];
}

const ComparisonChart = ({ scenarios }: ComparisonChartProps) => {
    const data = scenarios.map(s => ({
        name: s.label,
        age: s.targetRetirementAge,
        id: s.id
    }));

    const getBarColor = (id: string) => {
        return SCENARIO_COLORS[id as ScenarioId]?.barColor || SCENARIO_COLORS.baseline.barColor;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    dy={10}
                />
                <YAxis
                    hide
                    domain={[0, 'dataMax + 5']}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{
                        backgroundColor: '#0B1120',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`Age ${value}`, 'Retirement Age']}
                />
                <Bar dataKey="age" radius={[8, 8, 0, 0]} barSize={60}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.id)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ComparisonChart;
