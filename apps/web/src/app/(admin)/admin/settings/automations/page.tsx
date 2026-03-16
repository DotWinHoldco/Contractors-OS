"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppUser } from "@/lib/hooks/use-app-user";
import { toast } from "sonner";
import {
  Zap,
  Plus,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AutomationsPage() {
  const { appUser } = useAppUser();
  const tenantId = appUser?.tenantId ?? undefined;
  const supabase = createClient();
  const qc = useQueryClient();

  const { data: rules, isLoading } = useQuery({
    queryKey: ["automation-rules", tenantId],
    queryFn: async () => {
      let q = supabase
        .from("automation_rules")
        .select("id, name, trigger_event, action_type, is_active, run_count, last_run_at, description, created_at");
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
        .from("automation_rules")
        .update({ is_active } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automation-rules", tenantId] });
      toast.success("Automation updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("automation_rules")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automation-rules", tenantId] });
      toast.success("Automation deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const ruleList = rules ?? [];
  const activeCount = ruleList.filter((r) => (r.is_active as boolean | null) === true).length;
  const totalRuns = ruleList.reduce((s, r) => s + ((r.run_count as number | null) ?? 0), 0);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">Automations</h1>
          {isLoading ? (
            <Skeleton className="mt-1 h-5 w-48" />
          ) : (
            <p className="mt-1 text-sm text-[#888]">
              {activeCount} active rules &middot; {totalRuns} total runs
            </p>
          )}
        </div>
        <Button className="bg-black text-white hover:bg-black/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Automation
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : ruleList.length === 0 ? (
        <Card className="border-[#e0dbd5]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Zap strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
            <p className="mt-3 text-sm font-medium text-black">No automations yet</p>
            <p className="mt-1 text-sm text-[#888]">Create your first automation to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {ruleList.map((rule) => {
            const isActive = (rule.is_active as boolean | null) === true;
            const runCount = (rule.run_count as number | null) ?? 0;
            const lastRun = rule.last_run_at as string | null;
            const triggerEvent = (rule.trigger_event as string) ?? "";
            const actionType = (rule.action_type as string) ?? "";
            const description = (rule.description as string | null) ?? actionType;

            return (
              <Card
                key={rule.id as string}
                className={`border-[#e0dbd5] ${!isActive ? "opacity-60" : ""}`}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Toggle */}
                  <button
                    onClick={() =>
                      toggleMutation.mutate({
                        id: rule.id as string,
                        is_active: !isActive,
                      })
                    }
                    className="shrink-0 text-black"
                  >
                    {isActive ? (
                      <ToggleRight className="h-6 w-6" strokeWidth={1.5} />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-[#888]" strokeWidth={1.5} />
                    )}
                  </button>

                  {/* Trigger */}
                  <div className="flex items-center gap-2 rounded-lg border border-[#e0dbd5] bg-[#f8f8f8] px-3 py-2">
                    <Zap className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-black capitalize">
                      {triggerEvent.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#888]" strokeWidth={1.5} />

                  {/* Action */}
                  <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#e0dbd5] bg-[#f8f8f8] px-3 py-2">
                    <span className="text-sm text-black">{description}</span>
                  </div>

                  {/* Meta */}
                  <div className="hidden shrink-0 items-center gap-3 text-xs text-[#888] sm:flex">
                    <Badge variant="outline" className="border-[#e0dbd5] text-[#888]">
                      {runCount} runs
                    </Badge>
                    <span>{formatTimeAgo(lastRun)}</span>
                  </div>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 shrink-0 p-0 text-[#888] hover:text-red-600"
                    onClick={() => deleteMutation.mutate(rule.id as string)}
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
