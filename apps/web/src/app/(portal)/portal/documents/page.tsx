"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  FileSignature,
  Receipt,
  ScrollText,
  ShieldCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface Document {
  id: string;
  name: string;
  uploadedDate: string;
  size: string;
}

interface DocumentGroup {
  label: string;
  icon: React.ElementType;
  documents: Document[];
}

const groups: DocumentGroup[] = [
  {
    label: "Contracts",
    icon: FileSignature,
    documents: [
      {
        id: "d1",
        name: "Kitchen Renovation — Master Contract.pdf",
        uploadedDate: "Jan 10, 2026",
        size: "245 KB",
      },
      {
        id: "d2",
        name: "Change Order #1 — Island Modification.pdf",
        uploadedDate: "Feb 14, 2026",
        size: "128 KB",
      },
      {
        id: "d3",
        name: "Change Order #2 — Backsplash Upgrade.pdf",
        uploadedDate: "Mar 12, 2026",
        size: "98 KB",
      },
    ],
  },
  {
    label: "Proposals",
    icon: ScrollText,
    documents: [
      {
        id: "d4",
        name: "Kitchen Renovation — Initial Proposal.pdf",
        uploadedDate: "Dec 18, 2025",
        size: "1.2 MB",
      },
      {
        id: "d5",
        name: "Bathroom Remodel — Proposal.pdf",
        uploadedDate: "Mar 5, 2026",
        size: "890 KB",
      },
    ],
  },
  {
    label: "Invoices",
    icon: Receipt,
    documents: [
      {
        id: "d6",
        name: "Invoice #001 — Deposit.pdf",
        uploadedDate: "Jan 15, 2026",
        size: "64 KB",
      },
      {
        id: "d7",
        name: "Invoice #002 — Demolition.pdf",
        uploadedDate: "Feb 10, 2026",
        size: "68 KB",
      },
      {
        id: "d8",
        name: "Invoice #003 — Cabinets.pdf",
        uploadedDate: "Mar 1, 2026",
        size: "72 KB",
      },
      {
        id: "d9",
        name: "Invoice #004 — Countertops.pdf",
        uploadedDate: "Mar 15, 2026",
        size: "70 KB",
      },
    ],
  },
  {
    label: "Permits",
    icon: ShieldCheck,
    documents: [
      {
        id: "d10",
        name: "Building Permit — Residential Remodel.pdf",
        uploadedDate: "Jan 8, 2026",
        size: "310 KB",
      },
      {
        id: "d11",
        name: "Electrical Permit.pdf",
        uploadedDate: "Jan 8, 2026",
        size: "215 KB",
      },
      {
        id: "d12",
        name: "Plumbing Permit.pdf",
        uploadedDate: "Jan 8, 2026",
        size: "198 KB",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalDocumentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black sm:text-3xl">Documents</h1>
        <p className="mt-1 text-sm text-[#888]">
          Access all contracts, proposals, invoices, and permits.
        </p>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <Card key={group.label} className="border-[#e0dbd5]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-black">
                <group.icon className="h-5 w-5" />
                {group.label}
                <span className="ml-1 text-sm font-normal text-[#888]">
                  ({group.documents.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-[#e0dbd5]">
                {group.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0dbd5]/50">
                        <FileText className="h-4 w-4 text-[#888]" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-black">
                          {doc.name}
                        </p>
                        <p className="text-xs text-[#888]">
                          {doc.uploadedDate} &middot; {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-[#e0dbd5] text-black hover:bg-[#e0dbd5]/30"
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
