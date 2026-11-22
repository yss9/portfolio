"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Rnd } from "react-rnd";
import { DropdownMenu } from "radix-ui";
import { motion } from "motion/react";
import { ArrowLeft, Copy, Ellipsis, Maximize2, Minus, X } from "lucide-react";
import type { AppDefinition, ProjectTab } from "@/lib/content/apps";
import { findApp } from "@/lib/content/apps";
import { AppIcon } from "../desktop/Identity";
import {
  clampRect,
  initialRect,
  useWindows,
  type Area,
  type WindowState,
} from "./store";
const Project = dynamic(() => import("../project-app/ProjectApp"), {
  loading: () => (
    <p className="project-loading" role="status">
      프로젝트를 여는 중…
    </p>
  ),
});
const Library = dynamic(() => import("../desktop/LibraryApp"));
type Props = {
  w: WindowState;
  area: Area;
  front: boolean;
  order: number;
  mobile: boolean;
  quiet: boolean;
  activate: () => void;
  open: (a: AppDefinition, el: HTMLElement) => void;
  control: (action: "close" | "minimize" | "maximize") => void;
  tab: (tab: ProjectTab) => void;
};
export function WindowFrame({
  w,
  area,
  front,
  order,
  mobile,
  quiet,
  activate,
  open,
  control,
  tab,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const app = findApp(w.id)!;
  const store = useWindows.getState;
  const full = mobile || w.mode === "maximized";
  const rect = full ? { ...area, x: 0, y: 0 } : clampRect(w.rect, area);
  const hidden = w.mode === "minimized" || (mobile && !front);
  function arrange(position: string) {
    if (w.mode === "maximized") store().maximizeWindow(w.id);
    const r = position === "reset" ? initialRect(w.id, area) : { ...rect };
    if (position === "left" || position === "right")
      Object.assign(r, {
        x: position === "left" ? 0 : area.width / 2,
        y: 0,
        width: area.width / 2,
        height: area.height,
      });
    if (position === "center")
      Object.assign(r, {
        x: (area.width - r.width) / 2,
        y: (area.height - r.height) / 2,
      });
    store().updateRect(w.id, clampRect(r, area));
  }
  return (
    <Rnd
      className="window-wrap"
      data-window={w.id}
      style={{ zIndex: order + 1, display: hidden ? "none" : undefined }}
      bounds="parent"
      position={{ x: rect.x, y: rect.y }}
      size={{ width: rect.width, height: rect.height }}
      minWidth={Math.min(area.width, app.minSize[0])}
      minHeight={Math.min(area.height, app.minSize[1])}
      maxWidth={area.width}
      maxHeight={area.height}
      dragHandleClassName="window-titlebar"
      cancel="button,a,input,textarea,summary,[role=menuitem]"
      disableDragging={full}
      enableResizing={!full}
      onDragStart={() => setDragging(true)}
      onDragStop={(_, d) => {
        setDragging(false);
        store().updateRect(w.id, clampRect({ ...rect, x: d.x, y: d.y }, area));
      }}
      onResizeStop={(_, __, el, ___, pos) =>
        store().updateRect(
          w.id,
          clampRect(
            { ...pos, width: el.offsetWidth, height: el.offsetHeight },
            area,
          ),
        )
      }
    >
      <motion.section
        aria-label={app.title}
        inert={hidden}
        className={"app-window " + (front ? "front" : "")}
        onPointerDownCapture={activate}
        onFocusCapture={activate}
        initial={quiet ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: quiet ? 0 : 0.16 }}
      >
        <header
          className="window-titlebar"
          data-movable={!full}
          data-dragging={dragging}
        >
          {!mobile && (
            <div className="window-controls">
              <button
                className="traffic-close"
                aria-label="창 닫기"
                title="창 닫기"
                onClick={() => control("close")}
              >
                <X />
              </button>
              <button
                className="traffic-min"
                aria-label="최소화"
                title="최소화"
                onClick={() => control("minimize")}
              >
                <Minus />
              </button>
              <button
                className="traffic-max"
                aria-label={full ? "원래 크기로" : "최대화"}
                title={full ? "원래 크기로" : "최대화"}
                onClick={() => control("maximize")}
              >
                {full ? <Copy /> : <Maximize2 />}
              </button>
            </div>
          )}
          {mobile && (
            <button
              aria-label="바탕화면으로"
              onClick={() => control("minimize")}
            >
              <ArrowLeft />
            </button>
          )}
          <AppIcon name={app.icon} />
          <h2 id={"title-" + w.id} tabIndex={-1}>
            {app.title}
          </h2>
          <div className="window-tools">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger aria-label="창 메뉴">
                <Ellipsis />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="os-menu" align="end">
                  {!mobile && (
                    <>
                      {[
                        ["center", "가운데 배치"],
                        ["left", "왼쪽 배치"],
                        ["right", "오른쪽 배치"],
                        ["reset", "기본 배치"],
                      ].map(([code, label]) => (
                        <DropdownMenu.Item
                          key={code}
                          onSelect={() => arrange(code)}
                        >
                          {label}
                        </DropdownMenu.Item>
                      ))}
                    </>
                  )}
                  <DropdownMenu.Item onSelect={() => control("minimize")}>
                    최소화
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => control("close")}>
                    닫기
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            {mobile && (
              <button aria-label="창 닫기" onClick={() => control("close")}>
                <X />
              </button>
            )}
          </div>
        </header>
        <div className="window-scroll">
          {app.componentKey === "project" ? (
            <Project
              slug={app.icon}
              tab={w.tab}
              onTab={tab}
              active={front && !hidden}
            />
          ) : (
            <Library id={w.id} open={open} />
          )}
        </div>
      </motion.section>
    </Rnd>
  );
}
