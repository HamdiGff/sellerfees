import localFont from "next/font/local";

// Self-hosted (SIL Open Font License). No request to Google at build or runtime.
export const display = localFont({
  src: "./fonts/bricolage.woff2",
  variable: "--font-display",
  weight: "200 800",
  display: "swap",
});

export const text = localFont({
  src: "./fonts/atkinson.woff2",
  variable: "--font-text",
  weight: "200 800",
  display: "swap",
});

export const mono = localFont({
  src: "./fonts/atkinson-mono.woff2",
  variable: "--font-mono",
  weight: "200 800",
  display: "swap",
  preload: false,
});
