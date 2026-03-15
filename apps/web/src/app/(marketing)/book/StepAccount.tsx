"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useBookingStore } from "@/lib/stores/booking-store";
import { toast } from "sonner";

export function StepAccount() {
  const { contact, setContact, estimate, projectTypeLabel, prevStep, reset } =
    useBookingStore();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.firstName || !contact.lastName || !contact.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    // TODO: Call leads/capture edge function, create auth user, create client record
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <CheckCircle className="h-12 w-12 text-[#2D6A4F]" strokeWidth={1.5} />
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-black md:text-3xl">
          You&apos;re All Set!
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#888]">
          We&apos;ve received your {projectTypeLabel.toLowerCase()} project
          request. Check your email for confirmation details and next steps.
        </p>

        {estimate && (
          <div className="mt-6 rounded-md border border-[#e0dbd5] bg-[#f8f8f8] p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
              Your Estimate
            </p>
            <p className="mt-1 text-2xl font-bold text-black">
              ${estimate.low.toLocaleString()} &mdash; $
              {estimate.high.toLocaleString()}
            </p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
            What Happens Next
          </p>
          <ul className="space-y-2 text-sm text-[#555]">
            <li>1. You&apos;ll receive a confirmation email shortly</li>
            <li>
              2. Our team will review your project details before your
              consultation
            </li>
            <li>
              3. At your consultation, we&apos;ll provide a detailed written
              quote
            </li>
          </ul>
        </div>

        <Link href="/" className="mt-8">
          <Button
            variant="outline"
            className="rounded-md"
            onClick={() => reset()}
          >
            Return to Homepage
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-black md:text-3xl">
        Create Your Account
      </h2>
      <p className="mt-2 text-sm text-[#888]">
        We&apos;ll use this to set up your project portal where you can track
        everything.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">
              First Name <span className="text-[#C1292E]">*</span>
            </Label>
            <Input
              id="firstName"
              value={contact.firstName}
              onChange={(e) => setContact({ firstName: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">
              Last Name <span className="text-[#C1292E]">*</span>
            </Label>
            <Input
              id="lastName"
              value={contact.lastName}
              onChange={(e) => setContact({ lastName: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">
            Email <span className="text-[#C1292E]">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={contact.email}
            onChange={(e) => setContact({ email: e.target.value })}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            value={contact.phone}
            onChange={(e) => setContact({ phone: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="address">Street Address (optional)</Label>
          <Input
            id="address"
            value={contact.address}
            onChange={(e) => setContact({ address: e.target.value })}
            className="mt-1"
            placeholder="123 Main St"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={contact.city}
              onChange={(e) => setContact({ city: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={contact.state}
              onChange={(e) => setContact({ state: e.target.value })}
              className="mt-1"
              defaultValue="MI"
            />
          </div>
          <div>
            <Label htmlFor="zip">ZIP</Label>
            <Input
              id="zip"
              value={contact.zip}
              onChange={(e) => setContact({ zip: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        <p className="text-xs text-[#888]">
          By submitting, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            className="text-sm"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-black px-8 text-sm font-bold uppercase tracking-wider text-white hover:bg-black/90"
          >
            {submitting ? "Submitting..." : "Submit & Book"}
          </Button>
        </div>
      </form>
    </div>
  );
}
