// Static dummy data for MVP agent dashboards.
// Keep deterministic so charts render identically every load.

export interface CapitalFlowPoint {
  date: string;
  inflow: number;
  outflow: number;
  net: number;
}

export const capitalFlow30d: CapitalFlowPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = new Date("2026-03-21");
  day.setDate(day.getDate() + i);
  const seed = Math.sin(i * 0.7) * 0.5 + 0.5;
  const inflow = Math.round(120_000 + seed * 60_000 + i * 1200);
  const outflow = Math.round(95_000 + (1 - seed) * 40_000 + i * 900);
  return {
    date: day.toISOString().slice(0, 10),
    inflow,
    outflow,
    net: inflow - outflow,
  };
});

export const vendorMarginHeatmap = {
  vendors: ["Vendor Apex", "Vendor Bravo", "Vendor Delta", "Vendor Echo", "Vendor Meridian", "Vendor Nexus"],
  weeks: ["W1", "W2", "W3", "W4"],
  // values 0-100 (higher = better margin)
  grid: [
    [72, 68, 74, 78],
    [55, 42, 38, 31],
    [28, 22, 19, 15],
    [81, 84, 79, 85],
    [66, 70, 72, 69],
    [58, 60, 63, 61],
  ],
};

export interface AnomalyAlert {
  id: string;
  type: string;
  description: string;
  velocityImpact: number;
  correlatedPatterns: string[];
  proposedScenarios: string[];
}

export const pulseAlerts: AnomalyAlert[] = [
  {
    id: "alert-001",
    type: "Margin Erosion",
    description: "Carrier Delta freight cost up 34% over 14 days; margin compressed on SKU-0091, SKU-0047.",
    velocityImpact: -0.61,
    correlatedPatterns: ["Shipping cost spike", "Vendor renegotiation delay", "Fuel surcharge increase"],
    proposedScenarios: [
      "Renegotiate freight contract with Carrier Delta",
      "Shift 40% of West Coast volume to Carrier Echo",
      "Pass surcharge to customer via shipping threshold adjustment",
    ],
  },
  {
    id: "alert-002",
    type: "Spend Deviation",
    description: "Google Ads spend +18% week-over-week without corresponding LTV lift.",
    velocityImpact: -0.34,
    correlatedPatterns: ["Bid strategy change", "Campaign broad match expansion"],
    proposedScenarios: [
      "Revert to manual CPC on top 5 campaigns",
      "Cap daily spend at prior 14-day average",
      "Reallocate $8,000 to TikTok Ads (velocity 1.87)",
    ],
  },
  {
    id: "alert-003",
    type: "Vendor Concentration",
    description: "Vendor Apex now accounts for 41% of COGS; velocity score declining past 21 days.",
    velocityImpact: -0.22,
    correlatedPatterns: ["Single-source risk", "Lead time variance +12 days"],
    proposedScenarios: [
      "Onboard Vendor Meridian as secondary supplier",
      "Negotiate volume discount on existing Apex contract",
      "Split SKU-0091 and SKU-0112 across two vendors",
    ],
  },
];

export interface DashboardKpis {
  totalCapitalDeployed: number;
  netCapitalVelocityScore: number;
  activeAnomalies: number;
  pendingApprovals: number;
}

export const financeHeaderKpis: DashboardKpis = {
  totalCapitalDeployed: 2_480_000,
  netCapitalVelocityScore: 1.42,
  activeAnomalies: 3,
  pendingApprovals: 4,
};

export const pulseAgentKpis = {
  anomalyCount: 3,
  marginErosionAlerts: 2,
  spendDeviationFlags: 1,
};

// ============================================================
// ORACLE AGENT — Scenario Modeling Engine
// ============================================================

export const oracleKpis = {
  forecastAccuracy: 87, // %
  activeScenarios: 5,
  capitalDeploymentLeadTime: 14, // days
};

export interface DemandForecastPoint {
  week: string;
  forecast: number;
  upper: number;
  lower: number;
}

// 13-week rolling forecast with confidence bands (+/- 15%)
export const oracleDemandForecast: DemandForecastPoint[] = Array.from({ length: 13 }, (_, i) => {
  const base = 420_000 + Math.sin(i * 0.45) * 90_000 + i * 8_000;
  const band = base * 0.15;
  return {
    week: `W${i + 1}`,
    forecast: Math.round(base),
    upper: Math.round(base + band),
    lower: Math.round(base - band),
  };
});

