"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DemoScreen } from "@/content/types";
import { DemoShell, DemoCanvas, Inspector } from "@/components/demo/DemoShell";
import { cx } from "@/components/ui/primitives";
import {
  courses,
  coursePosts,
  lessonChat,
  roleMenus,
  LANGUAGE_LABEL,
  LEVEL_LABEL,
  type ChatMsg,
  type CourseLevel,
  type Language,
} from "@/mocks/saybridge";

const PATHS: Record<string, string> = {
  courses: "/courselist",
  course: "/course/1",
  video: "/video/A7F2C9",
  homework: "/posting/1",
  mypage: "/mypage",
};

export function SayBridgeDemo({ screens }: { screens: DemoScreen[] }) {
  const [active, setActive] = useState(screens[0]?.id ?? "courses");
  return (
    <DemoShell
      appName="SayBridge"
      host="saybridge.app"
      screens={screens}
      paths={PATHS}
      active={active}
      onChange={setActive}
    >
      {active === "courses" && <CourseSearch />}
      {active === "course" && <CourseDetail />}
      {active === "video" && <VideoLesson />}
      {active === "homework" && <HomeworkBoard />}
      {active === "mypage" && <RoleGate />}
    </DemoShell>
  );
}

/* ================================================================== */
/* 1. 동적 강의 검색 — QueryDSL BooleanBuilder를 실시간으로 보여준다     */
/* ================================================================== */

