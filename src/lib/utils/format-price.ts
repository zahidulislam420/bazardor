import { toBanglaNumber } from './bengali-numeral'

/** 148 → "১৪৮", 1850 → "১,৮৫০" */
export function formatPrice(value: number): string {
  return toBanglaNumber(value)
}

/** 148 → "১৪৮ টাকা" */
export function formatTaka(value: number): string {
  return `${formatPrice(value)} টাকা`
}
