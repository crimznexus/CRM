# Nexora CRM

Nexora CRM is a multi-tenant customer relationship management application for leads, sales pipelines, follow-ups, workspace settings, and Google Maps lead discovery. The deployed application uses a React/Vite frontend and an authenticated Convex backend.

## Features

- Email/password authentication powered by Better Auth
- Isolated workspaces: users can only access records belonging to their workspace
- Lead creation, editing, deletion, notes, filtering, grouping, and CSV export
- Sales pipeline and lead status tracking
- Follow-up tasks with assignees, due dates, priority, reminders, and completion status
- Workspace, CRM, notification, and appearance preferences
- Google Places lead discovery with demo fallback data when no API key is configured
- Responsive interface with light and dark themes
- Vercel build configuration that deploys Convex before building the Vite application

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Tailwind CSS 4, Framer Motion |
| Backend | Convex queries, mutations, actions, and HTTP actions |
| Authentication | Better Auth with the Convex Better Auth component |
| Database | Convex document database with indexed, workspace-scoped tables |
| Integration | Google Places API (New) |
| Deployment | Vercel for the SPA; Convex Cloud for backend and data |

## Repository structure

```text
CRM/
├── apps/
│   ├── web/                  React/Vite application
│   │   ├── public/           Static files
│   │   └── src/
│   │       ├── components/   Reusable UI
│   │       ├── context/      Theme and notification state
│   │       ├── layout/       Application shells
│   │       ├── lib/          Convex and Better Auth clients
│   │       ├── pages/        Route-level screens
│   │       ├── routes/       Authenticated routing
│   │       └── services/     UI-compatible Convex service layer
│   └── api/                  Legacy Express source retained for migration reference
├── convex/
│   ├── auth.ts               Better Auth server configuration
│   ├── schema.ts             Database schema and indexes
│   ├── profiles.ts           User profile lifecycle
│   ├── workspaces.ts         Workspace settings and membership
│   ├── leads.ts              Lead operations
│   ├── tasks.ts              Follow-up operations
│   └── leadDiscovery.ts      Google Places server action
├── package.json              Root scripts and npm workspace configuration
└── vercel.json               Vercel build and SPA routing configuration
```

`apps/api` is not an npm workspace and is not deployed. It is retained only as a migration reference and to avoid destroying the existing ignored SQLite file. New backend development belongs in `convex/`.

## Local development

### Requirements

- Node.js 22
- npm
- A Convex account and development deployment

### Install and configure

```powershell
git clone https://github.com/crimznexus/CRM.git
cd CRM
npm install
npx convex dev
```

Convex creates the root `.env.local`. Because the Vite app is nested, copy the public deployment URL into `apps/web/.env.local`:

```dotenv
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

Configure the backend environment in the Convex dashboard or CLI:

```powershell
npx convex env set SITE_URL http://localhost:5173
npx convex env set BETTER_AUTH_SECRET <a-long-random-secret>
npx convex env set GOOGLE_MAPS_API_KEY <optional-google-key>
```

Never commit deployment keys, Better Auth secrets, or Google API keys.

### Run

Open two terminals:

```powershell
npm run dev:convex
```

```powershell
npm run dev:web
```

The frontend is available at `http://localhost:5173`.

## Database model

- `workspaces`: company and CRM configuration
- `profiles`: authenticated-user metadata and workspace membership
- `leads`: workspace-scoped prospects and discovery metadata
- `tasks`: workspace-scoped follow-ups linked to leads and profile assignees
- Better Auth component tables: users, credentials, sessions, and verification data

Every public CRM query and mutation authenticates the caller and scopes database access using indexed workspace fields.

## Vercel deployment

Import the repository in Vercel and leave the project root at the repository root. The committed `vercel.json` selects the Vite framework, installs optional Linux native packages, runs Convex deployment, builds `apps/web`, and configures SPA fallback routing.

Add this Vercel environment variable:

| Variable | Scope | Value |
| --- | --- | --- |
| `CONVEX_DEPLOY_KEY` | Production | A **production** deploy key generated for the production Convex deployment |

The build command injects `VITE_CONVEX_URL` automatically, so it should not normally be added manually. A development deploy key may be used only for Vercel Development/Preview environments; do not use it for Production.

In the corresponding production Convex deployment, configure:

| Variable | Value |
| --- | --- |
| `SITE_URL` | Final Vercel production URL, such as `https://crm.example.com` |
| `BETTER_AUTH_SECRET` | A unique random secret of at least 32 characters |
| `GOOGLE_MAPS_API_KEY` | Optional server-side Google Places API key |

After the first Vercel deployment gives you a stable URL, set `SITE_URL` and redeploy so Better Auth trusts the correct browser origin.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev:web` | Start Vite locally |
| `npm run dev:convex` | Watch and deploy Convex functions |
| `npm run build` | Build the production frontend |
| `npm run typecheck` | Type-check all Convex functions |
| `npm run lint` | Lint the frontend |

## Legacy SQLite data

The local file `apps/api/data/crm.sqlite` is ignored by Git and is never included in Vercel or Convex deployments. It remains available for a controlled one-time migration. Because it can contain customer PII, no records are uploaded automatically.

## Security notes

- Convex deploy keys and backend secrets belong only in deployment environment settings.
- `VITE_` variables are public browser configuration and must never contain secrets.
- Rotate any credential that has been pasted into an untrusted location.
- Use separate Convex development and production deployments and keys.
