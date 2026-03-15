"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText } from "lucide-react";

interface Proposal {
  id: string;
  number: string;
  client: string;
  project: string;
  status: "draft" | "sent" | "viewed" | "accepted" | "declined";
  sentDate: string;
}

const mockProposals: Proposal[] = [
  { id: "1", number: "PRP-001", client: "Sarah Mitchell", project: "Kitchen Remodel", status: "accepted", sentDate: "Mar 11, 2026" },
  { id: "2", number: "PRP-002", client: "David Kim", project: "Composite Deck Build", status: "viewed", sentDate: "Mar 9, 2026" },
  { id: "3", number: "PRP-003", client: "Jennifer Torres", project: "Basement Finish", status: "sent", sentDate: "Mar 7, 2026" },
  { id: "4", number: "PRP-004", client: "Amanda Park", project: "Home Addition", status: "draft", sentDate: "---" },
];

const statusColors: Record<Proposal["status"], string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
};

export default function ProposalsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockProposals.filter(
    (p) =>
      p.number.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.project.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Proposals</h1>
          <p className="text-sm text-[#888]">
            {mockProposals.length} total proposals
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          New Proposal
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" strokeWidth={1.5} />
          <Input
            placeholder="Search proposals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
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
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Sent Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/proposals/${proposal.id}`}
                      className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
                    >
                      <FileText className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                      {proposal.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {proposal.client}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {proposal.project}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] capitalize ${statusColors[proposal.status]}`}>
                      {proposal.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#888]">
                    {proposal.sentDate}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#888]">
                    No proposals found.
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
