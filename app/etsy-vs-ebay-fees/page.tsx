import { CompareCalculator } from "@/components/SmallTools";
import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose, Related, Sources, toolLd } from "@/components/Shell";
import { EBAY_UK, EBAY_US } from "@/lib/data/ebay";
import { ETSY } from "@/lib/data/etsy";
import { page } from "@/lib/registry";
import { abs, DATA_VERIFIED } from "@/lib/site";

const PATH = "/etsy-vs-ebay-fees/";
export const metadata = metaFor(PATH);

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={toolLd(p)} />
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <h1>Etsy vs eBay fees</h1>
      <p className="lede">One item, one price, both platforms. The bar shows how much of the sale you keep, and the green row is the one that leaves you the most.</p>

      <CompareCalculator />

      <Prose>
        <h2>The short answer depends on where you live</h2>
        <p>
          <strong>In the US</strong>, Etsy is usually cheaper per sale on an ordinary order: about 9.5% plus fixed fees against eBay's 13.6%
          plus $0.40. That gap disappears on any order that comes through an Etsy Offsite Ad, which adds 12 or 15% on top. With a $40 item and
          $5 shipping, Etsy leaves you $40.27, eBay $38.48, and Etsy-through-an-ad $33.52.
        </p>
        <p>
          <strong>In the UK</strong>, private sellers on eBay pay nothing at all on domestic sales, so nothing beats eBay for clearing out your
          own things. Business sellers are a closer call: eBay's category rates run from 6.9% to 14.9% before VAT, while a UK Etsy shop pays
          roughly 11% plus VAT.
        </p>

        <h2>What fees don't tell you</h2>
        <ul>
          <li>
            <strong>Who's looking.</strong> Etsy buyers come for handmade, vintage and craft supplies, and they'll often pay more for it. eBay
            buyers come for everything else, and for bargains.
          </li>
          <li>
            <strong>Listing life.</strong> Etsy charges $0.20 every four months whether the item sells or not. eBay gives you 250 free
            listings a month in the US (300 for UK private sellers).
          </li>
          <li>
            <strong>Advertising you don't control.</strong> Etsy decides when to use Offsite Ads, unless you're a small shop and opt out. eBay
            only charges ad fees on listings you choose to promote.
          </li>
        </ul>
        <p>
          For the full breakdown on one platform, use the <a href={abs("/etsy-fee-calculator/")}>Etsy</a>,{" "}
          <a href={abs("/ebay-fee-calculator/")}>eBay US</a> or <a href={abs("/ebay-fee-calculator-uk/")}>eBay UK</a> calculators.
        </p>
      </Prose>

      <Sources items={[...ETSY.sources.slice(0, 2), ...EBAY_US.sources, EBAY_UK.sources[0], EBAY_UK.sources[2]]} verifiedOn={DATA_VERIFIED} />
      <Related paths={p.related} />
    </>
  );
}
