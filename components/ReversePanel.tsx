"use client";

import { useMemo, useState } from "react";
import { solvePrice } from "@/lib/engines/common";
import { money, SYMBOL } from "./ui";

/**
 * "What should I charge?" — finds the item price that reaches a target
 * take-home or profit with every other input held as entered.
 */
export function ReversePanel({
  currency,
  evaluate,
  onUse,
}: {
  currency: string;
  evaluate: (mode: "payout" | "profit") => (price: number) => number;
  onUse: (price: number) => void;
}) {
  const [mode, setMode] = useState<"payout" | "profit">("profit");
  const [target, setTarget] = useState(25);
  const price = useMemo(() => (target > 0 ? solvePrice(target, evaluate(mode)) : null), [target, mode, evaluate]);

  return (
    <section className="reverse" aria-label="Find the price you need">
      <h2 className="reverse-title">Work backwards</h2>
      <div className="reverse-sentence">
        <span>I want to</span>
        <select aria-label="Target type" value={mode} onChange={(e) => setMode(e.target.value as "payout" | "profit")}>
          <option value="profit">make a profit of</option>
          <option value="payout">take home</option>
        </select>
        <span className="input-wrap small">
          <span className="affix" aria-hidden="true">{SYMBOL[currency] ?? currency}</span>
          <input aria-label="Target amount" type="number" inputMode="decimal" min={0} step={0.5} value={target} onChange={(e) => setTarget(Number(e.target.value) || 0)} />
        </span>
      </div>
      {price !== null ? (
        <p className="reverse-answer">
          List the item at <strong>{money(price, currency)}</strong>
          <button type="button" className="btn-link" onClick={() => onUse(price)}>
            use this price
          </button>
        </p>
      ) : (
        <p className="reverse-answer muted">Enter a target above zero.</p>
      )}
      <p className="hint">Shipping, costs and options stay as you set them above.</p>
    </section>
  );
}
