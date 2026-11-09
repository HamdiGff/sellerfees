import { EtsyCalculator } from "@/components/EtsyCalculator";
import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose, Related, Sources, toolLd } from "@/components/Shell";
import { ETSY, ETSY_COUNTRIES } from "@/lib/data/etsy";
import { page } from "@/lib/registry";
import { abs, formatDate } from "@/lib/site";

const PATH = "/etsy-fee-calculator/";
export const metadata = metaFor(PATH);

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={toolLd(p)} />
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <span className="updated">Fees checked {formatDate(ETSY.verifiedOn)}</span>
      <h1>Etsy Fee Calculator</h1>
      <p className="lede">
        Put in your price and shipping and you get the full list of what Etsy keeps, line by line, with the maths under each line. It also works
        backwards: tell it the profit you want and it gives you the price to list at.
      </p>

      <EtsyCalculator defaultCountry="US" />

      <Prose>
        <h2>A $25 sale, fee by fee</h2>
        <p>
          Say you sell a $25 print to a US buyer with free shipping. Here's what comes out of it on a US shop:
        </p>
        <div className="worked">
          <ol>
            <li>Listing fee: $0.20</li>
            <li>Transaction fee: 6.5% × $25 = $1.63</li>
            <li>Payment processing: 3% × $25 + $0.25 = $1.00</li>
          </ol>
          <p>
            Total <strong>$2.83</strong>, so you keep <strong>$22.17</strong>. That's 11.3% gone before you've paid for materials or postage.
          </p>
        </div>
        <p>
          On cheaper items the percentage climbs, because the $0.20 listing fee and the $0.25 processing charge stay the same however little you
          charge. On a $5 sticker those two fixed charges alone take 9% of the price. If most of your catalogue sits under $10, bundling or a
          minimum order does more for your margin than shaving the item price.
        </p>

        <h2>Etsy charges on your shipping too</h2>
        <p>
          The 6.5% transaction fee is worked out on the item price <em>plus</em> whatever you charge for shipping and gift wrap. So does payment
          processing. Moving $5 from the price into the shipping line doesn't save you anything. What it can do is change how buyers see the
          price, and that's a separate decision.
        </p>
        <p>
          US sellers get one break: sales tax is left out of the transaction fee. It isn't left out of payment processing, though, so if you
          enter the sales tax Etsy collects, the calculator adds processing on it. Most sellers lose a few cents an order to this without
          noticing.
        </p>

        <h2>The fee that changes everything: Offsite Ads</h2>
        <p>
          When Etsy advertises your listing on Google, Instagram and other sites and a buyer orders through that ad within 30 days, Etsy charges an
          Offsite Ads fee on the whole order. It's 15% while your shop is under $10,000 in yearly sales, and you can opt out. After $10,000 the
          rate drops to 12%, but you can't leave the programme. The fee is capped at $100 per order.
        </p>
        <div className="callout">
          <p>
            Same $25 + $5 shipping order, but from an Offsite Ad at 15%: fees jump from $3.30 to <strong>$7.80</strong>. You keep $22.20 of
            $30.
          </p>
        </div>
        <p>
          You can't tell in advance which orders will come from an ad, so price for a mix. If roughly one order in five comes through Offsite Ads,
          an extra 3% (15% ÷ 5) on top of the normal fees is a fair planning number.
        </p>

        <h2>What shops in other countries pay</h2>
        <p>
          The listing and transaction fees are the same everywhere. Payment processing depends on where your bank account is, and some countries
          add a Regulatory Operating Fee. Pick your country in the calculator to use these rates.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Shop's bank country</th>
                <th>Payment processing</th>
                <th className="num">Regulatory fee</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(ETSY_COUNTRIES).map((c) => (
                <tr key={c.code}>
                  <td>{c.name}</td>
                  <td>
                    {c.processing.pct * 100}% + {c.processing.fixed.toFixed(2)} {c.currency}
                    {c.processingInternational ? ` (${c.processingInternational.pct * 100}% for international orders)` : ""}
                  </td>
                  <td className="num">{c.regulatoryFee ? `${(c.regulatoryFee * 100).toFixed(2)}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Outside the US, VAT or GST is usually added on top of Etsy's fees unless you're registered and give Etsy your number. UK sellers have
          their own page with worked examples: <a href={abs("/etsy-fee-calculator-uk/")}>Etsy fees for UK shops</a>.
        </p>

        <h2>Things this calculator leaves out on purpose</h2>
        <ul>
          <li>
            <strong>Etsy Ads</strong> (the on-site ads you pay for daily). That's a budget you set, not a per-sale fee.
          </li>
          <li>
            <strong>Shipping labels</strong> bought through Etsy. Put the label cost in "What postage costs you" to include it in profit.
          </li>
          <li>
            <strong>Currency conversion</strong>: {ETSY.currencyConversionRate * 100}% if you list in a different currency from your bank
            account. Listing in your own currency avoids it.
          </li>
          <li>
            <strong>Etsy Plus and the one-time shop set-up fee</strong>. Neither is charged per sale.
          </li>
        </ul>
        <p>
          The <a href={abs("/fee-history/")}>fee history page</a> shows what Etsy has changed and when, and the{" "}
          <a href={abs("/methodology/")}>methodology page</a> explains how rounding works.
        </p>
      </Prose>

      <Sources items={ETSY.sources} verifiedOn={ETSY.verifiedOn} />
      <Related paths={p.related} />
    </>
  );
}
