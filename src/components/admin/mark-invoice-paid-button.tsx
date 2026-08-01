"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Banknote } from "lucide-react";
import { markInvoicePaidAction } from "@/actions/invoices";
import { Button } from "@/components/ui/button";

export function MarkInvoicePaidButton({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      className="bg-teal-700 text-white hover:bg-teal-800"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await markInvoicePaidAction(invoiceId);
          router.refresh();
        });
      }}
    >
      <Banknote data-icon="inline-start" />
      {pending ? "Saving…" : "Mark paid"}
    </Button>
  );
}
