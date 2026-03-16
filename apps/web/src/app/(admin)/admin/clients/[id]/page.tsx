"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FolderKanban,
  Receipt,
  FileText,
  MessageSquare,
  User,
  Home,
  Activity,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useClient, useUpdateClient } from "@/lib/hooks/use-clients";

const tabs = [
  { key: "overview", label: "Overview", icon: User },
  { key: "notes", label: "Notes", icon: MessageSquare },
  { key: "documents", label: "Documents", icon: FileText },
];

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");

  const { data: rawClient, isLoading, error } = useClient(id);
  const updateClient = useUpdateClient();

  const client = rawClient as Record<string, unknown> | undefined;

  function handleAddNote() {
    if (!newNote.trim() || !client) return;
    const existing = String(client.internal_notes ?? "");
    const timestamp = new Date().toLocaleString();
    const updated = existing
      ? `${existing}\n\n[${timestamp}]\n${newNote.trim()}`
      : `[${timestamp}]\n${newNote.trim()}`;
    updateClient.mutate(
      { id, internal_notes: updated },
      { onSuccess: () => setNewNote("") }
    );
  }

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="mb-6 h-4 w-40" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-48 lg:col-span-2" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="mt-2 text-sm text-red-600">Failed to load client</p>
        {error ? (
          <p className="text-xs text-[#888]">{String((error as Error).message)}</p>
        ) : null}
        <Link href="/admin/clients" className="mt-4 text-xs text-[#888] hover:text-black underline">
          Back to Clients
        </Link>
      </div>
    );
  }

  const firstName = String(client.first_name ?? "");
  const lastName = String(client.last_name ?? "");
  const displayName = client.display_name
    ? String(client.display_name)
    : `${firstName} ${lastName}`.trim() || "Unnamed";
  const email = String(client.email ?? "");
  const phone = String(client.phone ?? "");
  const clientType = String(client.client_type ?? "").replace(/_/g, " ");
  const portalEnrolled = client.portal_enrolled as boolean | null;
  const totalRevenue = (client.total_revenue as number | null) ?? 0;
  const totalProjects = (client.total_projects as number | null) ?? 0;
  const referralSource = String(client.referral_source ?? "").replace(/_/g, " ");
  const internalNotes = String(client.internal_notes ?? "");
  const createdAt = client.created_at as string | null;

  const address = [
    client.address_line1 as string | null,
    client.city as string | null,
    client.state as string | null,
    client.zip_code as string | null,
  ]
    .filter(Boolean)
    .join(", ");

  const createdDisplay = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/clients"
          className="mb-3 inline-flex items-center text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Clients
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-black">
                {displayName}
              </h1>
              <Badge
                className={`text-[10px] ${portalEnrolled ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}
              >
                {portalEnrolled ? "Portal Active" : "No Portal"}
              </Badge>
            </div>
            <p className="text-sm text-[#888]">
              {clientType ? <span className="capitalize">{clientType}</span> : null}
              {clientType && createdDisplay ? " \u00b7 " : ""}
              {createdDisplay ? `Client since ${createdDisplay}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            {email ? (
              <Button variant="outline" size="sm" className="text-xs">
                <Mail className="mr-1 h-3 w-3" />
                Message
              </Button>
            ) : null}
            <Button
              size="sm"
              className="bg-black text-xs text-white hover:bg-black/90"
            >
              <Plus className="mr-1 h-3 w-3" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-[#e0dbd5]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
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

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border border-[#e0dbd5] shadow-none lg:col-span-2">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-semibold text-black">
                Contact Information
              </h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {email ? (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                  {email}
                </div>
              ) : null}
              {phone ? (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                  {phone}
                </div>
              ) : null}
              {address ? (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                  {address}
                </div>
              ) : null}
              {!email && !phone && !address ? (
                <p className="text-xs text-[#888]">No contact info available</p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border border-[#e0dbd5] shadow-none">
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Total Revenue
                </p>
                <p className="mt-1 text-2xl font-bold text-black">
                  ${Number(totalRevenue).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Projects
                </p>
                <p className="mt-1 text-lg font-bold text-black">
                  {totalProjects}
                </p>
              </div>
              {referralSource ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                    Source
                  </p>
                  <p className="mt-1 text-sm text-black">{referralSource}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notes */}
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
                disabled={updateClient.isPending}
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

      {/* Documents */}
      {activeTab === "documents" && (
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardContent className="p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-[#ccc]" strokeWidth={1.5} />
            <p className="mt-2 text-sm text-[#888]">No documents yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
