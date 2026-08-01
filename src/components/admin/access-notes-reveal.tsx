"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type AccessNotesRevealProps = {
  notes: string | null;
};

export function AccessNotesReveal({ notes }: AccessNotesRevealProps) {
  const [revealed, setRevealed] = useState(false);

  if (!notes) {
    return (
      <p className="text-sm text-zinc-500">No access notes on file.</p>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
          <KeyRound className="size-4" />
          Access notes
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setRevealed((value) => !value)}
          className="border-amber-200 bg-white text-amber-900 hover:bg-amber-100"
        >
          {revealed ? (
            <>
              <EyeOff data-icon="inline-start" />
              Hide
            </>
          ) : (
            <>
              <Eye data-icon="inline-start" />
              Tap to Reveal
            </>
          )}
        </Button>
      </div>
      {revealed ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
          {notes}
        </p>
      ) : (
        <p className="select-none blur-sm text-sm text-slate-700" aria-hidden>
          {notes}
        </p>
      )}
    </div>
  );
}
