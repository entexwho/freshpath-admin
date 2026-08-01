"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createInvoiceAction } from "@/actions/invoices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import type { Client, JobWithClient } from "@/lib/types";

export function AddInvoiceDialog({
  clients,
  jobs,
}: {
  clients: Client[];
  jobs: JobWithClient[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    client_id: clients[0]?.id ?? "",
    job_id: "",
    amount: "",
    due_date: "",
    notes: "",
  });

  const clientJobs = jobs.filter((j) => j.client_id === form.client_id);

  return (
    <>
      <Button
        type="button"
        className="bg-teal-700 text-white hover:bg-teal-800"
        onClick={() => setOpen(true)}
        disabled={clients.length === 0}
      >
        <Plus data-icon="inline-start" />
        New invoice
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Create invoice"
        description="Send a balance for a completed or upcoming visit."
      >
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            startTransition(async () => {
              const result = await createInvoiceAction({
                client_id: form.client_id,
                job_id: form.job_id || null,
                amount: Number(form.amount),
                due_date: form.due_date || undefined,
                notes: form.notes || undefined,
              });
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
            <Label htmlFor="invoice_client">Client</Label>
            <select
              id="invoice_client"
              required
              value={form.client_id}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  client_id: e.target.value,
                  job_id: "",
                }))
              }
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="invoice_job">Linked job (optional)</Label>
            <select
              id="invoice_job"
              value={form.job_id}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, job_id: e.target.value }))
              }
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="">No linked job</option>
              {clientJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {new Date(job.scheduled_date).toLocaleString()} · $
                  {Number(job.estimated_price ?? 0).toFixed(0)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="invoice_amount">Amount</Label>
              <Input
                id="invoice_amount"
                type="number"
                min="1"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="invoice_due">Due date</Label>
              <Input
                id="invoice_due"
                type="date"
                value={form.due_date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, due_date: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="invoice_notes">Notes</Label>
            <Textarea
              id="invoice_notes"
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
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
              {pending ? "Creating…" : "Create invoice"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
