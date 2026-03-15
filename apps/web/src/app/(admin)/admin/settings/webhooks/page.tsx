"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Webhook,
  Plus,
  ChevronDown,
  ChevronRight,
  Play,
  Check,
  X,
  Copy,
  ExternalLink,
  Pause,
  MoreHorizontal,
} from "lucide-react";

const EVENT_TYPES = [
  "lead.created",
  "lead.converted",
  "project.created",
  "project.completed",
  "invoice.created",
  "invoice.paid",
  "payment.received",
  "estimate.approved",
] as const;

interface DeliveryLog {
  id: string;
  timestamp: string;
  status: "success" | "failed";
  responseCode: number;
  duration: string;
}

interface WebhookEntry {
  id: string;
  url: string;
  events: string[];
  status: "active" | "paused";
  successRate: number;
  lastTriggered: string;
  deliveries: DeliveryLog[];
}

const MOCK_WEBHOOKS: WebhookEntry[] = [
  {
    id: "wh_1",
    url: "https://hooks.zapier.com/hooks/catch/123456/abcdef/",
    events: ["project.created", "invoice.paid"],
    status: "active",
    successRate: 98,
    lastTriggered: "2 hours ago",
    deliveries: [
      { id: "d1", timestamp: "2026-03-15 14:32:01", status: "success", responseCode: 200, duration: "120ms" },
      { id: "d2", timestamp: "2026-03-15 13:15:44", status: "success", responseCode: 200, duration: "98ms" },
      { id: "d3", timestamp: "2026-03-15 10:02:18", status: "failed", responseCode: 500, duration: "2,340ms" },
      { id: "d4", timestamp: "2026-03-14 22:45:33", status: "success", responseCode: 200, duration: "145ms" },
      { id: "d5", timestamp: "2026-03-14 18:20:01", status: "success", responseCode: 200, duration: "110ms" },
    ],
  },
  {
    id: "wh_2",
    url: "https://api.example.com/webhooks",
    events: ["lead.created", "lead.converted"],
    status: "active",
    successRate: 100,
    lastTriggered: "1 day ago",
    deliveries: [
      { id: "d6", timestamp: "2026-03-14 09:12:45", status: "success", responseCode: 200, duration: "87ms" },
      { id: "d7", timestamp: "2026-03-13 16:33:12", status: "success", responseCode: 200, duration: "92ms" },
      { id: "d8", timestamp: "2026-03-13 11:05:28", status: "success", responseCode: 200, duration: "103ms" },
      { id: "d9", timestamp: "2026-03-12 14:48:55", status: "success", responseCode: 200, duration: "78ms" },
      { id: "d10", timestamp: "2026-03-12 08:22:10", status: "success", responseCode: 200, duration: "95ms" },
    ],
  },
  {
    id: "wh_3",
    url: "https://n8n.internal/webhook/contractor-sync",
    events: EVENT_TYPES.slice(),
    status: "paused",
    successRate: 85,
    lastTriggered: "3 days ago",
    deliveries: [
      { id: "d11", timestamp: "2026-03-12 17:55:30", status: "success", responseCode: 200, duration: "215ms" },
      { id: "d12", timestamp: "2026-03-12 15:40:02", status: "failed", responseCode: 502, duration: "5,001ms" },
      { id: "d13", timestamp: "2026-03-12 12:22:18", status: "success", responseCode: 200, duration: "178ms" },
      { id: "d14", timestamp: "2026-03-12 09:10:44", status: "failed", responseCode: 408, duration: "10,000ms" },
      { id: "d15", timestamp: "2026-03-11 21:33:55", status: "success", responseCode: 200, duration: "134ms" },
    ],
  },
];

