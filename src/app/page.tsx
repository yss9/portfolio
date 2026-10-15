import Image from "next/image";
import Link from "next/link";
import { aiWorkflow, profile, techStack } from "@/content/profile";
import { projects, getProject } from "@/content/projects";
import { featuredSlugs, showcase } from "@/content/showcase";
import { AwardIcon } from "@/components/ui/primitives";
import { LoopVideo } from "@/components/project/LoopVideo";
import { clips } from "@/content/clips";

export default function Home() {
  const otherProjects = projects.filter(
    (project) => !featuredSlugs.some((slug) => slug === project.slug),
  );

  return (
    <>
      <section id="about" className="intro" aria-labelledby="about-title">
        <div className="site-container">
          <div className="intro-grid">
            <div>
              <p className="hero-kicker">
                <span className="status-dot" aria-hidden="true" />
                {profile.positioning.kicker}
              </p>
              <h1 id="about-title">
                {profile.positioning.title[0]}
                <br />
                {profile.positioning.title[1]}
                <br />
                <em>{profile.positioning.title[2]}</em>
              </h1>
              <p className="hero-lead">{profile.positioning.lead}</p>
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
                <a href={`mailto:${profile.email}`} className="button button-outline">
                  이메일 보내기 <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <aside className="profile-card" aria-labelledby="profile-card-title">
              <h2 id="profile-card-title">학력 · 수상 · 자격</h2>
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
                        {award.title}
                        <span>{award.project}</span>
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
            </aside>
          </div>

          <div className="dev-areas">
            <div className="sub-head">
              <h2 className="sub-head-title">주로 하는 개발</h2>
              <p>분야마다 실제로 만든 프로젝트로 이어집니다.</p>
            </div>
            <ul className="dev-grid">
              {profile.devAreas.map((area) => (
                <li key={area.title} className="dev-card">
                  <p className="dev-card-label">{area.label}</p>
                  <h3>{area.title}</h3>
                  <p className="dev-card-desc">{area.desc}</p>
                  <p className="dev-metric">{area.metric}</p>
                  <div className="dev-card-foot">
                    <ul className="tag-list" aria-label="주요 기술">
                      {area.tags.map((tag) => (
                        <li key={tag} className="tag">
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <p className="dev-links">
                      {area.projects.map((item) => (
                        <Link key={item.slug} href={`/projects/${item.slug}`}>
                          {item.name} <span aria-hidden="true">→</span>
                        </Link>
                      ))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="skills" className="section" aria-labelledby="skills-title">
        <div className="site-container">
          <header className="section-head">
            <p className="eyebrow">기술 스택 · AI 활용</p>
            <h2 id="skills-title">프로젝트에 쓴 기술과 AI 활용 방식</h2>
          </header>

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

      <section
        id="projects"
        className="section section-soft"
        aria-labelledby="projects-title"
      >
        <div className="site-container">
          <header className="section-head">
            <h2 id="projects-title">프로젝트</h2>
            <p className="section-lead">
              제가 직접 맡은 구현과, 어떤 문제를 어떻게 풀었는지에 집중해
              정리했습니다.
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
    </>
  );
}
