"use server";

import { revalidatePath } from "next/cache";
import { createJobRecord, updateJobStatus } from "@/lib/data/jobs";
import type { NewJobInput } from "@/lib/types";

export async function createJobAction(input: NewJobInput) {
  if (!input.client_id) {
    return { error: "Please select a client." };
  }
  if (!input.scheduled_date) {
    return { error: "Please pick a date and time." };
  }
  if (!input.duration_hours || input.duration_hours <= 0) {
    return { error: "Duration must be greater than zero." };
  }

  try {
    const job = await createJobRecord(input);
    revalidatePath("/dashboard");
    revalidatePath("/calendar");
    revalidatePath("/clients");
    return { data: job };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create job.",
    };
  }
}

export async function markJobCompletedAction(jobId: string) {
  try {
    const job = await updateJobStatus(jobId, "completed");
    if (!job) return { error: "Job not found." };
    revalidatePath("/dashboard");
    revalidatePath("/calendar");
    return { data: job };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update job status.",
    };
  }
}
