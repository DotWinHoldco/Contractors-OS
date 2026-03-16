"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Printer, Calendar, Eye, ArrowRight, AlertTriangle, Lightbulb } from "lucide-react";
import { useBookingStore } from "@/lib/stores/booking-store";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

export default function SolutionSchedulePage() {
  const router = useRouter();
  const { solutionSchedule, name, email, projectTypeLabel } = useBookingStore();

  // Redirect if no schedule
  if (!solutionSchedule) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            No project plan found
          </h2>
          <p className="mt-2 text-white/40">Start your project plan to see your Solution Schedule.</p>
          <Link
            href="/book"
            className="mt-6 inline-flex items-center bg-[#D4A84B] px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-black"
          >
            Start Your Plan
          </Link>
        </div>
      </div>
    );
  }

  const s = solutionSchedule;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Print-only header */}
      <div className="print-only hidden p-8">
        <p className="text-sm text-gray-500">Prepared for {name} &middot; {new Date().toLocaleDateString()}</p>
      </div>

      <div className="mx-auto max-w-[800px] px-6 py-20">
        {/* Header */}
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
            Your Solution Schedule
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(32px,5vw,48px)] leading-[1.1] tracking-[-0.02em]">
            {s.project_title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/30">Estimated Cost</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[#D4A84B]">
                {s.estimated_range}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/30">Duration</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-white">
                {s.estimated_duration}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Phase Breakdown */}
        <div className="mt-16">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
              Phase Breakdown
            </p>
          </ScrollReveal>
          <div className="mt-8 space-y-0">
            {s.phases.map((phase, i) => (
              <ScrollReveal key={i} delay={0.05 * (i + 1)}>
                <div className="relative flex gap-5 pb-8 last:pb-0">
                  {/* Vertical line + number */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#D4A84B] text-sm font-bold text-[#D4A84B]">
                      {i + 1}
                    </div>
                    {i < s.phases.length - 1 && (
                      <div className="w-px flex-1 bg-white/10" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <h3 className="text-lg font-semibold text-white">{phase.name}</h3>
                    <p className="mt-1 text-sm text-white/40">
                      {phase.duration}
                      {phase.cost_range && ` · ${phase.cost_range}`}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {phase.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Key Decisions */}
        {s.key_decisions.length > 0 && (
          <div className="mt-16">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
                Key Decisions
              </p>
            </ScrollReveal>
            <div className="mt-6 space-y-3">
              {s.key_decisions.map((d, i) => (
                <ScrollReveal key={i} delay={0.05 * (i + 1)}>
                  <div className="flex items-start gap-3 border border-[#D4A84B]/30 bg-[#D4A84B]/5 p-4">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A84B]" />
                    <p className="text-sm text-white/70">{d}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Risk Flags */}
        {s.risk_flags.length > 0 && (
          <div className="mt-12">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C1292E]">
                Things to Watch For
              </p>
            </ScrollReveal>
            <div className="mt-6 space-y-3">
              {s.risk_flags.map((r, i) => (
                <ScrollReveal key={i} delay={0.05 * (i + 1)}>
                  <div className="flex items-start gap-3 border border-[#C1292E]/30 bg-[#C1292E]/5 p-4">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#C1292E]" />
                    <p className="text-sm text-white/70">{r}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {s.next_steps.length > 0 && (
          <div className="mt-16">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
                Next Steps
              </p>
            </ScrollReveal>
            <div className="mt-6 space-y-3">
              {s.next_steps.map((step, i) => (
                <ScrollReveal key={i} delay={0.05 * (i + 1)}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D4A84B] text-xs font-bold text-black">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-white/70">{step}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="no-print mt-16 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white/80 transition-all hover:border-white hover:bg-white/5"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Your Plan
          </button>
          <Link
            href="/book/preview"
            className="btn-gold-pulse inline-flex items-center justify-center bg-[#D4A84B] px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F]"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Your Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
