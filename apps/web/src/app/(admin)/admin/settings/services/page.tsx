"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppUser } from "@/lib/hooks/use-app-user";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

export default function ServicesPage() {
  const { appUser } = useAppUser();
  const tenantId = appUser?.tenantId ?? undefined;
  const supabase = createClient();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");

  const { data: services, isLoading } = useQuery({
    queryKey: ["service-catalog", tenantId],
    queryFn: async () => {
      let q = supabase
        .from("service_catalog")
        .select("id, name, slug, trade_category, base_price, is_active, is_featured, created_at");
      if (tenantId) q = q.eq("tenant_id", tenantId);
      const { data, error } = await q.is("deleted_at", null).order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("service_catalog")
        .update({ deleted_at: new Date().toISOString() } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["service-catalog", tenantId] });
      toast.success("Service removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const serviceList = services ?? [];
  const filtered = serviceList.filter(
    (s) =>
      (s.name as string).toLowerCase().includes(search.toLowerCase()) ||
      ((s.trade_category as string) ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (cents: number | null) => {
    if (!cents) return "--";
    return `$${(cents / 100).toLocaleString()}`;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Service Catalog</h1>
          {isLoading ? (
            <Skeleton className="mt-1 h-5 w-40" />
          ) : (
            <p className="text-sm text-[#888]">
              {serviceList.length} services configured
            </p>
          )}
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
      {isLoading ? (
        <Card className="border border-[#e0dbd5] shadow-none p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border border-[#e0dbd5] shadow-none">
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-[#888]">
              {search ? "No services match your search." : "No services configured yet."}
            </p>
          </div>
        </Card>
      ) : (
        <Card className="border border-[#e0dbd5] shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0dbd5] text-left">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Name</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Category</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Base Price</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Status</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Featured</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0dbd5]">
                {filtered.map((service) => {
                  const isActive = (service.is_active as boolean | null) !== false;
                  const isFeatured = (service.is_featured as boolean | null) === true;
                  return (
                    <tr key={service.id as string} className="hover:bg-[#f8f8f8]">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-black">{service.name as string}</p>
                        {(service.slug as string | null) ? (
                          <p className="text-xs text-[#888]">{service.slug as string}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        {(service.trade_category as string | null) ? (
                          <Badge variant="secondary" className="text-[10px] capitalize">
                            {(service.trade_category as string).replace(/_/g, " ")}
                          </Badge>
                        ) : (
                          <span className="text-xs text-[#888]">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-black">
                        {formatPrice(service.base_price as number | null)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-[#ccc]"
                            }`}
                          />
                          <span className="text-xs text-[#888]">
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {isFeatured ? (
                          <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                            <Star className="mr-1 h-3 w-3" strokeWidth={1.5} />
                            Featured
                          </Badge>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#888] hover:text-black"
                          >
                            <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#888] hover:text-red-600"
                            onClick={() => deleteMutation.mutate(service.id as string)}
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
