import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import type { Client, NewClientInput } from "@/lib/types";
import {
  demoCreateClient,
  demoGetClient,
  demoListClients,
} from "@/lib/data/demo-store";

export async function listClients(): Promise<Client[]> {
  if (!isSupabaseConfigured()) {
    return demoListClients();
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Client[];
}

export async function getClient(id: string): Promise<Client | null> {
  if (!isSupabaseConfigured()) {
    return demoGetClient(id);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Client | null;
}

export async function createClientRecord(
  input: NewClientInput
): Promise<Client> {
  if (!isSupabaseConfigured()) {
    return demoCreateClient(input);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert({
      full_name: input.full_name,
      phone: input.phone || null,
      email: input.email || null,
      address: input.address || null,
      access_notes: input.access_notes || null,
      private_notes: input.private_notes || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Client;
}
