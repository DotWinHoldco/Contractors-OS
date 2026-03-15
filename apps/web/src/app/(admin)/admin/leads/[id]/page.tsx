"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  FileText,
  Bot,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const leadData: Record<
  string,
  {
    name: string;
    email: string;
    phone: string;
    address: string;
    project: string;
    value: number;
    status: string;
    source: string;
    score: number;
    notes: string[];
    activity: { action: string; date: string }[];
    details: Record<string, string>;
  }
> = {
  "1": {
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    phone: "(231) 555-0101",
    address: "123 Lake Shore Dr, Traverse City, MI 49684",
    project: "Kitchen Remodel",
    value: 45000,
    status: "new",
    source: "Website Booking",
    score: 85,
    notes: ["Very interested in quartz countertops", "Has a timeline of 2 months"],
    activity: [
      { action: "Lead created from booking flow", date: "2h ago" },
      { action: "Estimate generated: $35K-$55K", date: "2h ago" },
      { action: "Consultation scheduled: March 20, 2:00 PM", date: "2h ago" },
    ],
    details: {
      Scope: "Cabinets, Countertops, Backsplash, Flooring, Lighting",
      Style: "Modern/Contemporary",
      Complexity: "Moderate",
      Timeline: "1-3 months",
      Budget: "$25K-$50K",
      Dimensions: "15' × 18'",
    },
  },
};

const tabs = [
  { key: "overview", label: "Overview", icon: User },
  { key: "activity", label: "Activity", icon: Calendar },
  { key: "notes", label: "Notes", icon: MessageSquare },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "ai", label: "AI Summary", icon: Bot },
];

const statusOptions = [
  "new",
  "contacted",
  "qualified",
  "quoted",
  "proposal_sent",
  "negotiating",
  "won",
  "lost",
];

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");

  const lead = leadData[id] ?? leadData["1"]!;

  function handleAddNote() {
    if (!newNote.trim()) return;
    toast.success("Note added");
    setNewNote("");
  }

  function handleConvert() {
    toast.success("Lead converted to client");
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/leads"
          className="mb-3 inline-flex items-center text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Leads
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">{lead.name}</h1>
            <p className="text-sm text-[#888]">{lead.project}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Mail className="mr-1 h-3 w-3" />
              Email
            </Button>
            <Button
              size="sm"
              className="bg-black text-xs text-white hover:bg-black/90"
              onClick={handleConvert}
            >
              Convert to Client
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 border-b border-[#e0dbd5]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-black text-black"
                    : "border-transparent text-[#888] hover:text-black"
                }`}
              >
                <tab.icon className="h-3 w-3" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <Card className="border border-[#e0dbd5] shadow-none">
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-semibold text-black">
                    Contact Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                    <span>{lead.address}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[#e0dbd5] shadow-none">
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-semibold text-black">
                    Project Details
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(lead.details).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                          {key}
                        </p>
                        <p className="mt-0.5 text-sm text-black">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <Card className="border border-[#e0dbd5] shadow-none">
              <CardContent className="p-5">
                <div className="space-y-4">
                  {lead.activity.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-black" />
                      <div>
                        <p className="text-sm text-black">{item.action}</p>
                        <p className="text-xs text-[#888]">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <Card className="border border-[#e0dbd5] shadow-none">
                <CardContent className="p-5">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={3}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    className="mt-2 bg-black text-xs text-white hover:bg-black/90"
                  >
                    Add Note
                  </Button>
                </CardContent>
              </Card>
              {lead.notes.map((note, i) => (
                <Card key={i} className="border border-[#e0dbd5] shadow-none">
                  <CardContent className="p-4">
                    <p className="text-sm text-[#555]">{note}</p>
                    <p className="mt-2 text-xs text-[#888]">Added 2h ago</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <Card className="border border-[#e0dbd5] shadow-none">
              <CardContent className="p-10 text-center">
                <FileText className="mx-auto h-8 w-8 text-[#ccc]" strokeWidth={1.5} />
                <p className="mt-2 text-sm text-[#888]">No documents yet</p>
              </CardContent>
            </Card>
          )}

          {/* AI Summary Tab */}
          {activeTab === "ai" && (
            <Card className="border border-[#e0dbd5] shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                    AI Analysis
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">
                  High-value kitchen remodel lead with a clear timeline and budget.
                  The homeowner is interested in modern contemporary style with quartz
                  countertops. Consultation is scheduled for this week. Recommend
                  preparing a detailed scope document with material options and
                  pricing tiers before the meeting.
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Recommended Next Steps
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-[#555]">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black" />
                    Prepare material selection sheets (cabinets, countertops, backsplash)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black" />
                    Review property photos before consultation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black" />
                    Bring similar project portfolio (Modern Kitchen Traverse City)
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Status Card */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Status
                </p>
                <select className="mt-1 w-full rounded-md border border-[#e0dbd5] bg-white px-3 py-1.5 text-sm">
                  {statusOptions.map((s) => (
                    <option key={s} value={s} selected={s === lead.status}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Score
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">
                  {lead.score}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Estimated Value
                </p>
                <p className="mt-1 text-lg font-bold text-black">
                  ${lead.value.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Source
                </p>
                <p className="mt-1 text-sm text-black">{lead.source}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardContent className="p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#888] mb-3">
                Quick Actions
              </p>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Phone className="mr-2 h-3 w-3" />
                Log Phone Call
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Mail className="mr-2 h-3 w-3" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Calendar className="mr-2 h-3 w-3" />
                Schedule Follow-up
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <DollarSign className="mr-2 h-3 w-3" />
                Create Estimate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
