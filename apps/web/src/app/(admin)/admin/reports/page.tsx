"use client";

import { useState } from "react";
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
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FolderOpen,
  BarChart3,
  Download,
  FileText,
  Users,
  Target,
  Clock,
} from "lucide-react";

// ── Mock Data ────────────────────────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { month: "Apr", value: 52000 },
  { month: "May", value: 61000 },
  { month: "Jun", value: 78000 },
  { month: "Jul", value: 85000 },
  { month: "Aug", value: 92000 },
  { month: "Sep", value: 88000 },
  { month: "Oct", value: 71000 },
  { month: "Nov", value: 58000 },
  { month: "Dec", value: 45000 },
  { month: "Jan", value: 53000 },
  { month: "Feb", value: 69000 },
  { month: "Mar", value: 95000 },
];

const PROJECTS_BY_STATUS = [
  { status: "Completed", count: 23, color: "bg-black" },
  { status: "In Progress", count: 14, color: "bg-[#888]" },
  { status: "Planning", count: 8, color: "bg-[#bbb]" },
  { status: "On Hold", count: 3, color: "bg-[#e0dbd5]" },
];

const BUDGET_VARIANCE = [
  {
    project: "Kitchen Remodel — Andersons",
    budget: 45000,
    actual: 42800,
  },
  {
    project: "Deck Build — Thompson",
    budget: 28000,
    actual: 31200,
  },
  {
    project: "Bathroom Reno — Garcia",
    budget: 18500,
    actual: 17900,
  },
  {
    project: "Basement Finish — Nguyen",
    budget: 62000,
    actual: 68500,
  },
  {
    project: "Roof Replacement — Patel",
    budget: 22000,
    actual: 21100,
  },
];

const LEAD_FUNNEL = [
  { stage: "New Leads", count: 145, width: 100 },
  { stage: "Contacted", count: 98, width: 78 },
  { stage: "Qualified", count: 62, width: 52 },
  { stage: "Quoted", count: 41, width: 38 },
  { stage: "Won", count: 23, width: 24 },
];

const LEAD_SOURCES = [
  { source: "Google", count: 45 },
  { source: "Referral", count: 38 },
  { source: "Website", count: 32 },
  { source: "Social", count: 18 },
  { source: "Other", count: 12 },
];

const AR_AGING = [
  { period: "Current", amount: 18200 },
  { period: "1–30 days", amount: 14600 },
  { period: "31–60 days", amount: 9800 },
  { period: "61–90 days", amount: 6200 },
  { period: "90+ days", amount: 3500 },
];

