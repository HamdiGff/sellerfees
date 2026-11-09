import type { Metadata, Viewport } from "next";
import "./globals.css";
import { display, mono, text } from "./fonts";
import { abs, DATA_VERIFIED, formatDate, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: "SellCalc — fee calculators for online sellers", template: `%s | ${SITE_NAME}` },
  description: "Free fee calculators for Etsy, eBay and creator platforms, with every fee line explained and linked to its official source.",
  applicationName: SITE_NAME,
};

export const viewport: Viewport = {
  themeColor: "#eef1ed",
  width: "device-width",
  initialScale: 1,
};

const nav = [
  { href: "/etsy-fee-calculator/", label: "Etsy" },
  { href: "/ebay-fee-calculator/", label: "eBay US" },
  { href: "/ebay-fee-calculator-uk/", label: "eBay UK" },
  { href: "/etsy-vs-ebay-fees/", label: "Compare" },
  { href: "/fee-history/", label: "Fee history" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="wrap header-inner">
            <a className="logo" href={abs("/")} aria-label="SellCalc home">
              <span className="logo-mark" aria-hidden="true">
                $
              </span>
              SellCalc
            </a>
            <nav aria-label="Main">
              <ul>
                {nav.map((n) => (
                  <li key={n.href}>
                    <a href={abs(n.href)}>{n.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main id="main" className="wrap">
          {children}
        </main>
        <footer className="site-footer">
          <div className="wrap footer-inner">
            <div>
              <p className="logo small">SellCalc</p>
              <p>Fee data last checked {formatDate(DATA_VERIFIED)}. Estimates only — your platform's own statement is final.</p>
            </div>
            <ul>
              <li><a href={abs("/methodology/")}>How we check fees</a></li>
              <li><a href={abs("/fee-history/")}>Fee change log</a></li>
              <li><a href={abs("/about/")}>About</a></li>
              <li><a href={abs("/contact/")}>Contact</a></li>
              <li><a href={abs("/privacy/")}>Privacy</a></li>
              <li><a href={abs("/terms/")}>Terms</a></li>
            </ul>
          </div>
        </footer>
      </body>
    </html>
  );
}
