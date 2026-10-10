import { toBanglaDigits } from './bengali-numeral'

/** 4 → "৪" */
export function countBn(count: number): string {
  return toBanglaDigits(count)
}

/** 4, "টি পণ্য" → "৪টি পণ্য" · 1 → "১টি পণ্য" */
export function countLabel(count: number, noun: string): string {
  return `${countBn(count)}${noun}`
}
