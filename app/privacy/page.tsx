import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose } from "@/components/Shell";
import { page } from "@/lib/registry";
import { CONTACT_EMAIL, formatDate } from "@/lib/site";

const PATH = "/privacy/";
export const metadata = metaFor(PATH);

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <h1>Privacy policy</h1>
      <Prose>
        <p>Last updated {formatDate(p.lastReviewed)}.</p>
        <h2>The calculators</h2>
        <p>
          Everything you type into a calculator is processed in your own browser. It isn't sent to us or stored on our servers. Your inputs are
          written into the page address so you can bookmark or share a result. Anyone you send that link to will see those numbers.
        </p>
        <h2>Hosting and logs</h2>
        <p>
          The site is hosted by Vercel. Like any web host, Vercel processes basic technical data such as IP addresses and browser type to deliver
          pages and protect against abuse.
        </p>
        <h2>Analytics</h2>
        <p>
          We may use privacy-friendly, cookie-free analytics to count page views and see which calculators are used. These tools don't identify
          you or follow you across other sites.
        </p>
        <h2>Advertising</h2>
        <p>
          SellCalc may show ads served by Google and its partners. Third-party vendors, including Google, use cookies to serve ads based on your
          previous visits to this and other websites. You can opt out of personalised advertising in{" "}
          <a href="https://adssettings.google.com" rel="noopener" target="_blank">Google Ads Settings</a> or at{" "}
          <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">aboutads.info</a>. Where the law requires it, for example
          in the UK and EU, we'll ask for your consent before any advertising cookies are set.
        </p>
        <h2>Your rights</h2>
        <p>
          Because we don't collect personal data through the calculators, there's normally nothing for us to access or delete. If you email us,
          we keep your message only as long as we need it to reply. To ask about your data, write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </Prose>
    </>
  );
}
