import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  Client,
  Invoice,
  InvoiceStatus,
  Job,
  JobStatus,
  NewClientInput,
  NewInvoiceInput,
  NewJobInput,
} from "@/lib/types";

type Store = {
  clients: Client[];
  jobs: Job[];
  invoices: Invoice[];
};

const STORE_PATH = path.join(process.cwd(), "data", "demo-store.json");

function startOfToday() {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  return d;
}

function seedStore(): Store {
  const today = startOfToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 3);

  const clients: Client[] = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      full_name: "Amelia Brooks",
      phone: "(555) 210-4411",
      email: "amelia.brooks@email.com",
      address: "142 Maple Lane, Apt 2B",
      access_notes: "Gate code 4821. Spare key under the blue planter.",
      private_notes: "Prefers eco-friendly products. Dog is friendly.",
      created_at: new Date().toISOString(),
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      full_name: "Daniel Chen",
      phone: "(555) 883-0192",
      email: "daniel.chen@email.com",
      address: "88 Harbor View Drive",
      access_notes: "Alarm code 3390. Disarm panel in mudroom.",
      private_notes: "Biweekly deep clean. Leaves tip in kitchen jar.",
      created_at: new Date().toISOString(),
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      full_name: "Priya Nair",
      phone: "(555) 441-7780",
      email: "priya.nair@email.com",
      address: "19 Cedar Court",
      access_notes: null,
      private_notes: "Allergic to strong scents — use unscented only.",
      created_at: new Date().toISOString(),
    },
  ];

  const jobs: Job[] = [
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      client_id: clients[0].id,
      scheduled_date: new Date(today.getTime()).toISOString(),
      duration_hours: 2.5,
      status: "scheduled",
      estimated_price: 145,
      job_notes: "Focus on kitchen and bathrooms.",
      created_at: new Date().toISOString(),
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      client_id: clients[1].id,
      scheduled_date: new Date(today.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      duration_hours: 3,
      status: "scheduled",
      estimated_price: 180,
      job_notes: "Change bedding if laundry is left out.",
      created_at: new Date().toISOString(),
    },
    {
      id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      client_id: clients[2].id,
      scheduled_date: tomorrow.toISOString(),
      duration_hours: 2,
      status: "scheduled",
      estimated_price: 120,
      job_notes: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
      client_id: clients[0].id,
      scheduled_date: nextWeek.toISOString(),
      duration_hours: 2,
      status: "scheduled",
      estimated_price: 145,
      job_notes: "Standard clean.",
      created_at: new Date().toISOString(),
    },
  ];

  const invoices: Invoice[] = [
    {
      id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
      client_id: clients[1].id,
      job_id: null,
      amount: 180,
      status: "sent",
      due_date: new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10),
      paid_at: null,
      notes: "Previous visit balance",
      created_at: new Date().toISOString(),
    },
    {
      id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
      client_id: clients[0].id,
      job_id: null,
      amount: 145,
      status: "paid",
      due_date: new Date(today.getTime() - 14 * 86400000).toISOString().slice(0, 10),
      paid_at: new Date(today.getTime() - 10 * 86400000).toISOString(),
      notes: "Paid via Venmo",
      created_at: new Date().toISOString(),
    },
  ];

  return { clients, jobs, invoices };
}

async function ensureStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!parsed.invoices) parsed.invoices = seedStore().invoices;
    return parsed;
  } catch {
    const seeded = seedStore();
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(seeded, null, 2));
    return seeded;
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

export async function demoListClients(): Promise<Client[]> {
  const store = await ensureStore();
  return [...store.clients].sort((a, b) =>
    a.full_name.localeCompare(b.full_name)
  );
}

export async function demoGetClient(id: string): Promise<Client | null> {
  const store = await ensureStore();
  return store.clients.find((c) => c.id === id) ?? null;
}

export async function demoCreateClient(input: NewClientInput): Promise<Client> {
  const store = await ensureStore();
  const client: Client = {
    id: randomUUID(),
    full_name: input.full_name,
    phone: input.phone || null,
    email: input.email || null,
    address: input.address || null,
    access_notes: input.access_notes || null,
    private_notes: input.private_notes || null,
    created_at: new Date().toISOString(),
  };
  store.clients.push(client);
  await writeStore(store);
  return client;
}

export async function demoListJobs(): Promise<Job[]> {
  const store = await ensureStore();
  return [...store.jobs].sort(
    (a, b) =>
      new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
  );
}

export async function demoCreateJob(input: NewJobInput): Promise<Job> {
  const store = await ensureStore();
  const job: Job = {
    id: randomUUID(),
    client_id: input.client_id,
    scheduled_date: input.scheduled_date,
    duration_hours: input.duration_hours,
    status: input.status ?? "scheduled",
    estimated_price: input.estimated_price ?? null,
    job_notes: input.job_notes || null,
    created_at: new Date().toISOString(),
  };
  store.jobs.push(job);
  await writeStore(store);
  return job;
}

export async function demoUpdateJobStatus(
  id: string,
  status: JobStatus
): Promise<Job | null> {
  const store = await ensureStore();
  const job = store.jobs.find((j) => j.id === id);
  if (!job) return null;
  job.status = status;
  await writeStore(store);
  return job;
}

export async function demoRescheduleJob(
  id: string,
  scheduled_date: string
): Promise<Job | null> {
  const store = await ensureStore();
  const job = store.jobs.find((j) => j.id === id);
  if (!job) return null;
  job.scheduled_date = scheduled_date;
  if (job.status === "cancelled") job.status = "scheduled";
  await writeStore(store);
  return job;
}

export async function demoListInvoices(): Promise<Invoice[]> {
  const store = await ensureStore();
  return [...store.invoices].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function demoCreateInvoice(
  input: NewInvoiceInput
): Promise<Invoice> {
  const store = await ensureStore();
  const invoice: Invoice = {
    id: randomUUID(),
    client_id: input.client_id,
    job_id: input.job_id ?? null,
    amount: input.amount,
    status: input.status ?? "sent",
    due_date: input.due_date ?? null,
    paid_at: null,
    notes: input.notes || null,
    created_at: new Date().toISOString(),
  };
  store.invoices.push(invoice);
  await writeStore(store);
  return invoice;
}

export async function demoUpdateInvoiceStatus(
  id: string,
  status: InvoiceStatus
): Promise<Invoice | null> {
  const store = await ensureStore();
  const invoice = store.invoices.find((i) => i.id === id);
  if (!invoice) return null;
  invoice.status = status;
  invoice.paid_at = status === "paid" ? new Date().toISOString() : null;
  await writeStore(store);
  return invoice;
}
