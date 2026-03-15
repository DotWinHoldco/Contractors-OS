import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Hammer,
  Paintbrush,
  Home,
  Wrench,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export const metadata = {
  title: "Home | Contractors OS",
  description:
    "Professional home services for your next project. Get a free quote today.",
};

const services = [
  { icon: Hammer, name: "Remodeling", desc: "Kitchen, bath, and whole-home renovations" },
  { icon: Home, name: "New Construction", desc: "Custom homes built to your vision" },
  { icon: Paintbrush, name: "Interior Finishing", desc: "Trim, paint, flooring, and details" },
  { icon: Wrench, name: "Handyman", desc: "Repairs, maintenance, and small projects" },
  { icon: Shield, name: "Roofing", desc: "Repair, replacement, and new installations" },
  { icon: Star, name: "Decks & Outdoor", desc: "Decks, patios, and outdoor living spaces" },
];

const steps = [
  { num: "01", title: "Tell Us About Your Project", desc: "Answer a few questions about what you need." },
  { num: "02", title: "Get Your Estimate", desc: "AI-powered range estimate in seconds." },
  { num: "03", title: "We Build It", desc: "Professional execution, on time and on budget." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black py-24 text-white md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-6 text-xs font-bold uppercase tracking-[4px] text-white/30">
            Home Services Done Right
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-6xl">
            Building Homes,<br />Building Trust
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            From kitchen remodels to custom builds, we deliver quality
            craftsmanship with transparent pricing and modern project management.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/book">
              <Button
                size="lg"
                className="rounded-md bg-white px-8 text-sm font-bold uppercase tracking-wider text-black hover:bg-white/90"
              >
                Get a Free Quote
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button
                size="lg"
                variant="ghost"
                className="text-sm font-bold uppercase tracking-wider text-white/60 hover:text-white"
              >
                View Our Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium uppercase tracking-wider text-white/30">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" strokeWidth={1.5} />
              Licensed & Insured
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
              5-Star Rated
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
              Free Estimates
            </span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[4px] text-[#888]">
            What We Do
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-black md:text-4xl">
            Our Services
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.name}
                className="border border-[#e0dbd5] bg-white shadow-none transition-colors hover:border-black"
              >
                <CardContent className="p-6">
                  <service.icon
                    className="mb-4 h-6 w-6 text-[#888]"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-base font-semibold text-black">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#888]">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/services">
              <Button variant="outline" className="rounded-md">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[4px] text-[#888]">
            How It Works
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-black md:text-4xl">
            Simple Process, Serious Results
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num}>
                <span className="text-3xl font-bold text-[#ddd]">
                  {step.num}
                </span>
                <h3 className="mt-2 text-base font-semibold text-black">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-[#888]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[4px] text-[#888]">
            Trusted by Homeowners
          </p>
          <div className="mt-6 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-[#d4a84b] text-[#d4a84b]"
              />
            ))}
          </div>
          <p className="mt-2 text-lg font-semibold text-black">
            5.0 Average Rating
          </p>
          <p className="text-sm text-[#888]">Based on 50+ reviews</p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Ready to Start Your Project?
          </h2>
          <p className="mt-4 text-white/60">
            Get a free consultation and detailed estimate. No obligation, no pressure.
          </p>
          <Link href="/book" className="mt-8 inline-block">
            <Button
              size="lg"
              className="rounded-md bg-white px-8 text-sm font-bold uppercase tracking-wider text-black hover:bg-white/90"
            >
              Book a Free Consultation
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
