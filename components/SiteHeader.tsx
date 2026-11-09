"use client";

import { usePathname } from "next/navigation";
import { abs } from "@/lib/site";

const GROUPS = [
  {
    label: "Etsy",
    links: [
      { href: "/etsy-fee-calculator/", label: "Etsy fees", short: "Etsy" },
      { href: "/etsy-fee-calculator-uk/", label: "Etsy fees UK", short: "Etsy UK" },
    ],
  },
  {
    label: "eBay",
    links: [
      { href: "/ebay-fee-calculator/", label: "eBay fees US", short: "eBay US" },
      { href: "/ebay-fee-calculator-uk/", label: "eBay fees UK", short: "eBay UK" },
    ],
  },
  {
    label: "More",
    links: [
      { href: "/etsy-vs-ebay-fees/", label: "Etsy vs eBay", short: "Etsy vs eBay" },
      { href: "/twitch-bits-to-usd/", label: "Twitch Bits to USD", short: "Twitch Bits" },
    ],
  },
];

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <g transform="rotate(-8 32 32)">
        <rect x="7" y="7" width="50" height="50" rx="12" fill="#f6dd2a" stroke="#14231c" strokeWidth="3.5" />
        <path d="M32 14.5v35" stroke="#14231c" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M41.5 24.5c0-4.2-4.2-6.5-9.5-6.5-5.6 0-9.5 2.8-9.5 7 0 5.2 5.4 6.3 9.5 7 4.6.8 9.7 2 9.7 7.2 0 4.4-4 7-9.7 7-5.6 0-9.7-2.5-10-6.8"
          fill="none"
          stroke="#14231c"
          strokeWidth="5.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function SiteHeader() {
  const path = usePathname() || "/";
  const isOn = (href: string) => path === href || path === href.replace(/\/$/, "");

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="logo" href={abs("/")} aria-label="SellCalc home">
          <LogoMark />
          <span>SellCalc</span>
        </a>

        <nav className="nav-desktop" aria-label="Calculators">
          {GROUPS.map((g) => (
            <ul key={g.label} className="nav-group" aria-label={g.label}>
              {g.links.map((l) => (
                <li key={l.href}>
                  <a href={abs(l.href)} aria-current={isOn(l.href) ? "page" : undefined}>
                    {l.short}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </nav>

        <a className="nav-log" href={abs("/fee-history/")} aria-current={isOn("/fee-history/") ? "page" : undefined}>
          <span className="live-dot" aria-hidden="true" />
          Fee changes
        </a>

        <details className="nav-mobile">
          <summary>
            <span className="burger" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            Menu
          </summary>
          <div className="nav-panel">
            {GROUPS.map((g) => (
              <div key={g.label} className="nav-panel-group">
                <p>{g.label}</p>
                <ul>
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <a href={abs(l.href)} aria-current={isOn(l.href) ? "page" : undefined}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <a className="nav-panel-log" href={abs("/fee-history/")}>
              <span className="live-dot" aria-hidden="true" />
              Fee change log
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
