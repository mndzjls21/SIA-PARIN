import { Client, SubscriptionTier } from '../types';
import { calculateKPIs } from './engine';

const CLIENT_NAMES = [
  'Acme Corp', 'Globex Corporation', 'Soylent Corp', 'Initech', 'Umbrella Corp',
  'Hooli', 'Pied Piper', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems'
];

export const MOCK_CLIENTS: Client[] = CLIENT_NAMES.map((name, index) => {
  const id = (100 + index).toString();
  
  // Randomize some data for initial state
  const groupA = {
    client_account_id: id,
    cpu_usage_percent: Math.floor(Math.random() * 100),
    api_latency_ms: Math.floor(Math.random() * 800),
    downtime_minutes: Math.floor(Math.random() * 30),
    blocked_ddos_attacks: Math.floor(Math.random() * 2000),
    storage_used_gb: Math.floor(Math.random() * 5000),
    bandwidth_consumed_tb: Math.floor(Math.random() * 50),
    active_concurrent_users: Math.floor(Math.random() * 1000),
    error_500_count: Math.floor(Math.random() * 20),
  };

  const groupB = {
    client_account_id: id,
    monthly_subscription_fee_usd: [500, 1500, 5000][index % 3],
    support_tickets_open: Math.floor(Math.random() * 10),
    customer_satisfaction_score: Number((1 + Math.random() * 4).toFixed(1)),
    subscription_tier: [SubscriptionTier.BASIC, SubscriptionTier.PRO, SubscriptionTier.ENTERPRISE][index % 3],
    days_until_renewal: Math.floor(Math.random() * 365),
    client_acquisition_cost_usd: Math.floor(Math.random() * 2000),
    feature_requests_submitted: Math.floor(Math.random() * 15),
  };

  // Inject some specific scenarios for testing triggers
  if (index === 0) { // High Risk scenario
    groupA.api_latency_ms = 650;
    groupB.support_tickets_open = 5;
  }
  if (index === 1) { // Upsell scenario
    groupA.cpu_usage_percent = 97;
    groupB.support_tickets_open = 0;
    groupB.customer_satisfaction_score = 4.8;
  }
  if (index === 2) { // Ghost ship scenario
    groupA.active_concurrent_users = 0;
    groupA.cpu_usage_percent = 95;
  }
  if (index === 3) { // SLA Penalty scenario
    groupA.downtime_minutes = 25;
    groupB.subscription_tier = SubscriptionTier.ENTERPRISE;
  }

  return {
    id,
    name,
    groupA,
    groupB,
    kpis: calculateKPIs(groupA, groupB),
    is_active: true,
  };
});
