'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'

/**
 * Requirement: a toast when a protected route bounces the visitor to /signin.
 * A ref guards it because React 19 double-invokes effects in development, which
 * would otherwise show the message twice.
 */
export function ProtectedRouteToast() {
  useEffect(() => {
    const notified = sessionStorage.getItem('bazardor:redirect-toast')
    if (notified) return

    sessionStorage.setItem('bazardor:redirect-toast', '1')
    toast('সাইন ইন করলে আপনি ফিরে যেতে পারবেন')
  }, [])

  return null
}
