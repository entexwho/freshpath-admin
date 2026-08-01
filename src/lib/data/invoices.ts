import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import type {
  Invoice,
  InvoiceStatus,
  InvoiceWithClient,
  NewInvoiceInput,
} from "@/lib/types";
import {
  demoCreateInvoice,
  demoListClients,
  demoListInvoices,
  demoListJobs,
  demoUpdateInvoiceStatus,
} from "@/lib/data/demo-store";

export async function listInvoicesWithClients(
  clientId?: string
): Promise<InvoiceWithClient[]> {
  if (!isSupabaseConfigured()) {
    const [invoices, clients, jobs] = await Promise.all([
      demoListInvoices(),
      demoListClients(),
      demoListJobs(),
    ]);
    const clientsById = new Map(clients.map((c) => [c.id, c]));
    const jobsById = new Map(jobs.map((j) => [j.id, j]));

    const result: InvoiceWithClient[] = [];
    for (const inv of invoices) {
      if (clientId && inv.client_id !== clientId) continue;
      const client = clientsById.get(inv.client_id);
      if (!client) continue;
      const job = inv.job_id ? jobsById.get(inv.job_id) : null;
      result.push({
        ...inv,
        client: {
          id: client.id,
          full_name: client.full_name,
          email: client.email,
        },
        job: job
          ? {
              id: job.id,
              scheduled_date: job.scheduled_date,
              status: job.status,
            }
          : null,
      });
    }
    return result;
  }

  const supabase = createClient();
  let query = supabase
    .from("invoices")
    .select(
      "*, client:clients(id, full_name, email), job:jobs(id, scheduled_date, status)"
    )
    .order("created_at", { ascending: false });

  if (clientId) query = query.eq("client_id", clientId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as InvoiceWithClient[];
}

export async function createInvoiceRecord(
  input: NewInvoiceInput
): Promise<Invoice> {
  if (!isSupabaseConfigured()) {
    return demoCreateInvoice(input);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      client_id: input.client_id,
      job_id: input.job_id ?? null,
      amount: input.amount,
      status: input.status ?? "sent",
      due_date: input.due_date ?? null,
      notes: input.notes || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Invoice;
}

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus
): Promise<Invoice | null> {
  if (!isSupabaseConfigured()) {
    return demoUpdateInvoiceStatus(id, status);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .update({
      status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Invoice | null;
}

export function summarizeInvoices(invoices: InvoiceWithClient[]) {
  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "draft")
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const paid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.amount), 0);
  return { outstanding, paid, count: invoices.length };
}
