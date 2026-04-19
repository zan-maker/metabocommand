"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { KpiCard } from "@/components/kpi-card";
import {
  supportReflexKpis,
  supportInquiryVolume,
  supportResolutionTrend,
  supportIssuePatterns,
  type IssuePattern,
} from "@/lib/dummy-data-lifetime";
import { cn } from "@/lib/utils";

export function SupportReflexAgentView() {
  const [isActive, setIsActive] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());

  async function submitImprovement(p: IssuePattern) {
    setSubmittingId(p.id);
    try {
      const res = await fetch("/api/approvals/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_name: "Support Reflex Agent",
          queue: "operations",
          action_description: `Process improvement: ${p.proposedImprovement} (addresses pattern affecting ${p.affectedCustomers} customers / ${p.frequency} tickets)`,
          financial_impact: `Affects ~${p.frequency} tickets/month`,
          impact_amount: null,
        }),
      });
      if (res.ok) setSubmittedIds((prev) => new Set(prev).add(p.id));
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Support Reflex Agent</CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            Autonomous support issue resolution and pattern detection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-medium", isActive ? "text-emerald-700" : "text-slate-500")}>
            {isActive ? "Active" : "Paused"}
          </span>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            label="Autonomous Resolution Rate"
            value={`${supportReflexKpis.autonomousResolutionRate}%`}
            trend="up"
            subtext="+8% vs prior 30d"
          />
          <KpiCard
            label="Avg Resolution Time"
            value={`${supportReflexKpis.avgResolutionTime}h`}
            trend="down"
            subtext="-1.2h vs prior 30d"
          />
          <KpiCard
            label="Cost per Interaction"
            value={`$${supportReflexKpis.costPerInteraction.toFixed(2)}`}
            trend="down"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Inquiry volume by category
            </h3>
            <div className="rounded-md border border-slate-200 p-4 bg-white">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={supportInquiryVolume} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip formatter={(v) => `${Number(v).toLocaleString()} tickets`} />
                  <Bar dataKey="volume" radius={[0, 6, 6, 0]}>
                    {supportInquiryVolume.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.volume >= 1000 ? "#f43f5e" : entry.volume >= 500 ? "#f59e0b" : entry.volume >= 300 ? "#6366f1" : "#10b981"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Resolution time trend</h3>
            <div className="rounded-md border border-slate-200 p-4 bg-white">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={supportResolutionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
                  <Tooltip formatter={(v) => `${v}h`} />
                  <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Avg resolution" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Recurring issue patterns</h3>
          <div className="space-y-3">
            {supportIssuePatterns.map((p) => {
              const submitted = submittedIds.has(p.id);
              return (
                <div key={p.id} className="rounded-md border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{p.pattern}</p>
                      <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                        <span>
                          <span className="font-mono font-semibold text-slate-700">{p.frequency}</span> tickets
                        </span>
                        <span>
                          <span className="font-mono font-semibold text-slate-700">{p.affectedCustomers}</span> customers affected
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Proposed</span>
                        <p className="text-slate-700 mt-0.5">{p.proposedImprovement}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      disabled={!isActive || submitted || submittingId === p.id}
                      onClick={() => submitImprovement(p)}
                    >
                      {submitted ? "Queued" : submittingId === p.id ? "Submitting…" : "Submit for Approval"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
