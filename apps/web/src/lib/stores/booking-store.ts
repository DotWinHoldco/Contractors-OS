import { create } from "zustand";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SolutionSchedule {
  project_title: string;
  estimated_range: string;
  estimated_duration: string;
  phases: Array<{
    name: string;
    duration: string;
    description: string;
    cost_range: string;
  }>;
  key_decisions: string[];
  risk_flags: string[];
  next_steps: string[];
}

export interface BookingState {
  stage: number; // 1=contact, 2=project type, 3=scope/timeline, 4=AI chat, 5=report
  name: string;
  email: string;
  phone: string;
  projectType: string;
  projectTypeLabel: string;
  scope: string;
  timeline: string;
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  solutionSchedule: SolutionSchedule | null;
  conversationId: string | null;
  setStage: (stage: number) => void;
  nextStage: () => void;
  prevStage: () => void;
  setContact: (name: string, email: string, phone: string) => void;
  setProjectType: (slug: string, label: string) => void;
  setScope: (scope: string) => void;
  setTimeline: (timeline: string) => void;
  addMessage: (msg: ChatMessage) => void;
  setChatLoading: (loading: boolean) => void;
  setSolutionSchedule: (schedule: SolutionSchedule) => void;
  setConversationId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  stage: 1,
  name: "",
  email: "",
  phone: "",
  projectType: "",
  projectTypeLabel: "",
  scope: "",
  timeline: "",
  chatMessages: [] as ChatMessage[],
  chatLoading: false,
  solutionSchedule: null as SolutionSchedule | null,
  conversationId: null as string | null,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  setStage: (stage) => set({ stage }),
  nextStage: () => set((s) => ({ stage: Math.min(s.stage + 1, 5) })),
  prevStage: () => set((s) => ({ stage: Math.max(s.stage - 1, 1) })),
  setContact: (name, email, phone) => set({ name, email, phone }),
  setProjectType: (slug, label) =>
    set({ projectType: slug, projectTypeLabel: label }),
  setScope: (scope) => set({ scope }),
  setTimeline: (timeline) => set({ timeline }),
  addMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  setChatLoading: (chatLoading) => set({ chatLoading }),
  setSolutionSchedule: (solutionSchedule) => set({ solutionSchedule }),
  setConversationId: (conversationId) => set({ conversationId }),
  reset: () => set(initialState),
}));
