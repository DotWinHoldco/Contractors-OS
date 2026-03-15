"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText } from "lucide-react";

interface Contract {
  id: string;
  number: string;
  client: string;
  project: string;
  type: "construction" | "remodel" | "service" | "subcontractor";
  status: "draft" | "sent" | "signed" | "executed";
  date: string;
  amount: string;
}

const mockContracts: Contract[] = [
  { id: "1", number: "CTR-001", client: "Sarah Mitchell", project: "Kitchen Remodel", type: "remodel", status: "executed", date: "Mar 12, 2026", amount: "$45,200" },
  { id: "2", number: "CTR-002", client: "David Kim", project: "Composite Deck Build", type: "construction", status: "signed", date: "Mar 10, 2026", amount: "$28,750" },
  { id: "3", number: "CTR-003", client: "Jennifer Torres", project: "Basement Finish", type: "remodel", status: "sent", date: "Mar 8, 2026", amount: "$64,800" },
  { id: "4", number: "CTR-004", client: "Mike Reynolds", project: "Master Bath Renovation", type: "service", status: "draft", date: "Mar 5, 2026", amount: "$31,500" },
  { id: "5", number: "CTR-005", client: "Ace Framing LLC", project: "Home Addition", type: "subcontractor", status: "signed", date: "Mar 3, 2026", amount: "$18,600" },
];

const statusColors: Record<Contract["status"], string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  signed: "bg-amber-100 text-amber-700",
  executed: "bg-emerald-100 text-emerald-700",
};

const statusOptions: Contract["status"][] = ["draft", "sent", "signed", "executed"];

export default function ContractsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Contract["status"] | "all">("all");

  const filtered = mockContracts.filter((c) => {
    const matchesSearch =
      c.number.toLowerCase().includes(search.toLowerCase()) ||
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.project.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Contracts</h1>
          <p className="text-sm text-[#888]">
            {mockContracts.length} total contracts
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
              {filtered.map((contract) => (
                <tr key={contract.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/contracts/${contract.id}`}
                      className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
                    >
                      <FileText className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                      {contract.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">{contract.client}</td>
                  <td className="px-4 py-3 text-sm text-[#555]">{contract.project}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs capitalize text-[#555]">{contract.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] capitalize ${statusColors[contract.status]}`}>
                      {contract.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#888]">{contract.date}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-black">{contract.amount}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-[#888]">
                    No contracts found.
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
