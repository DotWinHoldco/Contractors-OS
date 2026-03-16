"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Send, X } from "lucide-react";
import { useBookingStore, type SolutionSchedule } from "@/lib/stores/booking-store";
import { callEdgeFunction } from "@/lib/supabase/edge";

/* ------------------------------------------------------------------ */
/*  Service categories                                                 */
/* ------------------------------------------------------------------ */
const serviceCategories = [
  { slug: "kitchen-remodeling", label: "Kitchen Remodeling", icon: "🍳" },
  { slug: "bathroom-remodeling", label: "Bathroom Remodeling", icon: "🚿" },
  { slug: "basement-finishing", label: "Basement Finishing", icon: "🏠" },
  { slug: "deck-construction", label: "Deck & Patio", icon: "🌲" },
  { slug: "roofing", label: "Roofing", icon: "🏗️" },
  { slug: "new-construction", label: "New Construction", icon: "🔨" },
  { slug: "additions", label: "Additions", icon: "📐" },
  { slug: "siding", label: "Siding & Exterior", icon: "🧱" },
  { slug: "handyman", label: "Handyman", icon: "🔧" },
  { slug: "other", label: "Something Else", icon: "✨" },
];

const scopeOptions = [
  { value: "quick_refresh", label: "Quick refresh" },
  { value: "full_remodel", label: "Full remodel" },
  { value: "down_to_studs", label: "Down to the studs" },
  { value: "not_sure", label: "Not sure yet" },
];

