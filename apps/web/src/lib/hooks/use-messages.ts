"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export function useThreads(userId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["threads", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("message_threads")
        .select("*, messages(id, body, created_at, sender_id, read_at)")
        .or(`participant_one.eq.${userId},participant_two.eq.${userId}`)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useMessages(threadId?: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["messages", threadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("thread_id", threadId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!threadId,
  });
}

export function useSendMessage() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (message: {
      thread_id: string;
      sender_id: string;
      body: string;
      sender_type?: string;
    }) => {
      const { data, error } = await supabase
        .from("messages")
        .insert(message as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["messages", data.thread_id] });
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useMarkThreadRead(threadId?: string, userId?: string) {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!threadId || !userId) return;
      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() } as never)
        .eq("thread_id", threadId)
        .neq("sender_id", userId)
        .is("read_at", null);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages", threadId] });
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreateThread() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (thread: {
      participant_one: string;
      participant_two: string;
      subject?: string;
    }) => {
      const { data, error } = await supabase
        .from("message_threads")
        .insert(thread as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      toast.success("Thread created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRealtimeMessages(
  threadId: string | undefined,
  callback: (payload: Record<string, unknown>) => void
) {
  const supabase = createClient();

  useEffect(() => {
    if (!threadId) return;

    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => callback(payload.new as Record<string, unknown>)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, callback, supabase]);
}
