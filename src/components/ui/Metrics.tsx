import type { Metric } from "@/content/types";
import { cx } from "./primitives";

/** Pull the leading number out of "147.85ms", "748KB", "1001", "0%".
 *  Both sides of a row always share a unit, so the raw value is comparable. */
function numeric(v: string): number | null {
  const m = v.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? Number.parseFloat(m[0]) : null;
}

/** Bars are strictly proportional — a log scale would make a 1001 → 1 drop
 *  look like a modest one. The 1.2% floor only keeps a near-zero bar visible;
 *  it never inflates a value enough to change how the pair reads. */
function barWidths(before: string, after: string) {
  const b = numeric(before);
  const a = numeric(after);
  if (b === null || a === null || b < 0 || a < 0) return null;
  const max = Math.max(b, a);
  if (max <= 0) return null;
  const scale = (v: number) => Math.max(1.2, (v / max) * 100);
  return { before: scale(b), after: scale(a) };
}

export function MetricRow({ metric }: { metric: Metric }) {
  const bars = barWidths(metric.before, metric.after);
  const unchanged = metric.before === metric.after;

  return (
    <div className="py-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[13px] font-medium text-ink-dim">{metric.label}</span>
        {metric.delta ? (
          <span className="tnum shrink-0 rounded-md border border-[color-mix(in_srgb,var(--color-gain)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-gain)_10%,transparent)] px-2 py-[3px] font-mono text-[11px] font-semibold text-gain">
            {metric.delta}
          </span>
        ) : unchanged ? (
          <span className="shrink-0 font-mono text-[11px] text-faint">유지</span>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-3">
          <span className="tnum w-24 shrink-0 text-right font-mono text-[13px] text-faint line-through decoration-faint/50">
            {metric.before}
          </span>
          <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-line-strong"
              style={{ width: `${bars ? bars.before : 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="tnum w-24 shrink-0 text-right font-mono text-[15px] font-semibold text-gain">
            {metric.after}
          </span>
          <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className={cx(
                "h-full rounded-full",
                unchanged ? "bg-line-strong" : "bg-gain"
              )}
              style={{ width: `${bars ? bars.after : 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetricPanel({
  metrics,
  condition,
}: {
  metrics: Metric[];
  condition?: string;
}) {
  return (
    <div className="precision-card rounded-xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
          Measured Result
        </h4>
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          before → after
        </span>
      </div>
      <div className="divide-y divide-line/70">
        {metrics.map((m) => (
          <MetricRow key={m.label} metric={m} />
        ))}
      </div>
      {condition && (
        <p className="mt-4 border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-faint">
          {condition}
        </p>
      )}
    </div>
  );
}

/** Compact headline stat used on the home page. */
export function StatTile({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="tnum font-mono text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {value}
      </div>
      <div className="mt-2 text-[13px] font-medium text-ink-dim">{label}</div>
      {sub && <div className="mt-1 text-[12px] text-faint">{sub}</div>}
    </div>
  );
}
