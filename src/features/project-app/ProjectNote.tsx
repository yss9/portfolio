import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/content/types";

export function ProjectNote({ project, standalone, share, openSection }: {
  project: Project;
  standalone: boolean;
  share: ReactNode;
  openSection: (section: "demo" | "performance" | "features") => void;
}) {
  const Heading = standalone ? "h1" : "h2";
  const metric = project.performance[0]?.metrics[0];
  const preview = project.screenshots?.find((shot) => shot.src === project.preview.src);
  return (
    <article className="project-note">
      <header className="note-lead">
        <div>
          {project.program && <p className="note-program">{project.program}</p>}
          <Heading>{project.name}</Heading>
          <p className="note-headline">{project.note?.headline ?? project.tagline}</p>
        </div>
        {share}
        <dl className="note-meta">
          <div><dt>기간</dt><dd>{project.period}</dd></div>
          <div><dt>팀 구성</dt><dd>{project.team}</dd></div>
        </dl>
      </header>
      <div className="note-spread">
        <section>
          <h3>프로젝트 소개</h3>
          <p>{project.summary}</p>
        </section>
        <section>
          <h3>내가 맡은 일</h3>
          <p className="note-role">{project.role}</p>
          <p>{project.note?.contribution ?? project.focus}</p>
          <ul aria-label="사용 기술">{project.stackFlat.map((tech) => <li key={tech}>{tech}</li>)}</ul>
        </section>
      </div>
      {project.links.length > 0 && (
        <nav className="note-links" aria-label="프로젝트 관련 링크">
          {project.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}<ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </nav>
      )}
      <nav className="note-evidence" aria-label="프로젝트 자료">
        <button className="note-preview" onClick={() => openSection("demo")}>
          <Image src={project.preview.src} alt="" width={360} height={220} />
          <span className="evidence-copy">
            <strong>시연 화면 보기</strong>
            <span>{preview?.caption ?? project.preview.alt}</span>
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button onClick={() => openSection(metric ? "performance" : "features")}>
          <span className="evidence-copy">
            <strong>{metric ? "성능 개선 기록" : "구현 기능 보기"}</strong>
            {metric ? (
              <>
                <span className="note-values">{metric.before} → <b>{metric.after}</b></span>
                <span>{metric.label}</span>
              </>
            ) : <span>{project.features[0]?.title ?? project.focus}</span>}
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </nav>
    </article>
  );
}
