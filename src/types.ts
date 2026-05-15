export enum SubscriptionTier {
  BASIC = 'Basic',
  PRO = 'Pro',
  ENTERPRISE = 'Enterprise',
}

export interface GroupAData {
  client_account_id: string;
  cpu_usage_percent: number;
  api_latency_ms: number;
  downtime_minutes: number;
  blocked_ddos_attacks: number;
  storage_used_gb: number;
  bandwidth_consumed_tb: number;
  active_concurrent_users: number;
  error_500_count: number;
}

export interface GroupBData {
  client_account_id: string;
  monthly_subscription_fee_usd: number;
  support_tickets_open: number;
  customer_satisfaction_score: number;
  subscription_tier: SubscriptionTier;
  days_until_renewal: number;
  client_acquisition_cost_usd: number;
  feature_requests_submitted: number;
}

export interface ExecutiveKPIs {
  client_account_id: string;
  churn_risk_level: 'Safe' | 'Medium Risk' | 'High Risk';
  sla_penalty_owed_usd: number;
  resource_profitability_status: 'Profitable' | 'Parasite Client';
  attack_impact_score: 'Invisible Defense' | 'Critical Failure' | 'Normal';
  enterprise_upsell_triggered: boolean;
  ghost_ship_wasted_money_usd: number;
  system_instability_alert: boolean;
}

export interface Client {
  id: string;
  name: string;
  groupA: GroupAData;
  groupB: GroupBData;
  kpis: ExecutiveKPIs;
  is_active: boolean;
}