const TOP_CLIENTS = [
  { name: "Anderson Family", revenue: 127500, projects: 4 },
  { name: "Thompson Builders", revenue: 98200, projects: 3 },
  { name: "Nguyen Residence", revenue: 89000, projects: 2 },
  { name: "Garcia Properties", revenue: 74300, projects: 3 },
  { name: "Patel & Associates", revenue: 61800, projects: 2 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtK(n: number) {
  return `$${Math.round(n / 1000)}k`;
}

function pct(a: number, b: number) {
  return (((a - b) / b) * 100).toFixed(1);
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<string>("financial");

  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.value));
  const maxProjectCount = Math.max(...PROJECTS_BY_STATUS.map((p) => p.count));
  const maxLeadSource = Math.max(...LEAD_SOURCES.map((s) => s.count));

  // Y-axis labels for revenue chart
  const yAxisLabels = [100, 75, 50, 25, 0];

  return (
    <div className="space-y-8 p-6 font-[Outfit]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Reports &amp; Analytics
          </h1>
          <p className="mt-1 text-sm text-[#888]">
            Business performance overview — YTD 2026
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
            {/* Total Revenue YTD */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardContent className="pt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#888]">
                      Total Revenue YTD
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-black">
                      $847,250
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-black">
                      <TrendingUp strokeWidth={1.5} className="size-3.5" />
                      <span>+12% from last year</span>
                    </div>
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
                    <p className="mt-2 text-2xl font-semibold text-black">14</p>
                    <p className="mt-1 text-xs text-[#888]">
                      3 starting this month
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
                    <p className="mt-2 text-2xl font-semibold text-black">
                      28.5%
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-black">
                      <TrendingUp strokeWidth={1.5} className="size-3.5" />
                      <span>+2.3% from Q4</span>
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
                    <p className="mt-2 text-2xl font-semibold text-black">
                      $52,300
                    </p>
                    <p className="mt-1 text-xs text-[#888]">
                      8 invoices pending
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
                Last 12 months — Apr 2025 to Mar 2026
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    {MONTHLY_REVENUE.map((m) => {
                      const heightPct = (m.value / 100000) * 100;
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
                    {MONTHLY_REVENUE.map((m) => (
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
                {PROJECTS_BY_STATUS.map((p) => (
                  <div key={p.status} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-sm text-[#888]">
                      {p.status}
                    </span>
                    <div className="flex-1">
                      <div
                        className={`${p.color} h-7 rounded transition-all`}
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
                ))}
              </CardContent>
            </Card>

            {/* Budget Variance */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-black">
                  Budget Variance
                </CardTitle>
                <CardDescription className="text-sm text-[#888]">
                  Recent projects — budget vs actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e0dbd5]">
                      <TableHead className="text-xs font-medium text-[#888]">
                        Project
                      </TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#888]">
                        Budget
                      </TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#888]">
                        Actual
                      </TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#888]">
                        Variance
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BUDGET_VARIANCE.map((row) => {
                      const variance = ((row.actual - row.budget) / row.budget) * 100;
                      const isOver = variance > 0;
                      return (
                        <TableRow key={row.project} className="border-[#e0dbd5]">
                          <TableCell className="text-sm text-black">
                            {row.project}
                          </TableCell>
                          <TableCell className="text-right text-sm text-[#888]">
                            {fmt(row.budget)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-black">
                            {fmt(row.actual)}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            <span
                              className={
                                isOver ? "text-red-600" : "text-black"
                              }
                            >
                              {isOver ? "+" : ""}
                              {variance.toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
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
                {LEAD_FUNNEL.map((stage, i) => {
                  const convRate =
                    i > 0
                      ? (
                          (stage.count / LEAD_FUNNEL[i - 1].count) *
                          100
                        ).toFixed(0)
                      : null;
                  return (
                    <div key={stage.stage}>
                      {/* Conversion rate arrow */}
                      {convRate && (
                        <div className="mb-1 flex items-center justify-center gap-1 text-xs text-[#888]">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            className="text-[#888]"
                          >
                            <path
                              d="M5 2L5 8M5 8L2.5 5.5M5 8L7.5 5.5"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {convRate}% conversion
                        </div>
                      )}
                      {/* Funnel bar */}
                      <div className="flex items-center gap-3">
                        <div
                          className="mx-auto flex h-10 items-center justify-center rounded bg-black text-sm font-medium text-white transition-all"
                          style={{ width: `${stage.width}%` }}
                        >
                          <span className="flex items-center gap-2 px-3">
                            <span className="truncate">{stage.stage}</span>
                            <span className="shrink-0 font-semibold">
                              {stage.count}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                {LEAD_SOURCES.map((s) => (
                  <div key={s.source} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-sm text-[#888]">
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
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ── Section 4: Financial Details ───────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Accounts Receivable Aging */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-black">
                  Accounts Receivable Aging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e0dbd5]">
                      <TableHead className="text-xs font-medium text-[#888]">
                        Period
                      </TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#888]">
                        Amount
                      </TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#888]">
                        % of Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {AR_AGING.map((row) => {
                      const total = AR_AGING.reduce(
                        (sum, r) => sum + r.amount,
                        0
                      );
                      const pctOfTotal = ((row.amount / total) * 100).toFixed(
                        1
                      );
                      return (
                        <TableRow key={row.period} className="border-[#e0dbd5]">
                          <TableCell className="text-sm text-black">
                            {row.period}
                          </TableCell>
                          <TableCell className="text-right text-sm font-medium text-black">
                            {fmt(row.amount)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-[#888]">
                            {pctOfTotal}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="border-[#e0dbd5] font-semibold">
                      <TableCell className="text-sm text-black">Total</TableCell>
                      <TableCell className="text-right text-sm text-black">
                        {fmt(AR_AGING.reduce((s, r) => s + r.amount, 0))}
                      </TableCell>
                      <TableCell className="text-right text-sm text-[#888]">
                        100%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top Clients by Revenue */}
            <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-black">
                  Top Clients by Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e0dbd5]">
                      <TableHead className="text-xs font-medium text-[#888]">
                        Client
                      </TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#888]">
                        Revenue
                      </TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#888]">
                        Projects
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TOP_CLIENTS.map((client) => (
                      <TableRow
                        key={client.name}
                        className="border-[#e0dbd5]"
                      >
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Other Tabs (Coming Soon) ─────────────────────────────────── */}
        <TabsContent value="projects" className="mt-6">
          <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <FolderOpen strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
              <p className="mt-3 text-sm font-medium text-black">
                Project Reports
              </p>
              <p className="mt-1 text-sm text-[#888]">Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Target strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
              <p className="mt-3 text-sm font-medium text-black">
                Lead Reports
              </p>
              <p className="mt-1 text-sm text-[#888]">Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <Card className="rounded-lg border-[#e0dbd5] bg-white shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <BarChart3 strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
              <p className="mt-3 text-sm font-medium text-black">
                Custom Reports
              </p>
              <p className="mt-1 text-sm text-[#888]">Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
