"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const projects = [
  {
    id: "proj-001",
    name: "Kitchen Renovation",
    status: "in_progress" as const,
    progress: 65,
    currentPhase: "Countertop Installation",
    startDate: "Jan 15, 2026",
    estimatedEnd: "Apr 30, 2026",
    address: "742 Evergreen Terrace",
  },
  {
    id: "proj-002",
    name: "Bathroom Remodel — Ensuite",
    status: "scheduled" as const,
    progress: 0,
    currentPhase: "Awaiting Start",
    startDate: "May 10, 2026",
    estimatedEnd: "Jun 28, 2026",
    address: "742 Evergreen Terrace",
  },
  {
    id: "proj-003",
    name: "Deck Replacement",
    status: "completed" as const,
    progress: 100,
    currentPhase: "Complete",
    startDate: "Sep 5, 2025",
    estimatedEnd: "Nov 12, 2025",
    address: "742 Evergreen Terrace",
  },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  in_progress: { label: "In Progress", variant: "default" },
  scheduled: { label: "Scheduled", variant: "secondary" },
  completed: { label: "Completed", variant: "outline" },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black sm:text-3xl">
          My Projects
        </h1>
        <p className="mt-1 text-sm text-[#888]">
          Track all your home improvement projects in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const cfg = statusConfig[project.status];
          return (
            <Link key={project.id} href={`/portal/projects/${project.id}`}>
              <Card className="h-full border-[#e0dbd5] transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold text-black">
                      {project.name}
                    </CardTitle>
                    <Badge
                      variant={cfg.variant}
                      className={
                        cfg.variant === "default"
                          ? "bg-black text-white"
                          : ""
                      }
                    >
                      {cfg.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#888]">{project.address}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#888]">Progress</span>
                      <span className="font-medium text-black">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Phase */}
                  <p className="text-sm text-[#888]">
                    Phase:{" "}
                    <span className="font-medium text-black">
                      {project.currentPhase}
                    </span>
                  </p>

                  {/* Dates */}
                  <div className="flex items-center gap-4 text-xs text-[#888]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {project.startDate}
                    </span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{project.estimatedEnd}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
