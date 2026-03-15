import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contractors OS — The Operating System for Contractor Businesses",
  description:
    "Client acquisition engine and full business operating system for home services contractors.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="mb-4 text-xs font-black uppercase tracking-[4px] text-white/30">
          Contractors OS
        </p>
        <h1 className="mb-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-6xl">
          Build. Manage. Grow.
        </h1>
        <p className="mb-10 text-lg text-white/60">
          The all-in-one operating system for home services businesses. Client
          acquisition, project management, invoicing, and AI — all in one
          platform.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/book">
            <Button
              size="lg"
              className="rounded-full bg-white px-8 text-sm font-bold uppercase tracking-wider text-black hover:bg-white/90"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/10 bg-white/5 px-8 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
      <p className="mt-20 text-xs text-white/20">
        Powered by{" "}
        <span className="font-[family-name:var(--font-logo)]">.win</span>
      </p>
    </div>
  );
}
