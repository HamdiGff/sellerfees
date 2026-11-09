import { EtsyCalculator } from "@/components/EtsyCalculator";
import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose, Related, Sources, toolLd } from "@/components/Shell";
import { ETSY } from "@/lib/data/etsy";
import { page } from "@/lib/registry";
import { abs, formatDate } from "@/lib/site";

const PATH = "/etsy-fee-calculator-uk/";
export const metadata = metaFor(PATH);

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={toolLd(p)} />
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <span className="updated">Fees checked {formatDate(ETSY.verifiedOn)}</span>
      <h1>Etsy fees for UK sellers</h1>
      <p className="lede">
        UK shops pay more per sale than US shops do, mainly because of a higher processing rate, the Regulatory Operating Fee and VAT on top of
        it all. This calculator is set up for a UK bank account, with VAT on fees switched on unless you tick that you're registered.
      </p>

      <EtsyCalculator defaultCountry="UK" />

      <Prose>
        <h2>What changed in June 2026</h2>
        <p>
          On 22 June 2026 Etsy raised the UK Regulatory Operating Fee from 0.32% to <strong>0.48%</strong>. That's the third step since it
          started at 0.25% in 2021. It's charged on the item price plus postage and gift wrap, and it appears as its own line in your Payment
          account. If your spreadsheet still uses 0.32%, your margins are slightly overstated.
        </p>

        <h2>A £30 sale with £4 postage</h2>
        <div className="worked">
          <ol>
            <li>Listing fee: $0.20, about £0.15</li>
            <li>Transaction fee: 6.5% × £34 = £2.21</li>
            <li>Payment processing: 4% × £34 + £0.20 = £1.56</li>
            <li>Regulatory Operating Fee: 0.48% × £34 = £0.16</li>
            <li>VAT at 20% on those fees = £0.82</li>
          </ol>
          <p>
            Total <strong>£4.90</strong> (14.4%), so you keep <strong>£29.10</strong>. A VAT-registered shop pays £4.08 instead, because it
            doesn't carry the VAT line.
          </p>
        </div>

        <h2>Why the VAT line matters so much</h2>
        <p>
          Most small UK sellers aren't VAT-registered, since registration only becomes compulsory above £90,000 of taxable turnover. If you're
          under that, Etsy adds 20% VAT to every fee, and you can't reclaim it. In practice the 6.5% transaction fee costs you 7.8%, and the 4%
          processing rate costs you 4.8%.
        </p>
        <p>
          If you are registered, give Etsy your VAT number and the VAT line disappears from your fees, though you'll then account for VAT on your
          own sales. Tick "I'm VAT-registered" above to see the difference.
        </p>

        <h2>The listing fee is in dollars</h2>
        <p>
          Etsy charges every listing $0.20 USD and converts it at the day's rate, so in pounds it moves a little from month to month. We use
          about £0.15. That's close enough for pricing, but your bill will show the exact converted amount.
        </p>

        <h2>Selling to buyers abroad</h2>
        <p>
          A UK shop's processing rate is 4% + £0.20 whether the buyer is in Leeds or Los Angeles. What changes abroad is the postage cost and,
          for EU buyers, who handles import VAT. Etsy collects VAT on many cross-border orders as the marketplace, which is outside this fee
          calculation.
        </p>

        <h2>Would eBay be cheaper?</h2>
        <p>
          For a UK private seller, almost always: eBay.co.uk charges private sellers no final value fee at all. For a business seller it
          depends on the category. Put the same numbers into the <a href={abs("/etsy-vs-ebay-fees/")}>Etsy vs eBay comparison</a> to see it for
          your item, or open the <a href={abs("/ebay-fee-calculator-uk/")}>eBay UK fee calculator</a>.
        </p>
      </Prose>

      <Sources items={ETSY.sources} verifiedOn={ETSY.verifiedOn} />
      <Related paths={p.related} />
    </>
  );
}
