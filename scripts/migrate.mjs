// Applies src/lib/auth/schema.sql to the configured libSQL database.
// Run before the first deploy:  node scripts/migrate.mjs
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@libsql/client'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sql = readFileSync(resolve(ROOT, 'src/lib/auth/schema.sql'), 'utf8')

const url = process.env.DATABASE_URL ?? 'file:./local.db'
const authToken = process.env.DATABASE_AUTH_TOKEN
const db = createClient(authToken ? { url, authToken } : { url })

// The file uses IF NOT EXISTS throughout, so re-running is safe.
const statements = sql
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean)

for (const statement of statements) {
  await db.execute(statement)
}

const { rows } = await db.execute(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
)
console.log(`migrated ${url.replace(/:.*@/, ':***@')}`)
console.log('tables:', rows.map((r) => r.name).join(', '))
