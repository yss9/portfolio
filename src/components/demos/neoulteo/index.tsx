"use client";

import { useEffect, useMemo, useState } from "react";
import type { DemoScreen } from "@/content/types";
import { DemoShell, DemoCanvas, Inspector } from "@/components/demo/DemoShell";
import { cx } from "@/components/ui/primitives";
import {
  CONTENT_TYPES,
  REGIONS,
  SHARE_CODE,
  aiScenarios,
  attractions,
  batchDiff,
  batchSteps,
  hotplaces,
  initialPlan,
  planEvaluation,
  posts,
  sharedPlanPreview,
  type BoardType,
  type PlanDay,
} from "@/mocks/neoulteo";

const PATHS: Record<string, string> = {
  home: "/",
  attractions: "/attractions",
  plans: "/plans",
  hotplaces: "/hotplaces",
  community: "/community",
  ai: "/plans?assistant=1",
  batch: "/admin/batch",
};

export function NeoulteoDemo({ screens }: { screens: DemoScreen[] }) {
  const [active, setActive] = useState(screens[0]?.id ?? "home");
  const [region, setRegion] = useState("SEOUL");

  return (
    <DemoShell
      appName="Neoulteo"
      host="neoulteo.app"
      screens={screens}
      paths={PATHS}
      active={active}
      onChange={setActive}
    >
      {active === "home" && (
        <HomeMap
          region={region}
          onPick={(c) => {
            setRegion(c);
            setActive("attractions");
          }}
        />
      )}
      {active === "attractions" && <AttractionSearch region={region} onRegion={setRegion} />}
      {active === "plans" && <TravelPlan />}
      {active === "hotplaces" && <Hotplaces />}
      {active === "community" && <Community />}
      {active === "ai" && <AiAssistant />}
      {active === "batch" && <BatchRun />}
    </DemoShell>
  );
}

/* ================================================================== */
/* 1. 지도 홈                                                          */
/* ================================================================== */

