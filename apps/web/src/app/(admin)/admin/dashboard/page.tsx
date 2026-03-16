"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  Receipt,
  DollarSign,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  won: "bg-emerald-100 text-emerald-700",
  warm: "bg-orange-100 text-orange-700",
  hot: "bg-red-100 text-red-700",
  cold: "bg-slate-100 text-slate-700",
};

function useAdminMetrics() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const [leadsRes, projectsRes, invoicesRes, paymentsRes] =
        await Promise.all([
          supabase
            .from("leads")
            .select("id", { count: "exact", head: true })
            .not("status", "in", '("won","lost")'),
          supabase
            .from("projects")
            .select("id", { count: "exact", head: true })
            .eq("status", "in_progress"),
          supabase
            .from("invoices")
            .select("id, total, amount_paid")
            .in("status", ["sent", "partially_paid", "overdue"]),
          supabase
            .from("payments")
            .select("amount")
            .gte(
              "created_at",
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ).toISOString()
            ),
        ]);

      const outstandingTotal =
        invoicesRes.data?.reduce(
          (sum: number, inv: { total: number | null; amount_paid: number | null }) =>
            sum +
            ((inv.total || 0) - (inv.amount_paid || 0)),
          0
        ) || 0;

      const revenueThisMonth =
        paymentsRes.data?.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        ) || 0;

      return {
        activeLeads: leadsRes.count || 0,
        activeProjects: projectsRes.count || 0,
        outstandingInvoices: invoicesRes.data?.length || 0,
        outstandingAmount: outstandingTotal,
        revenueThisMonth,
      };
    },
  });
}

function useRecentLeads() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["recent-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, first_name, last_name, project_type, budget_range_high, status, temperature, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });
}

function useUpcomingEvents() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedule_events")
        .select("id, title, start_time, event_type")
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function AdminDashboard() {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: leads, isLoading: leadsLoading } = useRecentLeads();
  const { data: events, isLoading: eventsLoading } = useUpcomingEvents();

  const metricCards = [
    {
      label: "Active Leads",
      value: metrics?.activeLeads ?? 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Active Projects",
      value: metrics?.activeProjects ?? 0,
      icon: FolderKanban,
      color: "text-emerald-600",
    },
    {
      label: "Outstanding Invoices",
      value: metrics?.outstandingInvoices ?? 0,
      sub: metrics ? fmt(metrics.outstandingAmount) + " pending" : "",
      icon: Receipt,
      color: "text-amber-600",
    },
    {
      label: "Revenue This Month",
      value: metrics ? fmt(metrics.revenueThisMonth) : "$0",
      icon: DollarSign,
      color: "text-emerald-600",
      isCurrency: true,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <p className="text-sm text-[#888]">
            Welcome back. Here&rsquo;s what&rsquo;s happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/leads">
            <Button variant="outline" size="sm" className="text-xs">
              <Plus className="mr-1 h-3 w-3" />
              New Lead
            </Button>
          </Link>
          <Link href="/admin/projects">
            <Button
              size="sm"
              className="bg-black text-xs text-white hover:bg-black/90"
            >
              <Plus className="mr-1 h-3 w-3" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => (
          <Card
            key={metric.label}
            className="border border-[#e0dbd5] shadow-none"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  {metric.label}
                </p>
                <metric.icon
                  className="h-4 w-4 text-[#888]"
                  strokeWidth={1.5}
                />
              </div>
              {metricsLoading ? (
                <Skeleton className="mt-2 h-8 w-20" />
              ) : (
                <>
                  <p className="mt-2 text-2xl font-bold text-black">
                    {metric.isCurrency ? metric.value : String(metric.value)}
                  </p>
                  {metric.sub && (
                    <p className={`mt-1 text-xs ${metric.color}`}>
                      {metric.sub}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent Leads */}
        <Card className="border border-[#e0dbd5] shadow-none lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h2 className="text-sm font-semibold text-black">Recent Leads</h2>
            <Link
              href="/admin/leads"
              className="text-xs font-medium text-[#888] hover:text-black"
            >
              View all
              <ArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {leadsLoading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !leads?.length ? (
              <p className="p-5 text-sm text-[#888]">
                No leads yet. Create your first lead to get started.
              </p>
            ) : (
              <div className="divide-y divide-[#e0dbd5]">
                {leads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-[#f8f8f8]"
                  >
                    <div>
                      <p className="text-sm font-medium text-black">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p className="text-xs text-[#888]">
                        {lead.project_type || "General inquiry"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      {lead.budget_range_high && (
                        <span className="text-sm font-semibold text-black">
                          {fmt(lead.budget_range_high)}
                        </span>
                      )}
                      <Badge
                        className={`text-[10px] ${
                          statusColors[lead.status || lead.temperature || "new"] ||
                          statusColors.new
                        }`}
                      >
                        {lead.status || lead.temperature || "new"}
                      </Badge>
                      <span className="text-xs text-[#888]">
                        {lead.created_at
                          ? formatDistanceToNow(new Date(lead.created_at), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardHeader className="pb-2">
            <h2 className="text-sm font-semibold text-black">Upcoming</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : !events?.length ? (
              <p className="text-sm text-[#888]">
                No upcoming events scheduled.
              </p>
            ) : (
              events.map((event) => (
                <Link
                  key={event.id}
                  href="/admin/scheduling"
                  className="flex gap-3 rounded-md p-1 hover:bg-[#f8f8f8]"
                >
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#D4A84B]" />
                  <div>
                    <p className="text-sm font-medium text-black">
                      {event.title}
                    </p>
                    <p className="text-xs text-[#888]">
                      {event.start_time
                        ? new Date(event.start_time).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )
                        : ""}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
