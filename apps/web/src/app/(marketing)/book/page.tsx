"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useBookingStore } from "@/lib/stores/booking-store";
import { StepProjectType } from "./StepProjectType";
import { StepQuestions } from "./StepQuestions";
import { StepScope } from "./StepScope";
import { StepEstimate } from "./StepEstimate";
import { StepSchedule } from "./StepSchedule";
import { StepAccount } from "./StepAccount";

const stepLabels = [
  "Project Type",
  "Details",
  "Scope",
  "Estimate",
  "Schedule",
  "Account",
];

export default function BookPage() {
  const { step } = useBookingStore();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Minimal Header */}
      <header className="border-b border-[#e0dbd5] px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <p className="text-sm font-semibold text-black">
            Start Your Project
          </p>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-[#888] hover:text-black"
          >
            <X className="h-4 w-4" />
            Exit
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-[#e0dbd5] px-6 py-3">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    i + 1 < step
                      ? "bg-black text-white"
                      : i + 1 === step
                        ? "bg-black text-white"
                        : "bg-[#e0dbd5] text-[#888]"
                  }`}
                >
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:inline ${
                    i + 1 <= step ? "text-black" : "text-[#888]"
                  }`}
                >
                  {label}
                </span>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`mx-2 hidden h-px w-8 sm:block ${
                      i + 1 < step ? "bg-black" : "bg-[#e0dbd5]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-3xl">
          {step === 1 && <StepProjectType />}
          {step === 2 && <StepQuestions />}
          {step === 3 && <StepScope />}
          {step === 4 && <StepEstimate />}
          {step === 5 && <StepSchedule />}
          {step === 6 && <StepAccount />}
        </div>
      </main>
    </div>
  );
}
