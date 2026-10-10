import emoji from '@/data/emoji.json'
import type { Unit } from '@/lib/types'
import { toBanglaNumber } from './bengali-numeral'

type UnitEntry = { long: string; short: string; tickerUnit: string }

const UNITS = emoji.unit as Record<string, UnitEntry>

function entry(unit: Unit): UnitEntry {
  return UNITS[unit] ?? UNITS.kg
}

/** Card + detail header label: "প্রতি কেজি" */
export function unitLabel(unit: Unit): string {
  return entry(unit).long
}

/** Detail price panel: "টাকা / কেজি" */
export function unitWithTaka(unit: Unit): string {
  return `টাকা / ${entry(unit).short}`
}

/** Ticker item: "১৪৮ টাকা/কেজি" */
export function tickerPrice(value: number, unit: Unit): string {
  return `${toBanglaNumber(value)} টাকা/${entry(unit).tickerUnit}`
}
