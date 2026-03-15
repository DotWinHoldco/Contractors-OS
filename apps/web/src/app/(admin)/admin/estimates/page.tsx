"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText } from "lucide-react";

interface Estimate {
  id: string;
  number: string;
  client: string;
  project: string;
  amount: string;
  status: "draft" | "sent" | "accepted" | "declined";
  date: string;
}

const mockEstimates: Estimate[] = [
  { id: "1", number: "EST-001", client: "Sarah Mitchell", project: "Kitchen Remodel", amount: "$45,200", status: "accepted", date: "Mar 12, 2026" },
  { id: "2", number: "EST-002", client: "David Kim", project: "Composite Deck Build", amount: "$28,750", status: "sent", date: "Mar 10, 2026" },
  { id: "3", number: "EST-003", client: "Jennifer Torres", project: "Basement Finish", amount: "$64,800", status: "draft", date: "Mar 8, 2026" },
  { id: "4", number: "EST-004", client: "Mike Reynolds", project: "Master Bath Renovation", amount: "$31,500", status: "declined", date: "Mar 5, 2026" },
  { id: "5", number: "EST-005", client: "Amanda Park", project: "Home Addition", amount: "$95,000", status: "sent", date: "Mar 3, 2026" },
  { id: "6", number: "EST-006", client: "Greg Stevens", project: "Whole Home Remodel", amount: "$128,400", status: "draft", date: "Mar 1, 2026" },
];

const statusColors: Record<Estimate["status"], string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
};

const statusOptions: Estimate["status"][] = ["draft", "sent", "accepted", "declined"];

export default function EstimatesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Estimate["status"] | "all">("all");

  const filtered = mockEstimates.filter((e) => {
    const matchesSearch =
      e.number.toLowerCase().includes(search.toLowerCase()) ||
      e.client.toLowerCase().includes(search.toLowerCase()) ||
      e.project.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Estimates</h1>
          <p className="text-sm text-[#888]">
            {mockEstimates.length} total estimates
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
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
              {filtered.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/estimates/${estimate.id}`}
                      className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
                    >
                      <FileText className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                      {estimate.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {estimate.client}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {estimate.project}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-black">
                    {estimate.amount}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] capitalize ${statusColors[estimate.status]}`}>
                      {estimate.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#888]">
                    {estimate.date}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#888]">
                    No estimates found.
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
