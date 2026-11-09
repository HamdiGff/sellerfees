"use client";

import { useCallback, useMemo } from "react";
import { EBAY_UK, EBAY_US, type UkRegion } from "@/lib/data/ebay";
import { ebayUkFees, ebayUsFees, type EbayUkInput, type EbayUsInput } from "@/lib/engines/ebay";
import { formatDate } from "@/lib/site";
import { Receipt } from "./Receipt";
import { ReversePanel } from "./ReversePanel";
import { Check, MoneyField, PercentField, Segmented, SelectField, useUrlState } from "./ui";

export function EbayUsCalculator() {
  const [s, set] = useUrlState({ cat: "most", price: 40, ship: 0, taxRate: 0, intl: false, below: false, promo: 0, cost: 0, shipCost: 0 });

  const base = useMemo<Omit<EbayUsInput, "itemPrice">>(
    () => ({
      categoryId: s.cat,
      shippingCharged: s.ship,
      salesTaxRate: s.taxRate,
      internationalBuyer: s.intl,
      belowStandard: s.below,
      promotedRate: s.promo,
      itemCost: s.cost,
      shippingCost: s.shipCost,
    }),
    [s.cat, s.ship, s.taxRate, s.intl, s.below, s.promo, s.cost, s.shipCost],
  );
  const result = useMemo(() => ebayUsFees({ ...base, itemPrice: s.price }), [base, s.price]);
  const evaluate = useCallback(
    (mode: "payout" | "profit") => (p: number) => {
      const r = ebayUsFees({ ...base, itemPrice: p });
      return mode === "payout" ? r.payout : r.profit;
    },
    [base],
  );

  return (
    <div className="calc">
      <form className="calc-inputs" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="ebay-cat" label="Category" value={s.cat} onChange={(v) => set({ cat: v })} options={EBAY_US.categories.map((c) => ({ value: c.id, label: c.name }))} />
        <div className="grid-2">
          <MoneyField id="ebay-price" label="Sold price" currency="USD" value={s.price} onChange={(n) => set({ price: n })} />
          <MoneyField id="ebay-ship" label="Shipping the buyer pays" currency="USD" value={s.ship} onChange={(n) => set({ ship: n })} />
        </div>
        <PercentField
          id="ebay-tax"
          label="Buyer's sales tax rate (optional)"
          value={s.taxRate}
          onChange={(n) => set({ taxRate: n })}
          hint="eBay collects the tax, but its fee is charged on the total including tax."
        />
        <PercentField id="ebay-promo" label="Promoted Listings ad rate" value={s.promo} onChange={(n) => set({ promo: n })} hint="Leave at 0 if the listing isn't promoted." max={100} />
        <Check id="ebay-intl" label="Buyer is outside the US" checked={s.intl} onChange={(b) => set({ intl: b })} hint="(+1.65%, unless you use eBay International Shipping)" />
        <Check id="ebay-below" label="My account is Below Standard" checked={s.below} onChange={(b) => set({ below: b })} hint="(+6%)" />
        <details className="costs">
          <summary>Add your own costs for real profit</summary>
          <div className="grid-2">
            <MoneyField id="ebay-cost" label="What the item cost you" currency="USD" value={s.cost} onChange={(n) => set({ cost: n })} />
            <MoneyField id="ebay-shipcost" label="Your shipping label" currency="USD" value={s.shipCost} onChange={(n) => set({ shipCost: n })} />
          </div>
        </details>
        <p className="note">Rates are for sellers without an eBay Store. Store subscribers pay lower rates in most categories.</p>
      </form>
      <div className="calc-output">
        <Receipt result={result} title="eBay.com · no Store" verifiedOn={formatDate(EBAY_US.verifiedOn)} />
        <ReversePanel currency="USD" evaluate={evaluate} onUse={(p) => set({ price: p })} />
      </div>
    </div>
  );
}

