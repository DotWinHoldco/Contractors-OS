"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useLead, useUpdateLead } from "@/lib/hooks/use-leads";

const tabs = [
  { key: "overview", label: "Overview", icon: User },
  { key: "notes", label: "Notes", icon: MessageSquare },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "ai", label: "AI Summary", icon: Bot },
];

const statusOptions = [
  "new",
  "contacted",
  "qualified",
  "needs_analysis",
  "estimate_scheduled",
  "estimate_sent",
  "proposal_sent",
  "negotiating",
  "won",
  "lost",
  "disqualified",
  "on_hold",
  "nurturing",
  "reactivated",
  "no_response",
  "archived",
];

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");

  const { data: rawLead, isLoading, error } = useLead(id);
  const updateLead = useUpdateLead();

  const lead = rawLead as Record<string, unknown> | undefined;

  function handleStatusChange(newStatus: string) {
    updateLead.mutate({ id, status: newStatus as never });
  }

  function handleAddNote() {
    if (!newNote.trim()) return;
    const existing = String(lead?.internal_notes ?? "");
    const timestamp = new Date().toLocaleString();
    const updated = existing
      ? `${existing}\n\n[${timestamp}]\n${newNote.trim()}`
      : `[${timestamp}]\n${newNote.trim()}`;
    updateLead.mutate(
      { id, internal_notes: updated },
      { onSuccess: () => setNewNote("") }
    );
  }

  function handleConvert() {
    updateLead.mutate(
      { id, status: "won" as never },
      {
        onSuccess: () => toast.success("Lead marked as won"),
      }
    );
  }

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="mb-6 h-4 w-40" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="mt-2 text-sm text-red-600">Failed to load lead</p>
        {error ? (
          <p className="text-xs text-[#888]">{String((error as Error).message)}</p>
        ) : null}
        <Link href="/admin/leads" className="mt-4 text-xs text-[#888] hover:text-black underline">
          Back to Leads
        </Link>
      </div>
    );
  }

  const firstName = String(lead.first_name ?? "");
  const lastName = String(lead.last_name ?? "");
  const fullName = `${firstName} ${lastName}`.trim() || "Unnamed";
  const email = String(lead.email ?? "");
  const phone = String(lead.phone ?? "");
  const address = [
    lead.address_line1 as string | null,
    lead.city as string | null,
    lead.state as string | null,
    lead.zip_code as string | null,
  ]
    .filter(Boolean)
    .join(", ");
  const tradeCategory = String(lead.trade_category ?? "").replace(/_/g, " ");
  const projectType = String(lead.project_type ?? "").replace(/_/g, " ");
  const projectDesc = String(lead.project_description ?? "");
  const estimatedValue = lead.ai_estimated_value as number | null;
  const budgetLow = lead.budget_range_low as number | null;
  const budgetHigh = lead.budget_range_high as number | null;
  const status = String(lead.status ?? "new");
  const source = String(lead.source ?? "").replace(/_/g, " ");
  const score = (lead.score as number | null) ?? 0;
  const temperature = String(lead.temperature ?? "");
  const priority = String(lead.priority ?? "");
  const internalNotes = String(lead.internal_notes ?? "");
  const aiSummary = String(lead.ai_summary ?? "");

  const budgetDisplay =
    budgetLow != null && budgetHigh != null
      ? `$${Number(budgetLow).toLocaleString()} - $${Number(budgetHigh).toLocaleString()}`
      : budgetLow != null
        ? `$${Number(budgetLow).toLocaleString()}+`
        : budgetHigh != null
          ? `Up to $${Number(budgetHigh).toLocaleString()}`
          : null;

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
            <h1 className="text-2xl font-bold text-black">{fullName}</h1>
            {tradeCategory ? (
              <p className="text-sm text-[#888]">{tradeCategory}</p>
            ) : null}
          </div>
          <div className="flex gap-2">
            {email ? (
              <Button variant="outline" size="sm" className="text-xs">
                <Mail className="mr-1 h-3 w-3" />
                Email
              </Button>
            ) : null}
            <Button
              size="sm"
              className="bg-black text-xs text-white hover:bg-black/90"
              onClick={handleConvert}
              disabled={updateLead.isPending}
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
                  {email ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                      <span>{email}</span>
                    </div>
                  ) : null}
                  {phone ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                      <span>{phone}</span>
                    </div>
                  ) : null}
                  {address ? (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                      <span>{address}</span>
                    </div>
                  ) : null}
                  {!email && !phone && !address ? (
                    <p className="text-xs text-[#888]">No contact info available</p>
                  ) : null}
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
                    {tradeCategory ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                          Trade
                        </p>
                        <p className="mt-0.5 text-sm text-black">{tradeCategory}</p>
                      </div>
                    ) : null}
                    {projectType ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                          Type
                        </p>
                        <p className="mt-0.5 text-sm text-black">{projectType}</p>
                      </div>
                    ) : null}
                    {budgetDisplay ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                          Budget
                        </p>
                        <p className="mt-0.5 text-sm text-black">{budgetDisplay}</p>
                      </div>
                    ) : null}
                    {temperature ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                          Temperature
                        </p>
                        <p className="mt-0.5 text-sm text-black capitalize">{temperature}</p>
                      </div>
                    ) : null}
                    {priority ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                          Priority
                        </p>
                        <p className="mt-0.5 text-sm text-black capitalize">{priority}</p>
                      </div>
                    ) : null}
                    {projectDesc ? (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                          Description
                        </p>
                        <p className="mt-0.5 text-sm text-black">{projectDesc}</p>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                    disabled={updateLead.isPending}
                    className="mt-2 bg-black text-xs text-white hover:bg-black/90"
                  >
                    Add Note
                  </Button>
                </CardContent>
              </Card>
              {internalNotes ? (
                <Card className="border border-[#e0dbd5] shadow-none">
                  <CardContent className="p-4">
                    <p className="whitespace-pre-wrap text-sm text-[#555]">
                      {internalNotes}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-[#e0dbd5] shadow-none">
                  <CardContent className="p-10 text-center">
                    <MessageSquare className="mx-auto h-8 w-8 text-[#ccc]" strokeWidth={1.5} />
                    <p className="mt-2 text-sm text-[#888]">No notes yet</p>
                  </CardContent>
                </Card>
              )}
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
                {aiSummary ? (
                  <p className="text-sm leading-relaxed text-[#555]">
                    {aiSummary}
                  </p>
                ) : (
                  <p className="text-sm text-[#888]">
                    No AI summary available for this lead yet.
                  </p>
                )}
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
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#e0dbd5] bg-white px-3 py-1.5 text-sm"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Score
                </p>
                <p className={`mt-1 text-2xl font-bold ${scoreColor(score)}`}>
                  {score}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Estimated Value
                </p>
                <p className="mt-1 text-lg font-bold text-black">
                  {estimatedValue != null
                    ? `$${Number(estimatedValue).toLocaleString()}`
                    : "—"}
                </p>
              </div>

              {source ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                    Source
                  </p>
                  <p className="mt-1 text-sm text-black">{source}</p>
                </div>
              ) : null}
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
