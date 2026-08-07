# Nexora CRM

Nexora CRM is a full-stack customer relationship management application for organizing leads, follow-ups, sales pipelines, teams, and workspace settings. It combines a React single-page application with an Express API and a Sequelize-backed relational database.

## Features

- Email-based signup, login, verification, password recovery, and JWT authentication
- Protected application routes and persistent user sessions
- Lead creation, editing, deletion, notes, grouping, filtering, and Excel export
- Lead discovery and suggestions powered by the Google Places API
- Visual sales pipeline and lead temperature tracking
- Follow-up task creation, assignment, priority, reminders, and completion status
- Workspace profile and team member views
- Dashboard summaries, reports, advanced search, and responsive navigation
- Light and dark themes
- Vercel-ready frontend and serverless API configuration

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Tailwind CSS 4, Axios, Framer Motion |
| Backend | Node.js, Express 4, Sequelize 6, JWT, bcryptjs, Nodemailer |
| Database | SQLite for local development; MySQL-compatible database for production |
| Integrations | Google Places API, SMTP email, ExcelJS |
| Deployment | Two Vercel projects from one Git repository |

## Repository layout

```text
CRM/
├── crm-frontend/          React and Vite single-page application
│   ├── public/            Static assets
│   ├── src/
│   │   ├── components/    Reusable UI and layout components
│   │   ├── context/       Authentication, notifications, and theme state
│   │   ├── pages/         Application screens
│   │   └── services/      Axios API clients
│   └── vercel.json        Vite preset and SPA fallback rewrite
├── crm-backend/           Express and Sequelize API
│   ├── api/index.js       Vercel serverless entry point
│   ├── config/            Database configuration
│   ├── controllers/       Request handlers and business logic
│   ├── middleware/        Authentication and error handling
│   ├── models/            User, Workspace, Lead, and Task models
│   ├── routes/            REST API route definitions
│   ├── utils/             Email, token, and Google Places helpers
│   ├── app.js             Express app and route registration
│   └── server.js          Local development server
└── README.md
```

## Prerequisites

- Node.js 20 or newer
- npm
- MySQL 8 or another MySQL-compatible hosted database for production
- Optional SMTP credentials for verification and password recovery emails
- Optional Google Maps API key with Places API access for lead discovery

## Local development

### 1. Clone and install

```powershell
git clone https://github.com/crimznexus/CRM.git
cd CRM

cd crm-backend
npm install

cd ..\crm-frontend
npm install
```

### 2. Configure the backend

Copy the example file:

```powershell
cd crm-backend
Copy-Item .env.example .env
```

For the simplest local setup, set `DB_DIALECT=sqlite` and leave the MySQL variables empty. The database will be stored at `crm-backend/data/crm.sqlite`.

Backend variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | Recommended | Runtime environment, normally `development` or `production` |
| `CORS_ORIGIN` | Production | Allowed frontend origin; comma-separate multiple origins |
| `DB_DIALECT` | Yes | `sqlite` locally or `mysql` in production |
| `DB_HOST` | MySQL | Database hostname |
| `DB_PORT` | MySQL | Database port, usually `3306` |
| `DB_USER` | MySQL | Database username |
| `DB_PASSWORD` | MySQL | Database password |
| `DB_NAME` | MySQL | Database name |
| `JWT_SECRET` | Yes | Long random secret used to sign authentication tokens |
| `JWT_EXPIRES_IN` | No | Standard token lifetime; defaults to `7d` |
| `JWT_EXPIRES_IN_REMEMBER_ME` | No | Remember-me token lifetime; defaults to `30d` |
| `SMTP_HOST` | Email | SMTP server hostname |
| `SMTP_PORT` | Email | SMTP port, commonly `587` |
| `SMTP_USER` | Email | SMTP username |
| `SMTP_PASSWORD` | Email | SMTP password |
| `EMAIL_FROM` | Email | Sender name and address |
| `GOOGLE_MAPS_API_KEY` | Discovery | Google Places API key |

### 3. Configure the frontend

```powershell
cd ..\crm-frontend
Copy-Item .env.example .env
```

