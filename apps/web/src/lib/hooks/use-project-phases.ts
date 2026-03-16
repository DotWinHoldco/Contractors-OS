"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useProjectPhases(projectId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["project-phases", projectId],
    queryFn: async () => {
      let q = supabase.from("project_phases").select("*");
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q.order("phase_order", {
        ascending: true,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useProjectPhase(id: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["project-phases", "detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_phases")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProjectPhase() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      phase: Record<string, unknown> & {
        project_id: string;
        tenant_id: string;
      }
    ) => {
      const { data, error } = await supabase
        .from("project_phases")
        .insert(phase as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["project-phases", data.project_id],
      });
      toast.success("Phase created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProjectPhase() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("project_phases")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["project-phases", data.project_id],
      });
      toast.success("Phase updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdatePhaseStatus() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      const updates: Record<string, unknown> = { status };
      if (status === "completed") {
        updates.completed_at = new Date().toISOString();
      }
      const { data, error } = await supabase
        .from("project_phases")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["project-phases", data.project_id],
      });
      toast.success("Phase status updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteProjectPhase() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      projectId,
    }: {
      id: string;
      projectId: string;
    }) => {
      const { error } = await supabase
        .from("project_phases")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { projectId };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["project-phases", data.projectId],
      });
      toast.success("Phase deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
