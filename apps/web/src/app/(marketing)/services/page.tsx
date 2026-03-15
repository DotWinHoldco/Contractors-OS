import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Services | Contractors OS",
  description: "Browse our full range of home services and construction offerings.",
};

const services = [
  { slug: "kitchen-remodeling", name: "Kitchen Remodeling", desc: "Complete kitchen renovations from design to finish. Custom cabinetry, countertops, flooring, and appliance installation.", category: "Remodeling" },
  { slug: "bathroom-remodeling", name: "Bathroom Remodeling", desc: "Transform your bathroom with modern fixtures, tile work, vanities, and walk-in showers.", category: "Remodeling" },
  { slug: "basement-finishing", name: "Basement Finishing", desc: "Turn unused space into living area. Framing, drywall, flooring, electrical, and plumbing.", category: "Remodeling" },
  { slug: "deck-construction", name: "Deck & Patio", desc: "Custom decks, patios, and outdoor living spaces. Composite, cedar, and hardwood options.", category: "Outdoor" },
  { slug: "roofing", name: "Roofing", desc: "Full roof replacement, repairs, and inspections. Asphalt shingles, metal, and flat roofing.", category: "Exterior" },
  { slug: "siding", name: "Siding & Exterior", desc: "Vinyl, fiber cement, and wood siding installation. Windows and exterior trim.", category: "Exterior" },
  { slug: "new-construction", name: "New Construction", desc: "Custom home building from foundation to finish. Full project management included.", category: "Construction" },
  { slug: "additions", name: "Additions", desc: "Home additions and expansions. Second stories, bump-outs, and attached garages.", category: "Construction" },
  { slug: "handyman", name: "Handyman Services", desc: "Small repairs, maintenance, and odd jobs. Drywall, painting, fixtures, and more.", category: "General" },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[4px] text-white/30">
            Our Services
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold md:text-5xl">
            What We Build
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Professional home services for every project size
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                <Card className="h-full border border-[#e0dbd5] bg-white shadow-none transition-colors hover:border-black">
                  <CardContent className="p-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#bbb]">
                      {service.category}
                    </span>
                    <h3 className="mt-2 text-base font-semibold text-black">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#888]">
                      {service.desc}
                    </p>
                    <span className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-wider text-black">
                      Learn More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold">
            Don&apos;t See Your Project?
          </h2>
          <p className="mt-3 text-white/60">
            We handle a wide range of projects. Tell us what you need and we&apos;ll
            provide a custom quote.
          </p>
          <Link href="/book" className="mt-6 inline-block">
            <Button className="rounded-md bg-white px-8 text-sm font-bold uppercase tracking-wider text-black hover:bg-white/90">
              Get a Custom Quote
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
