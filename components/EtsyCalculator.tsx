"use client";

import { useCallback, useMemo } from "react";
import { ETSY, ETSY_COUNTRIES, type EtsyCountryCode } from "@/lib/data/etsy";
import { etsyFees, type EtsyInput } from "@/lib/engines/etsy";
import { formatDate } from "@/lib/site";
import { Receipt } from "./Receipt";
import { ReversePanel } from "./ReversePanel";
import { Check, MoneyField, Segmented, SelectField, useUrlState } from "./ui";

export function EtsyCalculator({ defaultCountry = "US" }: { defaultCountry?: EtsyCountryCode }) {
  const [s, set] = useUrlState({
    country: defaultCountry as string,
    price: 25,
    ship: 0,
    tax: 0,
    ads: "none",
    intl: false,
    registered: false,
    cost: 0,
    shipCost: 0,
  });

  const country = (ETSY_COUNTRIES[s.country as EtsyCountryCode] ? s.country : defaultCountry) as EtsyCountryCode;
  const c = ETSY_COUNTRIES[country];

  const base = useMemo<Omit<EtsyInput, "itemPrice">>(
    () => ({
      country,
      shippingCharged: s.ship,
      salesTax: s.tax,
      offsiteAds: s.ads as EtsyInput["offsiteAds"],
      internationalBuyer: s.intl,
      taxOnFees: s.registered ? 0 : c.taxOnFeesDefault,
      itemCost: s.cost,
      shippingCost: s.shipCost,
    }),
    [country, s.ship, s.tax, s.ads, s.intl, s.registered, s.cost, s.shipCost, c.taxOnFeesDefault],
  );

  const result = useMemo(() => etsyFees({ ...base, itemPrice: s.price }), [base, s.price]);
  const evaluate = useCallback(
    (mode: "payout" | "profit") => (p: number) => {
      const r = etsyFees({ ...base, itemPrice: p });
      return mode === "payout" ? r.payout : r.profit;
    },
    [base],
  );

  return (
    <div className="calc">
      <form className="calc-inputs" onSubmit={(e) => e.preventDefault()}>
        <SelectField
          id="etsy-country"
          label="Where your shop's bank account is"
          value={country}
          onChange={(v) => set({ country: v })}
          options={Object.values(ETSY_COUNTRIES).map((x) => ({ value: x.code, label: `${x.name} (${x.currency})` }))}
        />
        <div className="grid-2">
          <MoneyField id="etsy-price" label="Item price" currency={c.currency} value={s.price} onChange={(n) => set({ price: n })} />
          <MoneyField id="etsy-ship" label="Shipping you charge" currency={c.currency} value={s.ship} onChange={(n) => set({ ship: n })} />
        </div>
        {c.salesTaxField ? (
          <MoneyField
            id="etsy-tax"
            label="Sales tax Etsy collects (optional)"
            currency={c.currency}
            value={s.tax}
            onChange={(n) => set({ tax: n })}
            hint="Not part of the 6.5% fee, but Etsy charges processing on it."
          />
        ) : null}
        <Segmented
          name="etsy-ads"
          label="Did the sale come from an Offsite Ad?"
          value={s.ads}
          onChange={(v) => set({ ads: v })}
          options={[
            { value: "none", label: "No" },
            { value: "15", label: "Yes, 15%" },
            { value: "12", label: "Yes, 12%" },
          ]}
        />
        <p className="hint tight">15% for shops under $10,000 a year in sales, 12% after that. Capped at $100 per order.</p>
        {c.processingInternational ? (
          <Check id="etsy-intl" label="Buyer is outside your domestic zone" checked={s.intl} onChange={(b) => set({ intl: b })} hint={`(processing rises to ${c.processingInternational.pct * 100}%)`} />
        ) : null}
        {c.taxOnFeesDefault > 0 ? (
          <Check
            id="etsy-registered"
            label={`I'm ${c.currency === "AUD" || c.currency === "CAD" ? "GST" : "VAT"}-registered`}
            checked={s.registered}
            onChange={(b) => set({ registered: b })}
            hint={`(unticked adds ${Math.round(c.taxOnFeesDefault * 100)}% on Etsy's fees)`}
          />
        ) : null}
        <details className="costs">
          <summary>Add your own costs for real profit</summary>
          <div className="grid-2">
            <MoneyField id="etsy-cost" label="What the item cost you" currency={c.currency} value={s.cost} onChange={(n) => set({ cost: n })} />
            <MoneyField id="etsy-shipcost" label="What postage costs you" currency={c.currency} value={s.shipCost} onChange={(n) => set({ shipCost: n })} />
          </div>
        </details>
        {c.note ? <p className="note">{c.note}</p> : null}
      </form>

      <div className="calc-output">
        <Receipt result={result} title={`Etsy · ${c.name}`} verifiedOn={formatDate(ETSY.verifiedOn)} />
        <ReversePanel currency={c.currency} evaluate={evaluate} onUse={(p) => set({ price: p })} />
      </div>
    </div>
  );
}

