"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, LayoutGrid, List } from "lucide-react";

interface Project {
  id: string;
  name: string;
  number: string;
  client: string;
  status: string;
  type: string;
  value: string;
  progress: number;
  startDate: string;
  endDate: string;
  manager: string;
}

const mockProjects: Project[] = [
  { id: "1", name: "Mitchell Kitchen Remodel", number: "PRJ-001", client: "Sarah Mitchell", status: "in_progress", type: "Kitchen", value: "$45,000", progress: 35, startDate: "Mar 5", endDate: "Apr 16", manager: "John D." },
  { id: "2", name: "Kim Composite Deck", number: "PRJ-002", client: "David Kim", status: "planning", type: "Deck", value: "$28,000", progress: 0, startDate: "Apr 1", endDate: "Apr 22", manager: "Mike S." },
  { id: "3", name: "Torres Basement Finish", number: "PRJ-003", client: "Jennifer Torres", status: "in_progress", type: "Basement", value: "$65,000", progress: 60, startDate: "Feb 10", endDate: "Apr 7", manager: "John D." },
  { id: "4", name: "Reynolds Master Bath", number: "PRJ-004", client: "Mike Reynolds", status: "completed", type: "Bathroom", value: "$32,000", progress: 100, startDate: "Jan 15", endDate: "Feb 14", manager: "Mike S." },
  { id: "5", name: "Park Home Addition", number: "PRJ-005", client: "Amanda Park", status: "planning", type: "Addition", value: "$95,000", progress: 0, startDate: "May 1", endDate: "Aug 30", manager: "John D." },
  { id: "6", name: "Stevens Whole Home", number: "PRJ-006", client: "Greg Stevens", status: "in_progress", type: "Remodel", value: "$130,000", progress: 15, startDate: "Mar 1", endDate: "May 30", manager: "John D." },
];

const statusColors: Record<string, string> = {
  planning: "bg-purple-100 text-purple-700",
  in_progress: "bg-blue-100 text-blue-700",
  on_hold: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export default function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filtered = mockProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Projects</h1>
          <p className="text-sm text-[#888]">
            {mockProjects.length} total projects
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          New Project
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex rounded-md border border-[#e0dbd5]">
          <button
            onClick={() => setView("grid")}
            className={`p-2 ${view === "grid" ? "bg-[#f0edea]" : ""}`}
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

      {view === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Link key={project.id} href={`/admin/projects/${project.id}`}>
              <Card className="h-full border border-[#e0dbd5] shadow-none transition-colors hover:border-black">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <Badge
                      className={`text-[10px] ${statusColors[project.status] ?? ""}`}
                    >
                      {project.status.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-[#888]">
                      {project.number}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-black">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#888]">{project.client}</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#888]">Progress</span>
                      <span className="font-semibold text-black">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-[#e0dbd5]">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-black">
                      {project.value}
                    </span>
                    <span className="text-xs text-[#888]">
                      {project.startDate} – {project.endDate}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {view === "list" && (
        <Card className="border border-[#e0dbd5] shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0dbd5] text-left">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Project
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Client
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Value
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Dates
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0dbd5]">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-[#f8f8f8]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm font-medium text-black hover:underline"
                      >
                        {project.name}
                      </Link>
                      <p className="text-xs text-[#888]">{project.number}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">
                      {project.client}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`text-[10px] ${statusColors[project.status] ?? ""}`}
                      >
                        {project.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-black">
                      {project.value}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-[#e0dbd5]">
                          <div
                            className="h-full rounded-full bg-black"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#888]">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#888]">
                      {project.startDate} – {project.endDate}
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
