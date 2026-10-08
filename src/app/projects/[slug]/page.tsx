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
import type { Troubleshooting, ProjectScreenshot } from "@/content/types";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { Chip, CodeCard } from "@/components/ui/primitives";
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
  const story = projectStories[slug];
  const editorial = getShowcase(slug);
  const { prev, next } = projectNeighbours(slug);
  const cases = project.troubleshooting;
  const designCases = project.designNotes ?? [];
  const contributions = project.features.filter(
    (feature) => feature.category !== "팀 전체 기능",
  );
  const hasProblemSolving =
    cases.length > 0 ||
    designCases.length > 0 ||
    Boolean(project.implementationStory);
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
  const sectionLinks = [
    ...(screens.length
      ? [
          {
            href: "#screens",
            label:
              slug === "aws-deploy" ? "배포 구조 이미지" : "프로젝트 이미지",
          },
        ]
      : []),
    { href: "#overview", label: "프로젝트 개요" },
    { href: "#contribution", label: "본인 기여" },
    ...(hasProblemSolving
      ? [{ href: "#problem-solving", label: "문제 해결·설계" }]
      : []),
    ...(project.performance.length
      ? [{ href: "#performance", label: "검증 결과" }]
      : []),
    { href: "#tech-decisions", label: "기술 선택" },
    { href: "#architecture", label: "시스템 구성" },
    { href: "#learning", label: "배운 점" },
  ];
  const sectionNumber = (id: string) =>
    String(
      sectionLinks.findIndex((section) => section.href === `#${id}`) + 1,
    ).padStart(2, "0");

  return (
    <div data-accent={slug} className="project-detail">
      <header className="detail-hero site-container">
        <Link href="/#projects" className="detail-back text-link">
          ← 프로젝트 목록
        </Link>
        <ProjectGallery
          key={slug}
          name={project.name}
          screens={screens}
          phone={slug === "potner"}
          diagram={slug === "aws-deploy"}
        />
        <div className="detail-hero-grid">
          <div>
            <p className="project-category">
              PROJECT {project.no} /{" "}
              {editorial?.category ?? "ENGINEERING CASE STUDY"}
            </p>
            <h1>{project.name}</h1>
            <p className="detail-tagline">{project.tagline}</p>
          </div>
          <div className="detail-story-intro">
            <p className="detail-focus">{project.focus}</p>
            {project.award && (
              <p className="project-evidence">
                <span aria-hidden="true">↳</span>
                {project.award}
              </p>
            )}
            {project.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
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
              </div>
            )}
          </div>
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
            <dt>본인 담당</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
      </header>
      <nav className="detail-index" aria-label="프로젝트 상세 목차">
        <div className="site-container">
          {sectionLinks.map((section) => (
            <a href={section.href} key={section.href}>
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <DetailSection
        id="overview"
        number={sectionNumber("overview")}
        eyebrow="OVERVIEW"
        title="어떤 서비스인가요?"
      >
        <p className="overview-summary">{project.summary}</p>
        {story.blockchain && (
          <aside
            className="blockchain-context"
            aria-labelledby="blockchain-context-title"
          >
            <p className="project-category">BLOCKCHAIN IN SAEROI</p>
            <h3 id="blockchain-context-title">블록체인은 어디에 쓰이나요?</h3>
            <p>{story.blockchain.purpose}</p>
            <h4>왜 지갑 서명이 필요한가요?</h4>
            <p>{story.blockchain.signature}</p>
            <ol className="signature-flow" aria-label="블록체인 작업 처리 순서">
              {story.blockchain.flow.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h5>{step.title}</h5>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="blockchain-scope">{story.blockchain.scopeNote}</p>
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
        </dl>
        <p className="audience-line">
          <strong>대상 사용자</strong>
          {story.audience}
        </p>
      </DetailSection>

      <DetailSection
        id="contribution"
        number={sectionNumber("contribution")}
        eyebrow="MY CONTRIBUTION"
        title="제가 맡은 부분"
        lead="전체 서비스 안에서 직접 구현하거나 공동으로 맡은 기능입니다."
      >
        <ul className="contribution-list">
          {contributions.map((feature, index) => (
            <li key={feature.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                {feature.category && (
                  <span className="contribution-category">
                    {feature.category}
                  </span>
                )}
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        {story.scopeNote && (
          <p className="scope-note">
            <strong>기여 범위와 구분</strong>
            {story.scopeNote}
          </p>
        )}
      </DetailSection>

      {hasProblemSolving && (
        <DetailSection
          id="problem-solving"
          number={sectionNumber("problem-solving")}
          eyebrow="PROBLEM & DECISION"
          title="문제를 풀어낸 과정"
          lead="발생한 문제, 선택한 방법과 이유, 확인한 결과를 이어서 설명합니다."
        >
          {project.implementationStory && (
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                중복 응답에도 급수가 반복되지 않도록
              </h3>
              <p className="mt-4 text-sm leading-8 text-muted">
                {project.implementationStory.introduction[1]}
              </p>
              <div className="care-flow" aria-label="자동 급수 순서">
                {["수분 부족 감지", "스테이션 이동", "급수", "원위치 복귀"].map(
                  (step, index) => (
                    <span key={step}>
                      {index > 0 && <span aria-hidden="true">→</span>}
                      <b>{step}</b>
                    </span>
                  ),
                )}
              </div>
              <ol className="decision-grid">
                {project.implementationStory.decisions.map(
                  (decision, index) => (
                    <li key={decision.title}>
                      <p className="project-category mb-2">
                        DECISION 0{index + 1}
                      </p>
                      <h3>{decision.title}</h3>
                      <p>{decision.body}</p>
                    </li>
                  ),
                )}
              </ol>
              <div className="verification-panel">
                <h3>확인한 결과와 검증 방법</h3>
                <p>{project.implementationStory.verification}</p>
              </div>
              <details className="case-expand">
                <summary>구현 근거 파일 살펴보기</summary>
                <ul className="code-references">
                  {project.implementationStory.codeReferences.map(
                    (reference) => (
                      <li key={reference.file}>
                        {reference.label}
                        <code>
                          {reference.file}:{reference.line}
                        </code>
                      </li>
                    ),
                  )}
                </ul>
              </details>
            </div>
          )}
          {cases.length > 0 && (
            <div className="case-list">
              {cases.map((item) => (
                <CaseCard key={item.id} item={item} />
              ))}
            </div>
          )}
          {designCases.length > 0 && (
            <div className={cases.length ? "case-list mt-8" : "case-list"}>
              {slug === "mofy" && (
                <p className="scope-note">
                  <strong>팀 서비스의 설계 참고</strong>아래 두 사례는 서비스
                  전체의 구조 설명입니다. 본인 담당은 위에 표시한 메시지 기능
                  공동 구현입니다.
                </p>
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
            <p className="scope-note">
              <strong>현재의 한계와 확인 범위</strong>
              {project.troubleshootingNote}
            </p>
          )}
        </DetailSection>
      )}

      {project.performance.length > 0 && (
        <DetailSection
          id="performance"
          number={sectionNumber("performance")}
          eyebrow="VERIFICATION"
          title="개선 전과 후"
          lead="기록된 로컬 비교 측정입니다. 각 지표에 측정 조건을 함께 표시했습니다."
        >
          <div className="space-y-10">
            {project.performance.map((item) => (
              <article key={item.id}>
                <h3 className="text-xl font-semibold tracking-tight leading-8">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {item.summary}
                </p>
                <div className="mt-5">
                  <MetricPanel
                    metrics={item.metrics}
                    condition={item.condition}
                  />
                </div>
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {[item.before, item.after].map((side) => (
                    <div key={side.label} className="min-w-0">
                      <h4 className="mb-3 text-xs font-semibold leading-6">
                        {side.label}
                      </h4>
                      <CodeCard {...side.code} />
                      {side.notes && (
                        <p className="mt-3 text-xs leading-6 text-muted">
                          {side.notes.join(" · ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </DetailSection>
      )}

      <DetailSection
        id="tech-decisions"
        number={sectionNumber("tech-decisions")}
        eyebrow="TECHNOLOGY CHOICES"
        title="왜 이 기술인가요?"
        lead="기술 이름보다 해결하려던 작업과 적용 이유를 설명합니다."
      >
        <div>
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
        <div className="stack-summary">
          <p>
            프로젝트 전체 사용 기술 · 본인 적용 범위는 위 기여와 기술 선택에
            표시했습니다.
          </p>
          <dl>
            {project.stack.map((group) => (
              <div key={group.group}>
                <dt>{group.group}</dt>
                <dd>
                  {group.items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </DetailSection>

      <DetailSection
        id="architecture"
        number={sectionNumber("architecture")}
        eyebrow="SYSTEM ARCHITECTURE"
        title="흐름을 연결한 구조"
      >
        {project.architectureImage && (
          <figure className="architecture-figure">
            <Image
              src={project.architectureImage.src}
              alt={project.architectureImage.alt}
              width={project.architectureImage.width}
              height={project.architectureImage.height}
              sizes="(min-width: 1200px) 950px, 100vw"
              className="h-auto w-full"
            />
            <figcaption>
              <span>프로젝트 전체 시스템 구성</span>
              <a
                href={project.architectureImage.src}
                target="_blank"
                rel="noreferrer noopener"
                className="text-link"
              >
                구성도 크게 보기 ↗
              </a>
            </figcaption>
          </figure>
        )}
        <p className="architecture-intent">{project.architectureIntent}</p>
        <details className="case-expand" open={!project.architectureImage}>
          <summary>구성 요소별 역할 보기</summary>
          <ul className="architecture-nodes">
            {project.architecture.map((node) => (
              <li key={node.id}>
                <h3>{node.label}</h3>
                <p>{node.role}</p>
              </li>
            ))}
          </ul>
        </details>
      </DetailSection>

      <DetailSection
        id="learning"
        number={sectionNumber("learning")}
        eyebrow="WHAT I LEARNED"
        title="경험이 남긴 기준"
      >
        <p className="learning-text">{story.learning}</p>
      </DetailSection>
      <nav
        className="project-pagination site-container"
        aria-label="다른 프로젝트 살펴보기"
      >
        {prev ? (
          <Link href={`/projects/${prev.slug}`}>
            <span>← 이전 프로젝트</span>
            <p>{prev.name}</p>
          </Link>
        ) : (
          <Link href="/#projects">
            <span>← 전체 프로젝트</span>
            <p>다른 작업 살펴보기</p>
          </Link>
        )}
        {next ? (
          <Link href={`/projects/${next.slug}`} className="text-right">
            <span>다음 프로젝트 →</span>
            <p>{next.name}</p>
          </Link>
        ) : (
          <Link href="/#projects" className="text-right">
            <span>전체 프로젝트 →</span>
            <p>목록으로 돌아가기</p>
          </Link>
        )}
      </nav>
    </div>
  );
}

function DetailSection({
  id,
  number,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="case-section">
      <div className="case-section-grid site-container">
        <header className="case-section-heading">
          <p className="project-category">
            {number} / {eyebrow}
          </p>
          <h2>{title}</h2>
          {lead && <p className="case-section-lead">{lead}</p>}
        </header>
        <div className="case-content">{children}</div>
      </div>
    </section>
  );
}

function CaseCard({
  item,
  kind = "문제 해결",
}: {
  item: Troubleshooting;
  kind?: string;
}) {
  return (
    <article className="problem-case">
      <p className="project-category mb-2">{kind}</p>
      <h3>{item.title}</h3>
      <dl>
        <div>
          <dt>01 / 문제와 제약</dt>
          <dd>{item.problem}</dd>
        </div>
        <div>
          <dt>02 / 선택한 해결 방법</dt>
          <dd>
            {item.solution ??
              item.steps
                .slice(-2)
                .map((step) => step.body)
                .join(" ")}
          </dd>
        </div>
        <div className="case-result">
          <dt>03 / 확인한 결과</dt>
          <dd>{item.takeaway}</dd>
        </div>
      </dl>
      <details className="case-expand">
        <summary>
          판단 과정{item.code?.length ? "과 코드" : ""} 자세히 보기
        </summary>
        <ol className="case-step-list">
          {item.steps.map((step, index) => (
            <li key={`${step.label}-${index}`}>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        {item.code && (
          <div className="mt-5 space-y-4">
            {item.code.map((block, index) => (
              <CodeCard key={index} {...block} />
            ))}
          </div>
        )}
      </details>
    </article>
  );
}
