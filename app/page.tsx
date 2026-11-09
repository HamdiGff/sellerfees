import type { Metadata } from "next";
import { HeroQuick } from "@/components/HeroQuick";
import { JsonLd } from "@/components/Shell";
import { money } from "@/lib/format";
import { EBAY_UK, EBAY_US } from "@/lib/data/ebay";
import { ETSY, ETSY_COUNTRIES } from "@/lib/data/etsy";
import { FEE_HISTORY } from "@/lib/data/history";
import { etsyFees } from "@/lib/engines/etsy";
import { ebayUkFees, ebayUsFees } from "@/lib/engines/ebay";
import { abs, DATA_VERIFIED, formatDate, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "SellCalc: Etsy and eBay Fee Calculators That Show Every Fee" },
  description:
    "See what Etsy, eBay US and eBay UK take from a sale before you list it. Every fee line is shown with its formula and linked to the platform's own fee page.",
  alternates: { canonical: abs("/") },
  openGraph: { url: abs("/"), siteName: SITE_NAME, type: "website" },
};

const CALCS = [
  { path: "/etsy-fee-calculator/", name: "Etsy fee calculator", covers: "US, Canada, Australia, Germany, France, Italy and Spain shops. Offsite Ads, regulatory fees, VAT on fees." },
  { path: "/etsy-fee-calculator-uk/", name: "Etsy fees for UK shops", covers: "The 0.48% regulatory fee from June 2026 and 20% VAT on fees, with worked examples." },
  { path: "/ebay-fee-calculator/", name: "eBay fee calculator (US)", covers: "Every category rate and tier, the per-order fee, sales tax in the fee base, promoted listings." },
  { path: "/ebay-fee-calculator-uk/", name: "eBay UK fee calculator", covers: "Private sellers (no final value fee) and business sellers across 30 categories." },
  { path: "/etsy-vs-ebay-fees/", name: "Etsy vs eBay", covers: "One price, both platforms, and which one leaves you more." },
  { path: "/twitch-bits-to-usd/", name: "Twitch Bits to USD", covers: "What a cheer is worth to the streamer, and Bits needed for a goal." },
];

