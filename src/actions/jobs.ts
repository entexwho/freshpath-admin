"use server";

import { revalidatePath } from "next/cache";
import {
  createJobRecord,
  rescheduleJob,
  updateJobStatus,
} from "@/lib/data/jobs";
import type { JobStatus, NewJobInput } from "@/lib/types";

function revalidateJobPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/clients");
  revalidatePath("/portal");
  revalidatePath("/portal/book");
  revalidatePath("/portal/upcoming");
  revalidatePath("/invoices");
}

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
    revalidateJobPaths();
    return { data: job };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create job.",
    };
  }
}

export async function updateJobStatusAction(jobId: string, status: JobStatus) {
  try {
    const job = await updateJobStatus(jobId, status);
    if (!job) return { error: "Job not found." };
    revalidateJobPaths();
    return { data: job };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update job status.",
    };
  }
}

export async function markJobCompletedAction(jobId: string) {
  return updateJobStatusAction(jobId, "completed");
}

export async function startJobAction(jobId: string) {
  return updateJobStatusAction(jobId, "in_progress");
}

export async function cancelJobAction(jobId: string) {
  return updateJobStatusAction(jobId, "cancelled");
}

export async function rescheduleJobAction(
  jobId: string,
  scheduled_date: string
) {
  if (!scheduled_date) return { error: "Please pick a new date and time." };

  try {
    const job = await rescheduleJob(
      jobId,
      new Date(scheduled_date).toISOString()
    );
    if (!job) return { error: "Job not found." };
    revalidateJobPaths();
    return { data: job };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to reschedule.",
    };
  }
}
