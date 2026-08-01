"use server";

import { revalidatePath } from "next/cache";
import { createClientRecord } from "@/lib/data/clients";
import type { NewClientInput } from "@/lib/types";

export async function createClientAction(input: NewClientInput) {
  if (!input.full_name?.trim()) {
    return { error: "Full name is required." };
  }

  try {
    const client = await createClientRecord({
      ...input,
      full_name: input.full_name.trim(),
    });
    revalidatePath("/clients");
    revalidatePath("/dashboard");
    revalidatePath("/calendar");
    return { data: client };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create client.",
    };
  }
}
