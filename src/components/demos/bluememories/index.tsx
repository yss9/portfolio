"use client";

import { useMemo, useState } from "react";
import type { DemoScreen } from "@/content/types";
import { DemoShell, DemoCanvas, Inspector } from "@/components/demo/DemoShell";
import { cx } from "@/components/ui/primitives";
import {
  analyseSentiment,
  calendarMonth,
  communityMetrics,
  diaries,
  fallbackRecommendation,
  gptJsonResponse,
  gptLooseResponse,
  sharedBooks,
  writePresets,
  youtubeResults,
  SENTIMENT_COLOR,
  SENTIMENT_LABEL,
  type Sentiment,
} from "@/mocks/bluememories";

const PATHS: Record<string, string> = {
  write: "/write-diary",
  calendar: "/calendar",
  recommend: "/view-diary",
  shared: "/shared-diary",
  community: "/community",
};

export function BlueMemoriesDemo({ screens }: { screens: DemoScreen[] }) {
  const [active, setActive] = useState(screens[0]?.id ?? "write");
  return (
    <DemoShell
      appName="BlueMemories"
      host="bluememories.shop"
      screens={screens}
      paths={PATHS}
      active={active}
      onChange={setActive}
    >
      {active === "write" && <WriteDiary />}
      {active === "calendar" && <EmotionCalendar />}
      {active === "recommend" && <Recommendation />}
      {active === "shared" && <SharedDiary />}
      {active === "community" && <Community />}
    </DemoShell>
  );
}

/* ================================================================== */
/* 1. 일기 작성 → 감정 분석                                             */
/* ================================================================== */

