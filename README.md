# CRM deployment

This repository contains two applications that should be imported into Vercel as two projects.

## 1. Deploy the API

Import this Git repository and set the Vercel project's **Root Directory** to `crm-backend`.

Add the variables listed in `crm-backend/.env.example` under **Project Settings > Environment Variables**. A persistent MySQL-compatible database is required in production; the local SQLite fallback is intentionally rejected on Vercel because serverless files are ephemeral.

After deployment, verify:

```text
https://<api-project>.vercel.app/api/health
```

## 2. Deploy the frontend

Import the same Git repository a second time and set its **Root Directory** to `crm-frontend`. Vercel detects Vite and runs `npm run build` automatically.

Set this environment variable for Production, Preview, and Development:

```text
VITE_API_BASE_URL=https://<api-project>.vercel.app/api
```

Deploy the frontend, then update the API project's `CORS_ORIGIN` to the frontend URL. Multiple allowed origins can be separated with commas.

## Local development

Copy each `.env.example` to `.env`, install dependencies in both application directories, and run:

```powershell
cd crm-backend
npm install
npm run dev

cd ..\crm-frontend
npm install
npm run dev
```

Local `.env` files are ignored and must never be committed.
