"use client";

import React, { useState } from "react";
import {
  Settings,
  DollarSign,
  Cpu,
  Activity,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface AIModule {
  id: string;
  name: string;
  description: string;
  model: string;
  provider: string;
  temperature: number;
  maxTokens: number;
  status: boolean;
  monthlyRequests: number;
  monthlyCost: string;
}

const modules: AIModule[] = [
  { id: "scope_generator", name: "Scope Generator", description: "Generates detailed scope of work documents", model: "claude-sonnet-4-6", provider: "Anthropic", temperature: 0.4, maxTokens: 4096, status: true, monthlyRequests: 47, monthlyCost: "$12.80" },
  { id: "estimate_builder", name: "Estimate Builder", description: "Creates cost estimates from project details", model: "claude-sonnet-4-6", provider: "Anthropic", temperature: 0.3, maxTokens: 4096, status: true, monthlyRequests: 34, monthlyCost: "$8.50" },
  { id: "contract_drafter", name: "Contract Drafter", description: "Drafts construction contracts and agreements", model: "gpt-4o", provider: "OpenAI", temperature: 0.3, maxTokens: 8192, status: true, monthlyRequests: 12, monthlyCost: "$9.60" },
  { id: "email_writer", name: "Email Writer", description: "Composes professional client communications", model: "claude-sonnet-4-6", provider: "Anthropic", temperature: 0.6, maxTokens: 2048, status: true, monthlyRequests: 89, monthlyCost: "$5.20" },
  { id: "chat", name: "AI Chat", description: "General-purpose assistant for contractor questions", model: "claude-sonnet-4-6", provider: "Anthropic", temperature: 0.7, maxTokens: 4096, status: true, monthlyRequests: 156, monthlyCost: "$28.40" },
  { id: "lead_scorer", name: "Lead Scorer", description: "Evaluates and scores incoming leads", model: "claude-sonnet-4-6", provider: "Anthropic", temperature: 0.2, maxTokens: 1024, status: true, monthlyRequests: 67, monthlyCost: "$2.10" },
  { id: "proposal_writer", name: "Proposal Writer", description: "Creates professional client proposals", model: "claude-sonnet-4-6", provider: "Anthropic", temperature: 0.5, maxTokens: 8192, status: false, monthlyRequests: 8, monthlyCost: "$4.80" },
];

export default function AISettingsPage() {
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalCost = modules.reduce((s, m) => s + parseFloat(m.monthlyCost.replace("$", "")), 0);
  const totalRequests = modules.reduce((s, m) => s + m.monthlyRequests, 0);
  const activeModules = modules.filter((m) => m.status).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-black">AI Module Routing</h1>
        <p className="mt-1 text-sm text-[#888]">
          Configure AI models for each module
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-[#e0dbd5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[#888]">
              <Cpu className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-xs font-medium">Active Modules</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-black">{activeModules}/{modules.length}</p>
          </CardContent>
        </Card>
        <Card className="border-[#e0dbd5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[#888]">
              <Activity className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-xs font-medium">Monthly Requests</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-black">{totalRequests}</p>
          </CardContent>
        </Card>
        <Card className="border-[#e0dbd5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[#888]">
              <DollarSign className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-xs font-medium">Monthly Cost</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-black">${totalCost.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-[#e0dbd5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[#888]">
              <DollarSign className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-xs font-medium">Avg Cost / Request</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-black">
              ${(totalCost / totalRequests).toFixed(3)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modules Table */}
      <div className="overflow-hidden rounded-lg border border-[#e0dbd5]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e0dbd5] bg-[#f8f8f8]">
              <th className="px-4 py-3 text-left font-medium text-[#888]">Module</th>
              <th className="hidden px-4 py-3 text-left font-medium text-[#888] md:table-cell">Model</th>
              <th className="hidden px-4 py-3 text-center font-medium text-[#888] lg:table-cell">Temp</th>
              <th className="hidden px-4 py-3 text-center font-medium text-[#888] lg:table-cell">Max Tokens</th>
              <th className="hidden px-4 py-3 text-right font-medium text-[#888] sm:table-cell">Requests</th>
              <th className="px-4 py-3 text-right font-medium text-[#888]">Cost/mo</th>
              <th className="px-4 py-3 text-center font-medium text-[#888]">Status</th>
              <th className="px-4 py-3 text-center font-medium text-[#888]"></th>
            </tr>
          </thead>
          <tbody>
            {modules.map((mod) => (
              <tr key={mod.id} className="border-b border-[#e0dbd5] hover:bg-[#f8f8f8]/50">
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium text-black">{mod.name}</span>
                    <p className="text-xs text-[#888]">{mod.description}</p>
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <Badge variant="outline" className="border-[#e0dbd5] text-xs text-[#888]">
                    {mod.model}
                  </Badge>
                </td>
                <td className="hidden px-4 py-3 text-center text-[#888] lg:table-cell">{mod.temperature}</td>
                <td className="hidden px-4 py-3 text-center text-[#888] lg:table-cell">{mod.maxTokens.toLocaleString()}</td>
                <td className="hidden px-4 py-3 text-right text-[#888] sm:table-cell">{mod.monthlyRequests}</td>
                <td className="px-4 py-3 text-right text-[#888]">{mod.monthlyCost}</td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant="outline"
                    className={mod.status ? "border-green-200 bg-green-50 text-green-700" : "border-[#e0dbd5] text-[#888]"}
                  >
                    {mod.status ? "Active" : "Paused"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit3 className="h-3.5 w-3.5 text-[#888]" strokeWidth={1.5} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
