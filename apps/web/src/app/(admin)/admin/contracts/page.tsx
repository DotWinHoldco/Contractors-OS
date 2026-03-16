"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, FileText } from "lucide-react";
import { useContracts } from "@/lib/hooks/use-contracts";

type ContractStatus = "draft" | "sent" | "signed" | "executed";

const statusColors: Record<ContractStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  signed: "bg-amber-100 text-amber-700",
  executed: "bg-emerald-100 text-emerald-700",
};

const statusOptions: ContractStatus[] = ["draft", "sent", "signed", "executed"];

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

export default function ContractsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all");
  const { data: contracts, isLoading } = useContracts();

  const rows = (contracts ?? []) as Record<string, unknown>[];

  const filtered = rows.filter((c) => {
    const number = (c.contract_number as string) ?? (c.number as string) ?? "";
    const clientObj = c.clients as Record<string, unknown> | null;
    const clientName = clientObj
      ? `${String(clientObj.first_name ?? "")} ${String(clientObj.last_name ?? "")}`.trim()
      : "";
    const projectObj = c.projects as Record<string, unknown> | null;
    const projectName = projectObj ? String(projectObj.name ?? "") : "";
    const status = (c.status as string) ?? "";

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
          <h1 className="text-2xl font-bold text-black">Contracts</h1>
          <p className="text-sm text-[#888]">
            {rows.length} total contracts
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          New Contract
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" strokeWidth={1.5} />
          <Input
            placeholder="Search contracts..."
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
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Number</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Client</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Project</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Type</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Status</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Date</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Amount</th>
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
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                    </tr>
                  ))}
                </>
              )}
              {!isLoading && filtered.map((contract) => {
                const id = String(contract.id);
                const number = (contract.contract_number as string) ?? (contract.number as string) ?? id;
                const clientObj = contract.clients as Record<string, unknown> | null;
                const clientName = clientObj
                  ? `${String(clientObj.first_name ?? "")} ${String(clientObj.last_name ?? "")}`.trim()
                  : "";
                const projectObj = contract.projects as Record<string, unknown> | null;
                const projectName = projectObj ? String(projectObj.name ?? "") : "";
                const contractType = (contract.contract_type as string) ?? (contract.type as string) ?? "";
                const status = (contract.status as string) ?? "draft";
                const date = (contract.created_at as string) ?? "";
                const amount = contract.total_amount as number | null ?? contract.amount as number | null;

                return (
                  <tr key={id} className="hover:bg-[#f8f8f8]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/contracts/${id}`}
                        className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
                      >
                        <FileText className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                        {number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">{clientName || "\u2014"}</td>
                    <td className="px-4 py-3 text-sm text-[#555]">{projectName || "\u2014"}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs capitalize text-[#555]">{contractType || "\u2014"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] capitalize ${statusColors[status as ContractStatus] ?? "bg-gray-100 text-gray-700"}`}>
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#888]">{formatDate(date)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-black">{formatCurrency(amount)}</td>
                  </tr>
                );
              })}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-[#888]">
                    {rows.length === 0
                      ? "No contracts yet. Create your first contract."
                      : "No contracts found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
