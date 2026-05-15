import React from 'react';
import { motion } from 'motion/react';
import { 
  Skull, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  ShieldAlert, 
  Rocket, 
  Ghost, 
  Zap,
  Database
} from 'lucide-react';
import { useClients } from '../ClientContext';
import { ChartContainer, CustomTooltip } from '../components/Charts';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  Legend,
  Cell
} from 'recharts';

const ExecutiveKPIsView = () => {
  const { clients, selectedClientId } = useClients();

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-40 text-slate-600 font-mono uppercase tracking-[0.3em]">
        <Skull size={64} className="mb-6 opacity-20 animate-pulse text-indigo-500" />
        <span className="text-xl font-black">Awaiting Data Sync</span>
        <p className="text-[10px] mt-4 opacity-50">Upload JSON batch via Seed Engine to initialize</p>
      </div>
    );
  }

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // 1. Churn Risk Scantter Map Data
  const churnData = clients.map(c => ({
    name: c.name,
    latency: c.groupA.api_latency_ms,
    tickets: c.groupB.support_tickets_open,
    risk: c.kpis.churn_risk_level,
    isSelected: c.id === selectedClient.id
  }));

  // 2. SLA Penalty Sum
  const totalPenalty = clients.reduce((sum, c) => sum + c.kpis.sla_penalty_owed_usd, 0);

  // 3. Resource Profitability Data
  const profitData = clients.map(c => ({
    name: c.name,
    revenue: c.groupB.monthly_subscription_fee_usd,
    cost: (c.groupA.cpu_usage_percent * 10) + (c.groupA.bandwidth_consumed_tb * 5) + (c.groupA.storage_used_gb * 0.1),
    status: c.kpis.resource_profitability_status
  }));

  // 4. Attack Impact Data
  const attackData = clients.map(c => ({
    name: c.name,
    attacks: c.groupA.blocked_ddos_attacks,
    csat: c.groupB.customer_satisfaction_score
  }));

  // Logic for Top Row Cards (Selected Client Focus)
  const getRiskColor = (risk: string) => {
    if (risk === 'High Risk') return 'bg-rose-500 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]';
    if (risk === 'Medium Risk') return 'bg-amber-500 border-amber-400 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
    return 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8 pb-20"
    >
      <div className="space-y-2 relative">
        <div className="absolute top-0 right-0 technical-card px-4 py-2 bg-slate-900/50 border-slate-800 flex items-center gap-3">
          <Database size={14} className="text-indigo-400" />
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Master Source: DB_C (Aggregated)</span>
        </div>
        <div className="flex items-center gap-2 text-indigo-400">
          <Zap size={16} />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">Executive Case Study V1.0</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-100 uppercase max-w-3xl leading-tight">
          The Cost of Latency: <span className="text-indigo-500">Predicting Enterprise Churn</span> through Infrastructure Metrics
        </h2>
        <p className="text-sm font-mono text-slate-500 italic max-w-2xl">
          Visualizing the direct correlation between hardware vitals (Database A) and human support load (Database B).
        </p>
      </div>

      {/* Part 1: The Top Row (KPI Scorecards) */}
      <div className="grid grid-cols-3 gap-8">
        {/* Box 1: The Final Synthesis */}
        <motion.div 
          className={`technical-card p-8 border-2 flex flex-col items-center justify-center text-center transition-all ${getRiskColor(selectedClient.kpis.churn_risk_level)}`}
        >
          <p className="text-[10px] font-mono font-bold uppercase opacity-80 mb-2">KPI Synthesis: Calculated Risk</p>
          <p className="text-3xl font-black uppercase tracking-tighter mb-1">{selectedClient.kpis.churn_risk_level}</p>
          <p className="text-[9px] font-mono opacity-60">nexus_cluster_risk_engine(SELECTED_CLIENT)</p>
        </motion.div>

        {/* Box 2: The IT Cause */}
        <div className="technical-card p-8 bg-slate-900 border-slate-800 flex flex-col items-center justify-center text-center shadow-lg">
          <p className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-2">Hardware Vital: API Latency</p>
          <p className={`text-4xl font-black tracking-tighter mb-1 ${selectedClient.groupA.api_latency_ms > 500 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
            {selectedClient.groupA.api_latency_ms}ms
          </p>
          <p className="text-[9px] font-mono text-slate-600">THRESHOLD: &gt;500ms (Critical Redline)</p>
        </div>

        {/* Box 3: The Business Effect */}
        <div className="technical-card p-8 bg-slate-900 border-slate-800 flex flex-col items-center justify-center text-center shadow-lg">
          <p className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-2">Human Vital: Open Tix</p>
          <p className={`text-4xl font-black tracking-tighter mb-1 ${selectedClient.groupB.support_tickets_open >= 3 ? 'text-rose-500' : 'text-slate-100'}`}>
            {selectedClient.groupB.support_tickets_open}
          </p>
          <p className="text-[9px] font-mono text-slate-600">THRESHOLD: &gt;=3 (Volume Pressure)</p>
        </div>
      </div>

      {/* Part 2: The Middle Row (The Evidence Chart) */}
      <div className="grid grid-cols-1">
        <ChartContainer title="01. The Churn Risk Matrix (Correlation: Infrastructure Failure vs Support Vol.)">
          <div className="relative w-full h-[500px] bg-slate-950 rounded border-2 border-slate-800 overflow-hidden shadow-2xl">
            {/* Danger Zone Background Overlay */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-rose-500/20 -z-0 border-l-2 border-b-2 border-rose-500/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(244,63,94,0.4)_1px,transparent_1px)] bg-[size:10px_10px]" />
              <span className="text-xl font-black text-rose-500/40 uppercase tracking-[0.5em] rotate-12 scale-150">CHURN_EVENT_IMMINENT</span>
            </div>
            
            <div className="absolute bottom-4 left-6 text-[10px] font-mono text-slate-600">X-AXIS: Telemetry Latency (ms)</div>
            <div className="absolute top-1/2 -left-12 -rotate-90 text-[10px] font-mono text-slate-600">Y-AXIS: Open Support Tickets</div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                <XAxis 
                  type="number" 
                  dataKey="latency" 
                  domain={[0, 1000]} 
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  label={{ value: 'Latency (ms)', position: 'bottom', offset: 20, fontSize: 10, fill: '#475569' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="tickets" 
                  domain={[0, 15]} 
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  label={{ value: 'Support Tickets', angle: -90, position: 'left', offset: 20, fontSize: 10, fill: '#475569' }}
                />
                <ZAxis type="number" range={[200, 800]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Scatter name="Fleet Monitoring" data={churnData}>
                  {churnData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.risk === 'High Risk' ? '#F43F5E' : entry.risk === 'Medium Risk' ? '#F59E0B' : '#10B981'} 
                      stroke={entry.isSelected ? '#FFF' : 'none'}
                      strokeWidth={entry.isSelected ? 3 : 0}
                      className={`transition-all duration-700 ${entry.risk === 'High Risk' ? 'animate-pulse' : ''}`}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] font-mono">
            <div className="flex gap-6">
              <span className="flex items-center gap-2 text-rose-500"><div className="w-2 h-2 bg-rose-500 rounded-full" /> DANGER: Latency &gt; 500ms & Tickets &gt;= 3</span>
              <span className="flex items-center gap-2 text-emerald-500"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> SAFE: Infrastructure Stability Confirmed</span>
            </div>
            <span className="text-slate-500 uppercase tracking-widest animate-pulse">Scanning live telemetry cluster...</span>
          </div>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* 3. Resource Profitability Margin */}
        <ChartContainer title="03. Financial Burn Rate vs. Infrastructure Cost">
          <div className="bg-slate-950 p-4 rounded border border-slate-800/50">
            <ResponsiveContainer width="100%" height={252}>
              <ComposedChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" align="right" />
                <Area type="monotone" dataKey="revenue" fill="#10B98110" stroke="#10B981" name="Monthly Revenue" strokeWidth={2} />
                <Line type="monotone" dataKey="cost" stroke="#F43F5E" strokeDasharray="4 4" name="Infra Burn Rate" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="04. Comparative Client Stack (Revenue vs Penalty Risk)">
          <div className="bg-slate-950 p-4 rounded border border-slate-800/50">
            <ResponsiveContainer width="100%" height={252}>
              <BarChart data={clients.map(c => ({
                name: c.name,
                revenue: c.groupB.monthly_subscription_fee_usd,
                penalty: c.kpis.sla_penalty_owed_usd
              }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" stackId="a" fill="#10B981" name="Net Revenue" radius={[0, 0, 0, 0]} />
                <Bar dataKey="penalty" stackId="a" fill="#F43F5E" name="SLA Debt" radius={[2, 2, 0, 0]} />
                <Legend verticalAlign="top" align="right" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* 4. Attack Impact Score */}
        <ChartContainer title="04. Stealth Security Effectiveness">
          <div className="bg-slate-950 p-4 rounded border border-slate-800/50 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={attackData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area yAxisId="left" dataKey="attacks" fill="#6366F110" stroke="#6366F1" name="Blocked Attacks" />
                <Line yAxisId="right" dataKey="csat" stroke="#FBBF24" strokeWidth={2} name="Client Satisfaction" dot={{ r: 4, fill: '#FBBF24' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* 6. Ghost Ship Index */}
        <ChartContainer title="06. Ghost Ship Index (Infinite Loops)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clients.map(c => ({ name: c.name, waste: c.kpis.ghost_ship_wasted_money_usd }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="waste" radius={[2, 2, 0, 0]}>
                {clients.map((c, index) => (
                  <Cell key={`cell-${index}`} fill={c.kpis.ghost_ship_wasted_money_usd > 0 ? '#F43F5E' : '#334155'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {clients.some(c => c.kpis.ghost_ship_wasted_money_usd > 0) && (
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded flex items-center gap-3">
              <Ghost className="text-rose-500" size={16} />
              <span className="text-[10px] text-rose-400 font-mono font-bold uppercase tracking-widest">SRV_CRITICAL: Infinite Loop on account_{clients.find(c => c.kpis.ghost_ship_wasted_money_usd > 0)?.id}</span>
            </div>
          )}
        </ChartContainer>
      </div>

      {/* 05. Enterprise Upsell Trigger */}
      <div className="technical-card border-slate-800">
        <div className="px-6 py-4 bg-indigo-600/10 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket size={18} className="text-indigo-400" />
            <span className="data-label text-indigo-100 italic">05. Enterprise Upsell Trigger Center</span>
          </div>
          <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest">HIGH_CONVERSION_PIPELINE</span>
        </div>
        <div className="p-0 overflow-hidden">
          <table className="w-full text-left text-xs bg-slate-950">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest">Client Identity</th>
                <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest">CPU Limit</th>
                <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest">CSAT Score</th>
                <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest text-right">Expansion Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clients.filter(c => c.kpis.enterprise_upsell_triggered).map(c => (
                <tr key={c.id} className="hover:bg-indigo-500/5 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-200"># {c.id} - {c.name.toUpperCase()}</td>
                  <td className="px-8 py-5 font-mono text-rose-400 font-black">{c.groupA.cpu_usage_percent}% LOAD</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      {c.groupB.customer_satisfaction_score} / 5.0
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                      Push to Salesforce
                    </button>
                  </td>
                </tr>
              ))}
              {clients.filter(c => c.kpis.enterprise_upsell_triggered).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-slate-600 font-mono italic">Scanning for scaling opportunities...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 07. System Instability Alert */}
      <div className="technical-card border-rose-500/30 bg-rose-500/5">
        <div className="px-6 py-3 border-b border-rose-500/20 bg-rose-950/20 text-rose-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert size={18} />
            <span className="font-black text-xs uppercase tracking-[0.2em]">07. Churn Prevention Protocol (Critical Intervention)</span>
          </div>
          <span className="px-2 py-0.5 bg-rose-600 text-white text-[9px] font-bold rounded animate-pulse">ACTION_REQUIRED</span>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            {clients.filter(c => c.kpis.system_instability_alert).map(c => (
              <div key={c.id} className="flex items-center justify-between p-6 bg-slate-950 border border-rose-500/20 rounded-lg group hover:border-rose-500/50 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/30 group-hover:bg-rose-500/20 transition-all">
                    <Skull size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-100 tracking-tight">{c.name}</h4>
                    <div className="flex gap-4 mt-2 font-mono text-[10px]">
                      <span className="text-rose-500 uppercase">Crashes: {c.groupA.error_500_count}</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-amber-500 uppercase">Renewal: T- {c.groupB.days_until_renewal} Days</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[9px] text-slate-500 font-mono uppercase mb-1">Retention Risk</p>
                    <p className="text-sm font-bold text-rose-100 uppercase tracking-tighter">Extreme Velocity</p>
                  </div>
                  <button className="bg-rose-600/20 border border-rose-500 text-rose-400 px-6 py-3 rounded text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-lg shadow-rose-900/20">
                    Deploy Engineering Direct
                  </button>
                </div>
              </div>
            ))}
            {clients.filter(c => c.kpis.system_instability_alert).length === 0 && (
              <div className="text-slate-600 text-center py-8 font-mono italic flex flex-col items-center gap-3">
                <CheckCircle2 size={32} className="text-emerald-500/30" />
                <span>ENVIRONMENT STABLE: NO CRITICAL CHURN ALERTS</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExecutiveKPIsView;
