import { ETSY, ETSY_COUNTRIES, type EtsyCountryCode } from "../data/etsy";
import { finish, pct, round2, type FeeLine, type FeeResult } from "./common";

export type EtsyInput = {
  country: EtsyCountryCode;
  itemPrice: number;
  shippingCharged: number;
  /** US only: sales tax Etsy collects. Raises processing, not the transaction fee. */
  salesTax?: number;
  /** "none", "15" (shops under $10k/yr) or "12" (shops that passed $10k). */
  offsiteAds: "none" | "15" | "12";
  /** CA/AU: buyer outside the domestic zone pays a higher processing rate. */
  internationalBuyer?: boolean;
  listingFee?: number;
  /** Tax rate added to Etsy's fees. Pass 0 if you are VAT/GST registered. */
  taxOnFees?: number;
  itemCost?: number;
  shippingCost?: number;
};

export function etsyFees(input: EtsyInput): FeeResult {
  const c = ETSY_COUNTRIES[input.country];
  const price = Math.max(0, input.itemPrice || 0);
  const ship = Math.max(0, input.shippingCharged || 0);
  const tax = c.salesTaxField ? Math.max(0, input.salesTax || 0) : 0;
  const orderTotal = price + ship;
  const proc = input.internationalBuyer && c.processingInternational ? c.processingInternational : c.processing;
  const listing = input.listingFee ?? c.listingFeeApprox;
  const taxRate = input.taxOnFees ?? c.taxOnFeesDefault;
  const cur = c.currency;
  const lines: FeeLine[] = [];

  lines.push({ key: "listing", label: "Listing fee", amount: round2(listing), detail: `$0.20 USD per listing${cur === "USD" ? "" : `, about ${listing.toFixed(2)} ${cur} at today's rate`}` });

  lines.push({
    key: "transaction",
    label: "Transaction fee",
    amount: round2(orderTotal * ETSY.transactionRate),
    detail: `${pct(ETSY.transactionRate)} of item + shipping (${orderTotal.toFixed(2)})`,
  });

  const procBase = orderTotal + tax;
  lines.push({
    key: "processing",
    label: "Payment processing",
    amount: price > 0 ? round2(procBase * proc.pct + proc.fixed) : 0,
    detail: `${pct(proc.pct)} of ${procBase.toFixed(2)}${tax > 0 ? " (incl. sales tax)" : ""} + ${proc.fixed.toFixed(2)} ${cur}`,
  });

  if (c.regulatoryFee > 0) {
    lines.push({
      key: "regulatory",
      label: "Regulatory Operating Fee",
      amount: round2(orderTotal * c.regulatoryFee),
      detail: `${pct(c.regulatoryFee)} of item + shipping (${c.name} shops)`,
    });
  }

  if (input.offsiteAds !== "none") {
    const rate = input.offsiteAds === "15" ? ETSY.offsiteAds.standard : ETSY.offsiteAds.highVolume;
    const raw = orderTotal * rate;
    const capped = Math.min(raw, c.offsiteCapApprox);
    lines.push({
      key: "offsite",
      label: "Offsite Ads fee",
      amount: round2(capped),
      detail: `${pct(rate)} of order total${raw > c.offsiteCapApprox ? `, capped at $100 USD (~${c.offsiteCapApprox} ${cur})` : ""}`,
    });
  }

  if (taxRate > 0) {
    const feeSum = lines.reduce((s, l) => s + l.amount, 0);
    lines.push({
      key: "taxOnFees",
      label: c.taxOnFeesLabel,
      amount: round2(feeSum * taxRate),
      detail: `${pct(taxRate)} on the fees above (skip this if you are registered)`,
    });
  }

  return finish(cur, orderTotal, lines, input.itemCost || 0, input.shippingCost || 0);
}

export function etsyPriceFor(target: number, base: Omit<EtsyInput, "itemPrice">, mode: "payout" | "profit") {
  return (p: number) => {
    const r = etsyFees({ ...base, itemPrice: p });
    return mode === "payout" ? r.payout : r.profit;
  };
}
