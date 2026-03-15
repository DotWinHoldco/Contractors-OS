"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  CreditCard,
  FileText,
  Menu,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { label: "My Projects", href: "/portal/projects", icon: FolderKanban },
  { label: "Messages", href: "/portal/messages", icon: MessageSquare },
  { label: "Payments", href: "/portal/payments", icon: CreditCard },
  { label: "Documents", href: "/portal/documents", icon: FileText },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const clientName = "Sarah Johnson";
  const clientInitials = "SJ";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e0dbd5] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left — Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black">
              <span className="text-sm font-bold text-white">CO</span>
            </div>
            <span className="hidden text-lg font-semibold text-black sm:inline">
              Client Portal
            </span>
          </div>

          {/* Center — Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-black text-white"
                      : "text-[#888] hover:bg-[#e0dbd5]/50 hover:text-black"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right — User + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-medium text-black">
                {clientName}
              </span>
              <Avatar className="h-8 w-8 border border-[#e0dbd5]">
                <AvatarFallback className="bg-[#e0dbd5] text-xs font-semibold text-black">
                  {clientInitials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open menu"
                  />
                }
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex h-full flex-col">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between border-b border-[#e0dbd5] px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-[#e0dbd5]">
                        <AvatarFallback className="bg-[#e0dbd5] text-xs font-semibold text-black">
                          {clientInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-black">
                        {clientName}
                      </span>
                    </div>
                    <SheetClose
                      render={
                        <Button variant="ghost" size="icon" aria-label="Close menu" />
                      }
                    >
                      <X className="h-4 w-4" />
                    </SheetClose>
                  </div>

                  {/* Mobile Nav */}
                  <nav className="flex flex-1 flex-col gap-1 p-4">
                    {navItems.map((item) => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-black text-white"
                              : "text-[#888] hover:bg-[#e0dbd5]/50 hover:text-black"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}