const timelineOptions = [
  { value: "asap", label: "ASAP" },
  { value: "1_3_months", label: "1–3 months" },
  { value: "3_6_months", label: "3–6 months" },
  { value: "just_planning", label: "Just planning" },
];

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */
function ProgressBar({ stage }: { stage: number }) {
  const pct = stage <= 3 ? (stage / 3) * 60 : stage === 4 ? 75 : 100;
  return (
    <div className="h-1 w-full bg-white/10">
      <div
        className="h-full bg-[#D4A84B] transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pill                                                               */
/* ------------------------------------------------------------------ */
function Pill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full border px-6 py-5 text-left text-[15px] font-medium transition-all duration-250 hover:-translate-y-0.5 ${
        selected
          ? "border-[#D4A84B] bg-[#D4A84B]/12 text-[#D4A84B]"
          : "border-white/12 bg-white/5 text-white/80 hover:border-white/25 hover:bg-white/8"
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function BookPage() {
  const router = useRouter();
  const store = useBookingStore();
  const {
    stage, name, email, phone, projectType, projectTypeLabel,
    scope, timeline, chatMessages, chatLoading, solutionSchedule,
  } = store;

  const [localName, setLocalName] = useState(name);
  const [localEmail, setLocalEmail] = useState(email);
  const [localPhone, setLocalPhone] = useState(phone);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // Send AI message
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || chatLoading) return;
    store.addMessage({ role: "user", content: message });
    store.setChatLoading(true);
    setChatInput("");

    try {
      // Read conversationId from current store state (not stale closure)
      const currentConvId = useBookingStore.getState().conversationId;

      const res = await callEdgeFunction<{ message: string; conversation_id: string }>(
        "ai-chat",
        {
          message,
          conversation_id: currentConvId,
          context: {
            project_type: projectTypeLabel,
            scope,
            timeline,
            client_name: name,
          },
        }
      );

      store.addMessage({ role: "assistant", content: res.message });
      if (res.conversation_id) store.setConversationId(res.conversation_id);

      // Check for solution schedule in the response
      if (res.message.includes("---SOLUTION_SCHEDULE---")) {
        const jsonMatch = res.message.match(/---SOLUTION_SCHEDULE---\s*([\s\S]*?)(?:---END_SOLUTION_SCHEDULE---|$)/);
        if (jsonMatch?.[1]) {
          try {
            const schedule = JSON.parse(jsonMatch[1].trim()) as SolutionSchedule;
            store.setSolutionSchedule(schedule);
            store.setStage(5);

            // Persist lead, client, project, phases to database
            const currentState = useBookingStore.getState();
            try {
              await callEdgeFunction("leads-capture", {
                name: currentState.name,
                email: currentState.email,
                phone: currentState.phone,
                project_type: currentState.projectType,
                project_type_label: currentState.projectTypeLabel,
                scope: currentState.scope,
                timeline: currentState.timeline,
                chat_transcript: currentState.chatMessages,
                solution_schedule: schedule,
                conversation_id: currentState.conversationId,
              });
            } catch (captureErr) {
              console.error("Lead capture failed:", captureErr);
              // Don't block the user from seeing their plan
            }

            router.push("/book/plan");
          } catch {
            // AI didn't format JSON correctly, continue chat
          }
        }
      }
    } catch {
      store.addMessage({
        role: "assistant",
        content: "I apologize — I'm having trouble connecting right now. Please try again in a moment.",
      });
    } finally {
      store.setChatLoading(false);
    }
  }, [chatLoading, store, projectTypeLabel, scope, timeline, name, router]);

  // Auto-send first message when entering chat stage
  useEffect(() => {
    if (stage === 4 && chatMessages.length === 0) {
      const introMsg = `Hi! I'm planning a ${projectTypeLabel.toLowerCase()} project. The scope is "${scope.replace(/_/g, " ")}" and my timeline is "${timeline.replace(/_/g, " ")}".`;
      sendMessage(introMsg);
    }
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const canAdvanceStage1 = localName.trim() && localEmail.trim();

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        {stage > 1 ? (
          <button
            onClick={() => store.prevStage()}
            className="flex items-center gap-1 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-1 text-sm text-white/40 transition-colors hover:text-white">
            <X className="h-4 w-4" />
            Exit
          </Link>
        )}
        <span className="text-xs text-white/30">
          {stage <= 3 ? `Step ${stage} of 3` : stage === 4 ? "Project Advisor" : "Your Plan"}
        </span>
      </header>

      <ProgressBar stage={stage} />

      {/* Content */}
      <main className="flex flex-1 flex-col">
        {/* Stage 1 — Contact */}
        {stage === 1 && (
          <div className="intake-stage mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
              Let&rsquo;s get started
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">
              Who&rsquo;s building?
            </h2>
            <p className="mt-2 text-sm text-white/40">
              We&rsquo;ll send your project plan to this email.
            </p>
            <div className="mt-8 space-y-4">
              <input
                type="text"
                placeholder="Full name"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="w-full border border-white/15 bg-white/5 px-5 py-4 text-base text-white placeholder:text-white/30 focus:border-[#D4A84B] focus:outline-none transition-colors"
                autoFocus
              />
              <input
                type="email"
                placeholder="Email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                className="w-full border border-white/15 bg-white/5 px-5 py-4 text-base text-white placeholder:text-white/30 focus:border-[#D4A84B] focus:outline-none transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={localPhone}
                onChange={(e) => setLocalPhone(e.target.value)}
                className="w-full border border-white/15 bg-white/5 px-5 py-4 text-base text-white placeholder:text-white/30 focus:border-[#D4A84B] focus:outline-none transition-colors"
              />
            </div>
            <button
              disabled={!canAdvanceStage1}
              onClick={() => {
                store.setContact(localName, localEmail, localPhone);
                store.nextStage();
              }}
              className="mt-8 w-full bg-[#D4A84B] py-4 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="ml-2 inline h-4 w-4" />
            </button>
          </div>
        )}

        {/* Stage 2 — Project Type */}
        {stage === 2 && (
          <div className="intake-stage mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
              Your project
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">
              What are we building?
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {serviceCategories.map((cat) => (
                <Pill
                  key={cat.slug}
                  selected={projectType === cat.slug}
                  onClick={() => {
                    store.setProjectType(cat.slug, cat.label);
                    // Auto-advance after selection
                    setTimeout(() => store.nextStage(), 300);
                  }}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Stage 3 — Scope + Timeline */}
        {stage === 3 && (
          <div className="intake-stage mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A84B]">
              Project details
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">
              How big is this project?
            </h2>
            <div className="mt-8 space-y-3">
              {scopeOptions.map((opt) => (
                <Pill
                  key={opt.value}
                  selected={scope === opt.value}
                  onClick={() => store.setScope(opt.value)}
                >
                  {opt.label}
                </Pill>
              ))}
            </div>

            <h3 className="mt-10 text-lg font-semibold text-white">
              When do you want to start?
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {timelineOptions.map((opt) => (
                <Pill
                  key={opt.value}
                  selected={timeline === opt.value}
                  onClick={() => store.setTimeline(opt.value)}
                >
                  {opt.label}
                </Pill>
              ))}
            </div>

            <button
              disabled={!scope || !timeline}
              onClick={() => store.nextStage()}
              className="mt-8 w-full bg-[#D4A84B] py-4 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#C49A3F] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Talk to Your Project Advisor
              <ArrowRight className="ml-2 inline h-4 w-4" />
            </button>
          </div>
        )}

        {/* Stage 4 — AI Chat */}
        {stage === 4 && (
          <div className="flex flex-1 flex-col">
            {/* Chat header */}
            <div className="border-b border-white/10 px-6 py-3">
              <div className="mx-auto flex max-w-2xl items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4A84B]/20">
                  <span className="text-sm">🏠</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Project Advisor</p>
                  <p className="text-xs text-white/40">
                    AI-Powered &middot; {projectTypeLabel} &middot;{" "}
                    {scope.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto max-w-2xl space-y-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-5 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#D4A84B]/15 text-white"
                          : "border border-white/8 bg-white/5 text-white/80"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-1.5 border border-white/8 bg-white/5 px-5 py-4">
                      {[0, 1, 2].map((d) => (
                        <div
                          key={d}
                          className="h-2 w-2 rounded-full bg-[#D4A84B]"
                          style={{
                            animation: `dot-bounce 1.4s infinite ease-in-out both`,
                            animationDelay: `${d * 0.16}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-white/10 px-6 py-4">
              <form
                className="mx-auto flex max-w-2xl gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(chatInput);
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4A84B] focus:outline-none transition-colors"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="flex items-center justify-center bg-[#D4A84B] px-5 py-3 text-black transition-all hover:bg-[#C49A3F] disabled:opacity-30"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
