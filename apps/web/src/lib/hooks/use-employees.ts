"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// ─── Employees ───────────────────────────────────────────────────────

export function useEmployees(tenantId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["employees", tenantId],
    queryFn: async () => {
      let q = supabase.from("employees").select("*");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateEmployee() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (employee: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("employees")
        .insert(employee as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateEmployee() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("employees")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteEmployee() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Subcontractors ──────────────────────────────────────────────────

export function useSubcontractors(tenantId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["subcontractors", tenantId],
    queryFn: async () => {
      let q = supabase.from("subcontractors").select("*");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateSubcontractor() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sub: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("subcontractors")
        .insert(sub as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subcontractors"] });
      toast.success("Subcontractor created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateSubcontractor() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("subcontractors")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subcontractors"] });
      toast.success("Subcontractor updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteSubcontractor() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("subcontractors")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subcontractors"] });
      toast.success("Subcontractor deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Vendors ─────────────────────────────────────────────────────────

export function useVendors(tenantId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["vendors", tenantId],
    queryFn: async () => {
      let q = supabase.from("vendors").select("*");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateVendor() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vendor: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("vendors")
        .insert(vendor as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateVendor() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("vendors")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteVendor() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vendors")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
