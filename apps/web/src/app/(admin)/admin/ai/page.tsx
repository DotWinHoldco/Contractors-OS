"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { callEdgeFunction } from "@/lib/supabase/edge";
import { useAppUser } from "@/lib/hooks/use-app-user";
import { toast } from "sonner";
import {
  Send,
  User,
  Plus,
  Sparkles,
  FolderKanban,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function AIChatPage() {
  const { appUser } = useAppUser();
  const tenantId = appUser?.tenantId ?? undefined;
  const userId = appUser?.id ?? undefined;
  const supabase = createClient();
  const qc = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Fetch sessions (ai_generations grouped by recent prompts — we treat each generation as a "conversation")
  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ["ai-sessions", tenantId],
    queryFn: async () => {
      let q = supabase
        .from("ai_generations")
        .select("id, prompt, output, generation_type, created_at, model_key, module");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });

  const sessionList = sessions ?? [];

  // Find the selected generation's details
  const selectedGeneration = selectedSessionId
    ? sessionList.find((s) => (s.id as string) === selectedSessionId)
    : null;

  // Build messages from selected generation
  const messages: AiMessage[] = selectedGeneration
    ? [
        {
          id: `${selectedGeneration.id}-prompt`,
          role: "user" as const,
          content: selectedGeneration.prompt as string,
          created_at: selectedGeneration.created_at as string,
        },
        ...(selectedGeneration.output
          ? [
              {
                id: `${selectedGeneration.id}-output`,
                role: "assistant" as const,
                content: selectedGeneration.output as string,
                created_at: selectedGeneration.created_at as string,
              },
            ]
          : []),
      ]
    : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, selectedSessionId]);

  // Send new message via edge function
  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      const result = await callEdgeFunction<Record<string, unknown>>("ai-chat", {
        message,
        tenant_id: tenantId,
        user_id: userId,
      });
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-sessions", tenantId] });
      setInputValue("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate(trimmed);
  }, [inputValue, sendMutation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar — Conversations */}
      <div className="hidden w-72 shrink-0 flex-col border-r border-[#e0dbd5] pr-4 lg:flex">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">Conversations</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedSessionId(null)}
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {loadingSessions ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="mb-2 h-16 w-full rounded-lg" />
            ))
          ) : sessionList.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-[#888]">
              No conversations yet. Start a new one below.
            </p>
          ) : (
            sessionList.map((session) => {
              const prompt = session.prompt as string;
              const title = prompt.length > 40 ? prompt.slice(0, 40) + "..." : prompt;
              const preview = session.output
                ? String(session.output).slice(0, 60) + "..."
                : "Generating...";
              const isSelected = selectedSessionId === (session.id as string);
              return (
                <button
                  key={session.id as string}
                  onClick={() => setSelectedSessionId(session.id as string)}
                  className={`w-full rounded-lg px-3 py-3 text-left transition-colors ${
                    isSelected ? "bg-black text-white" : "hover:bg-[#f8f8f8]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-white" : "text-black"
                      }`}
                    >
                      {title}
                    </span>
                    <span
                      className={`text-xs ${
                        isSelected ? "text-white/60" : "text-[#888]"
                      }`}
                    >
                      {formatTime(session.created_at as string)}
                    </span>
                  </div>
                  <p
                    className={`mt-1 truncate text-xs ${
                      isSelected ? "text-white/70" : "text-[#888]"
                    }`}
                  >
                    {preview}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Context Bar */}
        {selectedGeneration ? (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#e0dbd5] bg-[#f8f8f8] px-3 py-2">
            <FolderKanban className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
            <span className="text-xs font-medium text-[#888]">
              {(selectedGeneration.generation_type as string) ?? "Chat"} &middot; {(selectedGeneration.model_key as string) ?? "AI"}
            </span>
          </div>
        ) : null}

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {messages.length === 0 && !sendMutation.isPending ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Sparkles className="mx-auto h-10 w-10 text-[#e0dbd5]" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium text-black">AI Assistant</p>
                <p className="mt-1 text-sm text-[#888]">
                  Ask anything about your projects, estimates, contracts...
                </p>
              </div>
            </div>
          ) : null}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f8f8f8] border border-[#e0dbd5]">
                  <Sparkles className="h-4 w-4 text-black" strokeWidth={1.5} />
                </div>
              ) : null}
              <div
                className={`max-w-[75%] rounded-lg px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-black text-white"
                    : "border border-[#e0dbd5] bg-[#f8f8f8] text-black"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </div>
                <div
                  className={`mt-2 text-xs ${
                    msg.role === "user" ? "text-white/50" : "text-[#888]"
                  }`}
                >
                  {formatTime(msg.created_at)}
                </div>
              </div>
              {msg.role === "user" ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black">
                  <User className="h-4 w-4 text-white" strokeWidth={1.5} />
                </div>
              ) : null}
            </div>
          ))}

          {sendMutation.isPending ? (
            <div className="flex gap-3 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f8f8f8] border border-[#e0dbd5]">
                <Loader2 className="h-4 w-4 text-black animate-spin" strokeWidth={1.5} />
              </div>
              <div className="border border-[#e0dbd5] bg-[#f8f8f8] rounded-lg px-4 py-3">
                <p className="text-sm text-[#888]">Thinking...</p>
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-[#e0dbd5] pt-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Ask anything about your projects, estimates, contracts..."
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="border-[#e0dbd5] pr-10"
              disabled={sendMutation.isPending}
            />
          </div>
          <Button
            className="bg-black text-white hover:bg-black/90"
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim() || sendMutation.isPending}
          >
            <Send className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Quick Commands */}
        <div className="mt-2 flex flex-wrap gap-2">
          {["/scope", "/estimate", "/contract", "/email", "/summary"].map(
            (cmd) => (
              <Badge
                key={cmd}
                variant="outline"
                className="cursor-pointer border-[#e0dbd5] text-[#888] hover:bg-[#f8f8f8] hover:text-black"
                onClick={() => setInputValue(cmd + " ")}
              >
                {cmd}
              </Badge>
            )
          )}
        </div>
      </div>
    </div>
  );
}
