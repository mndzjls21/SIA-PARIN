import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  Clock, 
  ShieldCheck, 
  HardDrive, 
  Globe, 
  Users, 
  AlertCircle,
  Database,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Activity,
  Terminal,
  ShieldAlert,
  Search
} from 'lucide-react';
import { useClients } from '../ClientContext';
import { ChartContainer, CustomTooltip } from '../components/Charts';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart,
  Area,
  Line,
  Legend,
  PieChart,
  Pie
} from 'recharts';

const GroupA = () => {
  const { clients, selectedClientId, setSelectedClientId, updateClientA } = useClients();
  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  
  const [formData, setFormData] = useState({
    cpu: selectedClient?.groupA.cpu_usage_percent || 0,
    latency: selectedClient?.groupA.api_latency_ms || 0,
    errors: selectedClient?.groupA.error_500_count || 0,
    attacks: selectedClient?.groupA.blocked_ddos_attacks || 0
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    setStatus('loading');
    try {
      await updateClientA(selectedClient.id, {
        cpu_usage_percent: Number(formData.cpu),
        api_latency_ms: Number(formData.latency),
        error_500_count: Number(formData.errors),
        blocked_ddos_attacks: Number(formData.attacks)
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
    }
  };

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-600 font-mono uppercase tracking-[0.3em]">
        <Database size={48} className="mb-4 opacity-20" />
        Awaiting Data Sync
      </div>
    );
  }

  // 1. Churn Risk Matrix Data (Latency vs Tickets vs 500s)
  const churnData = clients.map(c => ({
    name: c.name,
    latency: c.groupA.api_latency_ms,
    tickets: c.groupB.support_tickets_open,
    errors: c.groupA.error_500_count,
    risk: c.kpis.churn_risk_level,
    isSelected: c.id === selectedClient.id
  }));

  // 2. Attack Impact Data (Attacks vs CSAT)
  // Generating some "historical" noise for the selected client to show the time-series effect as requested
  const attackHistoryData = Array.from({ length: 12 }).map((_, i) => {
    const isBaseline = i < 8;
    const attacks = isBaseline ? Math.random() * 200 : 1000 + Math.random() * 500;
    const csat = isBaseline ? 4.5 + Math.random() * 0.5 : 4.4 + Math.random() * 0.4;
    return {
      period: `T-${12-i}h`,
      attacks,
      csat
    };
  });

  const topKPIs = [
    { label: 'Avg Latency', value: `${selectedClient.groupA.api_latency_ms}ms`, icon: Zap, status: selectedClient.groupA.api_latency_ms > 500 ? 'critical' : 'safe' },
    { label: 'Total 500s', value: selectedClient.groupA.error_500_count, icon: AlertCircle, status: selectedClient.groupA.error_500_count > 10 ? 'critical' : 'safe' },
    { label: 'DDoS Blocked', value: selectedClient.groupA.blocked_ddos_attacks.toLocaleString(), icon: ShieldAlert, status: 'info' },
    { label: 'Downtime', value: `${selectedClient.groupA.downtime_minutes}m`, icon: Clock, status: selectedClient.groupA.downtime_minutes > 0 ? 'warning' : 'safe' },
  ];

  const getStatusColors = (status: string) => {
    switch(status) {
      case 'critical': return 'border-l-rose-500 text-rose-500';
      case 'warning': return 'border-l-amber-500 text-amber-500';
      case 'safe': return 'border-l-emerald-500 text-emerald-500';
      default: return 'border-l-blue-500 text-blue-400';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8 pb-20"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Terminal size={14} />
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">Infrastructure Node: {selectedClient.id}</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-100 uppercase">DevOps Command Center</h2>
          <p className="text-xs font-mono text-slate-500 italic">Site Reliability Engineering Matrix (Group A — DB_A Write Access)</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="technical-card px-4 py-2 bg-slate-900 border-slate-800 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest">Syslink_v4.2://Connected</span>
           </div>
        </div>
      </div>

      {/* Top Row: Client Overview */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {topKPIs.map((kpi) => (
            <div key={kpi.label} className={`technical-card p-6 bg-slate-900 border-slate-800 border-l-4 transition-all hover:scale-[1.02] ${getStatusColors(kpi.status)}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-950 rounded-lg">
                  <kpi.icon size={18} />
                </div>
                <span className="text-[8px] font-mono uppercase tracking-widest opacity-40">REAL_TIME</span>
              </div>
              <div className={`text-3xl font-black tracking-tighter mb-1`}>{kpi.value}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{kpi.label}</div>
            </div>
          ))}
        </div>
        
        {/* Single Client Churn Risk Gauge */}
        <div className="col-span-12 lg:col-span-4 technical-card p-4 bg-slate-900 border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="absolute top-4 left-4 text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest z-10">Client Churn Risk Level</h3>
          <div className="relative w-[200px] h-[100px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Safe', value: 1, color: '#10B981' },
                    { name: 'Medium', value: 1, color: '#F59E0B' },
                    { name: 'High', value: 1, color: '#F43F5E' },
                  ]}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {
                    [0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={['#10B981', '#F59E0B', '#F43F5E'][index]} />
                    ))
                  }
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Gauge Needle/Label Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
              <span className={`text-xl font-black uppercase tracking-widest ${selectedClient.kpis.churn_risk_level === 'High Risk' ? 'text-rose-500 animate-pulse' : selectedClient.kpis.churn_risk_level === 'Medium Risk' ? 'text-amber-500' : 'text-emerald-500'}`}>
                {selectedClient.kpis.churn_risk_level.split(' ')[0]}
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Risk Index</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between w-full px-8 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            <span>Safe</span>
            <span>Critical</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Primary KPI Visualizations */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
           <ChartContainer title="KPI 1: Churn Risk Predictor Matrix (Latency Correlation)">
            <div className="relative w-full h-[400px] bg-slate-950 rounded border border-slate-800 overflow-hidden shadow-2xl transition-all hover:shadow-blue-500/5">
               {/* Danger Zone Shading and Safe Zone Shading */}
               <div className="absolute top-0 right-0 w-[55%] h-[55%] bg-rose-500/10 border-l border-b border-rose-500/20 flex flex-col items-center justify-center pointer-events-none z-0 backdrop-blur-[1px]">
                 <span className="text-[10px] font-black text-rose-500/40 uppercase tracking-[0.5em] mb-1">⚠ Critical Zone</span>
                 <span className="text-[8px] font-mono text-rose-500/30 uppercase tracking-widest">High Latency + High Support</span>
               </div>
               <div className="absolute bottom-[30px] left-[30px] w-[45%] h-[45%] bg-emerald-500/5 border-r border-t border-emerald-500/20 flex flex-col items-center justify-center pointer-events-none z-0">
                 <span className="text-[10px] font-black text-emerald-500/30 uppercase tracking-[0.5em] mb-1">Safe Zone</span>
                 <span className="text-[8px] font-mono text-emerald-500/30 uppercase tracking-widest">Nominal Thresholds</span>
               </div>

               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-blue-500 uppercase tracking-widest z-10 drop-shadow-md">Telemetry Latency (DB_A)</div>
               <div className="absolute top-1/2 -left-14 -rotate-90 text-[9px] font-mono font-bold text-teal-500 uppercase tracking-widest z-10 drop-shadow-md">Support Tickets (DB_B)</div>

               <ResponsiveContainer width="100%" height="100%" className="z-10 relative">
                <ScatterChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis type="number" dataKey="latency" domain={[0, 1000]} hide />
                  <YAxis type="number" dataKey="tickets" domain={[0, 15]} hide />
                  <ZAxis type="number" dataKey="errors" range={[100, 1000]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter name="Managed Fleet" data={churnData}>
                    {churnData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.risk === 'High Risk' ? '#F43F5E' : entry.risk === 'Medium Risk' ? '#F59E0B' : '#3B82F6'}
                        stroke={entry.isSelected ? '#FFF' : 'none'}
                        strokeWidth={entry.isSelected ? 2 : 0}
                        className={entry.risk === 'High Risk' ? 'animate-pulse' : ''}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-between items-center text-[10px] font-mono">
              <div className="flex gap-4">
                <span className="text-rose-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> CRITICAL</span>
                <span className="text-emerald-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> NOMINAL</span>
              </div>
              <span className="text-slate-600 italic">Source: CROSS_DEPT_TRIGGERS (DB_C)</span>
            </div>
          </ChartContainer>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <ChartContainer title="KPI 2: Stealth Security Effectiveness (Attack Impact)">
            <div className="relative w-full h-[400px] bg-slate-950 rounded border border-slate-800 p-4 shadow-2xl transition-all hover:shadow-blue-500/5">
               {selectedClient.kpis.attack_impact_score === 'Invisible Defense' && (
                 <div className="absolute top-4 right-4 z-20 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                   <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">Invisible Defense Active</span>
                 </div>
               )}

               <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={attackHistoryData} margin={{ top: 20, right: 10, bottom: 0, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                  <XAxis dataKey="period" hide />
                  <YAxis yAxisId="left" tick={{ fill: '#3B82F6', fontSize: 9 }} tickFormatter={(v) => `${v} Atk`} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} tick={{ fill: '#14B8A6', fontSize: 9 }} tickFormatter={(v) => `${v} CSAT`} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="attacks" 
                    fill="rgba(59, 130, 246, 0.15)" 
                    stroke="#3B82F6" 
                    name="DDoS Volume (DB_A)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="csat" 
                    stroke="#14B8A6" 
                    strokeWidth={3}
                    dot={false}
                    name="Client Sat (DB_B)"
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-4 leading-relaxed">
              Ideal stealth state: High DDoS area spikes (<span className="text-blue-500 font-bold">Group A / Blue</span>) must correlate with flat user satisfaction lines (<span className="text-teal-500 font-bold">Group B / Teal</span>), proving perimeter invisibility.
            </p>
          </ChartContainer>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Command Center (Modulation) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="technical-card p-6 bg-slate-900 border-blue-500/20 h-full">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-blue-400" size={18} />
              <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">Modulation: DB_A Write Terminal</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">CPU Power Utilization (%)</label>
                  <input 
                    type="number" 
                    value={formData.cpu} 
                    onChange={e => setFormData({...formData, cpu: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2.5 text-sm text-slate-100 font-mono focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Telemetry Latency (ms)</label>
                  <input 
                    type="number" 
                    value={formData.latency} 
                    onChange={e => setFormData({...formData, latency: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2.5 text-sm text-slate-100 font-mono focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">500_CRASH_COUNT</label>
                    <input 
                      type="number" 
                      value={formData.errors} 
                      onChange={e => setFormData({...formData, errors: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2.5 text-sm text-slate-100 font-mono focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">BLOCKED_ATTACKS</label>
                    <input 
                      type="number" 
                      value={formData.attacks} 
                      onChange={e => setFormData({...formData, attacks: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2.5 text-sm text-slate-100 font-mono focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded flex items-center gap-2 text-rose-500 text-[10px] font-mono">
                    <AlertCircle size={14} />
                    PROTOCOL_ERROR: DATA_TYPES_MISMATCH
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 mt-4"
                >
                {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : status === 'success' ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                {status === 'loading' ? 'COMMITTING_WRITES...' : status === 'success' ? 'LEDGER_TX_DONE' : 'COMMIT_TELEMETRY'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="col-span-12 lg:col-span-8">
          <div className="technical-card h-full border-slate-800 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-slate-400" />
                <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Real-Time Event Stream</h3>
              </div>
              <span className="text-[8px] font-mono text-slate-600 tracking-tighter">SYSLOG_DAEMON_v4.2.0</span>
            </div>
            <div className="p-0 font-mono text-[10px] flex-grow bg-slate-950 overflow-hidden">
              <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-3">
                <div className="flex gap-4 p-3 bg-rose-500/5 border-l-2 border-rose-500">
                  <span className="text-rose-500 shrink-0">[15:42:10]</span>
                  <p className="text-slate-300 tracking-tight">
                    <span className="text-rose-400 font-bold">ALARM:</span> Cluster_ID_{selectedClient.id} reporting api_latency &gt; {selectedClient.groupA.api_latency_ms}ms. Immediate impact on Nexus_DB_C risk scores detected.
                  </p>
                </div>
                <div className="flex gap-4 p-3 bg-emerald-500/5 border-l-2 border-emerald-500">
                  <span className="text-emerald-500 shrink-0">[15:40:02]</span>
                  <p className="text-slate-400">
                    <span className="text-emerald-400 font-bold">INFO:</span> Handshake successful on node: {selectedClient.name}. Encrypted tunnel established via AES-256.
                  </p>
                </div>
                <div className="flex gap-4 p-3 border-l-2 border-slate-700">
                  <span className="text-slate-600 shrink-0">[15:38:55]</span>
                  <p className="text-slate-500 underline decoration-slate-800">
                    [WS] Real-time sync event caught from Database B: Client financial records patched by Group B.
                  </p>
                </div>
                <div className="flex gap-4 p-3 border-l-2 border-indigo-500/30">
                  <span className="text-indigo-500 shrink-0">[15:35:12]</span>
                  <p className="text-slate-400">
                    <span className="text-indigo-400 font-bold">NET:</span> ICMP Echo respond from Cluster_Origin_{selectedClient.id} in 12ms. Network stability within nominal range.
                  </p>
                </div>
                <div className="flex gap-4 p-3 bg-amber-500/5 border-l-2 border-amber-500">
                  <span className="text-amber-500 shrink-0">[15:32:44]</span>
                  <p className="text-slate-400">
                    <span className="text-amber-400 font-bold">SEC:</span> Firewall dropped 12 suspicious packets. Total blocked attacks for this session: {selectedClient.groupA.blocked_ddos_attacks}.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-slate-800 bg-slate-900/40 text-[9px] font-mono text-slate-600 flex justify-between uppercase">
               <span>Worker_Process: active (PID: 8421)</span>
               <span className="animate-pulse">Monitoring telemetry strings...</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupA;
