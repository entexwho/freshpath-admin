"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <h2 className="font-display text-2xl text-slate-900">Something went wrong</h2>
      <p className="max-w-md text-sm text-zinc-500">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button
        type="button"
        onClick={reset}
        className="bg-teal-700 text-white hover:bg-teal-800"
      >
        Try again
      </Button>
    </div>
  );
}
