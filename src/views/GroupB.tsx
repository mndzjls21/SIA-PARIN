import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  Ticket, 
  Smile, 
  Award, 
  Calendar, 
  TrendingUp, 
  MessageSquare,
  Package,
  Database,
  Zap,
  Loader2,
  CheckCircle2,
  ArrowRight
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const GroupB = () => {
  const { clients, selectedClientId, updateClientB } = useClients();
  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const [formData, setFormData] = useState({
    revenue: selectedClient?.groupB.monthly_subscription_fee_usd || 0,
    tickets: selectedClient?.groupB.support_tickets_open || 0,
    csat: selectedClient?.groupB.customer_satisfaction_score || 0
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    setStatus('loading');
    try {
      await updateClientB(selectedClient.id, {
        monthly_subscription_fee_usd: Number(formData.revenue),
        support_tickets_open: Number(formData.tickets),
        customer_satisfaction_score: Number(formData.csat)
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
    { label: 'Monthly Revenue', value: `$${selectedClient.groupB.monthly_subscription_fee_usd.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Support Tickets', value: selectedClient.groupB.support_tickets_open, icon: Ticket, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Satisfaction (CSAT)', value: `${selectedClient.groupB.customer_satisfaction_score}/5.0`, icon: Smile, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Subscription Tier', value: selectedClient.groupB.subscription_tier, icon: Award, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Days to Renewal', value: selectedClient.groupB.days_until_renewal, icon: Calendar, color: 'text-slate-300', bg: 'bg-slate-800/50' },
    { label: 'Acq. Cost (CAC)', value: `$${selectedClient.groupB.client_acquisition_cost_usd.toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Feature Requests', value: selectedClient.groupB.feature_requests_submitted, icon: MessageSquare, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  const tierData = [
    { name: 'Basic', value: clients.filter(c => c.groupB.subscription_tier === 'Basic').length },
    { name: 'Pro', value: clients.filter(c => c.groupB.subscription_tier === 'Pro').length },
    { name: 'Enterprise', value: clients.filter(c => c.groupB.subscription_tier === 'Enterprise').length },
  ];

  const TIER_COLORS = ['#94A3B8', '#6366F1', '#141414'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 uppercase">Client Success & Revenue</h2>
          <p className="text-xs font-mono text-slate-500">Business Strategy & Financial Command (Group B)</p>
        </div>
        <div className="technical-card px-4 py-2 bg-indigo-600/10 border-indigo-500/30 text-indigo-400">
          <span className="text-[10px] font-mono font-bold tracking-widest">FINANCIAL Q2 SUMMARY</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN: SOURCE DATA PREVIEWS */}
        <div className="col-span-3 space-y-4">
          <div className="technical-card p-4 border-slate-800 bg-slate-900/20">
            <h3 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
              LOCAL_CACHE (DB_B)
              <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_theme(colors.emerald.500)]" />
            </h3>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between border-b border-slate-800/50 pb-1">
                <span className="text-slate-600">acq_cost</span>
                <span className="text-slate-300 font-bold">${selectedClient.groupB.client_acquisition_cost_usd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/50 pb-1">
                <span className="text-slate-600">renewal_t_minus</span>
                <span className="text-slate-300">{selectedClient.groupB.days_until_renewal} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">feature_reqs</span>
                <span className="text-slate-300">{selectedClient.groupB.feature_requests_submitted}</span>
              </div>
            </div>
          </div>

          <div className="technical-card p-4 border-slate-800 bg-slate-950/50 opacity-60">
            <h3 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
              REMOTE_SHADOW (DB_A)
              <span className="text-[7px] bg-slate-800 px-1 rounded text-slate-500">READ_ONLY</span>
            </h3>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between border-b border-slate-800/50 pb-1">
                <span className="text-slate-600">cpu_load</span>
                <span className="text-slate-400 font-bold">{selectedClient.groupA.cpu_usage_percent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">latency_ms</span>
                <span className="text-slate-400 font-bold">{selectedClient.groupA.api_latency_ms}ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: TABLE DB_C SYNTHESIS */}
        <div className="col-span-5">
          <div className="technical-card h-full border-slate-700 bg-slate-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]">
            <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-emerald-400" />
                <h3 className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest">Synthesis Output (Table C)</h3>
              </div>
              <span className="text-[8px] font-mono text-emerald-500/50 animate-pulse">L7_RELATIONAL_SYNC</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                  <p className="text-[8px] font-mono text-slate-500 uppercase mb-1">LOYALTY_MATRIX</p>
                  <p className={`text-xl font-black ${selectedClient.kpis.churn_risk_level === 'High Risk' ? 'text-rose-500 font-bold' : 'text-emerald-500'}`}>
                    {selectedClient.kpis.churn_risk_level}
                  </p>
                </div>
                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                  <p className="text-[8px] font-mono text-slate-500 uppercase mb-1">SLA_PENALTY_EXPOSURE</p>
                  <p className="text-xl font-black text-rose-500">
                   -${selectedClient.kpis.sla_penalty_owed_usd.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/5 rounded border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono text-emerald-300 italic">Enterprise Upsell Potential:</p>
                  <span className={`px-2 py-0.5 text-[8px] font-bold rounded ${selectedClient.kpis.enterprise_upsell_triggered ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    {selectedClient.kpis.enterprise_upsell_triggered ? 'READY' : 'PENDING'}
                  </span>
                </div>
                <p className="text-[9px] font-mono text-slate-500">
                   {selectedClient.kpis.enterprise_upsell_triggered 
                     ? "CPU load and CSAT are optimal for tier expansion protocol." 
                     : "Thresholds not met for expansion proposal."}
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <p className="text-[8px] font-mono text-slate-500 uppercase mb-2">Business Trigger Logic:</p>
                <div className="space-y-1 text-[9px] font-mono text-slate-600">
                   <p className="flex justify-between"><span>Revenue Retention:</span> <span className="text-slate-400">PASSED</span></p>
                   <p className="flex justify-between"><span>Support Impact:</span> <span className={selectedClient.groupB.support_tickets_open >= 3 ? 'text-rose-500' : 'text-emerald-500'}>{selectedClient.groupB.support_tickets_open >= 3 ? 'CRITICAL' : 'NOMINAL'}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MODULATION FIELDS */}
        <div className="col-span-4">
          <div className="technical-card p-6 bg-slate-900 border-emerald-500/20 h-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <h3 className="data-label mb-6 text-emerald-400">Modulation (DB_B Writes)</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Monthly Revenue ($)</label>
                <input 
                  type="number" 
                  value={formData.revenue} 
                  onChange={e => setFormData({...formData, revenue: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Support Tickets (Open)</label>
                <input 
                  type="number" 
                  value={formData.tickets} 
                  onChange={e => setFormData({...formData, tickets: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">CSAT Score (0-5)</label>
                <input 
                  type="number" 
                  step="0.1"
                  max="5"
                  min="0"
                  value={formData.csat} 
                  onChange={e => setFormData({...formData, csat: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : status === 'success' ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                {status === 'loading' ? 'PATCHING DB_B...' : status === 'success' ? 'LEDGER_SYNCED' : 'COMMIT WRITES'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <ChartContainer title="Subscription Segment Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tierData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {tierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TIER_COLORS[index % TIER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Support Pressure vs. CSAT Index">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clients.map(c => ({
              name: c.name,
              tickets: c.groupB.support_tickets_open,
              satisfaction: c.groupB.customer_satisfaction_score * 2
            }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="tickets" fill="#F43F5E" name="OPEN_TIX" radius={[2, 2, 0, 0]} />
              <Bar dataKey="satisfaction" fill="#F59E0B" name="CSAT_INDEX" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="technical-card border-slate-800">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <h3 className="data-label text-slate-400">Enterprise Feature Pipeline</h3>
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">Total Requests: {selectedClient.groupB.feature_requests_submitted}</span>
        </div>
        <div className="p-0 overflow-hidden">
          <table className="w-full text-left text-xs bg-slate-950">
            <thead className="bg-slate-900/50 border-b border-slate-800">
              <tr>
                <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest">Requirement</th>
                <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest">Severity</th>
                <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr className="hover:bg-slate-900/30 transition-colors">
                <td className="px-8 py-4 text-slate-300 font-medium font-mono">ID_{Math.random().toString(16).slice(2, 6).toUpperCase()} - APIv3 Multi-Region Auth</td>
                <td className="px-8 py-4"><span className="status-badge bg-rose-500/10 text-rose-500 border-rose-500/30">CRITICAL</span></td>
                <td className="px-8 py-4 text-slate-500 font-mono italic">Sprint Commit: Q2-W12</td>
              </tr>
              <tr className="hover:bg-slate-900/30 transition-colors">
                <td className="px-8 py-4 text-slate-300 font-medium font-mono">ID_{Math.random().toString(16).slice(2, 6).toUpperCase()} - SSO/SAML Custom Mapping</td>
                <td className="px-8 py-4"><span className="status-badge bg-indigo-500/10 text-indigo-400 border-indigo-500/30">DEFERRED</span></td>
                <td className="px-8 py-4 text-slate-500 font-mono italic">Architecture Review</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupB;
