"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Save,
  Send,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useEstimate,
  useUpdateEstimate,
  useEstimateLineItems,
  useCreateEstimateLineItem,
  useUpdateEstimateLineItem,
  useDeleteEstimateLineItem,
} from "@/lib/hooks/use-estimates";

const TAX_RATE = 0.07;

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function EstimateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: estimate, isLoading: estimateLoading } = useEstimate(id);
  const { data: lineItems, isLoading: itemsLoading } = useEstimateLineItems(id);
  const updateEstimate = useUpdateEstimate();
  const createLineItem = useCreateEstimateLineItem();
  const updateLineItem = useUpdateEstimateLineItem();
  const deleteLineItem = useDeleteEstimateLineItem();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["default"]));
  const [aiLoading, setAiLoading] = useState(false);

  const est = estimate as Record<string, unknown> | null;
  const items = ((lineItems ?? []) as Record<string, unknown>[]);

  const estimateNumber = est
    ? (est.estimate_number as string) ?? (est.number as string) ?? String(est.id)
    : "";
  const status = est ? (est.status as string) ?? "draft" : "draft";
  const clientObj = est ? (est.clients as Record<string, unknown> | null) : null;
  const clientName = clientObj
    ? `${String(clientObj.first_name ?? "")} ${String(clientObj.last_name ?? "")}`.trim()
    : "";
  const projectObj = est ? (est.projects as Record<string, unknown> | null) : null;
  const projectName = projectObj ? String(projectObj.name ?? "") : "";

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Group line items by section/category
  const grouped = items.reduce<Record<string, Record<string, unknown>[]>>((acc, item) => {
    const section = (item.section as string) ?? (item.category as string) ?? "default";
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  // If no grouping exists, use a single "Line Items" section
  const sections = Object.keys(grouped).length > 0 ? grouped : { "Line Items": items };

  const getItemTotal = (item: Record<string, unknown>) => {
    const qty = (item.quantity as number) ?? (item.qty as number) ?? 0;
    const cost = (item.unit_cost as number) ?? (item.unit_price as number) ?? 0;
    return qty * cost;
  };

  const sectionTotal = (sectionItems: Record<string, unknown>[]) =>
    sectionItems.reduce((sum, item) => sum + getItemTotal(item), 0);

  const subtotal = items.reduce((sum, item) => sum + getItemTotal(item), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handleUpdateItem = useCallback(
    (itemId: string, field: string, value: string | number) => {
      updateLineItem.mutate({ id: itemId, [field]: value });
    },
    [updateLineItem]
  );

  const handleAddItem = useCallback(
    (section?: string) => {
      createLineItem.mutate({
        estimate_id: id,
        description: "",
        quantity: 1,
        unit: "ea",
        unit_cost: 0,
        ...(section && section !== "default" && section !== "Line Items"
          ? { section }
          : {}),
      });
    },
    [createLineItem, id]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      deleteLineItem.mutate({ id: itemId, estimateId: id });
    },
    [deleteLineItem, id]
  );

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      updateEstimate.mutate({ id, status: newStatus });
    },
    [updateEstimate, id]
  );

  const handleGenerateAI = () => {
    setAiLoading(true);
    setTimeout(() => setAiLoading(false), 2000);
  };

  if (estimateLoading || itemsLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="mb-3 h-4 w-32" />
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!est) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-[#888]">Estimate not found.</p>
        <Link href="/admin/estimates" className="mt-2 inline-block text-sm text-black underline">
          Back to Estimates
        </Link>
      </div>
    );
  }

  const nextStatusMap: Record<string, string | null> = {
    draft: "sent",
    sent: "accepted",
    accepted: null,
    declined: null,
  };
  const nextStatus = nextStatusMap[status] ?? null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/estimates"
          className="mb-3 inline-flex items-center gap-1 text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Back to Estimates
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-black">{estimateNumber}</h1>
              <Badge className={`text-[10px] capitalize ${statusColors[status] ?? "bg-gray-100 text-gray-700"}`}>
                {status}
              </Badge>
            </div>
            <p className="text-sm text-[#888]">
              {clientName ? clientName : "\u2014"}
              {projectName ? <> &mdash; {projectName}</> : null}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#e0dbd5] text-xs"
              onClick={handleGenerateAI}
              disabled={aiLoading}
            >
              <Sparkles className="mr-1 h-3 w-3" strokeWidth={1.5} />
              {aiLoading ? "AI generating scope..." : "Generate with AI"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#e0dbd5] text-xs"
              onClick={() => handleStatusChange("draft")}
              disabled={status === "draft"}
            >
              <Save className="mr-1 h-3 w-3" strokeWidth={1.5} />
              Save Draft
            </Button>
            {nextStatus ? (
              <Button
                size="sm"
                className="bg-black text-xs text-white hover:bg-black/90"
                onClick={() => handleStatusChange(nextStatus)}
              >
                <Send className="mr-1 h-3 w-3" strokeWidth={1.5} />
                {nextStatus === "sent" ? "Send to Client" : `Mark ${nextStatus}`}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {Object.entries(sections).map(([sectionName, sectionItems]) => {
          const isExpanded = expandedSections.has(sectionName);
          return (
            <Card key={sectionName} className="border border-[#e0dbd5] shadow-none">
              <CardHeader
                className="cursor-pointer select-none px-4 py-3"
                onClick={() => toggleSection(sectionName)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                    )}
                    <h3 className="text-sm font-semibold capitalize text-black">{sectionName}</h3>
                    <span className="text-xs text-[#888]">
                      ({sectionItems.length} item{sectionItems.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-black">
                    {formatCurrency(sectionTotal(sectionItems))}
                  </span>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#e0dbd5] text-left">
                          <th className="pb-2 pr-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                            Item
                          </th>
                          <th className="pb-2 pr-3 text-xs font-bold uppercase tracking-widest text-[#888] w-20">
                            Qty
                          </th>
                          <th className="pb-2 pr-3 text-xs font-bold uppercase tracking-widest text-[#888] w-20">
                            Unit
                          </th>
                          <th className="pb-2 pr-3 text-xs font-bold uppercase tracking-widest text-[#888] w-28">
                            Unit Cost
                          </th>
                          <th className="pb-2 text-xs font-bold uppercase tracking-widest text-[#888] w-28 text-right">
                            Total
                          </th>
                          <th className="pb-2 w-10" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e0dbd5]">
                        {sectionItems.map((item) => {
                          const itemId = String(item.id);
                          const name = (item.description as string) ?? (item.name as string) ?? "";
                          const qty = (item.quantity as number) ?? (item.qty as number) ?? 0;
                          const unit = (item.unit as string) ?? "ea";
                          const unitCost = (item.unit_cost as number) ?? (item.unit_price as number) ?? 0;

                          return (
                            <tr key={itemId} className="group">
                              <td className="py-2 pr-3">
                                <Input
                                  defaultValue={name}
                                  onBlur={(e) =>
                                    handleUpdateItem(itemId, "description", e.target.value)
                                  }
                                  className="h-8 text-sm"
                                  placeholder="Item name"
                                />
                              </td>
                              <td className="py-2 pr-3">
                                <Input
                                  type="number"
                                  defaultValue={qty}
                                  onBlur={(e) =>
                                    handleUpdateItem(itemId, "quantity", Number(e.target.value))
                                  }
                                  className="h-8 text-sm w-20"
                                  min={0}
                                />
                              </td>
                              <td className="py-2 pr-3">
                                <Input
                                  defaultValue={unit}
                                  onBlur={(e) =>
                                    handleUpdateItem(itemId, "unit", e.target.value)
                                  }
                                  className="h-8 text-sm w-20"
                                />
                              </td>
                              <td className="py-2 pr-3">
                                <Input
                                  type="number"
                                  defaultValue={unitCost}
                                  onBlur={(e) =>
                                    handleUpdateItem(itemId, "unit_cost", Number(e.target.value))
                                  }
                                  className="h-8 text-sm w-28"
                                  min={0}
                                  step={0.01}
                                />
                              </td>
                              <td className="py-2 text-right text-sm font-semibold text-black">
                                {formatCurrency(qty * unitCost)}
                              </td>
                              <td className="py-2 text-center">
                                <button
                                  onClick={() => handleRemoveItem(itemId)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-red-400 hover:text-red-600" strokeWidth={1.5} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={() => handleAddItem(sectionName)}
                    className="mt-2 flex items-center gap-1 text-xs text-[#888] hover:text-black"
                  >
                    <Plus className="h-3 w-3" strokeWidth={1.5} />
                    Add line item
                  </button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty state for no line items */}
      {items.length === 0 && (
        <Card className="mt-4 border border-[#e0dbd5] shadow-none">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-[#888]">No line items yet. Add your first line item.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-[#e0dbd5] text-xs"
              onClick={() => handleAddItem()}
            >
              <Plus className="mr-1 h-3 w-3" strokeWidth={1.5} />
              Add line item
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Totals */}
      <Card className="mt-4 border border-[#e0dbd5] shadow-none">
        <CardContent className="p-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#888]">Subtotal</span>
                <span className="font-semibold text-black">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#888]">Tax (7%)</span>
                <span className="font-semibold text-black">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-[#e0dbd5] pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-black">Total</span>
                  <span className="text-lg font-bold text-black">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
