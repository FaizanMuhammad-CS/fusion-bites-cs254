# Fusion Bites — Web Application (CS254 companion)

**GitHub:** [FaizanMuhammad-CS/fusion-bites-cs254](https://github.com/FaizanMuhammad-CS/fusion-bites-cs254)

Restaurant ordering front end backed by MySQL (**ProjectDB**). Tech stack: **Next.js App Router**, **React**, **TypeScript**, **Tailwind CSS**, **`mysql2/promise`** (server-side route handlers).

## AI tools disclosure (submission)

Frontend and sample SQL assistance may be produced with Cursor / GPT-class models — state the exact tools you used in your written report, per course instructions.

---

## Fusion Bites — Database connection explanation (paste into submission PDF — ~175 words)

Fusion Bites is structured as a **three-tier architecture**: React pages in the browser, **Next.js App Router Route Handlers** under `webapp/app/api/*/route.ts`, and MySQL (**ProjectDB**). The UI never connects to the database directly. Instead, the browser issues `fetch()` calls to same-origin API routes; each route handler opens a connection from a shared **`mysql2/promise` connection pool** (`src/lib/db.ts`) and runs **parameterised SQL** against tables such as `Users`, `MenuItems`, `Orders`, and `Payments`. JSON results are returned to the client for tables, forms, and dashboards. For multi-step actions (for example placing an order), a route handler can acquire a single connection, run **`START TRANSACTION` / `COMMIT` / `ROLLBACK`** in SQL so order header, line items, and payment rows stay consistent. Session security for this coursework uses a **simple role flag in `localStorage`** (customer vs admin) as required by the project brief — this is not production-grade authentication. Database credentials are supplied via **environment variables** (see `webapp/.env.example`); production and local dev both require **`MYSQLHOST`**, **`MYSQLPORT`**, **`MYSQLUSER`**, **`MYSQLPASSWORD`**, and **`MYSQLDATABASE`** (Railway’s names — no underscore after `MYSQL`). Together, this pattern satisfies the brief: a browser-based front end with a **server-side backend** persisting all authoritative data in **MySQL**.

---

## Local setup

1. **MySQL 8.x** — create and load the database from the repo root SQL (see `database/schema/` and `database/data/`), or import your final dump.
2. **Environment variables** — copy `webapp/.env.example` to `webapp/.env.local` and set **`MYSQLHOST`**, **`MYSQLPORT`**, **`MYSQLUSER`**, **`MYSQLPASSWORD`**, **`MYSQLDATABASE`** to your local MySQL (same variable names as Railway/Vercel). There is no implicit localhost fallback in code: if these are missing, the app throws at startup.
3. Install and run:

```bash
cd webapp
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Connection settings are read in `src/lib/db.ts` from `process.env` (see `.env.example`).

---

## Push to GitHub (submission)

1. Confirm **no secrets** are tracked: `webapp/.env.local` must **not** be committed (it is gitignored). Only `.env.example` belongs in the repo.
2. From the repo root, typical flow:

```bash
git status
git add .
git commit -m "Describe your submission update"
git remote add origin https://github.com/<your-username>/<your-repo>.git   # once
git push -u origin main
```

3. If you ever committed a real password before, **change the MySQL password** after removing it from git history (or treat that credential as burned).

---

## Deploy on Vercel with Railway MySQL

Vercel serverless functions cannot reach MySQL on your laptop. Use **Railway** (or similar) for a public MySQL instance, then point the Next.js app at it with env vars.

### 1) Create MySQL on Railway

1. [Railway](https://railway.app) → **New Project** → **Provision MySQL** (or add a MySQL plugin to an existing project).
2. Open the MySQL service → **Variables**. The app reads **only** these names (match them exactly in Vercel): **`MYSQLHOST`**, **`MYSQLPORT`**, **`MYSQLUSER`**, **`MYSQLPASSWORD`**, **`MYSQLDATABASE`**. Railway usually defines them already; if you renamed keys in Vercel, rename them back or duplicate the values under these names.
3. **Import your schema and data** (same as local): run `database/schema/FoodDeliverySystem.sql` then `database/data/data.sql` (or your dump) against that Railway database. The value of **`MYSQLDATABASE`** must be the schema you imported (often **`ProjectDB`**). If Railway created a default database named `railway`, either import into **`ProjectDB`** and set **`MYSQLDATABASE=ProjectDB`**, or import your tables into the DB name Railway uses and set **`MYSQLDATABASE`** to that name.

### 2) Configure Vercel

1. [Vercel](https://vercel.com) → **Add New Project** → import this GitHub repo.
2. **Root Directory:** `webapp` (the Next.js app is not at the repo root).
3. **Environment Variables** (Production — add Preview too if you want preview deploys to work):

| Variable | Notes |
|----------|--------|
| **`MYSQLHOST`** | Public TCP host (e.g. `*.proxy.rlwy.net`). |
| **`MYSQLPORT`** | Public TCP port (e.g. `57774`). |
| **`MYSQLUSER`** | Railway MySQL user. |
| **`MYSQLPASSWORD`** | Railway MySQL password (can be empty if your template allows). |
| **`MYSQLDATABASE`** | Database name containing your imported schema (e.g. `ProjectDB`). |
| **`MYSQL_SSL`** | Optional. Remote hosts use TLS with `rejectUnauthorized: false` by default. Set **`false`** only for local MySQL that rejects SSL. |
| **`MYSQL_CONNECTION_LIMIT`** | Optional; default `10`. Try `5` on serverless to limit open connections. |

4. **Redeploy** after saving variables.

### 3) What you do **not** need to change in code

- **All API routes** already import the shared pool from `src/lib/db.ts` — no per-route DB edits.
- **No `NEXT_PUBLIC_*` MySQL vars** — the browser must never see DB credentials; only server route handlers use `process.env`.

### 4) Optional checks

- Run `npm run build` locally with the **same** env vars in `.env.local` to catch connection errors before pushing.
- If logs show **`ECONNREFUSED 127.0.0.1:3306`**, Vercel is not providing **`MYSQLHOST`** / **`MYSQLPORT`** to the runtime under those exact names (e.g. only `MYSQL_HOST` is set). Align names with Railway or duplicate variables in the Vercel UI.
- If login/menu return 500, also check **`ER_ACCESS_DENIED`**, SSL errors, or “Unknown database” — wrong password or **`MYSQLDATABASE`** not matching what you imported on Railway.

**Grading / demo tip:** If Railway is down, TAs can still run **`npm run dev`** locally with local MySQL + `.env.local`.

### Default routes (high level)

| Area | Examples |
|------|----------|
| Public | `/`, `/menu`, `/about`, `/contact` |
| Customer (after login) | `/cart`, `/checkout`, `/orders`, `/profile`, `/invoices` |
| Admin (after admin login) | `/admin`, `/admin/orders`, `/admin/users`, `/admin/payments` |

---

## Course submission bundle

- **Written report** (PDF/Word) — see `database/submission/SUBMISSION_CHECKLIST.md`.
- **SQL** — schema + data + `database/submission/task2c_five_queries.sql`, `task2d_transactions.sql`, `task2e_rbac.sql`.
- **ERD** — `.drawio` + embedded image in the report.
- **Web app folder** — submit `webapp/` **without** `node_modules` (reinstall with `npm install`).

---

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [MySQL 8 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
