"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronDown, ChevronUp, Mail } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  preview: string;
  status: "draft" | "scheduled" | "sent" | "sending";
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  date: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Spring Kitchen Remodel Promo",
    subject: "Transform Your Kitchen This Spring — 15% Off All Cabinetry",
    preview:
      "Spring is the perfect time for a kitchen upgrade. Book a free consultation this month and save 15% on custom cabinetry...",
    status: "sent",
    recipients: 312,
    sent: 308,
    opened: 187,
    clicked: 42,
    date: "Mar 1, 2026",
  },
  {
    id: "2",
    name: "Q2 Newsletter",
    subject: "What's New at Northwood Builders — April Update",
    preview:
      "Here's a look at our latest completed projects, upcoming availability, and a few tips for planning your next renovation...",
    status: "scheduled",
    recipients: 485,
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "Apr 1, 2026",
  },
  {
    id: "3",
    name: "Past Client Re-engagement",
    subject: "It's Been a While — Let's Talk About Your Next Project",
    preview:
      "We loved working with you and would love to help again. Whether it's a refresh or a full renovation, we're here when you're ready...",
    status: "draft",
    recipients: 128,
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "",
  },
  {
    id: "4",
    name: "Holiday Maintenance Reminder",
    subject: "Winter Is Coming — Schedule Your Home Maintenance Checkup",
    preview:
      "Don't wait for the first freeze. Book a pre-winter inspection to make sure your home is ready for the cold months ahead...",
    status: "sent",
    recipients: 410,
    sent: 405,
    opened: 234,
    clicked: 67,
    date: "Nov 15, 2025",
  },
];

const statusStyles: Record<
  Campaign["status"],
  { bg: string; text: string; label: string }
> = {
  draft: { bg: "#f0f0f0", text: "#888", label: "Draft" },
  scheduled: { bg: "#fef9c3", text: "#92400e", label: "Scheduled" },
  sent: { bg: "#dcfce7", text: "#166534", label: "Sent" },
  sending: { bg: "#dbeafe", text: "#1e40af", label: "Sending" },
};

export default function CampaignsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Email Campaigns</h1>
          <p className="text-sm text-[#888]">
            {mockCampaigns.length} campaigns
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          New Campaign
        </Button>
      </div>

      <Card className="border border-[#e0dbd5] shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0dbd5] text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Recipients
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Sent
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Opened
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Clicked
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {mockCampaigns.map((campaign) => {
                const style = statusStyles[campaign.status];
                const isExpanded = expandedId === campaign.id;
                return (
                  <>
                    <tr
                      key={campaign.id}
                      className="hover:bg-[#f8f8f8] cursor-pointer"
                      onClick={() => toggleExpand(campaign.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5 shrink-0 text-[#888]" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#888]" />
                          )}
                          <span className="text-sm font-medium text-black">
                            {campaign.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="text-[10px] border-0"
                          style={{
                            backgroundColor: style.bg,
                            color: style.text,
                            borderRadius: 6,
                          }}
                        >
                          {style.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#555]">
                        {campaign.recipients.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#555]">
                        {campaign.sent.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#555]">
                        {campaign.opened.toLocaleString()}
                        {campaign.sent > 0 && (
                          <span className="ml-1 text-xs text-[#888]">
                            ({Math.round((campaign.opened / campaign.sent) * 100)}%)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#555]">
                        {campaign.clicked.toLocaleString()}
                        {campaign.sent > 0 && (
                          <span className="ml-1 text-xs text-[#888]">
                            ({Math.round((campaign.clicked / campaign.sent) * 100)}%)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#888]">
                        {campaign.date || "\u2014"}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${campaign.id}-detail`} className="bg-[#fafafa]">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="ml-6 space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-[#888]" />
                              <span className="text-xs font-bold uppercase tracking-widest text-[#888]">
                                Subject
                              </span>
                            </div>
                            <p className="text-sm font-medium text-black">
                              {campaign.subject}
                            </p>
                            <div className="mt-2">
                              <span className="text-xs font-bold uppercase tracking-widest text-[#888]">
                                Preview
                              </span>
                              <p className="mt-1 text-sm text-[#555] leading-relaxed">
                                {campaign.preview}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
