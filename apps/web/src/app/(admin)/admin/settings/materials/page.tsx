"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Pencil,
} from "lucide-react";

interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  unitCost: string;
  supplier: string;
}

const mockMaterials: Material[] = [
  { id: "1", name: "Quartz Countertop", category: "Countertops", unit: "sq ft", unitCost: "$85.00", supplier: "StoneWorks Inc." },
  { id: "2", name: "Subway Tile (3x6)", category: "Tile", unit: "sq ft", unitCost: "$4.50", supplier: "TileMax Supply" },
  { id: "3", name: "Oak Hardwood Flooring", category: "Flooring", unit: "sq ft", unitCost: "$7.25", supplier: "Northland Lumber" },
  { id: "4", name: "Composite Decking Board", category: "Decking", unit: "linear ft", unitCost: "$5.80", supplier: "BuildRight Materials" },
  { id: "5", name: "Architectural Shingles", category: "Roofing", unit: "bundle", unitCost: "$38.00", supplier: "ABC Supply" },
  { id: "6", name: "Vinyl Siding Panel", category: "Siding", unit: "sq ft", unitCost: "$3.20", supplier: "ABC Supply" },
  { id: "7", name: "Spray Foam Insulation", category: "Insulation", unit: "board ft", unitCost: "$1.50", supplier: "InsulPro" },
  { id: "8", name: "LVP Flooring (Waterproof)", category: "Flooring", unit: "sq ft", unitCost: "$4.75", supplier: "FloorCraft Direct" },
];

export default function MaterialsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockMaterials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase()) ||
      m.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Material Library</h1>
          <p className="text-sm text-[#888]">
            {mockMaterials.length} materials in library
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" strokeWidth={1.5} />
          Add Material
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" strokeWidth={1.5} />
          <Input
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border border-[#e0dbd5] shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0dbd5] text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Unit
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Unit Cost
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Supplier
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((material) => (
                <tr key={material.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-black">
                      {material.name}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {material.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {material.unit}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-black">
                    {material.unitCost}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {material.supplier}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-[#888] hover:text-black"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
