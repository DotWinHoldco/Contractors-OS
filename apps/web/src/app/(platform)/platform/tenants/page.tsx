"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";

interface TenantRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  plan: string;
  created_at: string;
  phone: string | null;
  email: string | null;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("tenants")
        .select("id, name, slug, status, plan, created_at, phone, email")
        .order("created_at", { ascending: false });
      setTenants(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    active: "bg-[#2d6a4f] text-white",
    trial: "bg-[#d4a84b] text-black",
    paused: "bg-[#888] text-white",
    suspended: "bg-[#c1292e] text-white",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Tenants</h1>
          <p className="text-sm text-[#888]">Manage all contractor businesses</p>
        </div>
        <Link href="/platform/tenants/new">
          <Button className="gap-2 rounded-md bg-black text-white hover:bg-black/90">
            <Plus className="h-4 w-4" />
            New Tenant
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
        <Input
          placeholder="Search tenants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="border border-[#e0dbd5] bg-white shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-[#888]">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-[#888]">
                    No tenants found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <Link
                        href={`/platform/tenants/${tenant.id}`}
                        className="font-medium text-[#1a1a1a] hover:underline"
                      >
                        {tenant.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-[#888]">{tenant.slug}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs font-semibold",
                          statusColor[tenant.status] || "bg-[#e0dbd5]"
                        )}
                      >
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#888] capitalize">
                      {tenant.plan || "—"}
                    </TableCell>
                    <TableCell className="text-[#888]">
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
