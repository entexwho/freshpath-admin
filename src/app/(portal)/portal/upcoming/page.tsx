import { format } from "date-fns";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { getSessionUser, requireClient } from "@/lib/auth/session";
import { listFutureJobsForClient } from "@/lib/data/jobs";

export const dynamic = "force-dynamic";

export default async function PortalUpcomingPage() {
  const user = await getSessionUser();
  if (!requireClient(user)) redirect("/login");

  const jobs = await listFutureJobsForClient(user.clientId!);

  return (
    <div>
      <PageHeader
        title="Upcoming cleans"
        description="Your scheduled and in-progress visits."
      />

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-14 text-center text-sm text-zinc-500">
          No upcoming cleans. Book one anytime.
        </div>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">
                    {format(
                      new Date(job.scheduled_date),
                      "EEEE, MMM d · h:mm a"
                    )}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {job.duration_hours}h
                    {job.estimated_price != null
                      ? ` · $${Number(job.estimated_price).toFixed(2)}`
                      : ""}
                  </p>
                  {job.job_notes ? (
                    <p className="mt-2 text-sm text-zinc-500">{job.job_notes}</p>
                  ) : null}
                </div>
                <StatusBadge status={job.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
