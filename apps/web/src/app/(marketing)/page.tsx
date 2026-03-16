"use client";

import Link from "next/link";
import { Star, ArrowRight, ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

/* ------------------------------------------------------------------ */
/*  Section Label                                                      */
/* ------------------------------------------------------------------ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */
const stats = [
  { value: "1 in 4", label: "Homeowners report a negative contractor experience" },
  { value: "30%", label: "Average budget overrun on home renovations" },
  { value: "67%", label: "Cite poor communication as their #1 frustration" },
];

/* ------------------------------------------------------------------ */
/*  Process Steps                                                      */
/* ------------------------------------------------------------------ */
const steps = [
  {
    num: "01",
    title: "Tell Us Your Vision",
    desc: "Our AI Project Advisor asks the right questions to understand your space, your style, and your goals. No generic forms — a real conversation.",
  },
  {
    num: "02",
    title: "Get Your Solution Schedule",
    desc: "In minutes, receive a detailed project plan with phases, timelines, cost ranges, key decisions, and things to watch for. It's yours to keep — no strings attached.",
  },
  {
    num: "03",
    title: "Track Every Detail",
    desc: "Your own project management portal with real-time updates, your dedicated representative, photo documentation, and a direct line to your team.",
  },
];

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */
const testimonials = [
  {
    name: "Sarah M.",
    project: "Kitchen Remodel",
    location: "Traverse City, MI",
    text: "From the first estimate to the final walkthrough, everything was professional and on schedule. Our kitchen looks incredible.",
    rating: 5,
  },
  {
    name: "David & Lisa K.",
    project: "Master Bathroom",
    location: "Leelanau County, MI",
    text: "They transformed our dated bathroom into a spa-like retreat. The tile work is flawless and the heated floors were the best decision we made.",
    rating: 5,
  },
  {
    name: "Jennifer T.",
    project: "Whole Home Remodel",
    location: "Elk Rapids, MI",
    text: "We gutted and renovated our entire 1970s ranch. Huge project, but they kept us informed every step of the way. The project manager was outstanding.",
    rating: 5,
  },
  {
    name: "Tom & Anne B.",
    project: "Custom Home Build",
    location: "Old Mission, MI",
    text: "Building a custom home is stressful, but they made it as smooth as possible. The attention to detail exceeded our expectations.",
    rating: 5,
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  return (
    <>
      {/* ===== HERO — Dark, full-viewport ===== */}
      <section className="noise relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-[900px] px-6 text-center">
          <ScrollReveal>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
              The Operating System for Contractors
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] text-white">
              You&rsquo;re Not Looking for a Contractor.
              <br />
              You&rsquo;re Looking for a Solution.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-[600px] text-lg leading-relaxed text-white/50">
              Get a detailed project plan — phases, costs, timeline, and your dedicated
              representative — before you commit to anything.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/book"
                className="btn-gold-pulse inline-flex items-center bg-[#D4A84B] px-10 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F] hover:-translate-y-px"
              >
                Build Your Free Project Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white/80 transition-all hover:border-white hover:bg-white/5"
              >
                See How It Works
              </a>
            </div>
          </ScrollReveal>
          {/* Scroll indicator */}
          <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2">
            <ChevronDown className="h-5 w-5 text-white/30" />
          </div>
        </div>
      </section>

      {/* ===== PROBLEM — Light section ===== */}
      <section className="bg-[#FAFAFA] py-[120px] md:py-[140px]">
        <div className="mx-auto max-w-[900px] px-6">
          <ScrollReveal>
            <SectionLabel>The Problem</SectionLabel>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-[#1A1A1A]">
              Hiring a Contractor Shouldn&rsquo;t Feel Like a Gamble.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-6 max-w-[700px] text-lg leading-relaxed text-[#6B6560]">
              You&rsquo;re about to hand someone $15,000 to $150,000 to tear apart
              your home — and you have no idea if they&rsquo;ll show up on time, stay
              on budget, or even finish the job.
            </p>
          </ScrollReveal>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.value} delay={0.1 * (i + 1)}>
                <div className="text-center sm:text-left">
                  <p className="font-[family-name:var(--font-display)] text-5xl text-[#D4A84B]">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#A39E97]">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AMPLIFY — Dark section ===== */}
      <section className="noise relative overflow-hidden bg-black py-[120px] md:py-[140px]">
        <div className="relative z-10 mx-auto max-w-[900px] px-6">
          <ScrollReveal>
            <SectionLabel>The Reality</SectionLabel>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <blockquote className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,44px)] leading-[1.2] tracking-[-0.02em] text-white">
              &ldquo;He took our deposit and vanished. Six weeks later we had a
              half-demolished kitchen and no contractor.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-white/30">
              — Actual homeowner experience
            </p>
          </ScrollReveal>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <ScrollReveal delay={0.2}>
              <h3 className="text-lg font-semibold text-white">
                The Emotional Toll
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white/50">
                Homes torn apart for months. Contractors who ghost after the deposit.
                Families eating takeout in the living room while their kitchen sits
                gutted. The stress isn&rsquo;t just financial — it&rsquo;s personal.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <h3 className="text-lg font-semibold text-white">
                The Systemic Issue
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white/50">
                No transparency. No detailed plan before you commit. No accountability
                once the work starts. The industry is built on handshakes and hope —
                and homeowners pay the price when things go wrong.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== STORY / SOLUTION — Light section ===== */}
      <section id="how-it-works" className="bg-white py-[120px] md:py-[140px]">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mx-auto max-w-[800px] text-center">
            <ScrollReveal>
              <SectionLabel>The Solution</SectionLabel>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-[#1A1A1A]">
                We Engineered a Better Way to Renovate Your Home.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-[#6B6560]">
                Not only do we deliver — we help you plan every step of the way.
              </p>
            </ScrollReveal>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={0.1 * (i + 1)}>
                <div className="group border border-[#F0EDEA] p-10 transition-all duration-300 hover:border-[#D4A84B] hover:-translate-y-1">
                  <span className="font-[family-name:var(--font-display)] text-4xl text-[#D4A84B]">
                    {step.num}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[#1A1A1A]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A39E97]">
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRANSFORMATION / TESTIMONIALS — Warm section ===== */}
      <section className="bg-[#F9F7F5] py-[120px] md:py-[140px]">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mx-auto max-w-[800px] text-center">
            <ScrollReveal>
              <SectionLabel>Transformations</SectionLabel>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.02em] text-[#1A1A1A]">
                From Anxiety to Confidence.
              </h2>
            </ScrollReveal>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={0.1 * (i + 1)}>
                <div className="border border-[#F0EDEA] bg-white p-10 transition-all duration-300 hover:border-[#D4A84B] hover:-translate-y-1">
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-[#D4A84B] text-[#D4A84B]"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-[#3D3834]">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-6 border-t border-[#F0EDEA] pt-4">
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[#A39E97]">
                      {t.project} &middot; {t.location}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OFFER + RISK REVERSAL — Dark section ===== */}
      <section className="noise relative overflow-hidden bg-black py-[120px] md:py-[160px]">
        <div className="relative z-10 mx-auto max-w-[800px] px-6 text-center">
          <ScrollReveal>
            <SectionLabel>The Offer</SectionLabel>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,5vw,56px)] leading-[1.1] tracking-[-0.02em] text-white">
              Your Project Plan is Free.
              <br />
              No Strings. No Sales Pitch.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="mx-auto mt-10 flex max-w-[500px] flex-col gap-3 text-left">
              {[
                "No obligation — the plan is yours to keep",
                "No hidden fees or surprise change orders",
                "No pressure to commit",
                "Even if you don't go with us, we want you to have the tools you need",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 text-[#D4A84B]">✓</span>
                  <span className="text-base text-white/60">{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-10 max-w-[550px] text-base italic leading-relaxed text-white/30">
              &ldquo;Even if you don&rsquo;t go with us, we want you to have the
              tools you need to get the job done right.&rdquo;
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <Link
              href="/book"
              className="btn-gold-pulse mt-12 inline-flex items-center bg-[#D4A84B] px-12 py-5 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F] hover:-translate-y-px"
            >
              Build Your Free Project Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
