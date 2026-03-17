"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  FileText,
  Calendar,
  DollarSign,
  Filter,
} from "lucide-react";
import { useInvoices, useCreateInvoice } from "@/lib/hooks/use-invoices";
import { useClients } from "@/lib/hooks/use-clients";
import { useAppUser } from "@/lib/hooks/use-app-user";

type InvoiceStatus = "draft" | "sent" | "viewed" | "paid" | "overdue" | "partial";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
  partial: "bg-purple-100 text-purple-700",
};

const statusOptions: InvoiceStatus[] = [
  "draft",
  "sent",
  "viewed",
  "paid",
  "overdue",
  "partial",
];

export default function InvoicesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">(
    "all"
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newClientId, setNewClientId] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const { appUser } = useAppUser();
  const createInvoice = useCreateInvoice();
  const { data: clients } = useClients();

  const { data: invoices, isLoading } = useInvoices();

  const rows = (invoices ?? []) as Record<string, unknown>[];

  const getClientName = (row: Record<string, unknown>): string => {
    const clients = row.clients as Record<string, unknown> | null;
    if (clients) {
      return `${String(clients.first_name ?? "")} ${String(clients.last_name ?? "")}`.trim();
    }
    return "";
  };

  const getProjectName = (row: Record<string, unknown>): string => {
    const projects = row.projects as Record<string, unknown> | null;
    if (projects) return String(projects.name ?? "");
    return "";
  };

  const filtered = rows.filter((inv) => {
    const number = String(inv.invoice_number ?? "");
    const client = getClientName(inv);
    const project = getProjectName(inv);
    const status = String(inv.status ?? "");
    const matchesSearch =
      number.toLowerCase().includes(search.toLowerCase()) ||
      client.toLowerCase().includes(search.toLowerCase()) ||
      project.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = rows
    .filter((i) => {
      const s = String(i.status ?? "");
      return s !== "paid" && s !== "draft";
    })
    .reduce((sum, i) => sum + (Number(i.total_amount) || 0), 0);

  const totalPaid = rows
    .filter((i) => String(i.status ?? "") === "paid")
    .reduce((sum, i) => sum + (Number(i.total_amount) || 0), 0);

  const totalOverdue = rows
    .filter((i) => String(i.status ?? "") === "overdue")
    .reduce((sum, i) => sum + (Number(i.total_amount) || 0), 0);

  const formatCurrency = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="mt-1 h-4 w-28" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-full max-w-sm mb-4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Invoices</h1>
          <p className="text-sm text-[#888]">
            {rows.length} total invoices
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-1 h-3 w-3" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border border-[#e0dbd5] shadow-none">
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <DollarSign
                className="h-5 w-5 text-emerald-600"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-[#888]">Total Paid</p>
              <p className="text-lg font-bold text-black">
                ${formatCurrency(totalPaid)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border border-[#e0dbd5] shadow-none">
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <FileText
                className="h-5 w-5 text-blue-600"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-[#888]">Outstanding</p>
              <p className="text-lg font-bold text-black">
                ${formatCurrency(totalOutstanding)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border border-[#e0dbd5] shadow-none">
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <Calendar
                className="h-5 w-5 text-red-600"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-[#888]">Overdue</p>
              <p className="text-lg font-bold text-black">
                ${formatCurrency(totalOverdue)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]"
            strokeWidth={1.5}
          />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-md border border-[#e0dbd5] p-1">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-black text-white"
                : "text-[#888] hover:text-black"
            }`}
          >
            All
          </button>
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded px-3 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-black text-white"
                  : "text-[#888] hover:text-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowDateFilter(!showDateFilter)}
          className={`flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
            showDateFilter
              ? "border-black bg-black text-white"
              : "border-[#e0dbd5] text-[#888] hover:text-black"
          }`}
        >
          <Filter className="h-3 w-3" strokeWidth={1.5} />
          Date Range
        </button>
      </div>

      {showDateFilter && (
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[#888]">From</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-8 w-40 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[#888]">To</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-8 w-40 text-xs"
            />
          </div>
          <button
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            className="text-xs text-[#888] hover:text-black"
          >
            Clear
          </button>
        </div>
      )}

      {/* Invoice Table */}
      <Card className="border border-[#e0dbd5] shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0dbd5] text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Number
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Client
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Project
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Amount
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Due Date
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Paid
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((invoice) => {
                const id = String(invoice.id);
                const status = String(invoice.status ?? "draft");
                const totalAmount = Number(invoice.total_amount) || 0;
                const paidAmount = Number(invoice.paid_amount) || 0;
                const dueDate = invoice.due_date
                  ? new Date(String(invoice.due_date)).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )
                  : "";

                return (
                  <tr key={id} className="hover:bg-[#f8f8f8]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/invoices/${id}`}
                        className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
                      >
                        <FileText
                          className="h-4 w-4 text-[#888]"
                          strokeWidth={1.5}
                        />
                        {String(invoice.invoice_number ?? "")}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">
                      {getClientName(invoice)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">
                      {getProjectName(invoice)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-black">
                      ${formatCurrency(totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`text-[10px] capitalize ${statusColors[status] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#888]">
                      {dueDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">
                      ${formatCurrency(paidAmount)}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-[#888]"
                  >
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Client *</Label>
              <select
                value={newClientId}
                onChange={(e) => setNewClientId(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#e0dbd5] bg-white px-3 py-2 text-sm"
              >
                <option value="">Select a client...</option>
                {(clients || []).map((c: Record<string, unknown>) => (
                  <option key={c.id as string} value={c.id as string}>
                    {String(c.first_name || "")} {String(c.last_name || "")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Due Date</Label>
              <Input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="mt-1" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button
                disabled={!newClientId || createInvoice.isPending}
                onClick={() => {
                  createInvoice.mutate(
                    { tenant_id: appUser?.tenantId, client_id: newClientId, ...(newDueDate ? { due_date: newDueDate } : {}) } as never,
                    {
                      onSuccess: (data: Record<string, unknown>) => {
                        setCreateOpen(false);
                        setNewClientId("");
                        setNewDueDate("");
                        router.push(`/admin/invoices/${data.id}`);
                      },
                    }
                  );
                }}
              >
                {createInvoice.isPending ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
