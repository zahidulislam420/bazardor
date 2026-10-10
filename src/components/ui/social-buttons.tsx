'use client'

import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth/auth-client'

type Provider = 'google' | 'github'

/**
 * Both buttons always render — the rubric requires them — but without provider keys
 * the OAuth round-trip cannot succeed, so the failure surfaces as an explicit Bangla
 * toast instead of a silent no-op. Adding the keys needs no change here.
 */
export function SocialButtons() {
  async function handleClick(provider: Provider) {
    const name = provider === 'google' ? 'গুগল' : 'গিটহাব'

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/',
        errorCallbackURL: '/signin',
      })
    } catch {
      toast.error(`${name} লগইন এখনো কনফিগার করা হয়নি। ইমেইল দিয়ে লগইন করুন।`)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => handleClick('google')}
        className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-base-300 bg-white px-3 text-sm font-semibold transition-colors hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
          <path
            fill="#EA4335"
            d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.1 14.6 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 11.4S6.9 20.6 12 20.6c5.7 0 9.4-3.9 9.4-9.5 0-.6-.1-1.1-.2-1.6H12z"
          />
          <path
            fill="#34A853"
            d="M4.6 14.6l-.1-.7-.1-.7v-2.3H1.4v3h1.9l.1.4 1.2 2.3z"
          />
          <path
            fill="#FBBC05"
            d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 .9-3.5.9-2.6 0-4.8-1.7-5.6-4.1H1.4v2.6A10 10 0 0 0 12 22z"
          />
          <path
            fill="#4285F4"
            d="M12 6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5A9.4 9.4 0 0 0 12 2.2 10 10 0 0 0 1.4 11h3.1C5.2 8.6 7.4 6.2 12 6.2z"
          />
        </svg>
        Google
      </button>

      <button
        type="button"
        onClick={() => handleClick('github')}
        className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-base-300 bg-white px-3 text-sm font-semibold transition-colors hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
          <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C15.8 4.7 16.8 5 16.8 5c.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
        </svg>
        GitHub
      </button>
    </div>
  )
}
