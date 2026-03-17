"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { useEmployees, useCreateEmployee, useDeleteEmployee } from "@/lib/hooks/use-employees";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");

  const { data: employeesData, isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const employees = (employeesData ?? []) as Record<string, unknown>[];

  const filtered = employees.filter((e) => {
    const name = String(e.first_name ?? "") + " " + String(e.last_name ?? "");
    const role = String(e.role ?? "");
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      role.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAdd = () => {
    createEmployee.mutate({ first_name: "New", last_name: "Employee", employment_status: "active" });
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-1 h-4 w-16" />
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="mt-1 h-4 w-28" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="mb-4 h-10 w-full max-w-sm" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

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
            {employees.length} total employees
          </p>
        </div>
        <Button
          size="sm"
          className="bg-black text-xs text-white hover:bg-black/90"
          onClick={handleAdd}
          disabled={createEmployee.isPending}
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
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#888]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0dbd5]">
              {filtered.map((emp) => {
                const id = String(emp.id);
                const name =
                  `${String(emp.first_name ?? "")} ${String(emp.last_name ?? "")}`.trim();
                const email = emp.email ? String(emp.email) : null;
                const role = emp.role ? String(emp.role) : "";
                const status = String(emp.employment_status ?? "active");
                const phone = emp.phone ? String(emp.phone) : "";
                const hireDate = emp.hire_date
                  ? new Date(String(emp.hire_date)).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )
                  : "";

                return (
                  <tr key={id} className="hover:bg-[#f8f8f8]">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-black">{name}</p>
                      {email ? (
                        <p className="text-xs text-[#888]">{email}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">{role}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={
                          status === "active"
                            ? "bg-green-50 text-green-700 text-[10px]"
                            : "bg-gray-100 text-gray-500 text-[10px]"
                        }
                      >
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#555]">{phone}</td>
                    <td className="px-4 py-3 text-xs text-[#888]">
                      {hireDate}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteEmployee.mutate(id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-[#888]"
                  >
                    No employees found.
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
