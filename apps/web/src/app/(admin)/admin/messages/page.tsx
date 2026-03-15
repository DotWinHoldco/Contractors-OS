"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Mail,
  Phone,
  Send,
  Search,
  Archive,
  MailOpen,
  MailCheck,
  Paperclip,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  unreadCount: number;
  channel: "in-app" | "email" | "sms";
  role: "client" | "team";
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    initials: "SM",
    lastMessage: "When can we schedule the final walkthrough?",
    time: "2m ago",
    unread: true,
    unreadCount: 3,
    channel: "in-app",
    role: "client",
    messages: [
      { id: "1a", text: "Hi! I wanted to check on the kitchen remodel timeline.", sender: "them", time: "10:15 AM" },
      { id: "1b", text: "Everything is on track. Cabinets arrive Thursday and we'll start installation Friday morning.", sender: "me", time: "10:22 AM" },
      { id: "1c", text: "That's great news! Will the countertops be ready the following week?", sender: "them", time: "10:30 AM" },
      { id: "1d", text: "Yes, the granite fabricator confirmed delivery for next Tuesday.", sender: "me", time: "10:35 AM" },
      { id: "1e", text: "Perfect. When can we schedule the final walkthrough?", sender: "them", time: "10:42 AM" },
    ],
  },
  {
    id: "2",
    name: "Marcus Johnson",
    initials: "MJ",
    lastMessage: "Estimate looks good. Let's move forward.",
    time: "28m ago",
    unread: true,
    unreadCount: 1,
    channel: "email",
    role: "client",
    messages: [
      { id: "2a", text: "Marcus, here's the updated estimate for the deck project. Total comes to $14,200 including materials and labor.", sender: "me", time: "9:00 AM" },
      { id: "2b", text: "Thanks for getting that over quickly. One question — does this include staining?", sender: "them", time: "9:45 AM" },
      { id: "2c", text: "Yes, two coats of semi-transparent stain are included in the price.", sender: "me", time: "9:50 AM" },
      { id: "2d", text: "Estimate looks good. Let's move forward.", sender: "them", time: "10:14 AM" },
    ],
  },
  {
    id: "3",
    name: "Mike Torres",
    initials: "MT",
    lastMessage: "Finished the drywall in unit 4B.",
    time: "1h ago",
    unread: false,
    unreadCount: 0,
    channel: "sms",
    role: "team",
    messages: [
      { id: "3a", text: "Hey Mike, how's the progress on the drywall today?", sender: "me", time: "8:00 AM" },
      { id: "3b", text: "Going well. Started on unit 4B this morning. Should wrap up by lunch.", sender: "them", time: "8:15 AM" },
      { id: "3c", text: "Great, let me know when you're done so I can schedule the painter.", sender: "me", time: "8:20 AM" },
      { id: "3d", text: "Finished the drywall in unit 4B.", sender: "them", time: "11:30 AM" },
    ],
  },
  {
    id: "4",
    name: "Jennifer Park",
    initials: "JP",
    lastMessage: "Can you send the invoice for the bathroom project?",
    time: "3h ago",
    unread: true,
    unreadCount: 2,
    channel: "in-app",
    role: "client",
    messages: [
      { id: "4a", text: "Hi! The bathroom renovation looks amazing. Thank you so much!", sender: "them", time: "7:30 AM" },
      { id: "4b", text: "Glad you love it, Jennifer! It was a great project.", sender: "me", time: "7:45 AM" },
      { id: "4c", text: "Can you send the invoice for the bathroom project?", sender: "them", time: "8:00 AM" },
    ],
  },
  {
    id: "5",
    name: "David Chen",
    initials: "DC",
    lastMessage: "Permits came through. We're good to start Monday.",
    time: "5h ago",
    unread: false,
    unreadCount: 0,
    channel: "email",
    role: "team",
    messages: [
      { id: "5a", text: "Any update on the permits for the Henderson project?", sender: "me", time: "Yesterday" },
      { id: "5b", text: "Still waiting on the city. I'll follow up today.", sender: "them", time: "Yesterday" },
      { id: "5c", text: "Permits came through. We're good to start Monday.", sender: "them", time: "6:00 AM" },
    ],
  },
  {
    id: "6",
    name: "Lisa Ramirez",
    initials: "LR",
    lastMessage: "I'd like to add a pergola to the backyard scope.",
    time: "Yesterday",
    unread: false,
    unreadCount: 0,
    channel: "sms",
    role: "client",
    messages: [
      { id: "6a", text: "Hi Lisa, just following up on the backyard landscaping project. Any changes to the scope?", sender: "me", time: "Yesterday" },
      { id: "6b", text: "Actually yes — I'd like to add a pergola to the backyard scope.", sender: "them", time: "Yesterday" },
    ],
  },
];

type FilterTab = "all" | "clients" | "team" | "unread";
type Channel = "in-app" | "email" | "sms";

const channelIcon = (ch: Channel) => {
  switch (ch) {
    case "in-app":
      return <MessageSquare size={14} strokeWidth={1.5} />;
    case "email":
      return <Mail size={14} strokeWidth={1.5} />;
    case "sms":
      return <Phone size={14} strokeWidth={1.5} />;
  }
};

