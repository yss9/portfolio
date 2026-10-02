import Link from "next/link";
import Image from "next/image";
import { Chip, Section } from "@/components/ui/primitives";
import { profile, techStack } from "@/content/profile";
import { projects } from "@/content/projects";

const credentials = [
  { label: "학력", value: "영남대학교 컴퓨터공학과 졸업", meta: "B.S. in CSE" },
  { label: "전공 평점", value: "3.88 / 4.5", meta: "MAJOR GPA" },
  { label: "자격증", value: "정보처리기사", meta: "CERTIFIED" },
  { label: "교육·수상", value: "SSAFY 교육 참여 · PotneR 프로젝트 우수상", meta: "SSAFY" },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-bg">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-75" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="rise max-w-7xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              서영석 · Backend Developer
            </div>
            <h1 className="mt-8 max-w-6xl text-[2.65rem] font-bold leading-[1.16] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[3.75rem] xl:text-[4rem]">
              서비스 흐름을 따라 원인을 좁히고, <span className="relative inline-block text-signal">
                변경을 안전하게
                <span className="absolute inset-x-0 -bottom-1 h-[3px] bg-signal/25" />
              </span> 반영합니다.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-ink-dim">
              거래·장치 제어·실시간 통신처럼 상태가 바뀌는 지점을 다뤄왔습니다.
              로그와 데이터 흐름으로 원인을 확인하고, 테스트와 측정 조건을 남겨 개선을 검증합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#projects"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-signal px-5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-signal-dim"
              >
                프로젝트 보기 <span className="ml-2">→</span>
              </Link>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-line-strong bg-white px-5 text-[15px] font-semibold text-ink transition hover:border-slate-400 hover:bg-slate-50"
              >
                GitHub ↗
              </a>
              <a
                href="/seo-youngseok-portfolio.pdf"
                download
                className="inline-flex h-12 items-center justify-center rounded-lg border border-line bg-white px-5 text-[15px] font-semibold text-ink-dim transition hover:border-signal hover:text-signal"
              >
                PDF 포트폴리오 ↓
              </a>
            </div>
            <div className="mt-10 grid max-w-4xl gap-3 border-t border-line pt-6 sm:grid-cols-2">
              {projects.slice(0, 2).map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="precision-card rounded-xl p-4 transition hover:border-signal focus-visible:border-signal"
                >
                  <span className="font-mono text-xs font-semibold text-signal">대표 프로젝트 · {project.name}</span>
                  <span className="mt-2 block text-sm leading-6 text-ink-dim">{project.focus}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section id="about" eyebrow="// BACKGROUND & PROFILE" title="기본 정보와 개발 방식">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="precision-card rounded-xl p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-signal">Introduction</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-ink">설계 이유와 검증 결과를 설명할 수 있는 개발을 합니다.</h3>
              </div>
              <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-700 sm:inline">OPEN TO WORK</span>
            </div>
            <div className="space-y-4">
              {profile.intro.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-ink-dim">{paragraph}</p>
              ))}
            </div>
          </article>

          <div className="grid gap-3 sm:grid-cols-2">
            {credentials.map((item) => (
              <div key={item.label} className="precision-card rounded-xl p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">{item.label}</span>
                  <span className="rounded border border-blue-100 bg-blue-50 px-2 py-1 font-mono text-xs font-semibold text-blue-700">{item.meta}</span>
                </div>
                <p className="mt-4 text-base font-semibold leading-7 text-ink">{item.value}</p>
              </div>
            ))}
            <div className="precision-card rounded-xl p-5 sm:col-span-2">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">CONTACT</p>
              <div className="mt-3 flex flex-col gap-1">
                <a href={`mailto:${profile.email}`} className="text-base font-semibold text-signal hover:underline">{profile.email}</a>
                <a href={`tel:${profile.phone}`} className="text-base font-semibold text-signal hover:underline">{profile.phone}</a>
              </div>
            </div>
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
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-signal">{group.group}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => <li key={item}><Chip>{item}</Chip></li>)}
              </ul>
              <p className="mt-4 border-t border-line pt-4 text-[15px] leading-7 text-muted">{group.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="principles" eyebrow="// ENGINEERING CORE PRINCIPLES" title="코드 한 줄 뒤의 원리와 측정 가능한 신뢰">
        <div className="grid gap-4 md:grid-cols-3">
          {profile.principles.map((principle, index) => (
            <article key={principle.title} className="precision-card rounded-xl p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-blue-100 bg-blue-50 font-mono text-xs font-bold text-signal">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">{principle.title}</h3>
              <p className="mt-3 text-base leading-8 text-muted">{principle.desc}</p>
              <p className="mt-6 border-t border-line pt-4 font-mono text-xs font-semibold uppercase tracking-wider text-signal">
                {index === 0 ? "USER FLOW FIRST" : index === 1 ? "TRACE THE DATA" : "BEFORE / AFTER"}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <ProjectsSection />
    </>
  );
}

function ProjectsSection() {
  return (
    <Section
      id="projects"
      eyebrow={`// ARCHITECTURE CASE STUDIES · ${projects.length} PROJECTS`}
      title="프로젝트"
      lead="서비스의 목적과 제 역할을 먼저 보여주고, 상세 페이지에서 판단·구현·검증 근거를 이어서 설명합니다."
    >
      <ul className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug} data-accent={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="precision-card group flex h-full flex-col overflow-hidden rounded-xl transition-all hover:-translate-y-0.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-slate-100">
                <Image
                  src={project.preview.src}
                  alt={project.preview.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-gradient-to-b from-black/60 to-transparent p-4 sm:p-5">
                  <span className="rounded-md border border-white/40 bg-black/45 px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    Project {project.no}
                  </span>
                  <span className="rounded bg-black/45 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    {project.preview.kind === "diagram" ? "구조 도식" : "실제 화면"}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-ink">{project.name}</h3>
                    <p className="mt-1 text-[15px] font-semibold text-[var(--accent)]">{project.tagline}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-line bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-muted">{project.period}</span>
                </div>
                <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-muted">{project.summary}</p>
                <p className="mt-4 text-sm leading-6 text-ink-dim">
                  <span className="font-semibold text-ink">담당 역할 · </span>{project.role}
                </p>
                <p className="mt-4 rounded-lg border border-line bg-slate-50 px-4 py-3 text-[15px] font-medium leading-7 text-ink-dim">
                  {project.focus}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-xs text-muted">{project.team}</span>
                  <span className="font-mono text-[13px] font-semibold text-[var(--accent)]">자세히 보기 →</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
