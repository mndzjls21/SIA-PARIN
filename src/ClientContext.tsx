import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Client, GroupAData, GroupBData } from './types';
import { MOCK_CLIENTS } from './lib/mockData';
import { calculateKPIs } from './lib/engine';
import { toast } from 'sonner';

interface ClientContextType {
  clients: Client[];
  updateClientA: (id: string, data: Partial<GroupAData>) => Promise<void>;
  updateClientB: (id: string, data: Partial<GroupBData>) => Promise<void>;
  softDeleteClient: (id: string) => Promise<void>;
  seedData: (newClients: Client[]) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  isSyncing: boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter out soft-deleted clients for the UI
  const activeClients = useMemo(() => clients.filter(c => c.is_active), [clients]);

  const updateClientA = useCallback(async (id: string, data: Partial<GroupAData>) => {
    setIsSyncing(true);
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setClients(prev => prev.map(client => {
      if (client.id === id) {
        const newGroupA = { ...client.groupA, ...data };
        const newKPIs = calculateKPIs(newGroupA, client.groupB);
        
        // Notify other groups (simulation of Realtime)
        toast.info(`Infrastructure Update Synced`, {
          description: `Group A telemetry for account_${id} updated in Database C`
        });

        return {
          ...client,
          groupA: newGroupA,
          kpis: newKPIs
        };
      }
      return client;
    }));
    setIsSyncing(false);
  }, []);

  const updateClientB = useCallback(async (id: string, data: Partial<GroupBData>) => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setClients(prev => prev.map(client => {
      if (client.id === id) {
        const newGroupB = { ...client.groupB, ...data };
        const newKPIs = calculateKPIs(client.groupA, newGroupB);
        
        toast.success(`Revenue Metrics Synced`, {
          description: `Group B financial logic for account_${id} updated in Database C`
        });

        return {
          ...client,
          groupB: newGroupB,
          kpis: newKPIs
        };
      }
      return client;
    }));
    setIsSyncing(false);
  }, []);

  const softDeleteClient = useCallback(async (id: string) => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setClients(prev => prev.map(client => client.id === id ? { ...client, is_active: false } : client));
    setIsSyncing(false);
    toast.warning(`Client soft-deleted (is_active=false)`);
  }, []);

  const seedData = useCallback((newClients: Client[]) => {
    setClients(newClients);
    toast.success(`Seeding Complete`, {
      description: `${newClients.length} records processed into nexus_cluster_db`
    });
  }, []);

  const value = useMemo(() => ({
    clients: activeClients,
    updateClientA,
    updateClientB,
    softDeleteClient,
    seedData,
    selectedClientId,
    setSelectedClientId,
    isSyncing
  }), [activeClients, updateClientA, updateClientB, softDeleteClient, seedData, selectedClientId, isSyncing]);

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) throw new Error('useClients must be used within ClientProvider');
  return context;
};
