import { GroupAData, GroupBData, ExecutiveKPIs, SubscriptionTier } from '../types';

export function calculateKPIs(a: GroupAData, b: GroupBData): ExecutiveKPIs {
  // 1. Churn Risk Predictor
  let churnRisk: ExecutiveKPIs['churn_risk_level'] = 'Safe';
  if (a.api_latency_ms > 500 && b.support_tickets_open >= 3) {
    churnRisk = 'High Risk';
  } else if (b.support_tickets_open > 0) {
    churnRisk = 'Medium Risk';
  }

  // 2. SLA Penalty Cost
  let slaPenalty = 0;
  if (a.downtime_minutes > 15) {
    slaPenalty = b.monthly_subscription_fee_usd * 0.1;
  }

  // 3. Resource Profitability Margin
  let profitability: ExecutiveKPIs['resource_profitability_status'] = 'Profitable';
  if (a.cpu_usage_percent > 80 && b.monthly_subscription_fee_usd < 1000) {
    profitability = 'Parasite Client';
  }

  // 4. Attack Impact Score
  let attackImpact: ExecutiveKPIs['attack_impact_score'] = 'Normal';
  if (a.blocked_ddos_attacks > 1000) {
    if (b.customer_satisfaction_score < 3.0) {
      attackImpact = 'Critical Failure';
    } else if (b.customer_satisfaction_score >= 4.0) {
      attackImpact = 'Invisible Defense';
    }
  }

  // 5. Enterprise Upsell Trigger
  const upsellTriggered = a.cpu_usage_percent > 95 && b.support_tickets_open === 0 && b.customer_satisfaction_score >= 4.5;

  // 6. Ghost Ship Index
  let ghostShipWasted = 0;
  if (a.active_concurrent_users === 0 && a.cpu_usage_percent > 90) {
    ghostShipWasted = 500;
  }

  // 7. System Instability Cost
  const instabilityAlert = a.error_500_count > 10 && b.days_until_renewal < 30;

  return {
    client_account_id: a.client_account_id,
    churn_risk_level: churnRisk,
    sla_penalty_owed_usd: slaPenalty,
    resource_profitability_status: profitability,
    attack_impact_score: attackImpact,
    enterprise_upsell_triggered: upsellTriggered,
    ghost_ship_wasted_money_usd: ghostShipWasted,
    system_instability_alert: instabilityAlert,
  };
}