const channelLabel = (ch: Channel) => {
  switch (ch) {
    case "in-app":
      return "In-App";
    case "email":
      return "Email";
    case "sms":
      return "SMS";
  }
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function MessagesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [selectedId, setSelectedId] = useState<string>(conversations[0].id);
  const [messageInput, setMessageInput] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<Channel>("in-app");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = conversations.filter((c) => {
    if (activeFilter === "clients") return c.role === "client";
    if (activeFilter === "team") return c.role === "team";
    if (activeFilter === "unread") return c.unread;
    return true;
  }).filter((c) => {
    if (!searchQuery) return true;
    return c.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selected = conversations.find((c) => c.id === selectedId) ?? conversations[0];

  const filters: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "All" },
    { key: "clients", label: "Clients" },
    { key: "team", label: "Team" },
    { key: "unread", label: "Unread", count: conversations.filter((c) => c.unread).length },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "#e0dbd5" }}>
        <div className="flex items-center gap-3">
          <MessageSquare size={20} strokeWidth={1.5} />
          <h1 className="text-lg font-semibold text-black">Messages</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ---- Left sidebar: conversations list ---- */}
        <div className="flex w-[380px] flex-col border-r" style={{ borderColor: "#e0dbd5" }}>
          {/* Filter tabs */}
          <div className="flex items-center gap-1 border-b px-4 py-3" style={{ borderColor: "#e0dbd5" }}>
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className="relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeFilter === f.key ? "black" : "transparent",
                  color: activeFilter === f.key ? "white" : "#888",
                }}
              >
                {f.label}
                {f.count ? (
                  <span
                    className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold"
                    style={{
                      backgroundColor: activeFilter === f.key ? "white" : "black",
                      color: activeFilter === f.key ? "black" : "white",
                    }}
                  >
                    {f.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="border-b px-4 py-2" style={{ borderColor: "#e0dbd5" }}>
            <div className="relative">
              <Search size={16} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#888" }} />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-sm"
                style={{ borderColor: "#e0dbd5", borderRadius: 8, backgroundColor: "#f8f8f8" }}
              />
            </div>
          </div>

          {/* Thread list */}
          <ScrollArea className="flex-1">
            <div className="divide-y" style={{ borderColor: "#e0dbd5" }}>
              {filtered.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors"
                  style={{
                    backgroundColor: selectedId === conv.id ? "#f8f8f8" : "transparent",
                    borderColor: "#e0dbd5",
                  }}
                >
                  <div className="relative mt-0.5">
                    <Avatar size="default">
                      <AvatarFallback
                        className="text-xs font-medium"
                        style={{ backgroundColor: "#e0dbd5", color: "black" }}
                      >
                        {conv.initials}
                      </AvatarFallback>
                    </Avatar>
                    {conv.unread && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-black" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-black truncate">{conv.name}</span>
                      <span className="ml-2 shrink-0 text-[11px]" style={{ color: "#888" }}>
                        {conv.time}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[13px]" style={{ color: "#888" }}>
                      {conv.lastMessage}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: "#888" }}>
                        {channelIcon(conv.channel)}
                        {channelLabel(conv.channel)}
                      </span>
                      <Badge
                        variant="outline"
                        className="h-4 px-1.5 text-[10px]"
                        style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
                      >
                        {conv.role === "client" ? "Client" : "Team"}
                      </Badge>
                      {conv.unreadCount > 0 && (
                        <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-12 text-center text-sm" style={{ color: "#888" }}>
                  No conversations found.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* ---- Right panel: selected conversation ---- */}
        <div className="flex flex-1 flex-col">
          {/* Conversation header */}
          <div className="flex items-center justify-between border-b px-6 py-3" style={{ borderColor: "#e0dbd5" }}>
            <div className="flex items-center gap-3">
              <Avatar size="default">
                <AvatarFallback
                  className="text-xs font-medium"
                  style={{ backgroundColor: "#e0dbd5", color: "black" }}
                >
                  {selected.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-black">{selected.name}</p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px]" style={{ color: "#888" }}>
                    {channelIcon(selected.channel)}
                    {channelLabel(selected.channel)}
                  </span>
                  <Badge
                    variant="outline"
                    className="h-4 px-1.5 text-[10px]"
                    style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
                  >
                    {selected.role === "client" ? "Client" : "Team"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" title="Mark read/unread">
                {selected.unread ? (
                  <MailCheck size={16} strokeWidth={1.5} />
                ) : (
                  <MailOpen size={16} strokeWidth={1.5} />
                )}
              </Button>
              <Button variant="ghost" size="icon-sm" title="Archive">
                <Archive size={16} strokeWidth={1.5} />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="flex flex-col gap-3">
              {selected.messages.map((msg) => {
                const isSent = msg.sender === "me";
                return (
                  <div key={msg.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[70%] px-3.5 py-2.5"
                      style={{
                        backgroundColor: isSent ? "black" : "#f8f8f8",
                        color: isSent ? "white" : "black",
                        borderRadius: 8,
                        border: isSent ? "none" : "1px solid #e0dbd5",
                      }}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p
                        className="mt-1 text-[11px]"
                        style={{ color: isSent ? "rgba(255,255,255,0.5)" : "#888" }}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="border-t px-6 py-4" style={{ borderColor: "#e0dbd5" }}>
            {/* Channel chips */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[11px] font-medium" style={{ color: "#888" }}>
                Send via:
              </span>
              {(["in-app", "email", "sms"] as Channel[]).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors"
                  style={{
                    backgroundColor: selectedChannel === ch ? "black" : "transparent",
                    color: selectedChannel === ch ? "white" : "#888",
                    borderColor: selectedChannel === ch ? "black" : "#e0dbd5",
                  }}
                >
                  {channelIcon(ch)}
                  {channelLabel(ch)}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon-sm" style={{ color: "#888" }}>
                <Paperclip size={16} strokeWidth={1.5} />
              </Button>
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 text-sm"
                style={{ borderColor: "#e0dbd5", borderRadius: 8 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    setMessageInput("");
                  }
                }}
              />
              <Button
                size="default"
                style={{ backgroundColor: "black", color: "white", borderRadius: 8 }}
                onClick={() => setMessageInput("")}
              >
                <Send size={14} strokeWidth={1.5} />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