function CourseSearch() {
  const [lang, setLang] = useState<Language | "ALL">("ALL");
  const [level, setLevel] = useState<CourseLevel | "ALL">("ALL");
  const [q, setQ] = useState("");
  const [openOnly, setOpenOnly] = useState(false);

  const results = useMemo(() => {
    return courses.filter((c) => {
      if (lang !== "ALL" && c.language !== lang) return false;
      if (level !== "ALL" && c.level !== level) return false;
      if (openOnly && c.currentStudents >= c.maxStudents) return false;
      if (q.trim()) {
        const needle = q.trim().toLowerCase();
        if (
          !c.title.toLowerCase().includes(needle) &&
          !c.description.toLowerCase().includes(needle)
        )
          return false;
      }
      return true;
    });
  }, [lang, level, q, openOnly]);

  // The generated predicate — only conditions the user actually set appear.
  const predicate = useMemo(() => {
    const lines: string[] = [];
    if (lang !== "ALL") lines.push(`.and(course.language.eq(Language.${lang}))`);
    if (level !== "ALL") lines.push(`.and(course.level.eq(CourseLevel.${level}))`);
    if (q.trim()) lines.push(`.and(course.title.containsIgnoreCase("${q.trim()}"))`);
    if (openOnly) lines.push(`.and(course.currentStudents.lt(course.maxStudents))`);
    return lines;
  }, [lang, level, q, openOnly]);

  return (
    <DemoCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          {/* filters */}
          <div className="rounded-lg border border-line bg-surface p-3.5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="강의 제목 검색 (예: 회화, 발음)"
              className="w-full rounded-md border border-line bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-faint focus:border-[var(--accent)] focus:outline-none"
            />
            <div className="mt-3 space-y-2.5">
              <FilterRow label="언어">
                <Pill active={lang === "ALL"} onClick={() => setLang("ALL")}>
                  전체
                </Pill>
                {(Object.keys(LANGUAGE_LABEL) as Language[]).map((l) => (
                  <Pill key={l} active={lang === l} onClick={() => setLang(l)}>
                    {LANGUAGE_LABEL[l]}
                  </Pill>
                ))}
              </FilterRow>
              <FilterRow label="레벨">
                <Pill active={level === "ALL"} onClick={() => setLevel("ALL")}>
                  전체
                </Pill>
                {(Object.keys(LEVEL_LABEL) as CourseLevel[]).map((l) => (
                  <Pill key={l} active={level === l} onClick={() => setLevel(l)}>
                    {LEVEL_LABEL[l]}
                  </Pill>
                ))}
              </FilterRow>
              <FilterRow label="정원">
                <Pill active={openOnly} onClick={() => setOpenOnly((v) => !v)}>
                  모집 중만 보기
                </Pill>
              </FilterRow>
            </div>
          </div>

          <p className="mt-3.5 font-mono text-[11px] text-faint">
            {results.length}건 / 전체 {courses.length}건
          </p>

          <ul className="mt-2 grid gap-2.5 sm:grid-cols-2">
            {results.map((c) => {
              const full = c.currentStudents >= c.maxStudents;
              return (
                <li
                  key={c.id}
                  className="rounded-lg border border-line bg-surface p-3.5 transition-colors hover:border-line-strong"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="rounded border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] px-1.5 py-[1px] font-mono text-[10px] text-[var(--accent)]">
                      {LANGUAGE_LABEL[c.language]}
                    </span>
                    <span className="rounded border border-line px-1.5 py-[1px] font-mono text-[10px] text-muted">
                      {LEVEL_LABEL[c.level]}
                    </span>
                  </div>
                  <h5 className="mt-2 text-[13.5px] font-medium leading-snug text-ink">
                    {c.title}
                  </h5>
                  <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted">
                    {c.description}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2.5">
                    <span className="text-[11.5px] text-muted">
                      {c.teacher.name} · ★ {c.teacher.rating}
                    </span>
                    <span
                      className={cx(
                        "tnum font-mono text-[11px]",
                        full ? "text-warn" : "text-gain"
                      )}
                    >
                      {c.currentStudents}/{c.maxStudents}
                    </span>
                  </div>
                </li>
              );
            })}
            {results.length === 0 && (
              <li className="col-span-full rounded-lg border border-dashed border-line py-10 text-center text-[13px] text-faint">
                조건에 맞는 강의가 없습니다
              </li>
            )}
          </ul>
        </div>

        <Inspector title="Generated Predicate · QueryDSL">
          <pre className="scroll-thin overflow-x-auto font-mono text-[11.5px] leading-[1.7] text-ink-dim">
            <code>
              {`BooleanBuilder b = new BooleanBuilder();\n`}
              {predicate.length === 0 ? (
                <span className="text-faint">
                  {`// 조건 없음 — 전체 조회\n`}
                </span>
              ) : (
                predicate.map((line) => (
                  <span key={line} className="text-[var(--accent)]">
                    {`b${line}\n`}
                  </span>
                ))
              )}
              {`\nqueryFactory.selectFrom(course)\n  .where(b)\n  .fetch();`}
            </code>
          </pre>
          <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
            선택하지 않은 조건은 where 절에 아예 붙지 않습니다. 조건 조합마다
            메서드를 만들지 않고 하나의 쿼리로 처리했습니다.
          </p>
        </Inspector>
      </div>
    </DemoCanvas>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-9 shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint">
        {label}
      </span>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-md border px-2.5 py-1 text-[11.5px] transition-colors",
        active
          ? "border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)]"
          : "border-line bg-bg text-muted hover:border-line-strong hover:text-ink-dim"
      )}
    >
      {children}
    </button>
  );
}

/* ================================================================== */
/* 2. 강의 상세 · 수강 신청                                             */
/* ================================================================== */

type EnrollState = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

