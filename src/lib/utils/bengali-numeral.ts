const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BANGLA_DIGITS[Number(d)])
}

/**
 * Bengali numerals with Indian digit grouping: 148 → ১৪৮, 1850 → ১,৮৫০.
 * Grouping happens on the Latin form first, then digits are substituted.
 */
export function toBanglaNumber(value: number): string {
  return toBanglaDigits(value.toLocaleString('en-IN'))
}

/** Percentage with exactly one decimal: 2.1 → ২.১, 9 → ৯.০, 0 → ০.০. */
export function toBanglaPercent(pct: number): string {
  return toBanglaDigits(Math.abs(pct).toFixed(1))
}

/** Midpoint with two decimals, matching the design's market-table গড় column: 65.5 → ৬৫.৫০. */
export function toBanglaDecimal(value: number): string {
  return toBanglaDigits(value.toFixed(2))
}
