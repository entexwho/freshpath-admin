import { AddClientDialog } from "@/components/admin/add-client-dialog";
import { ClientList } from "@/components/admin/client-list";
import { PageHeader } from "@/components/admin/page-header";
import { listClients } from "@/lib/data/clients";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await listClients();

  return (
    <div>
      <PageHeader
        title="Clients"
        description={`${clients.length} household${clients.length === 1 ? "" : "s"} in your CRM`}
        actions={<AddClientDialog />}
      />
      <ClientList clients={clients} />
    </div>
  );
}
