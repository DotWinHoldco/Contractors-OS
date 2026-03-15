import Link from "next/link";

const serviceLinks = [
  { href: "/services", label: "All Services" },
  { href: "/portfolio", label: "Our Work" },
  { href: "/book", label: "Get a Quote" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#e0dbd5] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="font-[family-name:var(--font-logo)] text-xl text-black">
              .win
            </span>
            <p className="mt-3 text-sm leading-relaxed text-[#888]">
              The operating system for contractor businesses. Client acquisition,
              project management, and AI — all in one platform.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#888]">
              Services
            </h4>
            <nav className="flex flex-col gap-2">
              {serviceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#555] transition-colors hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#888]">
              Company
            </h4>
            <nav className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#555] transition-colors hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#888]">
              Legal
            </h4>
            <nav className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#555] transition-colors hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#e0dbd5] pt-8 md:flex-row">
          <p className="text-xs text-[#888]">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[#bbb]">
            Powered by{" "}
            <span className="font-[family-name:var(--font-logo)] text-[#888]">
              .win
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
