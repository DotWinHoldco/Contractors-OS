"use client";

import React from "react";
import {
  FlaskConical,
  Plus,
  Trophy,
  ArrowRight,
  Clock,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ABTest {
  id: string;
  name: string;
  module: string;
  variantA: { model: string; provider: string };
  variantB: { model: string; provider: string };
  trafficSplit: number;
  status: "running" | "completed" | "draft";
  startDate: string;
  metrics?: {
    variantA: { requests: number; avgLatency: string; avgCost: string; qualityScore: number };
    variantB: { requests: number; avgLatency: string; avgCost: string; qualityScore: number };
  };
  winner?: "A" | "B";
}

const tests: ABTest[] = [
  {
    id: "t1",
    name: "Contract Drafter Model Comparison",
    module: "contract_drafter",
    variantA: { model: "claude-sonnet-4-6", provider: "Anthropic" },
    variantB: { model: "gpt-4o", provider: "OpenAI" },
    trafficSplit: 50,
    status: "running",
    startDate: "Mar 10, 2026",
    metrics: {
      variantA: { requests: 156, avgLatency: "2.3s", avgCost: "$0.042", qualityScore: 4.2 },
      variantB: { requests: 148, avgLatency: "1.8s", avgCost: "$0.038", qualityScore: 4.0 },
    },
  },
  {
    id: "t2",
    name: "Scope Generator Temperature Test",
    module: "scope_generator",
    variantA: { model: "claude-sonnet-4-6 (temp: 0.3)", provider: "Anthropic" },
    variantB: { model: "claude-sonnet-4-6 (temp: 0.6)", provider: "Anthropic" },
    trafficSplit: 50,
    status: "running",
    startDate: "Mar 12, 2026",
    metrics: {
      variantA: { requests: 67, avgLatency: "2.1s", avgCost: "$0.031", qualityScore: 4.4 },
      variantB: { requests: 71, avgLatency: "2.2s", avgCost: "$0.033", qualityScore: 4.1 },
    },
  },
  {
    id: "t3",
    name: "Email Writer Provider Comparison",
    module: "email_writer",
    variantA: { model: "claude-sonnet-4-6", provider: "Anthropic" },
    variantB: { model: "gpt-4o-mini", provider: "OpenAI" },
    trafficSplit: 50,
    status: "completed",
    startDate: "Feb 20, 2026",
    metrics: {
      variantA: { requests: 412, avgLatency: "1.4s", avgCost: "$0.008", qualityScore: 4.5 },
      variantB: { requests: 398, avgLatency: "0.9s", avgCost: "$0.003", qualityScore: 3.8 },
    },
    winner: "A",
  },
];

function MetricCard({ label, valueA, valueB, highlight }: { label: string; valueA: string | number; valueB: string | number; highlight?: "A" | "B" }) {
  return (
    <div className="rounded-lg border border-[#e0dbd5] p-3">
      <span className="text-xs font-medium text-[#888]">{label}</span>
      <div className="mt-1 flex items-center gap-3">
        <span className={`text-sm font-semibold ${highlight === "A" ? "text-black" : "text-[#888]"}`}>
          A: {valueA}
        </span>
        <span className="text-[#e0dbd5]">|</span>
        <span className={`text-sm font-semibold ${highlight === "B" ? "text-black" : "text-[#888]"}`}>
          B: {valueB}
        </span>
      </div>
    </div>
  );
}

export default function ABTestsPage() {
  const running = tests.filter((t) => t.status === "running");
  const completed = tests.filter((t) => t.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">A/B Tests</h1>
          <p className="mt-1 text-sm text-[#888]">
            Compare AI models and configurations
          </p>
        </div>
        <Button className="bg-black text-white hover:bg-black/90">
          <Plus className="mr-2 h-4 w-4" />
          New Test
        </Button>
      </div>

      {/* Running Tests */}
      {running.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-black">
            <Clock className="h-5 w-5" strokeWidth={1.5} />
            Running Tests
          </h2>
          {running.map((test) => (
            <Card key={test.id} className="border-[#e0dbd5]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-black">{test.name}</h3>
                    <p className="text-xs text-[#888]">Module: {test.module} &middot; Started {test.startDate}</p>
                  </div>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    Running
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Variants */}
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-[#e0dbd5] text-black">
                    A: {test.variantA.model}
                  </Badge>
                  <span className="text-xs text-[#888]">vs</span>
                  <Badge variant="outline" className="border-[#e0dbd5] text-black">
                    B: {test.variantB.model}
                  </Badge>
                  <span className="text-xs text-[#888]">({test.trafficSplit}/{100 - test.trafficSplit} split)</span>
                </div>

                {/* Metrics */}
                {test.metrics && (
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <MetricCard label="Requests" valueA={test.metrics.variantA.requests} valueB={test.metrics.variantB.requests} />
                    <MetricCard label="Avg Latency" valueA={test.metrics.variantA.avgLatency} valueB={test.metrics.variantB.avgLatency} highlight={parseFloat(test.metrics.variantA.avgLatency) < parseFloat(test.metrics.variantB.avgLatency) ? "A" : "B"} />
                    <MetricCard label="Avg Cost" valueA={test.metrics.variantA.avgCost} valueB={test.metrics.variantB.avgCost} highlight={parseFloat(test.metrics.variantA.avgCost.replace("$", "")) < parseFloat(test.metrics.variantB.avgCost.replace("$", "")) ? "A" : "B"} />
                    <MetricCard label="Quality Score" valueA={test.metrics.variantA.qualityScore} valueB={test.metrics.variantB.qualityScore} highlight={test.metrics.variantA.qualityScore > test.metrics.variantB.qualityScore ? "A" : "B"} />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-[#e0dbd5] text-xs">
                    End Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Completed Tests */}
      {completed.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-black">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
            Completed Tests
          </h2>
          {completed.map((test) => (
            <Card key={test.id} className="border-[#e0dbd5]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-black">{test.name}</h3>
                    <p className="text-xs text-[#888]">Module: {test.module} &middot; Started {test.startDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-[#D4A84B] bg-[#D4A84B]/10 text-[#D4A84B]">
                      <Trophy className="mr-1 h-3 w-3" /> Winner: Variant {test.winner}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`border-[#e0dbd5] ${test.winner === "A" ? "bg-black text-white" : "text-[#888]"}`}>
                    A: {test.variantA.model}
                  </Badge>
                  <span className="text-xs text-[#888]">vs</span>
                  <Badge variant="outline" className={`border-[#e0dbd5] ${test.winner === "B" ? "bg-black text-white" : "text-[#888]"}`}>
                    B: {test.variantB.model}
                  </Badge>
                </div>

                {test.metrics && (
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <MetricCard label="Requests" valueA={test.metrics.variantA.requests} valueB={test.metrics.variantB.requests} />
                    <MetricCard label="Avg Latency" valueA={test.metrics.variantA.avgLatency} valueB={test.metrics.variantB.avgLatency} />
                    <MetricCard label="Avg Cost" valueA={test.metrics.variantA.avgCost} valueB={test.metrics.variantB.avgCost} />
                    <MetricCard label="Quality Score" valueA={test.metrics.variantA.qualityScore} valueB={test.metrics.variantB.qualityScore} />
                  </div>
                )}

                <Button className="bg-black text-white hover:bg-black/90" size="sm">
                  Apply Winner
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
