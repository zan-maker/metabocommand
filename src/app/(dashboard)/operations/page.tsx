import { createClient } from "@/lib/supabase/server";
import { KpiCard } from "@/components/kpi-card";
import { AcquisitionAgentView } from "./acquisition-agent-view";
import { ConversionAgentView } from "./conversion-agent-view";
import { RetentionAgentView } from "./retention-agent-view";
import { DemandProphetAgentView } from "./demand-prophet-agent-view";
import { LogisticsConductorAgentView } from "./logistics-conductor-agent-view";
import { operationsHeaderKpis } from "@/lib/dummy-data";

export default async function OperationsDashboardPage() {
  const supabase = await createClient();
  const { count: pendingCount } = await supabase
    .from("approval_items")
    .select("*", { count: "exact", head: true })
    .eq("queue", "operations")
    .eq("status", "pending");

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Operations Command Center</h1>
        <p className="text-sm text-slate-500 mt-1">Last 30 days</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Conversion Rate"
          value={`${operationsHeaderKpis.conversionRate}%`}
          trend="up"
          subtext="+0.3% vs prior 30d"
        />
        <KpiCard
          label="Stockout Rate"
          value={`${operationsHeaderKpis.stockoutRate}%`}
          trend="down"
          subtext="-0.4% vs prior 30d"
        />
        <KpiCard
          label="Customer LTV (avg)"
          value={`$${operationsHeaderKpis.customerLtvAvg}`}
          trend="up"
          subtext="+4.8% YoY"
        />
        <KpiCard
          label="Support Resolution (avg)"
          value={`${operationsHeaderKpis.supportResolutionTimeAvg}h`}
          trend="down"
          subtext="-1.2h vs prior 30d"
        />
        <KpiCard
          label="Pending Approvals"
          value={String(pendingCount ?? 0)}
          trend="neutral"
        />
      </div>

      <SectionHeader title="Revenue Velocity" description="Acquisition, Conversion, and Retention agents" />
      <AcquisitionAgentView />
      <ConversionAgentView />
      <RetentionAgentView />

      <SectionHeader title="Inventory Intelligence" description="Demand forecasting and logistics orchestration" />
      <DemandProphetAgentView />
      <LogisticsConductorAgentView />

      <SectionHeader title="Customer Lifetime" description="Support automation and advocacy amplification" />
      <PanelStub name="Support Reflex Agent" subtitle="Autonomous support issue resolution" />
      <PanelStub name="Advocacy Agent" subtitle="Review and referral amplification" />

      <SectionHeader title="Operational Health" description="Cross-agent harmony and system-wide coordination" />
      <PanelStub name="Harmony Agent" subtitle="Detects and resolves cross-agent conflicts" />
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-t border-slate-200 pt-6 mt-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-0.5">{description}</p>
    </div>
  );
}

function PanelStub({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
      <div className="text-sm font-semibold text-slate-900">{name}</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
      <div className="text-xs text-slate-400 mt-4 italic">View coming in Phase 2b</div>
    </div>
  );
}
