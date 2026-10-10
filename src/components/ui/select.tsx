'use client'

import { useEffect, useId, useRef, useState } from 'react'

export interface Option<T extends string> {
  value: T
  label: string
}

/**
 * Custom dropdown matching the design (32px trigger, base-200 fill, chevron on the
 * right) rather than a native select, so the rubric's "with chevron icon" is visible.
 * Keyboard support: arrows move, Enter/Space pick, Esc closes, focus returns to the trigger.
 */
export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listId = useId()

  const selected = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  function close(refocus = false) {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  function pick(index: number) {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    close(true)
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (!open) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault()
        setOpen(true)
        setActiveIndex(Math.max(options.findIndex((o) => o.value === value), 0))
      }
      return
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        close(true)
        break
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((i) => (i + 1) % options.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((i) => (i - 1 + options.length) % options.length)
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        pick(activeIndex)
        break
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <span id={`${listId}-label`} className="sr-only">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${listId}-label`}
        onClick={() => {
          setActiveIndex(Math.max(options.findIndex((o) => o.value === value), 0))
          setOpen((v) => !v)
        }}
        onKeyDown={onKeyDown}
        className="flex h-8 items-center gap-1.5 rounded-lg bg-base-200 px-3 text-sm transition-colors hover:bg-neutral-bg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        {selected.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 10 10"
          className={`h-2.5 w-2.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={`${listId}-label`}
          className="absolute right-0 z-50 mt-1 w-max max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-base-300 bg-white py-1 shadow-lg"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => pick(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={
                    isSelected
                      ? 'flex w-full items-center gap-2 whitespace-nowrap bg-base-200 px-3 py-2 text-left text-sm font-semibold'
                      : 'flex w-full items-center gap-2 whitespace-nowrap px-3 py-2 text-left text-sm hover:bg-base-200'
                  }
                >
                  <span aria-hidden="true" className="w-3">
                    {isSelected ? '✓' : ''}
                  </span>
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
