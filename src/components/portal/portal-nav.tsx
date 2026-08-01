"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { portalNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function PortalBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {portalNav.map((item) => {
          const active =
            item.href === "/portal"
              ? pathname === "/portal"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium",
                  active ? "text-teal-700" : "text-zinc-400"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full",
                    active ? "bg-teal-50" : ""
                  )}
                >
                  <Icon className="size-5" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-slate-200/80 md:bg-white/80">
      <div className="px-5 py-6">
        <p className="font-display text-lg tracking-tight text-slate-900">
          FreshPath
        </p>
        <p className="mt-1 text-xs text-zinc-500">Client portal</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 pb-6">
        {portalNav.map((item) => {
          const active =
            item.href === "/portal"
              ? pathname === "/portal"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                active
                  ? "bg-teal-50 text-teal-800"
                  : "text-zinc-600 hover:bg-slate-100"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
