"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FolderKanban,
  MessageSquare,
  CreditCard,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
  Camera,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const client = { firstName: "Sarah" };

const activeProject = {
  id: "proj-001",
  name: "Kitchen Renovation",
  progress: 65,
  currentPhase: "Countertop Installation",
  nextDate: "Mar 22, 2026",
  nextEvent: "Backsplash tile delivery",
};

const outstandingInvoices = [
  { id: "inv-003", label: "Progress Payment #3", amount: 4250.0, due: "Mar 18, 2026" },
];

const unreadMessages = 3;

const recentActivity = [
  {
    id: "a1",
    icon: Camera,
    text: "12 new photos added to Kitchen Renovation",
    time: "2 hours ago",
  },
  {
    id: "a2",
    icon: CheckCircle2,
    text: 'Phase "Countertop Installation" marked in progress',
    time: "Yesterday",
  },
  {
    id: "a3",
    icon: FileText,
    text: "Change order #2 uploaded for review",
    time: "2 days ago",
  },
  {
    id: "a4",
    icon: CreditCard,
    text: "Payment of $3,800.00 received — thank you!",
    time: "4 days ago",
  },
  {
    id: "a5",
    icon: MessageSquare,
    text: "New message from Mike (Project Manager)",
    time: "5 days ago",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-black sm:text-3xl">
          Welcome back, {client.firstName}
        </h1>
        <p className="mt-1 text-sm text-[#888]">
          Here&rsquo;s what&rsquo;s happening with your project.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Active Project */}
        <Card className="border-[#e0dbd5] sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#888]">
              Active Project
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-[#888]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href={`/portal/projects/${activeProject.id}`}
              className="text-lg font-semibold text-black hover:underline"
            >
              {activeProject.name}
            </Link>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#888]">Progress</span>
                <span className="font-medium text-black">
                  {activeProject.progress}%
                </span>
              </div>
              <Progress value={activeProject.progress} className="h-2" />
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-[#888]">
                Current phase:{" "}
                <span className="font-medium text-black">
                  {activeProject.currentPhase}
                </span>
              </p>
              <div className="flex items-center gap-1 text-[#888]">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Next: {activeProject.nextEvent} — {activeProject.nextDate}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Invoices */}
        <Card className="border-[#e0dbd5]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#888]">
              Outstanding Balance
            </CardTitle>
            <CreditCard className="h-4 w-4 text-[#888]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {outstandingInvoices.map((inv) => (
              <div key={inv.id} className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-black">
                    ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-[#888]">{inv.label}</p>
                  <p className="mt-1 text-xs text-[#888]">Due {inv.due}</p>
                </div>
                <Link href="/portal/payments">
                  <Button className="w-full bg-black text-white hover:bg-black/90">
                    Pay Now
                  </Button>
                </Link>
              </div>
            ))}
            {outstandingInvoices.length === 0 && (
              <p className="text-sm text-[#888]">All caught up!</p>
            )}
          </CardContent>
        </Card>

        {/* Unread Messages */}
        <Card className="border-[#e0dbd5]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#888]">
              Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-[#888]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-black">{unreadMessages}</p>
              <p className="text-sm text-[#888]">unread messages</p>
            </div>
            <Link href="/portal/messages">
              <Button
                variant="outline"
                className="w-full border-[#e0dbd5] text-black hover:bg-[#e0dbd5]/30"
              >
                View Messages
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-[#e0dbd5]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e0dbd5]/50">
                  <item.icon className="h-4 w-4 text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-black">{item.text}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-[#888]">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
