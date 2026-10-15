import Image from "next/image";
import type { ProjectScreenshot } from "@/content/types";

function Screen({
  screen,
  index,
  lead = false,
  phone = false,
  diagram = false,
}: {
  screen: ProjectScreenshot;
  index: number;
  lead?: boolean;
  phone?: boolean;
  diagram?: boolean;
}) {
  const [title, detail] = screen.caption.split(" — ");
  const contain = diagram || screen.fit === "contain";
  return (
    <figure className={lead ? "screen-figure is-lead" : "screen-figure"}>
      <a
        href={screen.src}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${title} 원본 이미지 새 창으로 보기`}
      >
        <div className="screen-image">
          {diagram ? (
            <Image
              src={screen.src}
              alt={screen.alt}
              width={1600}
              height={900}
              sizes="(min-width: 1280px) 1200px, 95vw"
              className="h-auto w-full"
            />
          ) : (
            <Image
              src={screen.src}
              alt={screen.alt}
              fill
              loading={index < 2 ? "eager" : "lazy"}
              sizes={
                phone
                  ? "(min-width: 768px) 280px, 46vw"
                  : lead
                    ? "(min-width: 1280px) 1200px, 95vw"
                    : "(min-width: 1024px) 400px, 90vw"
              }
              className={
                contain ? "object-contain" : "object-cover object-top"
              }
            />
          )}
        </div>
      </a>
      <figcaption>
        <strong>
          {String(index + 1).padStart(2, "0")} · {title}
        </strong>
        {detail}
      </figcaption>
    </figure>
  );
}

/** Every screen is rendered up front as its own figure; no client state. */
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
  if (screens.length === 0) return null;
  const [lead, ...rest] = screens;

  return (
    <section
      id="screens"
      className="screens"
      aria-label={`${name} ${diagram ? "배포 구조" : "서비스 화면"}`}
    >
      <div className="site-container">
        <div className="screens-head">
          <span>{diagram ? "배포 구조" : "실제 서비스 화면"}</span>
          <span>이미지를 누르면 원본을 볼 수 있습니다</span>
        </div>
        {phone ? (
          <div className="screens-grid is-phone">
            {screens.map((screen, index) => (
              <Screen key={screen.src} screen={screen} index={index} phone />
            ))}
          </div>
        ) : (
          <div className={diagram ? "screens-grid is-diagram" : "screens-grid"}>
            <Screen screen={lead} index={0} lead diagram={diagram} />
            {rest.length > 0 && (
              <div className="screens-rest">
                {rest.map((screen, index) => (
                  <Screen key={screen.src} screen={screen} index={index + 1} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
