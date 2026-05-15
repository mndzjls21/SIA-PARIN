import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowUpDown, Filter, ChevronRight, Download, Table as TableIcon } from 'lucide-react';
import { useClients } from '../ClientContext';

const DataMatrix = () => {
  const { clients } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const flatData = useMemo(() => {
    return clients.map(c => ({
      id: c.id,
      name: c.name,
      cpu: c.groupA.cpu_usage_percent,
      latency: c.groupA.api_latency_ms,
      revenue: c.groupB.monthly_subscription_fee_usd,
      tickets: c.groupB.support_tickets_open,
      csat: c.groupB.customer_satisfaction_score,
      risk: c.kpis.churn_risk_level,
      penalty: c.kpis.sla_penalty_owed_usd,
    }));
  }, [clients]);

  const sortedData = useMemo(() => {
    let sortableData = [...flatData];
    if (searchTerm) {
      sortableData = sortableData.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.id.includes(searchTerm)
      );
    }
    if (sortConfig !== null) {
      sortableData.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [flatData, sortConfig, searchTerm]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tighter">Database Matrix Analysis</h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">Direct unaggregated row query (Read-Only Access)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Query account_id or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-slate-200 w-64 focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
            />
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-slate-100 transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="technical-card overflow-hidden border-slate-800 bg-slate-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                {[
                  { label: 'account_id', key: 'id' },
                  { label: 'identity', key: 'name' },
                  { label: 'cpu%', key: 'cpu' },
                  { label: 'ms_latency', key: 'latency' },
                  { label: 'usd_revenue', key: 'revenue' },
                  { label: 'tix_vol', key: 'tickets' },
                  { label: 'csat_idx', key: 'csat' },
                  { label: 'risk_state', key: 'risk' },
                  { label: 'sla_debt', key: 'penalty' },
                ].map((col) => (
                  <th 
                    key={col.key}
                    onClick={() => requestSort(col.key)}
                    className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <ArrowUpDown size={10} className={sortConfig?.key === col.key ? 'text-indigo-400' : 'opacity-20'} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sortedData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/30 transition-colors group">
                  <td className="px-6 py-4 font-mono text-slate-500">#{row.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-200">{row.name}</td>
                  <td className="px-6 py-4 font-mono text-rose-400">{row.cpu}%</td>
                  <td className="px-6 py-4 font-mono text-indigo-400">{row.latency}ms</td>
                  <td className="px-6 py-4 text-emerald-400">${row.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">{row.tickets}</td>
                  <td className="px-6 py-4 font-mono">{row.csat}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                      row.risk === 'High Risk' ? 'bg-rose-500/20 text-rose-500' : 
                      row.risk === 'Medium Risk' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-rose-500">-${row.penalty.toLocaleString()}</td>
                </tr>
              ))}
              {sortedData.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-20 text-center text-slate-600 font-mono italic">
                    <Filter size={32} className="mx-auto mb-4 opacity-20" />
                    No records matched the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-slate-900/30 border-t border-slate-800 flex justify-between items-center">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Showing {sortedData.length} records in current buffer</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_currentColor]" />
            <span className="text-[10px] font-mono text-emerald-500/50 uppercase">Synched with Cluster B</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataMatrix;
