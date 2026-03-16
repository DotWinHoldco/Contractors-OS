"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export function useNotifications(userId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId!)
        .is("read_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useUnreadCount(userId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["notifications", "unread-count", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .is("read_at", null);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!userId,
  });
}

export function useMarkRead() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useMarkAllRead(userId?: string) {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!userId) return;
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() } as never)
        .eq("user_id", userId)
        .is("read_at", null);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRealtimeNotifications(
  userId: string | undefined,
  callback: (payload: Record<string, unknown>) => void
) {
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callback(payload.new as Record<string, unknown>)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, callback, supabase]);
}
