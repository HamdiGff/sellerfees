import type { Metadata } from "next";
import type { ReactNode } from "react";
import { page, PAGES, type PageDef } from "@/lib/registry";
import { abs, formatDate, SITE_NAME, SITE_URL } from "@/lib/site";

export function metaFor(path: string): Metadata {
  const p = page(path);
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: abs(p.path) },
    openGraph: { title: p.title, description: p.description, url: abs(p.path), siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary_large_image", title: p.title, description: p.description },
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function breadcrumbLd(p: PageDef) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
      { "@type": "ListItem", position: 2, name: p.short, item: abs(p.path) },
    ],
  };
}

export function toolLd(p: PageDef) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: p.short.replace(/^\w/, (c) => c.toUpperCase()) + " calculator",
    url: abs(p.path),
    description: p.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: p.lastReviewed,
    publisher: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
  };
}

export function Crumbs({ p }: { p: PageDef }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <a href={abs("/")}>Home</a>
      <span aria-hidden="true">/</span>
      <span>{p.short}</span>
    </nav>
  );
}

export function Sources({ items, verifiedOn }: { items: readonly { label: string; url: string }[]; verifiedOn: string }) {
  return (
    <aside className="sources">
      <h2>Where these numbers come from</h2>
      <p>
        Checked against the official pages on <strong>{formatDate(verifiedOn)}</strong>. Spotted a change before we did?{" "}
        <a href={abs("/contact/")}>Tell us</a> and we'll fix it.
      </p>
      <ul>
        {items.map((s) => (
          <li key={s.url}>
            <a href={s.url} rel="noopener" target="_blank">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Related({ paths }: { paths?: string[] }) {
  if (!paths?.length) return null;
  const list = paths.map((x) => PAGES.find((p) => p.path === x)).filter(Boolean) as PageDef[];
  return (
    <aside className="related">
      <h2>Also useful</h2>
      <ul>
        {list.map((p) => (
          <li key={p.path}>
            <a href={abs(p.path)}>
              <strong>{p.short}</strong>
              <span>{p.blurb}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose">{children}</div>;
}
