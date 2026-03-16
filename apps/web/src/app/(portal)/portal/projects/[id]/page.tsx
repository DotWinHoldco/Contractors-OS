"use client";

import React, { useState } from "react";
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
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
  Mail,
  User,
  Calendar,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const project = {
  id: "proj-001",
  name: "Kitchen Renovation",
  address: "742 Evergreen Terrace",
  startDate: "Jan 15, 2026",
  estimatedEnd: "Apr 30, 2026",
  progress: 65,
  estimatedRange: "$28,000 – $38,000",
};

const representative = {
  name: "Mike Reynolds",
  title: "Project Manager",
  phone: "(231) 555-0147",
  email: "mike@grandtraversehomeco.com",
};

interface Phase {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "upcoming";
  completedDate?: string;
  description: string;
}

const phases: Phase[] = [
  { id: "p1", name: "Design & Planning", status: "completed", completedDate: "Jan 28, 2026", description: "Final layout approved, materials selected, permits filed." },
  { id: "p2", name: "Demolition", status: "completed", completedDate: "Feb 8, 2026", description: "Existing cabinets, countertops, and flooring removed." },
  { id: "p3", name: "Rough Plumbing & Electrical", status: "completed", completedDate: "Feb 22, 2026", description: "New plumbing lines and electrical circuits installed, passed inspection." },
  { id: "p4", name: "Cabinet Installation", status: "completed", completedDate: "Mar 8, 2026", description: "All base and wall cabinets installed and leveled." },
  { id: "p5", name: "Countertop Installation", status: "in_progress", description: "Quartz countertops being templated and fabricated. Installation scheduled for Mar 20." },
  { id: "p6", name: "Backsplash & Painting", status: "upcoming", description: "Tile backsplash installation followed by final paint." },
  { id: "p7", name: "Fixtures & Appliances", status: "upcoming", description: "Sink, faucet, lighting, and appliance installation." },
  { id: "p8", name: "Final Walkthrough", status: "upcoming", description: "Punch list review and sign-off." },
];

const dailyLogs = [
  { id: "log1", date: "Mar 14, 2026", note: "Countertop template completed. Fabrication in progress — 5 business days." },
  { id: "log2", date: "Mar 12, 2026", note: "Plumber completed final rough-in for sink location adjustment." },
  { id: "log3", date: "Mar 8, 2026", note: "All cabinets installed. Client approved alignment and spacing." },
];

const photos = [
  { id: "ph1", label: "Cabinets installed", date: "Mar 8", phase: "Cabinet Installation" },
  { id: "ph2", label: "Electrical rough-in", date: "Feb 20", phase: "Rough Plumbing & Electrical" },
  { id: "ph3", label: "Demolition complete", date: "Feb 8", phase: "Demolition" },
  { id: "ph4", label: "Before — existing kitchen", date: "Jan 15", phase: "Before" },
];

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  createdByClient: boolean;
  completedAt?: string;
}

const initialTasks: Task[] = [
  { id: "t1", title: "Choose countertop material", dueDate: "2026-03-05", completed: true, createdByClient: false, completedAt: "Mar 3, 2026" },
  { id: "t2", title: "Select backsplash tile", dueDate: "2026-03-15", completed: false, createdByClient: false },
  { id: "t3", title: "Confirm appliance delivery date", dueDate: "2026-03-20", completed: false, createdByClient: true },
  { id: "t4", title: "Sign change order #2", dueDate: "2026-03-18", completed: false, createdByClient: false },
];

/* ------------------------------------------------------------------ */
/*  Calendar Component                                                 */
/* ------------------------------------------------------------------ */

