# SellCalc — rules for anyone (human or AI) changing this repo

SellCalc is a static Next.js site of marketplace fee calculators. Accuracy is the product.

## Structure
- `lib/data/*.ts` — fee schedules. Every value must come from the platform's own page. Update `verifiedOn` only after re-checking.
- `lib/data/history.ts` — dated fee change log (feeds /fee-history/ and /data/*.csv|json). Add an entry for every fee change, with a source URL.
- `lib/engines/*.ts` — pure calculation functions. No React, no I/O. Every engine change needs a test in `tests/`.
- `lib/registry.ts` — every public page. Sitemap, nav cards and related links read from it. Register new pages here.
- `components/` — client UI. Calculators keep inputs in the URL via `useUrlState`.
- `app/<slug>/page.tsx` — one folder per page. Page prose is written by hand for that page; do not template it.

## Rules
- Internal links: always `abs("/path/")` from `lib/site.ts` (absolute URLs, trailing slash).
- No new dependencies without a clear reason. No server functions except static route handlers.
- All compute runs in the browser. Never send user inputs anywhere.
- Select/inputs: labels in dropdowns must be 30 characters or fewer so they never clip on mobile.
- Performance budget: tool route JS under 150 KB gzipped, LCP under 2 s on mobile, CLS under 0.05.
- Before pushing: `npm run typecheck && npm test && npm run build`.

## Adding a platform
1. Add `lib/data/<platform>.ts` with sources and `verifiedOn`.
2. Add `lib/engines/<platform>.ts` and tests with worked examples checked by hand.
3. Add a calculator component, a page folder with original prose, and a registry entry.
