import { FEE_HISTORY } from "./data/history";

const cols = ["date", "kind", "platform", "market", "fee", "from", "to", "summary", "source"] as const;

const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function historyCsv(): string {
  const head = cols.join(",");
  const rows = FEE_HISTORY.map((r) => cols.map((c) => esc(String(r[c]))).join(","));
  return [head, ...rows].join("\n") + "\n";
}

export function historyJson() {
  return {
    name: "SellCalc marketplace fee change log",
    license: "CC BY 4.0 — credit SellCalc with a link",
    updated: new Date().toISOString().slice(0, 10),
    changes: FEE_HISTORY,
  };
}
