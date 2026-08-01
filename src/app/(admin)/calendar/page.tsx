import Link from "next/link";
import { format, parseISO } from "date-fns";
import { AddJobDialog } from "@/components/admin/add-job-dialog";
import { JobCard } from "@/components/admin/job-card";
import { PageHeader } from "@/components/admin/page-header";
import { listClients } from "@/lib/data/clients";
import { listUpcomingJobs } from "@/lib/data/jobs";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type CalendarPageProps = {
  searchParams?: { view?: string };
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const view = searchParams?.view === "month" ? "month" : "week";
  const [jobs, clients] = await Promise.all([
    listUpcomingJobs(view),
    listClients(),
  ]);

  const grouped = jobs.reduce<Record<string, typeof jobs>>((acc, job) => {
    const key = format(parseISO(job.scheduled_date), "yyyy-MM-dd");
    acc[key] = acc[key] ? [...acc[key], job] : [job];
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();

  return (
    <div>
      <PageHeader
        title="Calendar"
        description={
          view === "week"
            ? "This week’s visits, grouped by day."
            : "This month’s visits, grouped by day."
        }
        actions={<AddJobDialog clients={clients} />}
      />

      <div className="mb-5 inline-flex rounded-xl bg-white/80 p-1 ring-1 ring-slate-200/80">
        <Link
          href="/calendar?view=week"
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            view === "week"
              ? "bg-teal-700 text-white"
              : "text-zinc-600 hover:text-slate-900"
          )}
        >
          Week
        </Link>
        <Link
          href="/calendar?view=month"
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            view === "month"
              ? "bg-teal-700 text-white"
              : "text-zinc-600 hover:text-slate-900"
          )}
        >
          Month
        </Link>
      </div>

      {dates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-14 text-center">
          <p className="font-medium text-slate-800">No upcoming jobs</p>
          <p className="mt-1 text-sm text-zinc-500">
            Schedule a visit to populate the {view} view.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <section key={date} className="space-y-3">
              <h2 className="sticky top-[57px] z-10 bg-[linear-gradient(to_bottom,#f8fafc_70%,transparent)] py-1 font-display text-lg tracking-tight text-slate-800 md:top-0">
                {format(parseISO(date), "EEEE, MMM d")}
              </h2>
              <div className="grid gap-3">
                {grouped[date].map((job) => (
                  <JobCard key={job.id} job={job} showDate />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
