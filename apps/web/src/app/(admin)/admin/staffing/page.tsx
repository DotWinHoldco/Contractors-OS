"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Users,
  Hammer,
  Truck,
  UsersRound,
  Clock,
  ArrowRight,
} from "lucide-react";

const sections = [
  {
    title: "Employees",
    description: "Manage your full-time and part-time staff",
    href: "/admin/staffing/employees",
    icon: Users,
    stat: "12",
    statLabel: "Total employees",
  },
  {
    title: "Subcontractors",
    description: "Track subs, insurance, W9s, and ratings",
    href: "/admin/staffing/subcontractors",
    icon: Hammer,
    stat: "8",
    statLabel: "Active subs",
  },
  {
    title: "Vendors",
    description: "Supplier directory and contact info",
    href: "/admin/staffing/vendors",
    icon: Truck,
    stat: "6",
    statLabel: "Vendors",
  },
  {
    title: "Crews",
    description: "Organize teams and crew assignments",
    href: "/admin/staffing/crews",
    icon: UsersRound,
    stat: "4",
    statLabel: "Active crews",
  },
];

const quickStats = [
  { label: "Total Employees", value: "12" },
  { label: "Active Subcontractors", value: "8" },
  { label: "Pending Timesheets", value: "3" },
];

export default function StaffingPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Staffing</h1>
        <p className="text-sm text-[#888]">
          Manage employees, subcontractors, vendors, and crews
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {quickStats.map((stat) => (
          <Card
            key={stat.label}
            className="border border-[#e0dbd5] p-4 shadow-none"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-[#888]">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-black">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <Card className="group border border-[#e0dbd5] p-5 shadow-none transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5">
                      <Icon
                        className="h-5 w-5 text-black"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-black">
                        {section.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#888]">
                        {section.description}
                      </p>
                      <p className="mt-2 text-xs text-[#888]">
                        <span className="font-semibold text-black">
                          {section.stat}
                        </span>{" "}
                        {section.statLabel}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-[#888] transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                  />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Pending Timesheets */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-black">
          Pending Timesheets
        </h2>
        <Card className="border border-[#e0dbd5] shadow-none">
          <div className="divide-y divide-[#e0dbd5]">
            {[
              {
                name: "Jake Morrison",
                period: "Mar 9 – Mar 15",
                hours: "42h",
              },
              {
                name: "Maria Gonzalez",
                period: "Mar 9 – Mar 15",
                hours: "38h",
              },
              {
                name: "Tom Bradley",
                period: "Mar 9 – Mar 15",
                hours: "40h",
              },
            ].map((ts) => (
              <div
                key={ts.name}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Clock
                    className="h-4 w-4 text-[#888]"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="text-sm font-medium text-black">{ts.name}</p>
                    <p className="text-xs text-[#888]">{ts.period}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-black">{ts.hours}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
