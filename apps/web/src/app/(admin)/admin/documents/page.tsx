"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Search,
  FileText,
  Image,
  File,
  Shield,
  FolderOpen,
  Folder,
  MoreHorizontal,
} from "lucide-react";

interface DocFolder {
  name: string;
  count: number;
  icon: React.ReactNode;
}

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image" | "doc" | "spreadsheet";
  size: string;
  uploaded: string;
  project: string;
  folder: string;
}

const folders: DocFolder[] = [
  { name: "Contracts", count: 8, icon: <FileText className="h-4 w-4" strokeWidth={1.5} /> },
  { name: "Proposals", count: 5, icon: <FileText className="h-4 w-4" strokeWidth={1.5} /> },
  { name: "Permits", count: 3, icon: <Shield className="h-4 w-4" strokeWidth={1.5} /> },
  { name: "Photos", count: 24, icon: <Image className="h-4 w-4" strokeWidth={1.5} /> },
  { name: "Insurance", count: 4, icon: <Shield className="h-4 w-4" strokeWidth={1.5} /> },
  { name: "Misc", count: 6, icon: <File className="h-4 w-4" strokeWidth={1.5} /> },
];

const mockDocuments: Document[] = [
  { id: "1", name: "CTR-001_Kitchen_Remodel_Contract.pdf", type: "pdf", size: "245 KB", uploaded: "Mar 12, 2026", project: "Kitchen Remodel", folder: "Contracts" },
  { id: "2", name: "PRP-002_Deck_Build_Proposal.pdf", type: "pdf", size: "1.2 MB", uploaded: "Mar 10, 2026", project: "Composite Deck Build", folder: "Proposals" },
  { id: "3", name: "Building_Permit_2026-0345.pdf", type: "pdf", size: "89 KB", uploaded: "Mar 8, 2026", project: "Kitchen Remodel", folder: "Permits" },
  { id: "4", name: "Kitchen_Demo_Progress_01.jpg", type: "image", size: "3.4 MB", uploaded: "Mar 7, 2026", project: "Kitchen Remodel", folder: "Photos" },
  { id: "5", name: "General_Liability_Certificate.pdf", type: "pdf", size: "156 KB", uploaded: "Feb 28, 2026", project: "---", folder: "Insurance" },
  { id: "6", name: "Workers_Comp_Policy.pdf", type: "pdf", size: "210 KB", uploaded: "Feb 28, 2026", project: "---", folder: "Insurance" },
  { id: "7", name: "Subcontractor_W9_AceFraming.pdf", type: "pdf", size: "78 KB", uploaded: "Feb 25, 2026", project: "Home Addition", folder: "Misc" },
  { id: "8", name: "Material_Estimate_Spreadsheet.xlsx", type: "spreadsheet", size: "42 KB", uploaded: "Feb 20, 2026", project: "Basement Finish", folder: "Misc" },
];

const typeIcons: Record<Document["type"], React.ReactNode> = {
  pdf: <FileText className="h-4 w-4 text-red-500" strokeWidth={1.5} />,
  image: <Image className="h-4 w-4 text-blue-500" strokeWidth={1.5} />,
  doc: <FileText className="h-4 w-4 text-blue-600" strokeWidth={1.5} />,
  spreadsheet: <File className="h-4 w-4 text-emerald-600" strokeWidth={1.5} />,
};

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const filtered = mockDocuments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.project.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = !activeFolder || d.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Documents</h1>
          <p className="text-sm text-[#888]">
            {mockDocuments.length} files &middot; {folders.length} folders
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Upload className="mr-1 h-3 w-3" />
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Folder Sidebar */}
        <Card className="border border-[#e0dbd5] shadow-none p-3 h-fit">
          <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[#888]">
            Folders
          </h3>
          <div className="space-y-0.5">
            <button
              onClick={() => setActiveFolder(null)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                !activeFolder ? "bg-black text-white" : "text-[#555] hover:bg-[#f8f8f8]"
              }`}
            >
              <FolderOpen className="h-4 w-4" strokeWidth={1.5} />
              <span className="flex-1">All Files</span>
              <span className="text-[10px] opacity-60">{mockDocuments.length}</span>
            </button>
            {folders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setActiveFolder(folder.name)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  activeFolder === folder.name
                    ? "bg-black text-white"
                    : "text-[#555] hover:bg-[#f8f8f8]"
                }`}
              >
                <Folder className="h-4 w-4" strokeWidth={1.5} />
                <span className="flex-1">{folder.name}</span>
                <span className="text-[10px] opacity-60">{folder.count}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* File List */}
        <div>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" strokeWidth={1.5} />
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Card className="border border-[#e0dbd5] shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e0dbd5] text-left">
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Name</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Type</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Size</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Uploaded</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">Project</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0dbd5]">
                  {filtered.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#f8f8f8]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {typeIcons[doc.type]}
                          <span className="text-sm font-medium text-black">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs uppercase text-[#888]">{doc.type}</td>
                      <td className="px-4 py-3 text-xs text-[#888]">{doc.size}</td>
                      <td className="px-4 py-3 text-xs text-[#888]">{doc.uploaded}</td>
                      <td className="px-4 py-3 text-sm text-[#555]">{doc.project}</td>
                      <td className="px-4 py-3">
                        <button className="rounded p-1 text-[#888] hover:bg-[#f0f0f0] hover:text-black">
                          <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#888]">
                        No documents found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
