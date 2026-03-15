"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FolderKanban,
  FileText,
  FileSignature,
  Receipt,
  Calendar,
  HardHat,
  FolderOpen,
  BarChart3,
  Bot,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/clients", label: "Clients", icon: UserCheck },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/estimates", label: "Estimates", icon: FileText },
  { href: "/admin/contracts", label: "Contracts", icon: FileSignature },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt },
  { href: "/admin/scheduling", label: "Scheduling", icon: Calendar },
  { href: "/admin/staffing", label: "Staffing", icon: HardHat },
  { href: "/admin/documents", label: "Documents", icon: FolderOpen },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/ai", label: "AI Assistant", icon: Bot },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8f8f8]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-black text-white transition-all duration-200 ${
          collapsed ? "w-16" : "w-56"
        } hidden md:flex`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
          {!collapsed && (
            <Image
              src="/logos/win_white_logo-horizontal-blackbg.png"
              alt=".win"
              width={80}
              height={24}
              className="h-5 w-auto"
            />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/40 hover:text-white"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-white/10 p-3">
          <button
            className={`flex w-full items-center gap-3 rounded px-2 py-1.5 text-xs text-white/40 hover:text-white/60 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-56 transform bg-black text-white transition-transform md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
          <Image
            src="/logos/win_white_logo-horizontal-blackbg.png"
            alt=".win"
            width={80}
            height={24}
            className="h-5 w-auto"
          />
          <button onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-white/60" />
          </button>
        </div>
        <nav className="py-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 text-sm ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-200 ${
          collapsed ? "md:ml-16" : "md:ml-56"
        }`}
      >
        {/* Top bar */}
        <header className="flex h-14 items-center gap-4 border-b border-[#e0dbd5] bg-white px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
            <input
              type="text"
              placeholder="Search..."
              className="h-8 w-full rounded-md border border-[#e0dbd5] bg-[#f8f8f8] pl-9 pr-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative text-[#888] hover:text-black">
              <Bell className="h-5 w-5" strokeWidth={1.5} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#C1292E]" />
            </button>
            <div className="h-7 w-7 rounded-full bg-black text-center text-xs font-bold leading-7 text-white">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
