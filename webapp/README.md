# Fusion Bites — Web Application (CS254 companion)

Restaurant ordering front end backed by MySQL (**ProjectDB**). Tech stack: **Next.js App Router**, **React**, **TypeScript**, **Tailwind CSS**, **`mysql2/promise`** (server-side route handlers).

## AI tools disclosure (submission)

Frontend and sample SQL assistance may be produced with Cursor / GPT-class models — state the exact tools you used in your written report, per course instructions.

---

## Fusion Bites — Database connection explanation (paste into submission PDF — ~175 words)

Fusion Bites is structured as a **three-tier architecture**: React pages in the browser, **Next.js App Router Route Handlers** under `webapp/app/api/*/route.ts`, and MySQL (**ProjectDB**). The UI never connects to the database directly. Instead, the browser issues `fetch()` calls to same-origin API routes; each route handler opens a connection from a shared **`mysql2/promise` connection pool** (`src/lib/db.ts`) and runs **parameterised SQL** against tables such as `Users`, `MenuItems`, `Orders`, and `Payments`. JSON results are returned to the client for tables, forms, and dashboards. For multi-step actions (for example placing an order), a route handler can acquire a single connection, run **`START TRANSACTION` / `COMMIT` / `ROLLBACK`** in SQL so order header, line items, and payment rows stay consistent. Session security for this coursework uses a **simple role flag in `localStorage`** (customer vs admin) as required by the project brief — this is not production-grade authentication. Database credentials are read from **environment variables** (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, optional `DB_PORT`) — see `.env.example`; use **`.env.local`** locally and **Vercel project settings** in production. Together, this pattern satisfies the brief: a browser-based front end with a **server-side backend** persisting all authoritative data in **MySQL**.

---

## Local setup

1. **MySQL 8.x** — create and load the database from the repo root SQL (see `database/schema/` and `database/data/`), or import your final dump.
2. In `webapp/`, copy **`.env.example`** to **`.env.local`** and set `DB_PASSWORD` (and other vars if not using localhost defaults).
3. Install and run:

```bash
cd webapp
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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