For local development, set:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```

Only variables prefixed with `VITE_` are exposed to frontend code. Never place database passwords, JWT secrets, or private API credentials in the frontend environment file.

### 4. Start both applications

Open two terminals.

Backend:

```powershell
cd crm-backend
npm run dev
```

Frontend:

```powershell
cd crm-frontend
npm run dev
```

Open `http://localhost:5173`. The API health endpoint is available at `http://localhost:5000/api/health`.

## Available scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint checks |

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start Express with Nodemon |
| `npm start` | Start Express with Node.js |

## API overview

All application endpoints use the `/api` prefix.

| Area | Endpoints |
| --- | --- |
| Health | `GET /api/health` |
| Authentication | `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/verify-email`, `POST /api/auth/forgot-password` |
| Profile | `GET /api/auth/me`, `PUT /api/auth/me` |
| Leads | `GET /api/leads`, `POST /api/leads`, `GET /api/leads/:id`, `PUT /api/leads/:id`, `DELETE /api/leads/:id` |
| Lead notes and data | `POST /api/leads/:id/notes`, `POST /api/leads/import-lead`, `GET /api/leads/export` |
| Lead discovery | `GET /api/lead-discovery/search`, `GET /api/lead-discovery/suggest` |
| Tasks | `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` |
| Workspace | `GET /api/workspace`, `PUT /api/workspace`, `GET /api/workspace/members` |

Except for signup, login, email verification, password recovery, and health checks, API requests require a bearer token:

```http
Authorization: Bearer <jwt-token>
```

## Deploying to Vercel

The frontend and backend are independent applications and should be imported from this repository as two Vercel projects.

### 1. Deploy the backend

1. In Vercel, select **Add New > Project** and import this repository.
2. Set **Root Directory** to `crm-backend`.
3. Add the variables from `crm-backend/.env.example` in **Settings > Environment Variables**.
4. Use a persistent MySQL-compatible database and set `DB_DIALECT=mysql`. SQLite is intentionally rejected on Vercel because serverless files are ephemeral.
5. Deploy and verify `https://<api-project>.vercel.app/api/health` returns `{ "status": "ok" }`.

The serverless handler initializes the database connection once per warm function instance and returns HTTP 503 when the database is unavailable.

### 2. Deploy the frontend

1. Import the same repository as another Vercel project.
2. Set **Root Directory** to `crm-frontend`.
3. Keep the detected Vite build command (`npm run build`) and output directory (`dist`).
4. Add this environment variable to Production, Preview, and Development:

```dotenv
VITE_API_BASE_URL=https://<api-project>.vercel.app/api
```

5. Deploy the frontend.
6. Return to the backend project and set `CORS_ORIGIN` to the deployed frontend URL. Multiple production and preview origins can be comma-separated.
7. Redeploy the backend after changing its environment variables.

The frontend `vercel.json` rewrites application URLs to `index.html`, allowing routes such as `/dashboard` and `/leads/:id` to work when opened directly.

## Production checklist

- Generate a unique, high-entropy `JWT_SECRET`.
- Use a managed MySQL database with encrypted connections and regular backups.
- Restrict `CORS_ORIGIN` to trusted frontend domains.
- Configure SMTP before enabling user-facing email flows.
- Restrict the Google Maps API key by API and allowed usage where possible.
- Never commit `.env` files or Vercel project metadata.
- Rotate any credential that was previously committed to Git history.
- Run `npm run build`, `npm run lint`, and `npm audit` before releases.

## Troubleshooting

### API returns HTTP 503

Confirm all `DB_*` variables are present in the backend Vercel project, the database accepts connections from Vercel, and `DB_DIALECT` is set to `mysql`.

### Browser reports a CORS error

Set `CORS_ORIGIN` on the backend to the exact frontend origin, including `https://` and without a trailing path, then redeploy the backend.

### Frontend calls localhost after deployment

Add `VITE_API_BASE_URL` to the frontend Vercel project and redeploy. Vite embeds environment variables during the build.

### Email or lead discovery is unavailable

Email requires valid `SMTP_*` variables. Lead discovery requires `GOOGLE_MAPS_API_KEY`. Core lead and task management can still run without these optional integrations.

## Security

Do not report security vulnerabilities in a public issue. Contact the repository owner privately with reproduction details and affected versions.

## License

No license file is currently included. All rights remain with the respective repository owners and contributors unless a license is added later.
