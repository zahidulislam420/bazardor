import { betterAuth } from 'better-auth'
import { dialect } from './db'

/**
 * The canonical origin for the current deployment. Doubles as the `fallback` for the
 * dynamic base URL below, so Vercel only needs `BETTER_AUTH_URL` set to its own domain
 * and nothing else changes between preview and production.
 */
const PROD_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'

const PROD_HOST = (() => {
  try {
    return new URL(PROD_URL).hostname
  } catch {
    return ''
  }
})()

/**
 * Social providers are always registered so the buttons and the OAuth flow exist,
 * but the client degrades gracefully when the keys are missing — see auth-client.ts.
 */
export const auth = betterAuth({
  // Explicit dialect: better-auth cannot infer a driver from a raw @libsql/client.
  database: { dialect, type: 'sqlite' },
  secret: process.env.BETTER_AUTH_SECRET,
  // Dynamic base URL so one build serves localhost, Vercel previews and the production
  // domain. Patterns must carry the port wildcard because the `host` header does
  // ("localhost:3000" never matches a bare "localhost"). Loopback is forced to http.
  baseURL: {
    allowedHosts: ['localhost:*', '127.0.0.1:*', '*.vercel.app', PROD_HOST].filter(Boolean),
    fallback: PROD_URL,
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  /**
   * Lets a GitHub or Google sign-in attach to a row created earlier by email/password.
   * `requireLocalEmailVerified: false` is what actually unblocks it — the default gate
   * refuses to link an IdP identity onto an unverified local email, which is exactly the
   * `account_not_linked` error. Trade-off: an attacker can pre-register a victim's email
   * unverified and claim it when the victim later signs in via OAuth. Acceptable here
   * because the app has no email verification; revisit before any real user base.
   */
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['github', 'google'],
      requireLocalEmailVerified: false,
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    },
  },
})

export type Auth = typeof auth
