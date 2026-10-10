-- Better Auth core schema for libSQL / SQLite.
-- Generated from `getAuthTables()` in better-auth@1.7 (user, session, account, verification).
-- Apply with: node scripts/migrate.mjs

CREATE TABLE IF NOT EXISTS "user" (
  "id"          TEXT PRIMARY KEY NOT NULL,
  "name"        TEXT NOT NULL,
  "email"       TEXT NOT NULL UNIQUE,
  "emailVerified" INTEGER NOT NULL DEFAULT 0,
  "image"       TEXT,
  "createdAt"   TIMESTAMP NOT NULL,
  "updatedAt"   TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  "id"        TEXT PRIMARY KEY NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "token"     TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId"    TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id"                    TEXT PRIMARY KEY NOT NULL,
  "accountId"             TEXT NOT NULL,
  "providerId"            TEXT NOT NULL,
  "userId"                TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken"           TEXT,
  "refreshToken"          TEXT,
  "idToken"               TEXT,
  "accessTokenExpiresAt"  TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  "scope"                 TEXT,
  "password"              TEXT,
  "createdAt"             TIMESTAMP NOT NULL,
  "updatedAt"             TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id"        TEXT PRIMARY KEY NOT NULL,
  "identifier" TEXT NOT NULL,
  "value"     TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId");
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "account_provider_account_idx"
  ON "account" ("providerId", "accountId");
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier");
