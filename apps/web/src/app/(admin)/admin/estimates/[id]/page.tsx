"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Save,
  Send,
  Plus,
  Trash2,
} from "lucide-react";

interface LineItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  unitCost: number;
}

interface Section {
  id: string;
  name: string;
  items: LineItem[];
  expanded: boolean;
}

const initialSections: Section[] = [
  {
    id: "demo",
    name: "Demolition",
    expanded: true,
    items: [
      { id: "d1", name: "Remove existing cabinets", qty: 1, unit: "lot", unitCost: 1800 },
      { id: "d2", name: "Remove countertops", qty: 1, unit: "lot", unitCost: 600 },
      { id: "d3", name: "Haul-away & dumpster", qty: 1, unit: "ea", unitCost: 950 },
    ],
  },
  {
    id: "cab",
    name: "Cabinetry",
    expanded: true,
    items: [
      { id: "c1", name: "Base cabinets (soft-close)", qty: 12, unit: "lf", unitCost: 350 },
      { id: "c2", name: "Wall cabinets (soft-close)", qty: 10, unit: "lf", unitCost: 280 },
      { id: "c3", name: "Island cabinet", qty: 1, unit: "ea", unitCost: 2400 },
      { id: "c4", name: "Cabinet hardware", qty: 24, unit: "ea", unitCost: 18 },
    ],
  },
  {
    id: "counter",
    name: "Countertops",
    expanded: false,
    items: [
      { id: "ct1", name: "Quartz countertop (installed)", qty: 45, unit: "sf", unitCost: 85 },
      { id: "ct2", name: "Backsplash tile", qty: 30, unit: "sf", unitCost: 22 },
    ],
  },
  {
    id: "elec",
    name: "Electrical",
    expanded: false,
    items: [
      { id: "e1", name: "Recessed lighting", qty: 8, unit: "ea", unitCost: 175 },
      { id: "e2", name: "Under-cabinet lighting", qty: 10, unit: "lf", unitCost: 45 },
      { id: "e3", name: "Dedicated appliance circuits", qty: 3, unit: "ea", unitCost: 350 },
    ],
  },
  {
    id: "plumb",
    name: "Plumbing",
    expanded: false,
    items: [
      { id: "p1", name: "Sink & faucet install", qty: 1, unit: "ea", unitCost: 850 },
      { id: "p2", name: "Dishwasher hookup", qty: 1, unit: "ea", unitCost: 275 },
      { id: "p3", name: "Gas line for range", qty: 1, unit: "ea", unitCost: 450 },
    ],
  },
  {
    id: "floor",
    name: "Flooring",
    expanded: false,
    items: [
      { id: "f1", name: "LVP flooring (installed)", qty: 180, unit: "sf", unitCost: 8.5 },
      { id: "f2", name: "Transition strips", qty: 3, unit: "ea", unitCost: 45 },
    ],
  },
];

