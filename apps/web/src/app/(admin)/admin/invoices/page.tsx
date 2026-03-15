"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  FileText,
  Calendar,
  DollarSign,
  Filter,
} from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  client: string;
  project: string;
  amount: string;
  amountRaw: number;
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "partial";
  dueDate: string;
  paidAmount: string;
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    number: "INV-001",
    client: "Sarah Mitchell",
    project: "Kitchen Remodel",
    amount: "$45,200.00",
    amountRaw: 45200,
    status: "paid",
    dueDate: "Mar 1, 2026",
    paidAmount: "$45,200.00",
  },
  {
    id: "2",
    number: "INV-002",
    client: "David Kim",
    project: "Composite Deck Build",
    amount: "$28,750.00",
    amountRaw: 28750,
    status: "sent",
    dueDate: "Mar 25, 2026",
    paidAmount: "$0.00",
  },
  {
    id: "3",
    number: "INV-003",
    client: "Jennifer Torres",
    project: "Basement Finish",
    amount: "$64,800.00",
    amountRaw: 64800,
    status: "draft",
    dueDate: "Apr 1, 2026",
    paidAmount: "$0.00",
  },
  {
    id: "4",
    number: "INV-004",
    client: "Mike Reynolds",
    project: "Master Bath Renovation",
    amount: "$31,500.00",
    amountRaw: 31500,
    status: "overdue",
    dueDate: "Feb 28, 2026",
    paidAmount: "$0.00",
  },
  {
    id: "5",
    number: "INV-005",
    client: "Amanda Park",
    project: "Home Addition",
    amount: "$95,000.00",
    amountRaw: 95000,
    status: "partial",
    dueDate: "Mar 20, 2026",
    paidAmount: "$47,500.00",
  },
  {
    id: "6",
    number: "INV-006",
    client: "Greg Stevens",
    project: "Whole Home Remodel",
    amount: "$128,400.00",
    amountRaw: 128400,
    status: "viewed",
    dueDate: "Apr 15, 2026",
    paidAmount: "$0.00",
  },
];

const statusColors: Record<Invoice["status"], string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
  partial: "bg-purple-100 text-purple-700",
};

const statusOptions: Invoice["status"][] = [
  "draft",
  "sent",
  "viewed",
  "paid",
  "overdue",
  "partial",
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    Invoice["status"] | "all"
  >("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const filtered = mockInvoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.project.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = mockInvoices
    .filter((i) => i.status !== "paid" && i.status !== "draft")
    .reduce((sum, i) => sum + i.amountRaw, 0);

  const totalPaid = mockInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amountRaw, 0);

  const totalOverdue = mockInvoices
    .filter((i) => i.status === "overdue")
    .reduce((sum, i) => sum + i.amountRaw, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Invoices</h1>
          <p className="text-sm text-[#888]">
            {mockInvoices.length} total invoices
          </p>
        </div>
        <Link href="/admin/invoices/new">
          <Button
            size="sm"
            className="bg-black text-xs text-white hover:bg-black/90"
          >
            <Plus className="mr-1 h-3 w-3" />
            New Invoice
          </Button>
        </Link>
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
                ${totalPaid.toLocaleString()}
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
                ${totalOutstanding.toLocaleString()}
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
                ${totalOverdue.toLocaleString()}
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
              {filtered.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/invoices/${invoice.id}`}
                      className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
                    >
                      <FileText
                        className="h-4 w-4 text-[#888]"
                        strokeWidth={1.5}
                      />
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {invoice.client}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {invoice.project}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-black">
                    {invoice.amount}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`text-[10px] capitalize ${statusColors[invoice.status]}`}
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#888]">
                    {invoice.dueDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {invoice.paidAmount}
                  </td>
                </tr>
              ))}
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
    </div>
  );
}
