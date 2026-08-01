"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createClientAction } from "@/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";

const emptyForm = {
  full_name: "",
  phone: "",
  email: "",
  address: "",
  access_notes: "",
  private_notes: "",
};

export function AddClientDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createClientAction(form);
      if (result.error) {
        setError(result.error);
        return;
      }
      setForm(emptyForm);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        className="bg-teal-700 text-white hover:bg-teal-800"
        onClick={() => setOpen(true)}
      >
        <Plus data-icon="inline-start" />
        Add client
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Add client"
        description="Save contact details and private notes for this household."
      >
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              required
              value={form.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
              placeholder="Jane Smith"
            />
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="(555) 000-0000"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="name@email.com"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="123 Main St"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="access_notes">Access notes</Label>
            <Textarea
              id="access_notes"
              value={form.access_notes}
              onChange={(e) => updateField("access_notes", e.target.value)}
              placeholder="Gate codes, alarm, key location…"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="private_notes">Private notes</Label>
            <Textarea
              id="private_notes"
              value={form.private_notes}
              onChange={(e) => updateField("private_notes", e.target.value)}
              placeholder="Preferences, pets, billing notes…"
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
              disabled={pending}
              className="bg-teal-700 text-white hover:bg-teal-800"
            >
              {pending ? "Saving…" : "Save client"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
