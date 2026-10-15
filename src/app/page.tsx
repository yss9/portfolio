import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { aiWorkflow, profile, techStack } from "@/content/profile";
import { projects, getProject } from "@/content/projects";
import { featuredSlugs, showcase, stateFlows } from "@/content/showcase";
import type { Metric } from "@/content/types";
import { AwardIcon } from "@/components/ui/primitives";
import { LoopVideo } from "@/components/project/LoopVideo";
import { clips } from "@/content/clips";

const impactProject = getProject("glople")!;

function avgMetric(metrics: Metric[]) {
  return metrics.find((metric) => metric.label === "Avg Response Time");
}

function numeric(value: string) {
  return Number.parseFloat(value.replace(/[^\d.]/g, ""));
}

export default function Home() {
  const otherProjects = projects.filter(
    (project) => !featuredSlugs.some((slug) => slug === project.slug),
  );
  const impactCases = [...impactProject.performance].sort(
    (a, b) =>
      numeric(avgMetric(b.metrics)?.delta ?? "0") -
      numeric(avgMetric(a.metrics)?.delta ?? "0"),
  );
  const topCase = impactCases[0];
  const topAvg = avgMetric(topCase.metrics)!;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="site-container">
          <div className="hero-grid">
            <div>
              <p className="hero-kicker">
                <span className="status-dot" aria-hidden="true" />
                {profile.positioning.kicker}
              </p>
              <h1 id="hero-title">
                {profile.positioning.title[0]}
                <br />
                <em>{profile.positioning.title[1]}</em>
              </h1>
              <p className="hero-lead">
                {profile.positioning.lead} SSAFY에서{" "}
                <strong>승인형 AI 어시스턴트(새로이)</strong>와{" "}
                <strong>IoT 자동 급수(PotneR)</strong>를 만들어 우수상을 두 번
                받았습니다.
              </p>
              <div className="hero-actions">
                <Link href="#projects" className="button button-primary">
                  프로젝트 보기 <span aria-hidden="true">↓</span>
                </Link>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="button button-outline"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
                <a
                  href="/seo-youngseok-portfolio.pdf"
                  download
                  className="button button-outline"
                >
                  포트폴리오 PDF <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <figure className="state-card" aria-labelledby="state-card-title">
              <figcaption className="state-card-head">
                <span id="state-card-title">STATE GUARDS</span>
                <span>실행 전에 서버가 확인하는 지점</span>
              </figcaption>
              {stateFlows.map((flow, flowIndex) => (
                <div
                  key={flow.slug}
                  className="state-flow"
                  style={
                    { "--flow-delay": `${flowIndex * 3.5}s` } as CSSProperties
                  }
                >
                  <p className="state-flow-title">
                    {flow.title}
                    <span>{flow.project}</span>
                  </p>
                  <ol className="state-steps">
                    {flow.steps.map((step, index) => (
                      <li key={step.label}>
                        <span
                          className="state-step"
                          data-guard={"guard" in step ? "" : undefined}
                          style={{ "--i": index } as CSSProperties}
                        >
                          {step.label}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className="state-guard">{flow.guard}</p>
                </div>
              ))}
            </figure>
          </div>

          <div className="proof-strip">
            <Link
              href="/projects/glople#performance"
              className="proof-item"
            >
              <span className="proof-value">
                {topAvg.delta?.replace(/\.\d+%$/, "")}
                <small>%</small>
              </span>
              <span className="proof-label">추천 API 평균 응답 시간</span>
              <span className="proof-note">
                Glople · {topAvg.before} → {topAvg.after}, 로컬 JMeter 동일 조건{" "}
                <span aria-hidden="true">↗</span>
              </span>
            </Link>
            <Link href="#projects" className="proof-item">
              <span className="proof-value">
                2<small>회</small>
              </span>
              <span className="proof-label">SSAFY 프로젝트 우수상</span>
              <span className="proof-note">
                공통 프로젝트 PotneR · 특화 프로젝트 새로이
              </span>
            </Link>
            <Link href="/projects/saeroi#contribution" className="proof-item">
              <span className="proof-value">
                31<small>개</small>
              </span>
              <span className="proof-label">AI 업무 도구 연결</span>
              <span className="proof-note">
                새로이 · 쓰기 도구 17개는 승인 카드로만 실행{" "}
                <span aria-hidden="true">↗</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="section section-soft"
        aria-labelledby="projects-title"
      >
        <div className="site-container">
          <header className="section-head">
            <p className="eyebrow">대표 프로젝트</p>
            <h2 id="projects-title">SSAFY에서 수상한 두 프로젝트</h2>
            <p className="section-lead">
              6인 팀에서 제가 직접 맡은 구현과, 어떤 문제를 어떻게 풀었는지에
              집중해 정리했습니다.
            </p>
          </header>

          <div className="feature-list">
            {featuredSlugs.map((slug) => {
              const project = getProject(slug)!;
              const editorial = showcase[slug];
              const href = `/projects/${slug}`;
              return (
                <article key={slug} className="feature-card">
                  <Link
                    href={href}
                    className="feature-media"
                    data-project={slug}
                    aria-label={`${project.name} 케이스 스터디 보기`}
                  >
                    <span className="feature-media-label">
                      <span>{editorial.visualLabel}</span>
                      <span aria-hidden="true">시연 화면 · 목 데이터</span>
                    </span>
                    {slug === "potner" ? (
                      <span className="phone-pair">
                        {["potner-home", "potner-environment"].map((id) => {
                          const demo = clips.potner.find((item) => item.id === id)!;
                          return (
                            <span key={id} className="phone">
                              <LoopVideo
                                src={demo.src}
                                poster={demo.poster}
                                label={`PotneR ${demo.title} 시연`}
                              />
                            </span>
                          );
                        })}
                      </span>
                    ) : (
                      <span className="feature-window">
                        <span className="feature-window-bar" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                          <span>새로이 · 브랜드 AI 어시스턴트</span>
                        </span>
                        <LoopVideo
                          src="/clips/saeroi/saeroi-agent-confirm.mp4"
                          poster="/clips/saeroi/saeroi-agent-confirm.jpg"
                          label="새로이 AI 어시스턴트에서 생산 확정 카드를 승인하는 시연"
                        />
                      </span>
                    )}
                  </Link>

                  <div className="feature-body">
                    <div className="feature-meta">
                      {project.award && (
                        <span className="award-badge">
                          <AwardIcon />
                          {project.award}
                        </span>
                      )}
                      <span>
                        {project.period} · {project.team}
                      </span>
                    </div>
                    <div>
                      <h3 className="feature-title">
                        <Link href={href}>{project.name}</Link>
                      </h3>
                      <p className="feature-tagline">{project.tagline}</p>
                    </div>
                    <p className="feature-role">
                      <b>담당</b>
                      {project.role}
                    </p>
                    <ol className="psr" aria-label="문제, 해결, 결과">
                      <li>
                        <span className="psr-label">문제</span>
                        {editorial.problem}
                      </li>
                      <li>
                        <span className="psr-label">해결</span>
                        {editorial.solution}
                      </li>
                      <li>
                        <span className="psr-label">결과</span>
                        {editorial.result}
                      </li>
                    </ol>
                    <ul className="tag-list" aria-label="주요 사용 기술">
                      {project.stackFlat.slice(0, 5).map((tech) => (
                        <li key={tech} className="tag">
                          {tech}
                        </li>
                      ))}
                    </ul>
                    <Link href={href} className="text-link">
                      구현과 해결 과정 자세히 보기{" "}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="more-head">
            <h3>그 밖의 프로젝트</h3>
            <p>1인 개발부터 성능 개선, 배포 자동화까지</p>
          </div>
          <ul className="project-grid">
            {otherProjects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="project-card"
                >
                  <span className="project-thumb">
                    <Image
                      src={project.preview.src}
                      alt={project.preview.alt}
                      fill
                      sizes="(min-width: 1200px) 380px, (min-width: 768px) 45vw, 90vw"
                      className={
                        project.preview.kind === "diagram"
                          ? "object-contain p-4"
                          : "object-cover object-top"
                      }
                    />
                  </span>
                  <div className="project-card-body">
                    <div className="project-card-top">
                      <span>{project.no}</span>
                      <span>{project.period}</span>
                    </div>
                    <h4>{project.name}</h4>
                    <p className="project-card-tagline">{project.tagline}</p>
                    <p className="project-card-focus">{project.focus}</p>
                    <div className="project-card-foot">
                      <span>{project.teamShort}</span>
                      <span aria-hidden="true">자세히 →</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="impact"
        className="section section-dark"
        aria-labelledby="impact-title"
      >
        <div className="site-container impact-grid">
          <header className="section-head">
            <p className="eyebrow">측정한 개선 · {impactProject.name}</p>
            <h2 id="impact-title">
              전체 정렬을 Top-K로 바꿔
              <br />
              응답 시간 <em>{topAvg.delta?.replace(/\.\d+%$/, "%")}</em>
            </h2>
            <p className="section-lead">
              {impactProject.troubleshooting[0]?.problem}{" "}
              {impactProject.troubleshooting[0]?.solution}
            </p>
            <p className="impact-note">{topCase.condition}</p>
            <div>
              <Link
                href="/projects/glople#performance"
                className="text-link"
              >
                측정 조건과 코드 보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </header>
          <div className="impact-cases">
            {impactCases.map((item) => {
              const avg = avgMetric(item.metrics);
              const p95 = item.metrics.find((m) => m.label === "p95 Latency");
              if (!avg) return null;
              const [name, approach] = item.title.split(" — ");
              const ratio = (numeric(avg.after) / numeric(avg.before)) * 100;
              return (
                <article key={item.id} className="impact-case">
                  <div className="impact-case-head">
                    <div>
                      <h3>{name}</h3>
                      <p>{approach}</p>
                    </div>
                    <span className="impact-delta">{avg.delta}</span>
                  </div>
                  <div
                    className="impact-bars"
                    role="img"
                    aria-label={`평균 응답 시간 ${avg.before}에서 ${avg.after}로 감소`}
                  >
                    <div className="impact-bar">
                      <span>Before</span>
                      <span className="impact-bar-track">
                        <span
                          className="impact-bar-fill"
                          style={{ "--w": "100%" } as CSSProperties}
                        />
                      </span>
                      <span className="impact-bar-value">{avg.before}</span>
                    </div>
                    <div className="impact-bar is-after">
                      <span>After</span>
                      <span className="impact-bar-track">
                        <span
                          className="impact-bar-fill"
                          style={{ "--w": `${ratio}%` } as CSSProperties}
                        />
                      </span>
                      <span className="impact-bar-value">{avg.after}</span>
                    </div>
                  </div>
                  {p95 && (
                    <p className="impact-p95">
                      평균 응답 시간 기준 · p95 {p95.before} → {p95.after} (
                      {p95.delta})
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="section" aria-labelledby="about-title">
        <div className="site-container">
          <header className="section-head">
            <p className="eyebrow">소개</p>
            <h2 id="about-title">
              문제를 재현하고,
              <br />
              고친 근거를 남깁니다.
            </h2>
          </header>
          <div className="about-grid">
            <div className="about-intro">
              {profile.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <dl className="facts">
                <div>
                  <dt>학력</dt>
                  <dd>
                    {profile.education.school} {profile.education.major}
                    <span>전공 평점 {profile.education.gpa}</span>
                  </dd>
                </div>
                <div>
                  <dt>수상</dt>
                  <dd>
                    {profile.awards.map((award) => (
                      <Link
                        key={award.slug}
                        href={`/projects/${award.slug}`}
                        className="block"
                      >
                        {award.title} · {award.project}
                      </Link>
                    ))}
                  </dd>
                </div>
                {profile.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="principles">
              {profile.principles.map((principle, index) => (
                <article key={principle.title} className="principle">
                  <h3>
                    <span className="principle-no">0{index + 1}</span>
                    {principle.title}
                  </h3>
                  <p>{principle.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div id="stack" className="stack-block">
            <div className="sub-head">
              <h3>기술 스택</h3>
              <p>어디에 어떻게 썼는지 함께 적었습니다.</p>
            </div>
            <div className="stack-rows">
              {techStack.map((group) => (
                <div key={group.group} className="stack-row">
                  <p className="stack-group">{group.group}</p>
                  <p className="stack-items">{group.items.join(" · ")}</p>
                  <p className="stack-desc">{group.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="ai-assisted" className="ai-block">
            <div className="sub-head">
              <h3>AI는 도구로, 검증은 직접</h3>
              <p>{aiWorkflow.intro}</p>
            </div>
            <ol className="ai-steps">
              {aiWorkflow.steps.map((step, index) => (
                <li key={step.name} className="ai-step">
                  <p className="ai-step-no">
                    {String(index + 1).padStart(2, "0")} · {step.name}
                  </p>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                  <p className="ai-step-tools">{step.tools.join(" · ")}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