export default function Home() {
  // Worked answers are computed from the same engines the calculators use,
  // so the FAQ can never drift from the tools.
  const etsy50 = etsyFees({ country: "US", itemPrice: 50, shippingCharged: 0, offsiteAds: "none" });
  const ebay50 = ebayUsFees({ categoryId: "most", itemPrice: 50, shippingCharged: 0 });
  const etsyUk40 = etsyFees({ country: "UK", itemPrice: 40, shippingCharged: 0, offsiteAds: "none" });
  const ebayUkBiz40 = ebayUkFees({ sellerType: "business", categoryId: "everything", itemPrice: 40, shippingCharged: 0 });
  const us = ETSY_COUNTRIES.US;
  const uk = ETSY_COUNTRIES.UK;
  const recent = FEE_HISTORY.slice(0, 4);

  const faq = [
    {
      q: "How much does Etsy take from a sale?",
      a: `For a US shop, a $0.20 listing fee, a 6.5% transaction fee on item price plus shipping, and ${us.processing.pct * 100}% + $${us.processing.fixed.toFixed(2)} payment processing. On a $50 sale that's ${money(etsy50.totalFees, "USD")}, so you keep ${money(etsy50.payout, "USD")}. If the order came through an Offsite Ad, add another 12% or 15%.`,
    },
    {
      q: "How much does eBay take from a sale?",
      a: `On eBay.com without a Store, most categories pay 13.6% of the total sale (item, shipping and sales tax) plus $0.40 per order, or $0.30 on orders of $10 or less. A $50 sale with free shipping costs ${money(ebay50.totalFees, "USD")} in fees.`,
    },
    {
      q: "Is Etsy or eBay cheaper to sell on?",
      a: `In the US, Etsy usually takes less per ordinary sale: ${money(etsy50.totalFees, "USD")} against ${money(ebay50.totalFees, "USD")} on a $50 item. An Etsy order from an Offsite Ad reverses that. In the UK, private sellers pay nothing on eBay, which no Etsy shop can match.`,
    },
    {
      q: "Do UK sellers pay VAT on Etsy and eBay fees?",
      a: `Yes, unless they're VAT-registered. Both platforms add 20% VAT to their fees for UK sellers without a VAT number. On a £40 sale that puts Etsy's fees at ${money(etsyUk40.totalFees, "GBP")} and eBay's business-seller fees at ${money(ebayUkBiz40.totalFees, "GBP")} (Everything Else category).`,
    },
    {
      q: "How often are the fees updated?",
      a: `We re-check every platform's fee pages each month and whenever a change is announced. The last full check was ${formatDate(DATA_VERIFIED)}. Every change goes into the public fee change log with a link to its source.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: `${SITE_URL}/`, description: "Fee calculators for online sellers and creators." },
            { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: `${SITE_URL}/` },
            {
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />

      <section className="home-hero">
        <h1 className="home-title">What will the platform take?</h1>
        <HeroQuick />
        <p className="home-checked">
          <span className="updated">Fees checked against Etsy and eBay's own pages on {formatDate(DATA_VERIFIED)}</span>
        </p>
      </section>

      <section className="home-section">
        <h2>Calculators</h2>
        <ul className="calc-list">
          {CALCS.map((c) => (
            <li key={c.path}>
              <a href={abs(c.path)}>
                <span className="calc-name">{c.name}</span>
                <span className="calc-covers">{c.covers}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section home-split">
        <div>
          <h2>The rates right now</h2>
          <p className="section-note">Headline fees per sale, before ads and optional extras.</p>
          <div className="table-scroll">
            <table className="rates">
              <thead>
                <tr>
                  <th scope="col">Where you sell</th>
                  <th scope="col">What comes off each sale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Etsy, US shop</th>
                  <td>$0.20 listing, 6.5% transaction, {us.processing.pct * 100}% + $0.25 processing</td>
                </tr>
                <tr>
                  <th scope="row">Etsy, UK shop</th>
                  <td>
                    ~£0.15 listing, 6.5% transaction, {uk.processing.pct * 100}% + £0.20 processing, {(uk.regulatoryFee * 100).toFixed(2)}% regulatory, plus VAT
                  </td>
                </tr>
                <tr>
                  <th scope="row">Etsy Offsite Ads</th>
                  <td>
                    +{ETSY.offsiteAds.standard * 100}% (or {ETSY.offsiteAds.highVolume * 100}%) of the order, capped at $100
                  </td>
                </tr>
                <tr>
                  <th scope="row">eBay.com, no Store</th>
                  <td>
                    13.6% of the total in most categories + ${EBAY_US.orderFee.standard.toFixed(2)} per order
                  </td>
                </tr>
                <tr>
                  <th scope="row">eBay UK, private</th>
                  <td>Nothing on UK sales ({EBAY_UK.privateSeller.internationalRate * 100}% if the buyer is abroad)</td>
                </tr>
                <tr>
                  <th scope="row">eBay UK, business</th>
                  <td>
                    6.9% to 14.9% by category + £0.40 per order + {EBAY_UK.business.regulatoryRate * 100}% regulatory, plus VAT
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2>Recent fee changes</h2>
          <ol className="history compact">
            {recent.map((c, i) => (
              <li key={i}>
                <time dateTime={c.date}>{formatDate(c.date)}</time>
                <p>
                  <strong>
                    {c.platform} {c.market}
                  </strong>{" "}
                  {c.fee.toLowerCase()}: {c.from} to {c.to}
                </p>
              </li>
            ))}
          </ol>
          <a href={abs("/fee-history/")}>Full change log and download</a>
        </div>
      </section>

      <section className="home-section prose">
        <h2>Why these calculators show their working</h2>
        <p>
          Most fee calculators give you one number. That's fine until the number is out of date, which happens more than you'd think: Etsy raised
          its UK regulatory fee in June 2026 and changed it in several other countries on the same day, and plenty of calculators still use the
          old figures.
        </p>
        <p>
          Here, every fee is its own line with the sum written underneath, so you can see where each penny goes and check it against your own
          statement. Each calculator links to the platform pages the rates came from and shows the date we last read them. When a platform
          changes something, it goes into the <a href={abs("/fee-history/")}>change log</a> the same week.
        </p>
        <p>
          Two more things every calculator does. It works backwards: tell it the profit you want and it tells you what to charge. And it keeps
          your numbers in the page address, so a result can be bookmarked or sent to someone. Nothing you type is sent anywhere. The details are
          on the <a href={abs("/methodology/")}>methodology page</a>.
        </p>
      </section>

      <section className="home-section">
        <h2>Common questions</h2>
        <div className="faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
