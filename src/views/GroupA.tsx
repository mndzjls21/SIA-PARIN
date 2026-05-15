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
  Loader2
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
  Cell
} from 'recharts';

const GroupA = () => {
  const { clients, selectedClientId, updateClientA } = useClients();
  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  
  const [formData, setFormData] = useState({
    cpu: selectedClient?.groupA.cpu_usage_percent || 0,
    latency: selectedClient?.groupA.api_latency_ms || 0,
    errors: selectedClient?.groupA.error_500_count || 0
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
        error_500_count: Number(formData.errors)
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

  const stats = [
    { label: 'CPU Usage', value: `${selectedClient.groupA.cpu_usage_percent}%`, icon: Cpu, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'API Latency', value: `${selectedClient.groupA.api_latency_ms}ms`, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Downtime', value: `${selectedClient.groupA.downtime_minutes}m`, icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/20' },
    { label: 'DDoS Blocks', value: selectedClient.groupA.blocked_ddos_attacks, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Storage Used', value: `${selectedClient.groupA.storage_used_gb}GB`, icon: HardDrive, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Bandwidth', value: `${selectedClient.groupA.bandwidth_consumed_tb}TB`, icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Conc. Users', value: selectedClient.groupA.active_concurrent_users, icon: Users, color: 'text-slate-300', bg: 'bg-slate-800/50' },
    { label: '500 Errors', value: selectedClient.groupA.error_500_count, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-900/20' },
  ];

  const barData = clients.map(c => ({
    name: c.name,
    cpu: c.groupA.cpu_usage_percent,
    latency: c.groupA.api_latency_ms,
    errors: c.groupA.error_500_count
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Infrastructure Health</h2>
          <p className="text-xs font-mono text-slate-500">Site Reliability Command Center (Group A)</p>
        </div>
        <div className="flex gap-4">
          <div className="technical-card px-4 py-2 flex items-center gap-2 border-emerald-500/30 bg-emerald-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-mono font-bold text-emerald-400">TELEMETRY_LINK: STABLE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN: SOURCE DATA PREVIEWS */}
        <div className="col-span-3 space-y-4">
          <div className="technical-card p-4 border-slate-800 bg-slate-900/20">
            <h3 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
              LOCAL_CACHE (DB_A)
              <span className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_5px_theme(colors.indigo.500)]" />
            </h3>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between border-b border-slate-800/50 pb-1">
                <span className="text-slate-600">active_users</span>
                <span className="text-slate-300">{selectedClient.groupA.active_concurrent_users}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/50 pb-1">
                <span className="text-slate-600">storage_gb</span>
                <span className="text-slate-300">{selectedClient.groupA.storage_used_gb}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">bandwidth_tb</span>
                <span className="text-slate-300">{selectedClient.groupA.bandwidth_consumed_tb}</span>
              </div>
            </div>
          </div>

          <div className="technical-card p-4 border-slate-800 bg-slate-950/50 opacity-60">
            <h3 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
              REMOTE_SHADOW (DB_B)
              <span className="text-[7px] bg-slate-800 px-1 rounded text-slate-500">READ_ONLY</span>
            </h3>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between border-b border-slate-800/50 pb-1">
                <span className="text-slate-600">monthly_rev</span>
                <span className="text-slate-400">${selectedClient.groupB.monthly_subscription_fee_usd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">open_tickets</span>
                <span className="text-slate-400">{selectedClient.groupB.support_tickets_open}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: TABLE DB_C SYNTHESIS */}
        <div className="col-span-5">
          <div className="technical-card h-full border-slate-700 bg-slate-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]">
            <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-indigo-400" />
                <h3 className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest">Synthesis Output (Table C)</h3>
              </div>
              <span className="text-[8px] font-mono text-indigo-500/50 animate-pulse">LIVE_AGGREGATION_ACTIVE</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                  <p className="text-[8px] font-mono text-slate-500 uppercase mb-1">CHURN_PROBABILITY</p>
                  <p className={`text-xl font-black ${selectedClient.kpis.churn_risk_level === 'High Risk' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {selectedClient.kpis.churn_risk_level}
                  </p>
                </div>
                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                  <p className="text-[8px] font-mono text-slate-500 uppercase mb-1">SLA_PENALTY_DEBT</p>
                  <p className="text-xl font-black text-rose-500">
                   -${selectedClient.kpis.sla_penalty_owed_usd.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">Resource Profitability</span>
                  <span className={`px-2 py-0.5 rounded ${selectedClient.kpis.resource_profitability_status === 'Profitable' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {selectedClient.kpis.resource_profitability_status.toUpperCase()}
                  </span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedClient.kpis.resource_profitability_status === 'Profitable' ? 85 : 30}%` }}
                    className={`h-full ${selectedClient.kpis.resource_profitability_status === 'Profitable' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-500/5 rounded border border-indigo-500/20">
                <p className="text-[10px] font-mono text-indigo-300 italic mb-2">Automated Trigger Evaluation:</p>
                <ul className="text-[9px] font-mono text-slate-500 space-y-1">
                  <li>• if (latency &gt; 500ms && tickets &gt;= 3) =&gt; CHURN_EVENT</li>
                  <li>• if (cpu &gt; 90%) =&gt; SCALE_REVENUE_TRIGGER</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MODULATION FIELDS */}
        <div className="col-span-4">
          <div className="technical-card p-6 bg-slate-900 border-indigo-500/20 h-full">
            <h3 className="data-label mb-6 text-indigo-400">Modulation (DB_A Writes)</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">CPU Load (%)</label>
                <input 
                  type="number" 
                  value={formData.cpu} 
                  onChange={e => setFormData({...formData, cpu: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">API Latency (ms)</label>
                <input 
                  type="number" 
                  value={formData.latency} 
                  onChange={e => setFormData({...formData, latency: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Fatal Errors (count)</label>
                <input 
                  type="number" 
                  value={formData.errors} 
                  onChange={e => setFormData({...formData, errors: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded shadow-lg shadow-indigo-900/40 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : status === 'success' ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                {status === 'loading' ? 'COMMITTING TO DB_A...' : status === 'success' ? 'TX_SUCCESSFUL' : 'COMMIT WRITES'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <ChartContainer title="Fleet CPU Utilization (%)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cpu">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cpu > 80 ? '#F43F5E' : '#6366F1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Network Latency Matrix (ms)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="latency">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.latency > 500 ? '#F59E0B' : '#0EA5E9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="technical-card border-slate-800">
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <h3 className="data-label text-slate-400">Kernel Log Stream</h3>
          <span className="text-[9px] font-mono text-slate-600">SYSLOG v4.2</span>
        </div>
        <div className="p-6 font-mono text-[10px] space-y-2 max-h-60 overflow-y-auto custom-scrollbar bg-slate-950">
          {selectedClient.groupA.error_500_count > 0 && (
            <div className="text-rose-500 bg-rose-500/5 p-1 border-l-2 border-rose-500">
              [CRITICAL] Error 500: Internal Server Failure on thread {Math.random().toString(16).slice(2, 8).toUpperCase()}
            </div>
          )}
          <div className="text-emerald-500/80">[INFO] Handshake successful: Port 443 active</div>
          <div className="text-indigo-400/80">[NET] ICMP Echo Server Response: 12ms</div>
          <div className="text-slate-500">[LOG] Bandwidth verified: {selectedClient.groupA.bandwidth_consumed_tb}TB transferred</div>
          <div className="text-amber-500/80">[SEC] Firewall: Dropped packet from unstable origin (Block count: {selectedClient.groupA.blocked_ddos_attacks})</div>
          <div className="text-slate-600">[DEBUG] GC Cycle completed in 4.2ms</div>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupA;