const TAX_RATE = 0.07;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function EstimateDetailPage() {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [aiLoading, setAiLoading] = useState(false);

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, expanded: !s.expanded } : s))
    );
  };

  const updateItem = (
    sectionId: string,
    itemId: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : s
      )
    );
  };

  const addItem = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              expanded: true,
              items: [
                ...s.items,
                {
                  id: `new-${Date.now()}`,
                  name: "",
                  qty: 1,
                  unit: "ea",
                  unitCost: 0,
                },
              ],
            }
          : s
      )
    );
  };

  const removeItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((item) => item.id !== itemId) }
          : s
      )
    );
  };

  const sectionTotal = (section: Section) =>
    section.items.reduce((sum, item) => sum + item.qty * item.unitCost, 0);

  const subtotal = sections.reduce((sum, s) => sum + sectionTotal(s), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handleGenerateAI = () => {
    setAiLoading(true);
    // Simulated toast/loading
    setTimeout(() => setAiLoading(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/estimates"
          className="mb-3 inline-flex items-center gap-1 text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Back to Estimates
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-black">EST-001</h1>
              <Badge className="bg-gray-100 text-[10px] text-gray-700">Draft</Badge>
            </div>
            <p className="text-sm text-[#888]">Sarah Mitchell &mdash; Kitchen Remodel</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#e0dbd5] text-xs"
              onClick={handleGenerateAI}
              disabled={aiLoading}
            >
              <Sparkles className="mr-1 h-3 w-3" strokeWidth={1.5} />
              {aiLoading ? "AI generating scope..." : "Generate with AI"}
            </Button>
            <Button variant="outline" size="sm" className="border-[#e0dbd5] text-xs">
              <Save className="mr-1 h-3 w-3" strokeWidth={1.5} />
              Save Draft
            </Button>
            <Button size="sm" className="bg-black text-xs text-white hover:bg-black/90">
              <Send className="mr-1 h-3 w-3" strokeWidth={1.5} />
              Send to Client
            </Button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section) => (
          <Card key={section.id} className="border border-[#e0dbd5] shadow-none">
            <CardHeader
              className="cursor-pointer select-none px-4 py-3"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {section.expanded ? (
                    <ChevronDown className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                  )}
                  <h3 className="text-sm font-semibold text-black">{section.name}</h3>
                  <span className="text-xs text-[#888]">
                    ({section.items.length} item{section.items.length !== 1 ? "s" : ""})
                  </span>
                </div>
                <span className="text-sm font-semibold text-black">
                  {formatCurrency(sectionTotal(section))}
                </span>
              </div>
            </CardHeader>
            {section.expanded && (
              <CardContent className="px-4 pb-4 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#e0dbd5] text-left">
                        <th className="pb-2 pr-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                          Item
                        </th>
                        <th className="pb-2 pr-3 text-xs font-bold uppercase tracking-widest text-[#888] w-20">
                          Qty
                        </th>
                        <th className="pb-2 pr-3 text-xs font-bold uppercase tracking-widest text-[#888] w-20">
                          Unit
                        </th>
                        <th className="pb-2 pr-3 text-xs font-bold uppercase tracking-widest text-[#888] w-28">
                          Unit Cost
                        </th>
                        <th className="pb-2 text-xs font-bold uppercase tracking-widest text-[#888] w-28 text-right">
                          Total
                        </th>
                        <th className="pb-2 w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0dbd5]">
                      {section.items.map((item) => (
                        <tr key={item.id} className="group">
                          <td className="py-2 pr-3">
                            <Input
                              value={item.name}
                              onChange={(e) =>
                                updateItem(section.id, item.id, "name", e.target.value)
                              }
                              className="h-8 text-sm"
                              placeholder="Item name"
                            />
                          </td>
                          <td className="py-2 pr-3">
                            <Input
                              type="number"
                              value={item.qty}
                              onChange={(e) =>
                                updateItem(section.id, item.id, "qty", Number(e.target.value))
                              }
                              className="h-8 text-sm w-20"
                              min={0}
                            />
                          </td>
                          <td className="py-2 pr-3">
                            <Input
                              value={item.unit}
                              onChange={(e) =>
                                updateItem(section.id, item.id, "unit", e.target.value)
                              }
                              className="h-8 text-sm w-20"
                            />
                          </td>
                          <td className="py-2 pr-3">
                            <Input
                              type="number"
                              value={item.unitCost}
                              onChange={(e) =>
                                updateItem(
                                  section.id,
                                  item.id,
                                  "unitCost",
                                  Number(e.target.value)
                                )
                              }
                              className="h-8 text-sm w-28"
                              min={0}
                              step={0.01}
                            />
                          </td>
                          <td className="py-2 text-right text-sm font-semibold text-black">
                            {formatCurrency(item.qty * item.unitCost)}
                          </td>
                          <td className="py-2 text-center">
                            <button
                              onClick={() => removeItem(section.id, item.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-400 hover:text-red-600" strokeWidth={1.5} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => addItem(section.id)}
                  className="mt-2 flex items-center gap-1 text-xs text-[#888] hover:text-black"
                >
                  <Plus className="h-3 w-3" strokeWidth={1.5} />
                  Add line item
                </button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Totals */}
      <Card className="mt-4 border border-[#e0dbd5] shadow-none">
        <CardContent className="p-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#888]">Subtotal</span>
                <span className="font-semibold text-black">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#888]">Tax (7%)</span>
                <span className="font-semibold text-black">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-[#e0dbd5] pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-black">Total</span>
                  <span className="text-lg font-bold text-black">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
