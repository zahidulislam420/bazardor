import { betterAuth } from 'better-auth'
import { dialect } from './db'

/**
 * Social providers are always registered so the buttons and the OAuth flow exist,
 * but the client degrades gracefully when the keys are missing — see auth-client.ts.
 */
export const auth = betterAuth({
  // Explicit dialect: better-auth cannot infer a driver from a raw @libsql/client.
  database: { dialect, type: 'sqlite' },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
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
