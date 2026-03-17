"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  Eye,
  Save,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  useInvoice,
  useUpdateInvoice,
  useInvoiceLineItems,
  useCreateInvoiceLineItem,
  useUpdateInvoiceLineItem,
  useDeleteInvoiceLineItem,
} from "@/lib/hooks/use-invoices";

const TAX_RATE = 0.07;

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
  partial: "bg-purple-100 text-purple-700",
};

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";

  const { data: invoice, isLoading: invoiceLoading } = useInvoice(isNew ? "" : id);
  const { data: lineItemsData, isLoading: lineItemsLoading } =
    useInvoiceLineItems(isNew ? "" : id);
  const updateInvoice = useUpdateInvoice();
  const createLineItem = useCreateInvoiceLineItem();
  const updateLineItem = useUpdateInvoiceLineItem();
  const deleteLineItem = useDeleteInvoiceLineItem();

  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("net_30");
  const [initialized, setInitialized] = useState(false);

  const inv = invoice as Record<string, unknown> | undefined;
  const lineItems = (lineItemsData ?? []) as Record<string, unknown>[];

  // Initialize form state from fetched data once
  if (inv && !initialized) {
    if (inv.notes) setNotes(String(inv.notes));
    if (inv.payment_terms) setPaymentTerms(String(inv.payment_terms));
    setInitialized(true);
  }

  const subtotal = lineItems.reduce(
    (sum, item) =>
      sum +
      (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const paidAmount = inv ? Number(inv.paid_amount) || 0 : 0;
  const balanceDue = total - paidAmount;

  const status = inv ? String(inv.status ?? "draft") : "draft";

  const getClientName = (): string => {
    if (!inv) return "";
    const clients = inv.clients as Record<string, unknown> | null;
    if (clients) {
      return `${String(clients.first_name ?? "")} ${String(clients.last_name ?? "")}`.trim();
    }
    return "";
  };

  const getClientEmail = (): string => {
    if (!inv) return "";
    const clients = inv.clients as Record<string, unknown> | null;
    if (clients) return String(clients.email ?? "");
    return "";
  };

  const getProjectName = (): string => {
    if (!inv) return "";
    const projects = inv.projects as Record<string, unknown> | null;
    if (projects) return String(projects.name ?? "");
    return "";
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (val: unknown) => {
    if (!val) return "";
    return new Date(String(val)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSaveDraft = () => {
    updateInvoice.mutate({
      id,
      notes,
      payment_terms: paymentTerms,
      status: "draft",
    });
  };

  const handleSend = () => {
    updateInvoice.mutate({ id, status: "sent", notes, payment_terms: paymentTerms });
  };

  const handleAddLineItem = () => {
    createLineItem.mutate({
      invoice_id: id,
      description: "",
      quantity: 1,
      unit_price: 0,
    });
  };

  const handleLineItemChange = (
    itemId: string,
    field: string,
    value: string | number
  ) => {
    updateLineItem.mutate({ id: itemId, [field]: value });
  };

  const handleRemoveLineItem = (itemId: string) => {
    if (lineItems.length <= 1) return;
    deleteLineItem.mutate({ id: itemId, invoiceId: id });
  };

  if (invoiceLoading || lineItemsLoading) {
    return (
      <div>
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="mb-6 flex items-start justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-1 h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-60 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!inv) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-[#888]">Invoice not found.</p>
        <Link
          href="/admin/invoices"
          className="mt-2 inline-flex items-center gap-1 text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/invoices"
          className="mb-3 inline-flex items-center gap-1 text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Back to Invoices
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-black">
                {String(inv.invoice_number ?? "")}
              </h1>
              <Badge
                className={`text-[10px] capitalize ${statusColors[status] ?? "bg-gray-100 text-gray-700"}`}
              >
                {status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-[#888]">
              {getClientName()}
              {getProjectName() ? <> &mdash; {getProjectName()}</> : null}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#e0dbd5] text-xs text-[#888] hover:text-black"
              onClick={handleSaveDraft}
              disabled={updateInvoice.isPending}
            >
              <Save className="mr-1 h-3 w-3" strokeWidth={1.5} />
              Save Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#e0dbd5] text-xs text-[#888] hover:text-black"
            >
              <Eye className="mr-1 h-3 w-3" strokeWidth={1.5} />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-black text-xs text-white hover:bg-black/90"
              onClick={handleSend}
              disabled={updateInvoice.isPending}
            >
              <Send className="mr-1 h-3 w-3" strokeWidth={1.5} />
              Send to Client
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Line Items */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardHeader className="border-b border-[#e0dbd5] pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-black">Line Items</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddLineItem}
                  disabled={createLineItem.isPending}
                  className="border-[#e0dbd5] text-xs text-[#888] hover:text-black"
                >
                  <Plus className="mr-1 h-3 w-3" strokeWidth={1.5} />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e0dbd5] text-left">
                      <th className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#888]">
                        Description
                      </th>
                      <th className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#888] w-20">
                        Qty
                      </th>
                      <th className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#888] w-28">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#888] w-28 text-right">
                        Amount
                      </th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0dbd5]">
                    {lineItems.map((item) => {
                      const itemId = String(item.id);
                      const qty = Number(item.quantity) || 0;
                      const unitPrice = Number(item.unit_price) || 0;
                      const amount = qty * unitPrice;

                      return (
                        <tr key={itemId} className="group">
                          <td className="px-4 py-2">
                            <Input
                              defaultValue={String(item.description ?? "")}
                              onBlur={(e) =>
                                handleLineItemChange(
                                  itemId,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="h-8 border-transparent text-sm hover:border-[#e0dbd5] focus:border-[#e0dbd5]"
                              placeholder="Item description"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              defaultValue={qty}
                              onBlur={(e) =>
                                handleLineItemChange(
                                  itemId,
                                  "quantity",
                                  Number(e.target.value)
                                )
                              }
                              className="h-8 w-16 border-transparent text-sm text-center hover:border-[#e0dbd5] focus:border-[#e0dbd5]"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[#888]">
                                $
                              </span>
                              <Input
                                type="number"
                                defaultValue={unitPrice}
                                onBlur={(e) =>
                                  handleLineItemChange(
                                    itemId,
                                    "unit_price",
                                    Number(e.target.value)
                                  )
                                }
                                className="h-8 w-24 border-transparent pl-5 text-sm hover:border-[#e0dbd5] focus:border-[#e0dbd5]"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-semibold text-black">
                            ${formatCurrency(amount)}
                          </td>
                          <td className="px-2 py-2">
                            <button
                              onClick={() => handleRemoveLineItem(itemId)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[#888] hover:text-red-500"
                            >
                              <Trash2
                                className="h-3.5 w-3.5"
                                strokeWidth={1.5}
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {lineItems.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-sm text-[#888]"
                        >
                          No line items yet. Click &quot;Add Item&quot; to get
                          started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-[#e0dbd5] px-4 py-4">
                <div className="ml-auto w-64 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#888]">Subtotal</span>
                    <span className="font-medium text-black">
                      ${formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#888]">Tax (7%)</span>
                    <span className="font-medium text-black">
                      ${formatCurrency(tax)}
                    </span>
                  </div>
                  <div className="border-t border-[#e0dbd5] pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-black">
                        Total
                      </span>
                      <span className="text-lg font-bold text-black">
                        ${formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                  {paidAmount > 0 ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-emerald-600">Paid</span>
                        <span className="font-medium text-emerald-600">
                          -${formatCurrency(paidAmount)}
                        </span>
                      </div>
                      <div className="border-t border-[#e0dbd5] pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-black">
                            Balance Due
                          </span>
                          <span className="text-lg font-bold text-black">
                            ${formatCurrency(balanceDue)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History placeholder — no separate payments table in hooks */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardHeader className="border-b border-[#e0dbd5] pb-3">
              <h2 className="text-sm font-bold text-black">Payment History</h2>
            </CardHeader>
            <CardContent className="p-0">
              {paidAmount > 0 ? (
                <div className="divide-y divide-[#e0dbd5]">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle
                          className="h-4 w-4 text-emerald-600"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">
                          ${formatCurrency(paidAmount)}
                        </p>
                        <p className="text-xs text-[#888]">Payment recorded</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-[#888]">
                  No payments recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice Details */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardHeader className="border-b border-[#e0dbd5] pb-3">
              <h2 className="text-sm font-bold text-black">Invoice Details</h2>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label className="text-xs font-medium text-[#888]">
                  Invoice Number
                </Label>
                <p className="mt-1 text-sm font-medium text-black">
                  {String(inv.invoice_number ?? "")}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-[#888]">
                  Client
                </Label>
                <p className="mt-1 text-sm font-medium text-black">
                  {getClientName()}
                </p>
                {getClientEmail() ? (
                  <p className="text-xs text-[#888]">{getClientEmail()}</p>
                ) : null}
              </div>
              {getProjectName() ? (
                <div>
                  <Label className="text-xs font-medium text-[#888]">
                    Project
                  </Label>
                  <p className="mt-1 text-sm font-medium text-black">
                    {getProjectName()}
                  </p>
                </div>
              ) : null}
              {inv.issue_date ? (
                <div>
                  <Label className="text-xs font-medium text-[#888]">
                    Issue Date
                  </Label>
                  <p className="mt-1 text-sm text-black">
                    {formatDate(inv.issue_date)}
                  </p>
                </div>
              ) : null}
              {inv.due_date ? (
                <div>
                  <Label className="text-xs font-medium text-[#888]">
                    Due Date
                  </Label>
                  <p className="mt-1 text-sm text-black">
                    {formatDate(inv.due_date)}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardHeader className="border-b border-[#e0dbd5] pb-3">
              <h2 className="text-sm font-bold text-black">Payment Terms</h2>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label className="text-xs font-medium text-[#888]">
                  Terms
                </Label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#e0dbd5] bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="due_on_receipt">Due on Receipt</option>
                  <option value="net_15">Net 15</option>
                  <option value="net_30">Net 30</option>
                </select>
              </div>
              <div>
                <Label className="text-xs font-medium text-[#888]">
                  Notes
                </Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-[#e0dbd5] bg-white px-3 py-2 text-sm text-black placeholder:text-[#888] focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Add notes or payment instructions..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardHeader className="border-b border-[#e0dbd5] pb-3">
              <h2 className="text-sm font-bold text-black">Activity</h2>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Clock
                    className="mt-0.5 h-3.5 w-3.5 text-[#888]"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="text-xs text-black">Invoice created</p>
                    {inv.created_at ? (
                      <p className="text-[10px] text-[#888]">
                        {formatDate(inv.created_at)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
