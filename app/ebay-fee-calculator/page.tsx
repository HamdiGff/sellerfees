import { EbayUsCalculator } from "@/components/EbayCalculators";
import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose, Related, Sources, toolLd } from "@/components/Shell";
import { EBAY_US } from "@/lib/data/ebay";
import { page } from "@/lib/registry";
import { abs, formatDate } from "@/lib/site";

const PATH = "/ebay-fee-calculator/";
export const metadata = metaFor(PATH);

function rateText(c: (typeof EBAY_US.categories)[number]) {
  const t = c.tiers;
  const f = (r: number) => `${Number((r * 100).toFixed(2))}%`;
  if (t.length === 1) return f(t[0].rate);
  if (c.mode === "whole") {
    return c.thresholdOnItem
      ? `${f(t[0].rate)} under $150; ${f(t[1].rate)} at $150+`
      : `${f(t[0].rate)} if ${t[0].upTo.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} or less; ${f(t[1].rate)} above (on the whole sale)`;
  }
  return t
    .map((x, i) => (Number.isFinite(x.upTo) ? `${f(x.rate)} up to $${x.upTo.toLocaleString("en-US")}` : `${f(x.rate)} above $${t[i - 1].upTo.toLocaleString("en-US")}`))
    .join("; ");
}

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={toolLd(p)} />
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <span className="updated">Fees checked {formatDate(EBAY_US.verifiedOn)}</span>
      <h1>eBay Fee Calculator</h1>
      <p className="lede">
        For eBay.com sellers without a Store. Pick the category, enter the sold price and shipping, and see the final value fee, the per-order
        fee and anything else that applies. The fee is charged on more than just your item price, and the calculator shows exactly what it's
        charged on.
      </p>

      <EbayUsCalculator />

      <Prose>
        <h2>The base is bigger than you think</h2>
        <p>
          eBay charges its final value fee on the <strong>total amount of the sale</strong>: item price, shipping the buyer pays, handling, and
          the sales tax eBay collects. The tax part surprises people. You never receive that money, but you still pay a fee on it.
        </p>
        <div className="worked">
          <h3>$40 item, free shipping, buyer in an 8% sales tax state</h3>
          <ol>
            <li>Total amount of the sale: $40 + $3.20 tax = $43.20</li>
            <li>Final value fee: 13.6% × $43.20 = $5.88</li>
            <li>Per-order fee: $0.40</li>
          </ol>
          <p>
            Fees <strong>$6.28</strong>, take-home <strong>$33.72</strong>. Without the tax, fees would be $5.84. Enter the buyer's tax rate in
            the calculator if you want this level of precision.
          </p>
        </div>

        <h2>Final value fees by category</h2>
        <p>Rates below are for sellers with no eBay Store. Every sale also pays the per-order fee unless the row says otherwise.</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Final value fee</th>
              </tr>
            </thead>
            <tbody>
              {EBAY_US.categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    {rateText(c)}
                    {c.noOrderFeeFrom ? " (no per-order fee at $150+)" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Two kinds of tier hide in that table. Most categories are <em>marginal</em>: 13.6% on the first $7,500 and 2.35% only on the part
          above it. Handbags, jewelry and bullion work differently. Once the sale crosses the threshold, the lower rate applies to the whole
          amount. A $2,100 handbag pays 9% on all of it ($189), which is less than a $2,000 one pays at 15% ($300). The calculator handles
          both kinds.
        </p>

        <h2>The per-order fee</h2>
        <p>
          On top of the percentage, eBay adds ${EBAY_US.orderFee.small.toFixed(2)} to orders of $10 or less and $
          {EBAY_US.orderFee.standard.toFixed(2)} to everything else. It's charged per order, not per item, so a buyer who checks out three items
          together with the same shipping method pays it once. Combined shipping offers are worth setting up for this alone.
        </p>

        <h2>Extras that only apply sometimes</h2>
        <ul>
          <li>
            <strong>Promoted Listings (general)</strong>: your chosen ad rate, charged on the total sale amount when the sale is attributed to the
            ad.
          </li>
          <li>
            <strong>International fee</strong>: {EBAY_US.internationalRate * 100}% of the total when the buyer is outside the US. It's not
            charged if you ship through eBay International Shipping.
          </li>
          <li>
            <strong>Below Standard</strong>: if your account is Below Standard at the monthly evaluation, the next month's sales pay an extra 6%,
            rising to 7% after four months in a row.
          </li>
          <li>
            <strong>Insertion fees</strong>: you get {EBAY_US.freeListings} free listings a month, then ${EBAY_US.insertionFee.toFixed(2)} each.
            These aren't per-sale, so they're not in the receipt.
          </li>
        </ul>

        <h2>Selling the same thing on Etsy?</h2>
        <p>
          On a $40 item with $5 shipping, a US Etsy shop keeps about $40.27 against $38.48 on eBay, as long as the Etsy sale didn't come from an
          Offsite Ad. If it did, Etsy loses. The <a href={abs("/etsy-vs-ebay-fees/")}>comparison tool</a> runs both with your numbers.
        </p>
      </Prose>

      <Sources items={EBAY_US.sources} verifiedOn={EBAY_US.verifiedOn} />
      <Related paths={p.related} />
    </>
  );
}
