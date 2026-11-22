import { create } from "zustand";
import { findApp, type ProjectTab } from "@/lib/content/apps";
import { readSetting, saveSetting } from "../desktop/settings";

export type Rect = { x: number; y: number; width: number; height: number };
export type Area = { width: number; height: number };
export type WindowState = {
  id: string;
  rect: Rect;
  mode: "normal" | "maximized" | "minimized";
  previous: "normal" | "maximized";
  tab: ProjectTab;
  revision: number;
};
export function clampRect(rect: Rect, area: Area): Rect {
  const width = Math.min(area.width, Math.max(360, rect.width));
  const height = Math.min(area.height, Math.max(250, rect.height));
  return {
    width,
    height,
    x: Math.max(0, Math.min(area.width - width, rect.x)),
    y: Math.max(0, Math.min(area.height - height, rect.y)),
  };
}
export function initialRect(id: string, area: Area, offset = 0) {
  const [w, h] = findApp(id)!.initialSize;
  const width = Math.min(w, area.width * 0.9),
    height = Math.min(h, area.height * 0.94);
  return clampRect(
    {
      width,
      height,
      x: (area.width - width) / 2 + offset,
      y: (area.height - height) / 2 + offset,
    },
    area,
  );
}
function savedRect(id: string, area: Area, n: number) {
  try {
    const r = JSON.parse(readSetting("rect:" + id) || "null");
    if (
      r &&
      ["width", "height", "x", "y"].every((k) => Number.isFinite(r[k])) &&
      r.width > 0 &&
      r.height > 0
    )
      return clampRect(r, area);
  } catch {
    /* Invalid or old layout. */
  }
  return initialRect(id, area, (n % 4) * 14);
}
type Store = {
  windows: WindowState[];
  openApp(id: string, area: Area, tab?: ProjectTab): void;
  activateWindow(id: string): void;
  closeWindow(id: string): void;
  minimizeWindow(id: string): void;
  maximizeWindow(id: string): void;
  updateRect(id: string, rect: Rect): void;
  selectTab(id: string, tab: ProjectTab): void;
  showDesktop(): void;
  reset(area: Area): void;
};
export const activeWindow = (windows: WindowState[]) =>
  windows.filter((w) => w.mode !== "minimized").at(-1);
export const useWindows = create<Store>((set) => ({
  windows: [],
  openApp: (id, area, tab) =>
    set((s) => {
      const app = findApp(id);
      if (!app) return s;
      const w = s.windows.find((w) => w.id === id);
      const next: WindowState = w
        ? {
            ...w,
            tab: tab ?? w.tab,
            mode: w.mode === "minimized" ? w.previous : w.mode,
            revision: w.revision + 1,
          }
        : {
            id,
            rect: savedRect(id, area, s.windows.length),
            mode: "normal",
            previous: "normal",
            tab: tab ?? "note",
            revision: 1,
          };
      return { windows: [...s.windows.filter((item) => item.id !== id), next] };
    }),
  activateWindow: (id) =>
    set((s) => {
      const w = s.windows.find((w) => w.id === id);
      if (!w || w.mode === "minimized" || activeWindow(s.windows)?.id === id)
        return s;
      return { windows: [...s.windows.filter((item) => item.id !== id), w] };
    }),
  closeWindow: (id) =>
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
  minimizeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id && w.mode !== "minimized"
          ? {
              ...w,
              previous: w.mode,
              mode: "minimized",
              revision: w.revision + 1,
            }
          : w,
      ),
    })),
  maximizeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              mode: w.mode === "maximized" ? "normal" : "maximized",
              revision: w.revision + 1,
            }
          : w,
      ),
    })),
  updateRect: (id, rect) => {
    saveSetting("rect:" + id, JSON.stringify(rect));
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, rect } : w)),
    }));
  },
  selectTab: (id, tab) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, tab } : w)),
    })),
  showDesktop: () =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.mode === "minimized"
          ? w
          : {
              ...w,
              previous: w.mode,
              mode: "minimized",
              revision: w.revision + 1,
            },
      ),
    })),
  reset: (area) =>
    set((s) => ({
      windows: s.windows.map((w) => ({
        ...w,
        rect: initialRect(w.id, area),
        mode: "normal",
      })),
    })),
}));
