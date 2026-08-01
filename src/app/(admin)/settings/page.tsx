import { PageHeader } from "@/components/admin/page-header";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default function SettingsPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Workspace preferences for the admin dashboard"
      />

      <div className="space-y-4">
        <section className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 sm:p-5">
          <h2 className="font-medium text-slate-900">Data source</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {supabaseReady
              ? "Connected to Supabase. Clients and jobs sync with your project database."
              : "Running in demo mode with a local JSON store. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to connect Supabase."}
          </p>
        </section>

        <section className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 sm:p-5">
          <h2 className="font-medium text-slate-900">Phase 1 scope</h2>
          <p className="mt-1 text-sm text-zinc-500">
            This build covers the cleaner admin CRM and scheduling tools only.
            The client-facing portal is intentionally not included yet.
          </p>
        </section>
      </div>
    </div>
  );
}
