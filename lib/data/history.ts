// Dated log of fee changes. Newest first. Each entry must link to a source.
// This file feeds the fee-history pages and the public CSV/JSON dataset.

export type FeeChange = {
  date: string; // ISO date the change took effect (or was announced, see `kind`)
  kind: "effective" | "announced";
  /** True when only the month is known. */
  monthOnly?: boolean;
  platform: "Etsy" | "eBay" | "Twitch";
  market: string;
  fee: string;
  from: string;
  to: string;
  summary: string;
  source: string;
};

export const FEE_HISTORY: FeeChange[] = [
  {
    date: "2026-07-01",
    kind: "effective",
    platform: "eBay",
    market: "UK (business sellers)",
    fee: "Below Standard extra final value fee",
    from: "+6 points",
    to: "+7 points after 4+ months Below Standard",
    summary: "Business sellers who stay Below Standard for four or more months in a row pay a higher surcharge on top of the normal final value fee.",
    source: "https://www.ebay.co.uk/help/selling/fees-credits-invoices/fees-business-sellers-activated-managed-payments?id=4809",
  },
  {
    date: "2026-06-22",
    kind: "effective",
    platform: "Etsy",
    market: "United Kingdom",
    fee: "Regulatory Operating Fee",
    from: "0.32%",
    to: "0.48%",
    summary: "Charged on item price plus shipping and gift wrap for UK-based shops.",
    source: "https://community.etsy.com/forum/announcements-290/topic/regulatory-operating-fee-updates-for-some-markets-181930/",
  },
  {
    date: "2026-06-22",
    kind: "effective",
    platform: "Etsy",
    market: "France",
    fee: "Regulatory Operating Fee",
    from: "0.47%",
    to: "1.14%",
    summary: "More than doubled for France-based shops.",
    source: "https://community.etsy.com/forum/announcements-290/topic/regulatory-operating-fee-updates-for-some-markets-181930/",
  },
  {
    date: "2026-06-22",
    kind: "effective",
    platform: "Etsy",
    market: "Italy",
    fee: "Regulatory Operating Fee",
    from: "0.32%",
    to: "0.80%",
    summary: "Raised for Italy-based shops.",
    source: "https://community.etsy.com/forum/announcements-290/topic/regulatory-operating-fee-updates-for-some-markets-181930/",
  },
  {
    date: "2026-06-22",
    kind: "effective",
    platform: "Etsy",
    market: "Spain",
    fee: "Regulatory Operating Fee",
    from: "0.72%",
    to: "0.88%",
    summary: "Raised for Spain-based shops.",
    source: "https://community.etsy.com/forum/announcements-290/topic/regulatory-operating-fee-updates-for-some-markets-181930/",
  },
  {
    date: "2026-06-22",
    kind: "effective",
    platform: "Etsy",
    market: "Hungary",
    fee: "Regulatory Operating Fee",
    from: "none",
    to: "1.97%",
    summary: "New fee for Hungary-based shops.",
    source: "https://community.etsy.com/forum/announcements-290/topic/regulatory-operating-fee-updates-for-some-markets-181930/",
  },
  {
    date: "2026-01-15",
    kind: "announced",
    platform: "eBay",
    market: "UK and Germany (business sellers)",
    fee: "Final value fee and per-order fee",
    from: "previous category rates",
    to: "higher category rates and per-order costs",
    summary: "eBay announced higher final value fees and per-order costs for business sellers in the UK and Germany. The current UK rates are in our calculator.",
    source: "https://www.valueaddedresource.net/ebay-raises-final-value-fees-in-uk-germany-2026/",
  },
  {
    date: "2024-10-01",
    kind: "effective",
    platform: "eBay",
    market: "UK (private sellers)",
    fee: "Final value fee and regulatory operating fee",
    from: "charged on every sale",
    to: "£0 (except vehicles)",
    summary: "UK-based private sellers stopped paying final value and regulatory fees. Buyers pay a Buyer Protection fee instead.",
    source: "https://www.ebay.co.uk/sellercentre/selling/fees/?targetgroup=C2C",
  },
  {
    date: "2023-07-01",
    kind: "effective",
    monthOnly: true,
    platform: "Etsy",
    market: "United Kingdom",
    fee: "Regulatory Operating Fee",
    from: "0.25%",
    to: "0.32%",
    summary: "First increase since the UK fee was introduced in 2021.",
    source: "https://channelx.world/2026/04/etsy-increase-uk-regulatory-operating-fee-2/",
  },
];

export function historyFor(platform: FeeChange["platform"]) {
  return FEE_HISTORY.filter((c) => c.platform === platform);
}
