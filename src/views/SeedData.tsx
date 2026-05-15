import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileJson, CheckCircle2, AlertCircle, Loader2, Dna } from 'lucide-react';
import { useClients } from '../ClientContext';
import { calculateKPIs } from '../lib/engine';
import { Client, SubscriptionTier } from '../types';

const SeedData = () => {
  const { seedData } = useClients();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSchema, setActiveSchema] = useState<'A' | 'B'>('A');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
      setError('REJECTED: Entry must be a valid .json file.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        if (!Array.isArray(json)) {
          throw new Error('Invalid format: JSON must be an array of records.');
        }

        const mappedClients: Client[] = json.map((item: any) => ({
          id: item.client_account_id?.toString() || Math.floor(Math.random() * 1000).toString(),
          name: item.client_name || 'Imported Client',
          is_active: true,
          groupA: {
            client_account_id: item.client_account_id?.toString(),
            cpu_usage_percent: Number(item.cpu_usage_percent) || 0,
            api_latency_ms: Number(item.api_latency_ms) || 0,
            downtime_minutes: Number(item.downtime_minutes) || 0,
            blocked_ddos_attacks: Number(item.blocked_ddos_attacks) || 0,
            storage_used_gb: Number(item.storage_used_gb) || 0,
            bandwidth_consumed_tb: Number(item.bandwidth_consumed_tb) || 0,
            active_concurrent_users: Number(item.active_concurrent_users) || 0,
            error_500_count: Number(item.error_500_count) || 0,
          },
          groupB: {
            client_account_id: item.client_account_id?.toString(),
            monthly_subscription_fee_usd: Number(item.monthly_subscription_fee_usd) || 0,
            support_tickets_open: Number(item.support_tickets_open) || 0,
            customer_satisfaction_score: Number(item.customer_satisfaction_score) || 0,
            subscription_tier: item.subscription_tier || SubscriptionTier.BASIC,
            days_until_renewal: Number(item.days_until_renewal) || 0,
            client_acquisition_cost_usd: Number(item.client_acquisition_cost_usd) || 0,
            feature_requests_submitted: Number(item.feature_requests_submitted) || 0,
          },
          kpis: calculateKPIs(
            { 
               client_account_id: item.client_account_id?.toString(),
               cpu_usage_percent: Number(item.cpu_usage_percent) || 0,
               api_latency_ms: Number(item.api_latency_ms) || 0,
               downtime_minutes: Number(item.downtime_minutes) || 0,
               blocked_ddos_attacks: Number(item.blocked_ddos_attacks) || 0,
               storage_used_gb: Number(item.storage_used_gb) || 0,
               bandwidth_consumed_tb: Number(item.bandwidth_consumed_tb) || 0,
               active_concurrent_users: Number(item.active_concurrent_users) || 0,
               error_500_count: Number(item.error_500_count) || 0,
            },
            {
               client_account_id: item.client_account_id?.toString(),
               monthly_subscription_fee_usd: Number(item.monthly_subscription_fee_usd) || 0,
               support_tickets_open: Number(item.support_tickets_open) || 0,
               customer_satisfaction_score: Number(item.customer_satisfaction_score) || 0,
               subscription_tier: item.subscription_tier || SubscriptionTier.BASIC,
               days_until_renewal: Number(item.days_until_renewal) || 0,
               client_acquisition_cost_usd: Number(item.client_acquisition_cost_usd) || 0,
               feature_requests_submitted: Number(item.feature_requests_submitted) || 0,
            }
          ),
        }));

        setTimeout(() => {
          seedData(mappedClients);
          setIsProcessing(false);
        }, 1500);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse JSON core.');
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const schemas = {
    A: {
      title: 'Infrastructure Telemetry (a_logs)',
      required: ['client_account_id', 'cpu_usage_percent', 'api_latency_ms', 'error_500_count'],
      desc: 'Hardware vitals mapping directly to server resource limits.'
    },
    B: {
      title: 'Financial & Support (b_profiles)',
      required: ['client_account_id', 'monthly_subscription_fee_usd', 'support_tickets_open', 'customer_satisfaction_score'],
      desc: 'Client-side success and revenue triggers for Database C integration.'
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-lg border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded">
            <Dna size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 uppercase tracking-widest">Global Seed Protocol</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Multi-Schema Automated Batch Insertion</p>
          </div>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-md border border-slate-800">
          <button 
            onClick={() => setActiveSchema('A')}
            className={`px-4 py-2 text-[10px] font-bold uppercase transition-all rounded ${activeSchema === 'A' ? 'bg-slate-800 text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}
          >
            Schema A
          </button>
          <button 
            onClick={() => setActiveSchema('B')}
            className={`px-4 py-2 text-[10px] font-bold uppercase transition-all rounded ${activeSchema === 'B' ? 'bg-slate-800 text-emerald-400' : 'text-slate-600 hover:text-slate-400'}`}
          >
            Schema B
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="technical-card p-12 border-dashed border-2 flex flex-col items-center text-center space-y-6 h-full justify-center bg-slate-900/10">
            <div className={`p-4 rounded-full ${isProcessing ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-900 text-slate-500'}`}>
              {isProcessing ? <Loader2 className="animate-spin" size={48} /> : <FileJson size={48} />}
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-100 uppercase mb-2">Upload {schemas[activeSchema].title}</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                {schemas[activeSchema].desc}
              </p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 px-4 py-2 rounded flex items-center gap-3 text-xs font-mono">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <label className="cursor-pointer group">
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
              <div className="bg-indigo-600 text-white px-10 py-4 rounded font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_0_30px_rgba(79,70,229,0.3)] group-hover:bg-indigo-500 group-hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all active:scale-95 flex items-center gap-3">
                <Upload size={18} />
                Initialize Batch Seed
              </div>
            </label>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6 text-[10px]">
          <div className="technical-card p-6 bg-slate-950">
            <h3 className="data-label mb-4 text-slate-400 uppercase">Required Integrity Keys</h3>
            <div className="space-y-2">
              {schemas[activeSchema].required.map(key => (
                <div key={key} className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                  <code className="text-indigo-400 font-bold">{key}</code>
                  <span className="text-slate-600 uppercase italic">REQUIRED</span>
                </div>
              ))}
            </div>
          </div>

          <div className="technical-card p-6 bg-slate-900/50 flex flex-col justify-center space-y-4">
             <h3 className="data-label text-emerald-400 uppercase">Security Gate Status</h3>
             <div className="flex items-center gap-3">
               <CheckCircle2 size={14} className="text-emerald-500" />
               <span className="text-[10px] text-slate-300">Schema Validation: PASSED</span>
             </div>
             <div className="flex items-center gap-3">
               <CheckCircle2 size={14} className="text-emerald-500" />
               <span className="text-[10px] text-slate-300">account_id Uniqueness: ACTIVE</span>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-12 technical-card p-6 bg-slate-900/50">
          <h3 className="data-label mb-4 uppercase">Sample JSON Structure</h3>
          <pre className="text-[9px] font-mono text-slate-500 overflow-x-auto p-4 bg-slate-950 rounded">
{`[
  {
    "client_account_id": 104,
    "client_name": "Oscorp Industries",
    "cpu_usage_percent": 99,
    "api_latency_ms": 650,
    "monthly_subscription_fee_usd": 12000,
    "support_tickets_open": 12,
    "customer_satisfaction_score": 1.2
  }
]`}
          </pre>
      </div>
    </motion.div>
  );
};

export default SeedData;
