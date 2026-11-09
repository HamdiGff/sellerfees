import { EBAY_UK, EBAY_US, type UkRegion } from "../data/ebay";
import { finish, pct, round2, tieredFee, type FeeLine, type FeeResult } from "./common";

export type EbayUsInput = {
  categoryId: string;
  itemPrice: number;
  shippingCharged: number;
  /** Sales tax rate on the order (eBay counts collected tax in the fee base). */
  salesTaxRate?: number;
  internationalBuyer?: boolean;
  belowStandard?: boolean;
  promotedRate?: number;
  itemCost?: number;
  shippingCost?: number;
};

export function ebayUsFees(input: EbayUsInput): FeeResult {
  const cat = EBAY_US.categories.find((c) => c.id === input.categoryId) ?? EBAY_US.categories[0];
  const price = Math.max(0, input.itemPrice || 0);
  const ship = Math.max(0, input.shippingCharged || 0);
  const taxRate = Math.max(0, input.salesTaxRate || 0);
  const gross = price + ship;
  const tax = gross * taxRate;
  const total = gross + tax;
  const lines: FeeLine[] = [];

  const fvf = tieredFee(cat, total, price);
  lines.push({ key: "fvf", label: "Final value fee", amount: fvf.fee, detail: `${fvf.detail}${tax > 0 ? " (total includes sales tax)" : ""}` });

  const noOrderFee = cat.noOrderFeeFrom !== undefined && price >= cat.noOrderFeeFrom;
  const of = EBAY_US.orderFee;
  const orderFee = price <= 0 || noOrderFee ? 0 : total <= of.smallOrderMax ? of.small : of.standard;
  lines.push({
    key: "orderFee",
    label: "Per-order fee",
    amount: orderFee,
    detail: noOrderFee ? "Not charged on athletic shoes at $150+" : `$${of.small.toFixed(2)} on orders of $10 or less, $${of.standard.toFixed(2)} above`,
  });

  if (input.belowStandard) {
    lines.push({ key: "belowStandard", label: "Below Standard surcharge", amount: round2(total * EBAY_US.belowStandardExtra), detail: `Extra ${pct(EBAY_US.belowStandardExtra)} of the total sale` });
  }
  if (input.internationalBuyer) {
    lines.push({ key: "international", label: "International fee", amount: round2(total * EBAY_US.internationalRate), detail: `${pct(EBAY_US.internationalRate)} of the total (not charged with eBay International Shipping)` });
  }
  if (input.promotedRate && input.promotedRate > 0) {
    lines.push({ key: "promoted", label: "Promoted Listings (general)", amount: round2(total * input.promotedRate), detail: `Your ad rate ${pct(input.promotedRate)} of the total sale` });
  }

  return finish("USD", gross, lines, input.itemCost || 0, input.shippingCost || 0);
}

export type EbayUkInput = {
  sellerType: "private" | "business";
  categoryId: string;
  itemPrice: number;
  shippingCharged: number;
  buyerRegion?: UkRegion;
  /** Business sellers who are not VAT-registered pay 20% VAT on eBay's fees. */
  vatOnFees?: boolean;
  belowStandard?: boolean;
  promotedRate?: number;
  itemCost?: number;
  shippingCost?: number;
};

export function ebayUkFees(input: EbayUkInput): FeeResult {
  const price = Math.max(0, input.itemPrice || 0);
  const ship = Math.max(0, input.shippingCharged || 0);
  const total = price + ship;
  const region = input.buyerRegion ?? "UK";
  const lines: FeeLine[] = [];

  if (input.sellerType === "private") {
    lines.push({ key: "fvf", label: "Final value fee", amount: 0, detail: "UK-based private sellers pay no final value fee (vehicles excepted)" });
    if (region !== "UK") {
      lines.push({
        key: "international",
        label: "International fee",
        amount: round2(total * EBAY_UK.privateSeller.internationalRate),
        detail: `${pct(EBAY_UK.privateSeller.internationalRate)} when the buyer is outside the UK`,
      });
    }
    if (input.promotedRate && input.promotedRate > 0) {
      lines.push({ key: "promoted", label: "Promoted Listings", amount: round2(total * input.promotedRate), detail: `Your ad rate ${pct(input.promotedRate)}` });
    }
    return finish("GBP", total, lines, input.itemCost || 0, input.shippingCost || 0);
  }

  const b = EBAY_UK.business;
  const cat = EBAY_UK.categories.find((c) => c.id === input.categoryId) ?? EBAY_UK.categories[0];
  const fvf = tieredFee(cat, total, price);
  lines.push({ key: "fvf", label: "Final value fee", amount: fvf.fee, detail: fvf.detail });
  lines.push({
    key: "orderFee",
    label: "Per-order fee",
    amount: price <= 0 ? 0 : total <= b.orderFee.smallOrderMax ? b.orderFee.small : b.orderFee.standard,
    detail: "£0.30 on orders of £10 or less, £0.40 above",
  });
  lines.push({ key: "regulatory", label: "Regulatory operating fee", amount: round2(total * b.regulatoryRate), detail: `${pct(b.regulatoryRate)} of the total sale` });

  if (region !== "UK") {
    const r = b.international[region];
    lines.push({ key: "international", label: "International fee", amount: round2(total * r), detail: `${pct(r)} for this buyer region (not charged with eBay International Shipping)` });
  }
  if (input.belowStandard) {
    lines.push({ key: "belowStandard", label: "Below Standard surcharge", amount: round2(total * b.belowStandardExtra), detail: `Extra ${pct(b.belowStandardExtra)} on the final value fee base` });
  }
  if (input.promotedRate && input.promotedRate > 0) {
    lines.push({ key: "promoted", label: "Promoted Listings", amount: round2(total * input.promotedRate), detail: `Your ad rate ${pct(input.promotedRate)}` });
  }
  if (input.vatOnFees ?? true) {
    const sum = lines.reduce((s, l) => s + l.amount, 0);
    lines.push({ key: "vat", label: "VAT on eBay fees", amount: round2(sum * b.vatRate), detail: "20% — skip if you are VAT-registered and reclaim it" });
  }

  return finish("GBP", total, lines, input.itemCost || 0, input.shippingCost || 0);
}
