import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose } from "@/components/Shell";
import { page } from "@/lib/registry";
import { CONTACT_EMAIL } from "@/lib/site";

const PATH = "/contact/";
export const metadata = metaFor(PATH);

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <h1>Contact</h1>
      <Prose>
        <p className="lede">
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We read everything, and fee corrections jump the queue.
        </p>
        <h2>Reporting a wrong fee</h2>
        <p>These details help us fix it the same day:</p>
        <ul>
          <li>Which calculator, and the inputs you used (the page link includes them).</li>
          <li>What your platform statement or the fee page says instead.</li>
          <li>A link to the platform's page, if you have one.</li>
        </ul>
        <h2>Suggesting a platform</h2>
        <p>
          Tell us which marketplace or creator platform you sell on and which country you sell from. We add the ones people ask for most, as long
          as the platform publishes its fees clearly enough for us to check.
        </p>
        <p>We can't give tax or legal advice, or help with your account on another platform.</p>
      </Prose>
    </>
  );
}
