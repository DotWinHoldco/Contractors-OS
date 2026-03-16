"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useScheduleEvents(
  tenantId?: string,
  dateRange?: { start: string; end: string }
) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["schedule-events", tenantId, dateRange?.start, dateRange?.end],
    queryFn: async () => {
      let q = supabase.from("schedule_events").select("*");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      if (dateRange?.start) q = q.gte("start_time", dateRange.start);
      if (dateRange?.end) q = q.lte("end_time", dateRange.end);
      const { data, error } = await q.order("start_time", {
        ascending: true,
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useScheduleEvent(id: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["schedule-events", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedule_events")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateScheduleEvent() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("schedule_events")
        .insert(event as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedule-events"] });
      toast.success("Event created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateScheduleEvent() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("schedule_events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["schedule-events"] });
      qc.invalidateQueries({ queryKey: ["schedule-events", data.id] });
      toast.success("Event updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteScheduleEvent() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("schedule_events")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedule-events"] });
      toast.success("Event deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
