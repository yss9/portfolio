"use client";

import type { ReactNode } from "react";
import type { DemoScreen } from "@/content/types";
import { cx } from "@/components/ui/primitives";

export function DemoShell({
  appName,
  host,
  screens,
  paths,
  active,
  onChange,
  children,
}: {
  appName: string;
  host: string;
  screens: DemoScreen[];
  paths?: Record<string, string>;
  active: string;
  onChange: (id: string) => void;
  children: ReactNode;
}) {
  const current = screens.find((s) => s.id === active) ?? screens[0];
  const path = paths?.[active] ?? "/";

  return (
    <div
      data-demo-shell={appName}
      className="overflow-hidden rounded-xl border border-line bg-surface"
    >
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-3 py-2.5">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-bg px-2.5 py-1">
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            className="shrink-0 text-faint"
            aria-hidden="true"
          >
            <rect
              x="2.5"
              y="5.5"
              width="7"
              height="5"
              rx="1"
              stroke="currentColor"
              fill="none"
            />
            <path
              d="M4 5.5V4a2 2 0 1 1 4 0v1.5"
              stroke="currentColor"
              fill="none"
            />
          </svg>
          <span className="truncate font-mono text-[11px] text-faint">
            {host}
            <span className="text-ink-dim">{path}</span>
          </span>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-md border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] sm:inline-flex">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          mock data
        </span>
      </div>

      {/* tabs */}
      <div
        role="tablist"
        aria-label={`${appName} 데모 화면`}
        className="scroll-thin flex gap-1 overflow-x-auto border-b border-line bg-bg-soft px-2 py-2"
      >
        {screens.map((s) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={s.id === active}
            onClick={() => onChange(s.id)}
            className={cx(
              "shrink-0 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              s.id === active
                ? "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]"
                : "text-muted hover:bg-surface-2 hover:text-ink-dim"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* caption */}
      {current?.caption && (
        <p className="border-b border-line bg-bg-soft px-4 py-3 text-[12.5px] leading-relaxed text-muted">
          {current.caption}
        </p>
      )}

      {/* screen */}
      <div className="bg-bg">{children}</div>
    </div>
  );
}

/** Standard padded canvas for a demo screen. */
export function DemoCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("p-4 sm:p-5", className)}>{children}</div>
  );
}

/** A labelled inspector strip — used to expose what the backend is doing
 *  (queries fired, tools called, vectors computed) next to the UI. */
export function Inspector({
  title,
  children,
  tone = "default",
}: {
  title: string;
  children: ReactNode;
  tone?: "default" | "gain" | "warn";
}) {
  const tones = {
    default: "border-line bg-surface-2",
    gain: "border-[color-mix(in_srgb,var(--color-gain)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-gain)_7%,transparent)]",
    warn: "border-[color-mix(in_srgb,var(--color-warn)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-warn)_7%,transparent)]",
  } as const;
  return (
    <div className={cx("min-w-0 rounded-lg border p-3.5", tones[tone])}>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
        {title}
      </p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}
