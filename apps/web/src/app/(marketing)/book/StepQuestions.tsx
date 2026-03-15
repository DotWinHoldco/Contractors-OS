"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBookingStore } from "@/lib/stores/booking-store";

type Question = {
  key: string;
  label: string;
  type: "select" | "multi-select" | "text";
  options?: string[];
};

const questionsByProject: Record<string, Question[]> = {
  "kitchen-remodeling": [
    { key: "scope", label: "What do you want to update?", type: "multi-select", options: ["Cabinets", "Countertops", "Backsplash", "Flooring", "Appliances", "Lighting", "Plumbing", "Everything"] },
    { key: "style", label: "What style do you prefer?", type: "select", options: ["Modern/Contemporary", "Traditional", "Farmhouse", "Transitional", "Not sure yet"] },
    { key: "notes", label: "Anything else we should know?", type: "text" },
  ],
  "bathroom-remodeling": [
    { key: "scope", label: "What would you like to update?", type: "multi-select", options: ["Shower", "Tub", "Vanity", "Flooring", "Tile", "Fixtures", "Everything"] },
    { key: "bathType", label: "Which bathroom?", type: "select", options: ["Master bath", "Hall bath", "Guest bath", "Half bath", "Other"] },
    { key: "notes", label: "Anything else we should know?", type: "text" },
  ],
  "basement-finishing": [
    { key: "scope", label: "What do you want in the basement?", type: "multi-select", options: ["Living room", "Bedroom", "Bathroom", "Home theater", "Wet bar", "Office", "Storage", "Other"] },
    { key: "current", label: "Current state?", type: "select", options: ["Completely unfinished", "Partially finished", "Needs renovation"] },
    { key: "notes", label: "Anything else we should know?", type: "text" },
  ],
  "deck-construction": [
    { key: "material", label: "What material do you prefer?", type: "select", options: ["Pressure-treated lumber", "Composite (Trex/TimberTech)", "Cedar", "Hardwood", "Not sure"] },
    { key: "features", label: "Any special features?", type: "multi-select", options: ["Built-in seating", "Pergola", "Railing", "Lighting", "Stairs", "Hot tub area"] },
    { key: "notes", label: "Anything else we should know?", type: "text" },
  ],
  "roofing": [
    { key: "type", label: "What do you need?", type: "select", options: ["Full replacement", "Repair", "Inspection", "Storm damage"] },
    { key: "material", label: "Preferred material?", type: "select", options: ["Asphalt shingles", "Metal", "Flat/membrane", "Not sure"] },
    { key: "notes", label: "Anything else we should know?", type: "text" },
  ],
  "siding": [
    { key: "scope", label: "What do you need?", type: "multi-select", options: ["Siding", "Windows", "Trim", "Fascia/soffit", "Gutters"] },
    { key: "material", label: "Preferred siding material?", type: "select", options: ["Vinyl", "James Hardie (fiber cement)", "Wood", "Engineered wood", "Not sure"] },
    { key: "notes", label: "Anything else we should know?", type: "text" },
  ],
  "new-construction": [
    { key: "bedrooms", label: "How many bedrooms?", type: "select", options: ["2", "3", "4", "5+"] },
    { key: "style", label: "Home style?", type: "select", options: ["Ranch", "Two-story", "Cape Cod", "Modern", "Log/cabin", "Other"] },
    { key: "notes", label: "Tell us about your vision", type: "text" },
  ],
  "additions": [
    { key: "type", label: "What type of addition?", type: "select", options: ["Room addition", "Second story", "Garage", "Sunroom", "In-law suite", "Bump-out"] },
    { key: "notes", label: "Describe what you need", type: "text" },
  ],
  "handyman": [
    { key: "tasks", label: "What do you need done?", type: "multi-select", options: ["Drywall repair", "Painting", "Fixture install", "Door/window repair", "Shelving", "Plumbing", "Electrical", "Other"] },
    { key: "notes", label: "Describe the work needed", type: "text" },
  ],
};

const defaultQuestions: Question[] = [
  { key: "description", label: "Describe your project", type: "text" },
];

export function StepQuestions() {
  const { projectType, answers, setAnswer, nextStep, prevStep } =
    useBookingStore();

  const questions = questionsByProject[projectType] ?? defaultQuestions;

  function handleMultiToggle(key: string, option: string) {
    const current = (answers[key] as string[]) || [];
    if (current.includes(option)) {
      setAnswer(
        key,
        current.filter((o) => o !== option)
      );
    } else {
      setAnswer(key, [...current, option]);
    }
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-black md:text-3xl">
        Tell us more
      </h2>
      <p className="mt-2 text-sm text-[#888]">
        These details help us provide a more accurate estimate.
      </p>

      <div className="mt-8 space-y-6">
        {questions.map((q) => (
          <div key={q.key}>
            <Label className="text-sm font-semibold text-black">
              {q.label}
            </Label>
            {q.type === "select" && q.options && (
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswer(q.key, opt)}
                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      answers[q.key] === opt
                        ? "border-black bg-black text-white"
                        : "border-[#e0dbd5] bg-white text-[#555] hover:border-black"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {q.type === "multi-select" && q.options && (
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleMultiToggle(q.key, opt)}
                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      ((answers[q.key] as string[]) || []).includes(opt)
                        ? "border-black bg-black text-white"
                        : "border-[#e0dbd5] bg-white text-[#555] hover:border-black"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {q.type === "text" && (
              <Textarea
                className="mt-2"
                rows={3}
                value={(answers[q.key] as string) || ""}
                onChange={(e) => setAnswer(q.key, e.target.value)}
                placeholder="Type here..."
              />
            )}
          </div>
        ))}
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
          Continue
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
