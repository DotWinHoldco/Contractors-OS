"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useClients(tenantId?: string, search?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["clients", tenantId, search],
    queryFn: async () => {
      let q = supabase.from("clients").select("*");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      if (search) {
        q = q.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
        );
      }
      const { data, error } = await q.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useClient(id: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["clients", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (client: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("clients")
        .insert(client as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateClient() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["clients", data.id] });
      toast.success("Client updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteClient() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
