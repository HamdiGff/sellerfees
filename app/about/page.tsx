import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose } from "@/components/Shell";
import { page } from "@/lib/registry";
import { abs } from "@/lib/site";

const PATH = "/about/";
export const metadata = metaFor(PATH);

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <h1>About SellCalc</h1>
      <Prose>
        <p className="lede">SellCalc is an independent site that works out what online marketplaces take from each sale.</p>
        <p>
          It started with a simple annoyance. Every fee calculator we tried gave a single number with no working, and when we checked a few
          against the platforms' own pages, several were using rates that had changed months earlier. If you price your stock on a wrong number,
          you lose money on every sale and never find out why.
        </p>
        <p>So SellCalc follows three rules:</p>
        <ul>
          <li>Show every fee as its own line, with the formula under it.</li>
          <li>Link every rate to the platform's own page, and show the date we last checked it.</li>
          <li>Keep a public, dated log of every fee change, so nobody has to guess what changed.</li>
        </ul>
        <p>
          We aren't affiliated with Etsy, eBay, Twitch or any platform we cover, and none of them has seen or approved this site. Platform names
          are used only to say which fees a calculator covers.
        </p>
        <p>
          The calculators are free, need no account and run in your browser. The site may show ads to cover its costs. Ads never change the
          numbers.
        </p>
        <p>
          Want a platform added, or think a number is wrong? <a href={abs("/contact/")}>Get in touch</a>. Read how we check fees on the{" "}
          <a href={abs("/methodology/")}>methodology page</a>.
        </p>
      </Prose>
    </>
  );
}
