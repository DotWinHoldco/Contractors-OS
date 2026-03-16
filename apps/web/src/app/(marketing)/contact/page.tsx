"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "(231) 555-0100", href: "tel:+12315550100" },
  { icon: Mail, label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
  { icon: MapPin, label: "Service Area", value: "Grand Traverse Region, MI", href: null },
  { icon: Clock, label: "Hours", value: "Mon–Fri 7am–5pm", href: null },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      {/* Hero — Dark */}
      <section className="noise relative flex min-h-[50vh] items-center overflow-hidden bg-black pt-[72px]">
        <div className="relative z-10 mx-auto max-w-[900px] px-6 py-20 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
            Contact Us
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(36px,5vw,56px)] leading-[1.1] tracking-[-0.02em] text-white">
            Get In Touch
          </h1>
          <p className="mt-4 text-lg text-white/50">
            Have a question or ready to start your project? We&rsquo;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Form + Info — Light */}
      <section className="bg-white py-[100px]">
        <div className="mx-auto max-w-[1000px] px-6">
          <div className="grid gap-16 md:grid-cols-2">
            {/* Contact Form */}
            <ScrollReveal>
              <div>
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Send Us a Message</h2>
                <p className="mt-2 text-sm text-[#A39E97]">We respond within one business day.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input name="firstName" required placeholder="First name" className="w-full border border-[#E0DBD5] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#A39E97] focus:border-black focus:outline-none" />
                    <input name="lastName" required placeholder="Last name" className="w-full border border-[#E0DBD5] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#A39E97] focus:border-black focus:outline-none" />
                  </div>
                  <input name="email" type="email" required placeholder="Email" className="w-full border border-[#E0DBD5] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#A39E97] focus:border-black focus:outline-none" />
                  <input name="phone" type="tel" placeholder="Phone (optional)" className="w-full border border-[#E0DBD5] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#A39E97] focus:border-black focus:outline-none" />
                  <textarea name="message" rows={5} required placeholder="Tell us about your project..." className="w-full border border-[#E0DBD5] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#A39E97] focus:border-black focus:outline-none resize-none" />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all hover:bg-black/90 disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </ScrollReveal>

            {/* Contact Info */}
            <ScrollReveal delay={0.1}>
              <div>
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Contact Information</h2>
                <p className="mt-2 text-sm text-[#A39E97]">Reach out directly or stop by during business hours.</p>
                <div className="mt-8 space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A84B]" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A39E97]">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-base font-medium text-[#1A1A1A] hover:underline">{item.value}</a>
                        ) : (
                          <p className="text-base font-medium text-[#1A1A1A]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 border border-[#F0EDEA] p-6">
                  <h3 className="text-base font-semibold text-[#1A1A1A]">Prefer to Plan Online?</h3>
                  <p className="mt-1 text-sm text-[#A39E97]">Use our AI Project Advisor to get a detailed plan in minutes.</p>
                  <Link
                    href="/book"
                    className="mt-4 inline-flex items-center bg-[#D4A84B] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F]"
                  >
                    Build Your Free Project Plan
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
