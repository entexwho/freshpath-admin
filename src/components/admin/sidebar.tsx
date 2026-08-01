"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { adminNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-slate-200/80 md:bg-white/80 md:backdrop-blur-sm">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-700/20">
          <Sparkles className="size-4" />
        </div>
        <div>
          <p className="font-display text-lg leading-none tracking-tight text-slate-900">
            FreshPath
          </p>
          <p className="mt-1 text-xs text-zinc-500">Admin workspace</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 pb-6">
        {adminNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-teal-50 text-teal-800"
                  : "text-zinc-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  active ? "text-teal-700" : "text-zinc-400"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