export interface ScenarioStackPoint {
  week: string;
  scenarioA: number;
  scenarioB: number;
  scenarioC: number;
  scenarioD: number;
  scenarioE: number;
}

export const oracleScenarioStack: ScenarioStackPoint[] = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  scenarioA: Math.round(40_000 + Math.sin(i * 0.5) * 8_000),
  scenarioB: Math.round(65_000 + Math.cos(i * 0.4) * 12_000),
  scenarioC: Math.round(28_000 + Math.sin(i * 0.7) * 5_000),
  scenarioD: Math.round(18_000 + i * 1_200),
  scenarioE: Math.round(12_000 + Math.cos(i * 0.6) * 3_500),
}));

export interface OracleScenario {
  id: string;
  name: string;
  probability: number; // %
  capitalRequired: number;
  breakEvenDate: string;
  recommendedAction: string;
}

export const oracleScenarios: OracleScenario[] = [
  {
    id: "scn-b",
    name: "Scenario B — Q3 Inventory Pre-Buy",
    probability: 74,
    capitalRequired: 240_000,
    breakEvenDate: "2026-05-22",
    recommendedAction: "Pre-purchase inventory ahead of Q3 demand spike",
  },
  {
    id: "scn-c",
    name: "Scenario C — TikTok Channel Scale",
    probability: 62,
    capitalRequired: 85_000,
    breakEvenDate: "2026-06-04",
    recommendedAction: "Scale TikTok acquisition spend in high-velocity cohorts",
  },
  {
    id: "scn-d",
    name: "Scenario D — Enterprise Tier Launch",
    probability: 48,
    capitalRequired: 180_000,
    breakEvenDate: "2026-07-18",
    recommendedAction: "Build enterprise tier with annual contracts; soft launch Q3",
  },
  {
    id: "scn-a",
    name: "Scenario A — Conservative Q2 Hold",
    probability: 35,
    capitalRequired: 0,
    breakEvenDate: "—",
    recommendedAction: "Hold capital; defer large commitments pending macro signals",
  },
  {
    id: "scn-e",
    name: "Scenario E — International Expansion (UK)",
    probability: 28,
    capitalRequired: 320_000,
    breakEvenDate: "2026-11-02",
    recommendedAction: "UK market entry with localized Shopify + payment rails",
  },
];

// ============================================================
// SNIPER AGENT — Waste Elimination Reflex
// ============================================================

export const sniperKpis = {
  totalWasteIdentified: 48_200,
  projectedQuarterlySavings: 144_600,
  lowVelocityInitiatives: 7,
};

export interface ExpenseScatterPoint {
  name: string;
  capitalDeployed: number;
  ltvContribution: number;
  category: string;
}

export const sniperExpenseScatter: ExpenseScatterPoint[] = [
  { name: "Google Ads — Brand", capitalDeployed: 18_000, ltvContribution: 42_000, category: "Marketing" },
  { name: "TikTok Ads", capitalDeployed: 22_000, ltvContribution: 64_000, category: "Marketing" },
  { name: "Meta Ads", capitalDeployed: 31_000, ltvContribution: 28_000, category: "Marketing" },
  { name: "Google Ads — Generic", capitalDeployed: 15_000, ltvContribution: 6_300, category: "Marketing" },
  { name: "Klaviyo Pro", capitalDeployed: 1_200, ltvContribution: 200, category: "Tools" },
  { name: "Salesforce CRM", capitalDeployed: 3_800, ltvContribution: 4_100, category: "Tools" },
  { name: "Zapier", capitalDeployed: 49, ltvContribution: 0, category: "Tools" },
  { name: "Loom Business", capitalDeployed: 13, ltvContribution: 0, category: "Tools" },
  { name: "Influencer Alpha", capitalDeployed: 6_000, ltvContribution: 1_700, category: "Marketing" },
  { name: "Email Platform", capitalDeployed: 500, ltvContribution: 2_800, category: "Tools" },
  { name: "Customer Support SaaS", capitalDeployed: 1_450, ltvContribution: 3_200, category: "Tools" },
  { name: "SEO Agency", capitalDeployed: 8_000, ltvContribution: 11_400, category: "Services" },
];

export interface VelocityByCategory {
  category: string;
  velocity: number;
}

export const sniperVelocityByCategory: VelocityByCategory[] = [
  { category: "Brand Ads", velocity: 1.87 },
  { category: "Affiliate", velocity: 1.62 },
  { category: "Email", velocity: 1.45 },
  { category: "SEO/Content", velocity: 1.18 },
  { category: "Generic Search", velocity: 0.58 },
  { category: "Display", velocity: 0.42 },
  { category: "Retargeting", velocity: 0.31 },
  { category: "Influencer", velocity: 0.29 },
];

