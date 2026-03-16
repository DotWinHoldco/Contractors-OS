"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Upload,
  Search,
  FileText,
  Download,
  Trash2,
} from "lucide-react";
import { useDocuments, useUploadDocument, useDeleteDocument, useDownloadDocument } from "@/lib/hooks/use-documents";
import { useTenant } from "@/lib/hooks/use-tenant";
import { toast } from "sonner";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tenantId } = useTenant();
  const { data: documents, isLoading } = useDocuments();
  const uploadDoc = useUploadDocument();
  const deleteDoc = useDeleteDocument();
  const downloadDoc = useDownloadDocument();

  const filtered = (documents || []).filter((d: Record<string, unknown>) => {
    const name = String(d.title || d.file_name || "").toLowerCase();
    return name.includes(search.toLowerCase());
  });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      uploadDoc.mutate({ file, record: { name: file.name, tenant_id: tenantId ?? "" } });
    }
    e.target.value = "";
  }

  async function handleDownload(doc: Record<string, unknown>) {
    const path = doc.storage_path as string;
    if (!path) {
      toast.error("No file path available");
      return;
    }
    downloadDoc.mutate(path);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Documents</h1>
          <p className="text-sm text-[#888]">{documents?.length || 0} documents</p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-1 h-3 w-3" />
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
          <Input placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : !filtered.length ? (
        <Card className="border-[#e0dbd5] shadow-none">
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-[#e0dbd5]" />
            <p className="mt-3 text-sm text-[#888]">No documents yet. Upload your first document.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[#e0dbd5] shadow-none">
          <div className="divide-y divide-[#e0dbd5]">
            {filtered.map((doc: Record<string, unknown>) => (
              <div key={doc.id as string} className="flex items-center gap-4 px-5 py-3 hover:bg-[#f8f8f8]">
                <FileText className="h-5 w-5 flex-shrink-0 text-[#888]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-black">
                    {String(doc.title || doc.file_name || "Untitled")}
                  </p>
                  <p className="text-xs text-[#888]">
                    {doc.document_type ? String(doc.document_type) : "Document"}
                    {doc.created_at ? ` · ${new Date(doc.created_at as string).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7" onClick={() => handleDownload(doc)}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-red-500"
                    onClick={() => {
                      if (confirm("Delete this document?")) deleteDoc.mutate({ id: doc.id as string, storagePath: doc.storage_path as string });
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
