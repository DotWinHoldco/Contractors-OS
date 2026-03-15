"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  LayoutDashboard,
  Layers,
  CheckSquare,
  BookOpen,
  Camera,
  FileText,
  DollarSign,
  Activity,
  Plus,
  Calendar,
  Users,
  GripVertical,
} from "lucide-react";

// Mock project data
const project = {
  name: "Mitchell Kitchen Remodel",
  number: "PRJ-001",
  status: "in_progress",
  priority: "high",
  client: { id: "1", name: "Sarah Mitchell" },
  address: "123 Lake Shore Dr, Traverse City, MI 49684",
  progress: 35,
  dates: {
    estimatedStart: "Mar 5, 2026",
    estimatedEnd: "Apr 16, 2026",
    actualStart: "Mar 5, 2026",
    actualEnd: null,
  },
  financials: {
    contract: 45000,
    changeOrders: 2500,
    invoiced: 13500,
    paid: 13500,
    outstanding: 0,
  },
  team: ["John D. (PM)", "Mike S. (Lead)", "Chris R. (Electrician)"],
  phases: [
    { id: "1", name: "Demolition", status: "completed", progress: 100, startDate: "Mar 5", endDate: "Mar 7" },
    { id: "2", name: "Rough-In (Plumbing/Electrical)", status: "completed", progress: 100, startDate: "Mar 8", endDate: "Mar 14" },
    { id: "3", name: "Cabinetry Installation", status: "in_progress", progress: 60, startDate: "Mar 15", endDate: "Mar 24" },
    { id: "4", name: "Countertops", status: "pending", progress: 0, startDate: "Mar 25", endDate: "Mar 28" },
    { id: "5", name: "Backsplash & Tile", status: "pending", progress: 0, startDate: "Mar 29", endDate: "Apr 4" },
    { id: "6", name: "Flooring", status: "pending", progress: 0, startDate: "Apr 5", endDate: "Apr 10" },
    { id: "7", name: "Final Touches & Walkthrough", status: "pending", progress: 0, startDate: "Apr 11", endDate: "Apr 16" },
  ],
  tasks: [
    { id: "1", title: "Install upper cabinets", status: "done", assignee: "Mike S.", priority: "high", due: "Mar 18" },
    { id: "2", title: "Install lower cabinets", status: "in_progress", assignee: "Mike S.", priority: "high", due: "Mar 20" },
    { id: "3", title: "Install island base", status: "in_progress", assignee: "Chris R.", priority: "medium", due: "Mar 21" },
    { id: "4", title: "Template countertops", status: "todo", assignee: "John D.", priority: "high", due: "Mar 24" },
    { id: "5", title: "Order backsplash tile", status: "todo", assignee: "John D.", priority: "medium", due: "Mar 22" },
    { id: "6", title: "Schedule final inspection", status: "backlog", assignee: "John D.", priority: "low", due: "Apr 14" },
  ],
  logs: [
    { date: "Mar 15, 2026", weather: "Sunny, 45°F", summary: "Started cabinet installation. Upper cabinets going in on west wall. Crew of 3 on site.", crewCount: 3, hours: 8 },
    { date: "Mar 14, 2026", weather: "Cloudy, 38°F", summary: "Completed rough-in electrical. Passed inspection. Insulation going in tomorrow.", crewCount: 2, hours: 6 },
    { date: "Mar 12, 2026", weather: "Rain, 42°F", summary: "Plumbing rough-in complete. Waiting for electrical inspection.", crewCount: 2, hours: 7 },
  ],
  activity: [
    { action: "Phase 'Cabinetry Installation' started", date: "Mar 15" },
    { action: "Phase 'Rough-In' marked complete", date: "Mar 14" },
    { action: "Electrical inspection passed", date: "Mar 14" },
    { action: "Invoice INV-001 paid: $13,500", date: "Mar 10" },
    { action: "Phase 'Demolition' marked complete", date: "Mar 7" },
    { action: "Project started", date: "Mar 5" },
  ],
};

const tabConfig = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "phases", label: "Phases", icon: Layers },
  { key: "tasks", label: "Tasks", icon: CheckSquare },
  { key: "logs", label: "Daily Logs", icon: BookOpen },
  { key: "photos", label: "Photos", icon: Camera },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "financials", label: "Financials", icon: DollarSign },
  { key: "activity", label: "Activity", icon: Activity },
];

