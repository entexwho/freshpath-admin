"use server";

import { revalidatePath } from "next/cache";
import {
  createInvoiceRecord,
  updateInvoiceStatus,
} from "@/lib/data/invoices";
import type { InvoiceStatus, NewInvoiceInput } from "@/lib/types";

function revalidateInvoicePaths() {
  revalidatePath("/invoices");
  revalidatePath("/portal/invoices");
  revalidatePath("/dashboard");
}

export async function createInvoiceAction(input: NewInvoiceInput) {
  if (!input.client_id) return { error: "Please select a client." };
  if (!input.amount || input.amount <= 0) {
    return { error: "Amount must be greater than zero." };
  }

  try {
    const invoice = await createInvoiceRecord(input);
    revalidateInvoicePaths();
    return { data: invoice };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create invoice.",
    };
  }
}

export async function updateInvoiceStatusAction(
  invoiceId: string,
  status: InvoiceStatus
) {
  try {
    const invoice = await updateInvoiceStatus(invoiceId, status);
    if (!invoice) return { error: "Invoice not found." };
    revalidateInvoicePaths();
    return { data: invoice };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update invoice.",
    };
  }
}

export async function markInvoicePaidAction(invoiceId: string) {
  return updateInvoiceStatusAction(invoiceId, "paid");
}
