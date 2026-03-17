"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useInvoices(tenantId?: string, status?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["invoices", tenantId, status],
    queryFn: async () => {
      let q = supabase
        .from("invoices")
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

export function useInvoice(id: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*, clients(*), projects(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (invoice: Record<string, unknown>) => {
      // Generate invoice_number via sequence RPC
      const tenantId = invoice.tenant_id as string;
      if (!tenantId) throw new Error("tenant_id is required to create an invoice");
      const { data: seqNum, error: seqError } = await supabase.rpc("next_sequence", {
        p_tenant_id: tenantId,
        p_sequence_name: "invoice",
      });
      if (seqError) throw seqError;
      const { data, error } = await supabase
        .from("invoices")
        .insert({ ...invoice, invoice_number: seqNum } as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateInvoice() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("invoices")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoices", data.id] });
      toast.success("Invoice updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteInvoice() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

// --- Invoice Line Items ---

export function useInvoiceLineItems(invoiceId: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["invoice-line-items", invoiceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoice_line_items")
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!invoiceId,
  });
}

export function useCreateInvoiceLineItem() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Record<string, unknown> & { invoice_id: string }) => {
      const { data, error } = await supabase
        .from("invoice_line_items")
        .insert(item as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["invoice-line-items", data.invoice_id],
      });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Line item added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateInvoiceLineItem() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("invoice_line_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["invoice-line-items", data.invoice_id],
      });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Line item updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteInvoiceLineItem() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      invoiceId,
    }: {
      id: string;
      invoiceId: string;
    }) => {
      const { error } = await supabase
        .from("invoice_line_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { invoiceId };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["invoice-line-items", data.invoiceId],
      });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Line item deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
