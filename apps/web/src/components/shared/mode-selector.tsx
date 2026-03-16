"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, Briefcase, Shield } from "lucide-react";

export type ViewMode = "client" | "staff" | "admin";

const modes: { value: ViewMode; label: string; icon: typeof User; href: string }[] = [
  { value: "client", label: "Client", icon: User, href: "/portal/dashboard" },
  { value: "staff", label: "Staff", icon: Briefcase, href: "/admin/dashboard" },
  { value: "admin", label: "Admin", icon: Shield, href: "/platform/dashboard" },
];

function getCurrentMode(pathname: string): ViewMode {
  if (pathname.startsWith("/platform")) return "admin";
  if (pathname.startsWith("/admin")) return "staff";
  return "client";
}

export function ModeSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const current = getCurrentMode(pathname);

  return (
    <div className="flex items-center rounded-lg border border-[#e0dbd5] bg-white p-1">
      {modes.map((mode) => {
        const active = mode.value === current;
        return (
          <button
            key={mode.value}
            onClick={() => router.push(mode.href)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              active
                ? "bg-black text-white"
                : "text-[#888] hover:bg-[#f0edea] hover:text-black"
            }`}
          >
            <mode.icon className="h-3.5 w-3.5" />
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
