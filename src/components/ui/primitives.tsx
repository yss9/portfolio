import type { ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Section scaffolding                                                 */
/* ------------------------------------------------------------------ */

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cx("border-t border-line", className)}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        {(eyebrow || title) && (
          <header className="mb-12 max-w-3xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {title}
              </h2>
            )}
            {lead && (
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{lead}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

export function Chip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "ghost";
}) {
  const tones = {
    default: "border-line bg-surface-2 text-ink-dim",
    accent:
      "border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]",
    ghost: "border-line/60 bg-transparent text-muted",
  } as const;
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md border px-2 py-[3px] font-mono text-[11px] leading-none tracking-tight",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag
      className={cx(
        "rounded-xl border border-line bg-surface transition-colors",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/** Label/value row used in the project meta blocks. */
export function MetaRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-line/70 py-2.5 last:border-0">
      <dt className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-wider text-faint">
        {label}
      </dt>
      <dd className="text-[13.5px] leading-relaxed text-ink-dim">{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Code                                                                */
/* ------------------------------------------------------------------ */

export function CodeCard({
  filename,
  language,
  code,
  className,
}: {
  filename?: string;
  language?: string;
  code: string;
  className?: string;
}) {
  return (
    <figure
      className={cx(
        "min-w-0 overflow-hidden rounded-lg border border-line bg-[#0b0b0f]",
        className
      )}
    >
      {(filename || language) && (
        <figcaption className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-3 py-2">
          <span className="truncate font-mono text-[11px] text-ink-dim">
            {filename ?? ""}
          </span>
          {language && (
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint">
              {language}
            </span>
          )}
        </figcaption>
      )}
      <pre className="scroll-thin overflow-x-auto px-4 py-3.5">
        <code className="font-mono text-[12.5px] leading-[1.65] text-ink-dim">
          {code}
        </code>
      </pre>
    </figure>
  );
}
