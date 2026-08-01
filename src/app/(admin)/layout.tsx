import { BottomNav } from "@/components/admin/bottom-nav";
import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,_#ecfdf5_0%,_#f8fafc_42%,_#f4f4f5_100%)] text-slate-900">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl md:px-0">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/70 bg-white/70 px-4 py-3 backdrop-blur-md md:hidden">
            <div>
              <p className="font-display text-lg tracking-tight text-slate-900">
                FreshPath
              </p>
              <p className="text-xs text-zinc-500">On-the-go admin</p>
            </div>
          </header>
          <main className="flex-1 px-4 py-5 pb-28 md:px-8 md:py-8 md:pb-8">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
