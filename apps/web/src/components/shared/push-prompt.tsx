"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isPushSupported, isPushSubscribed, subscribeToPush } from "@/lib/push/subscribe";

const DISMISSED_KEY = "push-prompt-dismissed";

interface PushPromptProps {
  userId?: string;
  tenantId?: string;
}

export function PushPrompt({ userId, tenantId }: PushPromptProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      if (typeof window === "undefined") return;
      if (localStorage.getItem(DISMISSED_KEY) === "true") return;
      if (!isPushSupported()) return;
      const subscribed = await isPushSubscribed();
      if (subscribed) return;
      setVisible(true);
    }
    check();
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  }

  async function handleEnable() {
    if (!userId || !tenantId) return;
    setLoading(true);
    try {
      await subscribeToPush(userId, tenantId);
      setVisible(false);
    } catch {
      // Silently fail - user may have denied permission
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:left-auto sm:right-6 sm:w-96">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            Enable notifications to stay updated on your project
          </p>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 text-gray-400 hover:text-gray-600"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button
          onClick={handleEnable}
          disabled={loading || !userId || !tenantId}
          className="text-sm font-medium text-white"
          style={{ backgroundColor: "#D4A84B" }}
          size="sm"
        >
          {loading ? "Enabling..." : "Enable"}
        </Button>
        <Button variant="ghost" size="sm" onClick={dismiss} className="text-sm text-gray-500">
          Dismiss
        </Button>
      </div>
    </div>
  );
}