function WriteDiary() {
  const [title, setTitle] = useState(writePresets[0].title);
  const [content, setContent] = useState(writePresets[0].content);
  const [result, setResult] = useState<ReturnType<typeof analyseSentiment> | null>(null);

  const save = () => setResult(analyseSentiment(content));

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-faint">
          예시
        </span>
        {writePresets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setTitle(p.title);
              setContent(p.content);
              setResult(null);
            }}
            className="rounded-md border border-line bg-bg px-2.5 py-1 text-[11.5px] text-muted transition-colors hover:border-line-strong hover:text-ink-dim"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-line bg-surface p-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full border-b border-line bg-transparent pb-2 text-[15px] font-medium text-ink placeholder:text-faint focus:border-[var(--accent)] focus:outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setResult(null);
            }}
            rows={7}
            placeholder="오늘 하루는 어땠나요?"
            className="scroll-thin mt-3 w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-ink-dim placeholder:text-faint focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
            <span className="font-mono text-[11px] text-faint">{content.length}자</span>
            <button
              type="button"
              onClick={save}
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-[12.5px] font-semibold text-black transition-opacity hover:opacity-90"
            >
              저장하고 분석
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {result ? (
            <>
              <div className="rise rounded-lg border border-line bg-surface p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  Clova Sentiment
                </p>
                <p
                  className="mt-2 text-2xl font-semibold tracking-tight"
                  style={{ color: SENTIMENT_COLOR[result.sentiment] }}
                >
                  {SENTIMENT_LABEL[result.sentiment]}
                </p>
                <div className="mt-4 space-y-2.5">
                  {(["positive", "neutral", "negative"] as Sentiment[]).map((k) => (
                    <div key={k}>
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-muted">{SENTIMENT_LABEL[k]}</span>
                        <span className="tnum text-ink-dim">
                          {result.confidence[k].toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${result.confidence[k]}%`,
                            background: SENTIMENT_COLOR[k],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Inspector title="Persisted Row">
                <pre className="scroll-thin overflow-x-auto font-mono text-[11px] leading-[1.7] text-ink-dim">
                  <code>{`diary.sentiment           = "${result.sentiment}"
diary.confidencePositive  = ${result.confidence.positive}
diary.confidenceNeutral   = ${result.confidence.neutral}
diary.confidenceNegative  = ${result.confidence.negative}`}</code>
                </pre>
                <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
                  분석 결과를 Diary 레코드에 함께 저장해두면, 캘린더와 추천에서
                  다시 API를 호출하지 않아도 됩니다.
                </p>
              </Inspector>
            </>
          ) : (
            <div className="grid h-full min-h-[240px] place-items-center rounded-lg border border-dashed border-line p-6 text-center">
              <p className="text-[12.5px] leading-relaxed text-faint">
                저장하면 WebClient로 Clova Sentiment를 호출하고
                <br />
                감정 수치를 함께 기록합니다
              </p>
            </div>
          )}
        </div>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 2. 감정 캘린더                                                       */
/* ================================================================== */

function EmotionCalendar() {
  const { year, month, entries } = calendarMonth;
  const first = new Date(year, month - 1, 1).getDay();
  const days = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(first).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  const counts = useMemo(() => {
    const c = { positive: 0, neutral: 0, negative: 0 };
    Object.values(entries).forEach((s) => (c[s] += 1));
    return c;
  }, [entries]);

  const total = counts.positive + counts.neutral + counts.negative;

  return (
    <DemoCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-lg border border-line bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h5 className="text-[14px] font-semibold text-ink">
              {year}년 {month}월
            </h5>
            <span className="font-mono text-[11px] text-faint">기록 {total}일</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div
                key={d}
                className="pb-1 text-center font-mono text-[10px] uppercase text-faint"
              >
                {d}
              </div>
            ))}
            {cells.map((d, i) => {
              const s = d ? entries[d] : undefined;
              return (
                <div
                  key={i}
                  className={cx(
                    "relative aspect-square rounded-md border text-[11px]",
                    d ? "border-line bg-bg" : "border-transparent"
                  )}
                  style={
                    s
                      ? {
                          background: `color-mix(in srgb, ${SENTIMENT_COLOR[s]} 22%, transparent)`,
                          borderColor: `color-mix(in srgb, ${SENTIMENT_COLOR[s]} 45%, transparent)`,
                        }
                      : undefined
                  }
                  title={s ? SENTIMENT_LABEL[s] : undefined}
                >
                  {d && (
                    <span
                      className={cx(
                        "absolute left-1.5 top-1 font-mono",
                        s ? "text-ink" : "text-faint"
                      )}
                    >
                      {d}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              이번 달 감정 분포
            </p>
            <div className="mt-3 space-y-2.5">
              {(["positive", "neutral", "negative"] as Sentiment[]).map((k) => (
                <div key={k}>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="text-muted">{SENTIMENT_LABEL[k]}</span>
                    <span className="tnum font-mono text-ink-dim">{counts[k]}일</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${total ? (counts[k] / total) * 100 : 0}%`,
                        background: SENTIMENT_COLOR[k],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Inspector title="Query">
            <pre className="scroll-thin overflow-x-auto font-mono text-[11px] leading-[1.7] text-ink-dim">
              <code>{`SELECT date, sentiment
FROM diary
WHERE user_id = :me
  AND date BETWEEN
      '2024-08-01' AND '2024-08-31'`}</code>
            </pre>
            <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
              캘린더는 날짜와 감정만 있으면 그려지므로 본문을 함께 가져오지
              않습니다.
            </p>
          </Inspector>
        </div>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 3. 콘텐츠 추천 — 정규식 파싱 vs JSON 계약                            */
/* ================================================================== */

type ParseMode = "regex" | "json";

function Recommendation() {
  const [mode, setMode] = useState<ParseMode>("json");
  const [ran, setRan] = useState(false);

  // The loose response is what the model actually tends to return. The regex
  // parser depended on a numbered format, so it drops out entirely here.
  const raw = mode === "regex" ? gptLooseResponse : gptJsonResponse;
  const failed = mode === "regex";

  const parsed = failed
    ? fallbackRecommendation
    : {
        songs: [
          { title: "밤편지", artist: "아이유" },
          { title: "잠 못 드는 밤 비는 내리고", artist: "김건모" },
        ],
        searchKeywords: ["잔잔한 새벽 플레이리스트", "마음이 편해지는 영상"],
      };

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          파싱 방식
        </span>
        <Pill
          active={mode === "regex"}
          onClick={() => {
            setMode("regex");
            setRan(false);
          }}
        >
          AS-IS · 정규식 파싱
        </Pill>
        <Pill
          active={mode === "json"}
          onClick={() => {
            setMode("json");
            setRan(false);
          }}
        >
          TO-BE · JSON 계약 + DTO 검증
        </Pill>
        <button
          type="button"
          onClick={() => setRan(true)}
          className="ml-auto rounded-md bg-[var(--accent)] px-3 py-1.5 text-[12px] font-semibold text-black transition-opacity hover:opacity-90"
        >
          추천 요청
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Inspector title="GPT Raw Response" tone={ran && failed ? "warn" : "default"}>
          <pre className="scroll-thin max-h-56 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-[1.7] text-ink-dim">
            <code>{raw}</code>
          </pre>
        </Inspector>

        <Inspector
          title="Server Parsing"
          tone={ran ? (failed ? "warn" : "gain") : "default"}
        >
          {!ran ? (
            <p className="py-8 text-center text-[12px] text-faint">
              추천 요청을 눌러보세요
            </p>
          ) : failed ? (
            <div className="rise space-y-2 font-mono text-[11px] leading-relaxed">
              <p className="text-warn">Pattern.matcher(response).find() → false</p>
              <p className="text-faint">
                번호 형식(&quot;1. 노래 / 3. 검색어&quot;)이 없어 타입·내용 분리 실패
              </p>
              <p className="text-warn">→ 추천 키워드 누락, 저장할 값 없음</p>
              <p className="mt-2 border-t border-line pt-2 text-gain">
                catch → 기본 추천값 반환 (사용자 흐름 유지)
              </p>
            </div>
          ) : (
            <div className="rise space-y-2 font-mono text-[11px] leading-relaxed">
              <p className="text-ink-dim">
                objectMapper.readValue(body, RecommendationResponseDto.class)
              </p>
              <p className="text-gain">✓ songs.size() == 2</p>
              <p className="text-gain">✓ searchKeywords.size() == 2</p>
              <p className="text-gain">✓ 필드 누락 없음 → 저장</p>
            </div>
          )}
        </Inspector>
      </div>

      {ran && (
        <div className="rise mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              추천 음악
            </p>
            <ul className="mt-3 space-y-2">
              {parsed.songs.map((s) => (
                <li key={s.title} className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-surface-2 text-[13px]">
                    ♪
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] text-ink">{s.title}</span>
                    <span className="block text-[11.5px] text-faint">{s.artist}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              YouTube 검색 결과
            </p>
            {failed ? (
              <p className="mt-3 text-[12px] leading-relaxed text-faint">
                기본 검색어(&quot;편안한 음악&quot;)로 대체 조회합니다.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {youtubeResults.map((v) => (
                  <li key={v.id} className="flex items-center gap-2.5">
                    <span className="grid h-8 w-12 shrink-0 place-items-center rounded bg-surface-2 text-[10px] text-faint">
                      ▶
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] text-ink">
                        {v.title}
                      </span>
                      <span className="block font-mono text-[10.5px] text-faint">
                        {v.channel} · {v.duration}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 4. 공유 일기장 (N:M)                                                 */
/* ================================================================== */

function SharedDiary() {
  const [bookId, setBookId] = useState(sharedBooks[0].id);
  const book = sharedBooks.find((b) => b.id === bookId)!;

  return (
    <DemoCanvas>
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <ul className="space-y-2">
          {sharedBooks.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => setBookId(b.id)}
                className={cx(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                  b.id === bookId
                    ? "border-[color-mix(in_srgb,var(--accent)_50%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                    : "border-line bg-surface hover:border-line-strong"
                )}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-[18px]">
                  {b.coverEmoji}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-ink">
                    {b.title}
                  </span>
                  <span className="block font-mono text-[10.5px] text-faint">
                    멤버 {b.members.length}명 · 글 {b.entries.length}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h5 className="text-[15px] font-semibold text-ink">{book.title}</h5>
              <div className="ml-auto flex -space-x-1.5">
                {book.members.map((m) => (
                  <span
                    key={m}
                    title={m}
                    className="grid h-6 w-6 place-items-center rounded-full border border-surface bg-surface-3 font-mono text-[10px] text-ink-dim"
                  >
                    {m.slice(0, 1).toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            <ul className="mt-4 space-y-3">
              {book.entries.map((e, i) => (
                <li key={i} className="border-l-2 border-line pl-3.5">
                  <p className="font-mono text-[10.5px] text-faint">
                    {e.author} · {e.date}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">{e.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <Inspector title="Schema — 1:1 교환일기에서 N:M으로">
            <pre className="scroll-thin overflow-x-auto font-mono text-[11px] leading-[1.7] text-ink-dim">
              <code>{`SharedDiary        (일기장)
  └ SharedDiaryUser  (참여자)  ← N:M 조인 엔티티
  └ SharedDiaryContent (글)
SharedDiaryApplication (참여 신청)`}</code>
            </pre>
            <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
              두 사람만 주고받던 구조에서는 일기장이 사용자 두 명을 직접
              참조했습니다. 참여자를 별도 엔티티로 분리하면서 인원 제한 없이
              확장할 수 있게 됐습니다.
            </p>
          </Inspector>
        </div>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 5. 커뮤니티 목록 — Pagination + JOIN Projection                      */
/* ================================================================== */

const PAGE_SIZE = 4;

function Community() {
  const [optimised, setOptimised] = useState(true);
  const [page, setPage] = useState(0);

  const visible = optimised
    ? diaries.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
    : diaries;
  const m = optimised ? communityMetrics.after : communityMetrics.before;

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          조회 방식
        </span>
        <Pill
          active={!optimised}
          onClick={() => {
            setOptimised(false);
            setPage(0);
          }}
        >
          Before · 전체 조회 + 엔티티 순회
        </Pill>
        <Pill active={optimised} onClick={() => setOptimised(true)}>
          After · Pagination + JOIN Projection
        </Pill>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <ul className="space-y-2">
            {visible.map((d) => (
              <li
                key={d.id}
                className="rounded-lg border border-line bg-surface px-3.5 py-3"
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: SENTIMENT_COLOR[d.sentiment] }}
                    title={SENTIMENT_LABEL[d.sentiment]}
                  />
                  <span className="truncate text-[13.5px] font-medium text-ink">
                    {d.title}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-[10.5px] text-faint">
                    {d.date}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-3 font-mono text-[10.5px] text-faint">
                  <span>{d.author}</span>
                  <span>♥ {d.likeNum}</span>
                  <span>💬 {d.commentNum}</span>
                </div>
                {!optimised && (
                  <p className="mt-2 border-t border-line pt-2 text-[12px] leading-relaxed text-muted">
                    {d.content}
                    <span className="mt-1 block font-mono text-[10px] text-warn">
                      ← 목록에 필요 없는 본문까지 전송됨
                    </span>
                  </p>
                )}
              </li>
            ))}
          </ul>

          {optimised && (
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {Array.from({ length: Math.ceil(diaries.length / PAGE_SIZE) }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  className={cx(
                    "h-7 w-7 rounded-md border font-mono text-[11px] transition-colors",
                    i === page
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-line text-faint hover:text-ink-dim"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <Stat label="쿼리 수" value={String(m.queries)} tone={optimised ? "gain" : "warn"} />
            <Stat label="응답 크기" value={m.payload} tone={optimised ? "gain" : "warn"} />
            <Stat label="평균 응답" value={m.avg} tone={optimised ? "gain" : "warn"} />
            <Stat label="p95" value={m.p95} tone={optimised ? "gain" : "warn"} />
          </div>

          <Inspector title={optimised ? "After" : "Before"} tone={optimised ? "gain" : "warn"}>
            <pre className="scroll-thin overflow-x-auto font-mono text-[11px] leading-[1.7] text-ink-dim">
              <code>
                {optimised
                  ? `SELECT new DiaryListDto(
    d.id, d.title, d.date,
    d.sentiment, d.likeNum, u.nickname)
FROM Diary d JOIN d.user u
WHERE d.isPrivate = false
ORDER BY d.createdAt DESC
-- Pageable: size=${PAGE_SIZE}`
                  : `SELECT * FROM diary
WHERE is_private = false;
-- + 사용자 1,000명에 대한
--   지연 로딩 쿼리 1,000회`}
              </code>
            </pre>
            <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
              측정 조건: 사용자 1,000명 / 일기 2,000건 · JMeter 20 threads × 15 loops
            </p>
          </Inspector>
        </div>
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

function Stat({
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
          "tnum mt-1 font-mono text-lg font-semibold",
          tone === "gain" ? "text-gain" : "text-warn"
        )}
      >
        {value}
      </p>
    </div>
  );
}
