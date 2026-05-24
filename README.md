# MyTools (SafeConnect Rwanda)

A neutral, privacy-first Progressive Web App that connects users in Rwanda to vetted health, legal, safe-space, housing, and emergency resources. Built for MRI by Brian Mugunga.

Platform: Next.js 14 App Router + TypeScript + Tailwind + Prisma + PostgreSQL.

## Sprint 1 (foundation) — shipped

- Neutral branding ("MyTools"), PWA shell with A2HS prompt and Serwist service worker.
- Quick Exit button, Auto Blur overlay, offline Emergency Card.
- Admin panel (NextAuth credentials): dashboard, directory CRUD with map-pin placement and Last-Verified tracking, article CRUD with Tiptap rich text, referral-code management.
- `next-intl` with EN fully populated; RW/FR keys stubbed for MRI to translate.
- GitHub Actions CI running lint, typecheck, Prisma validate, and build.

## Sprint 2+ (in progress or planned)

- Public directory: map, search, trust ratings, report-a-problem, service-gap logging.
- Information Hub article feed; Umami hook (requires env + self-hosted instance).
- Still planned: user accounts, Tourism Mode, unified reports dashboard, Privacy/Trust page, low-data mode, panic purge, full Kinyarwanda/French UI.

## Requirements

- Node.js 20+
- PostgreSQL 14+ (local Docker or a Supabase project)

## Local development

```bash
npm install
cp .env.example .env
# Edit .env and set DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, CONTACT_ENCRYPTION_KEY.

# Generate the Prisma client and create the schema in your DB.
npx prisma migrate dev --name init

# Seed the first admin user.
npm run seed

npm run dev
```

Open http://localhost:3000 for the community-facing app and http://localhost:3000/admin/login for the admin panel. Default seed credentials: `admin@mytools.rw` / `ChangeMeNow!2026` — change immediately after first login.

## Useful scripts

- `npm run dev` — Next.js dev server (service worker disabled).
- `npm run build` — Production build (generates the Serwist service worker).
- `npm run start` — Serve the production build locally.
- `npm run lint` — `next lint`.
- `npm run typecheck` — `tsc --noEmit`.
- `npm run prisma:migrate` — Create/apply migrations against the configured DB.
- `npm run prisma:deploy` — Apply migrations in CI / production.
- `npm run seed` — Upsert the initial admin user.

## Database choice — Supabase (Postgres, Frankfurt)

We use **Supabase Postgres in the EU (Frankfurt)** region:

- PRD §8 alignment, EU jurisdiction (PRD §7.2), TLS 1.3 + AES-256 at rest.
- Built-in auth, Storage, and **Supabase Vault** for the Sprint 3 contact-info encryption key.
- Studio admin UI lets MRI inspect data and run the Emergency Data Destruction SQL without shell access.

### Setting up staging

1. Create a Supabase project in the Frankfurt region.
2. Copy the `DATABASE_URL` from Project Settings → Database → Connection string → URI.
3. Store it in Vercel as an env var along with `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `CONTACT_ENCRYPTION_KEY`.
4. Run `npx prisma migrate deploy` during the Vercel build (already wired via `npm run build`).
5. Run `npm run seed` once to create the first admin user.

### Handover path to self-hosted (Hetzner or similar)

Because everything goes through Prisma, migrating off Supabase is a contained task:

```bash
# On the old host
pg_dump --no-owner --no-acl --clean --format=custom \
  "$SUPABASE_DATABASE_URL" > mytools.dump

# On the new host
createdb mytools
pg_restore --no-owner --no-acl --dbname=mytools mytools.dump
```

Then:

1. Swap `DATABASE_URL` on Vercel (or self-hosted runtime) to the new host.
2. Move `CONTACT_ENCRYPTION_KEY` from Supabase Vault to the new secrets manager (Hashicorp Vault, AWS Secrets Manager, etc.).
3. Decommission the Supabase project.

No application code changes are required.

## PWA icon

`public/icons/icon.svg` is a neutral placeholder. Brian will replace it with the finalised MyTools logo before launch (PRD §5.4). Manifest references the SVG with `purpose: any` and `purpose: maskable` so it can install on Android without additional work.

## Security notes

- Admin routes are gated server-side by `middleware.ts` via NextAuth.
- `/admin/*` sends `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`.
- `lib/crypto.ts` is the prepared AES-256-GCM helper for user contact-info encryption (activated in Sprint 3 per PRD §5.5.3).
- Secrets live in `.env` locally and in the hosting secrets manager in staging/production. `.env` is in `.gitignore`.

## Directory structure

```
app/
  (public)/        Community-facing routes. QuickExit button rendered here.
  admin/           Admin panel (login + dashboard + CRUD).
  api/             Route handlers (NextAuth + admin CRUD).
  layout.tsx       Root: next-intl provider, Auto Blur, service worker bootstrap.
  sw.ts            Serwist service worker source (generates public/sw.js at build).
components/
  admin/           Admin-only client components (forms, map picker, editor).
  ...              Shared public components.
lib/
  prisma.ts        Prisma client singleton.
  auth.ts          NextAuth options.
  requireAdmin.ts  Session guard helper for API routes.
  crypto.ts        AES-256-GCM scaffold (Sprint 3).
messages/
  en.json, rw.json, fr.json   i18n dictionaries.
prisma/
  schema.prisma    Data model.
  seed.ts          Initial admin upsert.
```
