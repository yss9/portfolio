import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projectSlugs, projectNeighbours } from "@/content/projects";
import type { ArchLayer, Troubleshooting } from "@/content/types";
import { Section, Chip, MetaRow, CodeCard, cx } from "@/components/ui/primitives";
import { MetricPanel } from "@/components/ui/Metrics";

export function generateStaticParams() {
  return projectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — ${project.tagline}`,
    description: project.summary,
  };
}

const BAND_LABEL: Record<ArchLayer["band"], string> = {
  client: "Client",
  server: "Server",
  realtime: "Realtime",
  data: "Data",
  external: "External",
  infra: "Infra",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = projectNeighbours(slug);
  return (
    <div data-accent={project.slug}>
      {/* ---------------- hero ---------------- */}
      <header className="relative overflow-hidden border-b border-line bg-bg">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-faint transition-colors hover:text-ink-dim"
          >
            ← 프로젝트 목록
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded border border-blue-200 bg-blue-50 px-2 py-1 font-mono text-[10px] font-semibold text-signal">ARCH · {project.no}</span>
            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 font-mono text-[10px] font-semibold text-emerald-700">DOCUMENTED</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <h1 className="text-4xl font-bold tracking-[-0.035em] text-ink sm:text-6xl">
              {project.name}
            </h1>
          </div>
          <p className="mt-2 text-[15px] text-[var(--accent)] sm:text-base">
            {project.tagline}
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.55fr_0.75fr]">
            <div>
              <p className="max-w-2xl text-[14.5px] leading-relaxed text-ink-dim">
                {project.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.stackFlat.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-3.5 py-2 text-[13px] font-semibold text-ink-dim shadow-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {l.kind === "github" ? "◆" : l.kind === "video" ? "▶" : "↗"} {l.label}
                  </a>
                ))}
              </div>
            </div>

            <dl className="precision-card h-fit rounded-xl p-5">
              <MetaRow label="기간" value={project.period} />
              <MetaRow label="인원" value={project.team} />
              <MetaRow label="역할" value={project.role} />
            </dl>
          </div>
        </div>
      </header>

      {/* ---------------- features ---------------- */}
      <Section id="features" eyebrow="Features" title="구현 기능">
        <ul className="grid gap-3 sm:grid-cols-2">
          {project.features.map((f, i) => (
            <li
              key={f.title}
              className="precision-card rounded-xl p-5 transition-colors hover:-translate-y-0.5"
            >
              <span className="font-mono text-[11px] text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-[15px] font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{f.desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------- architecture ---------------- */}
      <Section
        id="architecture"
        eyebrow="System Architecture"
        title="시스템 구성"
        lead={project.architectureIntent}
      >
        <ol className="space-y-2.5">
          {project.architecture.map((n, i) => (
            <li
              key={n.id}
              className="precision-card grid gap-3 rounded-xl p-4 sm:grid-cols-[auto_200px_1fr] sm:items-center sm:p-5"
            >
              <span className="font-mono text-[11px] text-faint sm:w-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-ink">{n.label}</span>
                <span className="rounded border border-line px-1.5 py-[1px] font-mono text-[9.5px] uppercase tracking-wider text-faint">
                  {BAND_LABEL[n.band]}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-muted">{n.role}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------------- troubleshooting ---------------- */}
      {project.troubleshooting.length > 0 && (
        <Section id="troubleshooting" eyebrow="Troubleshooting" title="문제 해결">
          <div className="space-y-8">
            {project.troubleshooting.map((t) => (
              <TroubleshootingBlock key={t.id} item={t} />
            ))}
          </div>
          {project.troubleshootingNote && (
            <p className="precision-card mt-8 rounded-xl p-5 text-[13.5px] leading-relaxed text-ink-dim">
              {project.troubleshootingNote}
            </p>
          )}
        </Section>
      )}

      {/* ---------------- design notes ---------------- */}
      {project.designNotes && project.designNotes.length > 0 && (
        <Section
          id="design-notes"
          eyebrow="Design Notes"
          title="설계 판단"
          lead="구현 과정에서 선택지를 두고 판단한 지점들입니다."
        >
          <div className="space-y-8">
            {project.designNotes.map((t) => (
              <TroubleshootingBlock key={t.id} item={t} />
            ))}
          </div>
        </Section>
      )}

      {/* ---------------- performance ---------------- */}
      {project.performance.length > 0 && (
        <Section id="performance" eyebrow="Performance" title="성능 개선">
          <div className="space-y-12">
            {project.performance.map((p) => (
              <article key={p.id}>
                <h3 className="text-xl font-semibold tracking-tight text-ink">
                  {p.title}
                </h3>
                <p className="mt-2.5 max-w-3xl text-[14px] leading-relaxed text-muted">
                  {p.summary}
                </p>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <BeforeAfterCard side="before" data={p.before} />
                  <BeforeAfterCard side="after" data={p.after} />
                </div>

                <div className="mt-4">
                  <MetricPanel metrics={p.metrics} condition={p.condition} />
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ---------------- stack ---------------- */}
      <Section id="stack" eyebrow="Tech Stack" title="사용 기술">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {project.stack.map((g) => (
            <div key={g.group} className="precision-card rounded-xl p-5">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
                {g.group}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {g.items.map((i) => (
                  <li key={i}>
                    <Chip>{i}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- pager ---------------- */}
      <nav className="border-t border-line" aria-label="프로젝트 이동">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-12 sm:grid-cols-2 sm:px-8">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="precision-card group rounded-xl p-5 transition-colors hover:-translate-y-0.5"
            >
              <span className="font-mono text-[11px] text-faint">← 이전</span>
              <p className="mt-1.5 text-[15px] font-semibold text-ink">{prev.name}</p>
              <p className="mt-0.5 text-[12.5px] text-muted">{prev.tagline}</p>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="precision-card group rounded-xl p-5 text-right transition-colors hover:-translate-y-0.5"
            >
              <span className="font-mono text-[11px] text-faint">다음 →</span>
              <p className="mt-1.5 text-[15px] font-semibold text-ink">{next.name}</p>
              <p className="mt-0.5 text-[12.5px] text-muted">{next.tagline}</p>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TroubleshootingBlock({ item }: { item: Troubleshooting }) {
  return (
    <article className="precision-card rounded-xl p-5 sm:p-7">
      <h3 className="text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
      <p className="mt-3 border-l-2 border-[var(--accent)] pl-4 text-[14px] leading-relaxed text-ink-dim">
        {item.problem}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <ol className="min-w-0 space-y-4">
          {item.steps.map((s) => (
            <li key={s.label + s.title} className="flex gap-3.5">
              <span className="mt-0.5 grid h-6 shrink-0 place-items-center rounded border border-line bg-surface-2 px-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                {s.label}
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {item.code && item.code.length > 0 && (
          <div className="min-w-0 space-y-3">
            {item.code.map((c, i) => (
              <CodeCard
                key={i}
                filename={c.filename}
                language={c.language}
                code={c.code}
              />
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 rounded-lg border border-line bg-bg-soft p-4 text-[13.5px] leading-relaxed text-ink-dim">
        <span className="mr-2 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
          결과
        </span>
        {item.takeaway}
      </p>
    </article>
  );
}

function BeforeAfterCard({
  side,
  data,
}: {
  side: "before" | "after";
  data: { label: string; code: { language: string; code: string }; notes?: string[] };
}) {
  return (
    <div
      className={cx(
        "min-w-0 rounded-xl border p-5",
        side === "after"
          ? "border-[color-mix(in_srgb,var(--color-gain)_28%,transparent)] bg-[color-mix(in_srgb,var(--color-gain)_5%,transparent)]"
          : "border-line bg-surface"
      )}
    >
      <h4
        className={cx(
          "font-mono text-[11px] uppercase tracking-[0.14em]",
          side === "after" ? "text-gain" : "text-faint"
        )}
      >
        {data.label}
      </h4>
      <div className="mt-3">
        <CodeCard language={data.code.language} code={data.code.code} />
      </div>
      {data.notes && (
        <ul className="mt-3.5 space-y-1.5">
          {data.notes.map((n) => (
            <li key={n} className="flex gap-2 text-[12.5px] leading-relaxed text-muted">
              <span
                className={cx(
                  "mt-[7px] h-1 w-1 shrink-0 rounded-full",
                  side === "after" ? "bg-gain" : "bg-faint"
                )}
              />
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
