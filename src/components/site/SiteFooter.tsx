import Link from "next/link";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-ink">
              <span className="font-mono">YOUNGSEOK SEO</span>
              <span className="ml-2 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 font-mono text-[9px] font-semibold text-emerald-700">ONLINE</span>
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
            Engineered with traceable decisions &amp; measurable improvements.
          </p>
        </div>
      </div>
    </footer>
  );
}
