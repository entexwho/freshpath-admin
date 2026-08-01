import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
      <h2 className="font-display text-2xl text-slate-900">Page not found</h2>
      <p className="text-sm text-zinc-500">That page doesn’t exist.</p>
      <Link
        href="/login"
        className="inline-flex h-8 items-center rounded-lg bg-teal-700 px-3 text-sm font-medium text-white hover:bg-teal-800"
      >
        Back to login
      </Link>
    </div>
  );
}
