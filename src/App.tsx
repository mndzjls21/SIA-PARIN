/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClientProvider } from './ClientContext';
import Sidebar from './components/Sidebar';
import GroupA from './views/GroupA';
import GroupB from './views/GroupB';
import ExecutiveDashboard from './views/ExecutiveDashboard';
import SeedData from './views/SeedData';
import DataMatrix from './views/DataMatrix';
import { Toaster } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'infra' | 'business' | 'executive' | 'seed' | 'matrix'>('executive');

  return (
    <ClientProvider>
      <Toaster position="bottom-right" theme="dark" richColors />
      <div className="flex min-h-screen bg-slate-950 text-slate-200">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 min-w-0 h-screen overflow-y-auto custom-scrollbar">
          <header className="h-16 bg-slate-900/50 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Global Status</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">99.98% System Integrity</span>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Environment</span>
                <span className="text-xs font-mono text-slate-100 uppercase tracking-tighter">US-EAST-1 PROD</span>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">Cross-Mapped ID</p>
                <p className="text-xs font-mono text-indigo-400">client_account_id=MATCHED</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95">
                Refresh Matrix
              </button>
            </div>
          </header>

          <div className="max-w-[1600px] mx-auto p-4">
            {activeTab === 'infra' && <GroupA />}
            {activeTab === 'business' && <GroupB />}
            {activeTab === 'executive' && <ExecutiveDashboard />}
            {activeTab === 'seed' && <SeedData />}
            {activeTab === 'matrix' && <DataMatrix />}
          </div>

          <footer className="h-8 border-t border-slate-800/50 flex items-center justify-between px-8 text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em]">
             <span>Nexus Control: Synapse Protocol Active</span>
             <span>© 2026 Nexus B2B Systems</span>
          </footer>
        </main>
      </div>
    </ClientProvider>
  );
}

