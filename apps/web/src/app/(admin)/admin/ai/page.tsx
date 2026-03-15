"use client";

import React, { useState } from "react";
import {
  Send,
  Bot,
  User,
  Plus,
  Sparkles,
  MessageSquare,
  Clock,
  FolderKanban,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  context?: string;
}

const conversations: Conversation[] = [
  {
    id: "c1",
    title: "Kitchen Renovation Scope",
    lastMessage: "The scope includes demolition of existing...",
    time: "10 min ago",
    context: "Project: Kitchen Renovation",
  },
  {
    id: "c2",
    title: "Deck Estimate Help",
    lastMessage: "Based on 400 sqft composite deck...",
    time: "2 hours ago",
    context: "Project: Composite Deck Build",
  },
  {
    id: "c3",
    title: "Contract Clause Review",
    lastMessage: "The change order clause should specify...",
    time: "Yesterday",
  },
];

const mockMessages: Record<string, Message[]> = {
  c1: [
    {
      id: "m1",
      role: "user",
      content:
        "Generate a detailed scope of work for the Johnson kitchen renovation. They want to remove a wall between kitchen and dining room, install new cabinets, quartz countertops, and update all appliances.",
      timestamp: "10:32 AM",
    },
    {
      id: "m2",
      role: "assistant",
      content: `Here's a comprehensive scope of work for the Johnson Kitchen Renovation:

**1. Demolition & Preparation**
- Remove existing cabinetry, countertops, and backsplash
- Remove non-load-bearing wall between kitchen and dining room (verify with structural engineer)
- Remove existing flooring in affected area
- Protect adjacent rooms with dust barriers

**2. Structural**
- Install LVL beam to support load after wall removal (per engineer specs)
- Frame new header with proper support columns
- Patch and finish ceiling where wall was removed

**3. Electrical & Plumbing**
- Relocate circuits from removed wall
- Add 4 new dedicated circuits for appliances
- Install under-cabinet LED lighting (8 fixtures)
- Relocate plumbing for new sink location
- Add water line for refrigerator ice maker

**4. Cabinetry & Countertops**
- Install 22 linear feet of custom shaker-style cabinets
- 42" upper cabinets with soft-close hinges
- Pull-out drawers in base cabinets
- Quartz countertops (Calacatta pattern) with undermount sink cutout
- Island: 4' x 6' with seating overhang on one side

**5. Appliances**
- 36" gas range with hood vent (ducted to exterior)
- French door refrigerator
- Dishwasher
- Microwave drawer

**Estimated Duration:** 6-8 weeks
**Estimated Budget Range:** $45,000 - $62,000`,
      timestamp: "10:33 AM",
    },
    {
      id: "m3",
      role: "user",
      content:
        "Can you add a section for flooring? They want luxury vinyl plank throughout.",
      timestamp: "10:35 AM",
    },
    {
      id: "m4",
      role: "assistant",
      content: `**6. Flooring**
- Remove existing tile flooring in kitchen (approx. 180 sqft)
- Level subfloor as needed (self-leveling compound)
- Install luxury vinyl plank flooring (waterproof, 7mm+ thickness)
- Extend LVP into dining area for seamless transition (approx. 120 sqft)
- Install matching transition strips at doorways
- Quarter-round molding at all perimeters

**Material Spec:** Recommend Shaw Floorté Pro or equivalent — waterproof core, 20mil+ wear layer, commercial-grade warranty.

**Additional Cost Estimate:** $2,800 - $4,200 (materials + labor for ~300 sqft)

This brings the total project estimate to **$47,800 - $66,200**.`,
      timestamp: "10:35 AM",
    },
  ],
  c2: [
    {
      id: "m5",
      role: "user",
      content:
        "What should I estimate for a 400 sqft composite deck with stairs and railing?",
      timestamp: "2:15 PM",
    },
    {
      id: "m6",
      role: "assistant",
      content: `For a 400 sqft composite deck, here's a detailed breakdown:

**Materials:**
- Composite decking (Trex/TimberTech): $3,200 - $4,800
- Pressure-treated framing lumber: $1,200 - $1,600
- Concrete footings (8-10): $600 - $900
- Composite railing system (~60 linear ft): $2,400 - $3,600
- Stairs (assuming 4-5 steps): $800 - $1,200
- Hardware, fasteners, joist tape: $400 - $600

**Labor:**
- Footings & framing: $2,000 - $2,800
- Decking installation: $1,600 - $2,400
- Railing installation: $1,000 - $1,500
- Stairs: $600 - $900
- Cleanup & final inspection: $200 - $300

**Total Estimate: $14,000 - $19,800**

**Timeline:** 5-8 days with a 2-person crew

I'd recommend pricing this at **$16,500** as your mid-range quote, giving you a healthy margin around 28%.`,
      timestamp: "2:16 PM",
    },
  ],
  c3: [
    {
      id: "m7",
      role: "user",
      content:
        "Review this change order clause and suggest improvements for protecting us better.",
      timestamp: "Yesterday",
    },
    {
      id: "m8",
      role: "assistant",
      content: `I'd recommend strengthening your change order clause with these key additions:

1. **Written Approval Required** — No work proceeds on any change without a signed Change Order form from both parties.

2. **Pricing Transparency** — Include that change orders will detail: additional materials, labor hours at specified rates, any schedule impact, and markup percentage.

3. **Timeline Impact** — State explicitly that approved changes may extend the completion date by a proportional amount, and this extension is automatic upon approval.

4. **Cost Markup** — Standard practice is 15-20% markup on change order materials and subcontractor costs. Specify your rate clearly.

5. **Cumulative Threshold** — If cumulative changes exceed 10% of original contract value, either party may request a contract amendment.

Want me to draft the full revised clause?`,
      timestamp: "Yesterday",
    },
  ],
};

