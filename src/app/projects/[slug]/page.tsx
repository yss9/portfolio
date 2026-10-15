import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProject,
  projectSlugs,
  projectNeighbours,
} from "@/content/projects";
import { projectStories } from "@/content/project-stories";
import { getShowcase } from "@/content/showcase";
import { evidence } from "@/content/evidence";
import { clips } from "@/content/clips";
import type {
  CodeExcerpt,
  ProjectScreenshot,
  TestGroup,
  Troubleshooting,
} from "@/content/types";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { DemoClips } from "@/components/project/DemoClips";
import { DetailToc } from "@/components/project/DetailToc";
import { FlowDiagram } from "@/components/project/FlowDiagram";
import { AwardIcon, CodeCard } from "@/components/ui/primitives";
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

function solutionOf(item: Troubleshooting) {
  return (
    item.solution ??
    item.steps
      .slice(-2)
      .map((step) => step.body)
      .join(" ")
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const story = projectStories[slug];
  const editorial = getShowcase(slug);
  const proof = evidence[slug];
  const { prev, next } = projectNeighbours(slug);
  const demoClips = clips[slug] ?? [];
  const cases = project.troubleshooting;
  const designCases = project.designNotes ?? [];
  const contributions = project.features.filter(
    (feature) => feature.category !== "팀 전체 기능",
  );
  const hasProblemSolving =
    cases.length > 0 ||
    designCases.length > 0 ||
    Boolean(project.implementationStory);

  const firstCase = cases[0] ?? designCases[0];
  const brief = editorial
    ? {
        problem: editorial.problem,
        solution: editorial.solution,
        result: editorial.result,
      }
    : firstCase
      ? {
          problem: firstCase.problem,
          solution: solutionOf(firstCase),
          result: firstCase.takeaway,
        }
      : null;

  const screens: ProjectScreenshot[] = [...(project.screenshots ?? [])];
  if (slug === "mofy" || slug === "saybridge") {
    const primary = screens.splice(1, 1)[0];
    if (primary) screens.unshift(primary);
  }
  if (slug === "glople") {
    screens.unshift({
      src: "/projects/glople/keyword-selection.png",
      alt: "Glople 여행 키워드 선택 화면에서 자연과 박물관 등의 취향을 선택하는 모습",
      caption: "키워드 선택 — 여행 취향을 입력하고 맞춤 추천을 시작",
    });
  }
  if (screens.length === 0 && project.architectureImage) {
    screens.push({
      ...project.architectureImage,
      caption: "배포 구조 — 정적 화면·API·데이터와 자동 배포 경로",
    });
  }

  const sections = [
    { id: "overview", label: "프로젝트 개요" },
    { id: "contribution", label: "제가 맡은 부분" },
    ...(hasProblemSolving
      ? [{ id: "problem-solving", label: "문제 해결" }]
      : []),
    ...(project.performance.length
      ? [{ id: "performance", label: "성능 검증" }]
      : []),
    { id: "tech-decisions", label: "기술 선택" },
    { id: "architecture", label: "시스템 구성" },
    { id: "learning", label: "배운 점" },
  ];

  return (
    <div className="project-detail">
      <header className="detail-hero site-container">
        <Link href="/#projects" className="detail-back">
          ← 전체 프로젝트
        </Link>
        <div className="detail-head">
          <div>
            <p className="eyebrow">
              PROJECT {project.no}
              {editorial ? ` · ${editorial.category}` : ""}
            </p>
            <h1>{project.name}</h1>
            <p className="detail-tagline">{project.tagline}</p>
            {project.award && (
              <p className="award-badge">
                <AwardIcon />
                {project.award}
              </p>
            )}
          </div>
          <p className="detail-focus">{project.focus}</p>
        </div>
        <dl className="detail-meta">
          <div>
            <dt>진행 기간</dt>
            <dd>{project.period}</dd>
          </div>
          <div>
            <dt>팀 구성</dt>
            <dd>{project.team}</dd>
          </div>
          <div>
            <dt>제 담당</dt>
            <dd>{project.role}</dd>
          </div>
          {project.links.length > 0 && (
            <div>
              <dt>링크</dt>
              <dd className="detail-links">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="button button-small button-outline"
                  >
                    {link.label}{" "}
                    <span aria-hidden="true">
                      {link.kind === "video" ? "▷" : "↗"}
                    </span>
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>
        {brief && (
          <dl className="detail-brief" aria-label="핵심 요약">
            <div>
              <dt>문제</dt>
              <dd>{brief.problem}</dd>
            </div>
            <div>
              <dt>해결</dt>
              <dd>{brief.solution}</dd>
            </div>
            <div>
              <dt>결과</dt>
              <dd>{brief.result}</dd>
            </div>
          </dl>
        )}
      </header>

      {/* Projects with demo loops show those instead of the still screenshots. */}
      {demoClips.length > 0 ? (
        <DemoClips name={project.name} clips={demoClips} />
      ) : (
        <ProjectGallery
          name={project.name}
          screens={screens}
          phone={slug === "potner"}
          diagram={slug === "aws-deploy"}
        />
      )}

      <div className="detail-layout site-container">
        <DetailToc sections={sections} />
        <div className="detail-body">
          <DetailSection id="overview" eyebrow="개요" title="어떤 서비스인가요?">
            <p className="prose-lg">{project.summary}</p>
            {story.blockchain && (
              <aside
                className="context-card"
                aria-labelledby="blockchain-context-title"
              >
                <p className="kicker">새로이의 블록체인</p>
                <h3 id="blockchain-context-title">
                  블록체인은 어디에 쓰이나요?
                </h3>
                <p>{story.blockchain.purpose}</p>
                <h4>왜 지갑 서명이 필요한가요?</h4>
                <p>{story.blockchain.signature}</p>
                <FlowDiagram
                  steps={story.blockchain.flow.map((step) => ({
                    label: step.title,
                    detail: step.body,
                  }))}
                />
                <p className="context-note">{story.blockchain.scopeNote}</p>
              </aside>
            )}
            <dl className="overview-grid">
              <div>
                <dt>배경과 필요</dt>
                <dd>{story.background}</dd>
              </div>
              <div>
                <dt>설계 목표</dt>
                <dd>{story.goal}</dd>
              </div>
              <div className="is-wide">
                <dt>대상 사용자</dt>
                <dd>{story.audience}</dd>
              </div>
            </dl>
          </DetailSection>

          <DetailSection
            id="contribution"
            eyebrow="기여"
            title="제가 맡은 부분"
            lead="전체 서비스 안에서 직접 구현하거나 공동으로 맡은 기능입니다."
          >
            <ul className="contribution-list">
              {contributions.map((feature, index) => (
                <li key={feature.title} className="contribution">
                  <div className="contribution-top">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {feature.category && <span>{feature.category}</span>}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </li>
              ))}
            </ul>
            {story.scopeNote && (
              <div className="callout">
                <p className="callout-title">기여 범위</p>
                <p>{story.scopeNote}</p>
              </div>
            )}
          </DetailSection>

          {hasProblemSolving && (
            <DetailSection
              id="problem-solving"
              eyebrow="문제 해결"
              title="문제를 풀어낸 과정"
              lead="문제와 해결, 확인한 결과를 먼저 적고, 실제 코드와 테스트를 근거로 붙였습니다."
            >
              {proof?.flow && (
                <FlowDiagram
                  title={proof.flow.title}
                  steps={proof.flow.steps}
                  guards={proof.flow.guards}
                />
              )}

              {project.implementationStory && (
                <div className="case-group mt-10">
                  <h3 className="sub-title">
                    중복 응답에도 급수가 반복되지 않도록
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-[1.8] text-ink-dim">
                    {project.implementationStory.introduction[1]}
                  </p>
                  <ol className="decision-grid">
                    {project.implementationStory.decisions.map(
                      (decision, index) => (
                        <li key={decision.title} className="decision">
                          <p className="kicker">설계 판단 0{index + 1}</p>
                          <h4>{decision.title}</h4>
                          <p>{decision.body}</p>
                        </li>
                      ),
                    )}
                  </ol>
                  {proof?.cases.implementation && (
                    <Evidence {...proof.cases.implementation} />
                  )}
                  <div className="verification">
                    <h4>확인한 결과</h4>
                    <p>{project.implementationStory.verification}</p>
                  </div>
                </div>
              )}

              {cases.length > 0 && (
                <div className={proof?.flow ? "case-group mt-10" : "case-group"}>
                  {cases.map((item) => (
                    <CaseCard
                      key={item.id}
                      item={item}
                      proof={proof?.cases[item.id]}
                    />
                  ))}
                </div>
              )}
              {designCases.length > 0 && (
                <div className="case-group">
                  {slug === "mofy" && (
                    <div className="callout mb-5">
                      <p className="callout-title">팀 서비스의 설계 참고</p>
                      <p>
                        아래 두 사례는 서비스 전체의 구조 설명입니다. 제 담당은
                        위에 표시한 메시지 기능 공동 구현입니다.
                      </p>
                    </div>
                  )}
                  {designCases.map((item) => (
                    <CaseCard
                      key={item.id}
                      item={item}
                      kind={slug === "mofy" ? "팀 서비스 설계" : "설계 판단"}
                    />
                  ))}
                </div>
              )}
              {project.troubleshootingNote && (
                <div className="callout">
                  <p className="callout-title">현재의 한계</p>
                  <p>{project.troubleshootingNote}</p>
                </div>
              )}
            </DetailSection>
          )}

          {project.performance.length > 0 && (
            <DetailSection
              id="performance"
              eyebrow="성능 검증"
              title="개선 전과 후"
              lead="같은 조건에서 비교한 로컬 측정입니다. 측정 조건을 결과와 함께 적었습니다."
            >
              {project.performance.map((item) => (
                <article key={item.id} className="perf-case">
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div className="mt-5">
                    <MetricPanel
                      metrics={item.metrics}
                      condition={item.condition}
                    />
                  </div>
                  <div className="perf-code">
                    {[item.before, item.after].map((side) => (
                      <div key={side.label} className="min-w-0">
                        <h4>{side.label}</h4>
                        <CodeCard {...side.code} />
                        {side.notes && (
                          <p className="perf-code-notes">
                            {side.notes.join(" · ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </DetailSection>
          )}

          <DetailSection
            id="tech-decisions"
            eyebrow="기술 선택"
            title="왜 이 기술인가요?"
            lead="기술 이름보다 해결하려던 작업과 적용 이유를 적었습니다."
          >
            <div className="tech-choices">
              {story.choices.map((choice) => (
                <article key={choice.technology} className="tech-choice">
                  <h3>{choice.technology}</h3>
                  <div>
                    <h4>{choice.purpose}</h4>
                    <p>{choice.reason}</p>
                  </div>
                </article>
              ))}
            </div>
            <dl className="stack-summary" aria-label="프로젝트 전체 사용 기술">
              {project.stack.map((group) => (
                <div key={group.group}>
                  <dt>{group.group}</dt>
                  <dd className="tag-list">
                    {group.items.map((item) => (
                      <span key={item} className="tag">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </DetailSection>

          <DetailSection
            id="architecture"
            eyebrow="시스템 구성"
            title="흐름을 연결한 구조"
          >
            {project.architectureImage && (
              <figure className="architecture-figure">
                <a
                  href={project.architectureImage.src}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="시스템 구성도 원본 새 창으로 보기"
                >
                  <Image
                    src={project.architectureImage.src}
                    alt={project.architectureImage.alt}
                    width={project.architectureImage.width}
                    height={project.architectureImage.height}
                    sizes="(min-width: 1200px) 860px, 95vw"
                    className="h-auto w-full"
                  />
                </a>
                <figcaption>
                  <span>프로젝트 전체 시스템 구성</span>
                  <span>이미지를 누르면 크게 볼 수 있습니다</span>
                </figcaption>
              </figure>
            )}
            <p className="architecture-intent text-[16px] leading-[1.8] text-ink-dim">
              {project.architectureIntent}
            </p>
            <details
              className="case-expand mt-6"
              open={!project.architectureImage}
            >
              <summary>구성 요소별 역할 보기</summary>
              <ul className="node-list">
                {project.architecture.map((node) => (
                  <li key={node.id}>
                    <h3>{node.label}</h3>
                    <p>{node.role}</p>
                  </li>
                ))}
              </ul>
            </details>
          </DetailSection>

          <DetailSection id="learning" eyebrow="배운 점" title="경험이 남긴 기준">
            <blockquote className="learning">{story.learning}</blockquote>
          </DetailSection>
        </div>
      </div>

      <nav className="pager site-container" aria-label="다른 프로젝트 살펴보기">
        {prev ? (
          <Link href={`/projects/${prev.slug}`}>
            <span>← 이전 프로젝트</span>
            <p>{prev.name}</p>
            <small>{prev.tagline}</small>
          </Link>
        ) : (
          <Link href="/#projects">
            <span>← 전체 프로젝트</span>
            <p>프로젝트 목록</p>
            <small>대표 프로젝트와 그 밖의 작업</small>
          </Link>
        )}
        {next ? (
          <Link href={`/projects/${next.slug}`} className="is-next">
            <span>다음 프로젝트 →</span>
            <p>{next.name}</p>
            <small>{next.tagline}</small>
          </Link>
        ) : (
          <Link href="/#projects" className="is-next">
            <span>전체 프로젝트 →</span>
            <p>프로젝트 목록</p>
            <small>대표 프로젝트와 그 밖의 작업</small>
          </Link>
        )}
      </nav>
    </div>
  );
}

function DetailSection({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="detail-section" aria-labelledby={`${id}-title`}>
      <header className="detail-section-head">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        {lead && <p className="detail-section-lead">{lead}</p>}
      </header>
      {children}
    </section>
  );
}

function basename(path: string) {
  return path.split("/").pop() ?? path;
}

function Evidence({ code, tests }: { code: CodeExcerpt[]; tests: TestGroup[] }) {
  const repos = [...new Set(code.map((item) => item.repo))];
  return (
    <>
      {code.length > 0 && (
        <div className="evidence">
          <div className="evidence-title">
            <h4>핵심 코드</h4>
            <p>저장소에서 그대로 발췌했습니다 · {repos.join(", ")}</p>
          </div>
          <div className="evidence-stack">
            {code.map((item) => (
              <CodeCard
                key={`${item.file}-${item.lines}`}
                filename={basename(item.file)}
                fileTitle={item.file}
                meta={item.lines}
                language={item.language}
                code={item.code}
                caption={
                  <>
                    <strong>{item.title}</strong> — {item.caption}
                  </>
                }
              />
            ))}
          </div>
        </div>
      )}
      {tests.length > 0 && (
        <div className="evidence">
          <div className="evidence-title">
            <h4>관련 테스트</h4>
            <p>저장소의 테스트 메서드입니다</p>
          </div>
          <div className="evidence-stack">
            {tests.map((group) => (
              <div key={group.file} className="test-list">
                <p className="test-list-head">
                  <code title={group.file}>{basename(group.file)}</code>
                  <span>{group.cases.length}개</span>
                </p>
                <ul>
                  {group.cases.map((test) => {
                    const plain = test.desc === test.name.replaceAll("_", " ");
                    return (
                      <li key={test.name} title={test.name}>
                        <div>
                          {test.desc}
                          {!plain && <code>{test.name}</code>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function CaseCard({
  item,
  kind = "문제 해결",
  proof,
}: {
  item: Troubleshooting;
  kind?: string;
  proof?: { code: CodeExcerpt[]; tests: TestGroup[] };
}) {
  return (
    <article className="case">
      <p className="kicker">{kind}</p>
      <h3>{item.title}</h3>
      <dl className="case-rows">
        <div className="case-row">
          <dt>문제</dt>
          <dd>{item.problem}</dd>
        </div>
        <div className="case-row">
          <dt>해결</dt>
          <dd>{solutionOf(item)}</dd>
        </div>
        <div className="case-row is-result">
          <dt>결과</dt>
          <dd>{item.takeaway}</dd>
        </div>
      </dl>
      {proof ? (
        <Evidence {...proof} />
      ) : (
        item.code &&
        item.code.length > 0 && (
          <div className="evidence">
            <div className="evidence-stack">
              {item.code.map((block, index) => (
                <CodeCard key={index} {...block} />
              ))}
            </div>
          </div>
        )
      )}
      <details className="case-expand mt-6">
        <summary>판단 과정 단계별로 보기</summary>
        <ol className="case-steps">
          {item.steps.map((step, index) => (
            <li key={`${step.label}-${index}`}>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </details>
    </article>
  );
}
