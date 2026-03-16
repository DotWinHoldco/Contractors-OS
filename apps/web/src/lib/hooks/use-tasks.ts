"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useTasks(projectId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      let q = supabase
        .from("project_tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useCreateTask() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (task: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("project_tasks")
        .insert(task as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateTask() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("project_tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteTask() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("project_tasks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useToggleTaskComplete() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      const updates: Record<string, unknown> = completed
        ? {
            status: "completed",
            client_completed_at: new Date().toISOString(),
          }
        : { status: "pending", client_completed_at: null };
      const { error } = await supabase
        .from("project_tasks")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
