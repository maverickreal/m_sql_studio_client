# MSqlStudio Client

Web UI for the online SQL learning platform. Built with React 19, React Router 7, Redux Toolkit, and Vite.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| React Router 7 | Routing (lazy-loaded routes) |
| Redux Toolkit + RTK Query | State management & data fetching |
| Vite 6 | Build tool & dev server |
| Tailwind CSS 4 | Styling (via `@tailwindcss/vite`) |
| CodeMirror 6 | SQL editor with syntax highlighting |
| Better-Auth | Authentication client |
| Motion | Animations |
| Biome 2.5 | Linting + formatting |
| Vitest + Playwright | Unit + E2E testing |

## Prerequisites

- Bun
- Running API Gateway (or use the parent [m_sql_studio](../m_sql_studio) Docker Compose setup)

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in all values. Variables must be prefixed with `VITE_` for Vite exposure.

### 3. Run in Development

```bash
bun run dev
```

Starts Vite dev server on port 3000 (configurable via `PORT` env). Proxies `/api` → `VITE_API_BASE_URL` (default `http://localhost:8000`).

### 4. Build for Production

```bash
bun run build
```

Outputs to `dist/`. Runs `tsc -b` type-check first, then `vite build`.

### 5. Preview Production Build

```bash
bun run preview
```

### Docker

**Production:**
```bash
docker build -t m-sql-studio-client .
docker run -p 3000:80 m-sql-studio-client
```
Multi-stage `bun` build → `nginx:alpine` serve. Nginx proxies `/api/` to `http://api-gateway:8000`. `NGINX_SERVER_NAME` ARG substituted at runtime via `envsubst`.

**Development:**
```bash
docker build -f Dockerfile.dev -t m-sql-studio-client-dev .
docker run -p 3000:3000 -v $(pwd):/app m-sql-studio-client-dev
```
Runs `bun run dev -- --host` for Vite HMR. Uses bind mounts + `CHOKIDAR_USEPOLLING=1` for file watching on macOS.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Vite dev server (port 3000) |
| `bun run build` | Type-check + production build |
| `bun run preview` | Preview production build locally |
| `bun run test` | Unit tests (Vitest, jsdom) |
| `bun run test:e2e` | E2E tests (Playwright) |
| `bun run health:check` | Biome lint check |
| `bun run health:fix` | Biome auto-fix (includes unsafe fixes) |

## Project Structure

```
src/
├── main.tsx                    # Entry: Provider + ThemeProvider + RouterProvider
├── app/
│   └── router.tsx              # Lazy-loaded routes via react-router `lazy`
├── store/
│   ├── index.ts                # Redux store config
│   ├── authSlice.ts            # Auth state (user, session)
│   ├── executionSlice.ts       # SQL execution state
│   └── hooks.ts                # Typed useDispatch/useSelector
├── services/
│   ├── api.ts                  # RTK Query base (VITE_API_BASE_URL, credentials: include)
│   └── authClient.ts           # Better-auth client (hardcoded http://127.0.0.1:8000/api/auth)
├── features/
│   ├── assignments/            # Assignment list/detail pages
│   ├── sql-editor/             # CodeMirror SQL editor + last-SQL restore
│   ├── auth/                   # Sign-in/up, profile pages
│   └── leaderboard/            # Leaderboard page
├── components/
│   ├── ui/                     # Button, Input, Textarea, Badge, Table
│   └── layout/                 # Navbar, RootLayout
├── hooks/
│   ├── useAuth.ts              # Auth sync with Redux
│   └── useJobStatusStream.ts   # EventSource-first job polling with RTK fallback
├── types/
│   └── index.ts                # Assignment, JobStatus, SqlExecutionResult, etc.
└── theme/                      # Dracula (dark) / Alucard (light) CSS variables
```

## Architecture Highlights

### Routing
Routes are **lazily loaded** via react-router `lazy` in `src/app/router.tsx` for code splitting.

### State Management
- **Redux store** (`src/store/index.ts`): `auth` slice, `execution` slice, `api` (RTK Query)
- **RTK Query** base URL from `import.meta.env.VITE_API_BASE_URL`; credentials `"include"` for cookie-based auth

### SQL Execution Flow
**EventSource-first** with polling fallback:
1. `POST /api/v1/assignments/client-sql-code-run/execute` → returns `taskId`
2. `useJobStatusStream` opens `EventSource` on `/status/:taskId/stream` (`withCredentials: true`) for `job-status` completed/failed events
3. On `onerror` (or no EventSource support), falls back to RTK `useGetJobStatusQuery` polling every 1s
4. `jobStatus` endpoint uses `keepUnusedDataFor: 0`

### Last-SQL Restore
`AssignmentDetailPage` passes `initialSql={lastSql?.userSql ?? null}` into `SqlEditor`, resolved via `initialDoc()` helper (`src/features/sql-editor/initialDoc.ts`).

### Authentication
- **Better-Auth** client in `src/services/authClient.ts`
- `useAuth` hook (`src/hooks/useAuth.ts`) dispatches `setUser`/`clearSession`
- Called in `RootLayout` and `AssignmentDetailPage` for session hydration

### UI Primitives
`src/components/ui/` — `Button` (accepts `loading` prop with spinner), `Input`, `Textarea`, `Badge`, `Table`

### Theming
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin
- Uses `@import "tailwindcss"` (no PostCSS config, no `@tailwind` directives)
- `@theme` in `src/index.css` maps `brand-*` / `surface-*` / functional colors to Dracula (dark, default) and Alucard (light) CSS variables
- Toggle lives in the navbar (`src/theme/`)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API Gateway base URL | `http://localhost:8000` |
| `PORT` | Dev server port | `3000` |

## Conventions

- **Imports**: Relative paths (no `@/` alias used in current code)
- **Redux hooks**: From `react-redux` directly (typed dispatch via `useDispatch<AppDispatch>()`; `store/hooks.ts` only re-exports types)
- **Formatting/linting**: Run `bun run health:check` before committing
- **Tailwind**: Utility classes with `clsx`/`cn` pattern allowed (configured in biome `useSortedClasses` nursery rule)
- **TypeScript**: Strict mode with `noUnusedLocals` and `noUnusedParameters`. Path alias `@/*` → `./src/*`

## Related Repositories

- [m_sql_studio](../m_sql_studio) — Orchestrator with Docker Compose
- [m_sql_studio_api_gateway](../m_sql_studio_api_gateway) — REST API (Express.js 5)
- [m_sql_studio_sandbox](../m_sql_studio_sandbox) — BullMQ worker for SQL execution
- [m_sql_studio_problems](../m_sql_studio_problems) — Canonical problem bank