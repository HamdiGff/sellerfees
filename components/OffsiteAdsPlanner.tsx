"use client";

import { useMemo, useState } from "react";
import { ETSY_COUNTRIES, type EtsyCountryCode } from "@/lib/data/etsy";
import { etsyFees } from "@/lib/engines/etsy";
import { money } from "@/lib/format";
import { MoneyField, Segmented, SelectField } from "./ui";

/**
 * Answers the question sellers actually have about Offsite Ads:
 * "Is an order that comes through an ad still worth having, and what does
 * the programme cost me a month?"
 */
export function OffsiteAdsPlanner() {
  const [country, setCountry] = useState<EtsyCountryCode>("US");
  const [order, setOrder] = useState(35);
  const [cost, setCost] = useState(12);
  const [orders, setOrders] = useState(40);
  const [share, setShare] = useState(15);
  const [rate, setRate] = useState<"15" | "12">("15");
  const c = ETSY_COUNTRIES[country];

  const r = useMemo(() => {
    const base = { country, itemPrice: order, shippingCharged: 0, itemCost: cost } as const;
    const plain = etsyFees({ ...base, offsiteAds: "none" });
    const ad = etsyFees({ ...base, offsiteAds: rate });
    const adOrders = Math.round((orders * share) / 100);
    const adFee = ad.totalFees - plain.totalFees;
    return { plain, ad, adOrders, monthly: adFee * adOrders, adFee };
  }, [country, order, cost, orders, share, rate]);

  const losing = r.ad.profit < 0;

  return (
    <div className="planner">
      <div className="planner-inputs">
        <SelectField
          id="oa-country"
          label="Shop country"
          value={country}
          onChange={(v) => setCountry(v as EtsyCountryCode)}
          options={Object.values(ETSY_COUNTRIES).map((x) => ({ value: x.code, label: x.name }))}
        />
        <div className="grid-2">
          <MoneyField id="oa-order" label="Typical order value" currency={c.currency} value={order} onChange={setOrder} />
          <MoneyField id="oa-cost" label="Your cost per order" currency={c.currency} value={cost} onChange={setCost} />
        </div>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="oa-orders">Orders a month</label>
            <input id="oa-orders" type="number" inputMode="numeric" min={0} value={orders} onChange={(e) => setOrders(Math.max(0, Math.floor(Number(e.target.value) || 0)))} />
          </div>
          <div className="field">
            <label htmlFor="oa-share">Share from Offsite Ads</label>
            <div className="input-wrap">
              <input id="oa-share" type="number" inputMode="numeric" min={0} max={100} value={share} onChange={(e) => setShare(Math.min(100, Math.max(0, Number(e.target.value) || 0)))} />
              <span className="affix affix-end" aria-hidden="true">%</span>
            </div>
          </div>
        </div>
        <Segmented
          name="oa-rate"
          label="Your Offsite Ads rate"
          value={rate}
          onChange={(v) => setRate(v as "15" | "12")}
          options={[
            { value: "15", label: "15% (under $10k a year)" },
            { value: "12", label: "12% ($10k+ a year)" },
          ]}
        />
        <p className="hint">Find the share in Shop Manager under Marketing, then Offsite Ads.</p>
      </div>

      <div className="planner-out" aria-live="polite">
        <div className="compare-pair">
          <div>
            <span className="pair-label">Normal order</span>
            <span className="pair-num">{money(r.plain.profit, c.currency)}</span>
            <span className="pair-sub">profit after {money(r.plain.totalFees, c.currency)} fees</span>
          </div>
          <div className={losing ? "neg" : ""}>
            <span className="pair-label">Order from an Offsite Ad</span>
            <span className="pair-num">{money(r.ad.profit, c.currency)}</span>
            <span className="pair-sub">profit after {money(r.ad.totalFees, c.currency)} fees</span>
          </div>
        </div>
        <p className="planner-verdict">
          {losing
            ? "At this price and cost, every order from an Offsite Ad loses you money. Shops under $10,000 a year can opt out. Otherwise, raise the price until ad orders break even."
            : `Ad orders still make money, just less: ${money(r.adFee, c.currency)} less each. About ${r.adOrders} of your ${orders} monthly orders come through ads, so the programme costs roughly ${money(r.monthly, c.currency)} a month.`}
        </p>
        <p className="hint">
          The real question is whether those {r.adOrders} buyers would have found you anyway. If most would, opting out (while you still can) keeps
          the money. If they're genuinely new customers, the fee is the price of reaching them.
        </p>
      </div>
    </div>
  );
}