const taskColumns = [
  { key: "backlog", label: "Backlog" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const phaseStatusColors: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  in_progress: "bg-blue-100 text-blue-700",
  pending: "bg-gray-100 text-gray-700",
};

const priorityDot: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-blue-500",
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="mb-3 inline-flex items-center text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Projects
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-black">{project.name}</h1>
              <Badge className="bg-blue-100 text-[10px] text-blue-700">
                {project.status.replace("_", " ")}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {project.priority}
              </Badge>
            </div>
            <p className="text-sm text-[#888]">
              {project.number} &middot;{" "}
              <Link
                href={`/admin/clients/${project.client.id}`}
                className="underline"
              >
                {project.client.name}
              </Link>{" "}
              &middot; {project.address}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-[#e0dbd5]">
            <div
              className="h-full rounded-full bg-black"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-black">
            {project.progress}%
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-[#e0dbd5]">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "border-black text-black"
                : "border-transparent text-[#888] hover:text-black"
            }`}
          >
            <tab.icon className="h-3 w-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card className="border border-[#e0dbd5] shadow-none">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-semibold text-black">Key Dates</h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Est. Start</p>
                    <p className="mt-0.5 text-sm text-black">{project.dates.estimatedStart}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Est. End</p>
                    <p className="mt-0.5 text-sm text-black">{project.dates.estimatedEnd}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Actual Start</p>
                    <p className="mt-0.5 text-sm text-black">{project.dates.actualStart}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Actual End</p>
                    <p className="mt-0.5 text-sm text-[#888]">In progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase Summary */}
            <Card className="border border-[#e0dbd5] shadow-none">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-semibold text-black">Phase Summary</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.phases.map((phase) => (
                  <div key={phase.id} className="flex items-center gap-3">
                    <div className="h-1.5 w-16 rounded-full bg-[#e0dbd5]">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                    <span className="flex-1 text-sm text-black">{phase.name}</span>
                    <Badge className={`text-[10px] ${phaseStatusColors[phase.status]}`}>
                      {phase.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border border-[#e0dbd5] shadow-none">
              <CardContent className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Contract</p>
                  <p className="mt-1 text-2xl font-bold text-black">
                    ${project.financials.contract.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Change Orders</p>
                  <p className="mt-1 text-sm text-black">
                    +${project.financials.changeOrders.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Invoiced / Paid</p>
                  <p className="mt-1 text-sm text-black">
                    ${project.financials.invoiced.toLocaleString()} / ${project.financials.paid.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#e0dbd5] shadow-none">
              <CardContent className="p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#888]">Team</p>
                {project.team.map((member) => (
                  <div key={member} className="flex items-center gap-2 py-1">
                    <div className="h-6 w-6 rounded-full bg-[#e0dbd5] text-center text-[10px] font-bold leading-6 text-[#888]">
                      {member[0]}
                    </div>
                    <span className="text-sm text-black">{member}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Phases Tab */}
      {activeTab === "phases" && (
        <div className="space-y-3">
          {project.phases.map((phase, i) => (
            <Card key={phase.id} className="border border-[#e0dbd5] shadow-none">
              <CardContent className="flex items-center gap-4 p-4">
                <GripVertical className="h-4 w-4 text-[#ccc]" />
                <span className="text-xs font-bold text-[#888]">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">{phase.name}</p>
                  <p className="text-xs text-[#888]">
                    {phase.startDate} – {phase.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-16 rounded-full bg-[#e0dbd5]">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#888]">{phase.progress}%</span>
                  <Badge className={`text-[10px] ${phaseStatusColors[phase.status]}`}>
                    {phase.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" size="sm" className="text-xs">
            <Plus className="mr-1 h-3 w-3" />
            Add Phase
          </Button>
        </div>
      )}

      {/* Tasks Tab (Kanban) */}
      {activeTab === "tasks" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {taskColumns.map((col) => {
            const colTasks = project.tasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className="w-64 flex-shrink-0 rounded-md bg-[#f0edea] p-3">
                <div className="mb-3 flex items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                    {col.label}
                  </p>
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    {colTasks.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {colTasks.map((task) => (
                    <Card key={task.id} className="border border-[#e0dbd5] bg-white shadow-none">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${priorityDot[task.priority]}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-black">{task.title}</p>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-[10px] text-[#888]">{task.assignee}</span>
                              <span className="text-[10px] text-[#888]">{task.due}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Daily Logs Tab */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <Button size="sm" className="bg-black text-xs text-white hover:bg-black/90">
            <Plus className="mr-1 h-3 w-3" />
            Add Daily Log
          </Button>
          {project.logs.map((log, i) => (
            <Card key={i} className="border border-[#e0dbd5] shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                    <p className="text-sm font-semibold text-black">{log.date}</p>
                  </div>
                  <p className="text-xs text-[#888]">{log.weather}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#555]">{log.summary}</p>
                <div className="mt-3 flex gap-4 text-xs text-[#888]">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {log.crewCount} crew
                  </span>
                  <span>{log.hours} hours</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === "photos" && (
        <div>
          <Button size="sm" className="mb-4 bg-black text-xs text-white hover:bg-black/90">
            <Plus className="mr-1 h-3 w-3" />
            Upload Photos
          </Button>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-md bg-[#f0edea]" />
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardContent className="p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-[#ccc]" strokeWidth={1.5} />
            <p className="mt-2 text-sm text-[#888]">No documents yet</p>
            <Button variant="outline" size="sm" className="mt-3 text-xs">
              Upload Document
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Financials Tab */}
      {activeTab === "financials" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Contract Amount", value: `$${project.financials.contract.toLocaleString()}` },
            { label: "Change Orders", value: `+$${project.financials.changeOrders.toLocaleString()}` },
            { label: "Total Invoiced", value: `$${project.financials.invoiced.toLocaleString()}` },
            { label: "Total Paid", value: `$${project.financials.paid.toLocaleString()}` },
          ].map((item) => (
            <Card key={item.label} className="border border-[#e0dbd5] shadow-none">
              <CardContent className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-black">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardContent className="p-5">
            <div className="space-y-4">
              {project.activity.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-black" />
                  <div>
                    <p className="text-sm text-black">{item.action}</p>
                    <p className="text-xs text-[#888]">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
