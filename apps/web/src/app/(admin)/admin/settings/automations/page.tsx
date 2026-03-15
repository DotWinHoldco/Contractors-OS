"use client";

import React, { useState } from "react";
import {
  Zap,
  Mail,
  MessageSquare,
  Phone,
  Clock,
  CheckCircle2,
  Plus,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Bot,
  Bell,
  UserPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  triggerIcon: React.ElementType;
  action: string;
  actionIcon: React.ElementType;
  actionType: string;
  enabled: boolean;
  runCount: number;
  lastTriggered: string;
}

const automations: Automation[] = [
  {
    id: "1",
    name: "Welcome New Leads",
    trigger: "New Lead Created",
    triggerIcon: UserPlus,
    action: "Send welcome email with company brochure",
    actionIcon: Mail,
    actionType: "email",
    enabled: true,
    runCount: 87,
    lastTriggered: "2 hours ago",
  },
  {
    id: "2",
    name: "Estimate Follow-up",
    trigger: "Estimate Approved",
    triggerIcon: CheckCircle2,
    action: "Create project + notify team via SMS",
    actionIcon: Phone,
    actionType: "sms",
    enabled: true,
    runCount: 34,
    lastTriggered: "Yesterday",
  },
  {
    id: "3",
    name: "Overdue Invoice Reminder",
    trigger: "Invoice Overdue 7 Days",
    triggerIcon: Clock,
    action: "Send payment reminder SMS",
    actionIcon: Phone,
    actionType: "sms",
    enabled: true,
    runCount: 12,
    lastTriggered: "3 days ago",
  },
  {
    id: "4",
    name: "Review Request",
    trigger: "Project Marked Complete",
    triggerIcon: CheckCircle2,
    action: "Send review request email after 3 days",
    actionIcon: Mail,
    actionType: "email",
    enabled: true,
    runCount: 19,
    lastTriggered: "1 week ago",
  },
  {
    id: "5",
    name: "Client Message Alert",
    trigger: "New Message from Client",
    triggerIcon: MessageSquare,
    action: "Notify assigned team member",
    actionIcon: Bell,
    actionType: "notification",
    enabled: false,
    runCount: 156,
    lastTriggered: "5 minutes ago",
  },
  {
    id: "6",
    name: "Hot Lead Assignment",
    trigger: "Lead Score > 80",
    triggerIcon: Zap,
    action: "Assign to sales manager + AI generate summary",
    actionIcon: Bot,
    actionType: "ai",
    enabled: true,
    runCount: 8,
    lastTriggered: "2 days ago",
  },
];

export default function AutomationsPage() {
  const [rules, setRules] = useState(automations);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const activeCount = rules.filter((r) => r.enabled).length;
  const totalRuns = rules.reduce((s, r) => s + r.runCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">Automations</h1>
          <p className="mt-1 text-sm text-[#888]">
            {activeCount} active rules &middot; {totalRuns} total runs
          </p>
        </div>
        <Button className="bg-black text-white hover:bg-black/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Automation
        </Button>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <Card
            key={rule.id}
            className={`border-[#e0dbd5] ${!rule.enabled ? "opacity-60" : ""}`}
          >
            <CardContent className="flex items-center gap-4 p-4">
              {/* Toggle */}
              <button
                onClick={() => toggleRule(rule.id)}
                className="shrink-0 text-black"
              >
                {rule.enabled ? (
                  <ToggleRight className="h-6 w-6" strokeWidth={1.5} />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-[#888]" strokeWidth={1.5} />
                )}
              </button>

              {/* Trigger */}
              <div className="flex items-center gap-2 rounded-lg border border-[#e0dbd5] bg-[#f8f8f8] px-3 py-2">
                <rule.triggerIcon className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                <span className="text-sm font-medium text-black">
                  {rule.trigger}
                </span>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-4 w-4 shrink-0 text-[#888]" strokeWidth={1.5} />

              {/* Action */}
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#e0dbd5] bg-[#f8f8f8] px-3 py-2">
                <rule.actionIcon className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                <span className="text-sm text-black">{rule.action}</span>
              </div>

              {/* Meta */}
              <div className="hidden shrink-0 items-center gap-3 text-xs text-[#888] sm:flex">
                <Badge
                  variant="outline"
                  className="border-[#e0dbd5] text-[#888]"
                >
                  {rule.runCount} runs
                </Badge>
                <span>{rule.lastTriggered}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
