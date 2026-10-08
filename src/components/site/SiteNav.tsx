"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const sections = [
  { href: "/#about", label: "소개", number: "01" },
  { href: "/#ai-assisted", label: "AI 활용", number: "02" },
  { href: "/#projects", label: "프로젝트", number: "03" },
  { href: "/#contact", label: "연락", number: "04" },
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
      <nav
        className="site-container flex h-20 items-center justify-between gap-6"
        aria-label="주 메뉴"
      >
        <Link href="/" className="brand" aria-label="서영석 포트폴리오 홈">
          <span className="brand-mark" aria-hidden="true">
            ys<span>.</span>
          </span>
          <span className="brand-name">
            서영석<span>Backend Developer</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="nav-link">
              <span>{section.number}</span>
              {section.label}
            </Link>
          ))}
          <a
            href="/seo-youngseok-portfolio.pdf"
            download
            className="button button-small button-outline"
          >
            포트폴리오 PDF <span aria-hidden="true">↓</span>
          </a>
        </div>
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpenPath(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          className="menu-toggle md:hidden"
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
          className="mobile-nav md:hidden"
        >
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              onClick={() => setOpenPath(null)}
              className="nav-link"
            >
              <span>{section.number}</span>
              {section.label}
              <span aria-hidden="true" className="ml-auto">
                ↗
              </span>
            </Link>
          ))}
          <a
            href="/seo-youngseok-portfolio.pdf"
            download
            className="button button-outline mt-4"
            onClick={() => setOpenPath(null)}
          >
            포트폴리오 PDF ↓
          </a>
        </nav>
      )}
    </header>
  );
}
