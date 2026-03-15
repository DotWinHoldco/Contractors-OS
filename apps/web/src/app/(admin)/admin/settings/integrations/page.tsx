"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Link,
  RefreshCw,
  ExternalLink,
  Check,
  Settings,
  ArrowRightLeft,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  letter: string;
  color: string;
  connected: boolean;
  lastSync?: string;
  syncCount?: number;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    description: "Sync invoices, expenses, and financial data automatically.",
    letter: "Q",
    color: "#2CA01C",
    connected: true,
    lastSync: "2 min ago",
    syncCount: 1243,
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync appointments, deadlines, and team schedules.",
    letter: "G",
    color: "#4285F4",
    connected: true,
    lastSync: "5 min ago",
    syncCount: 876,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Process payments, manage subscriptions, and track revenue.",
    letter: "S",
    color: "#635BFF",
    connected: true,
    lastSync: "Just now",
    syncCount: 2104,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect to 5,000+ apps with automated workflows.",
    letter: "Z",
    color: "#FF4A00",
    connected: false,
  },
  {
    id: "google-business",
    name: "Google Business Profile",
    description: "Manage reviews, posts, and business information from one place.",
    letter: "G",
    color: "#34A853",
    connected: false,
  },
  {
    id: "companycam",
    name: "CompanyCam",
    description: "Capture, organize, and share project photos with your team.",
    letter: "C",
    color: "#00B4D8",
    connected: false,
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const connected = integrations.filter((i) => i.connected);
  const available = integrations.filter((i) => !i.connected);

  function handleToggleConnection(id: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              connected: !i.connected,
              lastSync: !i.connected ? "Just now" : undefined,
              syncCount: !i.connected ? 0 : undefined,
            }
          : i
      )
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black" style={{ fontFamily: "Outfit, sans-serif" }}>
          Integrations
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#888" }}>
          Connect your favorite tools to streamline your workflow.
        </p>
      </div>

      {/* Connected Section */}
      {connected.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: "#888" }}>
              Connected
            </h2>
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium text-white"
              style={{ backgroundColor: "#000" }}
            >
              {connected.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connected.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onToggle={handleToggleConnection}
              />
            ))}
          </div>
        </section>
      )}

      {/* Available Section */}
      {available.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: "#888" }}>
              Available
            </h2>
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium"
              style={{ backgroundColor: "#e0dbd5", color: "#000" }}
            >
              {available.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {available.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onToggle={handleToggleConnection}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function IntegrationCard({
  integration,
  onToggle,
}: {
  integration: Integration;
  onToggle: (id: string) => void;
}) {
  return (
    <div
      className="flex flex-col justify-between border p-4"
      style={{
        borderColor: "#e0dbd5",
        borderRadius: "8px",
        backgroundColor: integration.connected ? "#fff" : "#f8f8f8",
      }}
    >
      {/* Top Row: Logo + Status */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Logo placeholder */}
          <div
            className="flex h-10 w-10 items-center justify-center text-sm font-semibold text-white"
            style={{
              backgroundColor: integration.color,
              borderRadius: "8px",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {integration.letter}
          </div>
          <div>
            <h3
              className="text-sm font-medium text-black"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {integration.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor: integration.connected ? "#22c55e" : "#888",
                }}
              />
              <span className="text-xs" style={{ color: "#888" }}>
                {integration.connected ? "Connected" : "Not connected"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-xs leading-relaxed" style={{ color: "#888" }}>
        {integration.description}
      </p>

      {/* Sync Stats (connected only) */}
      {integration.connected && (
        <div
          className="mt-3 flex items-center gap-4 border-t pt-3 text-xs"
          style={{ borderColor: "#e0dbd5", color: "#888" }}
        >
          <div className="flex items-center gap-1">
            <RefreshCw size={12} strokeWidth={1.5} />
            <span>Last sync: {integration.lastSync}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowRightLeft size={12} strokeWidth={1.5} />
            <span>{integration.syncCount?.toLocaleString()} syncs</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        {integration.connected ? (
          <>
            <button
              onClick={() => onToggle(integration.id)}
              className="inline-flex h-8 items-center gap-1.5 border px-3 text-xs font-medium transition-colors hover:bg-gray-50"
              style={{
                borderColor: "#e0dbd5",
                borderRadius: "6px",
                color: "#888",
              }}
            >
              Disconnect
            </button>
            <button
              className="inline-flex h-8 items-center gap-1.5 border px-3 text-xs font-medium transition-colors hover:bg-gray-50"
              style={{
                borderColor: "#e0dbd5",
                borderRadius: "6px",
                color: "#888",
              }}
            >
              <Settings size={12} strokeWidth={1.5} />
              Settings
            </button>
            <button
              className="ml-auto inline-flex h-8 items-center gap-1 px-2 text-xs transition-colors hover:underline"
              style={{ color: "#888" }}
            >
              View Logs
              <ExternalLink size={10} strokeWidth={1.5} />
            </button>
          </>
        ) : (
          <button
            onClick={() => onToggle(integration.id)}
            className="inline-flex h-8 items-center gap-1.5 px-4 text-xs font-medium text-white transition-colors hover:opacity-90"
            style={{
              backgroundColor: "#000",
              borderRadius: "6px",
            }}
          >
            <Link size={12} strokeWidth={1.5} />
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
