import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';

interface ChartProps {
  title: string;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartProps> = ({ title, children }) => (
  <div className="technical-card p-4 h-full flex flex-col bg-slate-900 border-slate-800">
    <div className="flex items-center justify-between mb-4">
      <h3 className="data-label text-slate-400">{title}</h3>
      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_#6366f1]" />
    </div>
    <div className="flex-1 w-full min-h-[250px]">
      {children}
    </div>
  </div>
);

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 text-slate-100 p-3 border border-slate-700 rounded-lg shadow-2xl font-mono text-[10px] backdrop-blur-md bg-opacity-90">
        <p className="font-bold mb-2 border-b border-slate-800 pb-1 text-indigo-400">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-slate-400 uppercase">{entry.name}:</span>
              <span style={{ color: entry.color }} className="font-bold">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
