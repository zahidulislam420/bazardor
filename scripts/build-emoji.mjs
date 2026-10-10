// Regenerates src/data/emoji.json from the live BazarDor API.
// Run after any API schema change:  node scripts/build-emoji.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASES = [
  'https://api.api-store.workers.dev/api/bazardor',
  'https://api.abcz.workers.dev/api/bazardor',
]

async function getJSON(path) {
  for (const base of BASES) {
    try {
      const res = await fetch(base + path, { signal: AbortSignal.timeout(10_000) })
      if (res.ok) return res.json()
    } catch {}
  }
  throw new Error(`bazardor: all base urls failed for ${path}`)
}

const [products, categories] = await Promise.all([
  getJSON('/products'),
  getJSON('/categories'),
])

const out = {
  $comment:
    'Emoji map for BazarDor. Product + category emoji are sourced from the live API (products[].image, categories[].icon) and snapshotted for offline fallback and for UI chrome the API does not provide.',
  $source: BASES[0],

  categories: Object.fromEntries(
    categories.map((c) => [c.slug, { nameBn: c.nameBn, icon: c.icon }])
  ),

  products: Object.fromEntries(
    products.map((p) => [
      p.slug,
      { nameBn: p.nameBn, category: p.category, unit: p.unit, image: p.image },
    ])
  ),

  ui: {
    logo: '🛒',
    user: '👤',
    signOut: '↩',
    search: '🔍',
    sortChevron: '▾',
    trendUp: '▲',
    trendDown: '▼',
    trendFlat: '—',
    emptyState: '🧺',
    notFound: '🔍',
    cart: '🛒',
  },

  unit: {
    kg: { long: 'প্রতি কেজি', short: 'কেজি', tickerUnit: 'কেজি' },
    litre: { long: 'প্রতি লিটার', short: 'লিটার', tickerUnit: 'লিটার' },
    dozen: { long: 'প্রতি ডজন', short: 'ডজন', tickerUnit: 'ডজন' },
    piece: { long: 'প্রতি পিস', short: 'পিস', tickerUnit: 'পিস' },
  },
}

mkdirSync(resolve(ROOT, 'src/data'), { recursive: true })
writeFileSync(resolve(ROOT, 'src/data/emoji.json'), JSON.stringify(out, null, 2) + '\n')

console.log(
  `emoji.json written — ${Object.keys(out.products).length} products, ${Object.keys(out.categories).length} categories`
)
