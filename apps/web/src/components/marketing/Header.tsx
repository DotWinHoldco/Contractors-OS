"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "border-b border-white/10 bg-black/95 backdrop-blur-[20px]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="relative z-10">
          <span className="font-[family-name:var(--font-logo)] text-xl text-white">
            .win
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-[0.04em] text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/book"
            className="inline-flex items-center bg-[#D4A84B] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F] hover:-translate-y-px"
          >
            Build Your Free Project Plan
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="relative z-10 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="h-5 w-5 text-white" strokeWidth={1.5} />
          ) : (
            <Menu className="h-5 w-5 text-white" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-[72px] border-t border-white/10 bg-black/95 backdrop-blur-[20px] md:hidden">
          <nav className="flex flex-col px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-white/5 py-4 text-sm font-medium text-white/60 transition-colors hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="mt-6 inline-flex items-center justify-center bg-[#D4A84B] px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F]"
              onClick={() => setMenuOpen(false)}
            >
              Build Your Free Project Plan
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
