# SellCalc

Fee calculators for online sellers: Etsy, eBay US, eBay UK, Etsy vs eBay, Twitch Bits.

- `npm run dev` — local dev server
- `npm test` — engine tests
- `npm run build` — static production build

Deployed on Vercel from `main`. Preview deployments and any deployment on `*.vercel.app` send `X-Robots-Tag: noindex` and a blocking robots.txt.
Set `NEXT_PUBLIC_SITE_URL=https://sellcalc.com` in Vercel once the domain is attached.

See `AGENTS.md` for the rules on data, sources and adding pages.
