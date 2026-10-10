import type { ChangeDir } from '@/lib/types'
import { changeGlyph, formatChangePct } from '@/lib/utils/change'

/**
 * Consumer-goods convention used by this design: a rise is the unwelcome direction
 * (red, ▲), a fall is the welcome one (green, ▼) — the opposite of stock markets.
 * Glyph and colour must stay in agreement, so both read from the same `dir`.
 */
const TONE: Record<ChangeDir, string> = {
  up: 'text-error',
  down: 'text-success',
  flat: 'text-base-content',
}

const SCREEN_READER: Record<ChangeDir, string> = {
  up: 'দাম বেড়েছে',
  down: 'দাম কমেছে',
  flat: 'দাম অপরিবর্তিত',
}

/**
 * 24px pill, no background fill — the design colours the glyph and the percentage,
 * never the badge itself. Glyph and percentage are separate nodes so screen readers
 * get a word instead of a bare triangle.
 */
export function ChangeBadge({
  dir,
  pct,
  className = '',
}: {
  dir: ChangeDir
  pct: number
  className?: string
}) {
  return (
    <span
      aria-label={`${SCREEN_READER[dir]} ${formatChangePct(pct)}`}
      className={`inline-flex items-center gap-1 rounded-xl px-2 py-1 text-xs font-semibold ${TONE[dir]} ${className}`}
    >
      <span aria-hidden="true">{changeGlyph(dir)}</span>
      <span aria-hidden="true">{formatChangePct(pct)}</span>
    </span>
  )
}
