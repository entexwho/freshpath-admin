"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { clearDemoSession, startDemoSession } from "@/lib/auth/demo";

export async function demoLoginAsAdminAction() {
  await startDemoSession("admin");
}

export async function demoLoginAsClientAction() {
  await startDemoSession("client");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Use demo login instead." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  redirect(profile?.role === "admin" ? "/dashboard" : "/portal");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }
  await clearDemoSession();
}
