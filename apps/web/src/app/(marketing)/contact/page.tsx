"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "(231) 555-0100",
    href: "tel:+12315550100",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    icon: MapPin,
    label: "Service Area",
    value: "Grand Traverse Region, MI",
    href: null,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Fri 7am–5pm",
    href: null,
  },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission — replace with edge function call
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[4px] text-white/30">
            Contact Us
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold md:text-5xl">
            Get In Touch
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Have a question or ready to start your project? We&apos;d love to
            hear from you.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-semibold text-black">
                Send Us a Message
              </h2>
              <p className="mt-2 text-sm text-[#888]">
                We respond to all inquiries within one business day.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="mt-1"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-md bg-black text-sm font-bold uppercase tracking-wider text-white hover:bg-black/90"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-semibold text-black">
                Contact Information
              </h2>
              <p className="mt-2 text-sm text-[#888]">
                Reach out directly or stop by during business hours.
              </p>
              <div className="mt-6 space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <item.icon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#888]"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-base font-medium text-black hover:underline"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-base font-medium text-black">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-md border border-[#e0dbd5] p-6">
                <h3 className="text-base font-semibold text-black">
                  Prefer to Book Online?
                </h3>
                <p className="mt-1 text-sm text-[#888]">
                  Use our booking tool to describe your project and get an
                  instant estimate.
                </p>
                <Link href="/book" className="mt-4 inline-block">
                  <Button
                    variant="outline"
                    className="rounded-md text-sm font-bold uppercase tracking-wider"
                  >
                    Book Online
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
