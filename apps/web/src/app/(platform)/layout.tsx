"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Brain,
  Flag,
  Activity,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAppUser } from "@/lib/hooks/use-app-user";
import { ModeSelector } from "@/components/shared/mode-selector";

const navItems = [
  { href: "/platform/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/platform/tenants", label: "Tenants", icon: Building2 },
  { href: "/platform/ai-config", label: "AI Config", icon: Brain },
  { href: "/platform/feature-flags", label: "Feature Flags", icon: Flag },
  { href: "/platform/monitoring", label: "Monitoring", icon: Activity },
];

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { appUser } = useAppUser();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-white/10 bg-black text-white">
        <div className="flex h-14 items-center border-b border-white/10 px-6">
          <span className="font-[family-name:var(--font-logo)] text-lg">
            .win
          </span>
          <span className="ml-2 text-xs font-medium uppercase tracking-wider text-white/40">
            Platform
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-white/60 hover:bg-white/5 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#fafafa]">
        {appUser?.isSuperAdmin && (
          <div className="border-b border-[#e0dbd5] bg-white px-6 py-2">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A39E97]">
                Viewing as
              </span>
              <ModeSelector />
            </div>
          </div>
        )}
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
