import { Clock3, MapPin } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobActions } from "@/components/admin/job-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import type { JobWithClient } from "@/lib/types";

type JobCardProps = {
  job: JobWithClient;
  showDate?: boolean;
};

export function JobCard({ job, showDate = false }: JobCardProps) {
  const when = new Date(job.scheduled_date);

  return (
    <Card className="border-0 bg-white/90 shadow-sm ring-1 ring-slate-200/80">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base text-slate-900">
              {job.client.full_name}
            </CardTitle>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
              <Clock3 className="size-3.5 shrink-0" />
              {showDate
                ? format(when, "EEE, MMM d · h:mm a")
                : format(when, "h:mm a")}
              <span className="text-zinc-300">·</span>
              {job.duration_hours}h
            </p>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="flex items-start gap-1.5 text-sm text-zinc-600">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-zinc-400" />
          {job.client.address || "No address on file"}
        </p>
        {job.estimated_price != null ? (
          <p className="text-sm font-medium text-slate-800">
            ${Number(job.estimated_price).toFixed(2)}
          </p>
        ) : null}
        {job.job_notes ? (
          <p className="text-sm text-zinc-500">{job.job_notes}</p>
        ) : null}
      </CardContent>
      <CardFooter className="justify-end">
        <JobActions jobId={job.id} status={job.status} />
      </CardFooter>
    </Card>
  );
}