export interface WasteProposal {
  id: string;
  item: string;
  monthlyCost: number;
  velocityScore: number;
  proposedAction: "Cancel" | "Renegotiate" | "Reallocate";
  projectedSavingsAnnual: number;
}

export const sniperWasteProposals: WasteProposal[] = [
  { id: "w-001", item: "Klaviyo Pro", monthlyCost: 1_200, velocityScore: 0.18, proposedAction: "Cancel", projectedSavingsAnnual: 14_400 },
  { id: "w-002", item: "Salesforce CRM", monthlyCost: 3_800, velocityScore: 0.88, proposedAction: "Renegotiate", projectedSavingsAnnual: 13_680 },
  { id: "w-003", item: "Zapier Starter", monthlyCost: 49, velocityScore: 0.11, proposedAction: "Cancel", projectedSavingsAnnual: 588 },
  { id: "w-004", item: "Loom Business (dup seat)", monthlyCost: 13, velocityScore: 0.0, proposedAction: "Cancel", projectedSavingsAnnual: 150 },
  { id: "w-005", item: "Google Display Campaign", monthlyCost: 380, velocityScore: 0.14, proposedAction: "Cancel", projectedSavingsAnnual: 4_560 },
  { id: "w-006", item: "Influencer Program Alpha", monthlyCost: 6_000, velocityScore: 0.29, proposedAction: "Reallocate", projectedSavingsAnnual: 72_000 },
  { id: "w-007", item: "SEO Retainer — Vendor X", monthlyCost: 2_500, velocityScore: 0.41, proposedAction: "Renegotiate", projectedSavingsAnnual: 9_000 },
];

// ============================================================
// CONDUCTOR AGENT — Capital Orchestration Intelligence
// ============================================================

export const conductorKpis = {
  availableLiquidity: 820_000,
  activeCapitalRequests: 4,
  velocityWeightedROI: 1.62,
};

export const conductorLiquidityThresholds = {
  critical: 400_000,
  healthy: 1_000_000,
  max: 1_500_000,
};

export interface Initiative {
  id: string;
  name: string;
  capitalRequested: number;
  velocityScore: number;
  strategicPriority: "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "On Hold" | "Rejected";
}

export const conductorInitiatives: Initiative[] = [
  { id: "i-001", name: "TikTok Ads Scale Q3",          capitalRequested: 85_000,  velocityScore: 1.87, strategicPriority: "High",   status: "Pending"  },
  { id: "i-002", name: "Vendor Meridian Onboarding",   capitalRequested: 42_000,  velocityScore: 1.51, strategicPriority: "High",   status: "Pending"  },
  { id: "i-003", name: "Q3 Inventory Pre-Buy",         capitalRequested: 240_000, velocityScore: 1.42, strategicPriority: "High",   status: "Approved" },
  { id: "i-004", name: "Carrier Echo Contract",        capitalRequested: 18_000,  velocityScore: 1.22, strategicPriority: "Medium", status: "Pending"  },
  { id: "i-005", name: "Email Automation Tier",        capitalRequested: 6_500,   velocityScore: 1.11, strategicPriority: "Medium", status: "Pending"  },
  { id: "i-006", name: "Influencer Program Alpha",     capitalRequested: 6_000,   velocityScore: 0.29, strategicPriority: "Low",    status: "On Hold"  },
  { id: "i-007", name: "Google Display Expansion",     capitalRequested: 12_000,  velocityScore: 0.42, strategicPriority: "Low",    status: "Rejected" },
];

export interface ReallocationFlow {
  from: string;
  to: string;
  amount: number;
  fromVelocity: number;
  toVelocity: number;
}

export const conductorReallocations: ReallocationFlow[] = [
  { from: "Google Ads — Generic", to: "TikTok Ads",             amount: 18_500, fromVelocity: 0.42, toVelocity: 1.87 },
  { from: "Meta Ads",             to: "Google Shopping",        amount: 7_500,  fromVelocity: 1.20, toVelocity: 3.10 },
  { from: "Influencer Alpha",     to: "Affiliate Partnerships", amount: 6_000,  fromVelocity: 0.29, toVelocity: 1.62 },
  { from: "Display",              to: "Email Automation",       amount: 3_200,  fromVelocity: 0.31, toVelocity: 1.45 },
];
