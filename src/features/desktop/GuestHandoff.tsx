"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { BrandArt } from "./BrandArt";
import { keepLockInHistory, readSetting, saveSetting } from "./settings";

type Snapshot = { slug: string; source: DOMRect };
type Flight = { brands: Snapshot[]; hold: boolean };
const GuestContext = createContext<() => void>(() => {});
export const useGuestEntry = () => useContext(GuestContext);
const featured = ["saeroi", "potner", "neoulteo"];
function rectFrame(rect: DOMRect) {
  return {
    left: rect.left + "px",
    top: rect.top + "px",
    width: rect.width + "px",
    height: rect.height + "px",
  };
}

export function GuestHandoff({ children }: { children: ReactNode }) {
  const router = useRouter(),
    pathname = usePathname();
  const [flight, setFlight] = useState<Flight | null>(null);
  const busy = useRef(false);
  const focusOnArrival = useRef(false);
  const layer = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const resume = useRef<() => void>(() => {});
  const finish = useCallback(() => {
    setFlight(null);
    busy.current = false;
  }, []);
  const enter = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    focusOnArrival.current = true;
    const brands = featured.flatMap((slug) => {
      const element = document.querySelector<HTMLElement>(
        `[data-orbit-brand="${slug}"]`,
      );
      if (!element) return [];
      const source = element.getBoundingClientRect();
      return source.width && source.height ? [{ slug, source }] : [];
    });
    const quiet =
      readSetting("reduce") === "1" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    keepLockInHistory();
    saveSetting("desktop", "1", true);
    if (!quiet && brands.length) {
      setFlight({
        brands,
        hold:
          process.env.NODE_ENV === "development" &&
          new URLSearchParams(location.search).get("scene") === "handoff",
      });
    }
    router.push("/desktop/", { scroll: false });
  }, [router]);
  useEffect(() => {
    if (!flight) return;
    const abort = () => {
      focusOnArrival.current = false;
      finish();
    };
    window.addEventListener("popstate", abort);
    window.addEventListener("pagehide", abort);
    const timeout = flight.hold ? undefined : window.setTimeout(finish, 2200);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("popstate", abort);
      window.removeEventListener("pagehide", abort);
    };
  }, [flight, finish]);
  useLayoutEffect(() => {
    if (flight || !pathname.startsWith("/desktop") || !focusOnArrival.current)
      return;
    focusOnArrival.current = false;
    busy.current = false;
    document
      .getElementById("launcher-project:saeroi")
      ?.focus({ preventScroll: true });
  }, [flight, pathname]);
  useLayoutEffect(() => {
    if (!flight || !pathname.startsWith("/desktop")) return;
    const overlay = layer.current;
    if (!overlay) return;
    let disposed = false,
      generation = 0;
    const play = (hold: boolean) => {
      const version = ++generation;
      // Read both ends before cancelling an in-flight animation on resize.
      const pairs = flight.brands.flatMap(({ slug }) => {
        const copy = overlay.querySelector<HTMLElement>(
          `[data-flight-brand="${slug}"]`,
        );
        const dest = document.querySelector<HTMLElement>(
          `[data-desktop-brand="${slug}"]`,
        );
        // Measure the icon in its final position before the overlay fades out.
        dest
          ?.closest(".launcher")
          ?.getAnimations()
          .find(
            (animation) =>
              animation instanceof CSSAnimation &&
              animation.animationName === "desktop-appear",
          )
          ?.finish();
        return copy && dest
          ? [
              {
                copy,
                from: copy.getBoundingClientRect(),
                to: dest.getBoundingClientRect(),
              },
            ]
          : [];
      });
      animations.current.forEach((a) => a.cancel());
      const timing: KeyframeAnimationOptions = {
        duration: 600,
        easing: "cubic-bezier(.25,.72,.2,1)",
        fill: "both",
      };
      animations.current = pairs.flatMap(({ copy, from, to }) => [
        copy.animate([rectFrame(from), rectFrame(to)], timing),
        copy.firstElementChild!.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          timing,
        ),
        copy.lastElementChild!.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          timing,
        ),
      ]);
      if (hold)
        animations.current.forEach((a) => {
          a.pause();
          a.currentTime = 300;
        });
      resume.current = () => animations.current.forEach((a) => a.play());
      Promise.all(animations.current.map((a) => a.finished))
        .then(() => {
          if (!disposed && version === generation) finish();
        })
        .catch(() => {});
    };
    play(flight.hold);
    const resize = () => play(false);
    window.addEventListener("resize", resize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      animations.current.forEach((a) => a.cancel());
      animations.current = [];
    };
  }, [pathname, flight, finish]);
  return (
    <GuestContext.Provider value={enter}>
      <div
        className="sys-pages"
        inert={!!flight}
        data-arriving={flight ? "" : undefined}
      >
        {children}
      </div>
      {flight && (
        <div
          ref={layer}
          className="sys-flight"
          data-landed={pathname.startsWith("/desktop")}
        >
          {flight.brands.map(({ slug, source }) => (
            <div
              key={slug}
              aria-hidden="true"
              data-flight-brand={slug}
              style={rectFrame(source)}
            >
              <span>
                <BrandArt slug={slug} variant="exhibit" />
              </span>
              <span>
                <BrandArt slug={slug} variant="icon" />
              </span>
            </div>
          ))}
          {flight.hold && (
            <button onClick={() => resume.current()}>전환 계속</button>
          )}
        </div>
      )}
    </GuestContext.Provider>
  );
}
