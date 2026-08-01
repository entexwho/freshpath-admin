import { format } from "date-fns";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { getSessionUser, requireClient } from "@/lib/auth/session";
import {
  listInvoicesWithClients,
  summarizeInvoices,
} from "@/lib/data/invoices";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PortalInvoicesPage() {
  const user = await getSessionUser();
  if (!requireClient(user)) redirect("/login");

  const invoices = await listInvoicesWithClients(user.clientId!);
  const totals = summarizeInvoices(invoices);

  return (
    <div>
      <PageHeader
        title="Your invoices"
        description={`$${totals.outstanding.toFixed(2)} outstanding`}
      />

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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-slate-900">
                    ${Number(invoice.amount).toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {format(new Date(invoice.created_at), "MMM d, yyyy")}
                    {invoice.due_date
                      ? ` · Due ${format(new Date(invoice.due_date), "MMM d")}`
                      : ""}
                  </p>
                  {invoice.notes ? (
                    <p className="mt-1 text-sm text-zinc-500">{invoice.notes}</p>
                  ) : null}
                </div>
                <Badge
                  className={cn(
                    "border-0 capitalize",
                    invoice.status === "paid"
                      ? "bg-teal-50 text-teal-800"
                      : "bg-amber-50 text-amber-800"
                  )}
                >
                  {invoice.status}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
