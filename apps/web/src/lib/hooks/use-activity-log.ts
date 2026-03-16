"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useActivityLog(projectId?: string, limit = 20) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["activity-log", projectId, limit],
    queryFn: async () => {
      let q = supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useLogActivity() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: Record<string, unknown>) => {
      const { error } = await supabase.from("activity_log").insert(entry as never);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activity-log"] });
    },
  });
}
