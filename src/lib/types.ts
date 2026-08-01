export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type Client = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  access_notes: string | null;
  private_notes: string | null;
  created_at: string;
};

export type Job = {
  id: string;
  client_id: string;
  scheduled_date: string;
  duration_hours: number;
  status: JobStatus;
  estimated_price: number | null;
  job_notes: string | null;
  created_at: string;
};

export type JobWithClient = Job & {
  client: Pick<Client, "id" | "full_name" | "address" | "phone">;
};

export type NewClientInput = {
  full_name: string;
  phone?: string;
  email?: string;
  address?: string;
  access_notes?: string;
  private_notes?: string;
};

export type NewJobInput = {
  client_id: string;
  scheduled_date: string;
  duration_hours: number;
  estimated_price?: number;
  job_notes?: string;
  status?: JobStatus;
};
