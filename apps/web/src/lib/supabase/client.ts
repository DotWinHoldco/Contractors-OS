import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://jedtxxytfajeoqeqaegz.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZHR4eHl0ZmFqZW9xZXFhZWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTI0MjEsImV4cCI6MjA4OTE2ODQyMX0.qNyR4zM0u362Q8vX8YTYCRunv-__pHdhBtiUCbKj95g";

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