export function EbayUkCalculator() {
  const [s, set] = useUrlState({
    seller: "private",
    cat: "clothes",
    price: 30,
    ship: 0,
    region: "UK",
    vatReg: false,
    below: false,
    promo: 0,
    cost: 0,
    shipCost: 0,
  });

  const base = useMemo<Omit<EbayUkInput, "itemPrice">>(
    () => ({
      sellerType: s.seller as EbayUkInput["sellerType"],
      categoryId: s.cat,
      shippingCharged: s.ship,
      buyerRegion: s.region as UkRegion,
      vatOnFees: !s.vatReg,
      belowStandard: s.below,
      promotedRate: s.promo,
      itemCost: s.cost,
      shippingCost: s.shipCost,
    }),
    [s.seller, s.cat, s.ship, s.region, s.vatReg, s.below, s.promo, s.cost, s.shipCost],
  );
  const result = useMemo(() => ebayUkFees({ ...base, itemPrice: s.price }), [base, s.price]);
  const evaluate = useCallback(
    (mode: "payout" | "profit") => (p: number) => {
      const r = ebayUkFees({ ...base, itemPrice: p });
      return mode === "payout" ? r.payout : r.profit;
    },
    [base],
  );
  const business = s.seller === "business";

  return (
    <div className="calc">
      <form className="calc-inputs" onSubmit={(e) => e.preventDefault()}>
        <Segmented
          name="uk-seller"
          label="How you sell on eBay.co.uk"
          value={s.seller}
          onChange={(v) => set({ seller: v })}
          options={[
            { value: "private", label: "Private seller" },
            { value: "business", label: "Business seller" },
          ]}
        />
        {business ? (
          <SelectField id="uk-cat" label="Category" value={s.cat} onChange={(v) => set({ cat: v })} options={EBAY_UK.categories.map((c) => ({ value: c.id, label: c.name }))} />
        ) : null}
        <div className="grid-2">
          <MoneyField id="uk-price" label="Sold price" currency="GBP" value={s.price} onChange={(n) => set({ price: n })} />
          <MoneyField id="uk-ship" label="Postage the buyer pays" currency="GBP" value={s.ship} onChange={(n) => set({ ship: n })} />
        </div>
        <SelectField
          id="uk-region"
          label="Where the buyer is"
          value={s.region}
          onChange={(v) => set({ region: v })}
          options={[
            { value: "UK", label: "United Kingdom" },
            { value: "EU", label: "Eurozone or Northern Europe" },
            { value: "USCA", label: "US or Canada" },
            { value: "OTHER", label: "Anywhere else" },
          ]}
          hint={business ? "International fees don't apply if you ship through eBay International Shipping." : "Private sellers pay 3% when the buyer is abroad."}
        />
        <PercentField id="uk-promo" label="Promoted Listings ad rate" value={s.promo} onChange={(n) => set({ promo: n })} hint="Leave at 0 if the listing isn't promoted." />
        {business ? (
          <>
            <Check id="uk-vat" label="I'm VAT-registered" checked={s.vatReg} onChange={(b) => set({ vatReg: b })} hint="(unticked adds 20% VAT on eBay's fees)" />
            <Check id="uk-below" label="My account is Below Standard" checked={s.below} onChange={(b) => set({ below: b })} hint="(+6 points)" />
          </>
        ) : null}
        <details className="costs">
          <summary>Add your own costs for real profit</summary>
          <div className="grid-2">
            <MoneyField id="uk-cost" label="What the item cost you" currency="GBP" value={s.cost} onChange={(n) => set({ cost: n })} />
            <MoneyField id="uk-shipcost" label="Your postage cost" currency="GBP" value={s.shipCost} onChange={(n) => set({ shipCost: n })} />
          </div>
        </details>
      </form>
      <div className="calc-output">
        <Receipt result={result} title={`eBay.co.uk · ${business ? "business" : "private"} seller`} verifiedOn={formatDate(EBAY_UK.verifiedOn)} />
        <ReversePanel currency="GBP" evaluate={evaluate} onUse={(p) => set({ price: p })} />
      </div>
    </div>
  );
}
