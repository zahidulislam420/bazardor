'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth/auth-client'
import { SubmitButton } from '@/components/ui/submit-button'
import { SocialButtons } from '@/components/ui/social-buttons'

type Mode = 'signin' | 'signup'

const COPY = {
  signin: {
    title: 'সাইন ইন',
    subtitle: 'বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।',
    submit: 'সাইন ইন',
    footerLead: 'অ্যাকাউন্ট নেই?',
    footerAction: 'সাইন আপ করুন',
    footerHref: '/signup',
  },
  signup: {
    title: 'অ্যাকাউন্ট তৈরি করুন',
    subtitle: 'বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।',
    submit: 'অ্যাকাউন্ট তৈরি করুন',
    footerLead: 'অ্যাকাউন্ট আছে?',
    footerAction: 'সাইন ইন করুন',
    footerHref: '/signin',
  },
} as const

function Field({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  minLength,
  value,
  onChange,
  invalid,
  hint,
}: {
  id: string
  label: string
  type: string
  placeholder: string
  autoComplete: string
  minLength?: number
  value: string
  onChange: (v: string) => void
  invalid?: boolean
  hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`mt-2 h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition-colors placeholder:text-base-content/40 focus-visible:ring-2 focus-visible:ring-primary ${
          invalid ? 'border-error focus-visible:ring-error' : 'border-base-300 focus-visible:border-primary'
        }`}
      />
      {invalid && hint && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-error">
          {hint}
        </p>
      )}
    </div>
  )
}

export function AuthForm({
  mode,
  redirectTo = '/',
}: {
  mode: Mode
  redirectTo?: string
}) {
  const router = useRouter()
  const copy = COPY[mode]

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pending, setPending] = useState(false)
  const [errorField, setErrorField] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorField(null)

    if (mode === 'signup' && password !== confirm) {
      setErrorField('confirm')
      toast.error('দুটি পাসওয়ার্ড মিলছে না')
      return
    }

    setPending(true)

    try {
      if (mode === 'signup') {
        const { error } = await authClient.signUp.email({ name, email, password })
        if (error) throw new Error(error.message ?? 'অ্যাকাউন্ট তৈরি হয়নি')
        toast.success('অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।')
        router.replace(
          redirectTo === '/'
            ? '/signin'
            : `/signin?redirect=${encodeURIComponent(redirectTo)}`
        )
        return
      }

      const { error } = await authClient.signIn.email({ email, password })
      if (error) throw new Error(error.message ?? 'লগইন হয়নি')
      toast.success('সফলভাবে লগইন হয়েছে')
      // Full page load, not router.push(). The session cookie is set by this fetch and
      // the target is a partially-prerendered protected route, so a client-side push can
      // serve an RSC payload cached from before sign-in and re-bounce to /signin. A hard
      // navigation re-runs proxy.ts with the cookie present. Social sign-in already
      // behaves this way, which is why only the email path was broken.
      window.location.assign(redirectTo)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'কিছু একটা সমস্যা হয়েছে'
      // The server reports which field is wrong; only "email" and "password" are form inputs.
      const field = /email/i.test(message) ? 'email' : /password/i.test(message) ? 'password' : null
      setErrorField(field)
      toast.error(message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {mode === 'signup' && (
        <Field
          id="name"
          label="নাম"
          type="text"
          placeholder="যেমন: রহিম উদ্দিন"
          autoComplete="name"
          value={name}
          onChange={setName}
          invalid={errorField === 'name'}
          hint="নাম সঠিকভাবে লিখুন"
        />
      )}

      <Field
        id="email"
        label="ইমেইল"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        invalid={errorField === 'email'}
        hint="এই ইমেইলটি দিয়ে অ্যাকাউন্ট আছে বা ইমেইলটি সঠিক নয়"
      />

      <Field
        id="password"
        label="পাসওয়ার্ড"
        type="password"
        placeholder="কমপক্ষে ৮ অক্ষর"
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        minLength={8}
        value={password}
        onChange={setPassword}
        invalid={errorField === 'password'}
        hint="পাসওয়ার্ড সঠিক নয় বা কমপক্ষে ৮ অক্ষরের হতে হবে"
      />

      {mode === 'signup' && (
        <Field
          id="confirm"
          label="পাসওয়ার্ড নিশ্চিত করুন"
          type="password"
          placeholder="আবার লিখুন"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          invalid={errorField === 'confirm'}
          hint="দুটি পাসওয়ার্ড মেলেনি"
        />
      )}

      <SubmitButton isPending={pending} className="w-full">
        {copy.submit}
      </SubmitButton>

      <div className="flex items-center gap-4 py-1">
        <span className="h-px flex-1 bg-base-300" />
        <span className="text-xs text-base-content/60">অথবা</span>
        <span className="h-px flex-1 bg-base-300" />
      </div>

      <SocialButtons redirectTo={redirectTo} />

      <p className="text-center text-sm text-base-content/70">
        {copy.footerLead}{' '}
        <Link href={copy.footerHref} className="font-semibold text-link-primary hover:underline">
          {copy.footerAction}
        </Link>
      </p>
    </form>
  )
}
