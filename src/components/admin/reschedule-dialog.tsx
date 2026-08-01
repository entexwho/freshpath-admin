"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock } from "lucide-react";
import { rescheduleJobAction } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

export function RescheduleDialog({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <CalendarClock data-icon="inline-start" />
        Reschedule
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Reschedule job"
        description="Pick a new date and time for this visit."
      >
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            startTransition(async () => {
              const result = await rescheduleJobAction(jobId, scheduledDate);
              if (result.error) {
                setError(result.error);
                return;
              }
              setOpen(false);
              router.refresh();
            });
          }}
        >
          <div className="grid gap-1.5">
            <Label htmlFor={`reschedule-${jobId}`}>New date & time</Label>
            <Input
              id={`reschedule-${jobId}`}
              type="datetime-local"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="bg-teal-700 text-white hover:bg-teal-800"
            >
              {pending ? "Saving…" : "Save new time"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
