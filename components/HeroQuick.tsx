"use client";

import { useMemo, useState } from "react";
import { etsyFees } from "@/lib/engines/etsy";
import { ebayUkFees, ebayUsFees } from "@/lib/engines/ebay";
import type { FeeResult } from "@/lib/engines/common";
import { abs } from "@/lib/site";
import { money, SYMBOL } from "./ui";

type Option = { id: string; label: string; currency: string; path: string; run: (price: number) => FeeResult };

const OPTIONS: Option[] = [
  { id: "etsy-us", label: "Etsy US", currency: "USD", path: "/etsy-fee-calculator/", run: (p) => etsyFees({ country: "US", itemPrice: p, shippingCharged: 0, offsiteAds: "none" }) },
  { id: "etsy-uk", label: "Etsy UK", currency: "GBP", path: "/etsy-fee-calculator-uk/", run: (p) => etsyFees({ country: "UK", itemPrice: p, shippingCharged: 0, offsiteAds: "none" }) },
  { id: "ebay-us", label: "eBay.com", currency: "USD", path: "/ebay-fee-calculator/", run: (p) => ebayUsFees({ categoryId: "most", itemPrice: p, shippingCharged: 0 }) },
  {
    id: "ebay-uk-biz",
    label: "eBay UK (business)",
    currency: "GBP",
    path: "/ebay-fee-calculator-uk/",
    run: (p) => ebayUkFees({ sellerType: "business", categoryId: "everything", itemPrice: p, shippingCharged: 0 }),
  },
  {
    id: "ebay-uk-private",
    label: "eBay UK (private)",
    currency: "GBP",
    path: "/ebay-fee-calculator-uk/",
    run: (p) => ebayUkFees({ sellerType: "private", categoryId: "everything", itemPrice: p, shippingCharged: 0 }),
  },
];

export function HeroQuick() {
  const [platform, setPlatform] = useState("etsy-us");
  const [price, setPrice] = useState(25);
  const opt = OPTIONS.find((o) => o.id === platform)!;
  const r = useMemo(() => opt.run(price), [opt, price]);
  const link = `${abs(opt.path)}?price=${price}${opt.id === "ebay-uk-biz" ? "&seller=business&cat=everything" : ""}`;

  return (
    <div className="quick">
      <p className="quick-sentence">
        <label htmlFor="q-price">Sell it for</label>
        <span className="quick-price">
          <span aria-hidden="true">{SYMBOL[opt.currency]}</span>
          <input
            id="q-price"
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </span>
        <label htmlFor="q-platform">on</label>
        <select id="q-platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          {OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </p>
      <p className="quick-result" aria-live="polite">
        and you keep <span className="quick-keep">{money(r.payout, opt.currency)}</span>
      </p>
      <ul className="quick-lines" aria-label="Fees taken">
        {r.lines
          .filter((l) => l.amount > 0)
          .map((l) => (
            <li key={l.key}>
              <span>{l.label}</span>
              <span className="minus">−{money(l.amount, opt.currency)}</span>
            </li>
          ))}
        {r.totalFees === 0 ? <li className="zero">No selling fees on a UK sale</li> : null}
      </ul>
      <a className="quick-more" href={link}>
        Add shipping, ads and your costs
      </a>
    </div>
  );
}
