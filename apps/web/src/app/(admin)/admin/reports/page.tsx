"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppUser } from "@/lib/hooks/use-app-user";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  DollarSign,
  FolderOpen,
  BarChart3,
  Download,
  FileText,
  Clock,
  Target,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<string>("financial");
  const { appUser } = useAppUser();
  const tenantId = appUser?.tenantId ?? undefined;
  const supabase = createClient();

  // ── Queries ────────────────────────────────────────────────────────────

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["reports-projects", tenantId],
    queryFn: async () => {
      let q = supabase.from("projects").select("id, name, status, estimated_cost, actual_cost, contract_amount, total_paid, total_outstanding, completion_percentage, client_id, clients(id, first_name, last_name)");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.is("deleted_at", null);
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });

  const { data: invoices, isLoading: loadingInvoices } = useQuery({
    queryKey: ["reports-invoices", tenantId],
    queryFn: async () => {
      let q = supabase.from("invoices").select("id, status, total, balance_due, amount_paid, due_date, paid_at, created_at, client_id, clients(id, first_name, last_name), project_id, projects(id, name)");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.is("deleted_at", null).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });

  const { data: leads, isLoading: loadingLeads } = useQuery({
    queryKey: ["reports-leads", tenantId],
    queryFn: async () => {
      let q = supabase.from("leads").select("id, status, source, created_at, ai_estimated_value");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.is("deleted_at", null);
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });

  // ── Computed metrics ─────────────────────────────────────────────────

  const projectList = projects ?? [];
  const invoiceList = invoices ?? [];
  const leadList = leads ?? [];

  const totalRevenue = invoiceList.reduce((s, inv) => s + ((inv.amount_paid as number | null) ?? 0), 0);
  const activeProjectCount = projectList.filter((p) => (p.status as string) === "in_progress" || (p.status as string) === "active").length;
  const totalOutstanding = invoiceList.reduce((s, inv) => s + ((inv.balance_due as number | null) ?? 0), 0);
  const outstandingCount = invoiceList.filter((inv) => (inv.status as string) !== "paid" && (inv.status as string) !== "voided").length;

  // Average project margin
  const projectsWithCosts = projectList.filter((p) => (p.contract_amount as number | null) && (p.actual_cost as number | null));
  const avgMargin = projectsWithCosts.length > 0
    ? projectsWithCosts.reduce((s, p) => {
        const contract = (p.contract_amount as number) || 0;
        const actual = (p.actual_cost as number) || 0;
        return s + (contract > 0 ? ((contract - actual) / contract) * 100 : 0);
      }, 0) / projectsWithCosts.length
    : 0;

  // Projects by status
  const statusCounts: Record<string, number> = {};
  for (const p of projectList) {
    const st = (p.status as string) ?? "unknown";
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  }
  const projectsByStatus = Object.entries(statusCounts)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
  const maxProjectCount = Math.max(...projectsByStatus.map((p) => p.count), 1);

  // Budget variance (projects with both estimated and actual costs)
  const budgetVariance = projectList
    .filter((p) => (p.estimated_cost as number | null) && (p.actual_cost as number | null))
    .slice(0, 5)
    .map((p) => ({
      project: p.name as string,
      budget: (p.estimated_cost as number) || 0,
      actual: (p.actual_cost as number) || 0,
    }));

  // Lead funnel
  const leadStatusCounts: Record<string, number> = {};
  for (const l of leadList) {
    const st = (l.status as string) ?? "unknown";
    leadStatusCounts[st] = (leadStatusCounts[st] || 0) + 1;
  }
  const funnelStages = ["new", "contacted", "qualified", "quoted", "won"];
  const leadFunnel = funnelStages
    .map((stage) => ({ stage, count: leadStatusCounts[stage] || 0 }))
    .filter((s) => s.count > 0 || funnelStages.indexOf(s.stage) === 0);
  const maxFunnelCount = Math.max(...leadFunnel.map((s) => s.count), 1);

  // Lead sources
  const sourceCounts: Record<string, number> = {};
  for (const l of leadList) {
    const src = (l.source as string) ?? "Other";
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  }
  const leadSources = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxLeadSource = Math.max(...leadSources.map((s) => s.count), 1);

  // Top clients by revenue
  const clientRevenue: Record<string, { name: string; revenue: number; projects: number }> = {};
  for (const inv of invoiceList) {
    const cid = inv.client_id as string;
    const client = inv.clients as Record<string, unknown> | null;
    const name = client ? `${client.first_name ?? ""} ${client.last_name ?? ""}`.trim() : "Unknown";
    if (!clientRevenue[cid]) clientRevenue[cid] = { name, revenue: 0, projects: 0 };
    clientRevenue[cid].revenue += (inv.amount_paid as number | null) ?? 0;
  }
  for (const p of projectList) {
    const cid = p.client_id as string;
    if (clientRevenue[cid]) clientRevenue[cid].projects += 1;
  }
  const topClients = Object.values(clientRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const isLoading = loadingProjects || loadingInvoices || loadingLeads;

  // Y-axis labels for revenue chart
  const yAxisLabels = [100, 75, 50, 25, 0];

  // Monthly revenue from paid invoices (last 12 months)
  const monthlyRevenue: { month: string; value: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short" });
    const total = invoiceList
      .filter((inv) => {
        const paidAt = inv.paid_at as string | null;
        if (!paidAt) return false;
        return paidAt.startsWith(key);
      })
      .reduce((s, inv) => s + ((inv.amount_paid as number | null) ?? 0), 0);
    monthlyRevenue.push({ month: label, value: total });
  }
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value), 1);

  return (
    <div className="space-y-8 p-6 font-[Outfit]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Reports &amp; Analytics
          </h1>
          <p className="mt-1 text-sm text-[#888]">
            Business performance overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-[#e0dbd5] text-[#888] hover:text-black">
            <Download strokeWidth={1.5} className="size-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-[#e0dbd5] text-[#888] hover:text-black">
            <FileText strokeWidth={1.5} className="size-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs
        defaultValue="financial"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as string)}
      >
        <TabsList className="rounded-lg border border-[#e0dbd5] bg-[#f8f8f8]">
          <TabsTrigger value="financial" className="rounded-md text-sm data-active:bg-white data-active:text-black">
            Financial
          </TabsTrigger>
          <TabsTrigger value="projects" className="rounded-md text-sm data-active:bg-white data-active:text-black">
            Projects
          </TabsTrigger>
          <TabsTrigger value="leads" className="rounded-md text-sm data-active:bg-white data-active:text-black">
            Leads
          </TabsTrigger>
          <TabsTrigger value="custom" className="rounded-md text-sm data-active:bg-white data-active:text-black">
            Custom
          </TabsTrigger>
        </TabsList>

        {/* ── Financial Tab ─────────────────────────────────────────────── */}
        <TabsContent value="financial" className="mt-6 space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardContent className="pt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#888]">
                      Total Revenue
                    </p>
                    {isLoading ? (
                      <Skeleton className="mt-2 h-8 w-32" />
                    ) : (
                      <p className="mt-2 text-2xl font-semibold text-black">
                        {fmt(totalRevenue)}
                      </p>
                    )}
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#f8f8f8]">
                    <DollarSign strokeWidth={1.5} className="size-4 text-[#888]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardContent className="pt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#888]">
                      Active Projects
                    </p>
                    {isLoading ? (
                      <Skeleton className="mt-2 h-8 w-16" />
                    ) : (
                      <p className="mt-2 text-2xl font-semibold text-black">{activeProjectCount}</p>
                    )}
                    <p className="mt-1 text-xs text-[#888]">
                      {projectList.length} total projects
                    </p>
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#f8f8f8]">
                    <FolderOpen strokeWidth={1.5} className="size-4 text-[#888]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avg Project Margin */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardContent className="pt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#888]">
                      Avg Project Margin
                    </p>
                    {isLoading ? (
                      <Skeleton className="mt-2 h-8 w-20" />
                    ) : (
                      <p className="mt-2 text-2xl font-semibold text-black">
                        {avgMargin > 0 ? `${avgMargin.toFixed(1)}%` : "--"}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#888]">
                      <span>{projectsWithCosts.length} projects with cost data</span>
                    </div>
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#f8f8f8]">
                    <BarChart3 strokeWidth={1.5} className="size-4 text-[#888]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outstanding Invoices */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardContent className="pt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#888]">
                      Outstanding Invoices
                    </p>
                    {isLoading ? (
                      <Skeleton className="mt-2 h-8 w-28" />
                    ) : (
                      <p className="mt-2 text-2xl font-semibold text-black">
                        {fmt(totalOutstanding)}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[#888]">
                      {outstandingCount} invoices pending
                    </p>
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#f8f8f8]">
                    <Clock strokeWidth={1.5} className="size-4 text-[#888]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Section 1: Revenue Chart ──────────────────────────────── */}
          <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-black">
                Monthly Revenue
              </CardTitle>
              <CardDescription className="text-sm text-[#888]">
                Last 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-end gap-2 h-[200px]">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="flex-1 h-full" />
                  ))}
                </div>
              ) : (
                <div className="flex">
                  {/* Y-axis labels */}
                  <div className="flex w-12 shrink-0 flex-col justify-between pb-7 pr-2 text-right text-xs text-[#888]">
                    {yAxisLabels.map((label) => (
                      <span key={label}>${label}k</span>
                    ))}
                  </div>

                  {/* Chart area */}
                  <div className="flex flex-1 flex-col">
                    {/* Bars */}
                    <div className="flex flex-1 items-end gap-2">
                      {monthlyRevenue.map((m) => {
                        const heightPct = maxRevenue > 0 ? (m.value / maxRevenue) * 100 : 0;
                        return (
                          <div
                            key={m.month}
                            className="group relative flex flex-1 flex-col items-center"
                          >
                            {/* Tooltip on hover */}
                            <div className="pointer-events-none absolute -top-8 z-10 hidden rounded bg-black px-2 py-1 text-xs text-white shadow group-hover:block">
                              {fmt(m.value)}
                            </div>
                            <div
                              className="w-full rounded-t bg-black transition-colors group-hover:bg-[#333]"
                              style={{
                                height: `${heightPct * 2}px`,
                                maxHeight: "200px",
                                minHeight: "8px",
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Month labels */}
                    <div className="mt-2 flex gap-2">
                      {monthlyRevenue.map((m) => (
                        <div
                          key={m.month}
                          className="flex-1 text-center text-xs text-[#888]"
                        >
                          {m.month}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Section 2: Project Reports ─────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Projects by Status */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-black">
                  Projects by Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-full" />
                  ))
                ) : projectsByStatus.length === 0 ? (
                  <p className="text-sm text-[#888]">No projects yet.</p>
                ) : (
                  projectsByStatus.map((p) => (
                    <div key={p.status} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-sm capitalize text-[#888]">
                        {p.status.replace(/_/g, " ")}
                      </span>
                      <div className="flex-1">
                        <div
                          className="bg-black h-7 rounded transition-all"
                          style={{
                            width: `${(p.count / maxProjectCount) * 100}%`,
                            minWidth: "24px",
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm font-medium text-black">
                        {p.count}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Budget Variance */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-black">
                  Budget Variance
                </CardTitle>
                <CardDescription className="text-sm text-[#888]">
                  Projects with cost data — budget vs actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : budgetVariance.length === 0 ? (
                  <p className="text-sm text-[#888]">No budget data available.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#e0dbd5]">
                        <TableHead className="text-xs font-medium text-[#888]">Project</TableHead>
                        <TableHead className="text-right text-xs font-medium text-[#888]">Budget</TableHead>
                        <TableHead className="text-right text-xs font-medium text-[#888]">Actual</TableHead>
                        <TableHead className="text-right text-xs font-medium text-[#888]">Variance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {budgetVariance.map((row) => {
                        const variance = row.budget > 0 ? ((row.actual - row.budget) / row.budget) * 100 : 0;
                        const isOver = variance > 0;
                        return (
                          <TableRow key={row.project} className="border-[#e0dbd5]">
                            <TableCell className="text-sm text-black">{row.project}</TableCell>
                            <TableCell className="text-right text-sm text-[#888]">{fmt(row.budget)}</TableCell>
                            <TableCell className="text-right text-sm text-black">{fmt(row.actual)}</TableCell>
                            <TableCell className="text-right text-sm">
                              <span className={isOver ? "text-red-600" : "text-black"}>
                                {isOver ? "+" : ""}{variance.toFixed(1)}%
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Section 3: Lead Analytics ──────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Lead Conversion Funnel */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-black">
                  Lead Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))
                ) : leadFunnel.length === 0 ? (
                  <p className="text-sm text-[#888]">No lead data yet.</p>
                ) : (
                  leadFunnel.map((stage, i) => {
                    const convRate =
                      i > 0 && leadFunnel[i - 1].count > 0
                        ? ((stage.count / leadFunnel[i - 1].count) * 100).toFixed(0)
                        : null;
                    const widthPct = maxFunnelCount > 0 ? (stage.count / maxFunnelCount) * 100 : 0;
                    return (
                      <div key={stage.stage}>
                        {convRate ? (
                          <div className="mb-1 flex items-center justify-center gap-1 text-xs text-[#888]">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#888]">
                              <path d="M5 2L5 8M5 8L2.5 5.5M5 8L7.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {convRate}% conversion
                          </div>
                        ) : null}
                        <div className="flex items-center gap-3">
                          <div
                            className="mx-auto flex h-10 items-center justify-center rounded bg-black text-sm font-medium text-white transition-all"
                            style={{ width: `${widthPct}%`, minWidth: "80px" }}
                          >
                            <span className="flex items-center gap-2 px-3">
                              <span className="truncate capitalize">{stage.stage}</span>
                              <span className="shrink-0 font-semibold">{stage.count}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Lead Sources */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-black">
                  Lead Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-full" />
                  ))
                ) : leadSources.length === 0 ? (
                  <p className="text-sm text-[#888]">No lead source data.</p>
                ) : (
                  leadSources.map((s) => (
                    <div key={s.source} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-sm capitalize text-[#888]">
                        {s.source}
                      </span>
                      <div className="flex-1">
                        <div
                          className="h-7 rounded bg-black transition-all"
                          style={{
                            width: `${(s.count / maxLeadSource) * 100}%`,
                            minWidth: "24px",
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm font-medium text-black">
                        {s.count}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Section 4: Top Clients ───────────────────────────────── */}
          <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-black">
                Top Clients by Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : topClients.length === 0 ? (
                <p className="text-sm text-[#888]">No revenue data yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e0dbd5]">
                      <TableHead className="text-xs font-medium text-[#888]">Client</TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#888]">Revenue</TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#888]">Projects</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topClients.map((client) => (
                      <TableRow key={client.name} className="border-[#e0dbd5]">
                        <TableCell className="text-sm text-black">
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 items-center justify-center rounded-full bg-[#f8f8f8] text-xs font-medium text-[#888]">
                              {client.name.charAt(0)}
                            </div>
                            {client.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium text-black">
                          {fmt(client.revenue)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-[#888]">
                          {client.projects}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Other Tabs (Coming Soon) ─────────────────────────────────── */}
        <TabsContent value="projects" className="mt-6">
          <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <FolderOpen strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
              <p className="mt-3 text-sm font-medium text-black">Project Reports</p>
              <p className="mt-1 text-sm text-[#888]">Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Target strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
              <p className="mt-3 text-sm font-medium text-black">Lead Reports</p>
              <p className="mt-1 text-sm text-[#888]">Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <BarChart3 strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
              <p className="mt-3 text-sm font-medium text-black">Custom Reports</p>
              <p className="mt-1 text-sm text-[#888]">Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
