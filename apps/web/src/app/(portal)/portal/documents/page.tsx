"use client";

import React from "react";
import { useDocuments, useDownloadDocument } from "@/lib/hooks/use-documents";
import { useAppUser } from "@/lib/hooks/use-app-user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Download,
  FileSignature,
  Receipt,
  ScrollText,
  ShieldCheck,
  FolderOpen,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Icon map by document_type                                          */
/* ------------------------------------------------------------------ */

const TYPE_ICONS: Record<string, React.ElementType> = {
  contract: FileSignature,
  proposal: ScrollText,
  invoice: Receipt,
  permit: ShieldCheck,
  change_order: FileSignature,
};

function getIcon(docType: string | null): React.ElementType {
  if (!docType) return FileText;
  return TYPE_ICONS[docType.toLowerCase()] ?? FileText;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalDocumentsPage() {
  const { appUser } = useAppUser();
  const tenantId = appUser?.tenantId ?? undefined;

  // We pass undefined for projectId to get all documents
  const { data: documents, isLoading } = useDocuments();
  const downloadMutation = useDownloadDocument();

  const docList = documents ?? [];

  // Group documents by document_type
  const grouped: Record<string, Record<string, unknown>[]> = {};
  for (const doc of docList) {
    const docType = (doc.document_type as string | null) ?? "other";
    if (!grouped[docType]) grouped[docType] = [];
    grouped[docType].push(doc);
  }

  const groupOrder = ["contract", "proposal", "invoice", "permit", "change_order", "other"];
  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
    const ia = groupOrder.indexOf(a);
    const ib = groupOrder.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const handleDownload = async (storagePath: string, fileName: string) => {
    try {
      const url = await downloadMutation.mutateAsync(storagePath);
      // Open in new tab
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.target = "_blank";
      a.click();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black sm:text-3xl">Documents</h1>
        <p className="mt-1 text-sm text-[#888]">
          Access all contracts, proposals, invoices, and permits.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-[#e0dbd5]">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : docList.length === 0 ? (
        <Card className="border-[#e0dbd5]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen strokeWidth={1.5} className="size-10 text-[#e0dbd5]" />
            <p className="mt-3 text-sm font-medium text-black">No documents yet</p>
            <p className="mt-1 text-sm text-[#888]">Documents will appear here when uploaded.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedGroups.map(([groupKey, docs]) => {
            const GroupIcon = getIcon(groupKey);
            const label = groupKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <Card key={groupKey} className="border-[#e0dbd5]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-black">
                    <GroupIcon className="h-5 w-5" />
                    {label}
                    <span className="ml-1 text-sm font-normal text-[#888]">
                      ({docs.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-[#e0dbd5]">
                    {docs.map((doc) => {
                      const id = doc.id as string;
                      const fileName = (doc.file_name as string) ?? (doc.title as string) ?? "Untitled";
                      const storagePath = doc.storage_path as string;
                      const createdAt = doc.created_at as string | null;
                      const fileSize = doc.file_size_bytes as number | null;

                      return (
                        <li
                          key={id}
                          className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0dbd5]/50">
                              <FileText className="h-4 w-4 text-[#888]" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-black">
                                {fileName}
                              </p>
                              <p className="text-xs text-[#888]">
                                {createdAt
                                  ? new Date(createdAt).toLocaleDateString()
                                  : ""}
                                {fileSize ? ` \u00B7 ${formatFileSize(fileSize)}` : ""}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 border-[#e0dbd5] text-black hover:bg-[#e0dbd5]/30"
                            onClick={() => handleDownload(storagePath, fileName)}
                            disabled={downloadMutation.isPending}
                          >
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
