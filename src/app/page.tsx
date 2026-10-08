import Image from "next/image";
import Link from "next/link";
import { aiWorkflow, profile, techStack } from "@/content/profile";
import { projects, getProject } from "@/content/projects";
import { featuredSlugs, showcase } from "@/content/showcase";

export default function Home() {
  const otherProjects = projects.filter(
    (project) => !featuredSlugs.some((slug) => slug === project.slug),
  );

  return (
    <>
      <section className="hero site-container" aria-labelledby="hero-title">
        <div className="hero-copy rise">
          <p className="section-label">
            <span className="status-dot" />
            YOUNGSEOK SEO · PORTFOLIO
          </p>
          <h1 id="hero-title">
            <span className="hero-line">안녕하세요.</span>
            <span className="hero-line">
              백엔드 개발자 <span className="hero-highlight">서영석</span>입니다
              <span className="text-signal">.</span>
            </span>
          </h1>
          <p className="hero-description">
            웹 서비스부터 실시간 통신, IoT까지 다양한 프로젝트를 경험했습니다.
            <br className="hidden sm:block" /> 백엔드를 중심으로 화면과 배포까지
            연결하며 서비스를 만들어 왔습니다.
          </p>
          <p className="hero-ai-description">
            개발 과정에서는 AI를 조사·설계·구현에 활용하고, 결과를 직접
            확인합니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="#projects" className="button button-primary">
              프로젝트 바로가기 <span aria-hidden="true">↓</span>
            </Link>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-link"
            >
              GitHub ↗
            </a>
            <Link href="#ai-assisted" className="text-link">
              AI 활용 방식 보기 ↓
            </Link>
          </div>
        </div>
        <div className="hero-bottom">
          <Link href="/projects/saeroi#contribution" className="hero-proof">
            <strong>
              31개<span>업무 도구 연결</span>
            </strong>
            <span>새로이 · 승인형 AI 어시스턴트 ↗</span>
          </Link>
          <Link href="/projects/potner#problem-solving" className="hero-proof">
            <strong>
              중복·지연<span>응답 검증</span>
            </strong>
            <span>PotneR · 명령 처리 예외 테스트 ↗</span>
          </Link>
          <Link href="/projects/glople#performance" className="hero-proof">
            <strong>
              −74.2%<span>평균 응답 시간</span>
            </strong>
            <span>Glople · 로컬 JMeter 비교 측정 ↗</span>
          </Link>
        </div>
      </section>

      <section
        id="about"
        className="about-section"
        aria-labelledby="about-title"
      >
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="section-label">
                <span>01 / ABOUT ME</span>경험을 이어가는 개발자
              </p>
              <h2 id="about-title">
                동작하는 다음을
                <br />
                생각합니다<span className="text-signal">.</span>
              </h2>
            </div>
            <p className="section-intro">
              기능이 연결되는 순간부터,
              <br />
              예상과 다르게 동작하는 순간까지.
              <br />
              서비스의 전체 흐름을 이해하려고 합니다.
            </p>
          </div>
          <div className="about-grid">
            <div>
              <p className="about-lead">
                상태를 추적하고,
                <br />
                변경의 근거를 남깁니다.
              </p>
              <div className="mt-6 space-y-4">
                {profile.intro.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-8 text-ink-dim"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <dl className="profile-facts">
                {profile.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div id="principles" className="principle-list">
              {profile.principles.map((principle, index) => (
                <article key={principle.title}>
                  <span className="principle-number">0{index + 1}</span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div id="stack" className="skills-section">
            <div className="skills-heading">
              <h3>기술을 쓰는 방식</h3>
              <p>직접 적용한 작업으로 설명합니다.</p>
            </div>
            <div className="skills-grid">
              {techStack.map((group) => (
                <article key={group.group}>
                  <p className="project-category">{group.group}</p>
                  <h4>{group.items.join(" · ")}</h4>
                  <p className="skill-description">{group.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section
        id="ai-assisted"
        className="ai-section site-container"
        aria-labelledby="ai-title"
      >
        <div className="section-heading">
          <div>
            <p className="section-label">
              <span>02 / AI IN MY WORK</span>AI를 활용하는 개발 과정
            </p>
            <h2 id="ai-title">
              AI와 함께 탐색하고,
              <br />
              직접 검증하며 완성합니다<span className="text-signal">.</span>
            </h2>
          </div>
          <p className="section-intro">{aiWorkflow.intro}</p>
        </div>
        <ol className="ai-process">
          {aiWorkflow.steps.map((step, index) => (
            <li key={step.name}>
              <div className="ai-step-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{step.name}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <ul className="ai-step-tools" aria-label={`${step.title} 도구`}>
                {step.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="ai-working-set">
          <div>
            <p className="project-category">WORKING SET</p>
            <p>
              목적에 맞는 도구를 선택하고, 최종 판단과 결과는 직접 책임집니다.
            </p>
          </div>
          <ul className="ai-step-tools" aria-label="활용하는 AI 도구">
            {aiWorkflow.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="projects"
        className="work-section site-container"
        aria-labelledby="projects-title"
      >
        <div className="section-heading">
          <div>
            <p className="section-label">
              <span>03 / SELECTED WORK</span>구현으로 설명하는 경험
            </p>
            <h2 id="projects-title">
              만든 것보다,
              <br />
              해결한 것에 집중합니다<span className="text-signal">.</span>
            </h2>
          </div>
          <p className="section-intro">
            서비스의 목적부터 직접 내린 판단까지.
            <br />
            서로 다른 세 프로젝트에 담긴
            <br />
            문제 해결 과정을 소개합니다.
          </p>
        </div>
        <div className="featured-list">
          {featuredSlugs.map((slug, index) => {
            const project = getProject(slug)!;
            const editorial = showcase[slug];
            return (
              <article
                key={slug}
                data-accent={slug}
                className={`featured-project featured-${slug}`}
              >
                <Link
                  href={`/projects/${slug}`}
                  className="project-visual"
                  aria-label={`${project.name} 프로젝트 상세 보기`}
                >
                  <div className="visual-topline">
                    <span>{editorial.visualLabel}</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                  {slug === "potner" ? (
                    <div className="phone-pair">
                      <div className="project-phone">
                        <Image
                          src="/projects/potner/overview.png"
                          alt={project.preview.alt}
                          fill
                          sizes="(min-width: 768px) 230px, 40vw"
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="project-phone phone-secondary">
                        <Image
                          src="/projects/potner/environment.png"
                          alt="PotneR 앱에서 확인하는 실시간 환경 센서 값과 변화 그래프"
                          fill
                          sizes="(min-width: 768px) 210px, 36vw"
                          className="object-cover object-top"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="project-browser">
                      <div className="browser-chrome">
                        <span aria-hidden="true">● ● ●</span>
                        <span>
                          {slug === "saeroi"
                            ? "브랜드의 다음 업무를 연결하는 어시스턴트"
                            : "영상과 채팅이 함께하는 1:1 수업"}
                        </span>
                      </div>
                      <div className="project-browser-image">
                        <Image
                          src={
                            slug === "saeroi"
                              ? "/projects/saeroi/assistant-approval.png"
                              : "/projects/saybridge/webcam.png"
                          }
                          alt={
                            slug === "saeroi"
                              ? "소재 구매 안내와 지갑 서명 확인 카드가 보이는 새로이 AI 어시스턴트"
                              : "SayBridge에서 화상 수업과 실시간 채팅을 함께 진행하는 화면"
                          }
                          fill
                          sizes="(min-width: 1280px) 650px, (min-width: 768px) 55vw, 90vw"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                  <div className="visual-caption">
                    <span>실제 서비스 화면</span>
                    <span>{String(index + 1).padStart(2, "0")} / 03</span>
                  </div>
                </Link>
                <div className="project-copy">
                  <p className="project-category">{editorial.category}</p>
                  <div className="project-name-line">
                    <h3>{project.name}</h3>
                    <span>{project.period}</span>
                  </div>
                  <p className="project-statement">{editorial.title}</p>
                  <p className="project-description">{editorial.description}</p>
                  <p className="project-evidence">
                    <span aria-hidden="true">↳</span>
                    {editorial.evidence}
                  </p>
                  <dl className="project-role">
                    <dt>본인 역할</dt>
                    <dd>{project.role}</dd>
                  </dl>
                  <ul className="project-tech" aria-label="주요 사용 기술">
                    {project.stackFlat.slice(0, 4).map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  <Link
                    href={`/projects/${slug}`}
                    className="text-link project-read"
                  >
                    구현과 해결 과정 보기 <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="archive-heading">
          <h3>더 많은 프로젝트</h3>
          <span className="font-mono">
            {String(otherProjects.length).padStart(2, "0")} MORE EXPLORATIONS
          </span>
        </div>
        <ul className="project-archive">
          {otherProjects.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="archive-row">
                <span className="archive-number">{project.no}</span>
                <div className="archive-title">
                  <h4>{project.name}</h4>
                  <p>{project.tagline}</p>
                </div>
                <p className="archive-focus">{project.focus}</p>
                <span className="archive-period">{project.period}</span>
                <span className="archive-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
