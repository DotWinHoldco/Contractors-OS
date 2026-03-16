"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useDocuments(projectId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["documents", projectId],
    queryFn: async () => {
      let q = supabase.from("documents").select("*");
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadDocument() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      record,
    }: {
      file: File;
      record: Record<string, unknown>;
    }) => {
      const storagePath = `${record.tenant_id || "default"}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file);
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("documents")
        .insert({
          ...record,
          storage_path: storagePath,
          file_size: file.size,
          mime_type: file.type,
        } as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document uploaded");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDownloadDocument() {
  const supabase = createClient();
  return useMutation({
    mutationFn: async (storagePath: string) => {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(storagePath, 3600);
      if (error) throw error;
      return data.signedUrl;
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteDocument() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      storagePath,
    }: {
      id: string;
      storagePath: string;
    }) => {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([storagePath]);
      if (storageError) throw storageError;

      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
