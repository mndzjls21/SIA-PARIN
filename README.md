# System Integration Dashboard

## Overview

This application serves as a comprehensive dashboard for tracking and correlating technical infrastructure metrics with business & customer success KPIs. It effectively bridges the gap between DevOps and Account Management.

The application is divided into three primary logical subsystems:

### 1. Group A: DevOps & Infrastructure
The **DevOps & Infrastructure** perspective. The objective here is to ensure the hardware is fast, online, and secure.
- Tracks metrics like `cpu_usage_percent`, `api_latency_ms`, `downtime_minutes`, `blocked_ddos_attacks`, etc.
- **KPI 1: Churn Risk Predictor Matrix**: Correlates Group A's API latency and error counts with Group B's support tickets to predict if a client is at high risk of churning.
- **KPI 2: Stealth Security Effectiveness**: Correlates DDoS attack volume against customer satisfaction (CSAT) to demonstrate "Invisible Defense".

### 2. Group B: Client Success & Finance
The **Client Success & Finance** perspective. The objective is to track client financial elements, ensure invoices are paid, and clients report high satisfaction.
- Tracks metrics like `monthly_subscription_fee_usd`, `support_tickets_open`, `customer_satisfaction_score`, `subscription_tier`, etc.
- **KPI 1: SLA Penalty Cost**: Calculates the financial impact of server downtime based on the client's subscription fee.
- **KPI 2: Resource Profitability Margin**: Compares Group A's infrastructure costs (CPU, storage, bandwidth) against Group B's monthly revenue to display net margin.

### 3. Database C / Executive Synthesis
These are the core metrics that are synthesized from the intersection of Group A and Group B's data changes. The insights are updated in real-time as the inputs from technical and financial branches vary.

## Development

- Built with React, Vite, and Tailwind CSS.
- Charts implemented using Recharts.
- Icons provided by Lucide React.
- Animations powered by Motion.

### Get Started
```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

### Mock Data Seeding
The application supports loading synthetic mock client data for testing out chart states and integration points using `sample-seed.json` and `sample-seed-2.json` files found in the `/public` directory.
