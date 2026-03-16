"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useDailyLogs(projectId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["daily-logs", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("project_id", projectId!)
        .order("log_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useCreateDailyLog() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (log: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("daily_logs")
        .insert(log as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["daily-logs"] });
      toast.success("Daily log created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateDailyLog() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("daily_logs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["daily-logs"] });
      toast.success("Daily log updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteDailyLog() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("daily_logs")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["daily-logs"] });
      toast.success("Daily log deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
