"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.id as string;
  const [tenant, setTenant] = useState<any>(null);
  const [theme, setTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data: t } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", tenantId)
        .single();
      setTenant(t);

      const { data: th } = await supabase
        .from("tenant_themes")
        .select("*")
        .eq("tenant_id", tenantId)
        .single();
      setTheme(th);
      setLoading(false);
    }
    fetch();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#888]">
        Loading tenant...
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#888]">
        <p>Tenant not found</p>
        <Link href="/platform/tenants" className="mt-2 text-black underline">
          Back to tenants
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/platform/tenants")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">
            {tenant.name}
          </h1>
          <p className="text-sm text-[#888]">{tenant.slug}.contractorsos.com</p>
        </div>
        <Badge
          className={
            tenant.status === "active"
              ? "bg-[#2d6a4f] text-white"
              : "bg-[#888] text-white"
          }
        >
          {tenant.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border border-[#e0dbd5] bg-white shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                  Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold capitalize">
                  {tenant.plan || "None"}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-[#e0dbd5] bg-white shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {tenant.phone || "—"}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-[#e0dbd5] bg-white shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {tenant.email || "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-[#e0dbd5] bg-white shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#888]">
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888]">Business Type</span>
                <span className="font-medium capitalize">
                  {tenant.business_type || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">Service Area</span>
                <span className="font-medium">
                  {tenant.service_area_description || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">Created</span>
                <span className="font-medium">
                  {new Date(tenant.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="border border-[#e0dbd5] bg-white shadow-none">
            <CardHeader>
              <CardTitle>Tenant Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input defaultValue={tenant.name} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input defaultValue={tenant.slug} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue={tenant.phone || ""} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={tenant.email || ""} />
              </div>
              <Button className="bg-black text-white hover:bg-black/90">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          <Card className="border border-[#e0dbd5] bg-white shadow-none">
            <CardHeader>
              <CardTitle>Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {theme ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded border"
                          style={{ backgroundColor: theme.color_primary }}
                        />
                        <Input defaultValue={theme.color_primary} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded border"
                          style={{ backgroundColor: theme.color_secondary }}
                        />
                        <Input defaultValue={theme.color_secondary} />
                      </div>
                    </div>
                  </div>
                  <Button className="bg-black text-white hover:bg-black/90">
                    Save Branding
                  </Button>
                </>
              ) : (
                <p className="text-sm text-[#888]">
                  No theme configured for this tenant.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="mt-6">
          <Card className="border border-[#e0dbd5] bg-white shadow-none">
            <CardHeader>
              <CardTitle>Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {tenant.slug}.contractorsos.com
                    </p>
                    <p className="text-xs text-[#888]">Subdomain (auto)</p>
                  </div>
                  <Badge className="bg-[#2d6a4f] text-white">Active</Badge>
                </div>
              </div>
              <Button variant="outline" className="mt-4">
                Add Custom Domain
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="border border-[#e0dbd5] bg-white shadow-none">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#888]">
                User management will be loaded from the users table filtered by
                tenant_id.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
