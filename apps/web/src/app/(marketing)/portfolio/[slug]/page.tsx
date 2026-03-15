import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const projectsData: Record<string, { title: string; category: string; location: string; description: string; details: string; stats: { label: string; value: string }[] }> = {
  "modern-kitchen-traverse-city": {
    title: "Modern Kitchen Remodel",
    category: "Kitchen",
    location: "Traverse City, MI",
    description: "Complete kitchen gut renovation with custom white cabinetry, quartz countertops, and hardwood flooring.",
    details: "This project involved a complete gut renovation of a dated 1990s kitchen. We removed walls to create an open concept layout, installed custom soft-close cabinetry, Cambria quartz countertops, a subway tile backsplash, and refinished the original hardwood floors. New plumbing, electrical, and lighting completed the transformation.",
    stats: [{ label: "Duration", value: "6 weeks" }, { label: "Size", value: "250 sqft" }, { label: "Range", value: "$45K-55K" }],
  },
  "master-bath-renovation": {
    title: "Master Bath Renovation",
    category: "Bathroom",
    location: "Leelanau County, MI",
    description: "Luxury master bathroom with walk-in shower, freestanding tub, and heated tile floors.",
    details: "A full master bathroom renovation featuring a curbless walk-in shower with frameless glass, a freestanding soaking tub, double vanity with undermount sinks, and in-floor radiant heating. Premium porcelain tile throughout with Schluter waterproofing system.",
    stats: [{ label: "Duration", value: "4 weeks" }, { label: "Size", value: "120 sqft" }, { label: "Range", value: "$30K-40K" }],
  },
  "composite-deck-build": {
    title: "Composite Deck Build",
    category: "Outdoor",
    location: "Suttons Bay, MI",
    description: "600 sqft Trex composite deck with built-in seating, pergola, and LED lighting.",
    details: "Custom-designed multi-level Trex Transcend deck with integrated bench seating, a cedar pergola for shade, and low-voltage LED lighting throughout. The deck connects to the home via new patio doors and includes a built-in storage area beneath.",
    stats: [{ label: "Duration", value: "3 weeks" }, { label: "Size", value: "600 sqft" }, { label: "Range", value: "$25K-35K" }],
  },
  "basement-entertainment": {
    title: "Basement Entertainment Space",
    category: "Basement",
    location: "Traverse City, MI",
    description: "Full basement finish with home theater, wet bar, and guest bedroom suite.",
    details: "Complete basement finishing project that transformed an unfinished 1,200 sqft basement into a premium entertainment space. Features include a dedicated home theater room with acoustic treatment, a wet bar with custom cabinetry and quartz counters, a full guest bedroom with egress window, and a three-quarter bathroom.",
    stats: [{ label: "Duration", value: "8 weeks" }, { label: "Size", value: "1,200 sqft" }, { label: "Range", value: "$65K-80K" }],
  },
  "whole-home-remodel": {
    title: "Whole Home Remodel",
    category: "Remodel",
    location: "Elk Rapids, MI",
    description: "Complete interior renovation of a 1970s ranch.",
    details: "A comprehensive interior renovation of a 2,400 sqft ranch home. The project included opening up the main living area, a full kitchen remodel, two bathroom renovations, new flooring throughout, updated electrical and plumbing, and fresh paint and trim in every room.",
    stats: [{ label: "Duration", value: "12 weeks" }, { label: "Size", value: "2,400 sqft" }, { label: "Range", value: "$120K-150K" }],
  },
  "custom-home-build": {
    title: "Custom Lake Home",
    category: "New Build",
    location: "Old Mission Peninsula, MI",
    description: "3,200 sqft custom home with lake views.",
    details: "A ground-up custom home build on Old Mission Peninsula with panoramic lake views. Features include an open concept great room with floor-to-ceiling windows, a gourmet kitchen, four bedrooms, three and a half bathrooms, a finished lower level walkout, and a three-car attached garage.",
    stats: [{ label: "Duration", value: "9 months" }, { label: "Size", value: "3,200 sqft" }, { label: "Range", value: "$450K-550K" }],
  },
};

export function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({ slug }));
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectsData[slug];

  if (!project) {
    return (
      <div className="py-20 text-center">
        <p>Project not found</p>
        <Link href="/portfolio" className="text-black underline">Back to portfolio</Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/portfolio"
            className="mb-6 inline-flex items-center text-xs font-medium text-white/40 hover:text-white/60"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            All Projects
          </Link>
          <Badge className="mb-3 bg-white/10 text-white">
            {project.category}
          </Badge>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-2 text-sm text-white/40">{project.location}</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          {/* Stats */}
          <div className="mb-12 grid grid-cols-3 gap-4">
            {project.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold text-black">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Image placeholder */}
          <div className="mb-12 aspect-video rounded-md bg-[#f0edea]" />

          {/* Description */}
          <p className="text-lg leading-relaxed text-[#555]">
            {project.details}
          </p>

          <div className="mt-12">
            <Link href="/book">
              <Button className="rounded-md bg-black px-8 text-sm font-bold uppercase tracking-wider text-white hover:bg-black/90">
                Start a Similar Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
