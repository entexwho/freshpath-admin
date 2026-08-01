import { Badge } from "@/components/ui/badge";
import type { JobStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<JobStatus, string> = {
  scheduled: "bg-sky-50 text-sky-800 ring-sky-200",
  in_progress: "bg-amber-50 text-amber-800 ring-amber-200",
  completed: "bg-teal-50 text-teal-800 ring-teal-200",
  cancelled: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

const statusLabels: Record<JobStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md border-0 font-medium ring-1 ring-inset",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </Badge>
  );
}
