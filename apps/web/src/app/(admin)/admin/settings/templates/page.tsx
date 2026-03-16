"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppUser } from "@/lib/hooks/use-app-user";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  FileText,
  Clock,
  Send,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function highlightMergeVars(text: string) {
  const parts = text.split(/({{[^}]+}})/g);
  return parts.map((part, i) => {
    if (part.startsWith("{{") && part.endsWith("}}")) {
      return (
        <span
          key={i}
          className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[12px] font-medium"
          style={{ backgroundColor: "#f8f8f8", borderColor: "#e0dbd5", color: "black" }}
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function TemplatesPage() {
  const { appUser } = useAppUser();
  const tenantId = appUser?.tenantId ?? undefined;
  const supabase = createClient();
  const qc = useQueryClient();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");

  const { data: templates, isLoading } = useQuery({
    queryKey: ["communication-templates", tenantId],
    queryFn: async () => {
      let q = supabase
        .from("communication_templates")
        .select("id, name, channel, is_automated, subject, body, available_variables, updated_at, is_active");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.order("name", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, subject, body }: { id: string; subject: string; body: string }) => {
      const { error } = await supabase
        .from("communication_templates")
        .update({ subject, body, updated_at: new Date().toISOString() } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["communication-templates", tenantId] });
      toast.success("Template saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("communication_templates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["communication-templates", tenantId] });
      setSelectedId(null);
      toast.success("Template deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const templateList = templates ?? [];
  const filtered = templateList.filter((t) => {
    if (!searchQuery) return true;
    return (t.name as string).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedTemplate = selectedId
    ? templateList.find((t) => (t.id as string) === selectedId)
    : null;

  const openTemplate = (t: Record<string, unknown>) => {
    setSelectedId(t.id as string);
    setEditSubject((t.subject as string) ?? "");
    setEditBody(t.body as string);
  };

  const closeEditor = () => {
    setSelectedId(null);
    setEditSubject("");
    setEditBody("");
  };

  // Extract merge vars from available_variables or from body text
  const getMergeVars = (t: Record<string, unknown>): string[] => {
    const av = t.available_variables;
    if (Array.isArray(av)) return av as string[];
    // Extract from body
    const body = (t.body as string) ?? "";
    const matches = body.match(/{{([^}]+)}}/g);
    return matches ? matches.map((m) => m.replace(/{{|}}/g, "")) : [];
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "#e0dbd5" }}>
        <div className="flex items-center gap-3">
          {selectedTemplate ? (
            <Button variant="ghost" size="sm" onClick={closeEditor} className="h-8 w-8 p-0">
              <ArrowLeft size={16} strokeWidth={1.5} />
            </Button>
          ) : null}
          <FileText size={20} strokeWidth={1.5} />
          <h1 className="text-lg font-semibold text-black">
            {selectedTemplate ? (selectedTemplate.name as string) : "Message Templates"}
          </h1>
        </div>
        {!selectedTemplate ? (
          <Button style={{ backgroundColor: "black", color: "white", borderRadius: 8 }}>
            <Plus size={14} strokeWidth={1.5} />
            New Template
          </Button>
        ) : null}
      </div>

      {selectedTemplate ? (
        /* ---- Template Editor ---- */
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-3xl">
            {/* Meta info */}
            <div className="mb-6 flex items-center gap-3">
              <Badge
                variant="outline"
                className="gap-1"
                style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
              >
                {(selectedTemplate.channel as string) === "email" ? (
                  <Mail size={12} strokeWidth={1.5} />
                ) : (
                  <Phone size={12} strokeWidth={1.5} />
                )}
                {(selectedTemplate.channel as string) === "email" ? "Email" : "SMS"}
              </Badge>
              <Badge
                variant="outline"
                className="gap-1"
                style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
              >
                {(selectedTemplate.is_automated as boolean | null) ? (
                  <Clock size={12} strokeWidth={1.5} />
                ) : (
                  <FileText size={12} strokeWidth={1.5} />
                )}
                {(selectedTemplate.is_automated as boolean | null) ? "Automated" : "Manual"}
              </Badge>
              {(selectedTemplate.updated_at as string | null) ? (
                <span className="text-[12px]" style={{ color: "#888" }}>
                  Last modified: {new Date(selectedTemplate.updated_at as string).toLocaleDateString()}
                </span>
              ) : null}
            </div>

            {/* Subject (email only) */}
            {(selectedTemplate.channel as string) === "email" ? (
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-black">Subject</label>
                <Input
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="text-sm"
                  style={{ borderColor: "#e0dbd5", borderRadius: 8 }}
                />
              </div>
            ) : null}

            {/* Body */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-black">Body</label>
              <Textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="min-h-[200px] text-sm"
                style={{ borderColor: "#e0dbd5", borderRadius: 8 }}
              />
            </div>

            {/* Merge variable chips */}
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-black">Merge Variables</label>
              <div className="flex flex-wrap gap-2">
                {getMergeVars(selectedTemplate).map((v) => (
                  <button
                    key={v}
                    className="flex items-center gap-1 rounded-md border px-2 py-1 text-[12px] font-medium transition-colors hover:bg-black hover:text-white"
                    style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
                    onClick={() => setEditBody((prev) => prev + `{{${v}}}`)}
                  >
                    {`{{${v}}}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-black">Preview</label>
              <div
                className="rounded-lg border p-4 text-sm leading-relaxed whitespace-pre-wrap"
                style={{ borderColor: "#e0dbd5", backgroundColor: "#f8f8f8" }}
              >
                {(selectedTemplate.channel as string) === "email" && editSubject ? (
                  <div className="mb-3 border-b pb-3" style={{ borderColor: "#e0dbd5" }}>
                    <span className="text-[12px] font-medium" style={{ color: "#888" }}>
                      Subject:{" "}
                    </span>
                    <span className="text-sm text-black">{highlightMergeVars(editSubject)}</span>
                  </div>
                ) : null}
                <div className="text-sm text-black">{highlightMergeVars(editBody)}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                style={{ backgroundColor: "black", color: "white", borderRadius: 8 }}
                onClick={() =>
                  updateMutation.mutate({
                    id: selectedTemplate.id as string,
                    subject: editSubject,
                    body: editBody,
                  })
                }
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Template"}
              </Button>
              <Button
                variant="outline"
                className="gap-1.5"
                style={{ borderColor: "#e0dbd5", borderRadius: 8 }}
              >
                <Send size={14} strokeWidth={1.5} />
                Test Send
              </Button>
              <Button
                variant="ghost"
                style={{ color: "#888" }}
                onClick={() =>
                  deleteMutation.mutate(selectedTemplate.id as string)
                }
              >
                <Trash2 size={14} strokeWidth={1.5} className="mr-1" />
                Delete
              </Button>
              <Button variant="ghost" onClick={closeEditor} style={{ color: "#888" }}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ---- Template Grid ---- */
        <div className="flex-1 overflow-auto p-6">
          {/* Search */}
          <div className="mb-6 max-w-sm">
            <div className="relative">
              <Search size={16} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#888" }} />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-sm"
                style={{ borderColor: "#e0dbd5", borderRadius: 8, backgroundColor: "#f8f8f8" }}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm" style={{ color: "#888" }}>
              {searchQuery ? "No templates found." : "No templates configured yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((t) => {
                const channel = (t.channel as string) ?? "email";
                const isAutomated = (t.is_automated as boolean | null) === true;
                const body = (t.body as string) ?? "";
                const updatedAt = (t.updated_at as string | null);
                return (
                  <Card
                    key={t.id as string}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    style={{ borderRadius: 8, borderColor: "#e0dbd5" }}
                    onClick={() => openTemplate(t)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-black leading-tight">{t.name as string}</h3>
                        <Badge
                          variant="outline"
                          className="shrink-0 gap-1"
                          style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
                        >
                          {channel === "email" ? (
                            <Mail size={11} strokeWidth={1.5} />
                          ) : (
                            <Phone size={11} strokeWidth={1.5} />
                          )}
                          {channel === "email" ? "Email" : "SMS"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3 line-clamp-3 text-[13px] leading-relaxed" style={{ color: "#888" }}>
                        {body.slice(0, 120)}{body.length > 120 ? "..." : ""}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="gap-1 text-[10px]"
                          style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
                        >
                          {isAutomated ? (
                            <Clock size={10} strokeWidth={1.5} />
                          ) : (
                            <FileText size={10} strokeWidth={1.5} />
                          )}
                          {isAutomated ? "Automated" : "Manual"}
                        </Badge>
                        {updatedAt ? (
                          <span className="text-[11px]" style={{ color: "#888" }}>
                            {new Date(updatedAt).toLocaleDateString()}
                          </span>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
