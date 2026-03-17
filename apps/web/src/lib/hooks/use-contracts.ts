"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useContracts(tenantId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["contracts", tenantId],
    queryFn: async () => {
      let q = supabase
        .from("contracts")
        .select("*, clients(*), projects!contracts_project_id_fkey(id, name)");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useContract(id?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["contracts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("*, clients(*), projects!contracts_project_id_fkey(id, name)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateContract() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (contract: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("contracts")
        .insert(contract as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Contract created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateContract() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("contracts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["contracts", data.id] });
      toast.success("Contract updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteContract() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contracts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Contract deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Change Orders ───────────────────────────────────────────────────

export function useChangeOrders(contractId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["change-orders", contractId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("change_orders")
        .select("*")
        .eq("contract_id", contractId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!contractId,
  });
}

export function useCreateChangeOrder() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (changeOrder: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("change_orders")
        .insert(changeOrder as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["change-orders", data.contract_id],
      });
      toast.success("Change order created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateChangeOrder() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("change_orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["change-orders", data.contract_id],
      });
      toast.success("Change order updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
