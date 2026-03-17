"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, FileText } from "lucide-react";
import { useEstimates, useCreateEstimate } from "@/lib/hooks/use-estimates";
import { useClients } from "@/lib/hooks/use-clients";
import { useAppUser } from "@/lib/hooks/use-app-user";

type EstimateStatus = "draft" | "sent" | "accepted" | "declined";

const statusColors: Record<EstimateStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
};

const statusOptions: EstimateStatus[] = ["draft", "sent", "accepted", "declined"];

function formatCurrency(value: number | null): string {
  if (value == null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EstimatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EstimateStatus | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newClientId, setNewClientId] = useState("");
  const { appUser } = useAppUser();
  const createEstimate = useCreateEstimate();
  const { data: clients } = useClients();
  const { data: estimates, isLoading } = useEstimates();

  const rows = (estimates ?? []) as Record<string, unknown>[];

  const filtered = rows.filter((e) => {
    const number = (e.estimate_number as string) ?? (e.number as string) ?? "";
    const clientObj = e.clients as Record<string, unknown> | null;
    const clientName = clientObj
      ? `${String(clientObj.first_name ?? "")} ${String(clientObj.last_name ?? "")}`.trim()
      : "";
    const projectObj = e.projects as Record<string, unknown> | null;
    const projectName = projectObj ? String(projectObj.name ?? "") : "";
    const status = (e.status as string) ?? "";

    const matchesSearch =
      number.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      projectName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Estimates</h1>
          <p className="text-sm text-[#888]">
            {rows.length} total estimates
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-1 h-3 w-3" />
          New Estimate
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" strokeWidth={1.5} />
          <Input
            placeholder="Search estimates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-md border border-[#e0dbd5] p-1">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === "all" ? "bg-black text-white" : "text-[#888] hover:text-black"
            }`}
          >
            All
          </button>
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded px-3 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === s ? "bg-black text-white" : "text-[#888] hover:text-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Card className="border border-[#e0dbd5] shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0dbd5] text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Number
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Client
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Project
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Amount
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {isLoading && (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    </tr>
                  ))}
                </>
              )}
              {!isLoading && filtered.map((estimate) => {
                const id = String(estimate.id);
                const number = (estimate.estimate_number as string) ?? (estimate.number as string) ?? id;
                const clientObj = estimate.clients as Record<string, unknown> | null;
                const clientName = clientObj
                  ? `${String(clientObj.first_name ?? "")} ${String(clientObj.last_name ?? "")}`.trim()
                  : "";
                const projectObj = estimate.projects as Record<string, unknown> | null;
                const projectName = projectObj ? String(projectObj.name ?? "") : "";
                const amount = estimate.total_amount as number | null ?? estimate.amount as number | null;
                const status = (estimate.status as string) ?? "draft";
                const date = (estimate.created_at as string) ?? "";

                return (
                  <tr key={id} className="hover:bg-[#f8f8f8]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/estimates/${id}`}
                        className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
                      >
                        <FileText className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                        {number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">
                      {clientName || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">
                      {projectName || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-black">
                      {formatCurrency(amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] capitalize ${statusColors[status as EstimateStatus] ?? "bg-gray-100 text-gray-700"}`}>
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#888]">
                      {formatDate(date)}
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#888]">
                    {rows.length === 0
                      ? "No estimates yet. Create your first estimate."
                      : "No estimates found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Estimate</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Client *</Label>
              <select
                value={newClientId}
                onChange={(e) => setNewClientId(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#e0dbd5] bg-white px-3 py-2 text-sm"
              >
                <option value="">Select a client...</option>
                {(clients || []).map((c: Record<string, unknown>) => (
                  <option key={c.id as string} value={c.id as string}>
                    {String(c.first_name || "")} {String(c.last_name || "")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button
                disabled={!newClientId || createEstimate.isPending}
                onClick={() => {
                  createEstimate.mutate(
                    { tenant_id: appUser?.tenantId, client_id: newClientId } as never,
                    {
                      onSuccess: (data: Record<string, unknown>) => {
                        setCreateOpen(false);
                        setNewClientId("");
                        router.push(`/admin/estimates/${data.id}`);
                      },
                    }
                  );
                }}
              >
                {createEstimate.isPending ? "Creating..." : "Create Estimate"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
