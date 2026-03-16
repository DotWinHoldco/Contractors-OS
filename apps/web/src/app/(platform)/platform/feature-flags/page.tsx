"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FeatureFlag {
  id: string;
  flag_key: string;
  display_name: string;
  description: string;
  is_enabled: boolean;
  rollout_percentage: number;
  plans: string[];
}

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("feature_flags")
        .select("*")
        .order("flag_key");
      setFlags((data as unknown as FeatureFlag[]) || []);
      setLoading(false);
    }
    fetch();
  }, []);

  async function toggleFlag(id: string, enabled: boolean) {
    const supabase = createClient();
    await supabase
      .from("feature_flags")
      .update({ status: enabled ? "enabled" : "disabled" })
      .eq("id", id);
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, is_enabled: enabled } : f))
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Feature Flags</h1>
        <p className="text-sm text-[#888]">
          Control feature availability across tenants
        </p>
      </div>

      <Card className="border border-[#e0dbd5] bg-white shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Rollout</TableHead>
                <TableHead>Enabled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-[#888]">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : flags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-[#888]">
                    No feature flags configured yet.
                  </TableCell>
                </TableRow>
              ) : (
                flags.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{flag.display_name || flag.flag_key}</p>
                        <p className="font-mono text-xs text-[#888]">
                          {flag.flag_key}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs text-sm text-[#888]">
                      {flag.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {flag.rollout_percentage || 100}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={flag.is_enabled}
                        onCheckedChange={(checked) =>
                          toggleFlag(flag.id, checked)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
