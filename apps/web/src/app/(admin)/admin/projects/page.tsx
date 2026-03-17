"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { useProjects, useCreateProject } from "@/lib/hooks/use-projects";
import { useClients } from "@/lib/hooks/use-clients";
import { useAppUser } from "@/lib/hooks/use-app-user";

const statusColors: Record<string, string> = {
  inquiry: "bg-slate-100 text-slate-700",
  planning: "bg-purple-100 text-purple-700",
  pre_construction: "bg-indigo-100 text-indigo-700",
  in_progress: "bg-blue-100 text-blue-700",
  on_hold: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  warranty: "bg-teal-100 text-teal-700",
};

function fmt(n: number | null) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export default function ProjectsPage() {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newClientId, setNewClientId] = useState("");
  const { data: projects, isLoading } = useProjects();
  const { data: clients } = useClients();
  const { appUser } = useAppUser();
  const createProject = useCreateProject();

  const filtered = (projects || []).filter(
    (p: Record<string, unknown>) => {
      const name = (p.name as string || "").toLowerCase();
      const number = (p.project_number as string || "").toLowerCase();
      const client = p.clients as Record<string, unknown> | null;
      const clientName = client ? `${client.first_name || ""} ${client.last_name || ""}`.toLowerCase() : "";
      const q = search.toLowerCase();
      return name.includes(q) || number.includes(q) || clientName.includes(q);
    }
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Projects</h1>
          <p className="text-sm text-[#888]">
            {projects?.length || 0} total projects
          </p>
        </div>
        <Button size="sm" className="bg-black text-xs text-white hover:bg-black/90" onClick={() => setCreateOpen(true)}>
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
          <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-[#f0edea]" : ""}`}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-[#f0edea]" : ""}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-lg" />
          ))}
        </div>
      ) : !filtered.length ? (
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardContent className="py-12 text-center">
            <p className="text-sm text-[#888]">No projects found. Create your first project to get started.</p>
          </CardContent>
        </Card>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project: Record<string, unknown>) => {
            const client = project.clients as Record<string, unknown> | null;
            const clientName = client ? `${client.first_name || ""} ${client.last_name || ""}`.trim() : "—";
            const status = (project.status as string) || "inquiry";
            const progress = (project.completion_percentage as number) || 0;

            return (
              <Link key={project.id as string} href={`/admin/projects/${project.id}`}>
                <Card className="h-full border border-[#e0dbd5] shadow-none transition-colors hover:border-black">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <Badge className={`text-[10px] ${statusColors[status] ?? "bg-slate-100 text-slate-700"}`}>
                        {status.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-[#888]">{project.project_number as string || ""}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-black">{project.name as string}</h3>
                    <p className="text-xs text-[#888]">{clientName}</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#888]">Progress</span>
                        <span className="font-semibold text-black">{progress}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-[#e0dbd5]">
                        <div className="h-full rounded-full bg-[#D4A84B]" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-black">{fmt(project.estimated_cost as number | null)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="border border-[#e0dbd5] shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0dbd5] text-left">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Project</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Client</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Status</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Value</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0dbd5]">
                {filtered.map((project: Record<string, unknown>) => {
                  const client = project.clients as Record<string, unknown> | null;
                  const clientName = client ? `${client.first_name || ""} ${client.last_name || ""}`.trim() : "—";
                  const status = (project.status as string) || "inquiry";
                  const progress = (project.completion_percentage as number) || 0;
                  return (
                    <tr key={project.id as string} className="hover:bg-[#f8f8f8]">
                      <td className="px-4 py-3">
                        <Link href={`/admin/projects/${project.id}`} className="text-sm font-medium text-black hover:underline">
                          {project.name as string}
                        </Link>
                        <p className="text-xs text-[#888]">{project.project_number as string || ""}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#555]">{clientName}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-[10px] ${statusColors[status] ?? ""}`}>{status.replace(/_/g, " ")}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-black">{fmt(project.estimated_cost as number | null)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-[#e0dbd5]">
                            <div className="h-full rounded-full bg-[#D4A84B]" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs text-[#888]">{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {/* Create Project Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Project Name *</Label>
              <Input placeholder="e.g. Kitchen Renovation" value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-1" autoFocus />
            </div>
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
                    {String(c.first_name || "")} {String(c.last_name || "")} {c.email ? `(${String(c.email)})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button
                disabled={!newName.trim() || !newClientId || createProject.isPending}
                onClick={() => {
                  createProject.mutate(
                    { name: newName, client_id: newClientId, tenant_id: appUser?.tenantId, status: "planning" } as never,
                    {
                      onSuccess: (data: Record<string, unknown>) => {
                        setCreateOpen(false);
                        setNewName("");
                        setNewClientId("");
                        router.push(`/admin/projects/${data.id}`);
                      },
                    }
                  );
                }}
              >
                {createProject.isPending ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
