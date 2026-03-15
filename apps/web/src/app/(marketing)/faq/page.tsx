import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "FAQ | Contractors OS",
  description:
    "Frequently asked questions about our services, process, pricing, and more.",
};

const faqs = [
  {
    question: "How do I get a quote?",
    answer:
      "Use our online booking tool to describe your project and get an instant range estimate. From there, we'll schedule a free in-home consultation to provide a detailed, written quote.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "It depends on scope. A bathroom remodel typically takes 3-4 weeks. A kitchen remodel runs 5-7 weeks. Basement finishing is 6-10 weeks. Custom homes can be 6-12 months. We'll give you a detailed timeline before any work begins.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. We carry full general liability insurance, workers' compensation, and hold all required state and local contractor licenses. We're happy to provide proof of insurance upon request.",
  },
  {
    question: "Do you offer financing?",
    answer:
      "Yes, we partner with several lending institutions to offer competitive financing options. Ask us during your consultation and we'll walk you through the available plans.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We primarily serve the Grand Traverse region including Traverse City, Leelanau County, Suttons Bay, Elk Rapids, Old Mission Peninsula, Interlochen, and surrounding areas.",
  },
  {
    question: "Do you handle permits?",
    answer:
      "Absolutely. We handle all permit applications and inspections as part of our project management. Permit costs are included in your quote so there are no surprises.",
  },
  {
    question: "What is your payment schedule?",
    answer:
      "Typical payment is structured in phases: a deposit to secure your spot on the schedule, progress payments at key milestones, and a final payment upon completion and your sign-off. Exact terms are outlined in your contract.",
  },
  {
    question: "Do you provide a warranty?",
    answer:
      "Yes. All our work comes with a workmanship warranty. The length varies by project type — typically 1-2 years on finish work and longer on structural work. Manufacturer warranties on materials are passed through to you.",
  },
  {
    question: "Can I stay in my home during a remodel?",
    answer:
      "In most cases, yes. We work to minimize disruption and keep living areas clean and accessible. For large-scale projects like whole-home remodels, we'll discuss the best approach during planning.",
  },
  {
    question: "How do I track my project's progress?",
    answer:
      "Every client gets access to our online portal where you can view real-time project updates, photos, schedules, documents, and communicate directly with your project manager.",
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[4px] text-white/30">
            FAQ
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Everything you need to know before starting your project
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <Accordion className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-black">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-[#555]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-[#f8f8f8] py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-black md:text-4xl">
            Still Have Questions?
          </h2>
          <p className="mt-4 text-[#888]">
            We&apos;re happy to help. Reach out and we&apos;ll get back to you
            within one business day.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact">
              <Button
                variant="outline"
                className="rounded-md text-sm font-bold uppercase tracking-wider"
              >
                Contact Us
              </Button>
            </Link>
            <Link href="/book">
              <Button className="rounded-md bg-black px-8 text-sm font-bold uppercase tracking-wider text-white hover:bg-black/90">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
