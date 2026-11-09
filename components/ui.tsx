"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type Primitive = string | number | boolean;

/**
 * Keeps calculator inputs in the query string so any result can be shared or
 * bookmarked. Reads once on mount, then writes back with replaceState.
 */
type Widen<T> = { [K in keyof T]: T[K] extends boolean ? boolean : T[K] extends number ? number : string };

export function useUrlState<D extends Record<string, Primitive>>(initial: D): [Widen<D>, (patch: Partial<Widen<D>>) => void] {
  type T = Widen<D>;
  const defaults = initial as unknown as T;
  const [state, setState] = useState<T>(defaults);
  const loaded = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = { ...defaults };
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const raw = params.get(String(key));
      if (raw === null) continue;
      const d = defaults[key];
      if (typeof d === "number") {
        const n = Number(raw);
        if (Number.isFinite(n)) next[key] = n as T[keyof T];
      } else if (typeof d === "boolean") {
        next[key] = (raw === "1" || raw === "true") as T[keyof T];
      } else {
        next[key] = raw as T[keyof T];
      }
    }
    setState(next);
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(state)) {
      if (v === defaults[k as keyof T]) continue;
      params.set(k, typeof v === "boolean" ? (v ? "1" : "0") : String(v));
    }
    const q = params.toString();
    const url = `${window.location.pathname}${q ? `?${q}` : ""}`;
    window.history.replaceState(null, "", url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return [state, (patch) => setState((s) => ({ ...s, ...patch }))];
}

import { money, SYMBOL } from "@/lib/format";
export { money, SYMBOL };

type FieldProps = { id: string; label: string; hint?: ReactNode };

export function MoneyField({ id, label, hint, value, onChange, currency, step = 0.01 }: FieldProps & { value: number; onChange: (n: number) => void; currency: string; step?: number }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <span className="affix" aria-hidden="true">{SYMBOL[currency] ?? currency}</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      </div>
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

export function PercentField({ id, label, hint, value, onChange, max = 100 }: FieldProps & { value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={0.1}
          value={Number.isFinite(value) ? Number((value * 100).toFixed(4)) : ""}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value) / 100)}
        />
        <span className="affix affix-end" aria-hidden="true">%</span>
      </div>
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

export function SelectField({ id, label, hint, value, onChange, options }: FieldProps & { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

export function Segmented({ label, value, onChange, options, name }: { label: string; name: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <fieldset className="segmented">
      <legend>{label}</legend>
      <div className="seg-row">
        {options.map((o) => (
          <label key={o.value} className={value === o.value ? "on" : ""}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Check({ id, label, checked, onChange, hint }: FieldProps & { checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <div className="check">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <label htmlFor={id}>
        {label}
        {hint ? <span className="hint"> {hint}</span> : null}
      </label>
    </div>
  );
}

export function ShareButton() {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost"
      onClick={async () => {
        const url = window.location.href;
        try {
          if (navigator.share) await navigator.share({ title: document.title, url });
          else await navigator.clipboard.writeText(url);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* user cancelled */
        }
      }}
    >
      {done ? "Link copied" : "Share this result"}
    </button>
  );
}
