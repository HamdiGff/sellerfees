// Single source of truth for the public site URL.
// Once sellcalc.com is attached in Vercel, VERCEL_PROJECT_PRODUCTION_URL
// becomes "sellcalc.com" automatically. NEXT_PUBLIC_SITE_URL overrides it.
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://sellcalc.com");

export const SITE_URL = fromEnv.replace(/\/+$/, "");
export const SITE_NAME = "SellCalc";
export const CONTACT_EMAIL = "hello@sellcalc.com";

/** Absolute URL for an internal path. Paths always end with a slash. */
export function abs(path: string): string {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  const [p, q] = path.split("?");
  const clean = p.startsWith("/") ? p : `/${p}`;
  const withSlash = clean.endsWith("/") || clean.includes(".") ? clean : `${clean}/`;
  return `${SITE_URL}${withSlash}${q ? `?${q}` : ""}`;
}

/** Date the fee tables were last checked against the official pages. */
export const DATA_VERIFIED = "2026-11-09";

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
