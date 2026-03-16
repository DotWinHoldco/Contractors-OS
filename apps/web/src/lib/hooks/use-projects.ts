"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useProjects(tenantId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["projects", tenantId],
    queryFn: async () => {
      let q = supabase
        .from("projects")
        .select("*, clients(id, first_name, last_name, email)");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useProject(id: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, clients(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (project: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("projects")
        .insert(project as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProject() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["projects", data.id] });
      toast.success("Project updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteProject() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
