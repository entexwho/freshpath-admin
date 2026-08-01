import {
  demoLoginAsAdminAction,
  demoLoginAsClientAction,
} from "@/actions/auth";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_top,_#ecfdf5_0%,_#f8fafc_42%,_#f4f4f5_100%)] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-teal-700 text-white">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl tracking-tight text-slate-900">
              FreshPath
            </h1>
            <p className="text-sm text-zinc-500">Sign in to continue</p>
          </div>
        </div>

        {supabaseReady ? (
          <LoginForm />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600">
              Demo mode — pick a role to explore the app without Supabase.
            </p>
            <form action={demoLoginAsAdminAction}>
              <Button
                type="submit"
                className="w-full bg-teal-700 text-white hover:bg-teal-800"
              >
                Continue as Admin (cleaner)
              </Button>
            </form>
            <form action={demoLoginAsClientAction}>
              <Button type="submit" variant="outline" className="w-full">
                Continue as Client (Amelia Brooks)
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
