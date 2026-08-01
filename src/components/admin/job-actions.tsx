"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Play, X } from "lucide-react";
import {
  cancelJobAction,
  markJobCompletedAction,
  startJobAction,
} from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { RescheduleDialog } from "@/components/admin/reschedule-dialog";
import type { JobStatus } from "@/lib/types";

export function JobActions({
  jobId,
  status,
}: {
  jobId: string;
  status: JobStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (status === "completed" || status === "cancelled") return null;

  function run(action: () => Promise<{ error?: string }>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {status === "scheduled" ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run(() => startJobAction(jobId))}
        >
          <Play data-icon="inline-start" />
          Start
        </Button>
      ) : null}
      <Button
        type="button"
        size="sm"
        disabled={pending}
        className="bg-teal-700 text-white hover:bg-teal-800"
        onClick={() => run(() => markJobCompletedAction(jobId))}
      >
        <Check data-icon="inline-start" />
        Complete
      </Button>
      <RescheduleDialog jobId={jobId} />
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={pending}
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => run(() => cancelJobAction(jobId))}
      >
        <X data-icon="inline-start" />
        Cancel
      </Button>
    </div>
  );
}
