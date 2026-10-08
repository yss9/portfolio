"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectScreenshot } from "@/content/types";

export function ProjectGallery({
  name,
  screens,
  phone = false,
  diagram = false,
}: {
  name: string;
  screens: ProjectScreenshot[];
  phone?: boolean;
  diagram?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const screen = screens[selected];
  const companion =
    screens.length > 1 ? screens[(selected + 1) % screens.length] : undefined;
  if (!screen) return null;

  return (
    <section
      id="screens"
      className="project-gallery"
      aria-label={`${name} ${diagram ? "배포 구조" : "서비스 화면"}`}
    >
      <div className="gallery-heading">
        <span>
          {name} <span aria-hidden="true">/</span>{" "}
          {diagram ? "SYSTEM OVERVIEW" : "SERVICE SCREENS"}
        </span>
        <span>
          {String(selected + 1).padStart(2, "0")} /{" "}
          {String(screens.length).padStart(2, "0")}
        </span>
      </div>
      <div className="gallery-stage" data-phone={phone} data-diagram={diagram}>
        <div className="gallery-frame">
          {!phone && !diagram && (
            <div className="gallery-browser-bar" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}
          <div className="gallery-image">
            <Image
              key={screen.src}
              src={screen.src}
              alt={screen.alt}
              fill
              sizes={
                phone
                  ? "(min-width: 768px) 280px, 44vw"
                  : "(min-width: 1280px) 1100px, 90vw"
              }
              loading="eager"
              className="object-contain"
            />
          </div>
        </div>
        {phone && companion && (
          <div className="gallery-frame gallery-companion">
            <div className="gallery-image">
              <Image
                src={companion.src}
                alt={companion.alt}
                fill
                sizes="(min-width: 768px) 250px, 38vw"
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
      <div className="gallery-caption" aria-live="polite">
        <p>{screen.caption}</p>
        <a
          href={screen.src}
          target="_blank"
          rel="noreferrer noopener"
          className="text-link"
        >
          원본 크게 보기 ↗
        </a>
      </div>
      {screens.length > 1 && (
        <div
          className="gallery-selector"
          role="group"
          aria-label="프로젝트 화면 선택"
        >
          {screens.map((item, index) => (
            <button
              key={item.src}
              type="button"
              aria-label={`${index + 1}. ${item.caption.split(" — ")[0]}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className="gallery-thumbnail"
            >
              <span className="gallery-thumbnail-image">
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain"
                />
              </span>
              <span className="gallery-thumbnail-label">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.caption.split(" — ")[0]}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
