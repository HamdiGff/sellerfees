import type { Metadata } from "next";
import { JsonLd } from "@/components/Shell";
import { TOOLS } from "@/lib/registry";
import { abs, DATA_VERIFIED, formatDate, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "SellCalc — Etsy and eBay fee calculators that show their working" },
  description:
    "Free fee calculators for Etsy, eBay US, eBay UK and Twitch. Every fee line is explained and linked to the platform's own page, with a dated log of fee changes.",
  alternates: { canonical: abs("/") },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          description: "Fee calculators for online sellers and creators.",
        }}
      />
      <section className="hero">
        <span className="updated">Rates checked {formatDate(DATA_VERIFIED)}</span>
        <h1>Know what you keep before you list.</h1>
        <p className="lede">
          Fee calculators for people who sell online. Each one shows every fee as a separate line, explains how it's worked out and links to the
          platform's own fee page, so you can check the numbers yourself.
        </p>
      </section>

      <ul className="cards">
        {TOOLS.map((t) => (
          <li key={t.path}>
            <a className="card" href={abs(t.path)}>
              <span className="tag">{t.platform === "Multi" ? "Compare" : t.platform}</span>
              <strong>{t.short}</strong>
              <span>{t.blurb}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="prose">
        <h2>Why another fee calculator?</h2>
        <p>
          Most fee calculators give you one number and leave it there. That's fine until the number is wrong, and it's often wrong because a
          platform changed a fee months ago and nobody updated the page. Etsy's UK regulatory fee went up in June 2026. eBay announced higher
          UK business rates in January. Plenty of calculators still use the old figures.
        </p>
        <p>
          So we built these differently. Every calculator shows the date its rates were last checked against the official page. Every fee line
          shows its formula. And every change we find goes into a public <a href={abs("/fee-history/")}>fee change log</a> that you can
          download.
        </p>
        <h2>Two things they all do</h2>
        <p>
          <strong>Work backwards.</strong> Tell any calculator the profit you want and it tells you what to charge, with every fee already
          included.
        </p>
        <p>
          <strong>Share the exact result.</strong> Your inputs are saved in the page address, so you can bookmark a calculation or send it to
          someone and they'll see the same numbers.
        </p>
        <p>
          Nothing you type leaves your browser. There's no account, and the calculators work on a phone in the middle of a car boot sale. Read
          how we check fees on the <a href={abs("/methodology/")}>methodology page</a>.
        </p>
      </div>
    </>
  );
}
