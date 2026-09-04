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
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
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
          ? "border-line bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-bg"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="홈으로"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md border border-line-strong bg-surface-2 font-mono text-[11px] font-semibold text-signal">
            서
          </span>
          <span className="text-[14px] font-semibold tracking-tight text-ink">
            {profile.name}
          </span>
          <span className="hidden font-mono text-[11px] text-faint sm:inline">
            / Backend
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-md px-3 py-1.5 text-[13px] text-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {s.label}
            </Link>
          ))}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-2 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-[13px] text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
          >
            GitHub ↗
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpenPath(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="ml-auto grid h-9 w-9 place-items-center rounded-md border border-line bg-surface-2 text-ink-dim md:hidden"
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
          className="border-t border-line bg-bg-soft px-5 py-4 md:hidden"
        >
          <div className="grid gap-1">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setOpenPath(null)}
                className="rounded-md px-3 py-2 text-[14px] text-ink-dim hover:bg-surface-2"
              >
                {s.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 border-t border-line pt-3">
            <p className="px-3 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">
              Projects
            </p>
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                onClick={() => setOpenPath(null)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] text-ink-dim hover:bg-surface-2"
              >
                <span className="font-mono text-[11px] text-faint">{p.no}</span>
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
