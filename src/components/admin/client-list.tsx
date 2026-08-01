"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Client } from "@/lib/types";

export function ClientList({ clients }: { clients: Client[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((client) => {
      const haystack = [
        client.full_name,
        client.phone,
        client.email,
        client.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [clients, query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clients…"
          className="h-10 bg-white/90 pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-10 text-center text-sm text-zinc-500">
          No clients match your search.
        </div>
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 divide-y divide-slate-100">
          {filtered.map((client) => (
            <li key={client.id}>
              <Link
                href={`/clients/${client.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-teal-50/50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {client.full_name}
                  </p>
                  <p className="truncate text-sm text-zinc-500">
                    {client.address || client.phone || client.email || "No details yet"}
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-zinc-300" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
