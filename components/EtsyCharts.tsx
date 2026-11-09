// Server-rendered SVG charts for the Etsy page. Data comes from the same
// engine as the calculator, so the charts update when the fee data does.
import { ETSY_COUNTRIES, type EtsyCountryCode } from "@/lib/data/etsy";
import { etsyFees } from "@/lib/engines/etsy";

// Validated categorical order (validate_palette.js, light surface #f8faf7: all checks pass).
const SERIES = [
  { key: "none", label: "No ad", color: "#12784a", dash: "" },
  { key: "12", label: "Offsite Ad at 12%", color: "#2f5fb3", dash: "6 4" },
  { key: "15", label: "Offsite Ad at 15%", color: "#c2610c", dash: "2 4" },
] as const;

const W = 720;
const H = 360;
const M = { top: 20, right: 150, bottom: 44, left: 48 };

export function EtsyShareChart() {
  const xs: number[] = [];
  for (let p = 5; p <= 200; p += 1) xs.push(p);
  const yMax = 0.4;
  const x = (p: number) => M.left + ((p - 5) / 195) * (W - M.left - M.right);
  const y = (v: number) => M.top + (1 - v / yMax) * (H - M.top - M.bottom);

  const lines = SERIES.map((s) => {
    const pts = xs.map((p) => ({ p, v: etsyFees({ country: "US", itemPrice: p, shippingCharged: 0, offsiteAds: s.key, taxOnFees: 0 }).feeShare }));
    return { ...s, pts, d: pts.map((pt, i) => `${i ? "L" : "M"}${x(pt.p).toFixed(1)},${y(pt.v).toFixed(1)}`).join("") };
  });
  const marks = [5, 10, 25, 50, 100, 200];

  return (
    <figure className="chart">
      <figcaption>
        <strong>Etsy's share of a US sale, by item price</strong>
        <span>Listing, transaction and processing fees as a percentage of the price, free shipping, no sales tax.</span>
      </figcaption>
      <ul className="chart-legend" aria-hidden="true">
        {SERIES.map((s) => (
          <li key={s.key}>
            <svg width="26" height="10">
              <line x1="0" y1="5" x2="26" y2="5" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dash} />
            </svg>
            {s.label}
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Line chart: Etsy fees fall from about 18% of a $5 sale to under 10% at $200 without ads, and stay between 21% and 34% for sales from an Offsite Ad.">
        {[0, 0.1, 0.2, 0.3, 0.4].map((t) => (
          <g key={t}>
            <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} className="grid" />
            <text x={M.left - 8} y={y(t) + 4} textAnchor="end" className="tick">
              {t * 100}%
            </text>
          </g>
        ))}
        {[5, 25, 50, 100, 150, 200].map((t) => (
          <text key={t} x={x(t)} y={H - M.bottom + 20} textAnchor="middle" className="tick">
            ${t}
          </text>
        ))}
        <text x={(M.left + W - M.right) / 2} y={H - 6} textAnchor="middle" className="axis-title">
          Item price
        </text>
        {lines.map((l) => (
          <g key={l.key}>
            <path d={l.d} fill="none" stroke={l.color} strokeWidth="2.5" strokeDasharray={l.dash} strokeLinejoin="round" />
            {l.pts
              .filter((pt) => marks.includes(pt.p))
              .map((pt) => (
                <circle key={pt.p} cx={x(pt.p)} cy={y(pt.v)} r="5" fill={l.color} stroke="#f8faf7" strokeWidth="2">
                  <title>{`${l.label}: ${(pt.v * 100).toFixed(1)}% of a $${pt.p} sale`}</title>
                </circle>
              ))}
            <text x={W - M.right + 10} y={y(l.pts[l.pts.length - 1].v) + 4} className="end-label">
              {(l.pts[l.pts.length - 1].v * 100).toFixed(1)}% {l.key === "none" ? "no ad" : `ad ${l.key}%`}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

export function EtsyCountryChart({ price = 50 }: { price?: number }) {
  const rows = (Object.keys(ETSY_COUNTRIES) as EtsyCountryCode[])
    .map((code) => {
      const c = ETSY_COUNTRIES[code];
      const r = etsyFees({ country: code, itemPrice: price, shippingCharged: 0, offsiteAds: "none" });
      return { code, name: c.name, share: r.feeShare, fees: r.totalFees, currency: c.currency };
    })
    .sort((a, b) => a.share - b.share);
  const max = Math.max(...rows.map((r) => r.share));
  const rowH = 34;
  const labelW = 130;
  const W2 = 640;
  const barMax = W2 - labelW - 70;
  const H2 = rows.length * rowH + 8;

  return (
    <figure className="chart">
      <figcaption>
        <strong>Fees on a 50-unit sale, by shop country</strong>
        <span>$50, £50 or €50 item, free shipping, no ads, seller not VAT/GST-registered.</span>
      </figcaption>
      <svg viewBox={`0 0 ${W2} ${H2}`} role="img" aria-label={`Bar chart of Etsy fees on a 50 unit sale by country, from ${(rows[0].share * 100).toFixed(1)}% in ${rows[0].name} to ${(rows[rows.length - 1].share * 100).toFixed(1)}% in ${rows[rows.length - 1].name}.`}>
        {rows.map((r, i) => {
          const w = Math.max(4, (r.share / max) * barMax);
          const yy = 4 + i * rowH;
          return (
            <g key={r.code}>
              <text x={labelW - 10} y={yy + 20} textAnchor="end" className="bar-label">
                {r.name}
              </text>
              <path d={`M${labelW},${yy + 6} h${w - 4} a4,4 0 0 1 4,4 v12 a4,4 0 0 1 -4,4 h-${w - 4} z`} fill="#12784a">
                <title>{`${r.name}: ${r.fees.toFixed(2)} ${r.currency} in fees (${(r.share * 100).toFixed(1)}%)`}</title>
              </path>
              <text x={labelW + w + 8} y={yy + 20} className="bar-value">
                {(r.share * 100).toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
