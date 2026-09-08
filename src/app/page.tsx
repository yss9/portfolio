import Link from "next/link";
import { Chip, Eyebrow, Section } from "@/components/ui/primitives";
import { profile, techStack } from "@/content/profile";
import { projects } from "@/content/projects";

const telemetry = [
  {
    label: "DB QUERY / REQUEST",
    value: "1001 → 1",
    note: "BlueMemories · -99.9%",
    width: "8%",
    tone: "bg-gain",
  },
  {
    label: "AVG RESPONSE TIME",
    value: "147.85 → 3.63ms",
    note: "BlueMemories · -97.5%",
    width: "12%",
    tone: "bg-signal",
  },
  {
    label: "MBTI RECOMMENDATION",
    value: "27.9 → 7.21ms",
    note: "Glople · -74.2%",
    width: "26%",
    tone: "bg-cyan-500",
  },
];

const credentials = [
  { label: "학력", value: "영남대학교 컴퓨터공학과 졸업", meta: "B.S. in CSE" },
  { label: "전공 평점", value: "3.84 / 4.5", meta: "MAJOR GPA" },
  { label: "자격증", value: "정보처리기사", meta: "CERTIFIED" },
  { label: "교육", value: "삼성청년 SW·AI 아카데미", meta: "2026.01 ~" },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-bg">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-75" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Backend Developer · Ready to grow
            </div>
            <h1 className="mt-8 max-w-4xl text-[2.65rem] font-bold leading-[1.13] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4rem]">
              기능 구현에서 멈추지 않고,
              <br />
              <span className="relative text-signal">
                문제를 분석하고
                <span className="absolute inset-x-0 -bottom-1 h-[3px] bg-signal/25" />
              </span>
              <br />
              개선 결과를 수치로 검증합니다.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-ink-dim">
              사용자 흐름과 데이터 처리 과정을 먼저 파악하고, 로그와 실행 순서,
              쿼리 흐름을 따라 원인을 좁힙니다. 개선 전후는 성능 수치로 확인합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#projects"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-signal px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-signal-dim"
              >
                프로젝트 보기 <span className="ml-2">→</span>
              </Link>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-line-strong bg-white px-5 text-sm font-semibold text-ink transition hover:border-slate-400 hover:bg-slate-50"
              >
                GitHub ↗
              </a>
              <a
                href="/seo-youngseok-portfolio.pdf"
                download
                className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-5 text-sm font-semibold text-ink-dim transition hover:border-signal hover:text-signal"
              >
                PDF 포트폴리오 ↓
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-2">
              {techStack.slice(0, 4).flatMap((group) => group.items.slice(0, 3)).map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </div>

          <aside className="precision-card metric-grid rise rounded-2xl p-4 sm:p-5 lg:ml-auto lg:w-full lg:max-w-[430px]">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                measured_results · verified
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {telemetry.map((item) => (
                <div key={item.label} className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] font-semibold tracking-wide text-muted">{item.label}</p>
                      <p className="tnum mt-1.5 text-xl font-bold tracking-tight text-ink">{item.value}</p>
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-gain">{item.note}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${item.tone}`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-muted">
              <span>status: portfolio_ready</span>
              <span>4 case studies</span>
            </div>
          </aside>
        </div>
      </section>

      <Section id="about" eyebrow="// BACKGROUND & PROFILE" title="기본 정보와 개발 방식">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="precision-card rounded-xl p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-signal">Introduction</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-ink">안정적인 개선 과정을 중요하게 생각합니다.</h3>
              </div>
              <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[10px] font-semibold text-emerald-700 sm:inline">OPEN TO WORK</span>
            </div>
            <div className="space-y-4">
              {profile.intro.map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-7 text-ink-dim">{paragraph}</p>
              ))}
            </div>
          </article>

          <div className="grid gap-3 sm:grid-cols-2">
            {credentials.map((item) => (
              <div key={item.label} className="precision-card rounded-xl p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">{item.label}</span>
                  <span className="rounded border border-blue-100 bg-blue-50 px-2 py-1 font-mono text-[9px] font-semibold text-blue-700">{item.meta}</span>
                </div>
                <p className="mt-4 text-[15px] font-semibold leading-6 text-ink">{item.value}</p>
              </div>
            ))}
            <a href={`mailto:${profile.email}`} className="precision-card rounded-xl p-5 sm:col-span-2">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">CONTACT</p>
              <p className="mt-3 text-[15px] font-semibold text-signal">{profile.email}</p>
            </a>
          </div>
        </div>
      </Section>

      <Section
        id="stack"
        eyebrow="// CORE SPECIALIZATION & STACK"
        title="기술 스택"
        lead="실제 프로젝트에서 어떤 목적과 흐름에 사용했는지 기준으로 정리했습니다."
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {techStack.map((group) => (
            <article key={group.group} className="precision-card rounded-xl p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-signal">{group.group}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => <li key={item}><Chip>{item}</Chip></li>)}
              </ul>
              <p className="mt-4 border-t border-line pt-4 text-[13px] leading-6 text-muted">{group.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="projects"
        eyebrow="// ARCHITECTURE CASE STUDIES · 4 PROJECTS"
        title="프로젝트"
        lead="기능 목록보다 문제를 어떻게 좁히고, 구조를 바꾸고, 결과를 검증했는지에 집중했습니다."
      >
        <ul className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug} data-accent={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="precision-card group flex h-full flex-col overflow-hidden rounded-xl transition-all hover:-translate-y-0.5"
              >
                <div className="metric-grid relative overflow-hidden border-b border-line bg-slate-50 p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-md border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-white px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                      Project {project.no}
                    </span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Architecture Case Study
                    </span>
                  </div>
                  <p className="mt-10 max-w-lg text-2xl font-bold tracking-[-0.025em] text-ink sm:text-3xl">
                    {project.highlights[0]}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {project.stackFlat.slice(0, 5).map((item) => (
                      <li key={item}>
                        <Chip>{item}</Chip>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-ink">{project.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-[var(--accent)]">{project.tagline}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-line bg-slate-50 px-2.5 py-1 font-mono text-[9px] font-semibold text-muted">{project.period}</span>
                  </div>
                  <p className="mt-4 line-clamp-3 text-[13.5px] leading-6 text-muted">{project.summary}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {project.highlights.slice(0, 4).map((highlight) => (
                      <li key={highlight} className="rounded-lg border border-line bg-slate-50 px-3 py-2 font-mono text-[10px] font-semibold text-ink-dim">{highlight}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                    <span className="font-mono text-[10px] text-muted">{project.teamShort}</span>
                    <span className="font-mono text-[11px] font-semibold text-[var(--accent)]">자세히 보기 →</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="principles" eyebrow="// ENGINEERING CORE PRINCIPLES" title="코드 한 줄 뒤의 원리와 측정 가능한 신뢰">
        <div className="grid gap-4 md:grid-cols-3">
          {profile.principles.map((principle, index) => (
            <article key={principle.title} className="precision-card rounded-xl p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-blue-100 bg-blue-50 font-mono text-xs font-bold text-signal">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">{principle.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{principle.desc}</p>
              <p className="mt-6 border-t border-line pt-4 font-mono text-[10px] font-semibold uppercase tracking-wider text-signal">
                {index === 0 ? "USER FLOW FIRST" : index === 1 ? "TRACE THE DATA" : "BEFORE / AFTER"}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <section id="contact" className="border-t border-line px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-7 shadow-sm sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Eyebrow>Open for opportunity · 함께 성장할 팀</Eyebrow>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">사용자 흐름과 데이터 흐름을 함께 보는 백엔드 개발자</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-dim">기술적인 고민을 나누고, 개선의 결과를 수치로 확인하는 팀과 함께하고 싶습니다.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="inline-flex h-11 items-center rounded-lg bg-signal px-5 text-sm font-semibold text-white hover:bg-signal-dim">메일 보내기</a>
            <a href="/seo-youngseok-portfolio.pdf" download className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-white px-5 text-sm font-semibold text-ink hover:bg-slate-50">PDF 받기</a>
          </div>
        </div>
      </section>
    </>
  );
}
