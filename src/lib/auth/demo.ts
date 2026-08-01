"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_SESSION_COOKIE } from "@/lib/auth/session";
import type { SessionUser } from "@/lib/types";

const DEMO_CLIENT_ID = "11111111-1111-1111-1111-111111111111";

export async function startDemoSession(role: "admin" | "client") {
  const session: SessionUser =
    role === "admin"
      ? {
          role: "admin",
          name: "FreshPath Admin",
          email: "admin@freshpath.demo",
        }
      : {
          role: "client",
          name: "Amelia Brooks",
          email: "amelia.brooks@email.com",
          clientId: DEMO_CLIENT_ID,
        };

  cookies().set(DEMO_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect(role === "admin" ? "/dashboard" : "/portal");
}

export async function clearDemoSession() {
  cookies().set(DEMO_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  redirect("/login");
}
