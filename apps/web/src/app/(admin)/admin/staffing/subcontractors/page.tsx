"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, ArrowLeft, Star } from "lucide-react";
import {
  useSubcontractors,
  useCreateSubcontractor,
  useDeleteSubcontractor,
} from "@/lib/hooks/use-employees";

const insuranceBadgeStyle = (status: string) => {
  const styles: Record<string, string> = {
    valid: "bg-green-50 text-green-700",
    expired: "bg-red-50 text-red-700",
    pending: "bg-amber-50 text-amber-700",
  };
  return styles[status] ?? "bg-gray-100 text-gray-700";
};

const w9BadgeStyle = (status: string) => {
  const styles: Record<string, string> = {
    received: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    missing: "bg-red-50 text-red-700",
  };
  return styles[status] ?? "bg-gray-100 text-gray-700";
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

  const { data: subsData, isLoading } = useSubcontractors();
  const createSub = useCreateSubcontractor();
  const deleteSub = useDeleteSubcontractor();

  const subs = (subsData ?? []) as Record<string, unknown>[];

  const filtered = subs.filter((s) => {
    const company = String(s.company_name ?? "");
    const trade = String(s.trade ?? "");
    return (
      company.toLowerCase().includes(search.toLowerCase()) ||
      trade.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAdd = () => {
    createSub.mutate({ company_name: "New Subcontractor", trade: "" });
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-1 h-4 w-16" />
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-1 h-4 w-28" />
          </div>
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="mb-4 h-10 w-full max-w-sm" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

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
            {subs.length} subcontractors
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
          onClick={handleAdd}
          disabled={createSub.isPending}
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
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((sub) => {
                const id = String(sub.id);
                const company = String(sub.company_name ?? "");
                const contact = sub.contact_name
                  ? String(sub.contact_name)
                  : null;
                const phone = sub.phone ? String(sub.phone) : null;
                const trade = sub.trade ? String(sub.trade) : "";
                const insurance = String(sub.insurance_status ?? "");
                const w9 = String(sub.w9_status ?? "");
                const rating = Number(sub.rating) || 0;

                return (
                  <tr key={id} className="hover:bg-[#f8f8f8]">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-black">
                        {company}
                      </p>
                      {contact ? (
                        <p className="text-xs text-[#888]">
                          {contact}
                          {phone ? <> &middot; {phone}</> : null}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">{trade}</td>
                    <td className="px-4 py-3">
                      {insurance ? (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${insuranceBadgeStyle(insurance)}`}
                        >
                          {insurance}
                        </Badge>
                      ) : (
                        <span className="text-xs text-[#888]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {w9 ? (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${w9BadgeStyle(w9)}`}
                        >
                          {w9}
                        </Badge>
                      ) : (
                        <span className="text-xs text-[#888]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {rating > 0 ? (
                        <StarRating rating={rating} />
                      ) : (
                        <span className="text-xs text-[#888]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteSub.mutate(id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-[#888]"
                  >
                    No subcontractors found.
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
