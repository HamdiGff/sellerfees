import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose } from "@/components/Shell";
import { page } from "@/lib/registry";
import { abs, DATA_VERIFIED, formatDate } from "@/lib/site";

const PATH = "/methodology/";
export const metadata = metaFor(PATH);

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <h1>How we check fees</h1>
      <Prose>
        <p className="lede">
          A fee calculator is only as good as its last update. This page explains where our numbers come from and what we do when they change.
        </p>

        <h2>Sources: the platform's own pages, nothing else</h2>
        <p>
          Every rate in our calculators comes from the platform's published fee pages: Etsy's Fees &amp; Payments Policy and Payments Policy,
          eBay's help pages for each marketplace and seller type, and so on. Each calculator lists the exact pages it uses at the bottom. News
          articles and seller forums tell us that <em>something</em> changed, but the number only goes in once we've found it on the platform's
          own page.
        </p>

        <h2>How often we check</h2>
        <ul>
          <li>Every month, we re-read each source page and compare it line by line with our data.</li>
          <li>When a platform announces a change, we update the calculator for the date it takes effect and add it to the fee change log.</li>
          <li>The "fees checked" date on each calculator only moves when we've actually re-checked. Last full check: {formatDate(DATA_VERIFIED)}.</li>
        </ul>

        <h2>How the maths works</h2>
        <p>
          Each fee is calculated on the same base the platform uses (for example, Etsy's transaction fee is on item price plus shipping; eBay's
          final value fee also includes sales tax). Each line is rounded to the nearest cent or penny, the way platforms show it on your
          statement, and the total is the sum of the rounded lines. Your statement may differ by a cent now and then, because platforms round
          slightly differently in some cases.
        </p>
        <p>
          Tiered fees are handled the way each platform defines them. Some charge the lower rate only on the part of the sale above a threshold.
          Others switch the whole sale to a different rate once it crosses one. The category tables on each calculator page say which is which.
        </p>
        <p>
          "Work backwards" searches for the lowest price, to the cent, that reaches your target with all your other inputs unchanged. Because
          fees are a share of the price, a higher price always leaves you more, so there's a single answer.
        </p>

        <h2>What we leave out</h2>
        <p>
          Calculators cover per-sale fees. Monthly subscriptions, daily ad budgets, shipping labels and income tax aren't per-sale, so they're
          left out, though each calculator lets you add your own costs to see real profit. Where a fee depends on your account (Below Standard
          status, VAT registration, ad attribution), there's a switch for it.
        </p>
        <p>
          Some amounts are converted from US dollars, such as Etsy's $0.20 listing fee for non-US shops. We use a recent approximate rate, and
          the calculator says so on that line.
        </p>

        <h2>Your data</h2>
        <p>
          The calculators run entirely in your browser. What you type isn't sent anywhere. It only goes into the page address, so you can share
          or bookmark a result. More detail is in the <a href={abs("/privacy/")}>privacy policy</a>.
        </p>

        <h2>Found a mistake?</h2>
        <p>
          Please <a href={abs("/contact/")}>tell us</a>, with a link to the platform page if you have one. Corrections are logged in the{" "}
          <a href={abs("/fee-history/")}>fee change log</a>.
        </p>
      </Prose>
    </>
  );
}
