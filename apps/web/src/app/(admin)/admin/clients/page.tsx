"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  totalProjects: number;
  totalRevenue: string;
  lastContact: string;
  tags: string[];
}

const mockClients: Client[] = [
  { id: "1", name: "Sarah Mitchell", email: "sarah@example.com", phone: "(231) 555-0101", type: "Residential", totalProjects: 1, totalRevenue: "$45,000", lastContact: "Today", tags: ["VIP"] },
  { id: "2", name: "David Kim", email: "david@example.com", phone: "(231) 555-0102", type: "Residential", totalProjects: 2, totalRevenue: "$73,000", lastContact: "Yesterday", tags: [] },
  { id: "3", name: "Jennifer Torres", email: "jennifer@example.com", phone: "(231) 555-0103", type: "Residential", totalProjects: 1, totalRevenue: "$65,000", lastContact: "3d ago", tags: ["Referral Source"] },
  { id: "4", name: "Mike Reynolds", email: "mike@example.com", phone: "(231) 555-0104", type: "Residential", totalProjects: 3, totalRevenue: "$142,000", lastContact: "1w ago", tags: ["VIP", "Repeat"] },
  { id: "5", name: "Grand Traverse Rentals", email: "info@gtr.com", phone: "(231) 555-0200", type: "Commercial", totalProjects: 5, totalRevenue: "$380,000", lastContact: "2d ago", tags: ["Commercial", "VIP"] },
  { id: "6", name: "Lisa Chen", email: "lisa@example.com", phone: "(231) 555-0105", type: "Residential", totalProjects: 1, totalRevenue: "$18,000", lastContact: "1w ago", tags: [] },
];

export default function ClientsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockClients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Clients</h1>
          <p className="text-sm text-[#888]">
            {mockClients.length} total clients
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
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
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="text-sm font-medium text-black hover:underline"
                    >
                      {client.name}
                    </Link>
                    <p className="text-xs text-[#888]">{client.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {client.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {client.totalProjects}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-black">
                    {client.totalRevenue}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#888]">
                    {client.lastContact}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {client.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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
