"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, ArrowLeft, Star } from "lucide-react";
import {
  useVendors,
  useCreateVendor,
  useDeleteVendor,
} from "@/lib/hooks/use-employees";

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

  const { data: vendorsData, isLoading } = useVendors();
  const createVendor = useCreateVendor();
  const deleteVendor = useDeleteVendor();

  const vendors = (vendorsData ?? []) as Record<string, unknown>[];

  const filtered = vendors.filter((v) => {
    const company = String(v.company_name ?? "");
    const category = String(v.category ?? "");
    return (
      company.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAdd = () => {
    createVendor.mutate({ company_name: "New Vendor", category: "" });
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-1 h-4 w-16" />
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-1 h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-28" />
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
          <h1 className="text-2xl font-bold text-black">Vendors</h1>
          <p className="text-sm text-[#888]">
            {vendors.length} vendors
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
          onClick={handleAdd}
          disabled={createVendor.isPending}
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
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((vendor) => {
                const id = String(vendor.id);
                const company = String(vendor.company_name ?? "");
                const email = vendor.email ? String(vendor.email) : null;
                const category = vendor.category
                  ? String(vendor.category)
                  : "";
                const contact = vendor.contact_name
                  ? String(vendor.contact_name)
                  : "";
                const phone = vendor.phone ? String(vendor.phone) : "";
                const rating = Number(vendor.rating) || 0;

                return (
                  <tr key={id} className="hover:bg-[#f8f8f8]">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-black">
                        {company}
                      </p>
                      {email ? (
                        <p className="text-xs text-[#888]">{email}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">
                      {category}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">
                      {contact}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">{phone}</td>
                    <td className="px-4 py-3">
                      {rating > 0 ? (
                        <StarRating rating={rating} />
                      ) : (
                        <span className="text-xs text-[#888]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteVendor.mutate(id)}
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
                    No vendors found.
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
