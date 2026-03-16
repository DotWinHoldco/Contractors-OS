"use client";

import Link from "next/link";
import {
  MessageSquare,
  FileText,
  CreditCard,
  Calendar,
  CheckCircle2,
  Circle,
  Lock,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { useBookingStore } from "@/lib/stores/booking-store";

export default function GuestPreviewPage() {
  const { solutionSchedule, name, projectTypeLabel } = useBookingStore();

  const schedule = solutionSchedule;
  const projectName = schedule?.project_title || `${projectTypeLabel} Project`;
  const phases = schedule?.phases || [];
  const totalPhases = phases.length || 6;
  const completedPhases = 0;
  const progressPct = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Banner */}
      <div className="bg-[#1B4965] px-6 py-4 text-center">
        <p className="text-sm font-medium text-white">
          Check your email to log in to your free project management portal.{" "}
          <span className="text-white/60">
            Plan and manage your project — even if you don&rsquo;t go with us.
          </span>
        </p>
      </div>

      {/* Header */}
      <header className="border-b border-[#E0DBD5] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black">
              <span className="text-[10px] font-bold tracking-wide text-white">C<span className="text-[#D4A84B]">&#x2022;</span>OS</span>
            </div>
            <span className="text-base font-semibold text-black">Client Portal</span>
          </div>
          <Link
            href="/auth/login"
            className="bg-black px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white"
          >
            Log In
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Welcome */}
        <h1 className="text-2xl font-bold text-black">
          Welcome, {name || "there"}
        </h1>
        <p className="mt-1 text-sm text-[#888]">
          Here&rsquo;s a preview of your project portal.
        </p>

        {/* Project Status Banner */}
        <div className="mt-6 rounded-lg border border-[#E0DBD5] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-black">{projectName}</h2>
              <p className="mt-1 text-sm text-[#888]">Research &amp; Preparation Underway</p>
            </div>
            {schedule && (
              <p className="text-right text-sm font-medium text-[#D4A84B]">
                {schedule.estimated_range}
              </p>
            )}
          </div>
          {/* Gold progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-[#888]">
                Overall Progress
              </span>
              <span className="font-medium text-black">{progressPct}%</span>
            </div>
            <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-[#D4A84B]/15">
              <div
                className="progress-shimmer relative h-full rounded-full bg-[#D4A84B] transition-all duration-1000"
                style={{ width: `${Math.max(progressPct, 3)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Phase Timeline */}
          <div className="lg:col-span-2 rounded-lg border border-[#E0DBD5] bg-white p-6">
            <h3 className="text-base font-semibold text-black">Your Renovation Roadmap</h3>
            <div className="mt-6 space-y-0">
              {phases.length > 0 ? (
                phases.map((phase, i) => (
                  <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      {i === 0 ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#D4A84B]">
                          <div className="h-2.5 w-2.5 rounded-full bg-[#D4A84B]" />
                        </div>
                      ) : (
                        <Circle className="h-6 w-6 text-[#E0DBD5]" />
                      )}
                      {i < phases.length - 1 && <div className="w-px flex-1 bg-[#E0DBD5]" />}
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <p className={`text-sm font-semibold ${i === 0 ? "text-[#D4A84B]" : "text-[#888]"}`}>
                        {phase.name}
                        {i === 0 && (
                          <span className="ml-2 inline-block bg-[#D4A84B]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D4A84B]">
                            Up Next
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-[#888]">{phase.duration}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#888]">Your phases will appear here after your plan is generated.</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Representative Card */}
            <div className="rounded-lg border border-[#E0DBD5] bg-white p-6">
              <h3 className="text-sm font-semibold text-black">Your Representative</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E0DBD5]">
                  <User className="h-5 w-5 text-[#888]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Project Manager</p>
                  <p className="text-xs text-[#888]">Assigned upon consultation</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-[#888]">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span>Available after login</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Available after login</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (locked) */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MessageSquare, label: "Messages" },
                { icon: FileText, label: "Documents" },
                { icon: CreditCard, label: "Payments" },
                { icon: Calendar, label: "Calendar" },
              ].map((action) => (
                <div
                  key={action.label}
                  className="relative flex flex-col items-center justify-center rounded-lg border border-[#E0DBD5] bg-white p-4 opacity-50"
                >
                  <Lock className="absolute top-2 right-2 h-3 w-3 text-[#888]" />
                  <action.icon className="h-5 w-5 text-[#888]" />
                  <p className="mt-2 text-xs font-medium text-[#888]">{action.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Login CTA */}
        <div className="mt-10 rounded-lg border-2 border-[#D4A84B]/30 bg-[#D4A84B]/5 p-8 text-center">
          <h3 className="text-lg font-semibold text-black">
            Your full portal is ready
          </h3>
          <p className="mt-2 text-sm text-[#888]">
            Check your email for a login link to access messages, documents, payments, and
            your complete project timeline.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex items-center bg-[#D4A84B] px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-black"
          >
            Log In to Your Portal
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[#E0DBD5] py-6 text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs text-[#BBB]">
          Powered by{" "}
          <span className="font-[family-name:var(--font-logo)] text-[#888]">.win</span>
        </p>
      </footer>
    </div>
  );
}
