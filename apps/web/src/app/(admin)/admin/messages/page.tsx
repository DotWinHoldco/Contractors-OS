"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Search, MessageSquare } from "lucide-react";
import { useThreads, useMessages, useSendMessage } from "@/lib/hooks/use-messages";
import { useAppUser } from "@/lib/hooks/use-app-user";

export default function AdminMessagesPage() {
  const { appUser } = useAppUser();
  const userId = appUser?.id;
  const { data: threads, isLoading: threadsLoading } = useThreads(userId);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading: msgsLoading } = useMessages(selectedThreadId || "");
  const sendMessage = useSendMessage();

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!messageInput.trim() || !selectedThreadId || !userId) return;
    sendMessage.mutate({
      thread_id: selectedThreadId,
      sender_id: userId,
      body: messageInput,
      sender_type: "staff",
    } as never);
    setMessageInput("");
  };

  const filteredThreads = (threads || []).filter((t: Record<string, unknown>) => {
    const subject = String(t.subject || "").toLowerCase();
    return subject.includes(search.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-[#e0dbd5]">
      {/* Thread List */}
      <div className="w-80 flex-shrink-0 border-r border-[#e0dbd5] bg-white">
        <div className="border-b border-[#e0dbd5] p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-56px)]">
          {threadsLoading ? (
            <div className="space-y-2 p-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !filteredThreads.length ? (
            <div className="p-6 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-[#e0dbd5]" />
              <p className="mt-2 text-sm text-[#888]">No conversations yet</p>
            </div>
          ) : (
            filteredThreads.map((thread: Record<string, unknown>) => (
              <button
                key={thread.id as string}
                onClick={() => setSelectedThreadId(thread.id as string)}
                className={`w-full border-b border-[#e0dbd5] p-3 text-left transition-colors hover:bg-[#f8f8f8] ${
                  selectedThreadId === thread.id ? "bg-[#f0edea]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-[#e0dbd5] text-xs font-semibold text-black">
                      {String(thread.subject || "?")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-black">
                      {String(thread.subject || "Conversation")}
                    </p>
                    <p className="truncate text-xs text-[#888]">
                      {thread.status as string || "open"}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Message View */}
      <div className="flex flex-1 flex-col bg-[#fafafa]">
        {!selectedThreadId ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-[#e0dbd5]" />
              <p className="mt-3 text-sm text-[#888]">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {msgsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-2/3" />
                  ))}
                </div>
              ) : !messages?.length ? (
                <p className="py-12 text-center text-sm text-[#888]">
                  No messages in this thread yet. Send the first one.
                </p>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg: Record<string, unknown>) => {
                    const isMe = msg.sender_id === userId;
                    return (
                      <div
                        key={msg.id as string}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2.5 text-sm ${
                            isMe
                              ? "bg-black text-white"
                              : "border border-[#e0dbd5] bg-white text-black"
                          }`}
                        >
                          {String(msg.body || msg.content || "")}
                          <p className={`mt-1 text-[10px] ${isMe ? "text-white/50" : "text-[#888]"}`}>
                            {msg.created_at
                              ? new Date(msg.created_at as string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>
              )}
            </ScrollArea>

            {/* Send */}
            <div className="border-t border-[#e0dbd5] bg-white p-3">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!messageInput.trim() || sendMessage.isPending}
                  className="bg-black text-white hover:bg-black/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
