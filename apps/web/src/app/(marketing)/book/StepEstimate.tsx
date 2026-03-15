"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useBookingStore } from "@/lib/stores/booking-store";

// Local estimate generator (works without AI backend)
function generateLocalEstimate(state: {
  projectType: string;
  complexity: string;
  dimensions: { length: string; width: string };
  budgetRange: string;
  answers: Record<string, string | string[]>;
}) {
  const baseRanges: Record<string, [number, number, string]> = {
    "kitchen-remodeling": [25000, 55000, "5-7 weeks"],
    "bathroom-remodeling": [15000, 40000, "3-4 weeks"],
    "basement-finishing": [30000, 80000, "6-10 weeks"],
    "deck-construction": [15000, 45000, "2-4 weeks"],
    "roofing": [8000, 25000, "3-7 days"],
    "siding": [10000, 35000, "1-3 weeks"],
    "new-construction": [250000, 550000, "6-12 months"],
    "additions": [50000, 150000, "2-4 months"],
    "handyman": [500, 5000, "1-3 days"],
  };

  const [baseLow, baseHigh, duration] = baseRanges[state.projectType] ?? [
    10000, 50000, "2-6 weeks",
  ];

  let multiplier = 1;
  if (state.complexity === "simple") multiplier = 0.8;
  if (state.complexity === "complex") multiplier = 1.3;

  // Factor in square footage if provided
  const sqft =
    parseFloat(state.dimensions.length) * parseFloat(state.dimensions.width);
  if (sqft > 0 && sqft < 5000) {
    const sqftMultiplier = sqft / 200; // normalize
    multiplier *= Math.max(0.5, Math.min(sqftMultiplier, 2.5));
  }

  const low = Math.round((baseLow * multiplier) / 1000) * 1000;
  const high = Math.round((baseHigh * multiplier) / 1000) * 1000;

  const factors = [
    "Materials and labor in your area",
    "Project complexity and scope",
    state.dimensions.length && state.dimensions.width
      ? `Estimated area: ${state.dimensions.length}' × ${state.dimensions.width}'`
      : null,
    "Current market pricing for materials",
    "Permits and inspections if required",
  ].filter(Boolean) as string[];

  return { low, high, duration, factors };
}

export function StepEstimate() {
  const {
    projectType,
    projectTypeLabel,
    complexity,
    dimensions,
    budgetRange,
    answers,
    estimate,
    estimateLoading,
    setEstimate,
    setEstimateLoading,
    nextStep,
    prevStep,
  } = useBookingStore();

  useEffect(() => {
    if (estimate) return;
    setEstimateLoading(true);

    // Simulate AI processing delay
    const timer = setTimeout(() => {
      const result = generateLocalEstimate({
        projectType,
        complexity,
        dimensions,
        budgetRange,
        answers,
      });
      setEstimate(result);
      setEstimateLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (estimateLoading || !estimate) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
        <p className="mt-4 text-sm font-medium text-black">
          Analyzing your project...
        </p>
        <p className="mt-1 text-xs text-[#888]">
          Our AI is generating your estimate
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-black md:text-3xl">
        Your Estimate
      </h2>
      <p className="mt-2 text-sm text-[#888]">
        Based on your {projectTypeLabel.toLowerCase()} project details
      </p>

      {/* Estimate Card */}
      <div className="mt-8 rounded-md border border-[#e0dbd5] bg-[#f8f8f8] p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
          Estimated Range
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold text-black md:text-5xl">
          ${estimate.low.toLocaleString()} &mdash; $
          {estimate.high.toLocaleString()}
        </p>
        <p className="mt-3 text-sm text-[#888]">
          Estimated duration:{" "}
          <span className="font-semibold text-black">{estimate.duration}</span>
        </p>
      </div>

      {/* Factors */}
      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
          Key Factors
        </p>
        <ul className="mt-2 space-y-1.5">
          {estimate.factors.map((factor, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#555]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black" />
              {factor}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <p className="mt-6 rounded-md bg-[#f0edea] p-4 text-xs leading-relaxed text-[#888]">
        This is a preliminary range based on the information provided. Your
        final quote will be provided after an on-site consultation where we can
        assess the full scope of work.
      </p>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={prevStep} className="text-sm">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="rounded-md bg-black px-6 text-sm font-bold uppercase tracking-wider text-white hover:bg-black/90"
        >
          Schedule Consultation
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
