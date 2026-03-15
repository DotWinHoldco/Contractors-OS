import { create } from "zustand";

export interface BookingState {
  step: number;
  projectType: string;
  projectTypeLabel: string;
  answers: Record<string, string | string[]>;
  dimensions: { length: string; width: string };
  complexity: "simple" | "moderate" | "complex" | "";
  timeline: string;
  budgetRange: string;
  estimate: {
    low: number;
    high: number;
    duration: string;
    factors: string[];
  } | null;
  estimateLoading: boolean;
  consultationDate: string;
  consultationTime: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setProjectType: (slug: string, label: string) => void;
  setAnswer: (key: string, value: string | string[]) => void;
  setDimensions: (dims: Partial<BookingState["dimensions"]>) => void;
  setComplexity: (c: BookingState["complexity"]) => void;
  setTimeline: (t: string) => void;
  setBudgetRange: (b: string) => void;
  setEstimate: (e: BookingState["estimate"]) => void;
  setEstimateLoading: (l: boolean) => void;
  setConsultation: (date: string, time: string) => void;
  setContact: (c: Partial<BookingState["contact"]>) => void;
  reset: () => void;
}

const initialState = {
  step: 1,
  projectType: "",
  projectTypeLabel: "",
  answers: {},
  dimensions: { length: "", width: "" },
  complexity: "" as const,
  timeline: "",
  budgetRange: "",
  estimate: null,
  estimateLoading: false,
  consultationDate: "",
  consultationTime: "",
  contact: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  },
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 6) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  setProjectType: (slug, label) =>
    set({ projectType: slug, projectTypeLabel: label }),
  setAnswer: (key, value) =>
    set((s) => ({ answers: { ...s.answers, [key]: value } })),
  setDimensions: (dims) =>
    set((s) => ({ dimensions: { ...s.dimensions, ...dims } })),
  setComplexity: (complexity) => set({ complexity }),
  setTimeline: (timeline) => set({ timeline }),
  setBudgetRange: (budgetRange) => set({ budgetRange }),
  setEstimate: (estimate) => set({ estimate }),
  setEstimateLoading: (estimateLoading) => set({ estimateLoading }),
  setConsultation: (consultationDate, consultationTime) =>
    set({ consultationDate, consultationTime }),
  setContact: (c) => set((s) => ({ contact: { ...s.contact, ...c } })),
  reset: () => set(initialState),
}));
