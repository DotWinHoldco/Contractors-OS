"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, ArrowLeft } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  status: "active" | "inactive";
  phone: string;
  hireDate: string;
  email: string;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Jake Morrison",
    role: "Lead Carpenter",
    status: "active",
    phone: "(231) 555-0301",
    hireDate: "Jan 15, 2023",
    email: "jake@example.com",
  },
  {
    id: "2",
    name: "Maria Gonzalez",
    role: "Project Manager",
    status: "active",
    phone: "(231) 555-0302",
    hireDate: "Mar 8, 2022",
    email: "maria@example.com",
  },
  {
    id: "3",
    name: "Tom Bradley",
    role: "Apprentice",
    status: "active",
    phone: "(231) 555-0303",
    hireDate: "Sep 1, 2024",
    email: "tom@example.com",
  },
  {
    id: "4",
    name: "Sarah Nguyen",
    role: "Office Manager",
    status: "active",
    phone: "(231) 555-0304",
    hireDate: "Jun 20, 2021",
    email: "sarah@example.com",
  },
  {
    id: "5",
    name: "Derek Owens",
    role: "Electrician",
    status: "inactive",
    phone: "(231) 555-0305",
    hireDate: "Nov 3, 2023",
    email: "derek@example.com",
  },
];

export default function EmployeesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-1">
        <Link
          href="/admin/staffing"
          className="inline-flex items-center gap-1 text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Staffing
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Employees</h1>
          <p className="text-sm text-[#888]">
            {mockEmployees.length} total employees
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Employee
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
          <Input
            placeholder="Search employees..."
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
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Role
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Phone
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Hire Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#f8f8f8]">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-black">
                      {emp.name}
                    </p>
                    <p className="text-xs text-[#888]">{emp.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {emp.role}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        emp.status === "active"
                          ? "bg-green-50 text-green-700 text-[10px]"
                          : "bg-gray-100 text-gray-500 text-[10px]"
                      }
                    >
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555]">
                    {emp.phone}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#888]">
                    {emp.hireDate}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-[#888]"
                  >
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
