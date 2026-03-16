"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppUser } from "@/lib/hooks/use-app-user";
import { toast } from "sonner";
import {
  Webhook,
  Plus,
  ChevronDown,
  ChevronRight,
  Play,
  Check,
  X,
  MoreHorizontal,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WebhooksPage() {
  const { appUser } = useAppUser();
  const tenantId = appUser?.tenantId ?? undefined;
  const supabase = createClient();
  const qc = useQueryClient();

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ["webhooks", tenantId],
    queryFn: async () => {
      let q = supabase
        .from("webhooks")
        .select("id, name, url, events, is_active, failure_count, last_response_code, last_triggered_at, created_at");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("webhooks")
        .update({ is_active } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["webhooks", tenantId] });
      toast.success("Webhook updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("webhooks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["webhooks", tenantId] });
      toast.success("Webhook deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const webhookList = webhooks ?? [];

  function toggleRow(id: string) {
    setExpandedRow((prev) => (prev === id ? null : id));
  }

  function truncateUrl(url: string, max = 45) {
    return url.length > max ? url.slice(0, max) + "..." : url;
  }

  const formatTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black" style={{ fontFamily: "Outfit, sans-serif" }}>
            Webhooks
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#888" }}>
            Send real-time event notifications to external services.
          </p>
        </div>
        <button
          className="inline-flex h-8 items-center gap-1.5 px-3 text-xs font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "#000", borderRadius: "6px" }}
        >
          <Plus size={14} strokeWidth={1.5} />
          Create Webhook
        </button>
      </div>

      {/* Webhooks Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : webhookList.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-lg border py-16"
          style={{ borderColor: "#e0dbd5" }}
        >
          <Webhook size={40} strokeWidth={1} style={{ color: "#e0dbd5" }} />
          <p className="mt-3 text-sm font-medium text-black">No webhooks configured</p>
          <p className="mt-1 text-sm" style={{ color: "#888" }}>
            Create a webhook to send event notifications to external services.
          </p>
        </div>
      ) : (
        <div
          className="overflow-hidden border"
          style={{ borderColor: "#e0dbd5", borderRadius: "8px" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#f8f8f8", borderBottom: "1px solid #e0dbd5" }}>
                <th className="w-8 px-3 py-2.5 text-left" />
                <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#888" }}>
                  Endpoint
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#888" }}>
                  Events
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#888" }}>
                  Status
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#888" }}>
                  Last Triggered
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "#888" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {webhookList.map((webhook) => {
                const id = webhook.id as string;
                const url = webhook.url as string;
                const events = (webhook.events as string[]) ?? [];
                const isActive = (webhook.is_active as boolean | null) !== false;
                const lastTriggered = webhook.last_triggered_at as string | null;
                const lastCode = webhook.last_response_code as number | null;
                const isExpanded = expandedRow === id;

                return (
                  <WebhookRowView
                    key={id}
                    id={id}
                    url={url}
                    events={events}
                    isActive={isActive}
                    lastTriggered={lastTriggered}
                    lastCode={lastCode}
                    isExpanded={isExpanded}
                    onToggle={() => toggleRow(id)}
                    truncateUrl={truncateUrl}
                    formatTimeAgo={formatTimeAgo}
                    onToggleActive={() => toggleMutation.mutate({ id, is_active: !isActive })}
                    onDelete={() => deleteMutation.mutate(id)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function WebhookRowView({
  id,
  url,
  events,
  isActive,
  lastTriggered,
  lastCode,
  isExpanded,
  onToggle,
  truncateUrl,
  formatTimeAgo,
  onToggleActive,
  onDelete,
}: {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggered: string | null;
  lastCode: number | null;
  isExpanded: boolean;
  onToggle: () => void;
  truncateUrl: (url: string, max?: number) => string;
  formatTimeAgo: (dateStr: string | null) => string;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <tr
        className="transition-colors hover:bg-gray-50/50"
        style={{ borderBottom: isExpanded ? "none" : "1px solid #e0dbd5" }}
      >
        <td className="px-3 py-3">
          <button
            onClick={onToggle}
            className="flex h-5 w-5 items-center justify-center transition-colors"
            style={{ color: "#888" }}
          >
            {isExpanded ? (
              <ChevronDown size={14} strokeWidth={1.5} />
            ) : (
              <ChevronRight size={14} strokeWidth={1.5} />
            )}
          </button>
        </td>

        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            <Webhook size={14} strokeWidth={1.5} style={{ color: "#888" }} />
            <code
              className="text-xs"
              style={{ color: "#000", fontFamily: "monospace" }}
              title={url}
            >
              {truncateUrl(url)}
            </code>
          </div>
        </td>

        <td className="px-3 py-3">
          <div className="flex flex-wrap gap-1">
            {events.length > 3 ? (
              <span
                className="inline-flex h-5 items-center border px-1.5 text-xs"
                style={{ borderColor: "#e0dbd5", borderRadius: "4px", color: "#888" }}
              >
                {events.length} events
              </span>
            ) : (
              events.map((event) => (
                <span
                  key={event}
                  className="inline-flex h-5 items-center border px-1.5 text-xs"
                  style={{ borderColor: "#e0dbd5", borderRadius: "4px", color: "#888" }}
                >
                  {event}
                </span>
              ))
            )}
          </div>
        </td>

        <td className="px-3 py-3">
          <button onClick={onToggleActive} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: isActive ? "#22c55e" : "#888" }}
            />
            <span className="text-xs capitalize" style={{ color: isActive ? "#000" : "#888" }}>
              {isActive ? "Active" : "Paused"}
            </span>
          </button>
        </td>

        <td className="px-3 py-3">
          <span className="text-xs" style={{ color: "#888" }}>
            {formatTimeAgo(lastTriggered)}
          </span>
        </td>

        <td className="px-3 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              className="inline-flex h-7 items-center gap-1 border px-2 text-xs font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: "#e0dbd5", borderRadius: "4px", color: "#888" }}
              title="Send test event"
            >
              <Play size={10} strokeWidth={1.5} />
              Test
            </button>
            <button
              className="inline-flex h-7 w-7 items-center justify-center border transition-colors hover:bg-gray-50"
              style={{ borderColor: "#e0dbd5", borderRadius: "4px", color: "#888" }}
              title="Delete"
              onClick={onDelete}
            >
              <MoreHorizontal size={14} strokeWidth={1.5} />
            </button>
          </div>
        </td>
      </tr>

      {isExpanded ? (
        <tr style={{ borderBottom: "1px solid #e0dbd5" }}>
          <td colSpan={6} className="px-0 py-0">
            <div
              className="mx-4 mb-4 mt-0 border p-4"
              style={{ borderColor: "#e0dbd5", borderRadius: "6px", backgroundColor: "#f8f8f8" }}
            >
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium" style={{ color: "#888" }}>URL:</span>
                  <code className="text-black">{url}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium" style={{ color: "#888" }}>Events:</span>
                  <span className="text-black">{events.join(", ")}</span>
                </div>
                {lastCode ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: "#888" }}>Last Response:</span>
                    <code
                      className="inline-flex h-5 items-center border px-1.5"
                      style={{
                        borderColor: "#e0dbd5",
                        borderRadius: "3px",
                        backgroundColor: "#fff",
                        color: lastCode >= 200 && lastCode < 300 ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {lastCode}
                    </code>
                  </div>
                ) : null}
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
