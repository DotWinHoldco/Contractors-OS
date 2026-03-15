"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Hammer,
  Bath,
  Home,
  Wrench,
  Shield,
  Star,
  PlusCircle,
  TreePine,
  Layers,
} from "lucide-react";
import { useBookingStore } from "@/lib/stores/booking-store";

const projectTypes = [
  { slug: "kitchen-remodeling", label: "Kitchen Remodel", icon: Hammer, desc: "Cabinets, countertops, flooring, and more" },
  { slug: "bathroom-remodeling", label: "Bathroom Remodel", icon: Bath, desc: "Showers, tubs, vanities, tile work" },
  { slug: "basement-finishing", label: "Basement Finishing", icon: Layers, desc: "Turn unused space into living area" },
  { slug: "deck-construction", label: "Deck & Patio", icon: TreePine, desc: "Composite, cedar, hardwood decks" },
  { slug: "roofing", label: "Roofing", icon: Shield, desc: "Replacement, repair, and inspections" },
  { slug: "siding", label: "Siding & Exterior", icon: Home, desc: "Vinyl, fiber cement, wood siding" },
  { slug: "new-construction", label: "New Construction", icon: Star, desc: "Custom home building from the ground up" },
  { slug: "additions", label: "Home Additions", icon: PlusCircle, desc: "Second stories, bump-outs, garages" },
  { slug: "handyman", label: "Handyman Services", icon: Wrench, desc: "Repairs, maintenance, small projects" },
];

export function StepProjectType() {
  const { projectType, setProjectType, nextStep } = useBookingStore();

  function handleSelect(slug: string, label: string) {
    setProjectType(slug, label);
    nextStep();
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-black md:text-3xl">
        What type of project?
      </h2>
      <p className="mt-2 text-sm text-[#888]">
        Select the category that best describes your project.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projectTypes.map((pt) => (
          <Card
            key={pt.slug}
            className={`cursor-pointer border transition-colors hover:border-black ${
              projectType === pt.slug
                ? "border-black bg-[#f8f8f8]"
                : "border-[#e0dbd5] bg-white"
            }`}
            onClick={() => handleSelect(pt.slug, pt.label)}
          >
            <CardContent className="flex items-start gap-3 p-4">
              <pt.icon
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#888]"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-sm font-semibold text-black">{pt.label}</p>
                <p className="mt-0.5 text-xs text-[#888]">{pt.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
