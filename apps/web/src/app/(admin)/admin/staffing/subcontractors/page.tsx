"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, ArrowLeft, Star } from "lucide-react";

interface Subcontractor {
  id: string;
  companyName: string;
  contactName: string;
  trade: string;
  insuranceStatus: "valid" | "expired" | "pending";
  w9Status: "received" | "pending" | "missing";
  rating: number;
  phone: string;
}

const mockSubs: Subcontractor[] = [
  {
    id: "1",
    companyName: "Northshore Plumbing Co.",
    contactName: "Bill Harrison",
    trade: "Plumbing",
    insuranceStatus: "valid",
    w9Status: "received",
    rating: 5,
    phone: "(231) 555-0401",
  },
  {
    id: "2",
    companyName: "Apex Electrical Services",
    contactName: "Rosa Diaz",
    trade: "Electrical",
    insuranceStatus: "valid",
    w9Status: "received",
    rating: 4,
    phone: "(231) 555-0402",
  },
  {
    id: "3",
    companyName: "Lakeview HVAC",
    contactName: "Gary Patterson",
    trade: "HVAC",
    insuranceStatus: "expired",
    w9Status: "pending",
    rating: 3,
    phone: "(231) 555-0403",
  },
  {
    id: "4",
    companyName: "Summit Concrete & Masonry",
    contactName: "Ana Reyes",
    trade: "Concrete",
    insuranceStatus: "pending",
    w9Status: "received",
    rating: 4,
    phone: "(231) 555-0404",
  },
];

const insuranceBadge = (status: Subcontractor["insuranceStatus"]) => {
  const styles = {
    valid: "bg-green-50 text-green-700",
    expired: "bg-red-50 text-red-700",
    pending: "bg-amber-50 text-amber-700",
  };
  return styles[status];
};

const w9Badge = (status: Subcontractor["w9Status"]) => {
  const styles = {
    received: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    missing: "bg-red-50 text-red-700",
  };
  return styles[status];
};

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

export default function SubcontractorsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockSubs.filter(
    (s) =>
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.trade.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-bold text-black">Subcontractors</h1>
          <p className="text-sm text-[#888]">
            {mockSubs.length} subcontractors
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Subcontractor
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
          <Input
            placeholder="Search subcontractors..."
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
                  Trade
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Insurance
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  W9
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-black">
                      {sub.companyName}
                    </p>
                    <p className="text-xs text-[#888]">
                      {sub.contactName} &middot; {sub.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {sub.trade}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${insuranceBadge(sub.insuranceStatus)}`}
                    >
                      {sub.insuranceStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${w9Badge(sub.w9Status)}`}
                    >
                      {sub.w9Status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <StarRating rating={sub.rating} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-[#888]"
                  >
                    No subcontractors found
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
