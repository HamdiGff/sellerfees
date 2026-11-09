import { EtsyCalculator } from "@/components/EtsyCalculator";
import { EtsyCountryChart, EtsyShareChart } from "@/components/EtsyCharts";
import { OffsiteAdsPlanner } from "@/components/OffsiteAdsPlanner";
import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose, Related, Sources, toolLd } from "@/components/Shell";
import { ETSY, ETSY_COUNTRIES } from "@/lib/data/etsy";
import { etsyFees } from "@/lib/engines/etsy";
import { money } from "@/lib/format";
import { page } from "@/lib/registry";
import { abs, formatDate } from "@/lib/site";

const PATH = "/etsy-fee-calculator/";
export const metadata = metaFor(PATH);

const LADDER = [5, 10, 15, 20, 25, 35, 50, 75, 100, 150, 250, 500];

const EXTRA_SOURCES = [
  { label: "Etsy Help: How to issue a full or partial refund", url: "https://help.etsy.com/hc/en-us/articles/360002089188-How-to-Issue-a-Full-or-Partial-Refund-For-an-Order" },
  { label: "Etsy Terms: Offsite Ads, 30-day attribution and last-click rule", url: "https://www.etsy.com/help/article/5585" },
];

export default function Page() {
  const p = page(PATH);
  const us = (price: number, ads: "none" | "15" | "12" = "none", ship = 0) => etsyFees({ country: "US", itemPrice: price, shippingCharged: ship, offsiteAds: ads });
  const at25 = us(25);
  const at30ad = us(25, "15", 5);
  const at30 = us(25, "none", 5);
  const at5 = us(5);

  const faq = [
    {
      q: "Does Etsy charge fees on shipping?",
      a: "Yes. The 6.5% transaction fee and payment processing are both charged on item price plus the shipping you charge. Moving money from the price into shipping doesn't lower your fees.",
    },
    {
      q: "Does Etsy charge fees on sales tax?",
      a: "For US shops, the transaction fee leaves sales tax out, but payment processing is charged on the full amount the buyer paid, tax included. Enter the tax in the calculator to see the difference.",
    },
    {
      q: "Do I get Etsy's fees back if I refund an order?",
      a: "When you refund through Shop Manager, Etsy credits the transaction and processing fees for the refunded amount back to your Payment account. The $0.20 listing fee is only returned if you cancel the order.",
    },
    {
      q: "Can I turn off Offsite Ads?",
      a: "Only while your shop has made less than $10,000 in the past 365 days. Once you pass that, the rate drops to 12% but you stay in the programme for good. Opting out isn't retroactive: a buyer who clicked an ad before you opted out still counts for 30 days.",
    },
    {
      q: `Why does a ${money(5, "USD")} item lose so much to fees?`,
      a: `Two charges are fixed: the $0.20 listing fee and the $0.25 processing charge. On a $5 sale they add up to 9% of the price before any percentage fee, so Etsy takes ${(at5.feeShare * 100).toFixed(1)}% in total.`,
    },
  ];

  return (
    <>
      <JsonLd data={toolLd(p)} />
      <JsonLd data={breadcrumbLd(p)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <Crumbs p={p} />
      <span className="updated">Fees checked against Etsy's policy pages on {formatDate(ETSY.verifiedOn)}</span>
      <h1>Etsy Fee Calculator</h1>
      <p className="lede">
        Enter a price and see every fee Etsy takes, each with the sum written underneath. Set the shop country, say whether the order came from
        an Offsite Ad, and add your own costs for real profit. Or set a profit target and it tells you what to charge.
      </p>

      <EtsyCalculator defaultCountry="US" />

      <nav className="page-index" aria-label="On this page">
        <a href="#price-table">Fees at every price</a>
        <a href="#offsite-ads">Offsite Ads</a>
        <a href="#countries">By country</a>
        <a href="#refunds">Refunds</a>
        <a href="#faq">Questions</a>
      </nav>

      <section className="page-band" id="price-table">
        <Prose>
          <h2>What Etsy takes at common prices</h2>
          <p>
            US shop, free shipping, no ads. Find your price and read across. A {money(25, "USD")} sale costs {money(at25.totalFees, "USD")} in
            fees, so you keep {money(at25.payout, "USD")}.
          </p>
        </Prose>
        <div className="ladder-wrap">
          <div className="table-scroll">
            <table className="ladder">
              <thead>
                <tr>
                  <th scope="col">Item price</th>
                  <th scope="col" className="num">Fees</th>
                  <th scope="col" className="num">You keep</th>
                  <th scope="col" className="num">Etsy's share</th>
                  <th scope="col" className="num">If from a 15% Offsite Ad</th>
                </tr>
              </thead>
              <tbody>
                {LADDER.map((price) => {
                  const r = us(price);
                  const a = us(price, "15");
                  return (
                    <tr key={price}>
                      <th scope="row">{money(price, "USD")}</th>
                      <td className="num">{money(r.totalFees, "USD")}</td>
                      <td className="num keep">{money(r.payout, "USD")}</td>
                      <td className="num">{(r.feeShare * 100).toFixed(1)}%</td>
                      <td className="num">
                        {money(a.payout, "USD")} <span className="muted">({(a.feeShare * 100).toFixed(1)}%)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <EtsyShareChart />
        </div>
        <Prose>
          <p>
            The curve flattens fast. Below about $15 the fixed charges ($0.20 listing, $0.25 processing) do most of the damage, so a $5 sticker
            gives up {(at5.feeShare * 100).toFixed(1)}%. Above $50 you settle close to the 9.5% floor of 6.5% + 3%. If your catalogue lives under
            $10, bundles and minimum order values help your margin more than shaving the price.
          </p>
        </Prose>
      </section>

      <section className="page-band" id="offsite-ads">
        <Prose>
          <h2>Offsite Ads: the fee you don't choose</h2>
          <p>
            Etsy advertises listings on Google, social media and partner sites. If a buyer clicks one of those ads and orders anything from your
            shop within <strong>30 days</strong>, the whole order pays an extra {ETSY.offsiteAds.standard * 100}% (or {ETSY.offsiteAds.highVolume * 100}% once
            your shop has passed $10,000 in yearly sales), capped at $100 per order. It doesn't have to be the item in the ad, and several orders
            from the same buyer within the window can each be charged.
          </p>
          <p>
            One exception works in your favour: if the buyer's last click before ordering was one of your own Etsy Ads, only the Etsy Ads cost
            applies, not the Offsite Ads fee. On a {money(25, "USD")} item with {money(5, "USD")} shipping, an ordinary order costs{" "}
            {money(at30.totalFees, "USD")} in fees and an Offsite Ads order costs {money(at30ad.totalFees, "USD")}.
          </p>
          <h3>Is an ad order still worth it to you?</h3>
          <p>Put in your typical order and cost. The planner shows the profit on each kind of order and what the programme costs you a month.</p>
        </Prose>
        <OffsiteAdsPlanner />
      </section>

      <section className="page-band" id="countries">
        <Prose>
          <h2>Where your bank account is changes the bill</h2>
          <p>
            The listing and 6.5% transaction fees are the same everywhere. Payment processing depends on the country of the bank account your shop
            pays out to, several countries add a Regulatory Operating Fee, and outside the US most sellers also pay VAT or GST on Etsy's fees.
            Put together, the same 50-unit sale costs a French shop noticeably more than an American one.
          </p>
        </Prose>
        <EtsyCountryChart price={50} />
        <div className="table-scroll prose">
          <table>
            <thead>
              <tr>
                <th scope="col">Shop's bank country</th>
                <th scope="col">Payment processing</th>
                <th scope="col" className="num">Regulatory fee</th>
                <th scope="col" className="num">Tax on fees</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(ETSY_COUNTRIES).map((c) => (
                <tr key={c.code}>
                  <th scope="row">{c.name}</th>
                  <td>
                    {c.processing.pct * 100}% + {c.processing.fixed.toFixed(2)} {c.currency}
                    {c.processingInternational ? `, ${c.processingInternational.pct * 100}% on international orders` : ""}
                  </td>
                  <td className="num">{c.regulatoryFee ? `${(c.regulatoryFee * 100).toFixed(2)}%` : "none"}</td>
                  <td className="num">{c.taxOnFeesDefault ? `${Math.round(c.taxOnFeesDefault * 100)}%` : "none"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Prose>
          <p>
            Tax on fees only applies if you aren't registered and haven't given Etsy your number. France's regulatory fee more than doubled to
            1.14% on 22 June 2026, and the UK's went to 0.48% the same day. UK sellers have a page of their own with worked examples:{" "}
            <a href={abs("/etsy-fee-calculator-uk/")}>Etsy fees for UK shops</a>.
          </p>
        </Prose>
      </section>

      <section className="page-band">
        <Prose>
          <h2>Shipping and sales tax are part of the fee base</h2>
          <p>
            The 6.5% transaction fee is charged on item price <em>plus</em> shipping and gift wrap, and so is processing. Charging $20 + $5
            shipping or $25 with free shipping costs you exactly the same in fees. Pick whichever presentation sells better.
          </p>
          <p>
            US shops get one break: sales tax stays out of the transaction fee. It doesn't stay out of payment processing, which is charged on the
            whole amount the buyer paid. If you enter the sales tax in the calculator, it adds processing on that too, usually a few cents an
            order.
          </p>
        </Prose>
      </section>

      <section className="page-band" id="refunds">
        <Prose>
          <h2>Refunds and cancellations</h2>
          <p>
            When you refund a buyer through Shop Manager, Etsy credits the transaction and processing fees for the refunded part back to your
            Payment account automatically. A partial refund gets a partial credit. The $0.20 listing fee only comes back if you cancel the order
            rather than just refunding it. Refunds through Etsy Payments have to be issued within 180 days of the payment.
          </p>
          <p>
            Sellers in the Etsy forums report that fee credits sometimes arrive a few hours after the refund, and later still if the buyer is
            choosing between store credit and their original payment method. If a credit hasn't appeared after a day, check Finances, then
            Payment account, in Shop Manager before contacting Etsy.
          </p>
        </Prose>
      </section>

      <section className="page-band">
        <Prose>
          <h2>Left out on purpose</h2>
          <ul>
            <li>
              <strong>Etsy Ads</strong>, the on-site ads you pay for daily. That's a budget you set, not a fee on each sale.
            </li>
            <li>
              <strong>Shipping labels</strong> bought through Etsy. Add the label cost under "your own costs" to include it in profit.
            </li>
            <li>
              <strong>Currency conversion</strong>: {ETSY.currencyConversionRate * 100}% when you list in a different currency from your bank
              account. Listing in your own currency avoids it.
            </li>
            <li>
              <strong>Etsy Plus and the one-time shop set-up fee</strong>. Neither is charged per sale.
            </li>
          </ul>
        </Prose>
      </section>

      <section className="page-band" id="faq">
        <h2>Questions sellers ask</h2>
        <div className="faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <Prose>
          <p>
            Every Etsy fee change we've logged is on the <a href={abs("/fee-history/")}>fee history page</a>, and the{" "}
            <a href={abs("/methodology/")}>methodology page</a> explains rounding and sources.
          </p>
        </Prose>
      </section>

      <Sources items={[...ETSY.sources, ...EXTRA_SOURCES]} verifiedOn={ETSY.verifiedOn} />
      <Related paths={p.related} />
    </>
  );
}
