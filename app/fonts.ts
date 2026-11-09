import localFont from "next/font/local";

// Self-hosted (SIL Open Font License). No request to Google at build or runtime.
export const display = localFont({
  src: "./fonts/bricolage.woff2",
  variable: "--font-display",
  weight: "200 800",
  display: "swap",
});

export const text = localFont({
  src: "./fonts/onest.woff2",
  variable: "--font-text",
  weight: "100 900",
  display: "swap",
});
