# FreshPath Admin (Phase 1)

Internal admin dashboard for a house cleaning business — CRM + scheduling only. No client portal yet.

## Stack

- Next.js 14 (App Router)
- React + Tailwind CSS
- Shadcn UI
- Supabase (PostgreSQL + Auth-ready RLS)
- Lucide React

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase env vars, the app runs in **demo mode** using a local JSON store seeded with sample clients and today’s jobs.

### Connect Supabase

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
4. Sign in as your admin user (RLS allows all authenticated users in Phase 1).

## Routes

| Route | Purpose |
| --- | --- |
| `/dashboard` | Today’s jobs with quick “Mark as Completed” |
| `/calendar` | Week / month list of upcoming jobs |
| `/clients` | Searchable CRM list + add client |
| `/clients/[id]` | Client detail with Tap-to-Reveal access notes |
| `/settings` | Workspace / data-source status |

## Mobile-first admin shell

- Mobile: fixed bottom navigation (Dashboard, Calendar, Clients, Settings)
- Desktop: left sidebar
- Soft slate / teal / zinc palette for on-the-go use
