import Link from "next/link";
import { aiWorkflow, profile, techStack } from "@/content/profile";
import { projectApps, type AppDefinition } from "@/lib/content/apps";
import { AppIcon } from "./Identity";
import published from "@/content/published.json";

import { ordinaryClick } from "./links";

export function RecordsList() {
  return (
    <div className="library">
      <h2>개발 기록</h2>
      {(published as { slug: string; title: string }[]).map((p) => (
        <Link
          className="library-row"
          key={p.slug}
          href={"/records/" + p.slug + "/"}
        >
          <strong>{p.title}</strong>
        </Link>
      ))}
      {projectApps.map((p) => (
        <Link
          className="library-row"
          key={p.id}
          href={p.canonicalHref.replace("/projects/", "/records/")}
        >
          <AppIcon name={p.icon} />
          <div>
            <strong>{p.title}</strong>
            <small>{p.shortRole}</small>
          </div>
        </Link>
      ))}
    </div>
  );
}
export default function LibraryApp({
  id,
  open,
}: {
  id: string;
  open: (app: AppDefinition, el: HTMLElement) => void;
}) {
  if (id === "records") return <RecordsList />;
  if (id === "works")
    return (
      <div className="library">
        <h2>전체 작업</h2>
        <table>
          <thead>
            <tr>
              <th>프로젝트</th>
              <th>역할</th>
              <th>기술</th>
            </tr>
          </thead>
          <tbody>
            {projectApps.map((p) => (
              <tr key={p.id}>
                <td>
                  <a
                    href={p.canonicalHref}
                    onClick={(e) => {
                      if (ordinaryClick(e)) {
                        e.preventDefault();
                        open(p, e.currentTarget);
                      }
                    }}
                  >
                    {p.title}
                  </a>
                </td>
                <td>{p.shortRole}</td>
                <td>{p.tech.slice(0, 3).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  if (id === "contact")
    return (
      <div className="library">
        <AppIcon name="contact" />
        <h2>연락처</h2>
        <p>
          {profile.name} · {profile.role}
        </p>
        <a className="library-row" href={"mailto:" + profile.email}>
          {profile.email}
        </a>
        <a
          className="library-row"
          href={profile.github}
          target="_blank"
          rel="noreferrer"
        >
          {profile.githubLabel}
        </a>
      </div>
    );
  return (
    <div className="library">
      <AppIcon name="profile" />
      <h2>{profile.name}</h2>
      <p>{profile.positioning.lead}</p>
      <h3>주요 개발 경험</h3>
      {profile.devAreas.map((area) => (
        <section key={area.label}>
          <h4>{area.title}</h4>
          <p>{area.desc}</p>
          <small>{area.metric}</small>
        </section>
      ))}
      <h3>경험과 기술</h3>
      {techStack.map((s) => (
        <section key={s.group}>
          <h4>{s.group}</h4>
          <p>{s.desc}</p>
        </section>
      ))}
      <h3>학력과 수상</h3>
      <p>
        {profile.education.school} · {profile.education.major} ·{" "}
        {profile.education.gpa}
      </p>
      {profile.facts.map((f) => (
        <p key={f.label}>
          {f.label} · {f.value}
        </p>
      ))}
      {profile.awards.map((a) => (
        <p key={a.slug}>
          {a.project} · {a.title}
        </p>
      ))}
      <h3>개발 과정</h3>
      <p>{aiWorkflow.intro}</p>
      {aiWorkflow.steps.map((step) => (
        <section key={step.name}>
          <h4>{step.title}</h4>
          <p>{step.body}</p>
        </section>
      ))}
    </div>
  );
}
