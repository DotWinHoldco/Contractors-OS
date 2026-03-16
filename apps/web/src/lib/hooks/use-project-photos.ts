"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useProjectPhotos(projectId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["project-photos", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_photos")
        .select("*")
        .eq("project_id", projectId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useUploadPhoto() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      record,
    }: {
      file: File;
      record: {
        project_id: string;
        phase_id?: string;
        caption?: string;
      };
    }) => {
      const storagePath = `${record.project_id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("project-photos")
        .upload(storagePath, file);
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("project_photos")
        .insert({
          ...record,
          storage_path: storagePath,
        } as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["project-photos", data.project_id],
      });
      toast.success("Photo uploaded");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeletePhoto() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      storagePath,
      projectId,
    }: {
      id: string;
      storagePath: string;
      projectId: string;
    }) => {
      const { error: storageError } = await supabase.storage
        .from("project-photos")
        .remove([storagePath]);
      if (storageError) throw storageError;

      const { error } = await supabase
        .from("project_photos")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { projectId };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["project-photos", data.projectId],
      });
      toast.success("Photo deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdatePhotoCaption() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      caption,
    }: {
      id: string;
      caption: string;
    }) => {
      const { data, error } = await supabase
        .from("project_photos")
        .update({ caption })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["project-photos", data.project_id],
      });
      toast.success("Caption updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
