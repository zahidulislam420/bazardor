'use client'

import { createAuthClient } from 'better-auth/react'

/**
 * Client-side auth. This is the only auth file a "use client" component may import —
 * auth.ts pulls in the database and must stay on the server.
 */
export const authClient = createAuthClient({
  fetchOptions: { credentials: 'include' },
})

export const { signIn, signUp, signOut, useSession, updateUser } = authClient
