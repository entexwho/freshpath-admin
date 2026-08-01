import { format } from "date-fns";
import { AddInvoiceDialog } from "@/components/admin/add-invoice-dialog";
import { MarkInvoicePaidButton } from "@/components/admin/mark-invoice-paid-button";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { listClients } from "@/lib/data/clients";
import {
  listInvoicesWithClients,
  summarizeInvoices,
} from "@/lib/data/invoices";
import { listJobsWithClients } from "@/lib/data/jobs";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyles = {
  draft: "bg-zinc-100 text-zinc-700",
  sent: "bg-amber-50 text-amber-800",
  paid: "bg-teal-50 text-teal-800",
  void: "bg-red-50 text-red-700",
};

export default async function InvoicesPage() {
  const [invoices, clients, jobs] = await Promise.all([
    listInvoicesWithClients(),
    listClients(),
    listJobsWithClients(),
  ]);
  const totals = summarizeInvoices(invoices);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Track balances and mark payments received."
        actions={<AddInvoiceDialog clients={clients} jobs={jobs} />}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Outstanding
          </p>
          <p className="mt-1 font-display text-2xl text-slate-900">
            ${totals.outstanding.toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Paid
          </p>
          <p className="mt-1 font-display text-2xl text-slate-900">
            ${totals.paid.toFixed(2)}
          </p>
        </div>
        <div className="col-span-2 rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 sm:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Invoices
          </p>
          <p className="mt-1 font-display text-2xl text-slate-900">
            {totals.count}
          </p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-14 text-center text-sm text-zinc-500">
          No invoices yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">
                    {invoice.client.full_name}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Created {format(new Date(invoice.created_at), "MMM d, yyyy")}
                    {invoice.due_date
                      ? ` · Due ${format(new Date(invoice.due_date), "MMM d")}`
                      : ""}
                  </p>
                  {invoice.notes ? (
                    <p className="mt-1 text-sm text-zinc-500">{invoice.notes}</p>
                  ) : null}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-display text-xl text-slate-900">
                    ${Number(invoice.amount).toFixed(2)}
                  </p>
                  <Badge
                    className={cn(
                      "border-0",
                      statusStyles[invoice.status]
                    )}
                  >
                    {invoice.status}
                  </Badge>
                  {invoice.status !== "paid" && invoice.status !== "void" ? (
                    <MarkInvoicePaidButton invoiceId={invoice.id} />
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
