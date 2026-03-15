"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Mail,
  Phone,
  FileText,
  Clock,
  Send,
  X,
  ArrowLeft,
  Search,
  Plus,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types & Mock Data
// ---------------------------------------------------------------------------

interface Template {
  id: string;
  name: string;
  channel: "email" | "sms";
  trigger: "manual" | "automated";
  subject?: string;
  body: string;
  lastModified: string;
  mergeVars: string[];
}

const templates: Template[] = [
  {
    id: "1",
    name: "Booking Confirmation",
    channel: "email",
    trigger: "automated",
    subject: "Your appointment is confirmed — {{company.name}}",
    body: "Hi {{client.first_name}},\n\nYour appointment has been confirmed for {{appointment.date}} at {{appointment.time}}.\n\nProject: {{project.name}}\nAddress: {{project.address}}\n\nIf you need to reschedule, please reply to this email or call us at {{company.phone}}.\n\nSee you soon,\n{{company.name}}",
    lastModified: "Mar 12, 2026",
    mergeVars: ["client.first_name", "appointment.date", "appointment.time", "project.name", "project.address", "company.phone", "company.name"],
  },
  {
    id: "2",
    name: "Estimate Ready",
    channel: "email",
    trigger: "automated",
    subject: "Your estimate for {{project.name}} is ready",
    body: "Hi {{client.first_name}},\n\nGreat news — your estimate for {{project.name}} is ready for review.\n\nEstimate Total: {{estimate.total}}\nValid Until: {{estimate.expiry_date}}\n\nClick the link below to view the full breakdown and approve:\n{{estimate.approval_link}}\n\nQuestions? Reply to this email or call {{company.phone}}.\n\nBest,\n{{company.name}}",
    lastModified: "Mar 10, 2026",
    mergeVars: ["client.first_name", "project.name", "estimate.total", "estimate.expiry_date", "estimate.approval_link", "company.phone", "company.name"],
  },
  {
    id: "3",
    name: "Invoice Sent",
    channel: "email",
    trigger: "automated",
    subject: "Invoice #{{invoice.number}} from {{company.name}}",
    body: "Hi {{client.first_name}},\n\nPlease find your invoice details below:\n\nInvoice: #{{invoice.number}}\nAmount Due: {{invoice.amount}}\nDue Date: {{invoice.due_date}}\n\nPay securely online:\n{{invoice.payment_link}}\n\nThank you for your business!\n{{company.name}}",
    lastModified: "Mar 8, 2026",
    mergeVars: ["client.first_name", "invoice.number", "invoice.amount", "invoice.due_date", "invoice.payment_link", "company.name"],
  },
  {
    id: "4",
    name: "Payment Received",
    channel: "email",
    trigger: "automated",
    subject: "Payment received — Thank you, {{client.first_name}}!",
    body: "Hi {{client.first_name}},\n\nWe've received your payment of {{payment.amount}} for invoice #{{invoice.number}}.\n\nProject: {{project.name}}\nPayment Method: {{payment.method}}\nDate: {{payment.date}}\n\nThank you for your prompt payment!\n{{company.name}}",
    lastModified: "Mar 8, 2026",
    mergeVars: ["client.first_name", "payment.amount", "invoice.number", "project.name", "payment.method", "payment.date", "company.name"],
  },
  {
    id: "5",
    name: "Project Update",
    channel: "sms",
    trigger: "manual",
    subject: undefined,
    body: "Hi {{client.first_name}}, update on {{project.name}}: {{update.message}} — {{company.name}}",
    lastModified: "Mar 7, 2026",
    mergeVars: ["client.first_name", "project.name", "update.message", "company.name"],
  },
  {
    id: "6",
    name: "Review Request",
    channel: "sms",
    trigger: "automated",
    subject: undefined,
    body: "Hi {{client.first_name}}! Thanks for choosing {{company.name}} for your {{project.name}}. We'd love your feedback — leave a quick review here: {{review.link}}",
    lastModified: "Mar 5, 2026",
    mergeVars: ["client.first_name", "company.name", "project.name", "review.link"],
  },
  {
    id: "7",
    name: "Welcome Email",
    channel: "email",
    trigger: "automated",
    subject: "Welcome to {{company.name}}!",
    body: "Hi {{client.first_name}},\n\nWelcome to {{company.name}}! We're excited to work with you.\n\nYou can access your client portal anytime to:\n- View project updates\n- Approve estimates\n- Pay invoices\n- Message our team\n\nPortal link: {{portal.link}}\n\nIf you have any questions, don't hesitate to reach out.\n\nBest regards,\n{{company.name}}",
    lastModified: "Mar 3, 2026",
    mergeVars: ["client.first_name", "company.name", "portal.link"],
  },
  {
    id: "8",
    name: "Appointment Reminder",
    channel: "sms",
    trigger: "automated",
    subject: undefined,
    body: "Reminder: Your appointment with {{company.name}} is tomorrow, {{appointment.date}} at {{appointment.time}}. Address: {{project.address}}. Reply CONFIRM to confirm or call {{company.phone}} to reschedule.",
    lastModified: "Mar 1, 2026",
    mergeVars: ["company.name", "appointment.date", "appointment.time", "project.address", "company.phone"],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function highlightMergeVars(text: string) {
  const parts = text.split(/({{[^}]+}})/g);
  return parts.map((part, i) => {
    if (part.startsWith("{{") && part.endsWith("}}")) {
      return (
        <span
          key={i}
          className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[12px] font-medium"
          style={{ backgroundColor: "#f8f8f8", borderColor: "#e0dbd5", color: "black" }}
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");

  const filtered = templates.filter((t) => {
    if (!searchQuery) return true;
    return t.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const openTemplate = (t: Template) => {
    setSelectedTemplate(t);
    setEditSubject(t.subject ?? "");
    setEditBody(t.body);
  };

  const closeEditor = () => {
    setSelectedTemplate(null);
    setEditSubject("");
    setEditBody("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "#e0dbd5" }}>
        <div className="flex items-center gap-3">
          {selectedTemplate && (
            <Button variant="ghost" size="icon-sm" onClick={closeEditor}>
              <ArrowLeft size={16} strokeWidth={1.5} />
            </Button>
          )}
          <FileText size={20} strokeWidth={1.5} />
          <h1 className="text-lg font-semibold text-black">
            {selectedTemplate ? selectedTemplate.name : "Message Templates"}
          </h1>
        </div>
        {!selectedTemplate && (
          <Button style={{ backgroundColor: "black", color: "white", borderRadius: 8 }}>
            <Plus size={14} strokeWidth={1.5} />
            New Template
          </Button>
        )}
      </div>

      {selectedTemplate ? (
        /* ---- Template Editor ---- */
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-3xl">
            {/* Meta info */}
            <div className="mb-6 flex items-center gap-3">
              <Badge
                variant="outline"
                className="gap-1"
                style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
              >
                {selectedTemplate.channel === "email" ? (
                  <Mail size={12} strokeWidth={1.5} />
                ) : (
                  <Phone size={12} strokeWidth={1.5} />
                )}
                {selectedTemplate.channel === "email" ? "Email" : "SMS"}
              </Badge>
              <Badge
                variant="outline"
                className="gap-1"
                style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
              >
                {selectedTemplate.trigger === "automated" ? (
                  <Clock size={12} strokeWidth={1.5} />
                ) : (
                  <FileText size={12} strokeWidth={1.5} />
                )}
                {selectedTemplate.trigger === "automated" ? "Automated" : "Manual"}
              </Badge>
              <span className="text-[12px]" style={{ color: "#888" }}>
                Last modified: {selectedTemplate.lastModified}
              </span>
            </div>

            {/* Subject (email only) */}
            {selectedTemplate.channel === "email" && (
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-black">Subject</label>
                <Input
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="text-sm"
                  style={{ borderColor: "#e0dbd5", borderRadius: 8 }}
                />
              </div>
            )}

            {/* Body */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-black">Body</label>
              <Textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="min-h-[200px] text-sm"
                style={{ borderColor: "#e0dbd5", borderRadius: 8 }}
              />
            </div>

            {/* Merge variable chips */}
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-black">Merge Variables</label>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.mergeVars.map((v) => (
                  <button
                    key={v}
                    className="flex items-center gap-1 rounded-md border px-2 py-1 text-[12px] font-medium transition-colors hover:bg-black hover:text-white"
                    style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
                    onClick={() => setEditBody((prev) => prev + `{{${v}}}`)}
                  >
                    {`{{${v}}}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-black">Preview</label>
              <div
                className="rounded-lg border p-4 text-sm leading-relaxed whitespace-pre-wrap"
                style={{ borderColor: "#e0dbd5", backgroundColor: "#f8f8f8" }}
              >
                {selectedTemplate.channel === "email" && editSubject && (
                  <div className="mb-3 border-b pb-3" style={{ borderColor: "#e0dbd5" }}>
                    <span className="text-[12px] font-medium" style={{ color: "#888" }}>
                      Subject:{" "}
                    </span>
                    <span className="text-sm text-black">{highlightMergeVars(editSubject)}</span>
                  </div>
                )}
                <div className="text-sm text-black">{highlightMergeVars(editBody)}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button style={{ backgroundColor: "black", color: "white", borderRadius: 8 }}>
                Save Template
              </Button>
              <Button
                variant="outline"
                className="gap-1.5"
                style={{ borderColor: "#e0dbd5", borderRadius: 8 }}
              >
                <Send size={14} strokeWidth={1.5} />
                Test Send
              </Button>
              <Button variant="ghost" onClick={closeEditor} style={{ color: "#888" }}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ---- Template Grid ---- */
        <div className="flex-1 overflow-auto p-6">
          {/* Search */}
          <div className="mb-6 max-w-sm">
            <div className="relative">
              <Search size={16} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#888" }} />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-sm"
                style={{ borderColor: "#e0dbd5", borderRadius: 8, backgroundColor: "#f8f8f8" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t) => (
              <Card
                key={t.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                style={{ borderRadius: 8, borderColor: "#e0dbd5" }}
                onClick={() => openTemplate(t)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-black leading-tight">{t.name}</h3>
                    <Badge
                      variant="outline"
                      className="shrink-0 gap-1"
                      style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
                    >
                      {t.channel === "email" ? (
                        <Mail size={11} strokeWidth={1.5} />
                      ) : (
                        <Phone size={11} strokeWidth={1.5} />
                      )}
                      {t.channel === "email" ? "Email" : "SMS"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 line-clamp-3 text-[13px] leading-relaxed" style={{ color: "#888" }}>
                    {t.body.slice(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="gap-1 text-[10px]"
                      style={{ borderColor: "#e0dbd5", color: "#888", borderRadius: 6 }}
                    >
                      {t.trigger === "automated" ? (
                        <Clock size={10} strokeWidth={1.5} />
                      ) : (
                        <FileText size={10} strokeWidth={1.5} />
                      )}
                      {t.trigger === "automated" ? "Automated" : "Manual"}
                    </Badge>
                    <span className="text-[11px]" style={{ color: "#888" }}>
                      {t.lastModified}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm" style={{ color: "#888" }}>
              No templates found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
