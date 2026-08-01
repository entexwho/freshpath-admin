import { format } from "date-fns";
import { AddJobDialog } from "@/components/admin/add-job-dialog";
import { JobCard } from "@/components/admin/job-card";
import { PageHeader } from "@/components/admin/page-header";
import { listClients } from "@/lib/data/clients";
import { listTodaysJobs } from "@/lib/data/jobs";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [jobs, clients] = await Promise.all([
    listTodaysJobs(),
    listClients(),
  ]);

  const remaining = jobs.filter((job) => job.status !== "completed").length;

  return (
    <div>
      <PageHeader
        title="Today"
        description={`${format(new Date(), "EEEE, MMMM d")} · ${remaining} open job${remaining === 1 ? "" : "s"}`}
        actions={<AddJobDialog clients={clients} />}
      />

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-14 text-center">
          <p className="font-medium text-slate-800">No jobs scheduled today</p>
          <p className="mt-1 text-sm text-zinc-500">
            Add a job or check the calendar for upcoming visits.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
