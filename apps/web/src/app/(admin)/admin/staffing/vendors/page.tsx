"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ArrowLeft, Star } from "lucide-react";

interface Vendor {
  id: string;
  companyName: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  rating: number;
}

const mockVendors: Vendor[] = [
  {
    id: "1",
    companyName: "Traverse Lumber Supply",
    category: "Lumber & Framing",
    contactName: "Chris Wade",
    phone: "(231) 555-0501",
    email: "chris@traverselumber.com",
    rating: 5,
  },
  {
    id: "2",
    companyName: "Northern Hardware Co.",
    category: "Hardware & Fasteners",
    contactName: "Pat Sullivan",
    phone: "(231) 555-0502",
    email: "pat@northernhw.com",
    rating: 4,
  },
  {
    id: "3",
    companyName: "Great Lakes Tile & Stone",
    category: "Tile & Flooring",
    contactName: "Yuki Tanaka",
    phone: "(231) 555-0503",
    email: "yuki@gltile.com",
    rating: 4,
  },
  {
    id: "4",
    companyName: "Bay Area Equipment Rental",
    category: "Equipment Rental",
    contactName: "Dan Kowalski",
    phone: "(231) 555-0504",
    email: "dan@bayequip.com",
    rating: 3,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function VendorsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockVendors.filter(
    (v) =>
      v.companyName.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-1">
        <Link
          href="/admin/staffing"
          className="inline-flex items-center gap-1 text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Staffing
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Vendors</h1>
          <p className="text-sm text-[#888]">
            {mockVendors.length} vendors
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Vendor
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
          <Input
            placeholder="Search vendors..."
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
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Company
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Contact
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Phone
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-black">
                      {vendor.companyName}
                    </p>
                    <p className="text-xs text-[#888]">{vendor.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {vendor.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {vendor.contactName}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {vendor.phone}
                  </td>
                  <td className="px-4 py-3">
                    <StarRating rating={vendor.rating} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-[#888]"
                  >
                    No vendors found
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
