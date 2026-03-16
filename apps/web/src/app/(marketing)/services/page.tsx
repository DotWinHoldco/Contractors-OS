import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

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
      {/* Hero — Dark */}
      <section className="noise relative flex min-h-[50vh] items-center overflow-hidden bg-black pt-[72px]">
        <div className="relative z-10 mx-auto max-w-[900px] px-6 py-20 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
            Our Services
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(36px,5vw,56px)] leading-[1.1] tracking-[-0.02em] text-white">
            What We Build
          </h1>
          <p className="mt-4 text-lg text-white/50">
            Professional home services for every project size.
          </p>
        </div>
      </section>

      {/* Services Grid — Light */}
      <section className="bg-white py-[100px]">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ScrollReveal key={service.slug} delay={0.05 * (i + 1)}>
                <Link href={`/services/${service.slug}`}>
                  <div className="group h-full border border-[#F0EDEA] p-10 transition-all duration-300 hover:border-[#D4A84B] hover:-translate-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A39E97]">
                      {service.category}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-[#1A1A1A]">
                      {service.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#A39E97]">
                      {service.desc}
                    </p>
                    <span className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-[0.08em] text-[#D4A84B] opacity-0 transition-opacity group-hover:opacity-100">
                      Learn More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Dark */}
      <section className="noise relative overflow-hidden bg-black py-[100px]">
        <div className="relative z-10 mx-auto max-w-[600px] px-6 text-center">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,40px)] leading-[1.1] tracking-[-0.02em] text-white">
              Don&rsquo;t See Your Project?
            </h2>
            <p className="mt-4 text-base text-white/50">
              We handle a wide range of projects. Tell us what you need and we&rsquo;ll build your custom plan.
            </p>
            <Link
              href="/book"
              className="btn-gold-pulse mt-8 inline-flex items-center bg-[#D4A84B] px-10 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F]"
            >
              Build Your Free Project Plan
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
