import type { EbayCategory } from "../data/ebay";

export type FeeLine = {
  key: string;
  label: string;
  amount: number;
  /** How the amount was worked out, shown under the line. */
  detail: string;
};

export type FeeResult = {
  currency: string;
  /** Money the buyer pays that the seller is credited with (item + shipping). */
  gross: number;
  lines: FeeLine[];
  totalFees: number;
  /** gross - totalFees */
  payout: number;
  /** payout - your item cost - your shipping cost */
  profit: number;
  /** totalFees / gross */
  feeShare: number;
  margin: number;
};

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export const pct = (rate: number, digits = 2) => {
  const v = rate * 100;
  return `${Number(v.toFixed(digits))}%`;
};

export function finish(currency: string, gross: number, lines: FeeLine[], itemCost: number, shippingCost: number): FeeResult {
  const kept = lines.filter((l) => l.amount !== 0 || l.key === "fvf" || l.key === "transaction");
  const totalFees = round2(kept.reduce((s, l) => s + l.amount, 0));
  const payout = round2(gross - totalFees);
  const profit = round2(payout - itemCost - shippingCost);
  return {
    currency,
    gross: round2(gross),
    lines: kept,
    totalFees,
    payout,
    profit,
    feeShare: gross > 0 ? totalFees / gross : 0,
    margin: gross > 0 ? profit / gross : 0,
  };
}

/** Final value fee for one item under a category's tier rules. */
export function tieredFee(category: EbayCategory, total: number, itemPrice: number): { fee: number; detail: string } {
  if (total <= 0) return { fee: 0, detail: "No sale amount yet" };
  const thresholdBase = category.thresholdOnItem ? itemPrice : total;

  if (category.mode === "whole") {
    const tier = category.tiers.find((t) => thresholdBase <= t.upTo) ?? category.tiers[category.tiers.length - 1];
    return { fee: round2(total * tier.rate), detail: `${pct(tier.rate)} of ${total.toFixed(2)}` };
  }

  let remaining = total;
  let lower = 0;
  let fee = 0;
  const parts: string[] = [];
  for (const t of category.tiers) {
    if (remaining <= 0) break;
    const band = Math.min(remaining, t.upTo - lower);
    fee += band * t.rate;
    parts.push(`${pct(t.rate)} of ${band.toFixed(2)}`);
    remaining -= band;
    lower = t.upTo;
  }
  return { fee: round2(fee), detail: parts.join(" + ") };
}

/**
 * Find the item price that gives a target payout or profit.
 * Fees only ever take a fraction of each extra unit of price, so the
 * result is monotonic and a bisection is safe.
 */
export function solvePrice(target: number, evaluate: (price: number) => number, max = 1_000_000): number | null {
  if (!Number.isFinite(target)) return null;
  let lo = 0;
  let hi = max;
  if (evaluate(hi) < target) return null;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (evaluate(mid) >= target) hi = mid;
    else lo = mid;
  }
  // Round up to the next cent so the target is actually reached.
  return Math.ceil(hi * 100 - 1e-6) / 100;
}
