"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  Eye,
  Save,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
}

const initialLineItems: LineItem[] = [
  {
    id: "1",
    description: "Demolition & Removal",
    qty: 1,
    unitPrice: 3500,
    amount: 3500,
  },
  {
    id: "2",
    description: "Custom Cabinetry — Maple Shaker",
    qty: 14,
    unitPrice: 850,
    amount: 11900,
  },
  {
    id: "3",
    description: "Quartz Countertops — Calacatta Gold",
    qty: 45,
    unitPrice: 125,
    amount: 5625,
  },
  {
    id: "4",
    description: "Tile Backsplash — Subway Pattern",
    qty: 32,
    unitPrice: 45,
    amount: 1440,
  },
  {
    id: "5",
    description: "Plumbing Rough-In & Finish",
    qty: 1,
    unitPrice: 4800,
    amount: 4800,
  },
  {
    id: "6",
    description: "Electrical — Recessed Lighting (12 fixtures)",
    qty: 1,
    unitPrice: 3200,
    amount: 3200,
  },
  {
    id: "7",
    description: "Appliance Installation",
    qty: 5,
    unitPrice: 350,
    amount: 1750,
  },
  {
    id: "8",
    description: "Luxury Vinyl Plank Flooring",
    qty: 280,
    unitPrice: 12,
    amount: 3360,
  },
];

const mockPayments: Payment[] = [
  {
    id: "p1",
    date: "Feb 15, 2026",
    amount: 22600,
    method: "Credit Card",
    reference: "ch_3N1abc...xyz",
  },
  {
    id: "p2",
    date: "Mar 5, 2026",
    amount: 22600,
    method: "ACH Transfer",
    reference: "bt_7K2def...uvw",
  },
];

const TAX_RATE = 0.07;

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
  partial: "bg-purple-100 text-purple-700",
};

export default function InvoiceDetailPage() {
  const [lineItems, setLineItems] = useState<LineItem[]>(initialLineItems);
  const [paymentTerms, setPaymentTerms] = useState("net_30");
  const [notes, setNotes] = useState(
    "Thank you for choosing Mitchell Renovations. Payment is due within the terms specified above. Late payments may incur a 1.5% monthly fee."
  );
  const [status] = useState<string>("paid");

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const totalPaid = mockPayments.reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = total - totalPaid;

  const handleLineItemChange = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty" || field === "unitPrice") {
          updated.amount = Number(updated.qty) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: String(Date.now()),
      description: "",
      qty: 1,
      unitPrice: 0,
      amount: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

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
              <h1 className="text-2xl font-bold text-black">INV-001</h1>
              <Badge className={`text-[10px] capitalize ${statusColors[status]}`}>
                {status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-[#888]">
              Sarah Mitchell &mdash; Kitchen Remodel
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#e0dbd5] text-xs text-[#888] hover:text-black"
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
                  onClick={addLineItem}
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
                    {lineItems.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="px-4 py-2">
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              handleLineItemChange(
                                item.id,
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
                            value={item.qty}
                            onChange={(e) =>
                              handleLineItemChange(
                                item.id,
                                "qty",
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
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleLineItemChange(
                                  item.id,
                                  "unitPrice",
                                  Number(e.target.value)
                                )
                              }
                              className="h-8 w-24 border-transparent pl-5 text-sm hover:border-[#e0dbd5] focus:border-[#e0dbd5]"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-semibold text-black">
                          ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-2 py-2">
                          <button
                            onClick={() => removeLineItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#888] hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-[#e0dbd5] px-4 py-4">
                <div className="ml-auto w-64 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#888]">Subtotal</span>
                    <span className="font-medium text-black">
                      ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#888]">Tax (7%)</span>
                    <span className="font-medium text-black">
                      ${tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t border-[#e0dbd5] pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-black">Total</span>
                      <span className="text-lg font-bold text-black">
                        ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  {totalPaid > 0 && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-emerald-600">Paid</span>
                        <span className="font-medium text-emerald-600">
                          -${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="border-t border-[#e0dbd5] pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-black">
                            Balance Due
                          </span>
                          <span className="text-lg font-bold text-black">
                            ${balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardHeader className="border-b border-[#e0dbd5] pb-3">
              <h2 className="text-sm font-bold text-black">Payment History</h2>
            </CardHeader>
            <CardContent className="p-0">
              {mockPayments.length > 0 ? (
                <div className="divide-y divide-[#e0dbd5]">
                  {mockPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                          <CheckCircle
                            className="h-4 w-4 text-emerald-600"
                            strokeWidth={1.5}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">
                            ${payment.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-[#888]">
                            {payment.method} &mdash; {payment.reference}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-[#888]">{payment.date}</span>
                    </div>
                  ))}
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
                <p className="mt-1 text-sm font-medium text-black">INV-001</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-[#888]">Client</Label>
                <p className="mt-1 text-sm font-medium text-black">
                  Sarah Mitchell
                </p>
                <p className="text-xs text-[#888]">sarah@mitchell.com</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-[#888]">
                  Project
                </Label>
                <p className="mt-1 text-sm font-medium text-black">
                  Kitchen Remodel
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-[#888]">
                  Issue Date
                </Label>
                <p className="mt-1 text-sm text-black">Feb 1, 2026</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-[#888]">
                  Due Date
                </Label>
                <p className="mt-1 text-sm text-black">Mar 1, 2026</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardHeader className="border-b border-[#e0dbd5] pb-3">
              <h2 className="text-sm font-bold text-black">Payment Terms</h2>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label className="text-xs font-medium text-[#888]">Terms</Label>
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
                <Label className="text-xs font-medium text-[#888]">Notes</Label>
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
                {[
                  {
                    icon: CheckCircle,
                    text: "Payment received — $22,600.00",
                    date: "Mar 5, 2026",
                    color: "text-emerald-600",
                  },
                  {
                    icon: CheckCircle,
                    text: "Payment received — $22,600.00",
                    date: "Feb 15, 2026",
                    color: "text-emerald-600",
                  },
                  {
                    icon: Eye,
                    text: "Invoice viewed by client",
                    date: "Feb 3, 2026",
                    color: "text-amber-600",
                  },
                  {
                    icon: Send,
                    text: "Invoice sent to client",
                    date: "Feb 1, 2026",
                    color: "text-blue-600",
                  },
                  {
                    icon: Clock,
                    text: "Invoice created",
                    date: "Feb 1, 2026",
                    color: "text-[#888]",
                  },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <activity.icon
                      className={`mt-0.5 h-3.5 w-3.5 ${activity.color}`}
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-xs text-black">{activity.text}</p>
                      <p className="text-[10px] text-[#888]">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
