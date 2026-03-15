"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, MoreHorizontal } from "lucide-react";

interface Template {
  id: string;
  name: string;
  type: "construction" | "remodel" | "subcontractor" | "service";
  tradeCategory: string;
  lastUpdated: string;
}

const mockTemplates: Template[] = [
  { id: "1", name: "Standard Construction Agreement", type: "construction", tradeCategory: "General", lastUpdated: "Mar 10, 2026" },
  { id: "2", name: "Remodel Agreement", type: "remodel", tradeCategory: "General", lastUpdated: "Mar 5, 2026" },
  { id: "3", name: "Subcontractor Agreement", type: "subcontractor", tradeCategory: "All Trades", lastUpdated: "Feb 28, 2026" },
  { id: "4", name: "Service Agreement", type: "service", tradeCategory: "Maintenance", lastUpdated: "Feb 20, 2026" },
];

const typeColors: Record<Template["type"], string> = {
  construction: "bg-blue-100 text-blue-700",
  remodel: "bg-amber-100 text-amber-700",
  subcontractor: "bg-purple-100 text-purple-700",
  service: "bg-emerald-100 text-emerald-700",
};

export default function ContractTemplatesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tradeCategory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-2">
        <Link
          href="/admin/settings"
          className="text-xs text-[#888] hover:text-black"
        >
          Settings
        </Link>
        <span className="mx-1.5 text-xs text-[#888]">/</span>
        <span className="text-xs text-black">Contract Templates</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Contract Templates</h1>
          <p className="text-sm text-[#888]">
            {mockTemplates.length} templates
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          New Template
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" strokeWidth={1.5} />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="border border-[#e0dbd5] shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0dbd5] text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Name</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Type</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Trade Category</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Last Updated</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((template) => (
                <tr key={template.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-black">
                      <FileText className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                      {template.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${typeColors[template.type]}`}
                    >
                      {template.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">{template.tradeCategory}</td>
                  <td className="px-4 py-3 text-xs text-[#888]">{template.lastUpdated}</td>
                  <td className="px-4 py-3">
                    <button className="rounded p-1 text-[#888] hover:bg-[#f0f0f0] hover:text-black">
                      <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#888]">
                    No templates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
