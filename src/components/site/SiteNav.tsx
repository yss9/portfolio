"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

const sections = [
  { href: "/#about", label: "소개" },
  { href: "/#skills", label: "기술 · AI" },
  { href: "/#projects", label: "프로젝트" },
  { href: "/#contact", label: "연락" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <nav className="site-container nav-inner" aria-label="주 메뉴">
        <Link href="/" className="brand" aria-label="서영석 포트폴리오 홈">
          <span className="brand-mark" aria-hidden="true">
            ys
          </span>
          서영석
          <span className="brand-role">Backend Developer</span>
        </Link>
        <div className="nav-links">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="nav-link">
              {section.label}
            </Link>
          ))}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="button button-small button-primary"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpenPath(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          className="menu-toggle"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d={open ? "M5 5l14 14M19 5L5 19" : "M4 8h16M4 16h16"}
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </nav>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="모바일 메뉴"
          className="mobile-nav"
        >
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              onClick={() => setOpenPath(null)}
              className="nav-link"
            >
              {section.label}
              <span aria-hidden="true" className="ml-auto">
                →
              </span>
            </Link>
          ))}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="button button-primary mt-4"
            onClick={() => setOpenPath(null)}
          >
            GitHub ↗
          </a>
        </nav>
      )}
    </header>
  );
}
