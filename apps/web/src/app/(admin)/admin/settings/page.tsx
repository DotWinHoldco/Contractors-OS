"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wrench,
  Package,
  Building2,
  Users,
  Plug,
} from "lucide-react";

const settingsLinks = [
  {
    title: "Services",
    description: "Manage your service catalog, pricing, and featured services.",
    href: "/admin/settings/services",
    icon: Wrench,
  },
  {
    title: "Materials",
    description: "Configure your material library with costs and suppliers.",
    href: "/admin/settings/materials",
    icon: Package,
  },
  {
    title: "Business Info",
    description: "Update your company name, address, license, and branding.",
    href: "/admin/settings/business",
    icon: Building2,
  },
  {
    title: "Team",
    description: "Manage team members, roles, and permissions.",
    href: "/admin/settings/team",
    icon: Users,
  },
  {
    title: "Integrations",
    description: "Connect third-party tools like QuickBooks, Google, and Stripe.",
    href: "/admin/settings/integrations",
    icon: Plug,
  },
];

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Settings</h1>
        <p className="text-sm text-[#888]">
          Configure your business settings and preferences.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settingsLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="border border-[#e0dbd5] shadow-none transition-all hover:border-black hover:shadow-sm h-full">
                <CardContent className="p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f8f8f8]">
                    <Icon className="h-5 w-5 text-black" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-semibold text-black">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#888] leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
