"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useEstimates(tenantId?: string, status?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["estimates", tenantId, status],
    queryFn: async () => {
      let q = supabase
        .from("estimates")
        .select(
          "*, clients(id, first_name, last_name, email), projects(id, name)"
        );
      if (tenantId) q = q.eq("tenant_id", tenantId);
      if (status) q = q.eq("status", status as never);
      const { data, error } = await q.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useEstimate(id: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["estimates", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("estimates")
        .select("*, clients(*), projects(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateEstimate() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (estimate: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("estimates")
        .insert(estimate as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["estimates"] });
      toast.success("Estimate created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateEstimate() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("estimates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["estimates"] });
      qc.invalidateQueries({ queryKey: ["estimates", data.id] });
      toast.success("Estimate updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteEstimate() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("estimates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["estimates"] });
      toast.success("Estimate deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

// --- Estimate Line Items ---

export function useEstimateLineItems(estimateId: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["estimate-line-items", estimateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("estimate_line_items")
        .select("*")
        .eq("estimate_id", estimateId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!estimateId,
  });
}

export function useCreateEstimateLineItem() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      item: Record<string, unknown> & { estimate_id: string }
    ) => {
      const { data, error } = await supabase
        .from("estimate_line_items")
        .insert(item as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["estimate-line-items", data.estimate_id],
      });
      qc.invalidateQueries({ queryKey: ["estimates"] });
      toast.success("Line item added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateEstimateLineItem() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("estimate_line_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["estimate-line-items", data.estimate_id],
      });
      qc.invalidateQueries({ queryKey: ["estimates"] });
      toast.success("Line item updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteEstimateLineItem() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      estimateId,
    }: {
      id: string;
      estimateId: string;
    }) => {
      const { error } = await supabase
        .from("estimate_line_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { estimateId };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["estimate-line-items", data.estimateId],
      });
      qc.invalidateQueries({ queryKey: ["estimates"] });
      toast.success("Line item deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
