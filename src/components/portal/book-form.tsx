"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createJobAction } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BookForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    scheduled_date: "",
    duration_hours: "2",
    job_notes: "",
  });

  return (
    <form
      className="grid gap-3 rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 sm:p-5"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await createJobAction({
            client_id: clientId,
            scheduled_date: new Date(form.scheduled_date).toISOString(),
            duration_hours: Number(form.duration_hours),
            job_notes: form.job_notes || undefined,
            status: "scheduled",
          });
          if (result.error) {
            setError(result.error);
            return;
          }
          router.push("/portal/upcoming");
          router.refresh();
        });
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="book_date">Preferred date & time</Label>
        <Input
          id="book_date"
          type="datetime-local"
          required
          value={form.scheduled_date}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, scheduled_date: e.target.value }))
          }
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="book_duration">Estimated duration (hours)</Label>
        <Input
          id="book_duration"
          type="number"
          min="1"
          step="0.5"
          required
          value={form.duration_hours}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, duration_hours: e.target.value }))
          }
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="book_notes">Notes for your cleaner</Label>
        <Textarea
          id="book_notes"
          value={form.job_notes}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, job_notes: e.target.value }))
          }
          placeholder="Pets, focus areas, parking…"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        className="bg-teal-700 text-white hover:bg-teal-800"
      >
        {pending ? "Booking…" : "Request booking"}
      </Button>
    </form>
  );
}
