// Every public page is listed here. The sitemap, navigation, related-tool
// links and the home page all read from this list, so a new tool only has to
// be registered once.

export type PageDef = {
  path: string;
  /** <title> — written per page, not from a formula. */
  title: string;
  description: string;
  /** Short name for menus and cards. */
  short: string;
  /** One line for cards on the home page. */
  blurb: string;
  kind: "tool" | "data" | "info";
  platform?: "Etsy" | "eBay" | "Twitch" | "Multi";
  related?: string[];
  lastReviewed: string;
  status: "live" | "draft";
};

export const PAGES: PageDef[] = [
  {
    path: "/etsy-fee-calculator/",
    title: "Etsy Fee Calculator — every fee line, with sources",
    description:
      "Work out exactly what Etsy keeps from a sale: listing, 6.5% transaction, payment processing, Offsite Ads and regulatory fees for US, UK, Canada, Australia and EU shops.",
    short: "Etsy fees",
    blurb: "Listing, transaction, processing, Offsite Ads and regulatory fees for 8 countries.",
    kind: "tool",
    platform: "Etsy",
    related: ["/etsy-fee-calculator-uk/", "/etsy-vs-ebay-fees/", "/fee-history/"],
    lastReviewed: "2026-11-09",
    status: "live",
  },
  {
    path: "/etsy-fee-calculator-uk/",
    title: "Etsy Fees UK: What a UK Shop Really Pays per Sale",
    description:
      "UK Etsy fee calculator with the 4% + 20p processing fee, the 0.48% Regulatory Operating Fee from June 2026 and 20% VAT on fees for sellers who aren't VAT-registered.",
    short: "Etsy fees UK",
    blurb: "Includes the 0.48% regulatory fee and VAT on fees.",
    kind: "tool",
    platform: "Etsy",
    related: ["/ebay-fee-calculator-uk/", "/etsy-vs-ebay-fees/", "/etsy-fee-calculator/"],
    lastReviewed: "2026-11-09",
    status: "live",
  },
  {
    path: "/ebay-fee-calculator/",
    title: "eBay Fee Calculator (US): Final Value Fee by Category",
    description:
      "Calculate eBay.com fees for any category: the final value fee on item, shipping and sales tax, the $0.30/$0.40 order fee, promoted listings and international sales.",
    short: "eBay fees (US)",
    blurb: "Category rates, tiers, order fee, promoted listings and tax.",
    kind: "tool",
    platform: "eBay",
    related: ["/etsy-vs-ebay-fees/", "/ebay-fee-calculator-uk/", "/fee-history/"],
    lastReviewed: "2026-11-09",
    status: "live",
  },
  {
    path: "/ebay-fee-calculator-uk/",
    title: "eBay UK Fee Calculator for Private and Business Sellers",
    description:
      "Private sellers on eBay.co.uk pay no final value fee. Business sellers pay category rates, a per-order fee, 0.35% regulatory fee and VAT. See both side by side.",
    short: "eBay fees UK",
    blurb: "Private vs business sellers, every category, VAT on fees.",
    kind: "tool",
    platform: "eBay",
    related: ["/etsy-fee-calculator-uk/", "/etsy-vs-ebay-fees/", "/fee-history/"],
    lastReviewed: "2026-11-09",
    status: "live",
  },
  {
    path: "/etsy-vs-ebay-fees/",
    title: "Etsy vs eBay Fees: Which Leaves You More Money?",
    description: "Enter one price and see what Etsy and eBay each take, side by side, for US and UK sellers. Includes eBay UK's zero-fee private selling.",
    short: "Etsy vs eBay",
    blurb: "Same item, both platforms, one answer.",
    kind: "tool",
    platform: "Multi",
    related: ["/etsy-fee-calculator/", "/ebay-fee-calculator/", "/ebay-fee-calculator-uk/"],
    lastReviewed: "2026-11-09",
    status: "live",
  },
  {
    path: "/twitch-bits-to-usd/",
    title: "Twitch Bits to USD: What Streamers Actually Get",
    description: "Convert Twitch Bits to dollars at the streamer's rate of one cent per Bit, or work out how many Bits a goal needs.",
    short: "Twitch Bits to USD",
    blurb: "Bits to dollars, and dollars to Bits.",
    kind: "tool",
    platform: "Twitch",
    related: ["/fee-history/"],
    lastReviewed: "2026-11-09",
    status: "live",
  },
  {
    path: "/fee-history/",
    title: "Marketplace Fee Change Log: Etsy and eBay",
    description: "A dated record of Etsy and eBay fee changes, each linked to its source. Download it as CSV or JSON.",
    short: "Fee history",
    blurb: "Every fee change we track, dated and sourced.",
    kind: "data",
    platform: "Multi",
    related: ["/etsy-fee-calculator/", "/ebay-fee-calculator/"],
    lastReviewed: "2026-11-09",
    status: "live",
  },
  {
    path: "/methodology/",
    title: "How SellCalc Checks Fees",
    description: "Where our fee numbers come from, how often we check them, how rounding works and what our calculators leave out.",
    short: "Methodology",
    blurb: "Sources, rounding and update routine.",
    kind: "info",
    lastReviewed: "2026-11-09",
    status: "live",
  },
  { path: "/about/", title: "About SellCalc", description: "Who runs SellCalc and why it exists.", short: "About", blurb: "", kind: "info", lastReviewed: "2026-11-09", status: "live" },
  { path: "/privacy/", title: "Privacy Policy", description: "What SellCalc collects (very little) and how cookies and ads work on this site.", short: "Privacy", blurb: "", kind: "info", lastReviewed: "2026-11-09", status: "live" },
  { path: "/contact/", title: "Contact SellCalc", description: "Report a wrong fee, suggest a platform or get in touch.", short: "Contact", blurb: "", kind: "info", lastReviewed: "2026-11-09", status: "live" },
  { path: "/terms/", title: "Terms of Use", description: "The terms for using SellCalc's calculators and data.", short: "Terms", blurb: "", kind: "info", lastReviewed: "2026-11-09", status: "live" },
];

export const page = (path: string) => {
  const p = PAGES.find((x) => x.path === path);
  if (!p) throw new Error(`Unregistered page: ${path}`);
  return p;
};

export const TOOLS = PAGES.filter((p) => p.kind === "tool" && p.status === "live");
