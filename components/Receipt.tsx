"use client";

import type { FeeResult } from "@/lib/engines/common";
import { money, ShareButton } from "./ui";

export function Receipt({ result, title, verifiedOn }: { result: FeeResult; title: string; verifiedOn: string }) {
  const c = result.currency;
  const pctText = `${(result.feeShare * 100).toFixed(1)}%`;
  return (
    <section className="receipt" aria-live="polite" aria-label="Fee breakdown">
      <div className="receipt-head">
        <span className="receipt-title">{title}</span>
        <span className="receipt-date">rates checked {verifiedOn}</span>
      </div>

      <div className="receipt-row strong">
        <span>Buyer pays you (item + shipping)</span>
        <span className="num">{money(result.gross, c)}</span>
      </div>

      <ul className="receipt-lines">
        {result.lines.map((l) => (
          <li key={l.key}>
            <div className="receipt-row">
              <span>{l.label}</span>
              <span className="num">{l.amount === 0 ? money(0, c) : `−${money(l.amount, c)}`}</span>
            </div>
            <p className="receipt-detail">{l.detail}</p>
          </li>
        ))}
      </ul>

      <div className="receipt-row total">
        <span>Total fees</span>
        <span className="num">
          −{money(result.totalFees, c)} <small>({pctText})</small>
        </span>
      </div>
      <div className="receipt-row payout">
        <span>You take home</span>
        <span className="num">{money(result.payout, c)}</span>
      </div>
      <div className={`receipt-row profit ${result.profit < 0 ? "neg" : ""}`}>
        <span>Profit after your costs</span>
        <span className="num">{money(result.profit, c)}</span>
      </div>

      <div className="receipt-foot">
        <ShareButton />
      </div>
    </section>
  );
}
