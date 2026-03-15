"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  GripVertical,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  value: string;
  source: string;
  status: string;
  score: number;
  daysOld: number;
}

const mockLeads: Lead[] = [
  { id: "1", name: "Sarah Mitchell", email: "sarah@example.com", phone: "(231) 555-0101", project: "Kitchen Remodel", value: "$45,000", source: "Website", status: "new", score: 85, daysOld: 0 },
  { id: "2", name: "David Kim", email: "david@example.com", phone: "(231) 555-0102", project: "Deck Build", value: "$28,000", source: "Website", status: "contacted", score: 72, daysOld: 1 },
  { id: "3", name: "Jennifer Torres", email: "jennifer@example.com", phone: "(231) 555-0103", project: "Basement Finish", value: "$65,000", source: "Referral", status: "new", score: 90, daysOld: 2 },
  { id: "4", name: "Mike Reynolds", email: "mike@example.com", phone: "(231) 555-0104", project: "Bathroom Remodel", value: "$32,000", source: "Website", status: "quoted", score: 68, daysOld: 5 },
  { id: "5", name: "Lisa Chen", email: "lisa@example.com", phone: "(231) 555-0105", project: "Roofing", value: "$18,000", source: "Google", status: "new", score: 55, daysOld: 3 },
  { id: "6", name: "Tom Bradley", email: "tom@example.com", phone: "(231) 555-0106", project: "Siding", value: "$22,000", source: "Website", status: "qualified", score: 78, daysOld: 7 },
  { id: "7", name: "Amanda Park", email: "amanda@example.com", phone: "(231) 555-0107", project: "Addition", value: "$95,000", source: "Referral", status: "proposal_sent", score: 92, daysOld: 10 },
  { id: "8", name: "Greg Stevens", email: "greg@example.com", phone: "(231) 555-0108", project: "Whole Home Remodel", value: "$130,000", source: "Website", status: "won", score: 95, daysOld: 14 },
];

const statusColumns = [
  { key: "new", label: "New", color: "bg-blue-500" },
  { key: "contacted", label: "Contacted", color: "bg-amber-500" },
  { key: "qualified", label: "Qualified", color: "bg-purple-500" },
  { key: "quoted", label: "Quoted", color: "bg-indigo-500" },
  { key: "proposal_sent", label: "Proposal Sent", color: "bg-cyan-500" },
  { key: "won", label: "Won", color: "bg-emerald-500" },
];

const statusBadgeColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-purple-100 text-purple-700",
  quoted: "bg-indigo-100 text-indigo-700",
  proposal_sent: "bg-cyan-100 text-cyan-700",
  won: "bg-emerald-100 text-emerald-700",
};

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

export default function LeadsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");

  const filtered = mockLeads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.project.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Leads</h1>
          <p className="text-sm text-[#888]">{mockLeads.length} total leads</p>
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

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map((col) => {
            const colLeads = filtered.filter((l) => l.status === col.key);
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
                  {colLeads.map((lead) => (
                    <Link key={lead.id} href={`/admin/leads/${lead.id}`}>
                      <Card className="border border-[#e0dbd5] bg-white shadow-none hover:border-black">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-semibold text-black">
                              {lead.name}
                            </p>
                            <GripVertical className="h-3 w-3 text-[#ccc]" />
                          </div>
                          <p className="mt-0.5 text-xs text-[#888]">
                            {lead.project}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-black">
                              {lead.value}
                            </span>
                            <span className={`text-xs font-bold ${scoreColor(lead.score)}`}>
                              {lead.score}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <Badge variant="secondary" className="text-[10px]">
                              {lead.source}
                            </Badge>
                            <span className="text-[10px] text-[#888]">
                              {lead.daysOld}d ago
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
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
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#f8f8f8]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-sm font-medium text-black hover:underline"
                      >
                        {lead.name}
                      </Link>
                      <p className="text-xs text-[#888]">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">
                      {lead.project}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-black">
                      {lead.value}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] ${statusBadgeColors[lead.status]}`}>
                        {lead.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className={`px-4 py-3 text-sm font-bold ${scoreColor(lead.score)}`}>
                      {lead.score}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#888]">
                      {lead.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
