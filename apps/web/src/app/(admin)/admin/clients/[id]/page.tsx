"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FolderKanban,
  Receipt,
  FileText,
  MessageSquare,
  User,
  Home,
  Activity,
  Plus,
} from "lucide-react";

const tabs = [
  { key: "overview", label: "Overview", icon: User },
  { key: "properties", label: "Properties", icon: Home },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "invoices", label: "Invoices", icon: Receipt },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "notes", label: "Notes", icon: MessageSquare },
  { key: "activity", label: "Activity", icon: Activity },
];

// Mock client data
const clientData = {
  name: "Sarah Mitchell",
  email: "sarah@example.com",
  phone: "(231) 555-0101",
  type: "Residential",
  status: "active",
  source: "Website Booking",
  totalProjects: 1,
  totalRevenue: 45000,
  portalEnrolled: true,
  lastLogin: "2d ago",
  properties: [
    {
      id: "1",
      address: "123 Lake Shore Dr",
      city: "Traverse City",
      state: "MI",
      zip: "49684",
      type: "Single Family",
    },
  ],
  projects: [
    {
      id: "1",
      name: "Kitchen Remodel",
      status: "in_progress",
      value: "$45,000",
      startDate: "Mar 2026",
    },
  ],
  invoices: [
    {
      id: "1",
      number: "INV-001",
      amount: "$13,500",
      status: "paid",
      date: "Mar 5, 2026",
    },
    {
      id: "2",
      number: "INV-002",
      amount: "$18,000",
      status: "pending",
      date: "Mar 12, 2026",
    },
  ],
  activity: [
    { action: "Invoice INV-002 sent", date: "2d ago" },
    { action: "Payment received: $13,500", date: "5d ago" },
    { action: "Project started: Kitchen Remodel", date: "1w ago" },
    { action: "Client converted from lead", date: "2w ago" },
    { action: "Account created via booking flow", date: "2w ago" },
  ],
};

const invoiceStatusColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
};

const projectStatusColors: Record<string, string> = {
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  planning: "bg-purple-100 text-purple-700",
};

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/clients"
          className="mb-3 inline-flex items-center text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Clients
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-black">
                {clientData.name}
              </h1>
              <Badge
                className={`text-[10px] ${clientData.portalEnrolled ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}
              >
                {clientData.portalEnrolled ? "Portal Active" : "No Portal"}
              </Badge>
            </div>
            <p className="text-sm text-[#888]">
              {clientData.type} &middot; Client since Mar 2026
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Mail className="mr-1 h-3 w-3" />
              Message
            </Button>
            <Button
              size="sm"
              className="bg-black text-xs text-white hover:bg-black/90"
            >
              <Plus className="mr-1 h-3 w-3" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-[#e0dbd5]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "border-black text-black"
                : "border-transparent text-[#888] hover:text-black"
            }`}
          >
            <tab.icon className="h-3 w-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border border-[#e0dbd5] shadow-none lg:col-span-2">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-semibold text-black">
                Contact Information
              </h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                {clientData.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                {clientData.phone}
              </div>
              {clientData.properties[0] && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
                  {clientData.properties[0].address},{" "}
                  {clientData.properties[0].city},{" "}
                  {clientData.properties[0].state}{" "}
                  {clientData.properties[0].zip}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[#e0dbd5] shadow-none">
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Total Revenue
                </p>
                <p className="mt-1 text-2xl font-bold text-black">
                  ${clientData.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Projects
                </p>
                <p className="mt-1 text-lg font-bold text-black">
                  {clientData.totalProjects}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  Source
                </p>
                <p className="mt-1 text-sm text-black">{clientData.source}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Properties */}
      {activeTab === "properties" && (
        <div className="space-y-3">
          {clientData.properties.map((prop) => (
            <Card key={prop.id} className="border border-[#e0dbd5] shadow-none">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-black">
                    {prop.address}
                  </p>
                  <p className="text-xs text-[#888]">
                    {prop.city}, {prop.state} {prop.zip} &middot; {prop.type}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Projects */}
      {activeTab === "projects" && (
        <div className="space-y-3">
          {clientData.projects.map((proj) => (
            <Card key={proj.id} className="border border-[#e0dbd5] shadow-none">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-black">
                      {proj.name}
                    </p>
                    <Badge
                      className={`text-[10px] ${projectStatusColors[proj.status] ?? ""}`}
                    >
                      {proj.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#888]">
                    {proj.value} &middot; Started {proj.startDate}
                  </p>
                </div>
                <Link href={`/admin/projects/${proj.id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    View
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Invoices */}
      {activeTab === "invoices" && (
        <Card className="border border-[#e0dbd5] shadow-none">
          <div className="divide-y divide-[#e0dbd5]">
            {clientData.invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-black">{inv.number}</p>
                  <p className="text-xs text-[#888]">{inv.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-black">
                    {inv.amount}
                  </span>
                  <Badge
                    className={`text-[10px] ${invoiceStatusColors[inv.status] ?? ""}`}
                  >
                    {inv.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Documents */}
      {activeTab === "documents" && (
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardContent className="p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-[#ccc]" strokeWidth={1.5} />
            <p className="mt-2 text-sm text-[#888]">No documents yet</p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {activeTab === "notes" && (
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardContent className="p-10 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-[#ccc]" strokeWidth={1.5} />
            <p className="mt-2 text-sm text-[#888]">No notes yet</p>
          </CardContent>
        </Card>
      )}

      {/* Activity */}
      {activeTab === "activity" && (
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardContent className="p-5">
            <div className="space-y-4">
              {clientData.activity.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-black" />
                  <div>
                    <p className="text-sm text-black">{item.action}</p>
                    <p className="text-xs text-[#888]">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
