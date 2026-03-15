"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  FileText,
  Eye,
  PenLine,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Download,
} from "lucide-react";

type Tab = "editor" | "preview" | "signatures" | "activity";

const contractContent = `CONSTRUCTION CONTRACT AGREEMENT

This Construction Contract ("Agreement") is entered into as of March 12, 2026, by and between:

CONTRACTOR: Prestige Home Builders LLC
CLIENT: Sarah Mitchell

1. SCOPE OF WORK
The Contractor agrees to perform the following work at the property located at 742 Evergreen Terrace, Springfield:
- Complete kitchen demolition and removal of existing cabinetry, countertops, and flooring
- Installation of custom maple shaker cabinetry (36 linear feet)
- Quartz countertop fabrication and installation (48 sq ft)
- Hardwood flooring installation (180 sq ft)
- Electrical upgrades including under-cabinet lighting and new circuits
- Plumbing relocation and installation of new sink and disposal
- Tile backsplash installation (24 sq ft)
- Painting and trim work

2. PROJECT SCHEDULE
- Start Date: April 1, 2026
- Estimated Completion: May 30, 2026
- Milestones:
  a. Demolition complete — April 7
  b. Rough-in (plumbing/electrical) — April 18
  c. Cabinetry installed — May 2
  d. Countertops and flooring — May 16
  e. Final punch list and walkthrough — May 28

3. CONTRACT PRICE
Total Contract Price: $45,200.00
- Deposit (10%): $4,520.00 due upon signing
- Progress Payment 1 (30%): $13,560.00 due at rough-in completion
- Progress Payment 2 (30%): $13,560.00 due at cabinetry installation
- Final Payment (25%): $11,300.00 due at completion
- Retainage (5%): $2,260.00 released 30 days after final inspection

4. TERMS AND CONDITIONS
- All work shall be performed in accordance with local building codes
- Contractor shall obtain all necessary permits
- Changes to scope require written change order signed by both parties
- Contractor maintains general liability insurance ($2M) and workers compensation`;

const activityLog = [
  { date: "Mar 12, 2026", time: "3:45 PM", action: "Contract executed — both parties signed", user: "System" },
  { date: "Mar 12, 2026", time: "2:30 PM", action: "Client signed the contract", user: "Sarah Mitchell" },
  { date: "Mar 11, 2026", time: "10:15 AM", action: "Contractor signed the contract", user: "John Builder" },
  { date: "Mar 10, 2026", time: "4:00 PM", action: "Contract sent to client for signature", user: "John Builder" },
  { date: "Mar 9, 2026", time: "11:30 AM", action: "Contract generated from AI template", user: "John Builder" },
  { date: "Mar 9, 2026", time: "11:00 AM", action: "Contract draft created", user: "John Builder" },
];

