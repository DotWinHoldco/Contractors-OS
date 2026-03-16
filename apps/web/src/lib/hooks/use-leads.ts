"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useLeads(tenantId?: string, status?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["leads", tenantId, status],
    queryFn: async () => {
      let q = supabase
        .from("leads")
        .select("*, clients(id, first_name, last_name, email)");
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

export function useLead(id: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["leads", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*, clients(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateLead() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lead: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("leads")
        .insert(lead as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLead() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["leads", data.id] });
      toast.success("Lead updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLead() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
