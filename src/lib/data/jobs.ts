import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import type { Job, JobStatus, JobWithClient, NewJobInput } from "@/lib/types";
import {
  demoCreateJob,
  demoListClients,
  demoListJobs,
  demoRescheduleJob,
  demoUpdateJobStatus,
} from "@/lib/data/demo-store";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

async function attachClients(jobs: Job[]): Promise<JobWithClient[]> {
  const clients = await demoListClients();
  const byId = new Map(clients.map((c) => [c.id, c]));

  return jobs
    .map((job) => {
      const client = byId.get(job.client_id);
      if (!client) return null;
      return {
        ...job,
        client: {
          id: client.id,
          full_name: client.full_name,
          address: client.address,
          phone: client.phone,
          email: client.email,
        },
      };
    })
    .filter((j): j is JobWithClient => Boolean(j));
}

export async function listJobsWithClients(
  clientId?: string
): Promise<JobWithClient[]> {
  if (!isSupabaseConfigured()) {
    const jobs = await demoListJobs();
    const filtered = clientId
      ? jobs.filter((j) => j.client_id === clientId)
      : jobs;
    return attachClients(filtered);
  }

  const supabase = createClient();
  let query = supabase
    .from("jobs")
    .select("*, client:clients(id, full_name, address, phone, email)")
    .order("scheduled_date", { ascending: true });

  if (clientId) query = query.eq("client_id", clientId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as JobWithClient[];
}

export async function listTodaysJobs(): Promise<JobWithClient[]> {
  const jobs = await listJobsWithClients();
  const start = startOfDay(new Date());
  const end = endOfDay(new Date());

  return jobs.filter(
    (job) =>
      job.status !== "cancelled" &&
      isWithinInterval(new Date(job.scheduled_date), { start, end })
  );
}

export async function listUpcomingJobs(
  view: "week" | "month" = "week",
  clientId?: string
): Promise<JobWithClient[]> {
  const jobs = await listJobsWithClients(clientId);
  const now = new Date();
  const start = view === "week" ? startOfWeek(now) : startOfMonth(now);
  const end = view === "week" ? endOfWeek(now) : endOfMonth(now);

  return jobs.filter(
    (job) =>
      job.status !== "cancelled" &&
      isWithinInterval(new Date(job.scheduled_date), { start, end })
  );
}

export async function listFutureJobsForClient(
  clientId: string
): Promise<JobWithClient[]> {
  const jobs = await listJobsWithClients(clientId);
  const now = new Date();
  return jobs.filter(
    (job) =>
      job.status !== "cancelled" &&
      job.status !== "completed" &&
      new Date(job.scheduled_date).getTime() >= startOfDay(now).getTime()
  );
}

export async function createJobRecord(input: NewJobInput): Promise<Job> {
  if (!isSupabaseConfigured()) {
    return demoCreateJob(input);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      client_id: input.client_id,
      scheduled_date: input.scheduled_date,
      duration_hours: input.duration_hours,
      estimated_price: input.estimated_price ?? null,
      job_notes: input.job_notes || null,
      status: input.status ?? "scheduled",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Job;
}

export async function updateJobStatus(
  id: string,
  status: JobStatus
): Promise<Job | null> {
  if (!isSupabaseConfigured()) {
    return demoUpdateJobStatus(id, status);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Job | null;
}

export async function rescheduleJob(
  id: string,
  scheduled_date: string
): Promise<Job | null> {
  if (!isSupabaseConfigured()) {
    return demoRescheduleJob(id, scheduled_date);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .update({ scheduled_date, status: "scheduled" })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Job | null;
}
