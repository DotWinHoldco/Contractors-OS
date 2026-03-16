"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useThreads, useMessages, useSendMessage } from "@/lib/hooks/use-messages";
import { useAppUser } from "@/lib/hooks/use-app-user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, ArrowLeft, MessageSquare } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalMessagesPage() {
  const { appUser } = useAppUser();
  const userId = appUser?.id ?? undefined;

  const { data: threads, isLoading: loadingThreads } = useThreads(userId);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messageData, isLoading: loadingMessages } = useMessages(
    selectedThread ?? undefined
  );
  const sendMutation = useSendMessage();

  const threadList = threads ?? [];
  const messageList = messageData ?? [];

  const activeThread = selectedThread
    ? threadList.find((t) => (t.id as string) === selectedThread)
    : null;

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList.length]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || !selectedThread || !userId) return;
    sendMutation.mutate({
      thread_id: selectedThread,
      sender_id: userId,
      content: trimmed,
    });
    setInputValue("");
  }, [inputValue, selectedThread, userId, sendMutation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diff = Date.now() - d.getTime();
      const hours = Math.floor(diff / 3600000);
      if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  const getInitials = (thread: Record<string, unknown>) => {
    const subj = (thread.subject as string | null) ?? "?";
    return subj.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-black sm:text-3xl">Messages</h1>
        <p className="mt-1 text-sm text-[#888]">
          Communicate with your project team.
        </p>
      </div>

      <Card className="flex h-[calc(100vh-220px)] min-h-[500px] overflow-hidden border-[#e0dbd5]">
        {/* Thread List */}
        <div
          className={`w-full shrink-0 border-r border-[#e0dbd5] sm:w-80 ${
            selectedThread ? "hidden sm:block" : ""
          }`}
        >
          <div className="border-b border-[#e0dbd5] px-4 py-3">
            <p className="text-sm font-semibold text-black">Conversations</p>
          </div>
          <ul className="divide-y divide-[#e0dbd5] overflow-y-auto">
            {loadingThreads ? (
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="px-4 py-3">
                  <Skeleton className="h-14 w-full" />
                </li>
              ))
            ) : threadList.length === 0 ? (
              <li className="px-4 py-8 text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-[#e0dbd5]" />
                <p className="mt-2 text-sm text-[#888]">No conversations yet.</p>
              </li>
            ) : (
              threadList.map((thread) => {
                const threadId = thread.id as string;
                const subject = (thread.subject as string | null) ?? "Conversation";
                const msgs = (thread.messages as Record<string, unknown>[]) ?? [];
                const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
                const lastContent = lastMsg ? (lastMsg.body as string) : "";
                const lastTime = lastMsg ? (lastMsg.created_at as string) : (thread.updated_at as string);
                const unreadCount = msgs.filter(
                  (m) => (m.sender_id as string) !== userId && !(m.read_at as string | null)
                ).length;

                return (
                  <li key={threadId}>
                    <button
                      onClick={() => setSelectedThread(threadId)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#e0dbd5]/30 ${
                        selectedThread === threadId ? "bg-[#e0dbd5]/40" : ""
                      }`}
                    >
                      <Avatar className="mt-0.5 h-9 w-9 shrink-0 border border-[#e0dbd5]">
                        <AvatarFallback className="bg-[#e0dbd5] text-xs font-semibold text-black">
                          {getInitials(thread)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-semibold text-black">
                            {subject}
                          </p>
                          {lastTime ? (
                            <span className="ml-2 shrink-0 text-[10px] text-[#888]">
                              {formatTime(lastTime)}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-[#888]">
                          {lastContent || "No messages yet"}
                        </p>
                      </div>
                      {unreadCount > 0 ? (
                        <Badge className="ml-1 mt-1 shrink-0 bg-black px-1.5 text-[10px] text-white">
                          {unreadCount}
                        </Badge>
                      ) : null}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Message View */}
        <div
          className={`flex flex-1 flex-col ${
            selectedThread ? "" : "hidden sm:flex"
          }`}
        >
          {selectedThread && activeThread ? (
            <>
              {/* Message Header */}
              <div className="flex items-center gap-3 border-b border-[#e0dbd5] px-4 py-3">
                <button
                  onClick={() => setSelectedThread(null)}
                  className="sm:hidden"
                >
                  <ArrowLeft className="h-5 w-5 text-[#888]" />
                </button>
                <Avatar className="h-8 w-8 border border-[#e0dbd5]">
                  <AvatarFallback className="bg-[#e0dbd5] text-xs font-semibold text-black">
                    {getInitials(activeThread)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-black">
                    {(activeThread.subject as string | null) ?? "Conversation"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {loadingMessages ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-3/4" />
                  ))
                ) : messageList.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-[#888]">No messages yet. Start the conversation.</p>
                  </div>
                ) : (
                  messageList.map((msg) => {
                    const isMe = (msg.sender_id as string) === userId;
                    return (
                      <div
                        key={msg.id as string}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                            isMe
                              ? "bg-black text-white"
                              : "bg-[#e0dbd5]/50 text-black"
                          }`}
                        >
                          <p className="text-sm">{msg.body as string}</p>
                          <p
                            className={`mt-1 text-[10px] ${
                              isMe ? "text-white/60" : "text-[#888]"
                            }`}
                          >
                            {formatTime(msg.created_at as string)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-[#e0dbd5] p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 border-[#e0dbd5] focus-visible:ring-black"
                    disabled={sendMutation.isPending}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="shrink-0 bg-black text-white hover:bg-black/90"
                    disabled={!inputValue.trim() || sendMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-[#888]">
                Select a conversation to get started.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
