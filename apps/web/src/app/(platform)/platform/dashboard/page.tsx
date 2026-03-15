"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, FolderOpen, DollarSign, Users, Plus } from "lucide-react";

interface DashboardStats {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  pausedTenants: number;
  totalProjects: number;
  recentTenants: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
  }>;
}

export default function PlatformDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTenants: 0,
    activeTenants: 0,
    trialTenants: 0,
    pausedTenants: 0,
    totalProjects: 0,
    recentTenants: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const { data: tenants } = await supabase
        .from("tenants")
        .select("id, name, status, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      const allTenants = tenants || [];
      setStats({
        totalTenants: allTenants.length,
        activeTenants: allTenants.filter((t) => t.status === "active").length,
        trialTenants: allTenants.filter((t) => t.status === "trial").length,
        pausedTenants: allTenants.filter((t) => t.status === "paused").length,
        totalProjects: 0,
        recentTenants: allTenants.slice(0, 5),
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Tenants",
      value: stats.totalTenants,
      icon: Building2,
    },
    {
      label: "Active",
      value: stats.activeTenants,
      icon: Users,
    },
    {
      label: "Trial",
      value: stats.trialTenants,
      icon: FolderOpen,
    },
    {
      label: "Revenue",
      value: "$0",
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">
            Platform Dashboard
          </h1>
          <p className="text-sm text-[#888]">
            Overview of all tenants and platform metrics
          </p>
        </div>
        <Link href="/platform/tenants/new">
          <Button className="gap-2 rounded-md bg-black text-white hover:bg-black/90">
            <Plus className="h-4 w-4" />
            New Tenant
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="border border-[#e0dbd5] bg-white shadow-none"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-[#bbb]" strokeWidth={1.5} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#1a1a1a]">
                {loading ? "—" : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Tenants */}
      <Card className="border border-[#e0dbd5] bg-white shadow-none">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#888]">
            Recent Tenants
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-[#888]">Loading...</p>
          ) : stats.recentTenants.length === 0 ? (
            <p className="text-sm text-[#888]">
              No tenants yet.{" "}
              <Link
                href="/platform/tenants/new"
                className="text-black underline"
              >
                Create the first one.
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentTenants.map((tenant) => (
                <Link
                  key={tenant.id}
                  href={`/platform/tenants/${tenant.id}`}
                  className="flex items-center justify-between rounded-md border border-[#e0dbd5] px-4 py-3 transition-colors hover:bg-[#f8f8f8]"
                >
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    {tenant.name}
                  </span>
                  <Badge
                    variant={
                      tenant.status === "active" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {tenant.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
