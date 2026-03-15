import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

const serviceData: Record<string, { name: string; description: string; features: string[]; category: string }> = {
  "kitchen-remodeling": {
    name: "Kitchen Remodeling",
    category: "Remodeling",
    description: "A kitchen remodel is one of the highest-ROI home improvements you can make. We handle everything from design consultation through final walkthrough — cabinetry, countertops, backsplash, flooring, plumbing, electrical, and appliance installation.",
    features: ["Custom cabinetry design", "Countertop installation (granite, quartz, marble)", "Tile backsplash", "Flooring replacement", "Plumbing and fixture updates", "Electrical and lighting upgrades", "Appliance installation", "Painting and trim work"],
  },
  "bathroom-remodeling": {
    name: "Bathroom Remodeling",
    category: "Remodeling",
    description: "Transform your bathroom into a modern retreat. Whether it's a simple vanity swap or a full gut renovation, we deliver quality craftsmanship with attention to waterproofing, ventilation, and finish details.",
    features: ["Shower and tub installation", "Tile work (floor and walls)", "Vanity and countertop", "Plumbing fixture updates", "Ventilation upgrades", "Heated flooring", "Glass shower enclosures", "Accessibility modifications"],
  },
  "basement-finishing": {
    name: "Basement Finishing",
    category: "Remodeling",
    description: "Unlock the full potential of your home by finishing your basement. We handle moisture management, framing, insulation, electrical, plumbing, drywall, and finish work.",
    features: ["Moisture assessment and waterproofing", "Framing and insulation", "Electrical wiring and panels", "Plumbing for bathrooms/kitchens", "Drywall and painting", "Flooring installation", "Egress windows", "Custom bar and entertainment areas"],
  },
  "deck-construction": {
    name: "Deck & Patio Construction",
    category: "Outdoor",
    description: "Create the perfect outdoor living space with a custom-built deck or patio. We work with pressure-treated lumber, composite, cedar, and hardwood to build structures that last.",
    features: ["Custom deck design", "Composite decking (Trex, TimberTech)", "Pressure-treated lumber", "Cedar and hardwood options", "Railing systems", "Built-in seating and planters", "Pergolas and shade structures", "Outdoor lighting"],
  },
  "roofing": {
    name: "Roofing",
    category: "Exterior",
    description: "Protect your biggest investment with a quality roof. We provide full replacement, repairs, and regular inspections to keep your home safe and dry.",
    features: ["Asphalt shingle roofing", "Metal roofing", "Flat roofing systems", "Roof repairs and patching", "Gutter installation", "Soffit and fascia", "Roof inspections", "Storm damage repair"],
  },
  "siding": {
    name: "Siding & Exterior",
    category: "Exterior",
    description: "Update your home's curb appeal and weather protection with new siding. We install vinyl, fiber cement, wood, and engineered options.",
    features: ["Vinyl siding", "Fiber cement (James Hardie)", "Wood siding", "Window installation", "Exterior trim and fascia", "House wrap and insulation", "Power washing", "Exterior painting"],
  },
  "new-construction": {
    name: "New Construction",
    category: "Construction",
    description: "Build your dream home from the ground up. Our team manages every phase of construction — from permits and foundation to final inspection and walkthrough.",
    features: ["Custom home design coordination", "Permit acquisition", "Foundation and framing", "Full mechanical systems", "Interior finishing", "Landscaping coordination", "Project management throughout", "Warranty and follow-up"],
  },
  "additions": {
    name: "Home Additions",
    category: "Construction",
    description: "Need more space? We build additions that blend seamlessly with your existing home — from second stories to bump-outs to attached garages.",
    features: ["Second story additions", "Room additions", "Garage additions", "Sunroom construction", "In-law suites", "Structural engineering", "Foundation work", "Seamless integration with existing structure"],
  },
  "handyman": {
    name: "Handyman Services",
    category: "General",
    description: "For smaller projects and repairs that still need professional quality. Our handyman team handles the jobs that don't require a full crew but still deserve expert attention.",
    features: ["Drywall repair", "Interior and exterior painting", "Fixture installation", "Door and window adjustments", "Shelving and storage", "Minor plumbing and electrical", "Caulking and weatherproofing", "General maintenance"],
  },
};

export function generateStaticParams() {
  return Object.keys(serviceData).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = serviceData[params.slug];
  if (!service) return {};
  return {
    title: `${service.name} | Contractors OS`,
    description: service.description.slice(0, 160),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) notFound();

  return (
    <>
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/services"
            className="mb-6 inline-flex items-center text-xs font-medium text-white/40 hover:text-white/60"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            All Services
          </Link>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-white/30">
            {service.category}
          </span>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold md:text-5xl">
            {service.name}
          </h1>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-lg leading-relaxed text-[#555]">
            {service.description}
          </p>

          <h2 className="mt-12 text-xs font-bold uppercase tracking-[4px] text-[#888]">
            What&apos;s Included
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {service.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-[#555]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <Link href={`/book?service=${slug}`}>
              <Button className="rounded-md bg-black px-8 text-sm font-bold uppercase tracking-wider text-white hover:bg-black/90">
                Get a Quote for {service.name}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
