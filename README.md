# Eldovia Group — Frontend

Next.js 15 multi-app monorepo for the Eldovia Group web properties — an agribusiness investment platform.

## Architecture

```
eldovia-frontend/
├── apps/
│   ├── web-admin/         # Admin panel (admins & managers)  (port 3103)
│   ├── web-main/          # Main corporate site              (port 3100)
│   ├── web-automobile/    # Automobile portal                (port 3101)
│   └── web-agribusiness/  # Agribusiness investor portal     (port 3102)
└── packages/
    ├── ui/                # Shared component library
    └── config/            # Shared Tailwind / TS config
```

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Lucide React

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

## Getting Started

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode
pnpm dev

# Or start a single app
pnpm dev:admin  # web-admin        → http://localhost:3103
pnpm dev:main   # web-main         → http://localhost:3100
pnpm dev:auto   # web-automobile   → http://localhost:3101
pnpm dev:agri   # web-agribusiness → http://localhost:3102
```

## Common Commands

```bash
pnpm dev      # Start all apps in watch mode
pnpm build    # Build all apps
pnpm lint     # Lint all packages
pnpm clean    # Remove .next build artifacts and node_modules
```

## App URLs (dev)

| App | URL | Status |
|---|---|---|
| Admin panel | http://localhost:3103 | Active |
| Agribusiness portal | http://localhost:3102 | Active |
| Main site | http://localhost:3100 | Planned |
| Automobile portal | http://localhost:3101 | Planned |

## Admin Panel (`web-admin`)

Restricted to users with roles: `super_admin`, `group_admin`, `branch_admin`, or `manager`. Unauthorized users are blocked at login and redirected to `/unauthorized`.

### Features

- **Dashboard** — Platform-wide KPIs (projects, users, partners, news)
- **Projects** — Full CRUD; publish, archive, restore, and permanently delete projects; engagement stats (followers, likes, interests); filterable by status and deleted state
- **Project Detail** — Edit project info; manage lifecycle phases (sequential, confirm-before-apply); manage funding status; review, approve, and reject investments; add investors directly
- **Users** — Browse users, manage roles and account status
- **Investments** — Platform-wide investment review queue; amounts shown in native currency with live USD equivalent
- **Analytics** — Business performance metrics (projects, investments, funnel)

### Currency handling

All monetary amounts display in the currency the project or investment was created in. A live USD equivalent is shown for non-USD amounts using exchange rates fetched from `api.exchangerate-api.com` (free, no API key, rates cached for 1 hour). The aggregate "Total Raised" on the investments page converts all project totals to USD before summing.

### Environment

Set in `apps/web-admin/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost/api/v1
```

## Agribusiness Investor Portal (`web-agribusiness`)

Public-facing portal for investors. Authentication uses Firebase. API calls go directly to the backend at `http://localhost:3000` (configurable in `src/lib/api.ts`).

### Pages

- **Home** — Hero, featured projects, impact stats, CTA
- **Projects** — Browse and filter all open agribusiness projects; follow projects
- **Project Detail** — Full project info, lifecycle stage bar, funding card, photo gallery, reports, forum
- **Invest** — Submit an investment expression of interest for a project
- **Dashboard** — Investor's personal investment history; total invested (converted to USD via live rates); individual amounts shown in the currency invested
- **Profile / Account** — Manage personal details
- **News** — Platform news articles
- **Partners, Impact, About, Contact** — Public informational pages

### Environment

Create `apps/web-agribusiness/.env.local` if you need to override any Firebase or API config. The API base URL is currently hardcoded in `src/lib/api.ts`.
