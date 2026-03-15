"use client";

import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Sparkles,
  FileText,
  Calculator,
  Mail,
  MessageSquare,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Generation {
  id: string;
  type: string;
  typeIcon: React.ElementType;
  model: string;
  provider: string;
  date: string;
  tokens: number;
  cost: string;
  feedback: "positive" | "negative" | null;
  prompt: string;
  output: string;
}

const generations: Generation[] = [
  { id: "g1", type: "Scope", typeIcon: FileText, model: "claude-sonnet-4-6", provider: "Anthropic", date: "Today, 10:33 AM", tokens: 1847, cost: "$0.028", feedback: "positive", prompt: "Generate scope for Johnson kitchen renovation...", output: "1. Demolition & Preparation\n- Remove existing cabinetry..." },
  { id: "g2", type: "Estimate", typeIcon: Calculator, model: "claude-sonnet-4-6", provider: "Anthropic", date: "Today, 9:15 AM", tokens: 923, cost: "$0.014", feedback: "positive", prompt: "Estimate for 400 sqft composite deck...", output: "Materials: $8,200 - $11,700\nLabor: $5,400 - $7,900..." },
  { id: "g3", type: "Contract", typeIcon: FileText, model: "gpt-4o", provider: "OpenAI", date: "Today, 8:42 AM", tokens: 3241, cost: "$0.065", feedback: null, prompt: "Generate construction contract for Williams bathroom remodel...", output: "CONSTRUCTION CONTRACT\nThis agreement is entered into..." },
  { id: "g4", type: "Email", typeIcon: Mail, model: "claude-sonnet-4-6", provider: "Anthropic", date: "Yesterday, 4:30 PM", tokens: 412, cost: "$0.006", feedback: "positive", prompt: "Write follow-up email for Thompson estimate...", output: "Dear Mr. Thompson,\n\nThank you for the opportunity..." },
  { id: "g5", type: "Chat", typeIcon: MessageSquare, model: "claude-sonnet-4-6", provider: "Anthropic", date: "Yesterday, 3:12 PM", tokens: 1523, cost: "$0.023", feedback: null, prompt: "What should I charge for a bathroom remodel?", output: "For a standard bathroom remodel in your area..." },
  { id: "g6", type: "Lead Score", typeIcon: Target, model: "claude-sonnet-4-6", provider: "Anthropic", date: "Yesterday, 2:45 PM", tokens: 287, cost: "$0.004", feedback: null, prompt: "Score lead: Sarah Chen, kitchen remodel...", output: "Lead Score: 82/100\nFactors: Budget confirmed..." },
  { id: "g7", type: "Scope", typeIcon: FileText, model: "claude-sonnet-4-6", provider: "Anthropic", date: "Yesterday, 1:20 PM", tokens: 2104, cost: "$0.032", feedback: "negative", prompt: "Scope for basement finishing project...", output: "1. Framing & Insulation\n- Frame walls per approved plan..." },
  { id: "g8", type: "Estimate", typeIcon: Calculator, model: "gpt-4o", provider: "OpenAI", date: "Yesterday, 11:00 AM", tokens: 876, cost: "$0.018", feedback: "positive", prompt: "Material estimate for master bath remodel...", output: "Tile (floor + shower): $1,800 - $2,400\nVanity: $600..." },
  { id: "g9", type: "Email", typeIcon: Mail, model: "claude-sonnet-4-6", provider: "Anthropic", date: "2 days ago", tokens: 389, cost: "$0.006", feedback: "positive", prompt: "Write payment reminder for overdue invoice...", output: "Dear Client,\n\nThis is a friendly reminder..." },
  { id: "g10", type: "Chat", typeIcon: MessageSquare, model: "claude-sonnet-4-6", provider: "Anthropic", date: "2 days ago", tokens: 1876, cost: "$0.028", feedback: "positive", prompt: "Help me write a change order clause...", output: "Here are recommended change order provisions..." },
  { id: "g11", type: "Contract", typeIcon: FileText, model: "claude-sonnet-4-6", provider: "Anthropic", date: "2 days ago", tokens: 2987, cost: "$0.045", feedback: null, prompt: "Generate subcontractor agreement...", output: "SUBCONTRACTOR AGREEMENT\nThis subcontractor agreement..." },
  { id: "g12", type: "Scope", typeIcon: FileText, model: "gpt-4o", provider: "OpenAI", date: "3 days ago", tokens: 1654, cost: "$0.033", feedback: "positive", prompt: "Generate scope for exterior painting project...", output: "1. Surface Preparation\n- Power wash all surfaces..." },
  { id: "g13", type: "Estimate", typeIcon: Calculator, model: "claude-sonnet-4-6", provider: "Anthropic", date: "3 days ago", tokens: 743, cost: "$0.011", feedback: null, prompt: "Quick estimate for fence replacement 150 linear ft...", output: "Materials: $2,400 - $3,600\nLabor: $1,800 - $2,700..." },
  { id: "g14", type: "Lead Score", typeIcon: Target, model: "claude-sonnet-4-6", provider: "Anthropic", date: "4 days ago", tokens: 301, cost: "$0.005", feedback: null, prompt: "Score lead: Mike Davis, handyman services...", output: "Lead Score: 45/100\nFactors: Low budget indicator..." },
  { id: "g15", type: "Email", typeIcon: Mail, model: "claude-sonnet-4-6", provider: "Anthropic", date: "4 days ago", tokens: 456, cost: "$0.007", feedback: "positive", prompt: "Write project completion email...", output: "Dear Mrs. Anderson,\n\nWe are pleased to inform you..." },
];

