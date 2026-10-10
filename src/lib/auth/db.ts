import { createClient } from '@libsql/client'
import { LibsqlDialect } from 'kysely-libsql'
import type { Dialect } from 'kysely'

/**
 * Turso/libSQL in production, a local file in development.
 *
 * Vercel's filesystem is read-only, so a plain better-sqlite3 file works locally but
 * fails after deploy. Setting DATABASE_URL (and its auth token) switches the whole app
 * to Turso with no code change.
 */
const url = process.env.DATABASE_URL ?? 'file:./local.db'
const authToken = process.env.DATABASE_AUTH_TOKEN

export const db = createClient(authToken ? { url, authToken } : { url })

/**
 * better-auth does not auto-detect a raw `@libsql/client` — it only recognises
 * better-sqlite3, pg, mysql2 and node:sqlite by shape. Passing an explicit Kysely
 * dialect is what makes Turso (and the local file fallback) work.
 */
export const dialect: Dialect = new LibsqlDialect({ client: db })
