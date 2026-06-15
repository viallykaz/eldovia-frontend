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
| Main site | http://localhost:3100 | Planned |
| Automobile portal | http://localhost:3101 | Planned |
| Agribusiness portal | http://localhost:3102 | Planned |

## Admin Panel (`web-admin`)

The admin panel is restricted to users with roles: `super_admin`, `group_admin`, `branch_admin`, or `manager`. Unauthorized users are blocked at login and redirected to `/unauthorized`.

### Features

- **Dashboard** — Platform-wide KPIs and charts (investors, projects, revenue)
- **Projects** — Full CRUD; publish, archive, restore, and permanently delete projects; engagement stats (followers, likes, interests); filterable by status and deleted state
- **Project Detail** — Edit project info, manage lifecycle phases with confirmation step, manage funding status, review and approve/reject investments, add investors directly
- **Users** — Browse and manage platform users
- **Investments** — Platform-wide investment review queue
- **Analytics** — Business performance metrics

### Environment

The admin panel reads `NEXT_PUBLIC_API_URL` to locate the backend API gateway. Set it in `apps/web-admin/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost/api/v1
```
