import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dna, 
  Users, 
  Terminal, 
  Briefcase, 
  BarChart3, 
  ShieldAlert,
  Zap,
  Activity,
  Trash2,
  Database
} from 'lucide-react';
import { useClients } from '../ClientContext';

type Tab = 'infra' | 'business' | 'executive' | 'seed' | 'matrix';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { clients, selectedClientId, setSelectedClientId, softDeleteClient } = useClients();

  const navItems = [
    { id: 'infra', label: 'Infrastructure', icon: Terminal, group: 'Group A' },
    { id: 'business', label: 'Client Success', icon: Briefcase, group: 'Group B' },
    { id: 'executive', label: 'Executive KPIs', icon: BarChart3, group: 'Database C' },
    { id: 'matrix', label: 'Data Matrix', icon: Database, group: 'Analytics' },
    { id: 'seed', label: 'Seed Engine', icon: Dna, group: 'Admin' },
  ] as const;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Execute soft-deletion protocol? Record persists but will be excluded from the fronted matrix (is_active=false).')) {
      softDeleteClient(id);
    }
  };

  return (
    <div className="w-72 bg-slate-950 border-r border-slate-800 h-screen flex flex-col sticky top-0 shrink-0">
      <div className="p-6 border-b border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Zap size={20} fill="currentColor" />
          </div>
          <h1 className="font-bold text-sm tracking-widest text-slate-100 uppercase">NEXUS COMMAND</h1>
        </div>
        <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">System Integration v1.0</p>
      </div>

      <div className="px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${
              activeTab === item.id 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                : 'text-slate-500 hover:bg-slate-900'
            }`}
          >
            <item.icon size={16} />
            <div className="flex flex-col items-start leading-none">
              <span>{item.label}</span>
              <span className="text-[8px] text-slate-600 mt-0.5">
                {item.group}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto px-4 py-6 border-t border-slate-800 bg-slate-900/10">
        <h3 className="px-4 mb-4 text-[9px] text-slate-500 font-mono tracking-widest uppercase">Active Client Segments</h3>
        <div className="space-y-1 max-h-[40vh] overflow-y-auto custom-scrollbar">
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className={`w-full group flex items-center justify-between px-4 py-2.5 rounded text-[10px] transition-colors border cursor-pointer ${
                selectedClientId === client.id 
                  ? 'bg-slate-800 border-slate-700 text-slate-100' 
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className={`shrink-0 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${
                  client.kpis.churn_risk_level === 'High Risk' ? 'bg-rose-500 animate-pulse' : 
                  client.kpis.churn_risk_level === 'Medium Risk' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <span className="truncate">{client.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono opacity-20 group-hover:opacity-40 transition-opacity">#{client.id}</span>
                <button 
                  onClick={(e) => handleDelete(e, client.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
