import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Portfolio | Contractors OS",
  description: "Browse our completed projects and see the quality of our work.",
};

const projects = [
  { slug: "modern-kitchen-traverse-city", title: "Modern Kitchen Remodel", category: "Kitchen", location: "Traverse City, MI", description: "Complete kitchen gut renovation with custom white cabinetry, quartz countertops, and hardwood flooring." },
  { slug: "master-bath-renovation", title: "Master Bath Renovation", category: "Bathroom", location: "Leelanau County, MI", description: "Luxury master bathroom with walk-in shower, freestanding tub, and heated tile floors." },
  { slug: "composite-deck-build", title: "Composite Deck Build", category: "Outdoor", location: "Suttons Bay, MI", description: "600 sqft Trex composite deck with built-in seating, pergola, and LED lighting." },
  { slug: "basement-entertainment", title: "Basement Entertainment Space", category: "Basement", location: "Traverse City, MI", description: "Full basement finish with home theater, wet bar, and guest bedroom suite." },
  { slug: "whole-home-remodel", title: "Whole Home Remodel", category: "Remodel", location: "Elk Rapids, MI", description: "Complete interior renovation of a 1970s ranch. Open floor plan, new kitchen, baths, and flooring throughout." },
  { slug: "custom-home-build", title: "Custom Lake Home", category: "New Build", location: "Old Mission Peninsula, MI", description: "3,200 sqft custom home with lake views, open concept living, and premium finishes." },
];

export default function PortfolioPage() {
  return (
    <>
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[4px] text-white/30">
            Our Work
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold md:text-5xl">
            Project Portfolio
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Quality craftsmanship, delivered on every project
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.slug} href={`/portfolio/${project.slug}`}>
                <Card className="group h-full border border-[#e0dbd5] bg-white shadow-none transition-colors hover:border-black">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] bg-[#f0edea]" />
                    <div className="p-6">
                      <Badge
                        variant="secondary"
                        className="mb-2 text-[10px] font-bold uppercase tracking-widest"
                      >
                        {project.category}
                      </Badge>
                      <h3 className="text-base font-semibold text-black">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#888]">
                        {project.location}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#888]">
                        {project.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
