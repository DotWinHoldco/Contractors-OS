"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AppUser {
  authUser: User;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string | null;
  isSuperAdmin: boolean;
}

export function useAppUser() {
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAppUser(null);
        setLoading(false);
        return;
      }

      const { data: dbUser } = await supabase
        .from("users")
        .select("id, email, first_name, last_name, role, tenant_id")
        .eq("id", user.id)
        .single();

      if (dbUser) {
        setAppUser({
          authUser: user,
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.first_name || "",
          lastName: dbUser.last_name || "",
          role: dbUser.role,
          tenantId: dbUser.tenant_id,
          isSuperAdmin:
            dbUser.role === "platform_superadmin" ||
            dbUser.role === "platform_admin",
        });
      } else {
        // Fallback to auth metadata
        const meta = user.user_metadata || {};
        setAppUser({
          authUser: user,
          id: user.id,
          email: user.email || "",
          firstName: meta.first_name || "",
          lastName: meta.last_name || "",
          role: meta.role || "client",
          tenantId: meta.tenant_id || null,
          isSuperAdmin:
            meta.role === "platform_superadmin" ||
            meta.role === "platform_admin",
        });
      }

      setLoading(false);
    }

    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { appUser, loading };
}