export default function WebhooksPage() {
  const [webhooks] = useState(MOCK_WEBHOOKS);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  function toggleRow(id: string) {
    setExpandedRow((prev) => (prev === id ? null : id));
  }

  function truncateUrl(url: string, max = 45) {
    return url.length > max ? url.slice(0, max) + "..." : url;
  }

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

      {/* Event Types Reference */}
      <div
        className="border p-4"
        style={{ borderColor: "#e0dbd5", borderRadius: "8px", backgroundColor: "#f8f8f8" }}
      >
        <p className="mb-2 text-xs font-medium" style={{ color: "#888" }}>
          Available event types
        </p>
        <div className="flex flex-wrap gap-1.5">
          {EVENT_TYPES.map((event) => (
            <span
              key={event}
              className="inline-flex h-6 items-center border px-2 text-xs"
              style={{
                borderColor: "#e0dbd5",
                borderRadius: "4px",
                color: "#888",
                backgroundColor: "#fff",
              }}
            >
              {event}
            </span>
          ))}
        </div>
      </div>

      {/* Webhooks Table */}
      <div
        className="overflow-hidden border"
        style={{ borderColor: "#e0dbd5", borderRadius: "8px" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#f8f8f8", borderBottom: "1px solid #e0dbd5" }}>
              <th className="w-8 px-3 py-2.5 text-left" />
              <th
                className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#888" }}
              >
                Endpoint
              </th>
              <th
                className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#888" }}
              >
                Events
              </th>
              <th
                className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#888" }}
              >
                Status
              </th>
              <th
                className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#888" }}
              >
                Success Rate
              </th>
              <th
                className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#888" }}
              >
                Last Triggered
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "#888" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((webhook) => (
              <WebhookRow
                key={webhook.id}
                webhook={webhook}
                isExpanded={expandedRow === webhook.id}
                onToggle={() => toggleRow(webhook.id)}
                truncateUrl={truncateUrl}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WebhookRow({
  webhook,
  isExpanded,
  onToggle,
  truncateUrl,
}: {
  webhook: WebhookEntry;
  isExpanded: boolean;
  onToggle: () => void;
  truncateUrl: (url: string, max?: number) => string;
}) {
  return (
    <>
      {/* Main Row */}
      <tr
        className="transition-colors hover:bg-gray-50/50"
        style={{ borderBottom: isExpanded ? "none" : "1px solid #e0dbd5" }}
      >
        {/* Expand Toggle */}
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

        {/* URL */}
        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            <Webhook size={14} strokeWidth={1.5} style={{ color: "#888" }} />
            <code
              className="text-xs"
              style={{ color: "#000", fontFamily: "monospace" }}
              title={webhook.url}
            >
              {truncateUrl(webhook.url)}
            </code>
          </div>
        </td>

        {/* Events */}
        <td className="px-3 py-3">
          <div className="flex flex-wrap gap-1">
            {webhook.events.length === EVENT_TYPES.length ? (
              <span
                className="inline-flex h-5 items-center border px-1.5 text-xs"
                style={{
                  borderColor: "#e0dbd5",
                  borderRadius: "4px",
                  color: "#888",
                }}
              >
                All events
              </span>
            ) : (
              webhook.events.map((event) => (
                <span
                  key={event}
                  className="inline-flex h-5 items-center border px-1.5 text-xs"
                  style={{
                    borderColor: "#e0dbd5",
                    borderRadius: "4px",
                    color: "#888",
                  }}
                >
                  {event}
                </span>
              ))
            )}
          </div>
        </td>

        {/* Status */}
        <td className="px-3 py-3">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: webhook.status === "active" ? "#22c55e" : "#888",
              }}
            />
            <span className="text-xs capitalize" style={{ color: webhook.status === "active" ? "#000" : "#888" }}>
              {webhook.status === "active" ? "Active" : "Paused"}
            </span>
          </div>
        </td>

        {/* Success Rate */}
        <td className="px-3 py-3">
          <span
            className="text-xs font-medium"
            style={{
              color:
                webhook.successRate >= 95
                  ? "#22c55e"
                  : webhook.successRate >= 90
                    ? "#888"
                    : "#ef4444",
            }}
          >
            {webhook.successRate}%
          </span>
        </td>

        {/* Last Triggered */}
        <td className="px-3 py-3">
          <span className="text-xs" style={{ color: "#888" }}>
            {webhook.lastTriggered}
          </span>
        </td>

        {/* Actions */}
        <td className="px-3 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              className="inline-flex h-7 items-center gap-1 border px-2 text-xs font-medium transition-colors hover:bg-gray-50"
              style={{
                borderColor: "#e0dbd5",
                borderRadius: "4px",
                color: "#888",
              }}
              title="Send test event"
            >
              <Play size={10} strokeWidth={1.5} />
              Test
            </button>
            <button
              className="inline-flex h-7 w-7 items-center justify-center border transition-colors hover:bg-gray-50"
              style={{
                borderColor: "#e0dbd5",
                borderRadius: "4px",
                color: "#888",
              }}
              title="More options"
            >
              <MoreHorizontal size={14} strokeWidth={1.5} />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Delivery Log */}
      {isExpanded && (
        <tr style={{ borderBottom: "1px solid #e0dbd5" }}>
          <td colSpan={7} className="px-0 py-0">
            <div
              className="mx-4 mb-4 mt-0 border"
              style={{
                borderColor: "#e0dbd5",
                borderRadius: "6px",
                backgroundColor: "#f8f8f8",
              }}
            >
              <div
                className="flex items-center justify-between border-b px-4 py-2"
                style={{ borderColor: "#e0dbd5" }}
              >
                <span
                  className="text-xs font-medium"
                  style={{ color: "#888" }}
                >
                  Recent Deliveries
                </span>
                <button
                  className="text-xs transition-colors hover:underline"
                  style={{ color: "#888" }}
                >
                  View all
                  <ExternalLink
                    size={10}
                    strokeWidth={1.5}
                    className="ml-1 inline"
                  />
                </button>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid #e0dbd5" }}>
                    <th
                      className="px-4 py-2 text-left font-medium"
                      style={{ color: "#888" }}
                    >
                      Timestamp
                    </th>
                    <th
                      className="px-4 py-2 text-left font-medium"
                      style={{ color: "#888" }}
                    >
                      Status
                    </th>
                    <th
                      className="px-4 py-2 text-left font-medium"
                      style={{ color: "#888" }}
                    >
                      Response Code
                    </th>
                    <th
                      className="px-4 py-2 text-left font-medium"
                      style={{ color: "#888" }}
                    >
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {webhook.deliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      style={{ borderBottom: "1px solid #e0dbd5" }}
                      className="last:border-0"
                    >
                      <td
                        className="px-4 py-2 font-mono"
                        style={{ color: "#000" }}
                      >
                        {delivery.timestamp}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1.5">
                          {delivery.status === "success" ? (
                            <Check
                              size={12}
                              strokeWidth={1.5}
                              style={{ color: "#22c55e" }}
                            />
                          ) : (
                            <X
                              size={12}
                              strokeWidth={1.5}
                              style={{ color: "#ef4444" }}
                            />
                          )}
                          <span
                            style={{
                              color:
                                delivery.status === "success"
                                  ? "#22c55e"
                                  : "#ef4444",
                            }}
                          >
                            {delivery.status === "success"
                              ? "Success"
                              : "Failed"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <code
                          className="inline-flex h-5 items-center border px-1.5"
                          style={{
                            borderColor: "#e0dbd5",
                            borderRadius: "3px",
                            backgroundColor: "#fff",
                            color:
                              delivery.responseCode >= 200 &&
                              delivery.responseCode < 300
                                ? "#22c55e"
                                : "#ef4444",
                          }}
                        >
                          {delivery.responseCode}
                        </code>
                      </td>
                      <td
                        className="px-4 py-2"
                        style={{ color: "#888" }}
                      >
                        {delivery.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
