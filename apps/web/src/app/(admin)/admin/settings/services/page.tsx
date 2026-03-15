"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Pencil,
  Star,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  basePrice: string;
  active: boolean;
  featured: boolean;
}

const mockServices: Service[] = [
  { id: "1", name: "Kitchen Remodeling", slug: "kitchen-remodeling", category: "Interior", basePrice: "$25,000", active: true, featured: true },
  { id: "2", name: "Bathroom Remodeling", slug: "bathroom-remodeling", category: "Interior", basePrice: "$15,000", active: true, featured: true },
  { id: "3", name: "Basement Finishing", slug: "basement-finishing", category: "Interior", basePrice: "$35,000", active: true, featured: false },
  { id: "4", name: "Deck Construction", slug: "deck-construction", category: "Exterior", basePrice: "$18,000", active: true, featured: true },
  { id: "5", name: "Roofing", slug: "roofing", category: "Exterior", basePrice: "$12,000", active: true, featured: false },
  { id: "6", name: "Siding", slug: "siding", category: "Exterior", basePrice: "$14,000", active: true, featured: false },
  { id: "7", name: "New Construction", slug: "new-construction", category: "Construction", basePrice: "$250,000", active: true, featured: true },
  { id: "8", name: "Additions", slug: "additions", category: "Construction", basePrice: "$85,000", active: true, featured: false },
  { id: "9", name: "Handyman", slug: "handyman", category: "General", basePrice: "$500", active: false, featured: false },
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockServices.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Service Catalog</h1>
          <p className="text-sm text-[#888]">
            {mockServices.length} services configured
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" strokeWidth={1.5} />
          Add Service
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" strokeWidth={1.5} />
          <Input
            placeholder="Search services..."
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
                  Base Price
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Featured
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((service) => (
                <tr key={service.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-black">
                      {service.name}
                    </p>
                    <p className="text-xs text-[#888]">{service.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {service.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-black">
                    {service.basePrice}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          service.active ? "bg-emerald-500" : "bg-[#ccc]"
                        }`}
                      />
                      <span className="text-xs text-[#888]">
                        {service.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {service.featured && (
                      <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                        <Star className="mr-1 h-3 w-3" strokeWidth={1.5} />
                        Featured
                      </Badge>
                    )}
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
