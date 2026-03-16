import { createClient } from "@/lib/supabase/client";

// Replace with your real VAPID public key from your push notification server
const VAPID_PUBLIC_KEY = "REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY";

/**
 * Convert a URL-safe base64 string to a Uint8Array for the applicationServerKey.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if the browser supports push notifications.
 */
export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * Check if the user is already subscribed to push notifications.
 */
export async function isPushSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return subscription !== null;
}

/**
 * Subscribe the user to push notifications and save the subscription to Supabase.
 */
export async function subscribeToPush(userId: string, tenantId: string): Promise<void> {
  if (!isPushSupported()) {
    throw new Error("Push notifications are not supported in this browser.");
  }

  // Register the service worker if not already registered
  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  // Request notification permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission denied.");
  }

  // Subscribe to push
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
  });

  const subscriptionJson = subscription.toJSON();

  // Save to Supabase
  const supabase = createClient();
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      tenant_id: tenantId,
      endpoint: subscriptionJson.endpoint,
      p256dh: subscriptionJson.keys?.p256dh ?? "",
      auth: subscriptionJson.keys?.auth ?? "",
      device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
      browser: navigator.userAgent.split(" ").pop()?.split("/")[0] ?? "unknown",
      is_active: true,
    },
    { onConflict: "user_id,endpoint" }
  );

  if (error) {
    throw new Error(`Failed to save push subscription: ${error.message}`);
  }
}

/**
 * Unsubscribe from push notifications.
 */
export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();

    // Remove from Supabase
    const supabase = createClient();
    await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  }
}
