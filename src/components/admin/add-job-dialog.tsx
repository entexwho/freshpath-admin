"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createJobAction } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import type { Client } from "@/lib/types";

type AddJobDialogProps = {
  clients: Client[];
};

export function AddJobDialog({ clients }: AddJobDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    client_id: clients[0]?.id ?? "",
    scheduled_date: "",
    duration_hours: "2",
    estimated_price: "",
    job_notes: "",
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createJobAction({
        client_id: form.client_id,
        scheduled_date: new Date(form.scheduled_date).toISOString(),
        duration_hours: Number(form.duration_hours),
        estimated_price: form.estimated_price
          ? Number(form.estimated_price)
          : undefined,
        job_notes: form.job_notes || undefined,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setForm({
        client_id: clients[0]?.id ?? "",
        scheduled_date: "",
        duration_hours: "2",
        estimated_price: "",
        job_notes: "",
      });
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        className="bg-teal-700 text-white hover:bg-teal-800"
        disabled={clients.length === 0}
        onClick={() => setOpen(true)}
      >
        <Plus data-icon="inline-start" />
        Add job
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Schedule a job"
        description="Pick a client, time, and estimated price for the visit."
      >
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="client_id">Client</Label>
            <select
              id="client_id"
              required
              value={form.client_id}
              onChange={(e) => updateField("client_id", e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {clients.length === 0 ? (
                <option value="">No clients yet</option>
              ) : null}
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="scheduled_date">Date & time</Label>
            <Input
              id="scheduled_date"
              type="datetime-local"
              required
              value={form.scheduled_date}
              onChange={(e) => updateField("scheduled_date", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="duration_hours">Duration (hours)</Label>
              <Input
                id="duration_hours"
                type="number"
                min="0.5"
                step="0.5"
                required
                value={form.duration_hours}
                onChange={(e) => updateField("duration_hours", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="estimated_price">Estimated price</Label>
              <Input
                id="estimated_price"
                type="number"
                min="0"
                step="0.01"
                value={form.estimated_price}
                onChange={(e) => updateField("estimated_price", e.target.value)}
                placeholder="120.00"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="job_notes">Job notes</Label>
            <Textarea
              id="job_notes"
              value={form.job_notes}
              onChange={(e) => updateField("job_notes", e.target.value)}
              placeholder="Special requests for this visit…"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-1 flex justify-end gap-2">
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
              disabled={pending || clients.length === 0}
              className="bg-teal-700 text-white hover:bg-teal-800"
            >
              {pending ? "Scheduling…" : "Schedule job"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
