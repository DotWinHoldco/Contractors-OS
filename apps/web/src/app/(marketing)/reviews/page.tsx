import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Reviews | Contractors OS",
  description:
    "Read what our clients say about working with us. 5-star rated home services.",
};

const reviews = [
  {
    name: "Sarah M.",
    location: "Traverse City, MI",
    project: "Kitchen Remodel",
    rating: 5,
    text: "From the first estimate to the final walkthrough, everything was professional and on schedule. Our kitchen looks incredible. Can't recommend them enough.",
  },
  {
    name: "David & Lisa K.",
    location: "Leelanau County, MI",
    project: "Master Bathroom",
    rating: 5,
    text: "They transformed our dated bathroom into a spa-like retreat. The tile work is flawless and the heated floors were the best decision we made.",
  },
  {
    name: "Mike R.",
    location: "Suttons Bay, MI",
    project: "Composite Deck",
    rating: 5,
    text: "Built us a beautiful Trex deck with a pergola. The crew was respectful of our property and the workmanship is top notch. Already planning our next project with them.",
  },
  {
    name: "Jennifer T.",
    location: "Elk Rapids, MI",
    project: "Whole Home Remodel",
    rating: 5,
    text: "We gutted and renovated our entire 1970s ranch. Huge project, but they kept us informed every step of the way. The project manager was outstanding.",
  },
  {
    name: "Tom & Anne B.",
    location: "Old Mission, MI",
    project: "Custom Home Build",
    rating: 5,
    text: "Building a custom home is stressful, but they made it as smooth as possible. The attention to detail and quality of materials exceeded our expectations.",
  },
  {
    name: "Rachel W.",
    location: "Traverse City, MI",
    project: "Basement Finishing",
    rating: 5,
    text: "They turned our empty basement into an amazing entertainment space. The home theater room is our favorite part of the house now. Worth every penny.",
  },
  {
    name: "Chris & Amanda P.",
    location: "Interlochen, MI",
    project: "Roofing",
    rating: 5,
    text: "Quick, clean, and professional. They replaced our entire roof in two days and left the property spotless. Fair pricing and great communication throughout.",
  },
  {
    name: "Greg S.",
    location: "Kingsley, MI",
    project: "Siding & Windows",
    rating: 5,
    text: "New James Hardie siding and windows throughout. Our energy bills dropped noticeably and the curb appeal is completely transformed. Neighbors keep asking who did the work.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-[#d4a84b] text-[#d4a84b]" />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[4px] text-white/30">
            Client Reviews
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold md:text-5xl">
            What Our Clients Say
          </h1>
          <div className="mt-6 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-[#d4a84b] text-[#d4a84b]"
              />
            ))}
          </div>
          <p className="mt-2 text-lg font-semibold">5.0 Average Rating</p>
          <p className="text-sm text-white/40">Based on 50+ reviews</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <Card
                key={review.name}
                className="border border-[#e0dbd5] bg-white shadow-none"
              >
                <CardContent className="p-6">
                  <StarRating rating={review.rating} />
                  <p className="mt-3 text-sm leading-relaxed text-[#555]">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="mt-4 border-t border-[#e0dbd5] pt-4">
                    <p className="text-sm font-semibold text-black">
                      {review.name}
                    </p>
                    <p className="text-xs text-[#888]">
                      {review.project} &middot; {review.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Ready to Be Our Next Success Story?
          </h2>
          <p className="mt-4 text-white/60">
            Join hundreds of happy homeowners. Get your free estimate today.
          </p>
          <Link href="/book" className="mt-8 inline-block">
            <Button
              size="lg"
              className="rounded-md bg-white px-8 text-sm font-bold uppercase tracking-wider text-black hover:bg-white/90"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
