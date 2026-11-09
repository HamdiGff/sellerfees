"use client";

import { useMemo } from "react";
import { EBAY_UK, EBAY_US } from "@/lib/data/ebay";
import { etsyFees } from "@/lib/engines/etsy";
import { ebayUkFees, ebayUsFees } from "@/lib/engines/ebay";
import { money, MoneyField, Segmented, SelectField, ShareButton, useUrlState } from "./ui";

export function TwitchBitsCalculator() {
  const [s, set] = useUrlState({ bits: 1000, goal: 50 });
  const usd = s.bits * 0.01;
  const bitsForGoal = Math.ceil(s.goal / 0.01);
  return (
    <div className="calc calc-narrow">
      <div className="bits-box">
        <div className="field">
          <label htmlFor="bits">Bits cheered</label>
          <input id="bits" type="number" inputMode="numeric" min={0} step={100} value={s.bits} onChange={(e) => set({ bits: Math.max(0, Math.floor(Number(e.target.value) || 0)) })} />
        </div>
        <p className="bits-answer">
          <span className="num big">{money(usd, "USD")}</span>
          <span>goes to the streamer</span>
        </p>
        <div className="chips">
          {[100, 500, 1000, 5000, 10000, 25000].map((b) => (
            <button key={b} type="button" className={s.bits === b ? "chip on" : "chip"} onClick={() => set({ bits: b })}>
              {b.toLocaleString("en-US")}
            </button>
          ))}
        </div>
      </div>
      <div className="bits-box alt">
        <MoneyField id="goal" label="Your goal in dollars" currency="USD" value={s.goal} onChange={(n) => set({ goal: n })} />
        <p className="bits-answer">
          <span className="num big">{bitsForGoal.toLocaleString("en-US")}</span>
          <span>Bits needed</span>
        </p>
      </div>
      <div className="receipt-foot">
        <ShareButton />
      </div>
    </div>
  );
}

export function CompareCalculator() {
  const [s, set] = useUrlState({ market: "US", price: 40, ship: 5, cost: 10, usCat: "most", ukCat: "clothes" });
  const isUS = s.market === "US";

  const rows = useMemo(() => {
    const common = { itemPrice: s.price, shippingCharged: s.ship, itemCost: s.cost, shippingCost: 0 };
    if (isUS) {
      return [
        { name: "Etsy (US shop)", r: etsyFees({ ...common, country: "US", offsiteAds: "none" }) },
        { name: "Etsy via Offsite Ad (15%)", r: etsyFees({ ...common, country: "US", offsiteAds: "15" }) },
        { name: "eBay.com (no Store)", r: ebayUsFees({ ...common, categoryId: s.usCat }) },
      ];
    }
    return [
      { name: "Etsy (UK shop, not VAT-registered)", r: etsyFees({ ...common, country: "UK", offsiteAds: "none" }) },
      { name: "eBay.co.uk private seller", r: ebayUkFees({ ...common, sellerType: "private", categoryId: s.ukCat }) },
      { name: "eBay.co.uk business seller", r: ebayUkFees({ ...common, sellerType: "business", categoryId: s.ukCat }) },
    ];
  }, [isUS, s.price, s.ship, s.cost, s.usCat, s.ukCat]);

  const cur = isUS ? "USD" : "GBP";
  const best = Math.max(...rows.map((x) => x.r.payout));

  return (
    <div className="calc">
      <form className="calc-inputs" onSubmit={(e) => e.preventDefault()}>
        <Segmented
          name="cmp-market"
          label="Where you sell from"
          value={s.market}
          onChange={(v) => set({ market: v })}
          options={[
            { value: "US", label: "United States" },
            { value: "UK", label: "United Kingdom" },
          ]}
        />
        <div className="grid-2">
          <MoneyField id="cmp-price" label="Item price" currency={cur} value={s.price} onChange={(n) => set({ price: n })} />
          <MoneyField id="cmp-ship" label="Shipping charged" currency={cur} value={s.ship} onChange={(n) => set({ ship: n })} />
        </div>
        <MoneyField id="cmp-cost" label="What the item cost you" currency={cur} value={s.cost} onChange={(n) => set({ cost: n })} />
        {isUS ? (
          <SelectField id="cmp-uscat" label="eBay category" value={s.usCat} onChange={(v) => set({ usCat: v })} options={EBAY_US.categories.map((c) => ({ value: c.id, label: c.name }))} />
        ) : (
          <SelectField id="cmp-ukcat" label="eBay category (business sellers)" value={s.ukCat} onChange={(v) => set({ ukCat: v })} options={EBAY_UK.categories.map((c) => ({ value: c.id, label: c.name }))} />
        )}
      </form>
      <div className="calc-output">
        <section className="compare" aria-live="polite">
          {rows.map(({ name, r }) => (
            <div key={name} className={`compare-row ${r.payout === best ? "best" : ""}`}>
              <div className="compare-name">
                {name}
                {r.payout === best ? <span className="badge">keeps the most</span> : null}
              </div>
              <div className="compare-bar" aria-hidden="true">
                <span style={{ width: `${Math.max(0, Math.min(100, (1 - r.feeShare) * 100))}%` }} />
              </div>
              <div className="compare-nums">
                <span>
                  Fees <b className="num">{money(r.totalFees, cur)}</b> ({(r.feeShare * 100).toFixed(1)}%)
                </span>
                <span>
                  Take home <b className="num">{money(r.payout, cur)}</b>
                </span>
                <span>
                  Profit <b className="num">{money(r.profit, cur)}</b>
                </span>
              </div>
            </div>
          ))}
          <p className="hint">Shipping label costs are left out here because they are the same wherever you sell. Listing fees and VAT are included where they apply.</p>
          <div className="receipt-foot">
            <ShareButton />
          </div>
        </section>
      </div>
    </div>
  );
}
