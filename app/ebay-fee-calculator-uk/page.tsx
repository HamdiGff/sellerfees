import { EbayUkCalculator } from "@/components/EbayCalculators";
import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose, Related, Sources, toolLd } from "@/components/Shell";
import { EBAY_UK } from "@/lib/data/ebay";
import { page } from "@/lib/registry";
import { abs, formatDate } from "@/lib/site";

const PATH = "/ebay-fee-calculator-uk/";
export const metadata = metaFor(PATH);

const f = (r: number) => `${Number((r * 100).toFixed(2))}%`;
function ukRate(c: (typeof EBAY_UK.categories)[number]) {
  const t = c.tiers;
  if (t.length === 1) return f(t[0].rate);
  if (c.thresholdOnItem) return `${f(t[0].rate)}, or ${f(t[1].rate)} at £100+`;
  return t.map((x, i) => (Number.isFinite(x.upTo) ? `${f(x.rate)} up to £${x.upTo.toLocaleString("en-GB")}` : `${f(x.rate)} above £${t[i - 1].upTo.toLocaleString("en-GB")}`)).join("; ");
}

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={toolLd(p)} />
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <span className="updated">Fees checked {formatDate(EBAY_UK.verifiedOn)}</span>
      <h1>eBay UK fee calculator</h1>
      <p className="lede">
        On eBay.co.uk the first question isn't the category, it's who you're selling as. A private seller clearing out a wardrobe pays nothing
        on a UK sale. A business seller pays a category rate, a per-order fee, a regulatory fee and usually VAT on all of it. Switch between the
        two below.
      </p>

      <EbayUkCalculator />

      <Prose>
        <h2>Private sellers: £0 on UK sales</h2>
        <p>
          Since 1 October 2024, UK-based private sellers pay no final value fee and no regulatory operating fee, in every category except
          vehicles. You also get {EBAY_UK.privateSeller.freeListings} free listings a month, then {EBAY_UK.privateSeller.insertionFee * 100}p
          each. The buyer pays a Buyer Protection fee at checkout, and it never comes out of your payout.
        </p>
        <p>
          You only pay for optional listing upgrades, Promoted Listings if you use them, and an international fee of about{" "}
          {f(EBAY_UK.privateSeller.internationalRate)} when the item goes to a buyer outside the UK.
        </p>
        <div className="callout">
          <p>
            "Private" is about what you're doing, not what you tick. Buying stock to resell, or making things to sell, is trading, and eBay can
            ask you to switch to a business account. HMRC also counts it towards your trading income.
          </p>
        </div>

        <h2>Business sellers: a £30 jumper with £3.50 postage</h2>
        <div className="worked">
          <ol>
            <li>Total sale: £33.50</li>
            <li>Final value fee, Clothes, Shoes &amp; Accessories: 11.9% × £33.50 = £3.99</li>
            <li>Per-order fee: £0.40</li>
            <li>Regulatory operating fee: 0.35% × £33.50 = £0.12</li>
            <li>VAT at 20% on the above: £0.90</li>
          </ol>
          <p>
            Fees <strong>£5.41</strong> (16.1%), take-home <strong>£28.09</strong>. eBay's fee tables are shown without VAT, so if you're not
            VAT-registered the real cost is about a fifth higher than the headline rate.
          </p>
        </div>

        <h2>Business seller rates by category</h2>
        <p>
          Plus £0.30 per order up to £10 and £0.40 above, and 0.35% regulatory operating fee on every sale. Tiered categories charge the lower
          rate only on the part of the sale above the threshold, except trainers, where the whole sale drops to 7% at £100 or more.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Final value fee (excl. VAT)</th>
              </tr>
            </thead>
            <tbody>
              {EBAY_UK.categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{ukRate(c)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Selling abroad as a business</h2>
        <p>
          When the buyer is outside the UK, business sellers pay an international fee on the total: {f(EBAY_UK.business.international.EU)} for
          Eurozone and Northern Europe, {f(EBAY_UK.business.international.USCA)} for the US and Canada and {f(EBAY_UK.business.international.OTHER)}{" "}
          elsewhere. Eligible listings sent through eBay International Shipping don't pay it.
        </p>

        <h2>Below Standard costs a lot</h2>
        <p>
          If your seller level is Below Standard on the 20th of the month, the next month's sales pay an extra 6 percentage points on the final
          value fee. From 1 July 2026, sellers who stay Below Standard for four or more months in a row pay 7 points. On clothing that takes the
          rate from 11.9% to 17.9% or more, before VAT.
        </p>

        <p>
          Comparing with Etsy? The <a href={abs("/etsy-fee-calculator-uk/")}>UK Etsy calculator</a> uses the same layout, and{" "}
          <a href={abs("/etsy-vs-ebay-fees/")}>Etsy vs eBay</a> puts them side by side.
        </p>
      </Prose>

      <Sources items={EBAY_UK.sources} verifiedOn={EBAY_UK.verifiedOn} />
      <Related paths={p.related} />
    </>
  );
}
