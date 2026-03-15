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
import {
  CheckCircle2,
  Circle,
  Clock,
  Camera,
  MessageSquare,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const project = {
  id: "proj-001",
  name: "Kitchen Renovation",
  address: "742 Evergreen Terrace",
  manager: "Mike Reynolds",
  startDate: "Jan 15, 2026",
  estimatedEnd: "Apr 30, 2026",
};

interface Phase {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "upcoming";
  completedDate?: string;
  description: string;
}

const phases: Phase[] = [
  {
    id: "p1",
    name: "Design & Planning",
    status: "completed",
    completedDate: "Jan 28, 2026",
    description: "Final layout approved, materials selected, permits filed.",
  },
  {
    id: "p2",
    name: "Demolition",
    status: "completed",
    completedDate: "Feb 8, 2026",
    description: "Existing cabinets, countertops, and flooring removed.",
  },
  {
    id: "p3",
    name: "Rough Plumbing & Electrical",
    status: "completed",
    completedDate: "Feb 22, 2026",
    description: "New plumbing lines and electrical circuits installed, passed inspection.",
  },
  {
    id: "p4",
    name: "Cabinet Installation",
    status: "completed",
    completedDate: "Mar 8, 2026",
    description: "All base and wall cabinets installed and leveled.",
  },
  {
    id: "p5",
    name: "Countertop Installation",
    status: "in_progress",
    description: "Quartz countertops being templated and fabricated. Installation scheduled for Mar 20.",
  },
  {
    id: "p6",
    name: "Backsplash & Painting",
    status: "upcoming",
    description: "Tile backsplash installation followed by final paint.",
  },
  {
    id: "p7",
    name: "Fixtures & Appliances",
    status: "upcoming",
    description: "Sink, faucet, lighting, and appliance installation.",
  },
  {
    id: "p8",
    name: "Final Walkthrough",
    status: "upcoming",
    description: "Punch list review and sign-off.",
  },
];

const dailyLogs = [
  {
    id: "log1",
    date: "Mar 14, 2026",
    note: "Countertop template completed. Fabrication in progress — 5 business days.",
  },
  {
    id: "log2",
    date: "Mar 12, 2026",
    note: "Plumber completed final rough-in for sink location adjustment.",
  },
  {
    id: "log3",
    date: "Mar 8, 2026",
    note: "All cabinets installed. Client approved alignment and spacing.",
  },
];

const photos = [
  { id: "ph1", label: "Cabinets installed", date: "Mar 8" },
  { id: "ph2", label: "Electrical rough-in", date: "Feb 20" },
  { id: "ph3", label: "Demolition complete", date: "Feb 8" },
  { id: "ph4", label: "Before — existing kitchen", date: "Jan 15" },
];

/* ------------------------------------------------------------------ */
/*  Phase Timeline Item                                                */
/* ------------------------------------------------------------------ */

function PhaseItem({ phase }: { phase: Phase }) {
  const iconMap = {
    completed: <CheckCircle2 className="h-5 w-5 text-black" />,
    in_progress: (
      <div className="flex h-5 w-5 items-center justify-center">
        <div className="h-3 w-3 animate-pulse rounded-full bg-black" />
      </div>
    ),
    upcoming: <Circle className="h-5 w-5 text-[#e0dbd5]" />,
  };

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Vertical line */}
      <div className="flex flex-col items-center">
        <div className="z-10">{iconMap[phase.status]}</div>
        <div className="w-px flex-1 bg-[#e0dbd5]" />
      </div>

      {/* Content */}
      <div className="flex-1 -mt-0.5 pb-2">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-semibold ${
              phase.status === "upcoming" ? "text-[#888]" : "text-black"
            }`}
          >
            {phase.name}
          </p>
          {phase.status === "in_progress" && (
            <Badge className="bg-black text-white text-[10px] px-1.5 py-0">
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
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalProjectDetailPage() {
  const [showAllLogs, setShowAllLogs] = useState(false);

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
          {project.address} &middot; Manager: {project.manager} &middot;{" "}
          {project.startDate} &ndash; {project.estimatedEnd}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column — Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phase Timeline */}
          <Card className="border-[#e0dbd5]">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-black">
                Project Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {phases.map((phase) => (
                <PhaseItem key={phase.id} phase={phase} />
              ))}
            </CardContent>
          </Card>

          {/* Daily Logs */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-black">
                Daily Logs
              </CardTitle>
              {dailyLogs.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllLogs(!showAllLogs)}
                  className="text-[#888]"
                >
                  {showAllLogs ? (
                    <>
                      Show Less <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show All <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {(showAllLogs ? dailyLogs : dailyLogs.slice(0, 3)).map(
                  (log) => (
                    <li key={log.id} className="border-b border-[#e0dbd5] pb-3 last:border-0 last:pb-0">
                      <p className="text-xs font-medium text-[#888]">
                        {log.date}
                      </p>
                      <p className="mt-1 text-sm text-black">{log.note}</p>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
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

          {/* Photo Gallery */}
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
                  <div
                    key={photo.id}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-[#e0dbd5]"
                  >
                    {/* Placeholder — replace with next/image when real photos exist */}
                    <div className="flex h-full items-center justify-center">
                      <Camera className="h-6 w-6 text-[#888]" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-[10px] font-medium text-white">
                        {photo.label}
                      </p>
                      <p className="text-[9px] text-white/70">{photo.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