export default function AIChatPage() {
  const [selectedConvo, setSelectedConvo] = useState("c1");
  const [inputValue, setInputValue] = useState("");
  const messages = mockMessages[selectedConvo] || [];
  const activeConvo = conversations.find((c) => c.id === selectedConvo);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar — Conversations */}
      <div className="hidden w-72 shrink-0 flex-col border-r border-[#e0dbd5] pr-4 lg:flex">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">Conversations</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {conversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setSelectedConvo(convo.id)}
              className={`w-full rounded-lg px-3 py-3 text-left transition-colors ${
                selectedConvo === convo.id
                  ? "bg-black text-white"
                  : "hover:bg-[#f8f8f8]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    selectedConvo === convo.id ? "text-white" : "text-black"
                  }`}
                >
                  {convo.title}
                </span>
                <span
                  className={`text-xs ${
                    selectedConvo === convo.id ? "text-white/60" : "text-[#888]"
                  }`}
                >
                  {convo.time}
                </span>
              </div>
              <p
                className={`mt-1 truncate text-xs ${
                  selectedConvo === convo.id ? "text-white/70" : "text-[#888]"
                }`}
              >
                {convo.lastMessage}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Context Bar */}
        {activeConvo?.context && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#e0dbd5] bg-[#f8f8f8] px-3 py-2">
            <FolderKanban className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
            <span className="text-xs font-medium text-[#888]">
              {activeConvo.context}
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f8f8f8] border border-[#e0dbd5]">
                  <Sparkles className="h-4 w-4 text-black" strokeWidth={1.5} />
                </div>
              )}
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
                  {msg.timestamp}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black">
                  <User className="h-4 w-4 text-white" strokeWidth={1.5} />
                </div>
              )}
            </div>
          ))}
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
              className="border-[#e0dbd5] pr-10"
            />
          </div>
          <Button className="bg-black text-white hover:bg-black/90" size="icon">
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
