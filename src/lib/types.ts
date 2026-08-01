export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type UserRole = "admin" | "client";
export type InvoiceStatus = "draft" | "sent" | "paid" | "void";

export type Client = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  access_notes: string | null;
  private_notes: string | null;
  user_id?: string | null;
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
  client: Pick<Client, "id" | "full_name" | "address" | "phone" | "email">;
};

export type Invoice = {
  id: string;
  client_id: string;
  job_id: string | null;
  amount: number;
  status: InvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
};

export type InvoiceWithClient = Invoice & {
  client: Pick<Client, "id" | "full_name" | "email">;
  job?: Pick<Job, "id" | "scheduled_date" | "status"> | null;
};

export type SessionUser = {
  role: UserRole;
  name: string;
  email?: string;
  clientId?: string | null;
  userId?: string;
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

export type NewInvoiceInput = {
  client_id: string;
  job_id?: string | null;
  amount: number;
  status?: InvoiceStatus;
  due_date?: string;
  notes?: string;
};