export default function AIHistoryPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const types = ["all", "Scope", "Estimate", "Contract", "Email", "Chat", "Lead Score"];
  const filtered = typeFilter === "all" ? generations : generations.filter((g) => g.type === typeFilter);

  const totalCost = generations.reduce((s, g) => s + parseFloat(g.cost.replace("$", "")), 0);
  const totalTokens = generations.reduce((s, g) => s + g.tokens, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">AI Generation History</h1>
          <p className="mt-1 text-sm text-[#888]">
            {generations.length} generations &middot; {totalTokens.toLocaleString()} tokens &middot; ${totalCost.toFixed(2)} total cost
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              typeFilter === t
                ? "bg-black text-white"
                : "border border-[#e0dbd5] text-[#888] hover:text-black"
            }`}
          >
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[#e0dbd5]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e0dbd5] bg-[#f8f8f8]">
              <th className="px-4 py-3 text-left font-medium text-[#888]">Type</th>
              <th className="hidden px-4 py-3 text-left font-medium text-[#888] md:table-cell">Model</th>
              <th className="px-4 py-3 text-left font-medium text-[#888]">Date</th>
              <th className="hidden px-4 py-3 text-right font-medium text-[#888] sm:table-cell">Tokens</th>
              <th className="hidden px-4 py-3 text-right font-medium text-[#888] sm:table-cell">Cost</th>
              <th className="px-4 py-3 text-center font-medium text-[#888]">Feedback</th>
              <th className="px-4 py-3 text-center font-medium text-[#888]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((gen) => (
              <React.Fragment key={gen.id}>
                <tr className="border-b border-[#e0dbd5] hover:bg-[#f8f8f8]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <gen.typeIcon className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                      <span className="font-medium text-black">{gen.type}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <Badge variant="outline" className="border-[#e0dbd5] text-xs text-[#888]">
                      {gen.model}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#888]">{gen.date}</td>
                  <td className="hidden px-4 py-3 text-right text-[#888] sm:table-cell">
                    {gen.tokens.toLocaleString()}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-[#888] sm:table-cell">
                    {gen.cost}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {gen.feedback === "positive" && (
                      <ThumbsUp className="mx-auto h-4 w-4 text-green-700" strokeWidth={1.5} />
                    )}
                    {gen.feedback === "negative" && (
                      <ThumbsDown className="mx-auto h-4 w-4 text-red-600" strokeWidth={1.5} />
                    )}
                    {gen.feedback === null && (
                      <span className="text-xs text-[#888]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setExpandedId(expandedId === gen.id ? null : gen.id)}>
                      {expandedId === gen.id ? (
                        <ChevronUp className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedId === gen.id && (
                  <tr className="border-b border-[#e0dbd5]">
                    <td colSpan={7} className="bg-[#f8f8f8] px-4 py-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-medium uppercase text-[#888]">Prompt</span>
                          <p className="mt-1 text-sm text-black">{gen.prompt}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium uppercase text-[#888]">Output Preview</span>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-[#888]">
                            {gen.output.slice(0, 200)}...
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-[#e0dbd5] text-xs">
                            <ThumbsUp className="mr-1 h-3 w-3" /> Helpful
                          </Button>
                          <Button variant="outline" size="sm" className="border-[#e0dbd5] text-xs">
                            <ThumbsDown className="mr-1 h-3 w-3" /> Not Helpful
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
