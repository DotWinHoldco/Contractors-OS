import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  Receipt,
  DollarSign,
  Plus,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Dashboard | Admin",
};

// Mock data — will be replaced with Supabase queries
const metrics = [
  { label: "Active Leads", value: "12", icon: Users, change: "+3 this week", color: "text-blue-600" },
  { label: "Active Projects", value: "5", icon: FolderKanban, change: "2 starting soon", color: "text-emerald-600" },
  { label: "Outstanding Invoices", value: "3", icon: Receipt, change: "$8,400 pending", color: "text-amber-600" },
  { label: "Revenue This Month", value: "$42,500", icon: DollarSign, change: "+12% vs last month", color: "text-emerald-600" },
];

const recentLeads = [
  { id: "1", name: "Sarah Mitchell", project: "Kitchen Remodel", value: "$45,000", status: "new", created: "2h ago" },
  { id: "2", name: "David Kim", project: "Deck Build", value: "$28,000", status: "contacted", created: "5h ago" },
  { id: "3", name: "Jennifer Torres", project: "Basement Finish", value: "$65,000", status: "new", created: "1d ago" },
  { id: "4", name: "Mike Reynolds", project: "Bathroom Remodel", value: "$32,000", status: "quoted", created: "2d ago" },
  { id: "5", name: "Lisa Chen", project: "Roofing", value: "$18,000", status: "new", created: "3d ago" },
];

const upcomingEvents = [
  { title: "Consultation: Sarah Mitchell", time: "Today, 2:00 PM", type: "consultation" },
  { title: "Project Review: Johnson Kitchen", time: "Tomorrow, 10:00 AM", type: "meeting" },
  { title: "Site Visit: Kim Deck", time: "Wed, 9:00 AM", type: "site_visit" },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  won: "bg-emerald-100 text-emerald-700",
};

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <p className="text-sm text-[#888]">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/leads/new">
            <Button variant="outline" size="sm" className="text-xs">
              <Plus className="mr-1 h-3 w-3" />
              New Lead
            </Button>
          </Link>
          <Link href="/admin/projects/new">
            <Button size="sm" className="bg-black text-xs text-white hover:bg-black/90">
              <Plus className="mr-1 h-3 w-3" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border border-[#e0dbd5] shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-[#888]">
                  {metric.label}
                </p>
                <metric.icon className="h-4 w-4 text-[#888]" strokeWidth={1.5} />
              </div>
              <p className="mt-2 text-2xl font-bold text-black">{metric.value}</p>
              <p className={`mt-1 text-xs ${metric.color}`}>{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent Leads */}
        <Card className="border border-[#e0dbd5] shadow-none lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h2 className="text-sm font-semibold text-black">Recent Leads</h2>
            <Link
              href="/admin/leads"
              className="text-xs font-medium text-[#888] hover:text-black"
            >
              View all
              <ArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#e0dbd5]">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#f8f8f8]"
                >
                  <div>
                    <p className="text-sm font-medium text-black">{lead.name}</p>
                    <p className="text-xs text-[#888]">{lead.project}</p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-sm font-semibold text-black">
                      {lead.value}
                    </span>
                    <Badge className={`text-[10px] ${statusColors[lead.status]}`}>
                      {lead.status}
                    </Badge>
                    <span className="text-xs text-[#888]">{lead.created}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card className="border border-[#e0dbd5] shadow-none">
          <CardHeader className="pb-2">
            <h2 className="text-sm font-semibold text-black">Upcoming</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-black" />
                <div>
                  <p className="text-sm font-medium text-black">{event.title}</p>
                  <p className="text-xs text-[#888]">{event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
