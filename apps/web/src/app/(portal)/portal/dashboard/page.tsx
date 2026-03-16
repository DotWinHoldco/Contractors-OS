"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  CreditCard,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { useProjects } from "@/lib/hooks/use-projects";
import { useProjectPhases } from "@/lib/hooks/use-project-phases";
import { useAppUser } from "@/lib/hooks/use-app-user";

function fmt(n: number | null | undefined) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export default function PortalDashboardPage() {
  const { appUser } = useAppUser();
  const { data: projects, isLoading } = useProjects();

  // Get first project as the active one
  const activeProject = projects?.[0] as Record<string, unknown> | undefined;
  const projectId = activeProject?.id as string | undefined;

  const { data: phases } = useProjectPhases(projectId || "");

  const completedPhases = phases?.filter((p: Record<string, unknown>) => p.status === "completed").length || 0;
  const totalPhases = phases?.length || 1;
  const progress = Math.round((completedPhases / totalPhases) * 100);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-black sm:text-3xl">
          Welcome back{appUser?.firstName ? `, ${appUser.firstName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-[#888]">
          Here&rsquo;s what&rsquo;s happening with your project.
        </p>
      </div>

      {/* Project Status Banner */}
      {activeProject ? (
        <Card className="border-[#e0dbd5]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/portal/projects/${activeProject.id}`}
                  className="text-xl font-semibold text-black hover:underline"
                >
                  {String(activeProject.name || "Project")}
                </Link>
                <p className="mt-1 text-sm text-[#888]">
                  {String(activeProject.status || "").replace(/_/g, " ")}
                </p>
              </div>
              <p className="text-right text-sm font-medium text-[#D4A84B]">
                {fmt(activeProject.estimated_cost as number | null)}
              </p>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs font-medium uppercase tracking-wider text-[#888]">Overall Progress</span>
                <span className="font-semibold text-black">{progress}%</span>
              </div>
              <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-[#D4A84B]/15">
                <div className="progress-shimmer relative h-full rounded-full bg-[#D4A84B] transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[#e0dbd5]">
          <CardContent className="py-12 text-center">
            <p className="text-sm text-[#888]">No active projects yet. Your project will appear here once it&rsquo;s set up.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Phase Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#e0dbd5]">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-black">Your Renovation Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              {!phases?.length ? (
                <p className="py-4 text-sm text-[#888]">No phases defined yet.</p>
              ) : (
                phases.map((phase: Record<string, unknown>, i: number) => (
                  <div key={phase.id as string} className="relative flex gap-4 pb-6 last:pb-0">
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
                    <div className="flex-1 -mt-0.5">
                      <p className={`text-sm font-semibold ${
                        phase.status === "completed" ? "text-[#2D6A4F]"
                          : phase.status === "in_progress" ? "text-[#D4A84B]"
                          : "text-[#888]"
                      }`}>
                        {String(phase.name)}
                        {phase.status === "in_progress" && (
                          <span className="ml-2 inline-block bg-[#D4A84B]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D4A84B]">
                            Current
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
                  <p className="text-sm font-semibold text-black">Project Manager</p>
                  <p className="text-xs text-[#888]">Assigned to your project</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-[#e0dbd5]">
            <CardContent className="grid grid-cols-2 gap-2 p-4">
              <Link href="/portal/messages" className="flex flex-col items-center gap-1 rounded-lg border border-[#e0dbd5] p-3 text-center hover:bg-[#f8f8f8]">
                <MessageSquare className="h-5 w-5 text-[#888]" />
                <span className="text-xs font-medium text-[#888]">Messages</span>
              </Link>
              <Link href="/portal/payments" className="flex flex-col items-center gap-1 rounded-lg border border-[#e0dbd5] p-3 text-center hover:bg-[#f8f8f8]">
                <CreditCard className="h-5 w-5 text-[#888]" />
                <span className="text-xs font-medium text-[#888]">Payments</span>
              </Link>
              <Link href="/portal/documents" className="flex flex-col items-center gap-1 rounded-lg border border-[#e0dbd5] p-3 text-center hover:bg-[#f8f8f8]">
                <Calendar className="h-5 w-5 text-[#888]" />
                <span className="text-xs font-medium text-[#888]">Documents</span>
              </Link>
              <Link href={activeProject ? `/portal/projects/${activeProject.id}` : "/portal/projects"} className="flex flex-col items-center gap-1 rounded-lg border border-[#e0dbd5] p-3 text-center hover:bg-[#f8f8f8]">
                <ArrowRight className="h-5 w-5 text-[#888]" />
                <span className="text-xs font-medium text-[#888]">Project</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
