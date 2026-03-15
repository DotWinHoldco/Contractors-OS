"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Bot,
  Eye,
  Pencil,
  Send,
  GripVertical,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const sections = [
  {
    key: "cover",
    title: "Cover Letter",
    content:
      "Dear Sarah,\n\nThank you for the opportunity to provide a proposal for your kitchen remodel project at 123 Lake Shore Dr, Traverse City. We've carefully reviewed your requirements and are excited to present our plan for transforming your kitchen into the modern, functional space you envision.\n\nOur team has extensive experience with projects of this scope and we're confident we can deliver exceptional results within your timeline and budget.",
  },
  {
    key: "scope",
    title: "Scope of Work",
    content:
      "The project includes:\n\n1. Complete demolition of existing kitchen cabinets, countertops, backsplash, and flooring\n2. Structural modifications to open the kitchen to the dining area\n3. Installation of custom soft-close cabinetry (upper and lower)\n4. Cambria quartz countertop installation with undermount sink\n5. Subway tile backsplash installation\n6. Hardwood flooring refinishing\n7. Full plumbing updates including new fixtures\n8. Electrical upgrades with under-cabinet and recessed lighting\n9. Appliance installation (client-supplied)\n10. Final painting and trim work",
  },
  {
    key: "timeline",
    title: "Timeline",
    content:
      "Estimated project duration: 6 weeks\n\nWeek 1: Demolition and structural work\nWeek 2: Rough-in plumbing and electrical\nWeek 3-4: Cabinet installation\nWeek 5: Countertops, backsplash, and flooring\nWeek 6: Final touches, painting, and walkthrough\n\nEstimated start date: Upon contract signing\nEstimated completion: 6 weeks from start",
  },
  {
    key: "pricing",
    title: "Pricing",
    content: "", // Handled by pricing tiers below
  },
  {
    key: "terms",
    title: "Terms & Conditions",
    content:
      "Payment Schedule:\n- 20% deposit upon contract signing\n- 30% upon completion of rough-in\n- 30% upon cabinet installation\n- 20% upon final walkthrough and approval\n\nWarranty:\n- 2-year workmanship warranty on all labor\n- Manufacturer warranties on all materials\n\nChange Orders:\n- Any scope changes require written change order\n- Pricing adjustments will be documented before work proceeds",
  },
  {
    key: "signature",
    title: "Acceptance & Signature",
    content: "",
  },
];

const pricingTiers = [
  {
    tier: "Good",
    desc: "Quality renovation with standard materials",
    price: 38000,
    features: ["Stock cabinetry", "Quartz countertops", "Ceramic tile backsplash", "LVP flooring", "Standard fixtures"],
  },
  {
    tier: "Better",
    desc: "Premium materials and custom touches",
    price: 47500,
    features: ["Semi-custom cabinetry", "Premium quartz countertops", "Subway tile backsplash", "Hardwood flooring", "Upgraded fixtures", "Under-cabinet lighting"],
    recommended: true,
  },
  {
    tier: "Best",
    desc: "Luxury finishes throughout",
    price: 58000,
    features: ["Custom cabinetry", "Natural stone countertops", "Designer tile backsplash", "Premium hardwood flooring", "High-end fixtures", "Full lighting design", "Smart home integration"],
  },
];

export default function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [sectionContents, setSectionContents] = useState<Record<string, string>>(
    Object.fromEntries(sections.map((s) => [s.key, s.content]))
  );

  function handleAIGenerate(sectionKey: string) {
    toast.success(`AI generating ${sectionKey}...`);
  }

  function handleSend() {
    toast.success("Proposal sent to client!");
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/proposals"
          className="mb-3 inline-flex items-center text-xs text-[#888] hover:text-black"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Proposals
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-black">
                Proposal PRP-001
              </h1>
              <Badge className="bg-gray-100 text-[10px] text-gray-700">
                Draft
              </Badge>
            </div>
            <p className="text-sm text-[#888]">
              Sarah Mitchell &middot; Kitchen Remodel
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
              className="text-xs"
            >
              {mode === "edit" ? (
                <>
                  <Eye className="mr-1 h-3 w-3" />
                  Preview
                </>
              ) : (
                <>
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              className="bg-black text-xs text-white hover:bg-black/90"
            >
              <Send className="mr-1 h-3 w-3" />
              Send to Client
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card
            key={section.key}
            className="border border-[#e0dbd5] shadow-none"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-[#ccc]" />
                <h3 className="text-sm font-semibold text-black">
                  {section.title}
                </h3>
              </div>
              {section.key !== "signature" && section.key !== "pricing" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAIGenerate(section.key)}
                  className="text-xs text-[#888]"
                >
                  <Bot className="mr-1 h-3 w-3" />
                  Generate with AI
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {/* Pricing Section */}
              {section.key === "pricing" && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {pricingTiers.map((tier) => (
                    <div
                      key={tier.tier}
                      className={`rounded-md border p-4 ${
                        tier.recommended
                          ? "border-black bg-[#f8f8f8]"
                          : "border-[#e0dbd5]"
                      }`}
                    >
                      {tier.recommended && (
                        <Badge className="mb-2 bg-black text-[10px] text-white">
                          Recommended
                        </Badge>
                      )}
                      <p className="text-sm font-semibold text-black">
                        {tier.tier}
                      </p>
                      <p className="mt-0.5 text-xs text-[#888]">{tier.desc}</p>
                      <p className="mt-2 text-2xl font-bold text-black">
                        ${tier.price.toLocaleString()}
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {tier.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2 text-xs text-[#555]"
                          >
                            <CheckCircle
                              className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-600"
                              strokeWidth={1.5}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Signature Section */}
              {section.key === "signature" && (
                <div className="rounded-md border border-dashed border-[#e0dbd5] p-6 text-center">
                  <p className="text-sm text-[#888]">
                    E-signature will be collected here
                  </p>
                  <p className="mt-1 text-xs text-[#888]">
                    DocuSign / HelloSign integration
                  </p>
                </div>
              )}

              {/* Text Sections */}
              {section.key !== "pricing" && section.key !== "signature" && (
                <>
                  {mode === "edit" ? (
                    <Textarea
                      value={sectionContents[section.key] ?? ""}
                      onChange={(e) =>
                        setSectionContents({
                          ...sectionContents,
                          [section.key]: e.target.value,
                        })
                      }
                      rows={8}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#555]">
                      {sectionContents[section.key]}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
