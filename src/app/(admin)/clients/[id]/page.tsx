import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { AccessNotesReveal } from "@/components/admin/access-notes-reveal";
import { PageHeader } from "@/components/admin/page-header";
import { getClient } from "@/lib/data/clients";

export const dynamic = "force-dynamic";

type ClientDetailPageProps = {
  params: { id: string };
};

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const client = await getClient(params.id);
  if (!client) notFound();

  return (
    <div>
      <Link
        href="/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
      >
        <ArrowLeft className="size-4" />
        Back to clients
      </Link>

      <PageHeader
        title={client.full_name}
        description="Client profile and private household details"
      />

      <div className="grid gap-4">
        <section className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            Contact
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start gap-2 text-slate-700">
              <Phone className="mt-0.5 size-4 text-zinc-400" />
              <div>
                <dt className="sr-only">Phone</dt>
                <dd>{client.phone || "No phone on file"}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <Mail className="mt-0.5 size-4 text-zinc-400" />
              <div>
                <dt className="sr-only">Email</dt>
                <dd>{client.email || "No email on file"}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="mt-0.5 size-4 text-zinc-400" />
              <div>
                <dt className="sr-only">Address</dt>
                <dd>{client.address || "No address on file"}</dd>
              </div>
            </div>
          </dl>
        </section>

        <AccessNotesReveal notes={client.access_notes} />

        <section className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            Private notes
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {client.private_notes || "No private notes yet."}
          </p>
        </section>
      </div>
    </div>
  );
}
