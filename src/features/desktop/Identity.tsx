"use client";
import { BrandArt, brands } from "./BrandArt";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Box,
  Cloud,
  Compass,
  FolderClosed,
  Globe2,
  Layers3,
  Mail,
  Moon,
  Palette,
  Sprout,
  UserRound,
  Video,
} from "lucide-react";
const icons = {
  saeroi: Layers3,
  potner: Sprout,
  neoulteo: Compass,
  saybridge: Video,
  glople: Globe2,
  bluememories: Moon,
  mofy: Palette,
  "aws-deploy": Cloud,
  works: FolderClosed,
  records: BookOpen,
  profile: UserRound,
  contact: Mail,
};
export function AppIcon({
  name,
  target = false,
}: {
  name: string;
  target?: boolean;
}) {
  const Icon = icons[name as keyof typeof icons] ?? Box;
  const brand = brands[name];
  return (
    <span
      aria-hidden="true"
      className={"app-icon icon-" + name + (brand ? " sys-project-icon" : "")}
    >
      {brand ? (
        <span
          className="sys-icon-art"
          data-desktop-brand={target ? name : undefined}
        >
          <BrandArt slug={name} />
        </span>
      ) : (
        <Icon strokeWidth={1.65} />
      )}
    </span>
  );
}
export function SystemMark() {
  return (
    <svg
      className="system-mark"
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      <path fill="var(--sys-mint)" d="M1 21 12 4h5L6 21z" />
      <path fill="var(--sys-amber)" d="M8 26 23 4h5L13 26z" />
      <path fill="var(--sys-coral)" d="M16 28 29 9h3L21 28z" />
    </svg>
  );
}
export function Brand() {
  return (
    <span className="sys-wordmark">
      <SystemMark />
      <b>SYS</b>
      <span>Workspace</span>
    </span>
  );
}
export function Clock({ date = false }: { date?: boolean }) {
  const [now, setNow] = useState<Date>();
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = requestAnimationFrame(tick);
    const timer = setInterval(tick, 10000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(timer);
    };
  }, []);
  return (
    <time className="system-clock" dateTime={now?.toISOString()}>
      <span>
        {now?.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) ?? "––:––"}
      </span>
      {date && (
        <small>
          {now?.toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "long",
          }) ?? " "}
        </small>
      )}
    </time>
  );
}
