import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { BookForm } from "@/components/portal/book-form";
import { getSessionUser, requireClient } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function PortalBookPage() {
  const user = await getSessionUser();
  if (!requireClient(user)) redirect("/login");

  return (
    <div>
      <PageHeader
        title="Book a clean"
        description="Request a visit. Your cleaner will confirm the time."
      />
      <BookForm clientId={user.clientId!} />
    </div>
  );
}
