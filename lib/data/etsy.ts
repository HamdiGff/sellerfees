// Etsy fee schedule. Every number here was checked against Etsy's own pages
// on the date in `verifiedOn`. When Etsy changes a fee, update the value here
// AND add a dated entry to lib/data/history.ts.

export type EtsyCountryCode = "US" | "UK" | "CA" | "AU" | "DE" | "FR" | "IT" | "ES";

export type EtsyCountry = {
  code: EtsyCountryCode;
  name: string;
  currency: "USD" | "GBP" | "CAD" | "AUD" | "EUR";
  /** Payment processing for domestic orders (and all orders where no split exists). */
  processing: { pct: number; fixed: number };
  /** Some countries charge more when the buyer is abroad. */
  processingInternational?: { pct: number; fixed: number };
  /** Regulatory Operating Fee, as a fraction of item + shipping. */
  regulatoryFee: number;
  /** Default VAT/GST rate added to Etsy's fees for sellers who are not tax-registered. 0 = none. */
  taxOnFeesDefault: number;
  taxOnFeesLabel: string;
  /** Approximate local value of the $0.20 USD listing fee (Etsy converts at the day's rate). */
  listingFeeApprox: number;
  /** Approximate local value of the $100 USD Offsite Ads cap. */
  offsiteCapApprox: number;
  /** US sellers: sales tax is outside the transaction-fee base. */
  salesTaxField: boolean;
  note?: string;
};

export const ETSY = {
  verifiedOn: "2026-11-09",
  listingFeeUSD: 0.2,
  transactionRate: 0.065,
  offsiteAds: { standard: 0.15, highVolume: 0.12, capUSD: 100 },
  currencyConversionRate: 0.025,
  sources: [
    { label: "Etsy Fees & Payments Policy (updated 5 Oct 2026)", url: "https://www.etsy.com/legal/fees/" },
    { label: "Etsy Payments Policy: processing rates by country (updated 31 Jul 2026)", url: "https://www.etsy.com/legal/etsy-payments/" },
    {
      label: "Etsy announcement: Regulatory Operating Fee changes from 22 June 2026",
      url: "https://community.etsy.com/forum/announcements-290/topic/regulatory-operating-fee-updates-for-some-markets-181930/",
    },
  ],
} as const;

export const ETSY_COUNTRIES: Record<EtsyCountryCode, EtsyCountry> = {
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    processing: { pct: 0.03, fixed: 0.25 },
    regulatoryFee: 0,
    taxOnFeesDefault: 0,
    taxOnFeesLabel: "Sales tax on fees",
    listingFeeApprox: 0.2,
    offsiteCapApprox: 100,
    salesTaxField: true,
  },
  UK: {
    code: "UK",
    name: "United Kingdom",
    currency: "GBP",
    processing: { pct: 0.04, fixed: 0.2 },
    regulatoryFee: 0.0048,
    taxOnFeesDefault: 0.2,
    taxOnFeesLabel: "VAT on Etsy fees",
    listingFeeApprox: 0.15,
    offsiteCapApprox: 75,
    salesTaxField: false,
  },
  CA: {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    processing: { pct: 0.03, fixed: 0.25 },
    processingInternational: { pct: 0.04, fixed: 0.25 },
    regulatoryFee: 0.005,
    taxOnFeesDefault: 0.05,
    taxOnFeesLabel: "GST/HST on Etsy fees",
    listingFeeApprox: 0.28,
    offsiteCapApprox: 140,
    salesTaxField: false,
    note: "Etsy's help centre lists the Canadian Regulatory Operating Fee at 0.50% since its 22 June 2026 edit, without a stated start date. Orders to the US count as domestic for processing.",
  },
  AU: {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    processing: { pct: 0.03, fixed: 0.25 },
    processingInternational: { pct: 0.04, fixed: 0.25 },
    regulatoryFee: 0,
    taxOnFeesDefault: 0.1,
    taxOnFeesLabel: "GST on Etsy fees",
    listingFeeApprox: 0.28,
    offsiteCapApprox: 142,
    salesTaxField: false,
  },
  DE: {
    code: "DE",
    name: "Germany",
    currency: "EUR",
    processing: { pct: 0.04, fixed: 0.3 },
    regulatoryFee: 0,
    taxOnFeesDefault: 0.19,
    taxOnFeesLabel: "VAT on Etsy fees",
    listingFeeApprox: 0.17,
    offsiteCapApprox: 87,
    salesTaxField: false,
  },
  FR: {
    code: "FR",
    name: "France",
    currency: "EUR",
    processing: { pct: 0.04, fixed: 0.3 },
    regulatoryFee: 0.0114,
    taxOnFeesDefault: 0.2,
    taxOnFeesLabel: "VAT on Etsy fees",
    listingFeeApprox: 0.17,
    offsiteCapApprox: 87,
    salesTaxField: false,
  },
  IT: {
    code: "IT",
    name: "Italy",
    currency: "EUR",
    processing: { pct: 0.04, fixed: 0.3 },
    regulatoryFee: 0.008,
    taxOnFeesDefault: 0.22,
    taxOnFeesLabel: "VAT on Etsy fees",
    listingFeeApprox: 0.17,
    offsiteCapApprox: 87,
    salesTaxField: false,
  },
  ES: {
    code: "ES",
    name: "Spain",
    currency: "EUR",
    processing: { pct: 0.04, fixed: 0.3 },
    regulatoryFee: 0.0088,
    taxOnFeesDefault: 0.21,
    taxOnFeesLabel: "VAT on Etsy fees",
    listingFeeApprox: 0.17,
    offsiteCapApprox: 87,
    salesTaxField: false,
  },
};