export default function ContractDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [content, setContent] = useState(contractContent);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "editor", label: "Editor", icon: <PenLine className="h-3.5 w-3.5" strokeWidth={1.5} /> },
    { key: "preview", label: "Preview", icon: <Eye className="h-3.5 w-3.5" strokeWidth={1.5} /> },
    { key: "signatures", label: "Signatures", icon: <FileText className="h-3.5 w-3.5" strokeWidth={1.5} /> },
    { key: "activity", label: "Activity", icon: <Clock className="h-3.5 w-3.5" strokeWidth={1.5} /> },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/contracts"
          className="mb-3 inline-flex items-center gap-1 text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Back to Contracts
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-black">CTR-001</h1>
              <Badge className="bg-emerald-100 text-[10px] text-emerald-700">Executed</Badge>
            </div>
            <p className="mt-1 text-sm text-[#888]">
              Client:{" "}
              <Link href="/admin/clients/1" className="text-black hover:underline">
                Sarah Mitchell
              </Link>
              {" | "}
              Project:{" "}
              <Link href="/admin/projects/1" className="text-black hover:underline">
                Kitchen Remodel
              </Link>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#e0dbd5] text-xs text-[#555]"
            >
              <Download className="mr-1 h-3 w-3" strokeWidth={1.5} />
              Download PDF
            </Button>
            <Button
              size="sm"
              className="bg-black text-xs text-white hover:bg-black/90"
            >
              <Send className="mr-1 h-3 w-3" strokeWidth={1.5} />
              Send to Client
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main Content */}
        <div>
          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-md border border-[#e0dbd5] p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-black text-white"
                    : "text-[#888] hover:text-black"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor Tab */}
          {activeTab === "editor" && (
            <Card className="border border-[#e0dbd5] shadow-none p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-[#888]">Contract Content</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#e0dbd5] text-xs text-[#555]"
                >
                  <Sparkles className="mr-1 h-3 w-3" strokeWidth={1.5} />
                  Generate with AI
                </Button>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[500px] resize-y border-[#e0dbd5] font-mono text-sm leading-relaxed text-black"
              />
            </Card>
          )}

          {/* Preview Tab */}
          {activeTab === "preview" && (
            <Card className="border border-[#e0dbd5] shadow-none p-6">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap font-mono text-sm leading-relaxed text-black">
                {content}
              </div>
            </Card>
          )}

          {/* Signatures Tab */}
          {activeTab === "signatures" && (
            <div className="space-y-4">
              {/* Contractor Signature */}
              <Card className="border border-[#e0dbd5] shadow-none p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-black">Contractor Signature</p>
                    <p className="text-xs text-[#888]">Signed by John Builder on Mar 11, 2026 at 10:15 AM</p>
                    <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <p className="font-serif text-lg italic text-emerald-800">John Builder</p>
                      <p className="text-[10px] text-emerald-600">Prestige Home Builders LLC</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Client Signature */}
              <Card className="border border-[#e0dbd5] shadow-none p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-black">Client Signature</p>
                    <p className="text-xs text-[#888]">Signed by Sarah Mitchell on Mar 12, 2026 at 2:30 PM</p>
                    <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <p className="font-serif text-lg italic text-emerald-800">Sarah Mitchell</p>
                      <p className="text-[10px] text-emerald-600">Client</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <Card className="border border-[#e0dbd5] shadow-none p-5">
              <div className="space-y-0">
                {activityLog.map((entry, i) => (
                  <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Timeline line */}
                    {i < activityLog.length - 1 && (
                      <div className="absolute left-[7px] top-5 h-full w-px bg-[#e0dbd5]" />
                    )}
                    {/* Dot */}
                    <div className="relative z-10 mt-1.5 h-[15px] w-[15px] flex-shrink-0 rounded-full border-2 border-[#e0dbd5] bg-white" />
                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-sm text-black">{entry.action}</p>
                      <p className="mt-0.5 text-xs text-[#888]">
                        {entry.user} &middot; {entry.date} at {entry.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Side Panel — Contract Metadata */}
        <div className="space-y-4">
          <Card className="border border-[#e0dbd5] shadow-none p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#888]">
              Contract Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Type</p>
                <p className="text-sm capitalize text-black">Remodel</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Contract Amount</p>
                <p className="text-sm font-semibold text-black">$45,200.00</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Created Date</p>
                <p className="text-sm text-black">Mar 9, 2026</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Executed Date</p>
                <p className="text-sm text-black">Mar 12, 2026</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Retainage</p>
                <p className="text-sm text-black">5% ($2,260.00)</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Start Date</p>
                <p className="text-sm text-black">Apr 1, 2026</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Est. Completion</p>
                <p className="text-sm text-black">May 30, 2026</p>
              </div>
            </div>
          </Card>

          <Card className="border border-[#e0dbd5] shadow-none p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#888]">
              Payment Schedule
            </h3>
            <div className="space-y-2">
              {[
                { label: "Deposit (10%)", amount: "$4,520", status: "Paid" },
                { label: "Progress 1 (30%)", amount: "$13,560", status: "Pending" },
                { label: "Progress 2 (30%)", amount: "$13,560", status: "Pending" },
                { label: "Final (25%)", amount: "$11,300", status: "Pending" },
                { label: "Retainage (5%)", amount: "$2,260", status: "Held" },
              ].map((payment, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-black">{payment.label}</p>
                    <p className="text-[10px] text-[#888]">{payment.status}</p>
                  </div>
                  <p className="text-xs font-semibold text-black">{payment.amount}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
