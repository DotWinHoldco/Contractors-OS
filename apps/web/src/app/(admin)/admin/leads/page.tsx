"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  GripVertical,
  AlertCircle,
} from "lucide-react";
import { useLeads } from "@/lib/hooks/use-leads";

const statusColumns = [
  { key: "new", label: "New", color: "bg-blue-500" },
  { key: "contacted", label: "Contacted", color: "bg-amber-500" },
  { key: "qualified", label: "Qualified", color: "bg-purple-500" },
  { key: "estimate_scheduled", label: "Estimate Scheduled", color: "bg-indigo-500" },
  { key: "proposal_sent", label: "Proposal Sent", color: "bg-cyan-500" },
  { key: "won", label: "Won", color: "bg-emerald-500" },
];

const statusBadgeColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-purple-100 text-purple-700",
  needs_analysis: "bg-orange-100 text-orange-700",
  estimate_scheduled: "bg-indigo-100 text-indigo-700",
  estimate_sent: "bg-indigo-100 text-indigo-700",
  proposal_sent: "bg-cyan-100 text-cyan-700",
  negotiating: "bg-pink-100 text-pink-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
  disqualified: "bg-gray-100 text-gray-700",
  on_hold: "bg-gray-100 text-gray-700",
  nurturing: "bg-teal-100 text-teal-700",
  reactivated: "bg-violet-100 text-violet-700",
  no_response: "bg-gray-100 text-gray-700",
  archived: "bg-gray-100 text-gray-700",
};

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "$0";
  return `$${Number(value).toLocaleString()}`;
}

export default function LeadsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");

  const { data: leads, isLoading, error } = useLeads();

  const allLeads = (leads ?? []) as Record<string, unknown>[];

  const filtered = allLeads.filter((l) => {
    const name = `${String(l.first_name ?? "")} ${String(l.last_name ?? "")}`.toLowerCase();
    const desc = String(l.project_description ?? "").toLowerCase();
    const trade = String(l.trade_category ?? "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || desc.includes(q) || trade.includes(q);
  });

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Leads</h1>
            <Skeleton className="mt-1 h-4 w-24" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="mt-2 text-sm text-red-600">Failed to load leads</p>
        <p className="text-xs text-[#888]">{String((error as Error).message)}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Leads</h1>
          <p className="text-sm text-[#888]">{allLeads.length} total leads</p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          New Lead
        </Button>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex rounded-md border border-[#e0dbd5]">
          <button
            onClick={() => setView("kanban")}
            className={`p-2 ${view === "kanban" ? "bg-[#f0edea]" : ""}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 ${view === "list" ? "bg-[#f0edea]" : ""}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {allLeads.length === 0 ? (
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardContent className="p-10 text-center">
            <p className="text-sm text-[#888]">No leads yet</p>
            <p className="mt-1 text-xs text-[#aaa]">Create your first lead to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Kanban View */}
          {view === "kanban" && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {statusColumns.map((col) => {
                const colLeads = filtered.filter(
                  (l) => String(l.status ?? "") === col.key
                );
                return (
                  <div
                    key={col.key}
                    className="w-72 flex-shrink-0 rounded-md bg-[#f0edea] p-3"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${col.color}`} />
                      <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                        {col.label}
                      </p>
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        {colLeads.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {colLeads.map((lead) => {
                        const leadId = String(lead.id);
                        const firstName = String(lead.first_name ?? "");
                        const lastName = String(lead.last_name ?? "");
                        const fullName = `${firstName} ${lastName}`.trim() || "Unnamed";
                        const tradeCategory = String(lead.trade_category ?? "").replace(/_/g, " ");
                        const estimatedValue = lead.ai_estimated_value as number | null;
                        const score = (lead.score as number | null) ?? 0;
                        const source = String(lead.source ?? "").replace(/_/g, " ");
                        const createdAt = lead.created_at as string | null;
                        const daysOld = createdAt
                          ? Math.floor(
                              (Date.now() - new Date(createdAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : 0;

                        return (
                          <Link key={leadId} href={`/admin/leads/${leadId}`}>
                            <Card className="border border-[#e0dbd5] bg-white shadow-none hover:border-black">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-semibold text-black">
                                    {fullName}
                                  </p>
                                  <GripVertical className="h-3 w-3 text-[#ccc]" />
                                </div>
                                {tradeCategory ? (
                                  <p className="mt-0.5 text-xs text-[#888]">
                                    {tradeCategory}
                                  </p>
                                ) : null}
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-sm font-semibold text-black">
                                    {formatCurrency(estimatedValue)}
                                  </span>
                                  <span
                                    className={`text-xs font-bold ${scoreColor(score)}`}
                                  >
                                    {score}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center justify-between">
                                  {source ? (
                                    <Badge variant="secondary" className="text-[10px]">
                                      {source}
                                    </Badge>
                                  ) : (
                                    <span />
                                  )}
                                  <span className="text-[10px] text-[#888]">
                                    {daysOld}d ago
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {view === "list" && (
            <Card className="border border-[#e0dbd5] shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e0dbd5] text-left">
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                        Name
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                        Project
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                        Value
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                        Status
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                        Score
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                        Source
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0dbd5]">
                    {filtered.map((lead) => {
                      const leadId = String(lead.id);
                      const firstName = String(lead.first_name ?? "");
                      const lastName = String(lead.last_name ?? "");
                      const fullName = `${firstName} ${lastName}`.trim() || "Unnamed";
                      const email = String(lead.email ?? "");
                      const tradeCategory = String(lead.trade_category ?? "").replace(/_/g, " ");
                      const estimatedValue = lead.ai_estimated_value as number | null;
                      const status = String(lead.status ?? "new");
                      const score = (lead.score as number | null) ?? 0;
                      const source = String(lead.source ?? "").replace(/_/g, " ");

                      return (
                        <tr key={leadId} className="hover:bg-[#f8f8f8]">
                          <td className="px-4 py-3">
                            <Link
                              href={`/admin/leads/${leadId}`}
                              className="text-sm font-medium text-black hover:underline"
                            >
                              {fullName}
                            </Link>
                            {email ? (
                              <p className="text-xs text-[#888]">{email}</p>
                            ) : null}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#555]">
                            {tradeCategory}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-black">
                            {formatCurrency(estimatedValue)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={`text-[10px] ${statusBadgeColors[status] ?? "bg-gray-100 text-gray-700"}`}
                            >
                              {status.replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td
                            className={`px-4 py-3 text-sm font-bold ${scoreColor(score)}`}
                          >
                            {score}
                          </td>
                          <td className="px-4 py-3 text-xs text-[#888]">
                            {source}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
