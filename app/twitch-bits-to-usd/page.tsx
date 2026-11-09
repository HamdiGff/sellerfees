import { TwitchBitsCalculator } from "@/components/SmallTools";
import { breadcrumbLd, Crumbs, JsonLd, metaFor, Prose, Related, Sources, toolLd } from "@/components/Shell";
import { page } from "@/lib/registry";

const PATH = "/twitch-bits-to-usd/";
export const metadata = metaFor(PATH);

const rows = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000];

export default function Page() {
  const p = page(PATH);
  return (
    <>
      <JsonLd data={toolLd(p)} />
      <JsonLd data={breadcrumbLd(p)} />
      <Crumbs p={p} />
      <h1>Twitch Bits to USD</h1>
      <p className="lede">
        One Bit cheered is worth one cent to the streamer. That's the whole rule, and it doesn't change with channel size or the bundle the viewer
        bought. Type any number of Bits, or flip it round and see how many Bits a goal needs.
      </p>

      <TwitchBitsCalculator />

      <Prose>
        <h2>Bits to dollars at a glance</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Bits cheered</th>
                <th className="num">Streamer receives</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b}>
                  <td>{b.toLocaleString("en-US")}</td>
                  <td className="num">${(b / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Why viewers pay more than a cent</h2>
        <p>
          Viewers buy Bits from Twitch in bundles, and the price per Bit is higher than what the streamer gets. The smallest desktop bundle has
          long been 100 Bits for $1.40, with bigger bundles working out cheaper per Bit. Mobile purchases cost more again because of app store
          fees. The gap between what the viewer pays and the cent the streamer gets is Twitch's share. The streamer's side doesn't move.
        </p>

        <h2>When the money actually arrives</h2>
        <p>
          Bits add to the streamer's revenue balance straight away, but to get paid you need to be a Twitch Affiliate or Partner and reach the
          payout threshold, usually $50 for most payout methods. Twitch pays monthly, within about 45 days of the end of the month. Tax
          withholding depends on your country and tax interview, so the dollar figure above is before tax.
        </p>
        <p>
          Bits used in Extensions can work differently from Cheers. Some Extensions share a cut with the developer, so they may pay the streamer
          less than a cent per Bit.
        </p>
      </Prose>

      <Sources
        items={[
          { label: "TechCrunch: Twitch makes the cheering rate clear — one penny per Bit", url: "https://techcrunch.com/?p=1345466" },
          { label: "KitGuru: Twitch clarifies cheer value, one Bit equals a cent", url: "https://www.kitguru.net/gaming/jon-martindale/twitch-clarifies-cheer-value-one-bit-equals-a-cent/" },
        ]}
        verifiedOn="2026-11-09"
      />
      <Related paths={["/etsy-fee-calculator/", "/fee-history/"]} />
    </>
  );
}
