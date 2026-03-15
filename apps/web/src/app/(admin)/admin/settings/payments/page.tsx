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
  CheckCircle,
  XCircle,
  ExternalLink,
  CreditCard,
  Building2,
  Calendar,
  Percent,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function PaymentSettingsPage() {
  const [isConnected] = useState(true);
  const [platformFee] = useState(2.9);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/settings"
          className="mb-3 inline-flex items-center gap-1 text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Back to Settings
        </Link>
        <h1 className="text-2xl font-bold text-black">Payment Settings</h1>
        <p className="text-sm text-[#888]">
          Manage your Stripe Connect account and payment configuration
        </p>
      </div>

      {/* Test Mode Banner */}
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Test Mode</span> — Payments are
          processed in Stripe test mode. No real charges will be made.
        </p>
        <Badge className="ml-auto bg-amber-100 text-[10px] text-amber-700">
          TEST
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Connection Status */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardHeader className="border-b border-[#e0dbd5] pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-black">
                  Stripe Connect Status
                </h2>
                {isConnected ? (
                  <Badge className="bg-emerald-100 text-[10px] text-emerald-700">
                    <CheckCircle
                      className="mr-1 h-3 w-3"
                      strokeWidth={1.5}
                    />
                    Connected
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-[10px] text-red-700">
                    <XCircle className="mr-1 h-3 w-3" strokeWidth={1.5} />
                    Not Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border border-[#e0dbd5] p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#635BFF]/10">
                      <CreditCard
                        className="h-6 w-6 text-[#635BFF]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-black">
                        Mitchell Renovations LLC
                      </p>
                      <p className="text-xs text-[#888]">
                        acct_1N3abc...xyz &mdash; Connected on Jan 15, 2026
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#e0dbd5] text-xs text-[#888] hover:text-black"
                    >
                      <ExternalLink
                        className="mr-1 h-3 w-3"
                        strokeWidth={1.5}
                      />
                      Stripe Dashboard
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-[#e0dbd5] p-3">
                      <div className="flex items-center gap-2">
                        <Building2
                          className="h-4 w-4 text-[#888]"
                          strokeWidth={1.5}
                        />
                        <span className="text-xs font-medium text-[#888]">
                          Business Type
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-black">
                        LLC — Home Improvement
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#e0dbd5] p-3">
                      <div className="flex items-center gap-2">
                        <CreditCard
                          className="h-4 w-4 text-[#888]"
                          strokeWidth={1.5}
                        />
                        <span className="text-xs font-medium text-[#888]">
                          Default Currency
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-black">
                        USD ($)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-3">
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Disconnect Stripe Account
                      </p>
                      <p className="text-xs text-red-600">
                        This will disable payment processing for your account.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-xs text-red-600 hover:bg-red-100 hover:text-red-700"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <CreditCard
                      className="h-8 w-8 text-[#888]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="mb-1 text-base font-semibold text-black">
                    Connect Your Stripe Account
                  </h3>
                  <p className="mb-4 text-sm text-[#888]">
                    Accept online payments from your clients. Connect your
                    Stripe account to get started.
                  </p>
                  <Button
                    size="sm"
                    className="bg-[#635BFF] text-xs text-white hover:bg-[#635BFF]/90"
                  >
                    <CreditCard
                      className="mr-1 h-3 w-3"
                      strokeWidth={1.5}
                    />
                    Connect Stripe Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payout Schedule */}
          {isConnected && (
            <Card className="border border-[#e0dbd5] shadow-none">
              <CardHeader className="border-b border-[#e0dbd5] pb-3">
                <h2 className="text-sm font-bold text-black">
                  Payout Schedule
                </h2>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border border-[#e0dbd5] p-3">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className="h-4 w-4 text-[#888]"
                          strokeWidth={1.5}
                        />
                        <span className="text-xs font-medium text-[#888]">
                          Frequency
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-black">
                        Daily (Automatic)
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#e0dbd5] p-3">
                      <div className="flex items-center gap-2">
                        <RefreshCw
                          className="h-4 w-4 text-[#888]"
                          strokeWidth={1.5}
                        />
                        <span className="text-xs font-medium text-[#888]">
                          Processing Time
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-black">
                        2 Business Days
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#e0dbd5] p-3">
                      <div className="flex items-center gap-2">
                        <Building2
                          className="h-4 w-4 text-[#888]"
                          strokeWidth={1.5}
                        />
                        <span className="text-xs font-medium text-[#888]">
                          Payout Bank
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-black">
                        Chase &bull;&bull;&bull;&bull; 4521
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Platform Fee */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardHeader className="border-b border-[#e0dbd5] pb-3">
              <h2 className="text-sm font-bold text-black">Platform Fee</h2>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center gap-3 rounded-lg border border-[#e0dbd5] p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Percent
                    className="h-5 w-5 text-blue-600"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#888]">
                    Current Rate
                  </p>
                  <p className="text-lg font-bold text-black">
                    {platformFee}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#888]">
                The platform fee is deducted from each payment before funds are
                transferred to your connected Stripe account. This rate is set
                by the platform administrator.
              </p>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-medium text-[#888]">
                  Fee Breakdown Example
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#888]">Client pays</span>
                    <span className="text-black">$1,000.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#888]">
                      Platform fee ({platformFee}%)
                    </span>
                    <span className="text-red-600">
                      -${(1000 * (platformFee / 100)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#888]">Stripe fee (~2.9% + 30c)</span>
                    <span className="text-red-600">-$29.30</span>
                  </div>
                  <div className="border-t border-[#e0dbd5] pt-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-black">You receive</span>
                      <span className="text-emerald-600">
                        ${(1000 - 1000 * (platformFee / 100) - 29.3).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accepted Methods */}
          <Card className="border border-[#e0dbd5] shadow-none">
            <CardHeader className="border-b border-[#e0dbd5] pb-3">
              <h2 className="text-sm font-bold text-black">
                Accepted Payment Methods
              </h2>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {[
                { name: "Credit / Debit Cards", enabled: true },
                { name: "ACH Bank Transfer", enabled: true },
                { name: "Apple Pay / Google Pay", enabled: true },
                { name: "Wire Transfer", enabled: false },
              ].map((method) => (
                <div
                  key={method.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-black">{method.name}</span>
                  {method.enabled ? (
                    <Badge className="bg-emerald-100 text-[10px] text-emerald-700">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-[10px] text-gray-500">
                      Disabled
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
