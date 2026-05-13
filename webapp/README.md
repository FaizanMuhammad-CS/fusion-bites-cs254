# Fusion Bites — Web Application (CS254 companion)

**GitHub:** [FaizanMuhammad-CS/fusion-bites-cs254](https://github.com/FaizanMuhammad-CS/fusion-bites-cs254)

Restaurant ordering front end backed by MySQL (**ProjectDB**). Tech stack: **Next.js App Router**, **React**, **TypeScript**, **Tailwind CSS**, **`mysql2/promise`** (server-side route handlers).

## AI tools disclosure (submission)

Frontend and sample SQL assistance may be produced with Cursor / GPT-class models — state the exact tools you used in your written report, per course instructions.

---

## Fusion Bites — Database connection explanation (paste into submission PDF — ~175 words)

Fusion Bites is structured as a **three-tier architecture**: React pages in the browser, **Next.js App Router Route Handlers** under `webapp/app/api/*/route.ts`, and MySQL (**ProjectDB**). The UI never connects to the database directly. Instead, the browser issues `fetch()` calls to same-origin API routes; each route handler opens a connection from a shared **`mysql2/promise` connection pool** (`src/lib/db.ts`) and runs **parameterised SQL** against tables such as `Users`, `MenuItems`, `Orders`, and `Payments`. JSON results are returned to the client for tables, forms, and dashboards. For multi-step actions (for example placing an order), a route handler can acquire a single connection, run **`START TRANSACTION` / `COMMIT` / `ROLLBACK`** in SQL so order header, line items, and payment rows stay consistent. Session security for this coursework uses a **simple role flag in `localStorage`** (customer vs admin) as required by the project brief — this is not production-grade authentication. Database credentials are supplied via **environment variables** (see `webapp/.env.example`); production uses Railway/Vercel env vars, while local dev can rely on defaults in `db.ts` or overrides in `.env.local`. Together, this pattern satisfies the brief: a browser-based front end with a **server-side backend** persisting all authoritative data in **MySQL**.

---

## Local setup

1. **MySQL 8.x** — create and load the database from the repo root SQL (see `database/schema/` and `database/data/`), or import your final dump.
2. **Environment variables** — copy `webapp/.env.example` to `webapp/.env.local` if you want to override anything. By default `src/lib/db.ts` uses `localhost` / `root` / **`ProjectDB`** with a local dev password fallback; set `MYSQL_PASSWORD` in `.env.local` if your MySQL password differs.
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
2. Open the MySQL service → **Variables** / **Connect**. Copy either:
   - a single **`MYSQL_URL`**, **`MYSQL_PUBLIC_URL`**, or **`DATABASE_URL`** string (`mysql://user:pass@host:port/dbname`), **or**
   - discrete **`MYSQLHOST` / `MYSQLPORT` / `MYSQLUSER` / `MYSQLPASSWORD` / `MYSQLDATABASE`** (Railway’s names vary — map them in Vercel to the names below).
3. **Import your schema and data** (same as local): run `database/schema/FoodDeliverySystem.sql` then `database/data/data.sql` (or your dump) against that Railway database. The logical database name should match what you put in the URL path (often **`ProjectDB`**; if Railway defaults to `railway`, either rename or set `MYSQL_DATABASE` accordingly).

### 2) Configure Vercel

1. [Vercel](https://vercel.com) → **Add New Project** → import this GitHub repo.
2. **Root Directory:** `webapp` (the Next.js app is not at the repo root).
3. **Environment Variables** (Production — add Preview too if you want preview deploys to work):

| Variable | When to set |
|----------|-------------|
| **`DATABASE_URL`** or **`MYSQL_URL`** or **`MYSQL_PUBLIC_URL`** | Easiest: paste Railway’s full `mysql://…` URL (must include database name in the path, e.g. `/ProjectDB`). |
| **or** `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` | If you prefer discrete vars instead of a URL. |
| **`MYSQL_SSL`** | Set to `true` on Vercel if connections fail without TLS (common for public Railway TCP). Auto-enabled for many `*.railway.app` / `*.rlwy.net` hosts when using discrete vars. |
| **`MYSQL_CONNECTION_LIMIT`** | Optional; default `10`. You may use `5` on serverless to reduce open connections. |

4. **Redeploy** after saving variables.

### 3) What you do **not** need to change in code

- **All API routes** already import the shared pool from `src/lib/db.ts` — no per-route DB edits.
- **No `NEXT_PUBLIC_*` MySQL vars** — the browser must never see DB credentials; only server route handlers use `process.env`.

### 4) Optional checks

- Run `npm run build` locally with the **same** env vars in `.env.local` to catch connection errors before pushing.
- If login/menu return 500, check Vercel **Function logs** for `ECONNREFUSED`, `ER_ACCESS_DENIED`, or SSL errors — usually wrong host/port, wrong DB name in URL, or missing `MYSQL_SSL=true`.

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
