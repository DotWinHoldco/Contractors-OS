"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface Thread {
  id: string;
  name: string;
  initials: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: string;
  sender: "them" | "me";
  name: string;
  text: string;
  time: string;
}

const threads: Thread[] = [
  {
    id: "t1",
    name: "Mike Reynolds",
    initials: "MR",
    role: "Project Manager",
    lastMessage: "The countertop template is done — fabrication takes about 5 days.",
    time: "2h ago",
    unread: 2,
  },
  {
    id: "t2",
    name: "Lisa Chen",
    initials: "LC",
    role: "Designer",
    lastMessage: "I've uploaded the revised backsplash layout to Documents.",
    time: "Yesterday",
    unread: 1,
  },
  {
    id: "t3",
    name: "Billing Support",
    initials: "BS",
    role: "Support",
    lastMessage: "Your payment of $3,800 has been confirmed. Thank you!",
    time: "4d ago",
    unread: 0,
  },
];

const messagesByThread: Record<string, Message[]> = {
  t1: [
    {
      id: "m1",
      sender: "them",
      name: "Mike Reynolds",
      text: "Good morning, Sarah! Quick update on the kitchen — the cabinet install finished yesterday and everything looks great.",
      time: "Mar 13, 10:15 AM",
    },
    {
      id: "m2",
      sender: "me",
      name: "Sarah Johnson",
      text: "That's wonderful! The photos look amazing. When does the countertop work begin?",
      time: "Mar 13, 11:02 AM",
    },
    {
      id: "m3",
      sender: "them",
      name: "Mike Reynolds",
      text: "The templater came out this morning. Fabrication usually takes about 5 business days, so we're looking at installation around March 20th.",
      time: "Mar 14, 9:30 AM",
    },
    {
      id: "m4",
      sender: "them",
      name: "Mike Reynolds",
      text: "The countertop template is done — fabrication takes about 5 days. I'll send you a photo once the slab is cut.",
      time: "Mar 14, 2:45 PM",
    },
  ],
  t2: [
    {
      id: "m5",
      sender: "them",
      name: "Lisa Chen",
      text: "Hi Sarah! Based on our conversation, I've revised the backsplash layout to use the herringbone pattern in the area behind the range.",
      time: "Mar 13, 3:00 PM",
    },
    {
      id: "m6",
      sender: "them",
      name: "Lisa Chen",
      text: "I've uploaded the revised backsplash layout to Documents. Let me know what you think!",
      time: "Mar 13, 3:05 PM",
    },
  ],
  t3: [
    {
      id: "m7",
      sender: "them",
      name: "Billing Support",
      text: "Your payment of $3,800 has been confirmed. Thank you! Your next payment of $4,250 will be due once the countertop installation is complete.",
      time: "Mar 10, 9:00 AM",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalMessagesPage() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const activeThread = threads.find((t) => t.id === selectedThread);
  const messages = selectedThread ? messagesByThread[selectedThread] ?? [] : [];

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
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  onClick={() => setSelectedThread(thread.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#e0dbd5]/30 ${
                    selectedThread === thread.id ? "bg-[#e0dbd5]/40" : ""
                  }`}
                >
                  <Avatar className="mt-0.5 h-9 w-9 shrink-0 border border-[#e0dbd5]">
                    <AvatarFallback className="bg-[#e0dbd5] text-xs font-semibold text-black">
                      {thread.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold text-black">
                        {thread.name}
                      </p>
                      <span className="ml-2 shrink-0 text-[10px] text-[#888]">
                        {thread.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#888]">{thread.role}</p>
                    <p className="mt-0.5 truncate text-xs text-[#888]">
                      {thread.lastMessage}
                    </p>
                  </div>
                  {thread.unread > 0 && (
                    <Badge className="ml-1 mt-1 shrink-0 bg-black px-1.5 text-[10px] text-white">
                      {thread.unread}
                    </Badge>
                  )}
                </button>
              </li>
            ))}
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
                    {activeThread.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-black">
                    {activeThread.name}
                  </p>
                  <p className="text-xs text-[#888]">{activeThread.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        msg.sender === "me"
                          ? "bg-black text-white"
                          : "bg-[#e0dbd5]/50 text-black"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`mt-1 text-[10px] ${
                          msg.sender === "me"
                            ? "text-white/60"
                            : "text-[#888]"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-[#e0dbd5] p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setInputValue("");
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border-[#e0dbd5] focus-visible:ring-black"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="shrink-0 bg-black text-white hover:bg-black/90"
                    disabled={!inputValue.trim()}
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
