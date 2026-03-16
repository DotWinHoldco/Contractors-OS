import Link from "next/link";
import { Shield, Star, Clock, Users, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

export const metadata = {
  title: "About Us | Contractors OS",
  description: "Learn about our team, our mission, and why homeowners trust us.",
};

const values = [
  { icon: Shield, title: "Quality First", description: "We never cut corners. Every project gets the same attention to detail, whether it's a small repair or a full home build." },
  { icon: Clock, title: "On Time, On Budget", description: "We set realistic timelines and stick to them. No surprise charges. No drawn-out projects." },
  { icon: Users, title: "Clear Communication", description: "You'll always know what's happening with your project. Real-time updates, direct access to your project manager." },
  { icon: Star, title: "Stand Behind Our Work", description: "Every project comes with our workmanship warranty. If something isn't right, we make it right." },
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
      {/* Hero — Dark */}
      <section className="noise relative flex min-h-[50vh] items-center overflow-hidden bg-black pt-[72px]">
        <div className="relative z-10 mx-auto max-w-[900px] px-6 py-20 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
            About Us
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(36px,5vw,56px)] leading-[1.1] tracking-[-0.02em] text-white">
            Built Different.
          </h1>
          <p className="mt-4 text-lg text-white/50">
            We&rsquo;re a team of experienced builders who believe every homeowner
            deserves a contractor they can trust.
          </p>
        </div>
      </section>

      {/* Stats — Light */}
      <section className="border-b border-[#F0EDEA] bg-white py-16">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={0.1 * (i + 1)}>
                <div className="text-center">
                  <p className="font-[family-name:var(--font-display)] text-4xl text-[#D4A84B]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#A39E97]">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story — Light, two-column editorial */}
      <section className="bg-white py-[100px]">
        <div className="mx-auto max-w-[900px] px-6">
          <ScrollReveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
              Our Story
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,40px)] leading-[1.1] tracking-[-0.02em] text-[#1A1A1A]">
              From Local Roots to Trusted Name
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="space-y-4 text-base leading-relaxed text-[#6B6560]">
                <p>
                  What started as a small crew doing kitchen remodels has grown into
                  a full-service construction company. But the core hasn&rsquo;t changed:
                  show up on time, do the work right, and treat every home like
                  it&rsquo;s our own.
                </p>
                <p>
                  We&rsquo;ve built our reputation one project at a time — through
                  honest estimates, clean job sites, and work that speaks for itself.
                </p>
              </div>
              <div className="space-y-4 text-base leading-relaxed text-[#6B6560]">
                <p>
                  Our clients don&rsquo;t just hire us once. They call us back for
                  their next project, and they recommend us to their neighbors.
                </p>
                <p>
                  Today we handle everything from bathroom renovations to custom home
                  builds. Our team includes licensed carpenters, electricians,
                  plumbers, and project managers — all working together to deliver
                  a seamless experience.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values — Warm */}
      <section className="bg-[#F9F7F5] py-[100px]">
        <div className="mx-auto max-w-[900px] px-6">
          <ScrollReveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
              Our Values
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,40px)] leading-[1.1] tracking-[-0.02em] text-[#1A1A1A]">
              What We Stand For
            </h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={0.1 * (i + 1)}>
                <div className="flex gap-4">
                  <value.icon className="mt-1 h-5 w-5 shrink-0 text-[#D4A84B]" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-base font-semibold text-[#1A1A1A]">{value.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#A39E97]">{value.description}</p>
                  </div>
                </div>
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
              Ready to Work Together?
            </h2>
            <p className="mt-4 text-base text-white/50">
              Tell us about your project and get a detailed plan — for free.
            </p>
            <Link
              href="/book"
              className="btn-gold-pulse mt-8 inline-flex items-center bg-[#D4A84B] px-10 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F]"
            >
              Build Your Free Project Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
