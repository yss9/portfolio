import Link from "next/link";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-ink">
              {profile.name} · Backend Developer
            </p>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
              {profile.headline}
            </p>
          </div>

          <nav aria-label="프로젝트">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              Projects
            </p>
            <ul className="mt-3 space-y-1.5">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="text-[13px] text-ink-dim transition-colors hover:text-signal"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              Contact
            </p>
            <ul className="mt-3 space-y-1.5">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-[13px] text-ink-dim transition-colors hover:text-signal"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[13px] text-ink-dim transition-colors hover:text-signal"
                >
                  {profile.githubLabel} ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-faint">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="font-mono text-[11px] text-faint">
            사이트 내 데모는 모두 mock data로 동작합니다 · 실제 서비스 데이터가 아닙니다
          </p>
        </div>
      </div>
    </footer>
  );
}
