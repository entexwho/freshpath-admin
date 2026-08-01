import { cookies } from "next/headers";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/lib/types";

export const DEMO_SESSION_COOKIE = "freshpath_demo_session";

export async function getSessionUser(): Promise<SessionUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, client_id")
      .eq("id", user.id)
      .maybeSingle();

    return {
      role: (profile?.role as SessionUser["role"]) ?? "client",
      name: profile?.full_name || user.email || "User",
      email: user.email,
      clientId: profile?.client_id ?? null,
      userId: user.id,
    };
  }

  const raw = cookies().get(DEMO_SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function requireAdmin(user: SessionUser | null): user is SessionUser {
  return Boolean(user && user.role === "admin");
}

export function requireClient(user: SessionUser | null): user is SessionUser {
  return Boolean(user && user.role === "client" && user.clientId);
}
