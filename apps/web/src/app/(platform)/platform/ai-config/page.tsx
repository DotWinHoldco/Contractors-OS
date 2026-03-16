"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface AIModel {
  id: string;
  model_key: string;
  provider: string;
  api_model_id: string;
  display_name: string;
  is_active: boolean;
  is_available: boolean;
  cost_per_1k_input: number;
  cost_per_1k_output: number;
}

export default function AIConfigPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("ai_model_registry")
        .select("*")
        .order("provider, display_name");
      setModels((data as unknown as AIModel[]) || []);
      setLoading(false);
    }
    fetch();
  }, []);

  const providerColors: Record<string, string> = {
    anthropic: "bg-[#d4a84b] text-black",
    openai: "bg-[#1a1a1a] text-white",
    google: "bg-[#2d6a4f] text-white",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">AI Configuration</h1>
        <p className="text-sm text-[#888]">
          Manage AI models, routing, and A/B tests
        </p>
      </div>

      <Tabs defaultValue="models">
        <TabsList>
          <TabsTrigger value="models">Model Registry</TabsTrigger>
          <TabsTrigger value="routing">Module Routing</TabsTrigger>
          <TabsTrigger value="tests">A/B Tests</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="mt-6">
          <Card className="border border-[#e0dbd5] bg-white shadow-none">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>API Model ID</TableHead>
                    <TableHead>Cost (1K in/out)</TableHead>
                    <TableHead>Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-[#888]">
                        Loading models...
                      </TableCell>
                    </TableRow>
                  ) : models.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-[#888]">
                        No models found. Run the database migration to seed models.
                      </TableCell>
                    </TableRow>
                  ) : (
                    models.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">
                          {model.display_name || model.model_key}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              providerColors[model.provider] || "bg-[#e0dbd5]"
                            }
                          >
                            {model.provider}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-[#888]">
                          {model.api_model_id}
                        </TableCell>
                        <TableCell className="text-[#888]">
                          ${model.cost_per_1k_input?.toFixed(4)} / $
                          {model.cost_per_1k_output?.toFixed(4)}
                        </TableCell>
                        <TableCell>
                          <Switch checked={model.is_active} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="mt-6">
          <Card className="border border-[#e0dbd5] bg-white shadow-none">
            <CardHeader>
              <CardTitle>Module Routing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#888]">
                Select a tenant to configure AI module routing. Each module
                (scope_generator, estimate_builder, chat, etc.) can be routed to
                a specific model with fallback.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="mt-6">
          <Card className="border border-[#e0dbd5] bg-white shadow-none">
            <CardHeader>
              <CardTitle>A/B Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#888]">
                Create and monitor A/B tests comparing different models for the
                same module. Track quality, speed, and cost metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <Card className="border border-[#e0dbd5] bg-white shadow-none">
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#888]">
                AI usage analytics will display here once generations are logged.
                Track tokens, cost, latency by model, tenant, and module.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
