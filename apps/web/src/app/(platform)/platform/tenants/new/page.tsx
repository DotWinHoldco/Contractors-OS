"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const steps = [
  "Business Profile",
  "Branding",
  "Domain",
  "Services",
  "Stripe Connect",
  "Review & Launch",
];

export default function NewTenantPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    phone: "",
    email: "",
    business_type: "general_contractor",
    service_area: "",
    tagline: "",
    address_line1: "",
    address_city: "",
    address_state: "",
    address_zip: "",
    color_primary: "#1b2a4a",
    color_secondary: "#2e75b6",
    color_accent: "#d4a84b",
    font_heading: "Outfit",
    font_body: "Outfit",
    custom_domain: "",
  });

  function updateForm(key: string, value: string) {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "name" && !prev.slug) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return updated;
    });
  }

  async function handleLaunch() {
    setLoading(true);
    const supabase = createClient();

    // Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        company_name: form.name,
        slug: form.slug,
        phone: form.phone,
        email: form.email,
        business_type: form.business_type,
        service_area_description: form.service_area,
        tagline: form.tagline,
        address_line1: form.address_line1,
        city: form.address_city,
        state: form.address_state,
        zip_code: form.address_zip,
        status: "active",
        plan: "professional",
      })
      .select()
      .single();

    if (tenantError || !tenant) {
      alert("Error creating tenant: " + (tenantError?.message || "Unknown"));
      setLoading(false);
      return;
    }

    // Create theme
    await supabase.from("tenant_themes").insert({
      tenant_id: tenant.id,
      color_primary: form.color_primary,
      color_secondary: form.color_secondary,
      color_accent: form.color_accent,
      font_heading: form.font_heading,
      font_body: form.font_body,
      color_background: "#ffffff",
      color_surface: "#f8f8f8",
      color_text: "#1a1a1a",
      color_text_secondary: "#555555",
      color_success: "#2d6a4f",
      color_warning: "#cc8a00",
      color_error: "#c1292e",
      border_radius: "8px",
    });

    // Create subdomain record
    await supabase.from("tenant_domains").insert({
      tenant_id: tenant.id,
      domain: `${form.slug}.contractorsos.com`,
      domain_type: "subdomain",
      is_primary: true,
      is_verified: true,
    });

    setLoading(false);
    router.push(`/platform/tenants/${tenant.id}`);
  }

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/platform/tenants")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">
            New Tenant
          </h1>
          <p className="text-sm text-[#888]">
            Step {step + 1} of {steps.length}: {steps[step]}
          </p>
        </div>
      </div>

      <Progress value={progress} className="h-1" />

      <Card className="border border-[#e0dbd5] bg-white shadow-none">
        <CardContent className="pt-6">
          {/* Step 0: Business Profile */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Grand Traverse Home Co."
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="(231) 555-0100"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="info@grandtraversehomeco.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input
                  value={form.tagline}
                  onChange={(e) => updateForm("tagline", e.target.value)}
                  placeholder="Building & Remodeling Done Right"
                />
              </div>
              <div className="space-y-2">
                <Label>Service Area</Label>
                <Textarea
                  value={form.service_area}
                  onChange={(e) => updateForm("service_area", e.target.value)}
                  placeholder="Grand Traverse County, Leelanau County, Benzie County"
                />
              </div>
            </div>
          )}

          {/* Step 1: Branding */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.color_primary}
                      onChange={(e) =>
                        updateForm("color_primary", e.target.value)
                      }
                      className="h-10 w-10 cursor-pointer rounded border"
                    />
                    <Input
                      value={form.color_primary}
                      onChange={(e) =>
                        updateForm("color_primary", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.color_secondary}
                      onChange={(e) =>
                        updateForm("color_secondary", e.target.value)
                      }
                      className="h-10 w-10 cursor-pointer rounded border"
                    />
                    <Input
                      value={form.color_secondary}
                      onChange={(e) =>
                        updateForm("color_secondary", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color_accent}
                    onChange={(e) =>
                      updateForm("color_accent", e.target.value)
                    }
                    className="h-10 w-10 cursor-pointer rounded border"
                  />
                  <Input
                    value={form.color_accent}
                    onChange={(e) =>
                      updateForm("color_accent", e.target.value)
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-[#888]">
                Logo upload will be available after tenant creation.
              </p>
            </div>
          )}

          {/* Step 2: Domain */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subdomain</Label>
                <div className="flex items-center gap-0">
                  <Input
                    value={form.slug}
                    onChange={(e) => updateForm("slug", e.target.value)}
                    className="rounded-r-none"
                  />
                  <span className="rounded-r-md border border-l-0 bg-[#f8f8f8] px-3 py-2 text-sm text-[#888]">
                    .contractorsos.com
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Custom Domain (optional)</Label>
                <Input
                  value={form.custom_domain}
                  onChange={(e) =>
                    updateForm("custom_domain", e.target.value)
                  }
                  placeholder="grandtraversehomeco.com"
                />
                <p className="text-xs text-[#888]">
                  DNS configuration will be provided after setup.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Services */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-[#888]">
                Service catalog will be configured after tenant creation. Default
                services will be seeded automatically.
              </p>
            </div>
          )}

          {/* Step 4: Stripe Connect */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-[#888]">
                Stripe Connect onboarding will be available after tenant creation.
                The tenant can set up payments from their admin dashboard.
              </p>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888]">
                Review
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#888]">Name</span>
                  <span className="font-medium">{form.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#888]">Subdomain</span>
                  <span className="font-medium">
                    {form.slug}.contractorsos.com
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#888]">Email</span>
                  <span className="font-medium">{form.email || "—"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#888]">Phone</span>
                  <span className="font-medium">{form.phone || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Primary Color</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded"
                      style={{ backgroundColor: form.color_primary }}
                    />
                    <span className="font-medium">{form.color_primary}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                className="bg-black text-white hover:bg-black/90"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleLaunch}
                disabled={loading || !form.name || !form.slug}
                className="bg-black text-white hover:bg-black/90"
              >
                {loading ? "Creating..." : "Go Live"}
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
