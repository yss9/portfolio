import type { Metadata } from "next";
import Image from "next/image";
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
            className="inline-flex items-center gap-1.5 font-mono text-[13px] text-faint transition-colors hover:text-ink-dim"
          >
            ← 프로젝트 목록
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-xs font-semibold text-signal">ARCH · {project.no}</span>
            <span className="rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-700">DOCUMENTED</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <h1 className="text-4xl font-bold tracking-[-0.035em] text-ink sm:text-6xl">
              {project.name}
            </h1>
          </div>
          <p className="mt-3 text-lg font-medium text-[var(--accent)]">
            {project.tagline}
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.55fr_0.75fr]">
            <div>
              <p className="max-w-2xl text-base leading-8 text-ink-dim">
                {project.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-4 py-2.5 text-[15px] font-semibold text-ink-dim shadow-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
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

      {project.screenshots && project.screenshots.length > 0 && (
        <Section
          id="screens"
          eyebrow="Real Service Screens"
          title="실제 서비스 화면"
          lead="실제 서비스의 주요 화면을 모았습니다."
        >
          <div
            className={cx(
              "grid overflow-hidden rounded-xl border border-line bg-line",
              project.slug === "potner"
                ? "grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
                : "grid-cols-1 gap-px sm:grid-cols-2"
            )}
          >
            {project.screenshots.slice(0, 4).map((screen, index) => (
              <figure
                key={screen.src}
                className={cx(
                  "overflow-hidden bg-white",
                  project.slug === "potner" && "rounded-xl border border-line"
                )}
              >
                <div
                  className={cx(
                    "relative overflow-hidden bg-white",
                    project.slug === "potner"
                      ? "aspect-[9/19]"
                      : "aspect-[16/10]"
                  )}
                >
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className={cx(
                      project.slug === "potner"
                        ? "object-contain"
                        : "object-cover object-top"
                    )}
                    priority={index === 0}
                  />
                </div>
                <figcaption className="border-t border-line px-5 py-4 text-[15px] leading-7 text-ink-dim">
                  <span className="mr-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    Screen {String(index + 1).padStart(2, "0")}
                  </span>
                  {screen.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* ---------------- features ---------------- */}
      <Section id="features" eyebrow="Features" title="구현 기능">
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {project.features.map((f, i) => (
            <li key={f.title}>
              <details className="precision-card group rounded-xl">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-5 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-[13px] text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-base font-semibold text-ink">{f.title}</span>
                  {f.category && (
                    <span className="hidden rounded border border-line bg-bg-soft px-2 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-muted sm:inline">
                      {f.category}
                    </span>
                  )}
                  <span className="text-lg leading-none text-faint transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="border-t border-line px-5 py-4 text-[15px] leading-7 text-muted">{f.desc}</p>
              </details>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------- stack ---------------- */}
      <Section id="stack" eyebrow="Tech Stack" title="사용 기술">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {project.stack.map((g) => (
            <div key={g.group} className="precision-card rounded-xl p-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
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

      {/* ---------------- architecture ---------------- */}
      <Section
        id="architecture"
        eyebrow="System Architecture"
        title="시스템 구성"
      >
        {project.architectureImage && (
          <figure className="overflow-hidden rounded-xl border border-line bg-white">
            <Image
              src={project.architectureImage.src}
              alt={project.architectureImage.alt}
              width={project.architectureImage.width}
              height={project.architectureImage.height}
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="h-auto w-full"
            />
          </figure>
        )}
        <details className="precision-card group mt-4 rounded-xl" open={!project.architectureImage}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-base font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
            <span>구성 요소와 설계 의도</span>
            <span className="text-lg leading-none text-faint transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <div className="border-t border-line px-5 py-5">
            <p className="mb-5 max-w-3xl text-[15px] leading-7 text-muted">{project.architectureIntent}</p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {project.architecture.map((n, i) => (
                <li key={n.id} className="rounded-lg border border-line bg-bg-soft p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[15px] font-semibold text-ink">{n.label}</span>
                    <span className="rounded border border-line bg-white px-1.5 py-0.5 font-mono text-xs uppercase tracking-wider text-faint">{BAND_LABEL[n.band]}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{n.role}</p>
                </li>
              ))}
            </ol>
          </div>
        </details>
      </Section>

      {project.implementationStory && (
        <Section
          id="implementation-story"
          eyebrow="Implementation Decisions"
          title="구현 과정과 판단"
          lead="센서 중복부터 장치 명령의 실패 처리까지, 자동 케어 흐름을 설계한 과정입니다."
        >
          <div className="precision-card rounded-2xl p-5 sm:p-8">
            <details className="group rounded-xl border border-line bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-base font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                <span>자동 케어의 과제</span>
                <span className="text-lg leading-none text-faint transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <div className="space-y-4 border-t border-line px-4 py-5">
                {project.implementationStory.introduction.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-7 text-ink-dim">{paragraph}</p>
                ))}
              </div>
            </details>

            <ol className="mt-4 grid gap-3 lg:grid-cols-2">
              {project.implementationStory.decisions.map((decision, index) => (
                <li key={decision.title}>
                  <details className="group h-full rounded-xl border border-line bg-bg-soft/60">
                    <summary className="flex cursor-pointer list-none items-center gap-3 p-5 marker:hidden [&::-webkit-details-marker]:hidden">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-blue-100 bg-blue-50 font-mono text-xs font-bold text-signal">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 text-base font-semibold text-ink">{decision.title}</span>
                      <span className="text-lg leading-none text-faint transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p className="border-t border-line px-5 py-4 text-[15px] leading-7 text-muted">{decision.body}</p>
                  </details>
                </li>
              ))}
            </ol>

            <details className="group mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-base font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                <span>검증한 예외 상황</span>
                <span className="text-lg leading-none text-emerald-700 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="border-t border-emerald-200 px-5 py-4 text-[15px] leading-7 text-ink-dim">{project.implementationStory.verification}</p>
            </details>

            <details className="group mt-4 rounded-xl border border-line bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-base font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                <span>코드 근거 {project.implementationStory.codeReferences.length}건</span>
                <span className="text-lg leading-none text-faint transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <ul className="grid gap-2 border-t border-line p-4 sm:grid-cols-2">
                {project.implementationStory.codeReferences.map((reference) => (
                  <li key={reference.file} className="rounded-lg border border-line bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-ink">{reference.label}</p>
                    <p className="mt-1 break-all font-mono text-xs leading-6 text-muted">{reference.file}:{reference.line}</p>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </Section>
      )}

      {/* ---------------- troubleshooting ---------------- */}
      {project.troubleshooting.length > 0 && (
        <Section id="troubleshooting" eyebrow="Troubleshooting" title="문제 해결">
          <div className="space-y-3">
            {project.troubleshooting.map((t) => (
              <TroubleshootingBlock key={t.id} item={t} />
            ))}
          </div>
          {project.troubleshootingNote && (
            <p className="precision-card mt-8 rounded-xl p-5 text-[15px] leading-7 text-ink-dim">
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
          <div className="space-y-3">
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
                <p className="mt-2.5 max-w-3xl text-base leading-8 text-muted">
                  {p.summary}
                </p>

                <div className="mt-4">
                  <MetricPanel metrics={p.metrics} condition={p.condition} />
                </div>
                <details className="precision-card group mt-4 rounded-xl">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-base font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                    <span>개선 전후 구현 자세히 보기</span>
                    <span className="text-lg leading-none text-faint transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <div className="grid gap-4 border-t border-line p-5 lg:grid-cols-2">
                    <BeforeAfterCard side="before" data={p.before} />
                    <BeforeAfterCard side="after" data={p.after} />
                  </div>
                </details>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ---------------- pager ---------------- */}
      <nav className="border-t border-line" aria-label="프로젝트 이동">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-12 sm:grid-cols-2 sm:px-8">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="precision-card group rounded-xl p-5 transition-colors hover:-translate-y-0.5"
            >
              <span className="font-mono text-[13px] text-faint">← 이전</span>
              <p className="mt-1.5 text-base font-semibold text-ink">{prev.name}</p>
              <p className="mt-0.5 text-sm text-muted">{prev.tagline}</p>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="precision-card group rounded-xl p-5 text-right transition-colors hover:-translate-y-0.5"
            >
              <span className="font-mono text-[13px] text-faint">다음 →</span>
              <p className="mt-1.5 text-base font-semibold text-ink">{next.name}</p>
              <p className="mt-0.5 text-sm text-muted">{next.tagline}</p>
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
    <details className="precision-card group rounded-xl">
      <summary className="flex cursor-pointer list-none items-center gap-4 p-5 marker:hidden sm:p-6 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1 text-lg font-semibold tracking-tight text-ink">{item.title}</span>
        <span className="shrink-0 text-lg leading-none text-faint transition-transform group-open:rotate-45" aria-hidden="true">+</span>
      </summary>
      <div className="border-t border-line px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
        <p className="border-l-2 border-[var(--accent)] pl-4 text-[15px] leading-7 text-ink-dim">
          {item.problem}
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <ol className="min-w-0 space-y-4">
            {item.steps.map((s) => (
              <li key={s.label + s.title} className="flex gap-3.5">
                <span className="mt-0.5 grid h-7 shrink-0 place-items-center rounded border border-line bg-surface-2 px-2 font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
                  {s.label}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-ink">{s.title}</p>
                  <p className="mt-1 text-[15px] leading-7 text-muted">{s.body}</p>
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

        <p className="mt-6 rounded-lg border border-line bg-bg-soft p-4 text-[15px] leading-7 text-ink-dim">
          <span className="mr-2 font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
            결과
          </span>
          {item.takeaway}
        </p>
      </div>
    </details>
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
          "font-mono text-xs uppercase tracking-[0.14em]",
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
            <li key={n} className="flex gap-2 text-sm leading-6 text-muted">
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
