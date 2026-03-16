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
import {
  FolderKanban,
  MessageSquare,
  CreditCard,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileText,
  Camera,
  Phone,
  Mail,
  User,
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
  statusLabel: "Countertop Installation In Progress",
  nextDate: "Mar 22, 2026",
  nextEvent: "Backsplash tile delivery",
  estimatedRange: "$28,000 – $38,000",
};

const representative = {
  name: "Mike Reynolds",
  title: "Project Manager",
  phone: "(231) 555-0147",
  email: "mike@grandtraversehomeco.com",
};

const phases = [
  { name: "Design & Planning", status: "completed" as const },
  { name: "Demolition", status: "completed" as const },
  { name: "Rough Plumbing & Electrical", status: "completed" as const },
  { name: "Cabinet Installation", status: "completed" as const },
  { name: "Countertop Installation", status: "in_progress" as const },
  { name: "Backsplash & Painting", status: "upcoming" as const },
  { name: "Fixtures & Appliances", status: "upcoming" as const },
  { name: "Final Walkthrough", status: "upcoming" as const },
];

const outstandingInvoices = [
  { id: "inv-003", label: "Progress Payment #3", amount: 4250.0, due: "Mar 18, 2026" },
];

const unreadMessages = 3;

const recentActivity = [
  { id: "a1", icon: Camera, text: "12 new photos added to Kitchen Renovation", time: "2 hours ago" },
  { id: "a2", icon: CheckCircle2, text: 'Phase "Countertop Installation" marked in progress', time: "Yesterday" },
  { id: "a3", icon: FileText, text: "Change order #2 uploaded for review", time: "2 days ago" },
  { id: "a4", icon: CreditCard, text: "Payment of $3,800.00 received — thank you!", time: "4 days ago" },
  { id: "a5", icon: MessageSquare, text: "New message from Mike (Project Manager)", time: "5 days ago" },
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

      {/* Project Status Banner with Gold Progress Bar */}
      <Card className="border-[#e0dbd5]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/portal/projects/${activeProject.id}`}
                className="text-xl font-semibold text-black hover:underline"
              >
                {activeProject.name}
              </Link>
              <p className="mt-1 text-sm text-[#888]">{activeProject.statusLabel}</p>
            </div>
            <p className="text-right text-sm font-medium text-[#D4A84B]">
              {activeProject.estimatedRange}
            </p>
          </div>
          {/* Gold Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-[#888]">
                Overall Progress
              </span>
              <span className="font-semibold text-black">{activeProject.progress}%</span>
            </div>
            <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-[#D4A84B]/15">
              <div
                className="progress-shimmer relative h-full rounded-full bg-[#D4A84B] transition-all duration-1000"
                style={{ width: `${activeProject.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Phase Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#e0dbd5]">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-black">
                Your Renovation Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              {phases.map((phase, i) => (
                <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    {phase.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-[#2D6A4F]" />
                    ) : phase.status === "in_progress" ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#D4A84B]">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#D4A84B]" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 text-[#e0dbd5]" />
                    )}
                    {i < phases.length - 1 && <div className="w-px flex-1 bg-[#e0dbd5]" />}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${
                        phase.status === "completed" ? "text-[#2D6A4F]"
                          : phase.status === "in_progress" ? "text-[#D4A84B]"
                          : "text-[#888]"
                      }`}>
                        {phase.name}
                      </p>
                      {phase.status === "in_progress" && (
                        <span className="bg-[#D4A84B]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D4A84B]">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

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

        {/* Right Column */}
        <div className="space-y-6">
          {/* Representative Card */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">
                Your Representative
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0dbd5]">
                  <User className="h-5 w-5 text-[#888]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">{representative.name}</p>
                  <p className="text-xs text-[#888]">{representative.title}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <a href={`tel:${representative.phone}`} className="flex items-center gap-2 text-sm text-black hover:underline">
                  <Phone className="h-3.5 w-3.5 text-[#D4A84B]" />
                  {representative.phone}
                </a>
                <a href={`mailto:${representative.email}`} className="flex items-center gap-2 text-sm text-black hover:underline">
                  <Mail className="h-3.5 w-3.5 text-[#D4A84B]" />
                  {representative.email}
                </a>
              </div>
              <p className="mt-3 text-xs text-[#888]">
                Questions? Call {representative.name.split(" ")[0]} directly.
              </p>
            </CardContent>
          </Card>

          {/* Outstanding Balance */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Outstanding Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-[#888]" />
            </CardHeader>
            <CardContent>
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
                    <Button className="w-full bg-black text-white hover:bg-black/90">Pay Now</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-[#888]" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-black">{unreadMessages}</p>
              <p className="text-sm text-[#888]">unread messages</p>
              <Link href="/portal/messages" className="mt-4 block">
                <Button variant="outline" className="w-full border-[#e0dbd5] text-black hover:bg-[#e0dbd5]/30">
                  View Messages <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card className="border-[#e0dbd5]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-[#888]" />
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-black">{activeProject.nextEvent}</p>
              <p className="text-xs text-[#888]">{activeProject.nextDate}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
