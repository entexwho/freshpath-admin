# FreshPath

House cleaning business app — admin CRM/scheduling plus a client portal.

## Stack

- Next.js 14 (App Router)
- React + Tailwind CSS + Shadcn UI
- Supabase (PostgreSQL, Auth, RLS)
- Lucide React

## Quick start (demo mode)

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and choose **Admin** or **Client** on the login screen. Demo mode uses a local JSON store (no Supabase required).

### iPhone on your Wi‑Fi

```bash
npm run dev -- -H 0.0.0.0 -p 3000
```

Then open `http://YOUR_PC_IP:3000` on the phone (allow port 3000 in Windows Firewall first).

## Connect Supabase

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor.
3. Create Auth users; promote yourself with:

```sql
update public.profiles set role = 'admin' where id = '<your-user-uuid>';
```

4. Link a client login:

```sql
update public.profiles
set client_id = '<client-uuid>', role = 'client'
where id = '<auth-user-uuid>';
```

5. Copy URL + anon key into `.env.local` from `.env.example`.

## Routes

| Area | Route | Purpose |
| --- | --- | --- |
| Auth | `/login` | Demo role picker or Supabase email login |
| Admin | `/dashboard` | Today’s jobs + workflow actions |
| Admin | `/calendar` | Week/month schedule |
| Admin | `/clients` | CRM |
| Admin | `/invoices` | Create invoices, mark paid, totals |
| Portal | `/portal` | Client home |
| Portal | `/portal/book` | Request a clean |
| Portal | `/portal/upcoming` | Upcoming visits |
| Portal | `/portal/invoices` | Client invoice list |
