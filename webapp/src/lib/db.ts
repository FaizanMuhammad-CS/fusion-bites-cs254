import mysql from "mysql2/promise";
import type { PoolOptions, SslOptions } from "mysql2";

/**
 * MySQL pool for serverless (Vercel) + Railway.
 *
 * **Required env (Railway / Vercel naming — no underscore after MYSQL):**
 * `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`
 *
 * **TLS:** Remote hosts use `ssl: { rejectUnauthorized: false }` (Railway TCP proxy).
 * For local MySQL without TLS, set `MYSQL_SSL=false`.
 *
 * **Optional:** `MYSQL_CONNECTION_LIMIT` (default `10`).
 */

const RAILWAY_SSL: SslOptions = { rejectUnauthorized: false };

function isLoopbackHost(host: string): boolean {
  const h = host.trim().toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

function resolveSsl(host: string): SslOptions | undefined {
  const flag = process.env.MYSQL_SSL?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "off") {
    return undefined;
  }
  if (flag === "true" || flag === "1" || flag === "require") {
    return RAILWAY_SSL;
  }
  // Default: TLS for non-loopback (Railway / cloud); omit for typical local MySQL
  if (isLoopbackHost(host)) {
    return undefined;
  }
  return RAILWAY_SSL;
}

function requireEnv(name: string): string {
  const raw = process.env[name];
  if (raw === undefined || raw === null) {
    throw new Error(
      `Missing required environment variable ${name}. Set MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, and MYSQLDATABASE (Railway names on Vercel).`
    );
  }
  const v = raw.trim();
  if (!v) {
    throw new Error(
      `Environment variable ${name} is set but empty. Railway/Vercel must define MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, and MYSQLDATABASE.`
    );
  }
  return v;
}

function buildPoolOptions(): PoolOptions {
  const host = requireEnv("MYSQLHOST");
  const portRaw = requireEnv("MYSQLPORT");
  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0 || port > 65535) {
    throw new Error(`MYSQLPORT must be a valid TCP port (got "${portRaw}")`);
  }

  const user = requireEnv("MYSQLUSER");
  const database = requireEnv("MYSQLDATABASE");
  const password =
    process.env.MYSQLPASSWORD === undefined || process.env.MYSQLPASSWORD === null
      ? ""
      : String(process.env.MYSQLPASSWORD);

  const ssl = resolveSsl(host);

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

const pool = mysql.createPool(buildPoolOptions());

export default pool;
