"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppUser } from "@/lib/hooks/use-app-user";
import { toast } from "sonner";
import {
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  FileText,
  Calculator,
  Mail,
  MessageSquare,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const TYPE_ICONS: Record<string, React.ElementType> = {
  scope: FileText,
  estimate: Calculator,
  contract: FileText,
  email: Mail,
  chat: MessageSquare,
  lead_score: Target,
};

function getTypeIcon(type: string): React.ElementType {
  return TYPE_ICONS[type.toLowerCase()] ?? Sparkles;
}

export default function AIHistoryPage() {
  const { appUser } = useAppUser();
  const tenantId = appUser?.tenantId ?? undefined;
  const supabase = createClient();
  const qc = useQueryClient();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: generations, isLoading } = useQuery({
    queryKey: ["ai-generations", tenantId],
    queryFn: async () => {
      let q = supabase
        .from("ai_generations")
        .select("id, generation_type, model_key, provider, created_at, input_tokens, output_tokens, total_tokens, estimated_cost, feedback, prompt, output");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });

  const feedbackMutation = useMutation({
    mutationFn: async ({ id, feedback }: { id: string; feedback: string }) => {
      const { error } = await supabase
        .from("ai_generations")
        .update({ feedback } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-generations", tenantId] });
      toast.success("Feedback saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const genList = generations ?? [];

  // Unique types for filter
  const uniqueTypes = Array.from(new Set(genList.map((g) => (g.generation_type as string) ?? "chat")));
  const types = ["all", ...uniqueTypes];

  const filtered = typeFilter === "all"
    ? genList
    : genList.filter((g) => (g.generation_type as string) === typeFilter);

  const totalCost = genList.reduce((s, g) => s + ((g.estimated_cost as number | null) ?? 0), 0);
  const totalTokens = genList.reduce((s, g) => s + ((g.total_tokens as number | null) ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">AI Generation History</h1>
          {isLoading ? (
            <Skeleton className="mt-1 h-5 w-60" />
          ) : (
            <p className="mt-1 text-sm text-[#888]">
              {genList.length} generations &middot; {totalTokens.toLocaleString()} tokens &middot; ${totalCost.toFixed(4)} total cost
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              typeFilter === t
                ? "bg-black text-white"
                : "border border-[#e0dbd5] text-[#888] hover:text-black"
            }`}
          >
            {t === "all" ? "All" : t.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Sparkles strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
          <p className="mt-3 text-sm font-medium text-black">No generations yet</p>
          <p className="mt-1 text-sm text-[#888]">Start using the AI chat to see history here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#e0dbd5]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e0dbd5] bg-[#f8f8f8]">
                <th className="px-4 py-3 text-left font-medium text-[#888]">Type</th>
                <th className="hidden px-4 py-3 text-left font-medium text-[#888] md:table-cell">Model</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Date</th>
                <th className="hidden px-4 py-3 text-right font-medium text-[#888] sm:table-cell">Tokens</th>
                <th className="hidden px-4 py-3 text-right font-medium text-[#888] sm:table-cell">Cost</th>
                <th className="px-4 py-3 text-center font-medium text-[#888]">Feedback</th>
                <th className="px-4 py-3 text-center font-medium text-[#888]"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((gen) => {
                const genType = (gen.generation_type as string) ?? "chat";
                const TypeIcon = getTypeIcon(genType);
                const fb = gen.feedback as string | null;
                const tokens = (gen.total_tokens as number | null) ?? 0;
                const cost = (gen.estimated_cost as number | null) ?? 0;
                const dateStr = gen.created_at as string;
                const dateFormatted = dateStr
                  ? new Date(dateStr).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <React.Fragment key={gen.id as string}>
                    <tr className="border-b border-[#e0dbd5] hover:bg-[#f8f8f8]/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                          <span className="font-medium capitalize text-black">{genType.replace(/_/g, " ")}</span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <Badge variant="outline" className="border-[#e0dbd5] text-xs text-[#888]">
                          {(gen.model_key as string) ?? "unknown"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[#888]">{dateFormatted}</td>
                      <td className="hidden px-4 py-3 text-right text-[#888] sm:table-cell">
                        {tokens.toLocaleString()}
                      </td>
                      <td className="hidden px-4 py-3 text-right text-[#888] sm:table-cell">
                        ${cost.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {fb === "positive" ? (
                          <ThumbsUp className="mx-auto h-4 w-4 text-green-700" strokeWidth={1.5} />
                        ) : fb === "negative" ? (
                          <ThumbsDown className="mx-auto h-4 w-4 text-red-600" strokeWidth={1.5} />
                        ) : (
                          <span className="text-xs text-[#888]">&mdash;</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => setExpandedId(expandedId === (gen.id as string) ? null : (gen.id as string))}>
                          {expandedId === (gen.id as string) ? (
                            <ChevronUp className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedId === (gen.id as string) ? (
                      <tr className="border-b border-[#e0dbd5]">
                        <td colSpan={7} className="bg-[#f8f8f8] px-4 py-4">
                          <div className="space-y-3">
                            <div>
                              <span className="text-xs font-medium uppercase text-[#888]">Prompt</span>
                              <p className="mt-1 text-sm text-black">{gen.prompt as string}</p>
                            </div>
                            {(gen.output as string | null) ? (
                              <div>
                                <span className="text-xs font-medium uppercase text-[#888]">Output Preview</span>
                                <p className="mt-1 whitespace-pre-wrap text-sm text-[#888]">
                                  {String(gen.output).slice(0, 300)}...
                                </p>
                              </div>
                            ) : null}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#e0dbd5] text-xs"
                                onClick={() =>
                                  feedbackMutation.mutate({
                                    id: gen.id as string,
                                    feedback: "positive",
                                  })
                                }
                              >
                                <ThumbsUp className="mr-1 h-3 w-3" /> Helpful
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#e0dbd5] text-xs"
                                onClick={() =>
                                  feedbackMutation.mutate({
                                    id: gen.id as string,
                                    feedback: "negative",
                                  })
                                }
                              >
                                <ThumbsDown className="mr-1 h-3 w-3" /> Not Helpful
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
