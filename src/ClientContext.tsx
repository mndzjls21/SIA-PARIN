import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Client, GroupAData, GroupBData } from './types';
import { toast } from 'sonner';

interface ClientContextType {
  clients: Client[];
  updateClientA: (id: string, data: Partial<GroupAData>) => Promise<void>;
  updateClientB: (id: string, data: Partial<GroupBData>) => Promise<void>;
  softDeleteClient: (id: string) => Promise<void>;
  seedData: (newClients: Client[]) => Promise<void>;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  isSyncing: boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClients(data);
          if (data.length > 0 && !selectedClientId) {
            setSelectedClientId(data[0].id);
          }
        }
      })
      .catch(err => console.error("Failed to load clients:", err));
  }, []); // Only run on mount

  const activeClients = useMemo(() => clients.filter(c => c.is_active), [clients]);

  const updateClientA = useCallback(async (id: string, data: Partial<GroupAData>) => {
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/clients/${id}/groupA`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedClient = await response.json();
      
      setClients(prev => prev.map(client => client.id === id ? updatedClient : client));
      
      toast.info(`Infrastructure Update Synced`, {
        description: `Group A telemetry for account_${id} updated in Database C`
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync Group A update');
    }
    setIsSyncing(false);
  }, []);

  const updateClientB = useCallback(async (id: string, data: Partial<GroupBData>) => {
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/clients/${id}/groupB`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedClient = await response.json();

      setClients(prev => prev.map(client => client.id === id ? updatedClient : client));
      
      toast.success(`Revenue Metrics Synced`, {
        description: `Group B financial logic for account_${id} updated in Database C`
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync Group B update');
    }
    setIsSyncing(false);
  }, []);

  const softDeleteClient = useCallback(async (id: string) => {
    setIsSyncing(true);
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      setClients(prev => prev.map(client => client.id === id ? { ...client, is_active: false } : client));
      toast.warning(`Client soft-deleted (is_active=false)`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete client');
    }
    setIsSyncing(false);
  }, []);

  const seedData = useCallback(async (newClients: Client[]) => {
    setIsSyncing(true);
    try {
      await fetch('/api/clients/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClients)
      });
      setClients(newClients);
      toast.success(`Seeding Complete`, {
        description: `${newClients.length} records processed into nexus_cluster_db`
      });
    } catch(error) {
      console.error(error);
      toast.error('Failed to seed data');
    }
    setIsSyncing(false);
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
