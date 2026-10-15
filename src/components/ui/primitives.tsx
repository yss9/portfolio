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
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        {(eyebrow || title) && (
          <header className="mb-10 max-w-3xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl">
                {title}
              </h2>
            )}
            {lead && (
              <p className="mt-4 text-base leading-8 text-muted">{lead}</p>
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
    <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
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
        "inline-flex items-center rounded-full border px-2.5 py-1.5 font-mono text-xs font-semibold leading-none tracking-tight",
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
        "precision-card rounded-xl transition-colors",
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
      <dt className="w-20 shrink-0 font-mono text-xs uppercase tracking-wider text-faint">
        {label}
      </dt>
      <dd className="text-[15px] leading-7 text-ink-dim">{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

export function AwardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Code                                                                */
/* ------------------------------------------------------------------ */

const KEYWORDS = new Set([
  "public", "private", "protected", "final", "static", "void", "return",
  "if", "else", "for", "while", "new", "class", "record", "throw", "throws",
  "try", "catch", "var", "boolean", "int", "long", "import", "package",
  "this", "null", "true", "false", "interface", "extends", "implements",
  "SELECT", "FROM", "WHERE", "ORDER", "BY", "LIMIT", "INSERT", "IGNORE",
  "INTO", "VALUES", "AND", "OR", "DESC", "ASC", "UPDATE", "SET",
]);

const TOKEN =
  /(\/\/.*$|^\s*(?:\/\*\*|\*\/|\*(?=\s|$)).*$|--\s.*$|#\s.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@[A-Za-z]\w*)|\b([A-Za-z_]\w*)\b/g;

/** Line-level highlighter: comments, strings, annotations and keywords only. */
function highlight(line: string, lineIndex: number) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const [text, comment, str, annotation, word] = match;
    const at = match.index ?? 0;
    let cls: string | undefined;
    if (comment) cls = "tok-comment";
    else if (str) cls = "tok-string";
    else if (annotation) cls = "tok-annotation";
    else if (word && KEYWORDS.has(word)) cls = "tok-keyword";
    if (!cls) continue;
    if (at > last) out.push(line.slice(last, at));
    out.push(
      <span key={`${lineIndex}-${at}`} className={cls}>
        {text}
      </span>,
    );
    last = at + text.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function CodeCard({
  filename,
  fileTitle,
  language,
  code,
  caption,
  meta,
  className,
}: {
  filename?: string;
  /** full path, shown on hover when `filename` is shortened */
  fileTitle?: string;
  language?: string;
  code: string;
  caption?: ReactNode;
  meta?: string;
  className?: string;
}) {
  const lines = code.split("\n");
  return (
    <figure className={cx("code-card", className)}>
      {(filename || language) && (
        <figcaption>
          <span className="code-card-file" title={fileTitle}>
            {filename ?? ""}
          </span>
          <span className="code-card-meta">{meta ?? language}</span>
        </figcaption>
      )}
      {caption && <p className="code-card-caption">{caption}</p>}
      <pre>
        <code>
          {lines.map((line, index) => (
            <span key={index}>
              {highlight(line, index)}
              {index < lines.length - 1 ? "\n" : null}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
