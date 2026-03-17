"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, AlertCircle } from "lucide-react";
import { useClients, useCreateClient } from "@/lib/hooks/use-clients";
import { useAppUser } from "@/lib/hooks/use-app-user";

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const { appUser } = useAppUser();
  const createClient = useCreateClient();

  // Pass search to the hook so it filters server-side via ilike
  const { data: clients, isLoading, error } = useClients(undefined, search || undefined);

  const allClients = (clients ?? []) as Record<string, unknown>[];

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Clients</h1>
            <Skeleton className="mt-1 h-4 w-28" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="mt-2 text-sm text-red-600">Failed to load clients</p>
        <p className="text-xs text-[#888]">{String((error as Error).message)}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Clients</h1>
          <p className="text-sm text-[#888]">
            {allClients.length} total clients
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Client
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {allClients.length === 0 ? (
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardContent className="p-10 text-center">
            <p className="text-sm text-[#888]">
              {search ? "No clients match your search" : "No clients yet"}
            </p>
            {!search ? (
              <p className="mt-1 text-xs text-[#aaa]">
                Add your first client or convert a lead.
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-[#e0dbd5] shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0dbd5] text-left">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Projects
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Last Contact
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0dbd5]">
                {allClients.map((client) => {
                  const clientId = String(client.id);
                  const firstName = String(client.first_name ?? "");
                  const lastName = String(client.last_name ?? "");
                  const displayName = client.display_name
                    ? String(client.display_name)
                    : `${firstName} ${lastName}`.trim() || "Unnamed";
                  const email = String(client.email ?? "");
                  const clientType = String(client.client_type ?? "").replace(/_/g, " ");
                  const totalProjects = (client.total_projects as number | null) ?? 0;
                  const totalRevenue = (client.total_revenue as number | null) ?? 0;
                  const lastContactDate = client.last_contact_date as string | null;
                  const tags = (client.tags as string[] | null) ?? [];
                  const isVip = client.is_vip as boolean | null;

                  const lastContactDisplay = lastContactDate
                    ? new Date(lastContactDate).toLocaleDateString()
                    : "—";

                  return (
                    <tr key={clientId} className="hover:bg-[#f8f8f8]">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/clients/${clientId}`}
                          className="text-sm font-medium text-black hover:underline"
                        >
                          {displayName}
                        </Link>
                        {email ? (
                          <p className="text-xs text-[#888]">{email}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm capitalize text-[#555]">
                        {clientType}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#555]">
                        {totalProjects}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-black">
                        ${Number(totalRevenue).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#888]">
                        {lastContactDisplay}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {isVip ? (
                            <Badge variant="secondary" className="text-[10px]">
                              VIP
                            </Badge>
                          ) : null}
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
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
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Client</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>First Name *</Label>
              <Input placeholder="First name" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} className="mt-1" autoFocus />
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input placeholder="Last name" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input placeholder="email@example.com" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input placeholder="(555) 555-5555" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="mt-1" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button
                disabled={!newFirstName.trim() || !newLastName.trim() || !newEmail.trim() || createClient.isPending}
                onClick={() => {
                  createClient.mutate(
                    { tenant_id: appUser?.tenantId, first_name: newFirstName, last_name: newLastName, email: newEmail, ...(newPhone ? { phone: newPhone } : {}) } as never,
                    {
                      onSuccess: () => {
                        setCreateOpen(false);
                        setNewFirstName("");
                        setNewLastName("");
                        setNewEmail("");
                        setNewPhone("");
                      },
                    }
                  );
                }}
              >
                {createClient.isPending ? "Creating..." : "Create Client"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
