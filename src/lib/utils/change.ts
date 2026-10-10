import type { ChangeDir } from '@/lib/types'
import { toBanglaPercent } from './bengali-numeral'

/**
 * The glyph and colour come from `dir`; only the magnitude is the absolute value of `pct`.
 * A negative pct must never render as a down badge because of the minus sign.
 */
export function changeGlyph(dir: ChangeDir): string {
  if (dir === 'up') return '▲'
  if (dir === 'down') return '▼'
  return '—'
}

/** 2.1 → "২.১%", -2.9 → "২.৯%", 0 → "০.০%" */
export function formatChangePct(pct: number): string {
  return `${toBanglaPercent(pct)}%`
}

export function changeVerbBn(dir: ChangeDir): string {
  if (dir === 'up') return 'বেড়েছে'
  if (dir === 'down') return 'কমেছে'
  return 'অপরিবর্তিত'
}

/** Word label used for the bangla-summary line on the detail page. */
export function changeSentenceBn(dir: ChangeDir, diff: number, taka: (n: number) => string): string {
  return `গতকালের তুলনায় আজ দাম ${changeVerbBn(dir)} · ${taka(Math.abs(diff))}`
}
