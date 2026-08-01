import { signOutAction } from "@/actions/auth";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabaseReady = isSupabaseConfigured();
  const user = await getSessionUser();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Workspace preferences for the admin dashboard"
      />

      <div className="space-y-4">
        <section className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 sm:p-5">
          <h2 className="font-medium text-slate-900">Signed in as</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {user?.name}
            {user?.email ? ` · ${user.email}` : ""} · {user?.role}
          </p>
          <form action={signOutAction} className="mt-4">
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </section>

        <section className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 sm:p-5">
          <h2 className="font-medium text-slate-900">Data source</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {supabaseReady
              ? "Connected to Supabase. Auth, clients, jobs, and invoices sync with your project."
              : "Running in demo mode with a local JSON store. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then run supabase/schema.sql."}
          </p>
        </section>

        <section className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 sm:p-5">
          <h2 className="font-medium text-slate-900">How to go live</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-500">
            <li>Create a Supabase project and run `supabase/schema.sql`.</li>
            <li>Create an Auth user for yourself and set `profiles.role = admin`.</li>
            <li>Link client portal users via `profiles.client_id`.</li>
            <li>Copy project URL + anon key into `.env.local`.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