function HomeMap({
  region,
  onPick,
}: {
  region: string;
  onPick: (code: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const shown = REGIONS.find((r) => r.code === (hover ?? region)) ?? REGIONS[0];
  const max = Math.max(...REGIONS.map((r) => r.attractions));

  return (
    <DemoCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="relative rounded-lg border border-line bg-surface p-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            지역 선택
          </p>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[380px]">
            {REGIONS.map((r) => {
              const intensity = r.attractions / max;
              const isActive = r.code === region;
              return (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => onPick(r.code)}
                  onMouseEnter={() => setHover(r.code)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(r.code)}
                  onBlur={() => setHover(null)}
                  style={{
                    left: `${r.x}%`,
                    top: `${r.y}%`,
                    background: isActive
                      ? "var(--accent)"
                      : `color-mix(in srgb, var(--accent) ${8 + intensity * 34}%, transparent)`,
                    borderColor: isActive
                      ? "var(--accent)"
                      : `color-mix(in srgb, var(--accent) ${20 + intensity * 40}%, transparent)`,
                  }}
                  className={cx(
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border px-2 py-1 text-[11px] font-medium transition-transform hover:scale-110",
                    isActive ? "text-black" : "text-ink"
                  )}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-center font-mono text-[10px] text-faint">
            실제 서비스는 SVG 대한민국 지도를 사용합니다 · 여기서는 지역 배치를
            단순화했습니다
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              {shown.displayName}
            </p>
            <p className="tnum mt-2 font-mono text-3xl font-semibold text-[var(--accent)]">
              {shown.attractions.toLocaleString()}
            </p>
            <p className="mt-1 text-[12px] text-muted">등록된 관광지</p>
            <p className="mt-3 border-t border-line pt-2.5 font-mono text-[11px] text-faint">
              areaCode = {shown.areaCode}
            </p>
          </div>
          <Inspector title="Data Source">
            <p className="text-[11.5px] leading-relaxed text-faint">
              관광지 데이터는 한국관광공사 TourAPI를 Spring Batch로 동기화해
              DB에 적재해 둡니다. 화면에서는 외부 API를 호출하지 않고 DB만
              조회합니다.
            </p>
          </Inspector>
        </div>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 2. 관광지 검색                                                       */
/* ================================================================== */

function AttractionSearch({
  region,
  onRegion,
}: {
  region: string;
  onRegion: (c: string) => void;
}) {
  const [type, setType] = useState<string>("ALL");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const results = useMemo(
    () =>
      attractions.filter((a) => {
        if (type !== "ALL" && a.contentTypeId !== type) return false;
        if (q.trim() && !a.title.includes(q.trim()) && !a.desc.includes(q.trim()))
          return false;
        return true;
      }),
    [type, q]
  );

  const current = results.find((a) => a.contentId === selected) ?? null;
  const regionName =
    REGIONS.find((r) => r.code === region)?.displayName ?? "서울특별시";

  return (
    <DemoCanvas>
      <div className="mb-3.5 grid gap-2 sm:grid-cols-[180px_1fr]">
        <select
          value={region}
          onChange={(e) => onRegion(e.target.value)}
          className="rounded-md border border-line bg-bg px-2.5 py-2 text-[12.5px] text-ink focus:border-[var(--accent)] focus:outline-none"
        >
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code}>
              {r.displayName}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="키워드 검색 (예: 한옥, 전망, 시장)"
          className="rounded-md border border-line bg-bg px-3 py-2 text-[12.5px] text-ink placeholder:text-faint focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <div className="mb-3.5 flex flex-wrap gap-1.5">
        <Pill active={type === "ALL"} onClick={() => setType("ALL")}>
          전체
        </Pill>
        {CONTENT_TYPES.map((t) => (
          <Pill key={t.id} active={type === t.id} onClick={() => setType(t.id)}>
            {t.label}
          </Pill>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <ul className="scroll-thin max-h-[380px] space-y-2 overflow-y-auto pr-1">
          {results.map((a) => (
            <li key={a.contentId}>
              <button
                type="button"
                onClick={() => setSelected(a.contentId)}
                className={cx(
                  "w-full rounded-lg border p-3 text-left transition-colors",
                  selected === a.contentId
                    ? "border-[color-mix(in_srgb,var(--accent)_50%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                    : "border-line bg-surface hover:border-line-strong"
                )}
              >
                <p className="text-[13px] font-medium text-ink">{a.title}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-faint">
                  {CONTENT_TYPES.find((t) => t.id === a.contentTypeId)?.label} ·{" "}
                  {a.sigungu}
                </p>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="rounded-lg border border-dashed border-line py-8 text-center text-[12.5px] text-faint">
              결과 없음
            </li>
          )}
        </ul>

        <div className="space-y-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-[#0e1512]">
            {/* schematic map surface */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #1c2a26 1px, transparent 1px), linear-gradient(to bottom, #1c2a26 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-[2px] font-mono text-[10px] text-faint">
              Kakao Map · {regionName}
            </span>
            {results.map((a) => {
              const on = selected === a.contentId;
              return (
                <button
                  key={a.contentId}
                  type="button"
                  onClick={() => setSelected(a.contentId)}
                  style={{ left: `${a.mx}%`, top: `${a.my}%` }}
                  className="absolute -translate-x-1/2 -translate-y-full"
                  aria-label={a.title}
                >
                  <span
                    className={cx(
                      "block h-3.5 w-3.5 rounded-full border-2 transition-transform",
                      on
                        ? "scale-125 border-white bg-[var(--accent)]"
                        : "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_35%,transparent)]"
                    )}
                  />
                  {on && (
                    <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1.5 py-[2px] text-[10px] text-white">
                      {a.title}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {current ? (
            <div className="rise rounded-lg border border-line bg-surface p-4">
              <div className="flex items-baseline gap-2">
                <h5 className="text-[14px] font-semibold text-ink">{current.title}</h5>
                <span className="font-mono text-[10.5px] text-faint">
                  contentId {current.contentId}
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                {current.desc}
              </p>
              <p className="mt-2 font-mono text-[10.5px] text-faint">{current.addr}</p>
              <div className="mt-3 flex gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  className="rounded-md border border-line px-2.5 py-1.5 text-[11.5px] text-ink-dim hover:border-line-strong"
                >
                  여행 계획에 담기
                </button>
                <button
                  type="button"
                  className="rounded-md border border-line px-2.5 py-1.5 text-[11.5px] text-ink-dim hover:border-line-strong"
                >
                  핫플레이스 등록
                </button>
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-line py-6 text-center text-[12.5px] text-faint">
              목록이나 지도 마커를 선택하면 상세가 표시됩니다
            </p>
          )}
        </div>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 3. 여행 계획                                                        */
/* ================================================================== */

function TravelPlan() {
  const [plan, setPlan] = useState<PlanDay[]>(initialPlan);
  const [code, setCode] = useState("");
  const [imported, setImported] = useState(false);

  const move = (day: number, index: number, dir: -1 | 1) => {
    setPlan((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d;
        const next = [...d.places];
        const j = index + dir;
        if (j < 0 || j >= next.length) return d;
        [next[index], next[j]] = [next[j], next[index]];
        return { ...d, places: next };
      })
    );
  };

  const remove = (day: number, id: number) =>
    setPlan((prev) =>
      prev.map((d) =>
        d.day === day ? { ...d, places: d.places.filter((p) => p.id !== id) } : d
      )
    );

  const importPlan = () => {
    if (code.trim().toUpperCase() !== SHARE_CODE) return;
    setPlan(sharedPlanPreview);
    setImported(true);
  };

  const totalMin = plan.reduce(
    (s, d) => s + d.places.reduce((a, p) => a + p.stayMin, 0),
    0
  );

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`공유 코드 입력 (${SHARE_CODE})`}
          className="w-52 rounded-md border border-line bg-bg px-2.5 py-1.5 font-mono text-[12px] text-ink placeholder:text-faint focus:border-[var(--accent)] focus:outline-none"
        />
        <button
          type="button"
          onClick={importPlan}
          className="rounded-md border border-line bg-surface-2 px-3 py-1.5 text-[12px] text-ink-dim hover:text-ink"
        >
          코스 가져오기
        </button>
        {imported && (
          <span className="rise font-mono text-[11px] text-gain">
            공유 코스를 불러왔습니다
          </span>
        )}
        <button
          type="button"
          onClick={() => {
            setPlan(initialPlan);
            setImported(false);
            setCode("");
          }}
          className="ml-auto font-mono text-[11px] text-faint hover:text-ink-dim"
        >
          초기화
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {plan.map((d) => {
          const dayMin = d.places.reduce((a, p) => a + p.stayMin, 0);
          return (
            <div key={d.day} className="rounded-lg border border-line bg-surface p-3.5">
              <div className="flex items-baseline justify-between border-b border-line pb-2">
                <h5 className="text-[13.5px] font-semibold text-ink">{d.day}일차</h5>
                <span className="tnum font-mono text-[10.5px] text-faint">
                  {Math.floor(dayMin / 60)}h {dayMin % 60}m
                </span>
              </div>
              <ol className="mt-2.5 space-y-2">
                {d.places.map((p, i) => (
                  <li
                    key={p.id}
                    className="group flex items-center gap-2 rounded-md border border-line bg-bg px-2.5 py-2"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] font-mono text-[10px] text-[var(--accent)]">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] text-ink">
                        {p.name}
                      </span>
                      <span className="block font-mono text-[10px] text-faint">
                        {p.type} · {p.stayMin}분
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => move(d.day, i, -1)}
                        disabled={i === 0}
                        className="text-[9px] leading-none text-faint hover:text-ink disabled:opacity-25"
                        aria-label="위로"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => move(d.day, i, 1)}
                        disabled={i === d.places.length - 1}
                        className="text-[9px] leading-none text-faint hover:text-ink disabled:opacity-25"
                        aria-label="아래로"
                      >
                        ▼
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(d.day, p.id)}
                      className="shrink-0 text-[11px] text-faint hover:text-warn"
                      aria-label="삭제"
                    >
                      ✕
                    </button>
                  </li>
                ))}
                {d.places.length === 0 && (
                  <li className="rounded-md border border-dashed border-line py-5 text-center text-[11.5px] text-faint">
                    장소를 담아보세요
                  </li>
                )}
              </ol>
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        <Inspector title="Plan State">
          <p className="font-mono text-[11px] text-ink-dim">
            {plan.length}일 · 장소 {plan.reduce((s, d) => s + d.places.length, 0)}곳 ·
            총 체류 {Math.floor(totalMin / 60)}시간 {totalMin % 60}분
          </p>
          <p className="mt-2 text-[11.5px] leading-relaxed text-faint">
            순서를 바꾸면 일차별 place_order가 갱신됩니다. 공유 여부를 켜면
            공유 코드가 발급되고, 다른 사용자가 그 코드로 코스를 복제해 갈 수
            있습니다.
          </p>
        </Inspector>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 4. 핫플레이스                                                        */
/* ================================================================== */

function Hotplaces() {
  const [mineOnly, setMineOnly] = useState(false);
  const list = mineOnly ? hotplaces.filter((h) => h.mine) : hotplaces;

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <Pill active={!mineOnly} onClick={() => setMineOnly(false)}>
          많이 등록된 순
        </Pill>
        <Pill active={mineOnly} onClick={() => setMineOnly(true)}>
          내 핫플레이스
        </Pill>
      </div>

      <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((h, i) => (
          <li
            key={h.id}
            className="rounded-lg border border-line bg-surface p-4 transition-colors hover:border-line-strong"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-[18px]">
                {h.emoji}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[13.5px] font-medium text-ink">
                  {h.title}
                  {h.mine && (
                    <span className="rounded border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-1 py-[1px] font-mono text-[9px] text-[var(--accent)]">
                      MY
                    </span>
                  )}
                </p>
                <p className="font-mono text-[10.5px] text-faint">{h.region}</p>
              </div>
              {!mineOnly && (
                <span className="ml-auto shrink-0 font-mono text-[11px] text-faint">
                  #{i + 1}
                </span>
              )}
            </div>
            <p className="mt-2.5 text-[12px] leading-relaxed text-muted">{h.note}</p>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
              <span className="tnum font-mono text-[11px] text-[var(--accent)]">
                {h.registered}명 등록
              </span>
              <button
                type="button"
                className="font-mono text-[10.5px] text-faint hover:text-ink-dim"
              >
                커뮤니티 공유
              </button>
            </div>
          </li>
        ))}
      </ul>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 5. 커뮤니티                                                         */
/* ================================================================== */

const BOARDS: (BoardType | "전체")[] = [
  "전체",
  "공지사항",
  "자유게시판",
  "여행 후기",
  "Q&A",
  "여행 계획 공유",
];

function Community() {
  const [board, setBoard] = useState<BoardType | "전체">("전체");
  const list = board === "전체" ? posts : posts.filter((p) => p.boardType === board);

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap gap-1.5">
        {BOARDS.map((b) => (
          <Pill key={b} active={board === b} onClick={() => setBoard(b)}>
            {b}
          </Pill>
        ))}
      </div>

      <ul className="space-y-2">
        {list.map((p) => (
          <li
            key={p.id}
            className={cx(
              "rounded-lg border p-3.5 transition-colors",
              p.planPreview
                ? "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]"
                : "border-line bg-surface hover:border-line-strong"
            )}
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className={cx(
                  "rounded border px-1.5 py-[1px] font-mono text-[10px]",
                  p.adminOnly
                    ? "border-[color-mix(in_srgb,var(--color-warn)_40%,transparent)] text-warn"
                    : "border-line text-faint"
                )}
              >
                {p.boardType}
              </span>
              <span className="text-[13.5px] font-medium text-ink">{p.title}</span>
              <span className="ml-auto font-mono text-[10.5px] text-faint">
                {p.author} · {p.date}
              </span>
            </div>

            {p.planPreview && (
              <div className="mt-2.5 flex flex-wrap items-center gap-2 rounded-md border border-line bg-bg px-3 py-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                  공유 코스
                </span>
                <span className="font-mono text-[11px] text-ink-dim">
                  {p.planPreview.region} · {p.planPreview.days}박 ·{" "}
                  {p.planPreview.places}곳
                </span>
                <button
                  type="button"
                  className="ml-auto rounded border border-line px-2 py-[3px] font-mono text-[10.5px] text-faint hover:text-ink-dim"
                >
                  내 계획으로 가져오기
                </button>
              </div>
            )}

            <div className="mt-2 flex gap-3 font-mono text-[10.5px] text-faint">
              <span>♥ {p.likes}</span>
              <span>💬 {p.comments}</span>
              {p.adminOnly && <span className="text-warn">관리자만 작성 가능</span>}
            </div>
          </li>
        ))}
      </ul>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 6. AI 여행 도우미                                                    */
/* ================================================================== */

function AiAssistant() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const scenario = aiScenarios[idx];
  const done = step >= scenario.trace.length;

  useEffect(() => {
    if (!running || step >= scenario.trace.length) return;
    const t = setTimeout(() => {
      const next = step + 1;
      setStep(next);
      if (next >= scenario.trace.length) setRunning(false);
    }, 700);
    return () => clearTimeout(t);
  }, [running, step, scenario.trace.length]);

  const run = (i: number) => {
    setIdx(i);
    setStep(0);
    setRunning(true);
  };

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap gap-1.5">
        {aiScenarios.map((s, i) => (
          <button
            key={s.q}
            type="button"
            disabled={running}
            onClick={() => run(i)}
            className={cx(
              "rounded-md border px-2.5 py-1.5 text-left text-[11.5px] transition-colors disabled:opacity-40",
              idx === i && step > 0
                ? "border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]"
                : "border-line bg-bg text-muted hover:border-line-strong hover:text-ink-dim"
            )}
          >
            {s.q}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Inspector title="Spring AI Trace" tone={done ? "gain" : "default"}>
          {step === 0 ? (
            <p className="py-10 text-center text-[12px] text-faint">
              질문을 선택하면 호출 흐름이 재생됩니다
            </p>
          ) : (
            <ol className="space-y-2.5">
              {scenario.trace.map((t, i) => (
                <li
                  key={t.label + i}
                  className={cx(
                    "flex gap-2.5 transition-opacity",
                    i < step ? "opacity-100" : "opacity-25"
                  )}
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded bg-surface-3 font-mono text-[10px] text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-medium text-ink">
                      {t.label}
                      {t.tool && (
                        <span className="ml-1.5 rounded border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-1 py-[1px] font-mono text-[9.5px] text-[var(--accent)]">
                          {t.tool}()
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 font-mono text-[10.5px] leading-relaxed text-faint">
                      {t.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Inspector>

        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              답변
            </p>
            {done ? (
              <p className="rise mt-2.5 text-[13px] leading-relaxed text-ink-dim">
                {scenario.answer}
              </p>
            ) : (
              <p className="mt-2.5 text-[12.5px] text-faint">
                {step === 0 ? "대기 중" : "도구 호출 중…"}
              </p>
            )}
          </div>

          {done && idx === 1 && (
            <div className="rise rounded-lg border border-line bg-surface p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                여행 계획 평가
              </p>
              <div className="mt-3 space-y-3">
                {planEvaluation.map((e) => (
                  <div key={e.axis}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-ink-dim">{e.axis}</span>
                      <span className="tnum font-mono text-[11px] text-ink-dim">
                        {e.score}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className={cx(
                          "h-full rounded-full",
                          e.score >= 70 ? "bg-gain" : e.score >= 50 ? "bg-signal" : "bg-warn"
                        )}
                        style={{ width: `${e.score}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-faint">{e.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 7. TourAPI 동기화 배치                                               */
/* ================================================================== */

function BatchRun() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || step >= batchSteps.length) return;
    const t = setTimeout(() => {
      const next = step + 1;
      setStep(next);
      if (next >= batchSteps.length) setRunning(false);
    }, 900);
    return () => clearTimeout(t);
  }, [running, step]);

  const done = step >= batchSteps.length;

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          Job · tourApiSyncJob
        </span>
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setRunning(true);
          }}
          disabled={running}
          className="ml-auto rounded-md bg-[var(--accent)] px-3 py-1.5 text-[12px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {running ? "실행 중…" : done ? "다시 실행" : "배치 실행"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <ol className="space-y-2">
          {batchSteps.map((s, i) => {
            const active = i < step;
            return (
              <li
                key={s.label}
                className={cx(
                  "flex items-center gap-3 rounded-lg border px-3.5 py-3 transition-all",
                  active
                    ? "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-surface"
                    : "border-line bg-surface/40 opacity-40"
                )}
              >
                <span
                  className={cx(
                    "grid h-6 w-6 shrink-0 place-items-center rounded font-mono text-[10px]",
                    active
                      ? "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]"
                      : "bg-surface-2 text-faint"
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[12px] font-medium text-ink">{s.label}</p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
                    {s.detail}
                  </p>
                </div>
                {active && (
                  <span className="rise shrink-0 font-mono text-[10.5px] text-gain">
                    {s.count}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <Inspector title="Diff Preview" tone={done ? "gain" : "default"}>
          {step < 2 ? (
            <p className="py-8 text-center text-[12px] text-faint">
              비교 단계에서 변경분이 표시됩니다
            </p>
          ) : (
            <ul className="space-y-1.5">
              {batchDiff.map((d) => (
                <li key={d.contentId} className="flex items-center gap-2 font-mono text-[10.5px]">
                  <span
                    className={cx(
                      "shrink-0 rounded border px-1 py-[1px]",
                      d.change === "신규"
                        ? "border-[color-mix(in_srgb,var(--color-gain)_40%,transparent)] text-gain"
                        : "border-line text-faint"
                    )}
                  >
                    {d.change}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-ink-dim">{d.title}</span>
                  <span className="shrink-0 text-faint">{d.field}</span>
                </li>
              ))}
            </ul>
          )}
          {done && (
            <p className="rise mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-gain">
              sync-2024-08-18.pdf 생성 완료 · 변경 내역 요약이 첨부되었습니다
            </p>
          )}
        </Inspector>
      </div>
    </DemoCanvas>
  );
}

/* ------------------------------------------------------------------ */

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
