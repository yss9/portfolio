"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";
import BrandOrbit from "./BrandOrbit";
import { BootSequence } from "./BootSequence";
import { Brand, Clock } from "./Identity";
import { useGuestEntry } from "./GuestHandoff";
import { ordinaryClick } from "./links";
import { readSetting, resetEntry, saveSetting } from "./settings";

export default function Entry() {
  const router = useRouter(),
    enter = useGuestEntry();
  const [booting, setBooting] = useState(true),
    [preview, setPreview] = useState<string | null>(null);
  const [quiet, setQuiet] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const reveal = useCallback(() => setRevealing(true), []);
  const guest = useRef<HTMLAnchorElement>(null);
  const finish = useCallback(() => {
    const url = new URL(location.href);
    if (url.searchParams.has("boot")) {
      url.searchParams.delete("boot");
      history.replaceState(history.state, "", url);
    }
    saveSetting("booted", "1", true);
    setBooting(false);
  }, []);
  useLayoutEffect(() => {
    const params = new URLSearchParams(location.search);
    const scene =
      process.env.NODE_ENV === "development" ? params.get("scene") : null;
    const replay = params.get("boot") === "1";
    if (replay) resetEntry(true);
    const reduce =
      readSetting("reduce") === "1" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Resolve preview and session together before the first hydrated frame.
    const frame = requestAnimationFrame(() => {
      setPreview(scene);
      setQuiet(reduce);
      if (scene === "lock" || scene === "handoff") {
        setBooting(false);
        return;
      }
      if (scene === "straight" || scene === "bend" || scene === "ring") return;
      if (!replay && history.state?.sysReturnToLock) {
        setBooting(false);
        return;
      }
      if (readSetting("desktop", true)) {
        router.replace("/desktop/");
        return;
      }
      if (reduce || readSetting("booted", true)) finish();
    });
    return () => cancelAnimationFrame(frame);
  }, [finish, router]);
  useEffect(() => {
    if (!booting) {
      guest.current?.focus({ preventScroll: true });
      router.prefetch("/desktop/");
    }
  }, [booting, router]);
  return (
    <div className="sys-entry">
      {(revealing || !booting) && (
        <section
          inert={booting}
          className="sys-lock"
          aria-label="잠금화면"
        >
          <header className="sys-lockbar">
            <Brand />
            <Clock />
          </header>
          <div className="sys-showcase">
            <BrandOrbit reduced={quiet} />
          </div>
          <div className="sys-access">
            <Link
              ref={guest}
              href="/desktop/"
              className="sys-guest"
              onClick={(e) => {
                if (!ordinaryClick(e)) return;
                e.preventDefault();
                enter();
              }}
            >
              게스트로 입장 <ArrowRight size={20} />
            </Link>
          </div>
          <footer className="sys-lockfoot">
            <span>
              서영석 <i /> Backend Developer
            </span>
            <Link href="/admin/">
              <LockKeyhole size={14} /> 관리자 로그인
            </Link>
          </footer>
        </section>
      )}
      {booting && (
        <BootSequence
          onReveal={reveal}
          onDone={finish}
          previewPhase={
            preview === "ring" || preview === "straight" || preview === "bend"
              ? preview
              : undefined
          }
        />
      )}
    </div>
  );
}
