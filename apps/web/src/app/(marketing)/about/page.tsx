import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Star, Clock, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us | Contractors OS",
  description:
    "Learn about our team, our mission, and why homeowners trust us with their most important projects.",
};

const values = [
  {
    icon: Shield,
    title: "Quality First",
    description:
      "We never cut corners. Every project gets the same attention to detail, whether it's a small repair or a full home build.",
  },
  {
    icon: Clock,
    title: "On Time, On Budget",
    description:
      "We set realistic timelines and stick to them. No surprise charges. No drawn-out projects.",
  },
  {
    icon: Users,
    title: "Clear Communication",
    description:
      "You'll always know what's happening with your project. Real-time updates, direct access to your project manager.",
  },
  {
    icon: Star,
    title: "Stand Behind Our Work",
    description:
      "Every project comes with our workmanship warranty. If something isn't right, we make it right.",
  },
];

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "15+", label: "Years Experience" },
  { value: "5.0", label: "Average Rating" },
  { value: "98%", label: "On-Time Delivery" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[4px] text-white/30">
            About Us
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold md:text-5xl">
            Built on Trust,<br />Delivered with Pride
          </h1>
          <p className="mt-4 text-lg text-white/60">
            We&apos;re a team of experienced builders, craftsmen, and project
            managers who believe every homeowner deserves a contractor they can
            trust.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[#e0dbd5] bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-black">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#888]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[4px] text-[#888]">
            Our Story
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-black md:text-4xl">
            From Local Roots to Trusted Name
          </h2>
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-[#555]">
            <p>
              What started as a small crew doing kitchen remodels has grown into
              a full-service construction company. But the core hasn&apos;t changed:
              show up on time, do the work right, and treat every home like it&apos;s
              our own.
            </p>
            <p>
              We&apos;ve built our reputation one project at a time — through honest
              estimates, clean job sites, and work that speaks for itself. Our
              clients don&apos;t just hire us once. They call us back for their next
              project, and they recommend us to their neighbors.
            </p>
            <p>
              Today we handle everything from bathroom renovations to custom home
              builds. Our team includes licensed carpenters, electricians,
              plumbers, and project managers — all working together under one
              roof to deliver a seamless experience.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f8f8f8] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[4px] text-[#888]">
            Our Values
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-black md:text-4xl">
            What We Stand For
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="flex gap-4">
                <value.icon
                  className="mt-1 h-6 w-6 flex-shrink-0 text-[#888]"
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="text-base font-semibold text-black">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#888]">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Ready to Work Together?
          </h2>
          <p className="mt-4 text-white/60">
            Tell us about your project and get a free estimate.
          </p>
          <Link href="/book" className="mt-8 inline-block">
            <Button
              size="lg"
              className="rounded-md bg-white px-8 text-sm font-bold uppercase tracking-wider text-black hover:bg-white/90"
            >
              Get a Free Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
