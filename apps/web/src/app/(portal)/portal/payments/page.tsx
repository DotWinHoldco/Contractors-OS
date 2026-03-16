"use client";

import React from "react";
import { useInvoices } from "@/lib/hooks/use-invoices";
import { useAppUser } from "@/lib/hooks/use-app-user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, CheckCircle2, Clock, AlertCircle, Receipt } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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
  sent: { label: "Due", icon: Clock, className: "text-[#888]" },
  draft: { label: "Draft", icon: Clock, className: "text-[#888]" },
  outstanding: { label: "Due", icon: Clock, className: "text-[#888]" },
  overdue: { label: "Overdue", icon: AlertCircle, className: "text-red-600" },
  voided: { label: "Voided", icon: AlertCircle, className: "text-[#888]" },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalPaymentsPage() {
  const { appUser } = useAppUser();
  const tenantId = appUser?.tenantId ?? undefined;
  const { data: invoices, isLoading } = useInvoices(tenantId);

  const invoiceList = invoices ?? [];

  const outstanding = invoiceList.filter(
    (i) => (i.status as string) !== "paid" && (i.status as string) !== "voided"
  );
  const paid = invoiceList.filter((i) => (i.status as string) === "paid");

  const totalOutstanding = outstanding.reduce(
    (sum, i) => sum + ((i.balance_due as number | null) ?? (i.total as number | null) ?? 0),
    0
  );
  const totalPaid = paid.reduce(
    (sum, i) => sum + ((i.amount_paid as number | null) ?? (i.total as number | null) ?? 0),
    0
  );

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
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <>
                <p className="text-2xl font-bold text-black">
                  {formatCurrency(totalOutstanding)}
                </p>
                <p className="text-xs text-[#888]">
                  {outstanding.length} invoice{outstanding.length !== 1 ? "s" : ""}
                </p>
              </>
            )}
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
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <>
                <p className="text-2xl font-bold text-black">
                  {formatCurrency(totalPaid)}
                </p>
                <p className="text-xs text-[#888]">
                  {paid.length} payment{paid.length !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Invoices */}
      {isLoading ? (
        <Card className="border-[#e0dbd5]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-black">
              Outstanding Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      ) : outstanding.length > 0 ? (
        <Card className="border-[#e0dbd5]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-black">
              Outstanding Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {outstanding.map((inv) => {
              const amount = (inv.balance_due as number | null) ?? (inv.total as number | null) ?? 0;
              const label = (inv.invoice_number as string | null) ?? "Invoice";
              const dueDate = inv.due_date as string | null;
              const project = inv.projects as Record<string, unknown> | null;
              const projectName = project ? (project.name as string) : "";

              return (
                <div
                  key={inv.id as string}
                  className="flex flex-col gap-3 rounded-lg border border-[#e0dbd5] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-black">
                      {label}
                      {projectName ? ` — ${projectName}` : ""}
                    </p>
                    {dueDate ? (
                      <p className="text-xs text-[#888]">
                        Due {new Date(dueDate).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-black">
                      {formatCurrency(amount)}
                    </p>
                    <Button className="bg-black text-white hover:bg-black/90">
                      Pay Now
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

      {/* Payment History */}
      <Card className="border-[#e0dbd5]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : invoiceList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Receipt strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
              <p className="mt-3 text-sm text-[#888]">No invoices yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#e0dbd5]">
                    <TableHead className="text-[#888]">Invoice</TableHead>
                    <TableHead className="text-[#888]">Project</TableHead>
                    <TableHead className="text-right text-[#888]">Amount</TableHead>
                    <TableHead className="text-[#888]">Status</TableHead>
                    <TableHead className="text-[#888]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceList.map((inv) => {
                    const status = (inv.status as string) ?? "draft";
                    const cfg = statusConfig[status] ?? statusConfig.draft;
                    const StatusIcon = cfg.icon;
                    const amount = (inv.total as number | null) ?? 0;
                    const project = inv.projects as Record<string, unknown> | null;
                    const projectName = project ? (project.name as string) : "--";
                    const paidAt = inv.paid_at as string | null;
                    const dueDate = inv.due_date as string | null;
                    const dateStr = paidAt ?? dueDate;

                    return (
                      <TableRow key={inv.id as string} className="border-[#e0dbd5]">
                        <TableCell className="text-sm font-medium text-black">
                          {(inv.invoice_number as string | null) ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-[#888]">
                          {projectName}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium text-black">
                          {formatCurrency(amount)}
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
                          {dateStr ? new Date(dateStr).toLocaleDateString() : "--"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
