import Link from "next/link";
import Image from "next/image";
import { profile, techStack } from "@/content/profile";
import { projects } from "@/content/projects";
import { Section, Eyebrow, Chip } from "@/components/ui/primitives";
import { StatTile } from "@/components/ui/Metrics";

/** Headline numbers pulled straight from the measured results below. */
const headlineStats = [
  { value: "-97.5%", label: "공개 일기 목록 평균 응답", sub: "147.85ms → 3.63ms · BlueMemories" },
  { value: "-99.9%", label: "요청당 DB 쿼리", sub: "1001 → 1 · BlueMemories" },
  { value: "-74.2%", label: "MBTI 추천 평균 응답", sub: "27.9ms → 7.21ms · Glople" },
  { value: "-76.2%", label: "과제 상태 조회 평균 응답", sub: "16.75ms → 3.99ms · SayBridge" },
];

export default function Home() {
  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-40" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-signal), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <Eyebrow>Backend Developer Portfolio</Eyebrow>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-ink sm:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-dim sm:text-lg">
            {profile.headline}
          </p>

          <div className="mt-9 flex flex-wrap gap-2.5">
            <Link
              href="#projects"
              className="rounded-md bg-signal px-5 py-2.5 text-[14px] font-semibold text-black transition-opacity hover:opacity-90"
            >
              프로젝트 보기
            </Link>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-md border border-line bg-surface px-5 py-2.5 text-[14px] text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
            >
              GitHub ↗
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="rounded-md border border-line bg-surface px-5 py-2.5 text-[14px] text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
            >
              {profile.email}
            </a>
          </div>

          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {headlineStats.map((s) => (
              <StatTile key={s.label} value={s.value} label={s.label} sub={s.sub} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- about ---------------- */}
      <Section id="about" eyebrow="Introduction" title="어떻게 일하는가">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="space-y-4">
              {profile.intro.map((p) => (
                <p key={p} className="text-[14.5px] leading-relaxed text-ink-dim">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {profile.principles.map((p, i) => (
                <div key={p.title} className="rounded-xl border border-line bg-surface p-5">
                  <span className="font-mono text-[11px] text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[14px] font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <dl className="h-fit rounded-xl border border-line bg-surface p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
              Profile
            </h3>
            <div className="mt-4">
              {profile.facts.map((f) => (
                <div
                  key={f.label}
                  className="flex gap-4 border-b border-line/70 py-3 last:border-0"
                >
                  <dt className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-wider text-faint">
                    {f.label}
                  </dt>
                  <dd className="text-[13.5px] leading-relaxed text-ink-dim">{f.value}</dd>
                </div>
              ))}
            </div>
          </dl>
        </div>
      </Section>

      {/* ---------------- tech stack ---------------- */}
      <Section
        id="stack"
        eyebrow="Tech Stack"
        title="기술 스택"
        lead="실제 프로젝트에서 어떤 목적과 흐름에 사용했는지 기준으로 정리했습니다."
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {techStack.map((g) => (
            <div key={g.group} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
                {g.group}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {g.items.map((i) => (
                  <li key={i}>
                    <Chip>{i}</Chip>
                  </li>
                ))}
              </ul>
              <p className="mt-3.5 border-t border-line pt-3.5 text-[12.5px] leading-relaxed text-muted">
                {g.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- projects ---------------- */}
      <Section
        id="projects"
        eyebrow="Projects"
        title="프로젝트"
        lead="각 프로젝트 페이지에는 mock data로 동작하는 재현 데모와 함께, 아키텍처·문제 해결·성능 개선 내용을 정리했습니다."
      >
        <ul className="grid gap-3.5 lg:grid-cols-2">
          {projects.map((p) => (
            <li key={p.slug} data-accent={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-[color-mix(in_srgb,var(--accent)_45%,transparent)]"
              >
                {/* Screenshot of the project's mock demo mid-run. */}
                <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-bg-soft">
                  <Image
                    src={p.preview.src}
                    alt={p.preview.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[12px] text-[var(--accent)]">
                    {p.no}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-ink">
                    {p.name}
                  </h3>
                  <span className="ml-auto font-mono text-[11px] text-faint">
                    {p.period}
                  </span>
                </div>

                <p className="mt-1.5 text-[13.5px] text-[var(--accent)]">{p.tagline}</p>
                <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted">
                  {p.summary}
                </p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-md border border-line bg-surface-2 px-2 py-[3px] font-mono text-[10.5px] text-ink-dim"
                    >
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5">
                  <span className="text-[12px] text-faint">{p.teamShort}</span>
                  <span className="font-mono text-[12px] text-[var(--accent)] transition-transform group-hover:translate-x-0.5">
                    자세히 →
                  </span>
                </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------- contact ---------------- */}
      <Section id="contact" eyebrow="Contact" title="연락처">
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={`mailto:${profile.email}`}
            className="group rounded-xl border border-line bg-surface p-6 transition-colors hover:border-signal/50"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
              Email
            </p>
            <p className="mt-2.5 text-lg font-medium text-ink">{profile.email}</p>
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="group rounded-xl border border-line bg-surface p-6 transition-colors hover:border-signal/50"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
              GitHub
            </p>
            <p className="mt-2.5 text-lg font-medium text-ink">
              {profile.githubLabel} ↗
            </p>
          </a>
        </div>
      </Section>
    </>
  );
}
