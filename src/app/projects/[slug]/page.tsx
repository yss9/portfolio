import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projectSlugs, projectNeighbours } from "@/content/projects";
import type { Troubleshooting } from "@/content/types";
import { Section, Chip, cx } from "@/components/ui/primitives";
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = projectNeighbours(slug);
  const cases = [...project.troubleshooting, ...(project.designNotes ?? [])];

  return (
    <div data-accent={project.slug} className="project-detail">
      <header className="relative overflow-hidden border-b border-line bg-bg">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <Link href="/#projects" className="font-mono text-[13px] text-faint transition-colors hover:text-ink-dim">
            ← 프로젝트 목록
          </Link>
          <div className="mt-7 flex flex-wrap items-center gap-2 font-mono text-xs font-semibold text-[var(--accent)]">
            <span className="rounded border border-[var(--accent)]/25 bg-white px-2.5 py-1">PROJECT {project.no}</span>
            <span className="rounded border border-line bg-white px-2.5 py-1 text-muted">{project.period}</span>
            <span className="rounded border border-line bg-white px-2.5 py-1 text-muted">{project.team}</span>
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.035em] text-ink sm:text-6xl">{project.name}</h1>
          <p className="mt-3 text-lg font-semibold text-[var(--accent)]">{project.tagline}</p>
          <p className="mt-5 max-w-4xl text-base leading-8 text-ink-dim">{project.summary}</p>

          <div className="mt-8 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="precision-card rounded-xl border-l-4 border-l-[var(--accent)] p-5">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">담당 역할</p>
              <p className="mt-2 text-lg font-semibold leading-7 text-ink">{project.role}</p>
              <p className="mt-1 text-sm text-muted">{project.team}</p>
              <p className="mt-4 border-t border-line pt-4 text-[15px] leading-7 text-ink-dim">
                <span className="mr-2 font-semibold text-[var(--accent)]">핵심 판단</span>{project.focus}
              </p>
            </div>
            <div className="precision-card rounded-xl p-5">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">핵심 기여</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {project.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight} className="rounded-md bg-bg-soft px-2.5 py-1.5 text-sm font-medium text-ink-dim">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-lg border border-line-strong bg-white px-4 py-2.5 text-[15px] font-semibold text-ink-dim transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {link.kind === "video" ? "▶" : "↗"} {link.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <Section id="stack" eyebrow="Tech Stack" title="사용 기술">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {project.stack.map((group) => (
            <div key={group.group} className="precision-card rounded-xl p-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)]">{group.group}</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => <li key={item}><Chip>{item}</Chip></li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="features" eyebrow="My Contribution" title="담당 구현">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {project.features.map((feature, index) => (
            <li key={feature.title} className="precision-card flex min-w-0 gap-3 rounded-xl p-4 sm:p-5">
              <span className="font-mono text-xs font-semibold text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold leading-6 text-ink">{feature.title}</h3>
                {feature.category && <p className="mt-1 text-xs text-muted">{feature.category}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {project.screenshots && project.screenshots.length > 0 && (
        <Section id="screens" eyebrow="Service Screens" title="서비스 화면">
          <div className={cx(
            "grid overflow-hidden rounded-xl border border-line bg-line",
            project.slug === "potner" ? "grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1 gap-px sm:grid-cols-2"
          )}>
            {project.screenshots.slice(0, 4).map((screen, index) => (
              <figure key={screen.src} className={cx("overflow-hidden bg-white", project.slug === "potner" && "rounded-xl border border-line")}>
                <div className={cx("relative overflow-hidden bg-white", project.slug === "potner" ? "aspect-[9/19]" : "aspect-[16/10]")}>
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className={project.slug === "potner" ? "object-contain" : "object-cover object-top"}
                    priority={index === 0}
                  />
                </div>
                <figcaption className="border-t border-line px-4 py-3 text-sm leading-6 text-ink-dim">
                  <span className="mr-2 font-mono text-xs font-semibold text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                  {screen.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      <Section id="architecture" eyebrow="System Architecture" title="시스템 구성">
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
            <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-sm text-ink-dim">
              <span>{project.preview.kind === "diagram" ? "실제 서비스 화면이 아닌 구조 도식입니다." : "프로젝트의 시스템 구성도입니다."}</span>
              <a
                href={project.architectureImage.src}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-[var(--accent)] hover:underline"
              >
                구성도 크게 보기 ↗
              </a>
            </figcaption>
          </figure>
        )}
        <p className="mt-4 max-w-4xl border-l-2 border-[var(--accent)] pl-4 text-[15px] leading-7 text-ink-dim">
          <span className="mr-2 font-semibold text-ink">설계 의도</span>{project.architectureIntent}
        </p>
        {!project.architectureImage && (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.architecture.map((node) => (
              <li key={node.id} className="precision-card rounded-lg p-4">
                <h3 className="font-semibold text-ink">{node.label}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{node.role}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {project.implementationStory && (
        <Section id="implementation-story" eyebrow="Implementation Decisions" title="자동 케어, 이렇게 설계했습니다">
          <div className="rounded-2xl border border-line bg-white p-5 sm:p-7">
            <p className="max-w-4xl text-[15px] leading-7 text-ink-dim">
              MQTT 명령은 중복되거나 늦게 도착할 수 있습니다. 실제 급수가 두 번 실행되지 않도록 명령의 저장, 발행, 결과 처리를 분리했습니다.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--accent)]">
              {["수분 부족 감지", "스테이션 이동", "급수", "원위치 복귀"].map((step, index) => (
                <span key={step} className="inline-flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true" className="text-faint">→</span>}
                  <span className="rounded-lg border border-line bg-bg-soft px-3 py-2">{step}</span>
                </span>
              ))}
            </div>
            <ol className="mt-6 grid gap-3 md:grid-cols-2">
              {project.implementationStory.decisions.map((decision, index) => (
                <li key={decision.title} className="rounded-xl border border-line bg-bg-soft/60 p-5">
                  <span className="font-mono text-xs font-semibold text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-base font-semibold text-ink">{decision.title}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-muted">{decision.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
              <h3 className="text-sm font-semibold text-emerald-800">검증</h3>
              <p className="mt-2 text-[15px] leading-7 text-ink-dim">{project.implementationStory.verification}</p>
            </div>
            <p className="mt-4 text-xs leading-6 text-muted">
              코드 근거: {project.implementationStory.codeReferences.slice(0, 4).map((reference) => reference.file).join(" · ")}
            </p>
          </div>
        </Section>
      )}

      {cases.length > 0 && (
        <Section id="problem-solving" eyebrow="Problem → Solution → Result" title="문제와 해결">
          <div className="grid gap-4 lg:grid-cols-2">
            {cases.map((item) => <CaseCard key={item.id} item={item} />)}
          </div>
        </Section>
      )}

      {project.performance.length > 0 && (
        <Section id="performance" eyebrow="Measured Results" title="개선 결과" lead="같은 조건에서 개선 전후를 비교했습니다.">
          <div className="grid gap-5 lg:grid-cols-2">
            {project.performance.map((item) => (
              <article key={item.id} className="min-w-0">
                <h3 className="text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-muted">{item.summary}</p>
                <div className="mt-4"><MetricPanel metrics={item.metrics} condition={item.condition} /></div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[item.before, item.after].map((side) => (
                    <div key={side.label} className="rounded-lg border border-line bg-white p-4">
                      <p className="text-sm font-semibold text-ink">{side.label}</p>
                      {side.notes && <p className="mt-1 text-sm leading-6 text-muted">{side.notes.join(" · ")}</p>}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      <nav className="border-t border-line" aria-label="프로젝트 이동">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-12 sm:grid-cols-2 sm:px-8">
          {prev ? <Link href={`/projects/${prev.slug}`} className="precision-card rounded-xl p-5">
            <span className="font-mono text-[13px] text-faint">← 이전</span>
            <p className="mt-1 text-base font-semibold text-ink">{prev.name}</p>
          </Link> : <span />}
          {next && <Link href={`/projects/${next.slug}`} className="precision-card rounded-xl p-5 text-right">
            <span className="font-mono text-[13px] text-faint">다음 →</span>
            <p className="mt-1 text-base font-semibold text-ink">{next.name}</p>
          </Link>}
        </div>
      </nav>
    </div>
  );
}

function CaseCard({ item }: { item: Troubleshooting }) {
  return (
    <article className="precision-card min-w-0 rounded-xl p-5 sm:p-6">
      <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
      <dl className="mt-5 space-y-4">
        <div>
          <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-rose-700">문제</dt>
          <dd className="mt-1 text-[15px] leading-7 text-ink-dim">{item.problem}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">해결</dt>
          <dd className="mt-1 text-[15px] leading-7 text-ink-dim">{item.solution ?? item.steps.slice(-2).map((step) => step.body).join(" ")}</dd>
        </div>
        <div className="border-t border-line pt-3">
          <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700">결과</dt>
          <dd className="mt-1 text-[15px] leading-7 text-ink-dim">{item.takeaway}</dd>
        </div>
      </dl>
    </article>
  );
}
