"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Circle,
  Clock,
  Camera,
  MessageSquare,
  ArrowLeft,
  Plus,
  Phone,
  Mail,
  User,
  Trash2,
} from "lucide-react";
import { useProject } from "@/lib/hooks/use-projects";
import { useProjectPhases } from "@/lib/hooks/use-project-phases";
import { useTasks, useCreateTask, useToggleTaskComplete, useDeleteTask } from "@/lib/hooks/use-tasks";
import { useDailyLogs } from "@/lib/hooks/use-daily-logs";
import { useProjectPhotos } from "@/lib/hooks/use-project-photos";

function fmt(n: number | null | undefined) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export default function PortalProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const { data: project, isLoading } = useProject(id);
  const { data: phases } = useProjectPhases(id);
  const { data: tasks } = useTasks(id);
  const { data: logs } = useDailyLogs(id);
  const { data: photos } = useProjectPhotos(id);

  const createTask = useCreateTask();
  const toggleTask = useToggleTaskComplete();
  const deleteTask = useDeleteTask();

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-4 w-96" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#888]">Project not found.</p>
        <Link href="/portal/projects" className="mt-4 inline-block text-sm text-black underline">Back to Projects</Link>
      </div>
    );
  }

  const completedPhases = phases?.filter((p: Record<string, unknown>) => p.status === "completed").length || 0;
  const totalPhases = phases?.length || 1;
  const progress = Math.round((completedPhases / totalPhases) * 100);

  return (
    <div className="space-y-8">
      {/* Back + Title */}
      <div>
        <Link href="/portal/projects" className="mb-3 inline-flex items-center gap-1 text-sm text-[#888] hover:text-black">
          <ArrowLeft className="h-4 w-4" />Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-black sm:text-3xl">{String(project.name)}</h1>
        <p className="mt-1 text-sm text-[#888]">
          {project.job_site_address ? String(project.job_site_address) : ""}{project.estimated_start_date ? ` · ${String(project.estimated_start_date)}` : ""}{project.estimated_end_date ? ` – ${String(project.estimated_end_date)}` : ""}
        </p>
      </div>

      {/* Gold Progress Bar */}
      <Card className="border-[#e0dbd5]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#888]">Overall Progress</span>
            <span className="font-semibold text-black">{progress}%</span>
          </div>
          <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-[#D4A84B]/15">
            <div className="progress-shimmer relative h-full rounded-full bg-[#D4A84B] transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm text-[#888]">{fmt(project.estimated_cost as number | null)}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phase Timeline */}
          <Card className="border-[#e0dbd5]">
            <CardHeader><CardTitle className="text-base font-semibold text-black">Project Timeline</CardTitle></CardHeader>
            <CardContent>
              {!phases?.length ? (
                <p className="py-4 text-sm text-[#888]">No phases defined yet.</p>
              ) : (
                phases.map((phase: Record<string, unknown>, i: number) => (
                  <div key={phase.id as string} className="relative flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      {phase.status === "completed" ? <CheckCircle2 className="h-5 w-5 text-[#2D6A4F]" />
                        : phase.status === "in_progress" ? <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#D4A84B]"><div className="h-2.5 w-2.5 rounded-full bg-[#D4A84B]" /></div>
                        : <Circle className="h-5 w-5 text-[#e0dbd5]" />}
                      {i < phases.length - 1 && <div className="w-px flex-1 bg-[#e0dbd5]" />}
                    </div>
                    <div className="flex-1 -mt-0.5 pb-2">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${phase.status === "completed" ? "text-[#2D6A4F]" : phase.status === "in_progress" ? "text-[#D4A84B]" : "text-[#888]"}`}>
                          {String(phase.name)}
                        </p>
                        {phase.status === "in_progress" && <Badge className="bg-[#D4A84B]/10 text-[#D4A84B] text-[10px] px-1.5 py-0 border-0">Current</Badge>}
                      </div>
                      {phase.client_description ? <p className="mt-1 text-sm text-[#888]">{String(phase.client_description)}</p> : phase.description ? <p className="mt-1 text-sm text-[#888]">{String(phase.description)}</p> : null}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-black">Action Items</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setAddTaskOpen(true)}>
                <Plus className="mr-1 h-3 w-3" /> Add Task
              </Button>
            </CardHeader>
            <CardContent>
              {!tasks?.length ? (
                <p className="py-4 text-sm text-[#888]">No tasks yet.</p>
              ) : (
                <ul className="space-y-3">
                  {tasks.map((task: Record<string, unknown>) => (
                    <li key={task.id as string} className="flex items-start gap-3 border-b border-[#e0dbd5] pb-3 last:border-0">
                      <Checkbox checked={task.status === "completed"} onCheckedChange={(checked) => toggleTask.mutate({ id: task.id as string, completed: !!checked })} className="mt-0.5" />
                      <div className="flex-1">
                        <p className={`text-sm ${task.status === "completed" ? "text-[#888] line-through" : "text-black"}`}>{String(task.title)}</p>
                        {task.due_date ? <span className="text-xs text-[#888]">Due: {String(task.due_date)}</span> : null}
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 text-red-500" onClick={() => { if (confirm("Delete task?")) deleteTask.mutate(task.id as string); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Daily Logs */}
          {logs && logs.length > 0 && (
            <Card className="border-[#e0dbd5]">
              <CardHeader><CardTitle className="text-base font-semibold text-black">Daily Logs</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {logs.map((log: Record<string, unknown>) => (
                    <li key={log.id as string} className="border-b border-[#e0dbd5] pb-3 last:border-0 last:pb-0">
                      <p className="text-xs font-medium text-[#888]">{String(log.log_date || log.created_at || "")}</p>
                      <p className="mt-1 text-sm text-black">{String(log.description || log.notes || "")}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Representative */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-[#888]">Your Representative</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0dbd5]"><User className="h-5 w-5 text-[#888]" /></div>
                <div>
                  <p className="text-sm font-semibold text-black">Project Manager</p>
                  <p className="text-xs text-[#888]">Assigned to your project</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border-[#e0dbd5]">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base font-semibold text-black"><Camera className="h-4 w-4" />Photos</CardTitle></CardHeader>
            <CardContent>
              {!photos?.length ? (
                <p className="py-4 text-sm text-[#888]">No photos uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((photo: Record<string, unknown>) => (
                    <div key={photo.id as string} className="group relative aspect-square overflow-hidden rounded-lg bg-[#e0dbd5]">
                      <div className="flex h-full items-center justify-center"><Camera className="h-6 w-6 text-[#888]" /></div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-[10px] font-medium text-white">{String(photo.caption || "Photo")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ask a Question */}
          <Card className="border-[#e0dbd5]">
            <CardContent className="pt-6">
              <Link href="/portal/messages"><Button className="w-full bg-black text-white hover:bg-black/90"><MessageSquare className="mr-2 h-4 w-4" />Ask a Question</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add a Task</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <Input placeholder="What do you need to do?" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} autoFocus />
            <Input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddTaskOpen(false)}>Cancel</Button>
              <Button disabled={!newTaskName.trim()} onClick={() => {
                createTask.mutate({ project_id: id, title: newTaskName, due_date: newTaskDate || null, status: "pending", created_by_client: true } as never);
                setNewTaskName(""); setNewTaskDate(""); setAddTaskOpen(false);
              }}>Add Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