function MiniCalendar({
  events,
  onDayDoubleClick,
}: {
  events: Array<{ date: string; title: string; type: "contractor" | "client" }>;
  onDayDoubleClick: (date: string) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2)); // March 2026

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-1 hover:bg-[#e0dbd5]/50 rounded">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h4 className="text-sm font-semibold text-black">{monthName}</h4>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-1 hover:bg-[#e0dbd5]/50 rounded">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1 text-[10px] font-semibold uppercase tracking-wider text-[#888]">
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dayEvents = getEventsForDay(day);
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          return (
            <button
              key={day}
              onDoubleClick={() => onDayDoubleClick(dateStr)}
              className={`relative flex h-10 items-center justify-center rounded text-sm transition-colors hover:bg-[#e0dbd5]/50 ${
                dayEvents.length > 0 ? "font-semibold" : "text-[#555]"
              }`}
            >
              {day}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dayEvents.map((e, j) => (
                    <div
                      key={j}
                      className={`h-1 w-1 rounded-full ${
                        e.type === "contractor" ? "bg-[#D4A84B]" : "bg-[#1B4965]"
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[10px] text-[#888]">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-[#D4A84B]" />
          Contractor
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-[#1B4965]" />
          Your tasks
        </div>
        <span className="ml-auto">Double-click to add task</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalProjectDetailPage() {
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const calendarEvents = [
    { date: "2026-03-20", title: "Countertop installation", type: "contractor" as const },
    { date: "2026-03-22", title: "Backsplash tile delivery", type: "contractor" as const },
    { date: "2026-03-15", title: "Select backsplash tile", type: "client" as const },
    { date: "2026-03-18", title: "Sign change order", type: "client" as const },
  ];

  function handleAddTask() {
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        title: newTaskTitle,
        dueDate: newTaskDate || "",
        completed: false,
        createdByClient: true,
      },
    ]);
    setNewTaskTitle("");
    setNewTaskDate("");
    setAddTaskOpen(false);
  }

  function toggleTask(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toLocaleDateString() : undefined,
            }
          : t
      )
    );
  }

  return (
    <div className="space-y-8">
      {/* Back + Title */}
      <div>
        <Link
          href="/portal/projects"
          className="mb-3 inline-flex items-center gap-1 text-sm text-[#888] hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-black sm:text-3xl">
          {project.name}
        </h1>
        <p className="mt-1 text-sm text-[#888]">
          {project.address} &middot; {project.startDate} – {project.estimatedEnd}
        </p>
      </div>

      {/* Gold Progress Bar */}
      <Card className="border-[#e0dbd5]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#888]">Overall Progress</span>
            <span className="font-semibold text-black">{project.progress}%</span>
          </div>
          <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-[#D4A84B]/15">
            <div
              className="progress-shimmer relative h-full rounded-full bg-[#D4A84B] transition-all duration-1000"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-[#888]">{project.estimatedRange}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phase Timeline */}
          <Card className="border-[#e0dbd5]">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-black">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {phases.map((phase, i) => (
                <div key={phase.id} className="relative flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    {phase.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-[#2D6A4F]" />
                    ) : phase.status === "in_progress" ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#D4A84B]">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#D4A84B]" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 text-[#e0dbd5]" />
                    )}
                    {i < phases.length - 1 && <div className="w-px flex-1 bg-[#e0dbd5]" />}
                  </div>
                  <div className="flex-1 -mt-0.5 pb-2">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${
                        phase.status === "completed" ? "text-[#2D6A4F]"
                          : phase.status === "in_progress" ? "text-[#D4A84B]"
                          : "text-[#888]"
                      }`}>
                        {phase.name}
                      </p>
                      {phase.status === "in_progress" && (
                        <Badge className="bg-[#D4A84B]/10 text-[#D4A84B] text-[10px] px-1.5 py-0 border-0">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-[#888]">{phase.description}</p>
                    {phase.completedDate && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#888]">
                        <Clock className="h-3 w-3" />
                        Completed {phase.completedDate}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-black">Action Items</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setAddTaskOpen(true)} className="border-[#e0dbd5]">
                <Plus className="mr-1 h-3 w-3" /> Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-start gap-3 border-b border-[#e0dbd5] pb-3 last:border-0">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <p className={`text-sm ${task.completed ? "text-[#888] line-through" : "text-black"}`}>
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {task.dueDate && (
                          <span className="text-xs text-[#888]">Due: {task.dueDate}</span>
                        )}
                        {task.createdByClient && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 border-[#e0dbd5]">Your task</Badge>
                        )}
                        {task.completedAt && (
                          <span className="text-xs text-[#2D6A4F]">✓ {task.completedAt}</span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Daily Logs */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-black">Daily Logs</CardTitle>
              {dailyLogs.length > 3 && (
                <Button variant="ghost" size="sm" onClick={() => setShowAllLogs(!showAllLogs)} className="text-[#888]">
                  {showAllLogs ? <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></> : <>Show All <ChevronDown className="ml-1 h-4 w-4" /></>}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {(showAllLogs ? dailyLogs : dailyLogs.slice(0, 3)).map((log) => (
                  <li key={log.id} className="border-b border-[#e0dbd5] pb-3 last:border-0 last:pb-0">
                    <p className="text-xs font-medium text-[#888]">{log.date}</p>
                    <p className="mt-1 text-sm text-black">{log.note}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Representative */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Your Representative</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0dbd5]">
                  <User className="h-5 w-5 text-[#888]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">{representative.name}</p>
                  <p className="text-xs text-[#888]">{representative.title}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <a href={`tel:${representative.phone}`} className="flex items-center gap-2 text-sm text-black hover:underline">
                  <Phone className="h-3.5 w-3.5 text-[#D4A84B]" />
                  {representative.phone}
                </a>
                <a href={`mailto:${representative.email}`} className="flex items-center gap-2 text-sm text-black hover:underline">
                  <Mail className="h-3.5 w-3.5 text-[#D4A84B]" />
                  {representative.email}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#888]">
                <Calendar className="h-4 w-4" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MiniCalendar
                events={calendarEvents}
                onDayDoubleClick={(date) => {
                  setNewTaskDate(date);
                  setAddTaskOpen(true);
                }}
              />
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border-[#e0dbd5]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-black">
                <Camera className="h-4 w-4" />
                Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg bg-[#e0dbd5]">
                    <div className="flex h-full items-center justify-center">
                      <Camera className="h-6 w-6 text-[#888]" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-[10px] font-medium text-white">{photo.label}</p>
                      <p className="text-[9px] text-white/70">{photo.phase} &middot; {photo.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ask a Question */}
          <Card className="border-[#e0dbd5]">
            <CardContent className="pt-6">
              <Link href="/portal/messages">
                <Button className="w-full bg-black text-white hover:bg-black/90">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask a Question
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="What do you need to do?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
            />
            <Input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddTaskOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
