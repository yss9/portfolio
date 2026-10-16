import type { NumberViz as Viz } from "@/content/types";

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, ""));

/** Proportional bars only — no log scales, so a big drop reads as big. */
export function NumberViz({ viz, compact = false }: { viz: Viz; compact?: boolean }) {
  return (
    <figure className={compact ? "numviz is-compact" : "numviz"}>
      <figcaption className="numviz-title">{viz.title}</figcaption>
      {viz.kind === "split" && <Split parts={viz.parts} />}
      {viz.kind === "compare" && <Compare {...viz} />}
      {viz.kind === "checks" && <Checks items={viz.items} />}
      {viz.kind === "stat" && <p className="numviz-stat">{viz.value}</p>}
      {viz.note && <p className="numviz-note">{viz.note}</p>}
    </figure>
  );
}

function Split({ parts }: { parts: { label: string; value: number; emphasis?: boolean }[] }) {
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  return (
    <>
      <p className="numviz-total">
        <b>{total}</b>개
      </p>
      <div className="numviz-split" role="img" aria-label={parts.map((p) => `${p.label} ${p.value}`).join(", ")}>
        {parts.map((part, index) => (
          <span
            key={part.label}
            className={part.emphasis ? "is-emphasis" : `is-tone-${index % 3}`}
            style={{ width: `${(part.value / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="numviz-legend">
        {parts.map((part, index) => (
          <li key={part.label}>
            <i className={part.emphasis ? "is-emphasis" : `is-tone-${index % 3}`} aria-hidden="true" />
            {part.label}
            <b>{part.value}</b>
          </li>
        ))}
      </ul>
    </>
  );
}

function Compare({ before, after, unit, delta }: { before: number; after: number; unit: string; delta: string }) {
  const max = Math.max(before, after);
  const width = (v: number) => `${Math.max(1.5, (v / max) * 100)}%`;
  return (
    <div className="numviz-compare">
      <div className="numviz-row">
        <span className="numviz-key">전</span>
        <span className="numviz-bar is-before" style={{ width: width(before) }} />
        <span className="numviz-value">
          {fmt(before)}
          {unit}
        </span>
      </div>
      <div className="numviz-row">
        <span className="numviz-key">후</span>
        <span className="numviz-bar is-after" style={{ width: width(after) }} />
        <span className="numviz-value is-after">
          {fmt(after)}
          {unit}
        </span>
      </div>
      <span className="numviz-delta">{delta}</span>
    </div>
  );
}

function Checks({ items }: { items: string[] }) {
  return (
    <>
      <p className="numviz-total">
        <b>{items.length}</b>가지
      </p>
      <ul className="numviz-checks">
        {items.map((item) => (
          <li key={item}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
