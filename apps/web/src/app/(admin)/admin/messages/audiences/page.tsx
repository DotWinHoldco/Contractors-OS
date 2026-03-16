"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Send } from "lucide-react";

interface Audience {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  type: "dynamic" | "static";
  lastComputed: string;
}

const mockAudiences: Audience[] = [
  {
    id: "1",
    name: "All Active Clients",
    description:
      "Clients with at least one project in progress or completed in the last 12 months.",
    memberCount: 312,
    type: "dynamic",
    lastComputed: "Mar 16, 2026",
  },
  {
    id: "2",
    name: "Kitchen Remodel Clients",
    description:
      "Clients who have had a kitchen remodel project, either completed or in progress.",
    memberCount: 87,
    type: "dynamic",
    lastComputed: "Mar 15, 2026",
  },
  {
    id: "3",
    name: "Leads from Website",
    description:
      "All leads captured through the website contact form or chat widget.",
    memberCount: 204,
    type: "static",
    lastComputed: "Mar 10, 2026",
  },
  {
    id: "4",
    name: "Past Clients \u2014 No Activity 6mo+",
    description:
      "Former clients with no projects, messages, or invoices in the past 6 months.",
    memberCount: 128,
    type: "dynamic",
    lastComputed: "Mar 16, 2026",
  },
  {
    id: "5",
    name: "High-Value Projects",
    description:
      "Clients associated with projects valued at $50,000 or more.",
    memberCount: 45,
    type: "dynamic",
    lastComputed: "Mar 14, 2026",
  },
];

const typeStyles: Record<
  Audience["type"],
  { bg: string; text: string; label: string }
> = {
  dynamic: { bg: "#dbeafe", text: "#1e40af", label: "Dynamic" },
  static: { bg: "#f0f0f0", text: "#888", label: "Static" },
};

export default function AudiencesPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Audiences</h1>
          <p className="text-sm text-[#888]">
            {mockAudiences.length} audience segments
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          New Audience
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockAudiences.map((audience) => {
          const style = typeStyles[audience.type];
          return (
            <Card
              key={audience.id}
              className="border border-[#e0dbd5] p-5 shadow-none"
              style={{ borderRadius: 6 }}
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-sm font-semibold text-black leading-tight">
                  {audience.name}
                </h3>
                <Badge
                  variant="outline"
                  className="ml-2 shrink-0 border-0 text-[10px]"
                  style={{
                    backgroundColor: style.bg,
                    color: style.text,
                    borderRadius: 6,
                  }}
                >
                  {style.label}
                </Badge>
              </div>

              <p className="mb-4 text-xs text-[#888] leading-relaxed">
                {audience.description}
              </p>

              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[#888]" />
                  <span className="text-sm font-semibold text-black">
                    {audience.memberCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#888]">members</span>
                </div>
              </div>

              <p className="mb-4 text-[11px] text-[#888]">
                Last computed: {audience.lastComputed}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  style={{ borderColor: "#e0dbd5", borderRadius: 6 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  style={{ borderColor: "#e0dbd5", borderRadius: 6 }}
                >
                  <Send className="mr-1 h-3 w-3" />
                  Use in Campaign
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
