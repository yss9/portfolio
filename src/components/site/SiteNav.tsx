"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { cx } from "@/components/ui/primitives";

const sections = [
  { href: "/#about", label: "About" },
  { href: "/#stack", label: "Tech Stack" },
  { href: "/#ai-assisted", label: "AI Process" },
  { href: "/#projects", label: "Projects" },
  { href: "/#principles", label: "Principles" },
];

export function SiteNav() {
  const pathname = usePathname();
  // The mobile sheet is keyed to the route it was opened on, so navigating
  // closes it without needing an effect to reset the flag.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled
          ? "border-line bg-white/90 shadow-sm backdrop-blur-md"
          : "border-line bg-white"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="홈으로"
        >
          <span className="flex items-center gap-1" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="h-2 w-2 rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[13px] font-bold tracking-tight text-ink">
            YS.DEV
          </span>
          <span className="hidden font-mono text-xs text-faint sm:inline">
            / backend
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
            className="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-signal"
            >
              {s.label}
            </Link>
          ))}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-2 rounded-md border border-line bg-white px-3 py-1.5 font-mono text-xs font-semibold text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
          >
            GitHub ↗
          </a>
          <a
            href="/seo-youngseok-portfolio.pdf"
            download
            className="rounded-md bg-signal px-3 py-1.5 font-mono text-xs font-semibold text-white transition-colors hover:bg-signal-dim"
          >
            Resume ↓
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpenPath(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="ml-auto grid h-9 w-9 place-items-center rounded-md border border-line bg-white text-ink-dim md:hidden"
        >
          <span className="sr-only">메뉴 열기</span>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            {open ? (
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2 4.5h12M2 8h12M2 11.5h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-line bg-white px-5 py-4 shadow-lg md:hidden"
        >
          <div className="grid gap-1">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setOpenPath(null)}
                className="rounded-md px-3 py-2 text-base text-ink-dim hover:bg-surface-2"
              >
                {s.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 border-t border-line pt-3">
            <p className="px-3 pb-1.5 font-mono text-xs uppercase tracking-wider text-faint">
              Projects
            </p>
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                onClick={() => setOpenPath(null)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-base text-ink-dim hover:bg-surface-2"
              >
                <span className="font-mono text-xs text-faint">{p.no}</span>
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
