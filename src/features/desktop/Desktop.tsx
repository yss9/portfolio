"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { Dialog, DropdownMenu, Tooltip } from "radix-ui";
import { Command } from "cmdk";
import { MotionConfig, motion } from "motion/react";
import { Monitor, Search, SlidersHorizontal, X } from "lucide-react";
import {
  apps,
  desktopHref,
  findApp,
  parseTab,
  projectApps,
  utilities,
  type AppDefinition,
} from "@/lib/content/apps";
import {
  activeWindow,
  clampRect,
  useWindows,
  type Area,
  type Rect,
} from "../window-manager/store";
import { WindowFrame } from "../window-manager/WindowFrame";
import { AppIcon, SystemMark, Clock, Brand } from "./Identity";
import { ordinaryClick } from "./links";
import { readSetting, resetEntry, saveSetting } from "./settings";

const motionPreference = "(prefers-reduced-motion: reduce)";
function subscribeToMotionPreference(notify: () => void) {
  const media = window.matchMedia(motionPreference);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
function prefersReducedMotion() {
  return window.matchMedia(motionPreference).matches;
}

type Transition = { id: number; start: Rect; end: Rect; duration: number };
function measure(el?: Element | null): Rect | undefined {
  if (!el) return;
  const { x, y, width, height } = el.getBoundingClientRect();
  return { x, y, width, height };
}
function iconRect(el?: HTMLElement | null) {
  return measure(el?.querySelector(".sys-icon-art, .app-icon") ?? el);
}
function syncUrl(push = false) {
  const w = activeWindow(useWindows.getState().windows),
    href = desktopHref(w?.id, w?.tab);
  if (location.pathname + location.search !== href)
    history[push ? "pushState" : "replaceState"](history.state, "", href);
}
function focusSoon(id?: string, fallback?: HTMLElement | null) {
  requestAnimationFrame(() => {
    const el = id ? document.getElementById("title-" + id) : null;
    (
      el ??
      (fallback?.isConnected ? fallback : null) ??
      document.getElementById("all-apps")
    )?.focus({ preventScroll: true });
  });
}
export default function Desktop() {
  const router = useRouter();
  function returnToEntry(replay = false) {
    resetEntry(replay);
    router.push("/");
  }
  const windows = useWindows((s) => s.windows),
    active = activeWindow(windows);
  const node = useRef<HTMLDivElement>(null);
  const activeId = active?.id;
  const dockStrip = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const strip = dockStrip.current;
    if (!strip || !activeId) return;
    const button = document.getElementById("dock-" + activeId);
    if (!button) return;
    const reveal = () => {
      const item = button.getBoundingClientRect();
      const bounds = strip.getBoundingClientRect();
      if (item.right > bounds.right) strip.scrollLeft += item.right - bounds.right;
      else if (item.left < bounds.left) strip.scrollLeft -= bounds.left - item.left;
    };
    reveal();
    const observer = new ResizeObserver(reveal);
    observer.observe(strip);
    return () => observer.disconnect();
  }, [activeId]);
  const [area, setArea] = useState<Area>({ width: 1160, height: 720 });
  const [mobile, setMobile] = useState(false),
    [reduced, setReduced] = useState(false),
    [search, setSearch] = useState(false);
  const osReduce = useSyncExternalStore(subscribeToMotionPreference, prefersReducedMotion, () => true),
    quiet = reduced || osReduce;
  const [transition, setTransition] = useState<Transition | null>(null);
  const pendingFolder = useRef<{ appId: string; origin: DOMRect } | null>(null);
  const searchSelection = useRef<string | null>(null);
  const sequence = useRef(0),
    lastOpener = useRef(new Map<string, HTMLElement>()),
    searchReturn = useRef<HTMLElement | null>(null);
  const currentArea = useCallback(
    () => ({
      width: node.current?.clientWidth ?? 1000,
      height: node.current?.clientHeight ?? 700,
    }),
    [],
  );
  useLayoutEffect(() => {
    const el = node.current!;
    const update = () => {
      setArea(currentArea());
      setMobile(matchMedia("(max-width: 700px)").matches);
    };
    const obs = new ResizeObserver(update);
    obs.observe(el);
    update();
    return () => obs.disconnect();
  }, [currentArea]);
  useEffect(() => {
    saveSetting("desktop", "1", true);
    const frame = requestAnimationFrame(() =>
      setReduced(readSetting("reduce") === "1"),
    );
    const restore = () => {
      const p = new URLSearchParams(location.search),
        app = findApp(p.get("app")),
        s = useWindows.getState();
      if (app) {
        s.openApp(app.id, currentArea(), parseTab(p.get("tab")));
        focusSoon(app.id);
      } else s.showDesktop();
    };
    restore();
    addEventListener("popstate", restore);
    const shortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchSelection.current = null;
        searchReturn.current = document.activeElement as HTMLElement;
        setSearch((v) => !v);
      }
    };
    addEventListener("keydown", shortcut);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("popstate", restore);
      removeEventListener("keydown", shortcut);
    };
  }, [currentArea]);
  useLayoutEffect(() => {
    const pending = pendingFolder.current;
    pendingFolder.current = null;
    if (!pending || quiet) return;
    const panel = node.current?.querySelector<HTMLElement>(
      `[data-window="${CSS.escape(pending.appId)}"] .app-window`,
    );
    if (!panel) return;
    const end = panel.getBoundingClientRect();
    if (!end.width || !end.height) return;
    const from = pending.origin;
    const animation = panel.animate(
      [
        { transform: `translate(${from.left - end.left}px, ${from.top - end.top}px) scale(${from.width / end.width}, ${from.height / end.height})`, transformOrigin: "top left" },
        { transform: "none", transformOrigin: "top left" },
      ],
      { delay: 90, duration: 200, easing: "cubic-bezier(.15,.85,.2,1)", fill: "backwards" },
    );
    return () => animation.cancel();
  }, [windows, quiet]);
  function morph(start?: Rect, end?: Rect, duration = 0.29) {
    const id = ++sequence.current;
    if (quiet || mobile || !start || !end) {
      setTransition(null);
      return;
    }
    setTransition({ id, start, end, duration });
  }
  function frameRect(id: string) {
    const w = useWindows.getState().windows.find((v) => v.id === id),
      base = measure(node.current);
    if (!base || !w) return;
    const rect =
      w.mode === "maximized"
        ? { ...area, x: 0, y: 0 }
        : clampRect(w.rect, area);
    return { ...rect, x: base.x + rect.x, y: base.y + rect.y };
  }
  function open(app: AppDefinition, el?: HTMLElement, spatial = true) {
    const prev = useWindows.getState().windows.find((w) => w.id === app.id);
    if (el && !el.closest(".dock")) lastOpener.current.set(app.id, el);
    const opening = !prev || prev.mode === "minimized";
    const folder = el?.matches(".desktop-shortcut") && el.querySelector<HTMLElement>(".sys-project-icon");
    if (opening && folder && !quiet) {
      pendingFolder.current = { appId: app.id, origin: folder.getBoundingClientRect() };
      folder.animate(
        [{ transform: "none" }, { transform: "translateY(3px) scale(.94)", boxShadow: "0 1px 0 #171718" }],
        { duration: 90, easing: "ease-out" },
      );
    }
    useWindows.getState().openApp(app.id, currentArea());
    if (opening && !folder)
      morph(
        spatial ? iconRect(el) : undefined,
        frameRect(app.id),
        prev ? 0.24 : 0.29,
      );
    syncUrl(!prev);
    setSearch(false);
    focusSoon(app.id);
  }
  function control(id: string, action: "close" | "minimize" | "maximize") {
    const s = useWindows.getState(),
      before = frameRect(id);
    const dock = document.getElementById("dock-" + id),
      launcher =
        lastOpener.current.get(id) ??
        document.getElementById("launcher-" + id) ??
        dock;
    if (action === "maximize") {
      s.maximizeWindow(id);
      morph(before, frameRect(id), 0.24);
    } else {
      (dock ?? document.getElementById("all-apps"))?.focus({
        preventScroll: true,
      });
      if (action === "close") s.closeWindow(id);
      else s.minimizeWindow(id);
      morph(
        before,
        iconRect(action === "minimize" ? dock : launcher),
        action === "close" ? 0.16 : 0.24,
      );
      focusSoon(
        activeWindow(useWindows.getState().windows)?.id,
        action === "close" ? launcher : dock,
      );
    }
    syncUrl();
  }
  function desktop() {
    useWindows.getState().showDesktop();
    setTransition(null);
    syncUrl();
    focusSoon();
  }
  function command(el: HTMLElement) {
    searchSelection.current = null;
    searchReturn.current = el;
    setSearch(true);
  }
  function iconLink(app: AppDefinition, featured = false) {
    return (
      <a
        className="launcher desktop-shortcut"
        aria-current={active?.id === app.id ? "true" : undefined}
        id={"launcher-" + app.id}
        title={app.title + " · " + app.shortRole}
        key={app.id}
        href={app.canonicalHref}
        onClick={(e) => {
          if (ordinaryClick(e)) {
            e.preventDefault();
            open(app, e.currentTarget, e.detail !== 0);
          }
        }}
      >
        <AppIcon name={app.icon} target />
        <strong>{app.title}</strong>
        {featured && <small>{app.shortRole}</small>}
      </a>
    );
  }
  const shellWidth = transition
    ? Math.max(transition.start.width, transition.end.width)
    : 1;
  const shellHeight = transition
    ? Math.max(transition.start.height, transition.end.height)
    : 1;
  const dockApps = [
    ...utilities,
    ...projectApps.filter((app) => windows.some((w) => w.id === app.id)),
  ];
  return (
    <MotionConfig reducedMotion={quiet ? "always" : "never"}>
      <div className="os-shell desktop" data-reduced={!!quiet}>
        <header className="desktop-menubar">
          <span className="menu-identity">
            <Brand />
          </span>
          <span className="active-app-name" title={active ? findApp(active.id)?.title : undefined}>
            {active ? findApp(active.id)?.title : "바탕화면"}
          </span>
          <div className="task-tray">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                className="icon-button"
                aria-label="보기 설정"
              >
                <SlidersHorizontal size={17} />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="os-menu" align="end">
                  <DropdownMenu.Item onSelect={desktop}>
                    바탕화면 보기
                  </DropdownMenu.Item>
                  <DropdownMenu.CheckboxItem
                    checked={reduced}
                    onCheckedChange={(v) => {
                      setReduced(v);
                      saveSetting("reduce", v ? "1" : "0");
                    }}
                  >
                    동작 줄이기 {reduced ? "✓" : ""}
                  </DropdownMenu.CheckboxItem>
                  <DropdownMenu.Item
                    onSelect={() => {
                      for (const a of apps) saveSetting("rect:" + a.id, "");
                      if (!mobile) useWindows.getState().reset(area);
                      syncUrl();
                    }}
                  >
                    창 배치 초기화
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => returnToEntry()}>
                    사용자 전환
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => returnToEntry(true)}>
                    부팅 다시 보기
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <Clock date />
            <button
              className="desktop-peek"
              title="바탕화면 보기"
              aria-label="바탕화면 보기"
              onClick={desktop}
            >
              <Monitor size={15} />
            </button>
          </div>
        </header>
        <div className="work-area" ref={node}>
          <div className="desktop-surface" inert={mobile && !!active}>
            <h1 className="sr-only">서영석의 바탕화면</h1>
            <nav className="desktop-files" aria-label="프로젝트 바로가기">
              {projectApps.map((app, index) => iconLink(app, index < 3))}
            </nav>
          </div>
          {windows.map((w, i) => (
            <WindowFrame
              key={w.id}
              w={w}
              front={w.id === active?.id}
              order={i}
              area={area}
              mobile={mobile}
              open={open}
              activate={() => {
                useWindows.getState().activateWindow(w.id);
                syncUrl();
              }}
              control={(action) => control(w.id, action)}
              tab={(tab) => {
                useWindows.getState().selectTab(w.id, tab);
                syncUrl();
              }}
            />
          ))}
        </div>
        <footer className="dock-zone">
          <nav className="dock" aria-label="작업표시줄">
            <button
              id="all-apps"
              aria-label="전체 앱 검색"
              title="전체 앱 검색"
              onClick={(e) => command(e.currentTarget)}
            >
              <SystemMark />
              <span className="sr-only">시작</span>
            </button>
            <button
              aria-label="앱 검색"
              title="앱 검색 (Ctrl/⌘ K)"
              onClick={(e) => command(e.currentTarget)}
            >
              <Search size={18} />
            </button>
            <i />
            <div className="dock-apps" ref={dockStrip}>
              <Tooltip.Provider delayDuration={280}>
                {dockApps.map((app) => (
                  <Tooltip.Root key={app.id}>
                    <Tooltip.Trigger asChild>
                      <button
                        id={"dock-" + app.id}
                        aria-label={app.title + " 열기"}
                        aria-current={app.id === active?.id}
                        data-open={windows.some((w) => w.id === app.id)}
                        onClick={(e) =>
                          open(app, e.currentTarget, e.detail !== 0)
                        }
                      >
                        <AppIcon name={app.icon} />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="dock-tooltip"
                        side="top"
                        sideOffset={8}
                      >
                        {app.title}
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                ))}
              </Tooltip.Provider>
            </div>
          </nav>
        </footer>
        {transition && !quiet && (
          <motion.div
            aria-hidden="true"
            key={transition.id}
            className="transition-shell"
            style={{
              left: 0,
              top: 0,
              transformOrigin: "top left",
              width: shellWidth,
              height: shellHeight,
            }}
            initial={{
              x: transition.start.x,
              y: transition.start.y,
              scaleX: transition.start.width / shellWidth,
              scaleY: transition.start.height / shellHeight,
              opacity: 0.55,
            }}
            animate={{
              x: transition.end.x,
              y: transition.end.y,
              scaleX: transition.end.width / shellWidth,
              scaleY: transition.end.height / shellHeight,
              opacity: 0,
            }}
            transition={{
              duration: transition.duration,
              ease: [0.2, 0.75, 0.25, 1],
            }}
            onAnimationComplete={() => {
              if (sequence.current === transition.id) setTransition(null);
            }}
          />
        )}
        <Dialog.Root open={search} onOpenChange={setSearch}>
          <Dialog.Portal>
            <Dialog.Overlay className="scrim" />
            <Dialog.Content
              className="command-dialog"
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                if (searchSelection.current) focusSoon(searchSelection.current);
                else searchReturn.current?.focus();
              }}
            >
              <Dialog.Title>앱 검색</Dialog.Title>
              <Dialog.Description className="sr-only">
                이름, 역할 또는 기술로 검색하세요.
              </Dialog.Description>
              <Dialog.Close aria-label="검색 닫기">
                <X />
              </Dialog.Close>
              <Command label="앱 검색">
                <div className="command-input">
                  <Search size={18} />
                  <Command.Input
                    autoFocus
                    placeholder="프로젝트, 기술, 앱 검색"
                  />
                </div>
                <Command.List>
                  <Command.Empty>검색 결과가 없습니다.</Command.Empty>
                  {apps.map((a) => (
                    <Command.Item
                      key={a.id}
                      value={[a.title, a.shortRole, ...a.tech].join(" ")}
                      onSelect={() => {
                        searchSelection.current = a.id;
                        open(a, searchReturn.current ?? undefined, false);
                      }}
                    >
                      <AppIcon name={a.icon} />
                      <span>
                        {a.title}
                        <small>{a.shortRole}</small>
                      </span>
                    </Command.Item>
                  ))}
                </Command.List>
              </Command>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </MotionConfig>
  );
}
