'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#1d271f',
          border: '1px solid #e1e8e1',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-bangla), sans-serif',
        },
        success: { iconTheme: { primary: '#1a9951', secondary: '#ffffff' } },
        error: { iconTheme: { primary: '#d03739', secondary: '#ffffff' } },
      }}
    />
  )
}
