"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBookingStore } from "@/lib/stores/booking-store";

const complexityOptions = [
  { value: "simple" as const, label: "Simple", desc: "Basic updates, standard materials" },
  { value: "moderate" as const, label: "Moderate", desc: "Some custom work, mid-range materials" },
  { value: "complex" as const, label: "Complex", desc: "Custom design, premium materials" },
];

const timelineOptions = [
  "ASAP",
  "1-3 months",
  "3-6 months",
  "Flexible / Not sure",
];

const budgetOptions = [
  "Under $10K",
  "$10K-$25K",
  "$25K-$50K",
  "$50K-$100K",
  "$100K-$250K",
  "$250K+",
  "Not sure yet",
];

export function StepScope() {
  const {
    dimensions,
    complexity,
    timeline,
    budgetRange,
    setDimensions,
    setComplexity,
    setTimeline,
    setBudgetRange,
    nextStep,
    prevStep,
  } = useBookingStore();

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-black md:text-3xl">
        Scope & Size
      </h2>
      <p className="mt-2 text-sm text-[#888]">
        Help us understand the scale of your project.
      </p>

      <div className="mt-8 space-y-8">
        {/* Dimensions */}
        <div>
          <Label className="text-sm font-semibold text-black">
            Approximate dimensions (optional)
          </Label>
          <div className="mt-2 flex items-center gap-3">
            <Input
              placeholder="Length (ft)"
              value={dimensions.length}
              onChange={(e) => setDimensions({ length: e.target.value })}
              className="w-32"
            />
            <span className="text-[#888]">×</span>
            <Input
              placeholder="Width (ft)"
              value={dimensions.width}
              onChange={(e) => setDimensions({ width: e.target.value })}
              className="w-32"
            />
          </div>
        </div>

        {/* Complexity */}
        <div>
          <Label className="text-sm font-semibold text-black">
            Project complexity
          </Label>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {complexityOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setComplexity(opt.value)}
                className={`rounded-md border p-4 text-left transition-colors ${
                  complexity === opt.value
                    ? "border-black bg-[#f8f8f8]"
                    : "border-[#e0dbd5] hover:border-black"
                }`}
              >
                <p className="text-sm font-semibold text-black">{opt.label}</p>
                <p className="mt-0.5 text-xs text-[#888]">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <Label className="text-sm font-semibold text-black">
            When would you like to start?
          </Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {timelineOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTimeline(opt)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  timeline === opt
                    ? "border-black bg-black text-white"
                    : "border-[#e0dbd5] text-[#555] hover:border-black"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <Label className="text-sm font-semibold text-black">
            Budget range (optional)
          </Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {budgetOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setBudgetRange(opt)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  budgetRange === opt
                    ? "border-black bg-black text-white"
                    : "border-[#e0dbd5] text-[#555] hover:border-black"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={prevStep} className="text-sm">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="rounded-md bg-black px-6 text-sm font-bold uppercase tracking-wider text-white hover:bg-black/90"
        >
          Get My Estimate
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
