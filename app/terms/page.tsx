import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose } from "@/components/Shell";
import { page } from "@/lib/registry";
import { abs, formatDate } from "@/lib/site";

const PATH = "/terms/";
export const metadata = metaFor(PATH);

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <h1>Terms of use</h1>
      <Prose>
        <p>Last updated {formatDate(p.lastReviewed)}.</p>
        <h2>Estimates, not statements</h2>
        <p>
          SellCalc's calculators estimate fees from each platform's published rates. Your actual fees depend on your account, location and the
          details of each order, and the platform's own statement is always final. Check important decisions against the platform's fee page,
          which every calculator links to.
        </p>
        <h2>Not financial or tax advice</h2>
        <p>Nothing on this site is financial, tax or legal advice. For those, talk to a qualified professional.</p>
        <h2>Using our data</h2>
        <p>
          The <a href={abs("/fee-history/")}>fee change log</a> is published under CC BY 4.0: you can reuse it with a visible credit and a link
          to SellCalc. Calculator code and page text remain ours.
        </p>
        <h2>Trademarks</h2>
        <p>
          Etsy, eBay and Twitch are trademarks of their owners. SellCalc isn't affiliated with or endorsed by them, and uses their names only to
          describe which fees a calculator covers.
        </p>
        <h2>Liability</h2>
        <p>
          The site is provided as is. We work to keep it accurate but can't promise it's error-free, and we're not liable for losses from relying
          on an estimate.
        </p>
      </Prose>
    </>
  );
}
