import { describe, expect, it } from "vitest";
import { etsyFees, etsyPriceFor } from "@/lib/engines/etsy";
import { ebayUkFees, ebayUsFees } from "@/lib/engines/ebay";
import { solvePrice } from "@/lib/engines/common";

describe("Etsy", () => {
  it("US $100 item, free shipping, no ads = $9.95 in fees", () => {
    const r = etsyFees({ country: "US", itemPrice: 100, shippingCharged: 0, offsiteAds: "none" });
    expect(r.totalFees).toBe(9.95);
    expect(r.payout).toBe(90.05);
  });

  it("US $30 sale through Offsite Ads at 15% = $7.80", () => {
    const r = etsyFees({ country: "US", itemPrice: 30, shippingCharged: 0, offsiteAds: "15" });
    expect(r.totalFees).toBe(7.8);
  });

  it("US sales tax raises processing but not the transaction fee", () => {
    const r = etsyFees({ country: "US", itemPrice: 93.5, shippingCharged: 0, salesTax: 7.48, offsiteAds: "none" });
    expect(r.lines.find((l) => l.key === "transaction")!.amount).toBe(6.08);
    expect(r.lines.find((l) => l.key === "processing")!.amount).toBe(3.28);
  });

  it("Offsite Ads fee is capped at $100", () => {
    const r = etsyFees({ country: "US", itemPrice: 2000, shippingCharged: 0, offsiteAds: "15" });
    expect(r.lines.find((l) => l.key === "offsite")!.amount).toBe(100);
  });

  it("UK £80 sale with 20% VAT on fees = £10.96", () => {
    const r = etsyFees({ country: "UK", itemPrice: 80, shippingCharged: 0, offsiteAds: "none", listingFee: 0.15 });
    expect(r.lines.find((l) => l.key === "regulatory")!.amount).toBe(0.38);
    expect(r.totalFees).toBe(10.96);
  });

  it("France uses the 1.14% regulatory fee", () => {
    const r = etsyFees({ country: "FR", itemPrice: 100, shippingCharged: 0, offsiteAds: "none", taxOnFees: 0 });
    expect(r.lines.find((l) => l.key === "regulatory")!.amount).toBe(1.14);
  });

  it("reverse mode finds a price that nets the target", () => {
    const base = { country: "US" as const, shippingCharged: 0, offsiteAds: "none" as const };
    const price = solvePrice(50, etsyPriceFor(50, base, "payout"))!;
    expect(etsyFees({ ...base, itemPrice: price }).payout).toBeGreaterThanOrEqual(50);
    expect(etsyFees({ ...base, itemPrice: price - 0.01 }).payout).toBeLessThan(50);
  });
});

describe("eBay US", () => {
  it("$100 + $8 shipping, most categories = $15.09", () => {
    expect(ebayUsFees({ categoryId: "most", itemPrice: 100, shippingCharged: 8 }).totalFees).toBe(15.09);
  });

  it("$50 + $8 shipping = $8.29", () => {
    expect(ebayUsFees({ categoryId: "most", itemPrice: 50, shippingCharged: 8 }).totalFees).toBe(8.29);
  });

  it("orders of $10 or less pay the $0.30 order fee", () => {
    const r = ebayUsFees({ categoryId: "most", itemPrice: 9, shippingCharged: 0 });
    expect(r.lines.find((l) => l.key === "orderFee")!.amount).toBe(0.3);
  });

  it("watches use marginal tiers", () => {
    expect(ebayUsFees({ categoryId: "watches", itemPrice: 2000, shippingCharged: 0 }).lines[0].amount).toBe(215);
  });

  it("athletic shoes at $150+ pay 8% and no order fee", () => {
    const r = ebayUsFees({ categoryId: "sneakers", itemPrice: 200, shippingCharged: 0 });
    expect(r.totalFees).toBe(16);
  });

  it("handbags over $2,000 pay 9% on the whole sale", () => {
    expect(ebayUsFees({ categoryId: "handbags", itemPrice: 3000, shippingCharged: 0 }).lines[0].amount).toBe(270);
  });
});

describe("eBay UK", () => {
  it("private sellers pay nothing on a UK sale", () => {
    expect(ebayUkFees({ sellerType: "private", categoryId: "clothes", itemPrice: 40, shippingCharged: 3 }).totalFees).toBe(0);
  });

  it("business seller, £100 clothing, with VAT = £15.18", () => {
    const r = ebayUkFees({ sellerType: "business", categoryId: "clothes", itemPrice: 100, shippingCharged: 0 });
    expect(r.totalFees).toBe(15.18);
  });

  it("trainers at £100+ drop to 7%", () => {
    const r = ebayUkFees({ sellerType: "business", categoryId: "trainers", itemPrice: 120, shippingCharged: 0, vatOnFees: false });
    expect(r.lines[0].amount).toBe(8.4);
  });
});
