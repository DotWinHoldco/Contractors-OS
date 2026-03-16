"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  FileText,
  Eye,
  PenLine,
  Clock,
  Sparkles,
  Send,
  Download,
  Save,
} from "lucide-react";
import { useContract, useUpdateContract } from "@/lib/hooks/use-contracts";

type Tab = "editor" | "preview" | "activity";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  signed: "bg-amber-100 text-amber-700",
  executed: "bg-emerald-100 text-emerald-700",
};

function formatCurrency(value: number | null): string {
  if (value == null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "\u2014";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: contract, isLoading } = useContract(id);
  const updateContract = useUpdateContract();

  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [localContent, setLocalContent] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const c = contract as Record<string, unknown> | null;

  const contractNumber = c
    ? (c.contract_number as string) ?? (c.number as string) ?? String(c.id)
    : "";
  const status = c ? (c.status as string) ?? "draft" : "draft";
  const clientObj = c ? (c.clients as Record<string, unknown> | null) : null;
  const clientName = clientObj
    ? `${String(clientObj.first_name ?? "")} ${String(clientObj.last_name ?? "")}`.trim()
    : "";
  const clientId = clientObj ? String(clientObj.id ?? "") : "";
  const projectObj = c ? (c.projects as Record<string, unknown> | null) : null;
  const projectName = projectObj ? String(projectObj.name ?? "") : "";
  const projectId = projectObj ? String(projectObj.id ?? "") : "";
  const contractType = c ? (c.contract_type as string) ?? (c.type as string) ?? "" : "";
  const totalAmount = c ? (c.total_amount as number | null) ?? (c.amount as number | null) : null;
  const content = localContent ?? (c ? (c.content as string) ?? (c.body as string) ?? "" : "");

  const handleContentChange = useCallback((val: string) => {
    setLocalContent(val);
    setDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    if (localContent != null) {
      updateContract.mutate({ id, content: localContent });
      setDirty(false);
    }
  }, [updateContract, id, localContent]);

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      updateContract.mutate({ id, status: newStatus });
    },
    [updateContract, id]
  );

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "editor", label: "Editor", icon: <PenLine className="h-3.5 w-3.5" strokeWidth={1.5} /> },
    { key: "preview", label: "Preview", icon: <Eye className="h-3.5 w-3.5" strokeWidth={1.5} /> },
    { key: "activity", label: "Activity", icon: <Clock className="h-3.5 w-3.5" strokeWidth={1.5} /> },
  ];

  const nextStatusMap: Record<string, string | null> = {
    draft: "sent",
    sent: "signed",
    signed: "executed",
    executed: null,
  };
  const nextStatus = nextStatusMap[status] ?? null;

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="mb-3 h-4 w-32" />
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <Skeleton className="h-[500px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!c) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-[#888]">Contract not found.</p>
        <Link href="/admin/contracts" className="mt-2 inline-block text-sm text-black underline">
          Back to Contracts
        </Link>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-black">{contractNumber}</h1>
              <Badge className={`text-[10px] capitalize ${statusColors[status] ?? "bg-gray-100 text-gray-700"}`}>
                {status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-[#888]">
              {clientName ? (
                <>
                  Client:{" "}
                  {clientId ? (
                    <Link href={`/admin/clients/${clientId}`} className="text-black hover:underline">
                      {clientName}
                    </Link>
                  ) : (
                    <span className="text-black">{clientName}</span>
                  )}
                </>
              ) : null}
              {clientName && projectName ? " | " : null}
              {projectName ? (
                <>
                  Project:{" "}
                  {projectId ? (
                    <Link href={`/admin/projects/${projectId}`} className="text-black hover:underline">
                      {projectName}
                    </Link>
                  ) : (
                    <span className="text-black">{projectName}</span>
                  )}
                </>
              ) : null}
            </p>
          </div>
          <div className="flex gap-2">
            {dirty ? (
              <Button
                variant="outline"
                size="sm"
                className="border-[#e0dbd5] text-xs text-[#555]"
                onClick={handleSave}
                disabled={updateContract.isPending}
              >
                <Save className="mr-1 h-3 w-3" strokeWidth={1.5} />
                Save
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              className="border-[#e0dbd5] text-xs text-[#555]"
            >
              <Download className="mr-1 h-3 w-3" strokeWidth={1.5} />
              Download PDF
            </Button>
            {nextStatus ? (
              <Button
                size="sm"
                className="bg-black text-xs text-white hover:bg-black/90"
                onClick={() => handleStatusChange(nextStatus)}
                disabled={updateContract.isPending}
              >
                <Send className="mr-1 h-3 w-3" strokeWidth={1.5} />
                {nextStatus === "sent"
                  ? "Send to Client"
                  : nextStatus === "signed"
                    ? "Mark Signed"
                    : "Mark Executed"}
              </Button>
            ) : null}
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
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[500px] resize-y border-[#e0dbd5] font-mono text-sm leading-relaxed text-black"
              />
            </Card>
          )}

          {/* Preview Tab */}
          {activeTab === "preview" && (
            <Card className="border border-[#e0dbd5] shadow-none p-6">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap font-mono text-sm leading-relaxed text-black">
                {content || "No content yet."}
              </div>
            </Card>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <Card className="border border-[#e0dbd5] shadow-none p-5">
              <div className="space-y-0">
                <div className="relative flex gap-4 pb-6">
                  <div className="relative z-10 mt-1.5 h-[15px] w-[15px] flex-shrink-0 rounded-full border-2 border-[#e0dbd5] bg-white" />
                  <div className="flex-1">
                    <p className="text-sm text-black">Contract created</p>
                    <p className="mt-0.5 text-xs text-[#888]">
                      {formatDate(c.created_at as string | null)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Side Panel -- Contract Metadata */}
        <div className="space-y-4">
          <Card className="border border-[#e0dbd5] shadow-none p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#888]">
              Contract Details
            </h3>
            <div className="space-y-3">
              {contractType ? (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Type</p>
                  <p className="text-sm capitalize text-black">{contractType}</p>
                </div>
              ) : null}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Contract Amount</p>
                <p className="text-sm font-semibold text-black">{formatCurrency(totalAmount)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Created Date</p>
                <p className="text-sm text-black">{formatDate(c.created_at as string | null)}</p>
              </div>
              {c.start_date ? (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Start Date</p>
                  <p className="text-sm text-black">{formatDate(c.start_date as string)}</p>
                </div>
              ) : null}
              {c.end_date ? (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">End Date</p>
                  <p className="text-sm text-black">{formatDate(c.end_date as string)}</p>
                </div>
              ) : null}
              {c.retainage_percent ? (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#888]">Retainage</p>
                  <p className="text-sm text-black">{String(c.retainage_percent)}%</p>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
