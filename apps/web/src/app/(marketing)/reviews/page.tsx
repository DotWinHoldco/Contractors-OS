import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

export const metadata = {
  title: "Reviews | Contractors OS",
  description: "Read what our clients say. 5-star rated home services.",
};

const reviews = [
  { name: "Sarah M.", location: "Traverse City, MI", project: "Kitchen Remodel", rating: 5, text: "From the first estimate to the final walkthrough, everything was professional and on schedule. Our kitchen looks incredible. Can't recommend them enough." },
  { name: "David & Lisa K.", location: "Leelanau County, MI", project: "Master Bathroom", rating: 5, text: "They transformed our dated bathroom into a spa-like retreat. The tile work is flawless and the heated floors were the best decision we made." },
  { name: "Mike R.", location: "Suttons Bay, MI", project: "Composite Deck", rating: 5, text: "Built us a beautiful Trex deck with a pergola. The crew was respectful of our property and the workmanship is top notch." },
  { name: "Jennifer T.", location: "Elk Rapids, MI", project: "Whole Home Remodel", rating: 5, text: "We gutted and renovated our entire 1970s ranch. Huge project, but they kept us informed every step of the way. The project manager was outstanding." },
  { name: "Tom & Anne B.", location: "Old Mission, MI", project: "Custom Home Build", rating: 5, text: "Building a custom home is stressful, but they made it as smooth as possible. The attention to detail and quality of materials exceeded our expectations." },
  { name: "Rachel W.", location: "Traverse City, MI", project: "Basement Finishing", rating: 5, text: "They turned our empty basement into an amazing entertainment space. The home theater room is our favorite part of the house now." },
  { name: "Chris & Amanda P.", location: "Interlochen, MI", project: "Roofing", rating: 5, text: "Quick, clean, and professional. They replaced our entire roof in two days and left the property spotless. Fair pricing and great communication." },
  { name: "Greg S.", location: "Kingsley, MI", project: "Siding & Windows", rating: 5, text: "New James Hardie siding and windows throughout. Our energy bills dropped noticeably and the curb appeal is completely transformed." },
];

export default function ReviewsPage() {
  return (
    <>
      {/* Hero — Dark */}
      <section className="noise relative flex min-h-[50vh] items-center overflow-hidden bg-black pt-[72px]">
        <div className="relative z-10 mx-auto max-w-[900px] px-6 py-20 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
            Client Reviews
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(36px,5vw,56px)] leading-[1.1] tracking-[-0.02em] text-white">
            What Our Clients Say
          </h1>
          <div className="mt-6 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[#D4A84B] text-[#D4A84B]" />
            ))}
          </div>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white">
            5.0 Average Rating
          </p>
          <p className="text-sm text-white/30">Based on 50+ reviews</p>
        </div>
      </section>

      {/* Reviews Grid — Warm */}
      <section className="bg-[#F9F7F5] py-[100px]">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review, i) => (
              <ScrollReveal key={review.name} delay={0.05 * (i + 1)}>
                <div className="border border-[#F0EDEA] bg-white p-8 transition-all duration-300 hover:border-[#D4A84B] hover:-translate-y-1">
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[#D4A84B] text-[#D4A84B]" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#3D3834]">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="mt-6 border-t border-[#F0EDEA] pt-4">
                    <p className="text-sm font-semibold text-[#1A1A1A]">{review.name}</p>
                    <p className="text-xs text-[#A39E97]">
                      {review.project} &middot; {review.location}
                    </p>
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
              Ready to Be Our Next Success Story?
            </h2>
            <p className="mt-4 text-base text-white/50">
              Join hundreds of happy homeowners. Get your free project plan today.
            </p>
            <Link
              href="/book"
              className="btn-gold-pulse mt-8 inline-flex items-center bg-[#D4A84B] px-10 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F]"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
