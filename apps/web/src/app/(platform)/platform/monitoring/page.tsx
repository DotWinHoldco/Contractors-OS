"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Server, Database, Zap } from "lucide-react";

export default function MonitoringPage() {
  const healthChecks = [
    { label: "Next.js App", status: "healthy", icon: Server },
    { label: "Supabase DB", status: "healthy", icon: Database },
    { label: "Edge Functions", status: "healthy", icon: Zap },
    { label: "Stripe", status: "healthy", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Monitoring</h1>
        <p className="text-sm text-[#888]">System health and performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {healthChecks.map((check) => (
          <Card
            key={check.label}
            className="border border-[#e0dbd5] bg-white shadow-none"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                {check.label}
              </CardTitle>
              <check.icon className="h-4 w-4 text-[#bbb]" strokeWidth={1.5} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#2d6a4f]" />
                <span className="text-sm font-medium capitalize text-[#2d6a4f]">
                  {check.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-[#e0dbd5] bg-white shadow-none">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#888]">
            System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#888]">
            Real-time system logs and error tracking will appear here once
            connected to logging infrastructure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
