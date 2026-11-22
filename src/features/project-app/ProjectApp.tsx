"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ChartNoAxesColumn,
  Code2,
  Copy,
  Maximize2,
  Monitor,
  Wrench,
  X,
} from "lucide-react";
import { clips } from "@/content/clips";
import { featureMedia } from "@/lib/content/feature-media";
import { evidence } from "@/content/evidence";
import { getProject } from "@/content/projects";
import type { Project } from "@/content/types";
import { desktopHref, parseTab, tabs, type ProjectTab } from "@/lib/content/apps";
import { ProjectNote } from "./ProjectNote";
import "./project-note.css";
import { Reader, SourceCode } from "./Reader";
import { Brand } from "../desktop/Identity";

function DemoView({
  project,
  active,
  index,
  setIndex,
}: {
  project: Project;
  active: boolean;
  index: number;
  setIndex: (v: number) => void;
}) {
  const media = [
    ...(clips[project.slug] ?? []).map((c) => ({
      image: c.poster,
      video: c.src,
      title: c.title,
      caption: c.caption,
    })),
    ...(project.screenshots?.length
      ? project.screenshots
      : [{ ...project.preview, caption: project.preview.alt }]
    ).map((s) => ({
      image: s.src,
      video: "",
      title: s.caption.split(" — ")[0],
      caption: s.alt,
    })),
  ];
  const [failed, setFailed] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  const item = media[index];
  useEffect(() => {
    const pause = () => {
      if (!active || document.hidden) video.current?.pause();
    };
    pause();
    document.addEventListener("visibilitychange", pause);
    return () => document.removeEventListener("visibilitychange", pause);
  }, [active]);
  return (
    <div className="media-view">
      <div className="media-main">
        <div className="media-stage">
          {item.video && failed !== item.video ? (
            <video
              key={item.video}
              ref={video}
              controls
              playsInline
              preload="none"
              poster={item.image}
              src={item.video}
              aria-label={item.title}
              onError={() => setFailed(item.video)}
            />
          ) : (
            <Dialog.Root>
              <Dialog.Trigger
                className="image-opener"
                aria-label={item.title + " 확대"}
              >
                <Image
                  src={item.image}
                  alt={item.caption}
                  loading={active ? "eager" : "lazy"}
                  width={1200}
                  height={680}
                />
                <Maximize2 />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="scrim" />
                <Dialog.Content className="media-modal">
                  <Dialog.Title>{item.title}</Dialog.Title>
                  <Dialog.Description>{item.caption}</Dialog.Description>
                  <Image
                    src={item.image}
                    alt={item.caption}
                    width={1600}
                    height={900}
                  />
                  <Dialog.Close aria-label="확대 닫기">
                    <X />
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          )}
        </div>
        <h3>{item.title}</h3>
        <p>{item.caption}</p>
        {item.video && (
          <small>
            {failed === item.video
              ? "영상을 불러오지 못해 대표 화면을 표시합니다."
              : "실제 프론트엔드에 시연용 데이터를 넣어 녹화한 영상입니다."}
          </small>
        )}
      </div>
      <aside className="media-library" aria-label="시연 자료">
        <h3>
          시연 자료{" "}
          <small>
            {index + 1} / {media.length}
          </small>
        </h3>
        <div className="thumbnails">
          {media.map((m, i) => (
            <button
              key={m.image}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <Image src={m.image} alt="" width={150} height={84} />
              <span>
                <small>{m.video ? "영상" : "화면"}</small>
                {m.title}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
function Features({
  project: p,
  showClip,
}: {
  project: Project;
  showClip: (index: number) => void;
}) {
  const [i, select] = useState(0);
  const feature = p.features[i];
  if (!feature) return <p>{p.focus}</p>;
  const media = featureMedia(p.slug, feature.title);
  return (
    <Reader
      label="구현 기능 목록"
      titles={p.features.map((f) => f.title)}
      selected={i}
      onSelect={select}
    >
      <small>{feature.category ?? "구현 기능"}</small>
      <h3>{feature.title}</h3>
      <p>{feature.desc}</p>
      {media && (
        <figure className="feature-proof">
          <Image
            src={media.poster}
            alt={media.caption}
            width={880}
            height={490}
          />
          <figcaption>
            {media.title} · 시연용 데이터{" "}
            <button
              className="text-action"
              onClick={() => showClip(clips[p.slug].indexOf(media))}
            >
              시연 영상 보기
            </button>
          </figcaption>
        </figure>
      )}
      <h4>담당 범위</h4>
      <p>{p.focus}</p>
      {p.architectureImage && (
        <details>
          <summary>시스템 아키텍처</summary>
          <Image
            src={p.architectureImage.src}
            alt={p.architectureImage.alt}
            width={900}
            height={530}
          />
          <p>{p.architectureIntent}</p>
        </details>
      )}
      <Link href={"/records/" + p.slug + "/"}>전체 기술 기록 읽기</Link>
    </Reader>
  );
}
function Performance({ project: p }: { project: Project }) {
  const [i, select] = useState(0);
  const perf = p.performance[i];
  if (!perf) {
    return (
      <article>
        <h3>성능 개선 기록</h3>
        <p>공개된 성능 측정 기록이 없습니다.</p>
        <Link href={"/records/" + p.slug + "/"}>전체 기술 기록 읽기</Link>
      </article>
    );
  }
  return (
    <Reader label="성능 개선 기록" titles={p.performance.map((item) => item.title)} selected={i} onSelect={select}>
      <small>성능 비교</small>
      <h3>{perf.title}</h3>
      <p>{perf.summary}</p>
      <table className="metric-table">
        <thead>
          <tr>
            <th>측정 항목</th>
            <th>개선 전</th>
            <th>개선 후</th>
          </tr>
        </thead>
        <tbody>
          {perf.metrics.map((m) => (
            <tr key={m.label}>
              <th scope="row">{m.label}</th>
              <td>{m.before}</td>
              <td>{m.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {perf.condition && <p>{perf.condition}</p>}
      {[perf.before, perf.after].map((side) => (
        <section key={side.label}>
          <h4>{side.label}</h4>
          {side.notes?.map((note) => <p key={note}>{note}</p>)}
          {side.code && <SourceCode name={side.code.filename ?? "관련 코드"} code={side.code.code} />}
        </section>
      ))}
    </Reader>
  );
}

function Issues({ project: p }: { project: Project }) {
  const [i, select] = useState(0);
  const items = [...p.troubleshooting, ...(p.designNotes ?? [])];
  const issue = items[i];
  const titles = items.map((item) => item.title);
  if (!issue)
    return (
      <article>
        <h3>트러블슈팅 기록</h3>
        <p>
          이 프로젝트의 설계 결정과 담당 범위는 기술 기록에서 확인할 수
          있습니다.
        </p>
        <Link href={"/records/" + p.slug + "/"}>기술 기록 읽기</Link>
      </article>
    );
  return (
    <Reader label="이슈 목록" titles={titles} selected={i} onSelect={select}>
      <small>{i < p.troubleshooting.length ? "트러블슈팅" : "설계 기록"}</small>
      <h3>{issue.title}</h3>
      <h4>문제</h4>
      <p>{issue.problem}</p>
      {issue.steps.map((s, n) => (
        <section key={n}>
          <h4>
            {s.label} · {s.title}
          </h4>
          <p>{s.body}</p>
        </section>
      ))}
      {issue.solution && (
        <>
          <h4>선택한 해결</h4>
          <p>{issue.solution}</p>
        </>
      )}
      <h4>결과와 회고</h4>
      <p>{issue.takeaway}</p>
      {[
        ...(issue.code ?? []),
        ...(evidence[p.slug]?.cases[issue.id]?.code ?? []),
      ].map((code, n) => (
        <SourceCode
          key={n}
          name={"file" in code ? code.file : (code.filename ?? "관련 코드")}
          code={code.code}
        />
      ))}
      <Link href={"/records/" + p.slug + "/"}>전체 기술 기록 읽기</Link>
    </Reader>
  );
}
const tabInfo = {
  note: { title: "프로젝트 노트", icon: BookOpen },
  demo: { title: "시연 화면", icon: Monitor },
  performance: { title: "성능 개선", icon: ChartNoAxesColumn },
  features: { title: "구현 기능", icon: Code2 },
  troubleshooting: { title: "트러블슈팅", icon: Wrench },
} as const;
export default function ProjectApp({
  slug,
  tab,
  onTab,
  active = true,
  standalone = false,
}: {
  slug: string;
  tab: ProjectTab;
  onTab: (v: ProjectTab) => void;
  active?: boolean;
  standalone?: boolean;
}) {
  const p = getProject(slug)!;
  const Heading = standalone ? "h1" : "h2";
  const root = useRef<HTMLDivElement>(null);
  const scrollByTab = useRef<Partial<Record<ProjectTab, number>>>({});
  useLayoutEffect(() => {
    const scroller =
      root.current?.closest<HTMLElement>(".window-scroll") ??
      document.scrollingElement;
    if (!scroller) return;
    const stored = scrollByTab.current[tab];
    scroller.scrollTop = stored ?? 0;
    const target = scroller === document.scrollingElement ? window : scroller;
    const remember = () => {
      if (root.current?.getClientRects().length)
        scrollByTab.current[tab] = scroller.scrollTop;
    };
    target.addEventListener("scroll", remember, { passive: true });
    return () => target.removeEventListener("scroll", remember);
  }, [tab]);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [sectionVisit, setSectionVisit] = useState({ performance: 0, features: 0 });
  function openSection(section: "demo" | "performance" | "features") {
    scrollByTab.current[section] = 0;
    if (section === "demo") {
      const shot = p.screenshots?.findIndex((item) => item.src === p.preview.src) ?? -1;
      setMediaIndex(shot >= 0 ? (clips[p.slug]?.length ?? 0) + shot : 0);
    } else {
      setSectionVisit((visits) => ({ ...visits, [section]: visits[section] + 1 }));
    }
    onTab(section);
    root.current?.querySelector<HTMLElement>(`[data-project-tab="${section}"]`)?.focus({ preventScroll: true });
  }
  const [copy, setCopy] = useState("");
  async function copyLink() {
    const url = new URL(`/projects/${slug}/?tab=${tab}`, location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setCopy("링크를 복사했습니다.");
    } catch {
      setCopy(url);
    }
  }
  const share = (
    <div className="note-share">
      <button onClick={copyLink} aria-label="이 페이지 링크 복사" title="이 페이지 링크 복사"><Copy size={16} /></button>
      <small role="status">{copy}</small>
    </div>
  );
  return (
    <div className="project-app notebook" ref={root}>
      {tab !== "note" && (
        <header className="note-mast">
          <Heading>{p.name}</Heading>
          {share}
        </header>
      )}
      <Tabs
        value={tab}
        onValueChange={(v) => onTab(parseTab(v))}
        activationMode="manual"
      >
        <TabsList className="project-tabs" aria-label="프로젝트 상세">
          {tabs.map((id) => {
            const { title, icon: Icon } = tabInfo[id];
            return (
              <TabsTrigger value={id} key={id} data-project-tab={id} aria-label={title}>
                <Icon size={16} aria-hidden="true" />
                <span>{id === "note" ? <><span className="tab-prefix">프로젝트 </span>노트</> : title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {tabs.map((id) => (
          <TabsContent
            key={id}
            value={id}
            forceMount
            hidden={id !== tab}
            className="tab-body"
          >
            {id === "note" ? (
              <ProjectNote project={p} standalone={standalone} share={share} openSection={openSection} />
            ) : id === "demo" ? (
              <DemoView
                project={p}
                active={active && tab === id}
                index={mediaIndex}
                setIndex={setMediaIndex}
              />
            ) : id === "features" ? (
              <Features
                key={sectionVisit.features}
                project={p}
                showClip={(index) => {
                  scrollByTab.current.demo = 0;
                  setMediaIndex(index);
                  onTab("demo");
                }}
              />
            ) : id === "performance" ? (
              <Performance key={sectionVisit.performance} project={p} />
            ) : (
              <Issues project={p} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
export function Standalone({ slug }: { slug: string }) {
  const [tab, setTab] = useState<ProjectTab>("note");
  useEffect(() => {
    const sync = () =>
      setTab(parseTab(new URLSearchParams(location.search).get("tab")));
    sync();
    addEventListener("popstate", sync);
    return () => removeEventListener("popstate", sync);
  }, [slug]);
  function change(v: ProjectTab) {
    setTab(v);
    history.replaceState(history.state, "", "?tab=" + v);
  }
  return (
    <div className="standalone">
      <header className="os-bar">
        <Brand />
        <span className="bar-spacer" />
        <Link href={desktopHref("project:" + slug, tab)}>
          <Monitor size={16} /> 데스크톱에서 보기
        </Link>
      </header>
      <div className="reading-paper">
        <ProjectApp slug={slug} tab={tab} onTab={change} standalone />
      </div>
    </div>
  );
}
