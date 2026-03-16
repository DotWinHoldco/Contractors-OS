"use client";

import React from "react";
import Link from "next/link";
import { useProjects } from "@/lib/hooks/use-projects";
import { useAppUser } from "@/lib/hooks/use-app-user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, FolderOpen } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Status config                                                      */
/* ------------------------------------------------------------------ */

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  in_progress: { label: "In Progress", variant: "default" },
  active: { label: "Active", variant: "default" },
  scheduled: { label: "Scheduled", variant: "secondary" },
  planning: { label: "Planning", variant: "secondary" },
  completed: { label: "Completed", variant: "outline" },
  on_hold: { label: "On Hold", variant: "outline" },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalProjectsPage() {
  const { appUser } = useAppUser();
  const tenantId = appUser?.tenantId ?? undefined;
  const { data: projects, isLoading } = useProjects(tenantId);

  const projectList = projects ?? [];

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

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-lg" />
          ))}
        </div>
      ) : projectList.length === 0 ? (
        <Card className="border-[#e0dbd5]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
            <p className="mt-3 text-sm font-medium text-black">No projects yet</p>
            <p className="mt-1 text-sm text-[#888]">Your projects will appear here once created.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projectList.map((project) => {
            const id = project.id as string;
            const name = project.name as string;
            const status = (project.status as string) ?? "planning";
            const cfg = statusConfig[status] ?? { label: status.replace(/_/g, " "), variant: "outline" as const };
            const completion = (project.completion_percentage as number | null) ?? 0;
            const address = (project.job_site_address as string | null) ?? "";
            const startDate = project.estimated_start_date as string | null;
            const endDate = project.estimated_end_date as string | null;

            const formatDate = (d: string | null) => {
              if (!d) return "--";
              return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            };

            return (
              <Link key={id} href={`/portal/projects/${id}`}>
                <Card className="h-full border-[#e0dbd5] transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold text-black">
                        {name}
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
                    {address ? (
                      <p className="text-xs text-[#888]">{address}</p>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#888]">Progress</span>
                        <span className="font-medium text-black">
                          {completion}%
                        </span>
                      </div>
                      <Progress value={completion} className="h-2" />
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-4 text-xs text-[#888]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(startDate)}
                      </span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{formatDate(endDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