function CourseDetail() {
  const course = courses[0];
  const [state, setState] = useState<EnrollState>("NONE");
  const [log, setLog] = useState<string[]>([]);

  const push = (line: string) => setLog((l) => [...l.slice(-4), line]);

  const apply = () => {
    setState("PENDING");
    push("POST /api/courses/1/applications → 201 CourseApplication{status: PENDING}");
  };
  const teacherAct = (approved: boolean) => {
    setState(approved ? "APPROVED" : "REJECTED");
    push(
      approved
        ? "PATCH /api/applications/551 {status: APPROVED} → CourseEnrollment 생성, currentStudents +1"
        : "PATCH /api/applications/551 {status: REJECTED} → 정원 변동 없음"
    );
  };

  const seats = course.currentStudents + (state === "APPROVED" ? 1 : 0);
  const ratio = Math.min(100, (seats / course.maxStudents) * 100);

  return (
    <DemoCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center gap-1.5">
            <span className="rounded border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] px-1.5 py-[1px] font-mono text-[10px] text-[var(--accent)]">
              {LANGUAGE_LABEL[course.language]}
            </span>
            <span className="rounded border border-line px-1.5 py-[1px] font-mono text-[10px] text-muted">
              {LEVEL_LABEL[course.level]}
            </span>
          </div>
          <h4 className="mt-2.5 text-lg font-semibold tracking-tight text-ink">
            {course.title}
          </h4>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            {course.description}
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-lg border border-line bg-bg p-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-surface-3 font-mono text-[12px] text-ink-dim">
              {course.teacher.name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-ink">{course.teacher.name}</p>
              <p className="text-[11.5px] text-faint">
                {course.teacher.country} · ★ {course.teacher.rating} (리뷰{" "}
                {course.teacher.reviews})
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted">정원</span>
              <span className="tnum font-mono text-ink-dim">
                {seats} / {course.maxStudents}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                style={{ width: `${ratio}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
            {state === "NONE" && (
              <button
                type="button"
                onClick={apply}
                className="rounded-md bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-black transition-opacity hover:opacity-90"
              >
                수강 신청
              </button>
            )}
            {state === "PENDING" && (
              <>
                <span className="rounded-md border border-line bg-surface-2 px-3 py-2 text-[12.5px] text-ink-dim">
                  신청 완료 · 선생님 승인 대기 중
                </span>
                <button
                  type="button"
                  onClick={() => teacherAct(true)}
                  className="rounded-md border border-line px-3 py-2 text-[12px] text-muted hover:text-ink"
                >
                  (선생님) 승인
                </button>
                <button
                  type="button"
                  onClick={() => teacherAct(false)}
                  className="rounded-md border border-line px-3 py-2 text-[12px] text-muted hover:text-ink"
                >
                  (선생님) 거절
                </button>
              </>
            )}
            {state === "APPROVED" && (
              <span className="rounded-md border border-[color-mix(in_srgb,var(--color-gain)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-gain)_10%,transparent)] px-3 py-2 text-[12.5px] font-medium text-gain">
                수강 확정 · 화상 수업 입장 가능
              </span>
            )}
            {state === "REJECTED" && (
              <span className="rounded-md border border-[color-mix(in_srgb,var(--color-warn)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-warn)_10%,transparent)] px-3 py-2 text-[12.5px] font-medium text-warn">
                신청이 거절되었습니다
              </span>
            )}
            {state !== "NONE" && (
              <button
                type="button"
                onClick={() => {
                  setState("NONE");
                  setLog([]);
                }}
                className="ml-auto font-mono text-[11px] text-faint hover:text-ink-dim"
              >
                초기화
              </button>
            )}
          </div>
        </div>

        <Inspector title="Request Log">
          {log.length === 0 ? (
            <p className="text-[11.5px] text-faint">
              수강 신청을 눌러 상태 전이를 확인해보세요.
            </p>
          ) : (
            <ul className="space-y-2">
              {log.map((l, i) => (
                <li
                  key={i}
                  className="rise break-all font-mono text-[11px] leading-relaxed text-ink-dim"
                >
                  {l}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 border-t border-line pt-2.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-faint">
              State
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {(["NONE", "PENDING", "APPROVED", "REJECTED"] as EnrollState[]).map((s) => (
                <span
                  key={s}
                  className={cx(
                    "rounded border px-1.5 py-[2px] font-mono text-[10px]",
                    s === state
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-line text-faint"
                  )}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Inspector>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 3. 화상 수업 — 시그널링 순서를 바꾸면 검은 화면이 재현된다            */
/* ================================================================== */

type SignalStep = { t: string; detail: string; bad?: boolean; ok?: boolean };

const FIXED_STEPS: SignalStep[] = [
  { t: "await getUserMedia()", detail: "video/audio 스트림 확보 완료" },
  { t: "pc.addTrack(video)", detail: "sender 등록 · m-line 예약" },
  { t: "pc.addTrack(audio)", detail: "sender 등록 · m-line 예약" },
  { t: "stomp.connect()", detail: "/topic/video.signal 구독" },
  { t: "on 'join'", detail: "signalingState === 'stable' 확인" },
  { t: "await pc.createOffer()", detail: "m-line 2개 · direction=sendrecv", ok: true },
  { t: "setLocalDescription(offer)", detail: "publish → /app/video.signal" },
  { t: "on 'answer'", detail: "setRemoteDescription 완료" },
  { t: "pc.ontrack fired", detail: "원격 MediaStream 수신 · 영상 표시", ok: true },
];

const BUGGY_STEPS: SignalStep[] = [
  { t: "getUserMedia()", detail: "Promise 반환 — 완료를 기다리지 않음", bad: true },
  { t: "stomp.connect()", detail: "/topic/video.signal 구독" },
  { t: "on 'join'", detail: "signalingState === 'stable'" },
  { t: "pc.createOffer()", detail: "아직 등록된 track이 없음", bad: true },
  { t: "SDP 생성 결과", detail: "m-line 누락 · direction=inactive", bad: true },
  { t: "setLocalDescription(offer)", detail: "publish → /app/video.signal" },
  { t: "on 'answer'", detail: "교환은 정상 완료 (로그상 문제 없음)" },
  { t: "addTrack() 뒤늦게 실행", detail: "이미 협상이 끝난 뒤 등록됨", bad: true },
  { t: "pc.ontrack 미발생", detail: "원격 스트림 없음 → 검은 화면", bad: true },
];

function VideoLesson() {
  const [mode, setMode] = useState<"fixed" | "buggy">("buggy");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>(lessonChat);
  const [draft, setDraft] = useState("");
  const steps = mode === "fixed" ? FIXED_STEPS : BUGGY_STEPS;
  const done = step >= steps.length;
  const connected = done && mode === "fixed";
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing || step >= steps.length) return;
    const id = setTimeout(() => {
      const next = step + 1;
      setStep(next);
      if (next >= steps.length) setPlaying(false);
    }, 620);
    return () => clearTimeout(id);
  }, [playing, step, steps.length]);

  const reset = (next: "fixed" | "buggy") => {
    setMode(next);
    setStep(0);
    setPlaying(false);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMsgs((m) => [
      ...m,
      { id: Date.now(), from: "me", name: "나", text: draft.trim(), at: "19:0" + ((m.length % 9) + 2) },
    ]);
    setDraft("");
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    });
  };

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          실행 순서
        </span>
        <Pill active={mode === "buggy"} onClick={() => reset("buggy")}>
          수정 전 — addTrack 이전에 createOffer
        </Pill>
        <Pill active={mode === "fixed"} onClick={() => reset("fixed")}>
          수정 후 — await 이후 createOffer
        </Pill>
        <button
          type="button"
          onClick={() => {
            if (done) setStep(0);
            setPlaying(true);
          }}
          disabled={playing}
          className="ml-auto rounded-md bg-[var(--accent)] px-3 py-1.5 text-[12px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {playing ? "실행 중…" : done ? "다시 실행" : "시그널링 실행"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <VideoTile label="나 (local)" live />
            <VideoTile
              label="Emma (remote)"
              live={connected}
              failed={done && mode === "buggy"}
            />
          </div>

          <Inspector
            title="Signaling Sequence"
            tone={done ? (mode === "fixed" ? "gain" : "warn") : "default"}
          >
            <ol className="space-y-1.5">
              {steps.map((s, i) => {
                const reached = i < step;
                return (
                  <li
                    key={s.t + i}
                    className={cx(
                      "flex gap-2.5 font-mono text-[11px] leading-relaxed transition-opacity",
                      reached ? "opacity-100" : "opacity-25"
                    )}
                  >
                    <span className="w-4 shrink-0 text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cx(
                        "shrink-0",
                        reached && s.bad
                          ? "text-warn"
                          : reached && s.ok
                            ? "text-gain"
                            : "text-ink-dim"
                      )}
                    >
                      {s.t}
                    </span>
                    <span className="min-w-0 text-faint">— {s.detail}</span>
                  </li>
                );
              })}
            </ol>
            {done && (
              <p
                className={cx(
                  "rise mt-3 border-t pt-2.5 text-[11.5px] leading-relaxed",
                  mode === "fixed"
                    ? "border-[color-mix(in_srgb,var(--color-gain)_25%,transparent)] text-gain"
                    : "border-[color-mix(in_srgb,var(--color-warn)_25%,transparent)] text-warn"
                )}
              >
                {mode === "fixed"
                  ? "미디어 트랙 등록이 끝난 뒤 Offer를 만들었기 때문에 SDP에 m-line이 포함되고 ontrack이 발생합니다."
                  : "Offer/Answer 교환은 성공했지만 SDP에 보낼 미디어가 없었습니다. 시그널링 로그만으로는 원인을 알 수 없던 이유입니다."}
              </p>
            )}
          </Inspector>
        </div>

        {/* STOMP chat */}
        <div className="flex min-h-[320px] flex-col rounded-lg border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="text-[12px] font-medium text-ink-dim">수업 채팅</span>
            <span className="font-mono text-[10px] text-faint">/topic/chat.A7F2C9</span>
          </div>
          <div
            ref={listRef}
            className="scroll-thin flex-1 space-y-2.5 overflow-y-auto p-3"
          >
            {msgs.map((m) => (
              <div
                key={m.id}
                className={cx("flex flex-col gap-0.5", m.from === "me" && "items-end")}
              >
                <span className="font-mono text-[10px] text-faint">
                  {m.name} · {m.at}
                </span>
                <span
                  className={cx(
                    "max-w-[85%] rounded-lg px-2.5 py-1.5 text-[12.5px] leading-relaxed",
                    m.from === "me"
                      ? "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-ink"
                      : "bg-surface-2 text-ink-dim"
                  )}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-line p-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="메시지 입력"
              className="min-w-0 flex-1 rounded-md border border-line bg-bg px-2.5 py-1.5 text-[12.5px] text-ink placeholder:text-faint focus:border-[var(--accent)] focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md border border-line bg-surface-2 px-3 text-[12px] text-ink-dim hover:text-ink"
            >
              전송
            </button>
          </form>
        </div>
      </div>
    </DemoCanvas>
  );
}

function VideoTile({
  label,
  live,
  failed,
}: {
  label: string;
  live?: boolean;
  failed?: boolean;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-line bg-[#0a0a0d]">
      {live ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b2a44] via-[#132033] to-[#0d1420]">
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-[20px]">
              {label.startsWith("나") ? "🙂" : "👩"}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-black">
          {failed && (
            <span className="rounded-md border border-[color-mix(in_srgb,var(--color-warn)_35%,transparent)] bg-black/60 px-2.5 py-1 font-mono text-[10.5px] text-warn">
              no media · 검은 화면
            </span>
          )}
        </div>
      )}
      <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-[2px] font-mono text-[10px] text-white/80">
        {label}
      </span>
      {live && (
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-[2px] font-mono text-[9.5px] text-gain">
          <span className="pulse-dot h-1 w-1 rounded-full bg-gain" />
          live
        </span>
      )}
    </div>
  );
}

/* ================================================================== */
/* 4. 과제 제출 현황 — N+1 vs IN 배치 조회                              */
/* ================================================================== */

function HomeworkBoard() {
  const [batched, setBatched] = useState(false);

  const queries = batched
    ? [
        {
          sql: "SELECT postId, attachmentUrl FROM Homework WHERE studentId = 42 AND postId IN (101,102,103,104,105,106)",
          ms: 3.99,
        },
      ]
    : [
        { sql: "SELECT * FROM CoursePost WHERE courseId = 1", ms: 2.1 },
        ...coursePosts.map((p) => ({
          sql: `SELECT * FROM Homework WHERE postId = ${p.id} AND studentId = 42`,
          ms: 2.4,
        })),
      ];

  const total = queries.reduce((a, q) => a + q.ms, 0);

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          조회 방식
        </span>
        <Pill active={!batched} onClick={() => setBatched(false)}>
          Before · 게시글마다 단건 조회
        </Pill>
        <Pill active={batched} onClick={() => setBatched(true)}>
          After · IN 조건 배치 조회
        </Pill>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <ul className="min-w-0 space-y-2">
          {coursePosts.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3.5 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-ink">{p.title}</p>
                <p className="mt-0.5 font-mono text-[11px] text-faint">
                  등록 {p.createdAt} · 마감 {p.dueAt}
                </p>
              </div>
              {p.submission ? (
                <span className="shrink-0 rounded-md border border-[color-mix(in_srgb,var(--color-gain)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-gain)_10%,transparent)] px-2 py-1 font-mono text-[10.5px] text-gain">
                  제출 {p.submission.submittedAt}
                </span>
              ) : (
                <span className="shrink-0 rounded-md border border-line px-2 py-1 font-mono text-[10.5px] text-faint">
                  미제출
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <Inspector title="Query Log" tone={batched ? "gain" : "warn"}>
            <div className="scroll-thin max-h-52 space-y-1.5 overflow-y-auto">
              {queries.map((q, i) => (
                <div key={i} className="flex gap-2 font-mono text-[10.5px] leading-relaxed">
                  <span className="w-4 shrink-0 text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 break-all text-ink-dim">{q.sql}</span>
                </div>
              ))}
            </div>
          </Inspector>

          <div className="grid grid-cols-2 gap-2.5">
            <MiniStat
              label="쿼리 수"
              value={String(queries.length)}
              tone={batched ? "gain" : "warn"}
            />
            <MiniStat
              label="누적 시간"
              value={`${total.toFixed(1)}ms`}
              tone={batched ? "gain" : "warn"}
            />
          </div>

          <p className="text-[11.5px] leading-relaxed text-faint">
            데모는 게시글 6건 기준입니다. 실제 측정은 게시글 100건 · JMeter 30
            threads × 20 loops 조건에서 진행했고, 요청당 쿼리가 100건에서 1건으로
            줄었습니다.
          </p>
        </div>
      </div>
    </DemoCanvas>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "gain" | "warn";
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-faint">{label}</p>
      <p
        className={cx(
          "tnum mt-1 font-mono text-xl font-semibold",
          tone === "gain" ? "text-gain" : "text-warn"
        )}
      >
        {value}
      </p>
    </div>
  );
}

/* ================================================================== */
/* 5. 역할별 접근 제어                                                  */
/* ================================================================== */

function RoleGate() {
  const [role, setRole] = useState<"USER" | "TEACHER" | "ADMIN">("USER");

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          로그인 역할
        </span>
        {(["USER", "TEACHER", "ADMIN"] as const).map((r) => (
          <Pill key={r} active={role === r} onClick={() => setRole(r)}>
            {r}
          </Pill>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <ul className="min-w-0 space-y-2">
          {roleMenus.map((m) => {
            const allowed = (m.roles as readonly string[]).includes(role);
            return (
              <li
                key={m.key}
                className={cx(
                  "flex items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors",
                  allowed
                    ? "border-line bg-surface"
                    : "border-line/50 bg-surface/40"
                )}
              >
                <span
                  className={cx(
                    "grid h-6 w-6 shrink-0 place-items-center rounded font-mono text-[11px]",
                    allowed
                      ? "bg-[color-mix(in_srgb,var(--color-gain)_15%,transparent)] text-gain"
                      : "bg-surface-2 text-faint"
                  )}
                >
                  {allowed ? "✓" : "✕"}
                </span>
                <span
                  className={cx(
                    "flex-1 text-[13px]",
                    allowed ? "text-ink" : "text-faint line-through decoration-faint/40"
                  )}
                >
                  {m.label}
                </span>
                <span className="shrink-0 font-mono text-[10.5px] text-faint">
                  {m.rule}
                </span>
              </li>
            );
          })}
        </ul>

        <Inspector title="SecurityFilterChain">
          <pre className="scroll-thin overflow-x-auto font-mono text-[11px] leading-[1.7] text-ink-dim">
            <code>{`http.authorizeHttpRequests(auth -> auth
  .requestMatchers("/api/courses/**")
      .hasRole("TEACHER")
  .requestMatchers("/api/homework/submit")
      .hasRole("USER")
  .requestMatchers("/api/admin/**")
      .hasRole("ADMIN")
  .anyRequest().authenticated()
);`}</code>
          </pre>
          <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
            JWT에 담긴 Role을 SecurityContext에 올려두고, 컨트롤러가 아니라 필터
            체인에서 접근을 판단합니다. 화면 메뉴도 같은 기준으로 그립니다.
          </p>
        </Inspector>
      </div>
    </DemoCanvas>
  );
}
