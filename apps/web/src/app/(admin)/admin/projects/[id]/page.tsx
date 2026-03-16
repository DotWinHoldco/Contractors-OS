"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Layers,
  CheckSquare,
  BookOpen,
  Camera,
  DollarSign,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { useProject } from "@/lib/hooks/use-projects";
import { useProjectPhases, useCreateProjectPhase, useUpdatePhaseStatus, useDeleteProjectPhase } from "@/lib/hooks/use-project-phases";
import { useTasks, useCreateTask, useToggleTaskComplete, useDeleteTask } from "@/lib/hooks/use-tasks";
import { useDailyLogs, useCreateDailyLog } from "@/lib/hooks/use-daily-logs";
import { useProjectPhotos } from "@/lib/hooks/use-project-photos";
import { toast } from "sonner";

const tabs = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "phases", label: "Phases", icon: CheckCircle2 },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "logs", label: "Daily Logs", icon: BookOpen },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "financials", label: "Financials", icon: DollarSign },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

const statusColors: Record<string, string> = {
  not_started: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  on_hold: "bg-amber-100 text-amber-700",
  planning: "bg-purple-100 text-purple-700",
  inquiry: "bg-slate-100 text-slate-700",
};

function fmt(n: number | null | undefined) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [addPhaseOpen, setAddPhaseOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addLogOpen, setAddLogOpen] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newPhaseDesc, setNewPhaseDesc] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");
  const [newLogNote, setNewLogNote] = useState("");

  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: phases, isLoading: phasesLoading } = useProjectPhases(id);
  const { data: tasks } = useTasks(id);
  const { data: logs } = useDailyLogs(id);
  const { data: photos } = useProjectPhotos(id);

  const createPhase = useCreateProjectPhase();
  const updatePhaseStatus = useUpdatePhaseStatus();
  const deletePhase = useDeleteProjectPhase();
  const createTask = useCreateTask();
  const toggleTask = useToggleTaskComplete();
  const deleteTask = useDeleteTask();
  const createLog = useCreateDailyLog();

  if (projectLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#888]">Project not found.</p>
        <Link href="/admin/projects" className="mt-4 inline-block text-sm text-black underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const client = project.clients as Record<string, unknown> | null;
  const clientName = client ? `${client.first_name || ""} ${client.last_name || ""}`.trim() : "—";
  const progress = (project.completion_percentage as number) || 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/projects" className="mb-3 inline-flex items-center gap-1 text-sm text-[#888] hover:text-black">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">{project.name}</h1>
            <p className="text-sm text-[#888]">
              {project.project_number} &middot; {clientName} &middot;{" "}
              <Badge className={`text-[10px] ${statusColors[project.status || ""] || ""}`}>
                {(project.status || "").replace(/_/g, " ")}
              </Badge>
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-black">{fmt(project.estimated_cost as number | null)}</p>
            <p className="text-xs text-[#888]">{progress}% complete</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 w-full rounded-full bg-[#e0dbd5]">
          <div className="h-full rounded-full bg-[#D4A84B] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[#e0dbd5]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-black text-black"
                : "border-transparent text-[#888] hover:text-black"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-[#e0dbd5] shadow-none">
            <CardHeader><h3 className="text-sm font-semibold">Project Details</h3></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#888]">Client</span><Link href={`/admin/clients/${(client as Record<string, unknown>)?.id || ""}`} className="font-medium text-black hover:underline">{clientName}</Link></div>
              <div className="flex justify-between"><span className="text-[#888]">Address</span><span className="text-black">{project.job_site_address || "—"}</span></div>
              <div className="flex justify-between"><span className="text-[#888]">Start</span><span className="text-black">{project.estimated_start_date || "—"}</span></div>
              <div className="flex justify-between"><span className="text-[#888]">End</span><span className="text-black">{project.estimated_end_date || "—"}</span></div>
              <div className="flex justify-between"><span className="text-[#888]">Estimated Cost</span><span className="font-semibold text-black">{fmt(project.estimated_cost as number | null)}</span></div>
            </CardContent>
          </Card>
          <Card className="border-[#e0dbd5] shadow-none">
            <CardHeader><h3 className="text-sm font-semibold">Financials Summary</h3></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#888]">Contract</span><span className="text-black">{fmt(project.contract_amount as number | null)}</span></div>
              <div className="flex justify-between"><span className="text-[#888]">Change Orders</span><span className="text-black">{fmt(project.change_order_total as number | null)}</span></div>
              <div className="flex justify-between"><span className="text-[#888]">Invoiced</span><span className="text-black">{fmt(project.total_invoiced as number | null)}</span></div>
              <div className="flex justify-between"><span className="text-[#888]">Paid</span><span className="text-black">{fmt(project.total_paid as number | null)}</span></div>
              <div className="flex justify-between border-t border-[#e0dbd5] pt-3"><span className="font-medium text-[#888]">Outstanding</span><span className="font-bold text-black">{fmt(project.total_outstanding as number | null)}</span></div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Phases */}
      {activeTab === "phases" && (
        <Card className="border-[#e0dbd5] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-semibold">Project Phases</h3>
            <Button size="sm" variant="outline" onClick={() => setAddPhaseOpen(true)}><Plus className="mr-1 h-3 w-3" /> Add Phase</Button>
          </CardHeader>
          <CardContent>
            {phasesLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : !phases?.length ? (
              <p className="py-8 text-center text-sm text-[#888]">No phases yet. Add the first phase.</p>
            ) : (
              <div className="space-y-0">
                {phases.map((phase: Record<string, unknown>, i: number) => (
                  <div key={phase.id as string} className="flex items-center gap-4 border-b border-[#e0dbd5] py-3 last:border-0">
                    <div className="flex-shrink-0">
                      {phase.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : phase.status === "in_progress" ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#D4A84B]">
                          <div className="h-2.5 w-2.5 rounded-full bg-[#D4A84B]" />
                        </div>
                      ) : (
                        <Circle className="h-5 w-5 text-[#e0dbd5]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{phase.name as string}</p>
                      {phase.description ? <p className="text-xs text-[#888]">{String(phase.description)}</p> : null}
                    </div>
                    <Badge className={`text-[10px] ${statusColors[phase.status as string || "not_started"] || ""}`}>
                      {(phase.status as string || "not started").replace(/_/g, " ")}
                    </Badge>
                    <div className="flex gap-1">
                      {phase.status !== "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[10px]"
                          onClick={() => updatePhaseStatus.mutate({ id: phase.id as string, status: "completed" })}
                        >
                          Mark Complete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-red-500"
                        onClick={() => {
                          if (confirm("Delete this phase?")) deletePhase.mutate({ id: phase.id as string, projectId: id });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tasks */}
      {activeTab === "tasks" && (
        <Card className="border-[#e0dbd5] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-semibold">Tasks</h3>
            <Button size="sm" variant="outline" onClick={() => setAddTaskOpen(true)}><Plus className="mr-1 h-3 w-3" /> Add Task</Button>
          </CardHeader>
          <CardContent>
            {!tasks?.length ? (
              <p className="py-8 text-center text-sm text-[#888]">No tasks yet.</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task: Record<string, unknown>) => (
                  <div key={task.id as string} className="flex items-center gap-3 rounded-md border border-[#e0dbd5] p-3">
                    <Checkbox
                      checked={task.status === "completed"}
                      onCheckedChange={(checked) => toggleTask.mutate({ id: task.id as string, completed: !!checked })}
                    />
                    <div className="flex-1">
                      <p className={`text-sm ${task.status === "completed" ? "text-[#888] line-through" : "text-black"}`}>
                        {task.name as string}
                      </p>
                      {task.due_date ? <p className="text-xs text-[#888]">Due: {String(task.due_date)}</p> : null}
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-red-500"
                      onClick={() => { if (confirm("Delete task?")) deleteTask.mutate(task.id as string); }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Daily Logs */}
      {activeTab === "logs" && (
        <Card className="border-[#e0dbd5] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-semibold">Daily Logs</h3>
            <Button size="sm" variant="outline" onClick={() => setAddLogOpen(true)}><Plus className="mr-1 h-3 w-3" /> Add Log</Button>
          </CardHeader>
          <CardContent>
            {!logs?.length ? (
              <p className="py-8 text-center text-sm text-[#888]">No daily logs yet.</p>
            ) : (
              <div className="space-y-4">
                {logs.map((log: Record<string, unknown>) => (
                  <div key={log.id as string} className="border-b border-[#e0dbd5] pb-3 last:border-0">
                    <p className="text-xs font-medium text-[#888]">{log.log_date as string || log.created_at as string}</p>
                    <p className="mt-1 text-sm text-black">{log.description as string || log.notes as string || ""}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Photos */}
      {activeTab === "photos" && (
        <Card className="border-[#e0dbd5] shadow-none">
          <CardHeader><h3 className="text-sm font-semibold">Photos</h3></CardHeader>
          <CardContent>
            {!photos?.length ? (
              <p className="py-8 text-center text-sm text-[#888]">No photos uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {photos.map((photo: Record<string, unknown>) => (
                  <div key={photo.id as string} className="group relative aspect-square overflow-hidden rounded-lg bg-[#e0dbd5]">
                    <div className="flex h-full items-center justify-center">
                      <Camera className="h-6 w-6 text-[#888]" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-[10px] font-medium text-white">{photo.caption as string || "Photo"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Financials */}
      {activeTab === "financials" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Estimated", value: fmt(project.estimated_cost as number | null) },
            { label: "Invoiced", value: fmt(project.total_invoiced as number | null) },
            { label: "Paid", value: fmt(project.total_paid as number | null) },
            { label: "Outstanding", value: fmt(project.total_outstanding as number | null) },
          ].map((item) => (
            <Card key={item.label} className="border-[#e0dbd5] shadow-none">
              <CardContent className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-black">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Messages */}
      {activeTab === "messages" && (
        <Card className="border-[#e0dbd5] shadow-none">
          <CardContent className="py-12 text-center">
            <p className="text-sm text-[#888]">Message threads for this project will appear here.</p>
            <Link href="/admin/messages" className="mt-4 inline-block">
              <Button variant="outline" size="sm">Go to Messages</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Add Phase Dialog */}
      <Dialog open={addPhaseOpen} onOpenChange={setAddPhaseOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Phase</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <Input placeholder="Phase name" value={newPhaseName} onChange={(e) => setNewPhaseName(e.target.value)} autoFocus />
            <Textarea placeholder="Description (optional)" value={newPhaseDesc} onChange={(e) => setNewPhaseDesc(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddPhaseOpen(false)}>Cancel</Button>
              <Button disabled={!newPhaseName.trim()} onClick={() => {
                createPhase.mutate({
                  project_id: id,
                  name: newPhaseName,
                  description: newPhaseDesc || null,
                  phase_order: (phases?.length || 0) + 1,
                  status: "not_started",
                  visible_to_client: true,
                } as never);
                setNewPhaseName(""); setNewPhaseDesc(""); setAddPhaseOpen(false);
              }}>Add Phase</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Task</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <Input placeholder="Task name" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} autoFocus />
            <Input type="date" value={newTaskDue} onChange={(e) => setNewTaskDue(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddTaskOpen(false)}>Cancel</Button>
              <Button disabled={!newTaskName.trim()} onClick={() => {
                createTask.mutate({ project_id: id, name: newTaskName, due_date: newTaskDue || null, status: "pending" } as never);
                setNewTaskName(""); setNewTaskDue(""); setAddTaskOpen(false);
              }}>Add Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Log Dialog */}
      <Dialog open={addLogOpen} onOpenChange={setAddLogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Daily Log</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <Textarea placeholder="What happened today?" value={newLogNote} onChange={(e) => setNewLogNote(e.target.value)} rows={4} autoFocus />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddLogOpen(false)}>Cancel</Button>
              <Button disabled={!newLogNote.trim()} onClick={() => {
                createLog.mutate({ project_id: id, description: newLogNote, log_date: new Date().toISOString().split("T")[0] } as never);
                setNewLogNote(""); setAddLogOpen(false);
              }}>Add Log</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
