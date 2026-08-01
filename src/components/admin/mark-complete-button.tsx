"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { markJobCompletedAction } from "@/actions/jobs";
import { Button } from "@/components/ui/button";

export function MarkCompleteButton({
  jobId,
  disabled,
}: {
  jobId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      disabled={disabled || pending}
      className="bg-teal-700 text-white hover:bg-teal-800"
      onClick={() => {
        startTransition(async () => {
          await markJobCompletedAction(jobId);
          router.refresh();
        });
      }}
    >
      <Check data-icon="inline-start" />
      {pending ? "Saving…" : "Mark as Completed"}
    </Button>
  );
}
