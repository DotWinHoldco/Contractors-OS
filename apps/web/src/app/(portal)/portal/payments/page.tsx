"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface Invoice {
  id: string;
  label: string;
  project: string;
  amount: number;
  status: "paid" | "outstanding" | "overdue";
  dueDate: string;
  paidDate?: string;
}

const invoices: Invoice[] = [
  {
    id: "inv-001",
    label: "Deposit — Kitchen Renovation",
    project: "Kitchen Renovation",
    amount: 5000.0,
    status: "paid",
    dueDate: "Jan 15, 2026",
    paidDate: "Jan 14, 2026",
  },
  {
    id: "inv-002",
    label: "Progress Payment #1 — Demolition",
    project: "Kitchen Renovation",
    amount: 3800.0,
    status: "paid",
    dueDate: "Feb 10, 2026",
    paidDate: "Feb 10, 2026",
  },
  {
    id: "inv-003",
    label: "Progress Payment #2 — Cabinets",
    project: "Kitchen Renovation",
    amount: 6200.0,
    status: "paid",
    dueDate: "Mar 1, 2026",
    paidDate: "Feb 28, 2026",
  },
  {
    id: "inv-004",
    label: "Progress Payment #3 — Countertops",
    project: "Kitchen Renovation",
    amount: 4250.0,
    status: "outstanding",
    dueDate: "Mar 18, 2026",
  },
  {
    id: "inv-005",
    label: "Progress Payment #4 — Finishing",
    project: "Kitchen Renovation",
    amount: 3500.0,
    status: "outstanding",
    dueDate: "Apr 15, 2026",
  },
];

const outstanding = invoices.filter((i) => i.status !== "paid");
const paid = invoices.filter((i) => i.status === "paid");

const totalOutstanding = outstanding.reduce((sum, i) => sum + i.amount, 0);
const totalPaid = paid.reduce((sum, i) => sum + i.amount, 0);

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  paid: { label: "Paid", icon: CheckCircle2, className: "text-black" },
  outstanding: { label: "Due", icon: Clock, className: "text-[#888]" },
  overdue: { label: "Overdue", icon: AlertCircle, className: "text-red-600" },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalPaymentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black sm:text-3xl">Payments</h1>
        <p className="mt-1 text-sm text-[#888]">
          View invoices and make payments securely.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-[#e0dbd5]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#888]">
              Outstanding
            </CardTitle>
            <CreditCard className="h-4 w-4 text-[#888]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-black">
              {formatCurrency(totalOutstanding)}
            </p>
            <p className="text-xs text-[#888]">
              {outstanding.length} invoice{outstanding.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#e0dbd5]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#888]">
              Total Paid
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[#888]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-black">
              {formatCurrency(totalPaid)}
            </p>
            <p className="text-xs text-[#888]">
              {paid.length} payment{paid.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Invoices */}
      {outstanding.length > 0 && (
        <Card className="border-[#e0dbd5]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-black">
              Outstanding Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {outstanding.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col gap-3 rounded-lg border border-[#e0dbd5] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-black">
                    {inv.label}
                  </p>
                  <p className="text-xs text-[#888]">Due {inv.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-black">
                    {formatCurrency(inv.amount)}
                  </p>
                  <Button className="bg-black text-white hover:bg-black/90">
                    Pay Now
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card className="border-[#e0dbd5]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#e0dbd5]">
                  <TableHead className="text-[#888]">Invoice</TableHead>
                  <TableHead className="text-[#888]">Project</TableHead>
                  <TableHead className="text-right text-[#888]">
                    Amount
                  </TableHead>
                  <TableHead className="text-[#888]">Status</TableHead>
                  <TableHead className="text-[#888]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => {
                  const cfg = statusConfig[inv.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <TableRow key={inv.id} className="border-[#e0dbd5]">
                      <TableCell className="text-sm font-medium text-black">
                        {inv.label}
                      </TableCell>
                      <TableCell className="text-sm text-[#888]">
                        {inv.project}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-black">
                        {formatCurrency(inv.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 text-sm ${cfg.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-[#888]">
                        {inv.paidDate ?? inv.dueDate}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
