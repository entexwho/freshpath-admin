import Link from "next/link";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { getSessionUser, requireClient } from "@/lib/auth/session";
import { listFutureJobsForClient } from "@/lib/data/jobs";
import {
  listInvoicesWithClients,
  summarizeInvoices,
} from "@/lib/data/invoices";

export const dynamic = "force-dynamic";

export default async function PortalHomePage() {
  const user = await getSessionUser();
  if (!requireClient(user)) redirect("/login");

  const [jobs, invoices] = await Promise.all([
    listFutureJobsForClient(user.clientId!),
    listInvoicesWithClients(user.clientId!),
  ]);
  const nextJob = jobs[0];
  const totals = summarizeInvoices(invoices);

  return (
    <div>
      <PageHeader
        title={`Hi, ${user.name.split(" ")[0]}`}
        description="Book cleans, check upcoming visits, and view invoices."
      />

      <div className="grid gap-3">
        <section className="rounded-2xl bg-white/90 p-5 ring-1 ring-slate-200/80">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Next visit
          </p>
          {nextJob ? (
            <div className="mt-2">
              <p className="font-display text-xl text-slate-900">
                {format(
                  new Date(nextJob.scheduled_date),
                  "EEEE, MMM d · h:mm a"
                )}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge status={nextJob.status} />
                <span className="text-sm text-zinc-500">
                  {nextJob.duration_hours}h
                  {nextJob.estimated_price != null
                    ? ` · $${Number(nextJob.estimated_price).toFixed(0)}`
                    : ""}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">No upcoming cleans yet.</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/portal/book"
              className="inline-flex h-8 items-center rounded-lg bg-teal-700 px-3 text-sm font-medium text-white hover:bg-teal-800"
            >
              Book a clean
            </Link>
            <Link
              href="/portal/upcoming"
              className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View all
            </Link>
          </div>
        </section>

        <section className="rounded-2xl bg-white/90 p-5 ring-1 ring-slate-200/80">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Balance
          </p>
          <p className="mt-2 font-display text-2xl text-slate-900">
            ${totals.outstanding.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Outstanding · ${totals.paid.toFixed(2)} paid to date
          </p>
          <Link
            href="/portal/invoices"
            className="mt-4 inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View invoices
          </Link>
        </section>
      </div>
    </div>
  );
}
