import mysql from "mysql2/promise";
import type { PoolOptions, SslOptions } from "mysql2";

/**
 * Builds mysql2 pool options for:
 * - **Railway / cloud:** set `DATABASE_URL`, `MYSQL_URL`, or `MYSQL_PUBLIC_URL` to a `mysql://` or `mysqls://` URL,
 *   or set discrete `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`.
 * - **Local:** omit URL vars; defaults match a typical XAMPP/WAMP-style install (override with `.env.local`).
 *
 * TLS: set `MYSQL_SSL=true` on Vercel when your provider requires encrypted connections (often needed for Railway TCP).
 */

function parseSsl(): SslOptions | undefined {
  const v = process.env.MYSQL_SSL?.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "require") {
    return { rejectUnauthorized: false };
  }
  if (v === "verify" || v === "verify-full") {
    return {};
  }
  return undefined;
}

function poolOptionsFromMysqlUrl(raw: string): PoolOptions {
  const trimmed = raw.trim();
  const url = new URL(trimmed.replace(/^jdbc:/i, ""));
  if (url.protocol !== "mysql:" && url.protocol !== "mysqls:") {
    throw new Error(
      `Unsupported MySQL URL protocol: ${url.protocol} (expected mysql:// or mysqls://)`
    );
  }
  const database = url.pathname.replace(/^\//, "").split("?")[0];
  if (!database) {
    throw new Error("MySQL URL must include a database name, e.g. mysql://user:pass@host:3306/ProjectDB");
  }
  const explicitSsl = parseSsl();
  const ssl: SslOptions | undefined =
    explicitSsl !== undefined
      ? explicitSsl
      : url.protocol === "mysqls:"
        ? { rejectUnauthorized: false }
        : undefined;

  const base: PoolOptions = {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT) || 10,
  };
  if (ssl !== undefined) {
    base.ssl = ssl;
  }
  return base;
}

function poolOptionsFromDiscreteEnv(): PoolOptions {
  const host = process.env.MYSQL_HOST ?? "localhost";
  const port = Number(process.env.MYSQL_PORT) || 3306;
  const user = process.env.MYSQL_USER ?? "root";
  const password = process.env.MYSQL_PASSWORD ?? "@@faizan6767";
  const database = process.env.MYSQL_DATABASE ?? "ProjectDB";

  let ssl: SslOptions | undefined = parseSsl();
  if (
    !ssl &&
    (host.includes("railway.app") ||
      host.includes("rlwy.net") ||
      host.endsWith(".proxy.rlwy.net"))
  ) {
    ssl = { rejectUnauthorized: false };
  }

  const base: PoolOptions = {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT) || 10,
  };
  if (ssl !== undefined) {
    base.ssl = ssl;
  }
  return base;
}

function buildPoolOptions(): PoolOptions {
  const urlCandidate =
    process.env.DATABASE_URL?.trim() ||
    process.env.MYSQL_URL?.trim() ||
    process.env.MYSQL_PUBLIC_URL?.trim() ||
    "";

  if (
    urlCandidate.startsWith("mysql://") ||
    urlCandidate.startsWith("mysqls://")
  ) {
    return poolOptionsFromMysqlUrl(urlCandidate);
  }

  return poolOptionsFromDiscreteEnv();
}

const pool = mysql.createPool(buildPoolOptions());

export default pool;
