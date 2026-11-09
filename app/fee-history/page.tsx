import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose, Related } from "@/components/Shell";
import { FEE_HISTORY } from "@/lib/data/history";
import { page } from "@/lib/registry";
import { abs, formatDate, SITE_NAME } from "@/lib/site";

const PATH = "/fee-history/";
export const metadata = metaFor(PATH);

function when(iso: string, monthOnly?: boolean) {
  if (!monthOnly) return formatDate(iso);
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

export default function Page() {
  const p = page(PATH);
  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Marketplace fee change log (Etsy, eBay)",
    description: p.description,
    url: abs(PATH),
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: { "@type": "Organization", name: SITE_NAME },
    dateModified: p.lastReviewed,
    distribution: [
      { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: abs("/data/fee-history.csv") },
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: abs("/data/fee-history.json") },
    ],
  };

  return (
    <>
      <JsonLd data={dataset} />
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <h1>Fee change log</h1>
      <p className="lede">
        Platforms rarely make a fuss when they put fees up. This is our running record of what changed, when, and where it was announced, newest
        first. Every calculator on the site uses the rates at the top of this list.
      </p>

      <div className="downloads">
        <a className="btn-ghost" href={abs("/data/fee-history.csv")}>
          Download CSV
        </a>
        <a className="btn-ghost" href={abs("/data/fee-history.json")}>
          JSON
        </a>
      </div>

      <ol className="history">
        {FEE_HISTORY.map((c, i) => (
          <li key={i}>
            <time dateTime={c.date}>
              {when(c.date, c.monthOnly)}
              {c.kind === "announced" ? " · announced" : ""}
            </time>
            <h3>
              {c.platform} {c.market}: {c.fee}
            </h3>
            <p className="change">
              {c.from} → {c.to}
            </p>
            <p>
              {c.summary}{" "}
              <a href={c.source} rel="noopener" target="_blank">
                Source
              </a>
            </p>
          </li>
        ))}
      </ol>

      <Prose>
        <h2>Using this data</h2>
        <p>
          You're welcome to use the log in articles, spreadsheets or your own tools under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener license" target="_blank">
            CC BY 4.0
          </a>
          . The only condition is a visible credit with a link, for example:
        </p>
        <pre className="worked">
          Fee data: <a href={abs(PATH)}>SellCalc fee change log</a>
        </pre>
        <p>
          If you notice a change that isn't here yet, <a href={abs("/contact/")}>send us the link</a>. We add it once we've checked it against
          the platform's own page.
        </p>
      </Prose>
      <Related paths={p.related} />
    </>
  );
}
