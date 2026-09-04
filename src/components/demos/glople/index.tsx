"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DemoScreen } from "@/content/types";
import { DemoShell, DemoCanvas, Inspector } from "@/components/demo/DemoShell";
import { cx } from "@/components/ui/primitives";
import {
  AXES,
  KEYWORDS,
  bitCount,
  chatbotPresets,
  cosine,
  destinations,
  gloplers,
  maskOf,
  matchingChat,
  mbtiLabel,
  peers,
  type Axis4,
  type Keyword,
} from "@/mocks/glople";

const PATHS: Record<string, string> = {
  "mbti-test": "/mbtiTest",
  recommend: "/recomendation/similarity",
  keyword: "/keyword",
  chatbot: "/chatbot",
  matching: "/chat",
};

export function GlopleDemo({ screens }: { screens: DemoScreen[] }) {
  const [active, setActive] = useState(screens[0]?.id ?? "mbti-test");
  // The MBTI vector is shared between the test and the recommendation screen,
  // the same way the real service persisted it on the user row.
  const [vector, setVector] = useState<Axis4>({ ei: 0.5, sn: 0.4, tf: 0.3, jp: -0.4 });

  return (
    <DemoShell
      appName="Glople"
      host="glople.app"
      screens={screens}
      paths={PATHS}
      active={active}
      onChange={setActive}
    >
      {active === "mbti-test" && <MbtiTest vector={vector} onChange={setVector} />}
      {active === "recommend" && <Recommend vector={vector} />}
      {active === "keyword" && <KeywordFilter />}
      {active === "chatbot" && <Chatbot />}
      {active === "matching" && <Matching />}
    </DemoShell>
  );
}

/* ================================================================== */
/* 1. MBTI 진단 — 16분류 대신 4축 연속값                                */
/* ================================================================== */

function MbtiTest({
  vector,
  onChange,
}: {
  vector: Axis4;
  onChange: (v: Axis4) => void;
}) {
  const label = mbtiLabel(vector);

  return (
    <DemoCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {AXES.map((a) => {
            const value = vector[a.key];
            return (
              <div key={a.key} className="rounded-lg border border-line bg-surface p-4">
                <p className="text-[13px] text-ink-dim">{a.question}</p>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={Math.round(value * 100)}
                  onChange={(e) =>
                    onChange({ ...vector, [a.key]: Number(e.target.value) / 100 })
                  }
                  className="mt-3 w-full accent-[var(--accent)]"
                  aria-label={a.question}
                />
                <div className="mt-1 flex items-center justify-between font-mono text-[11px]">
                  <span
                    className={cx(value < 0 ? "text-[var(--accent)]" : "text-faint")}
                  >
                    {a.low}
                  </span>
                  <span className="tnum text-ink-dim">{value.toFixed(2)}</span>
                  <span
                    className={cx(value >= 0 ? "text-[var(--accent)]" : "text-faint")}
                  >
                    {a.high}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-surface p-5 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              분류 결과
            </p>
            <p className="mt-2 font-mono text-4xl font-semibold tracking-tight text-[var(--accent)]">
              {label}
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-faint">
              같은 {label}라도 축의 세기가 다르면 추천 결과가 달라집니다.
            </p>
          </div>

          <Inspector title="Stored Vector">
            <pre className="font-mono text-[11.5px] leading-[1.8] text-ink-dim">
              <code>{`user.vector = [
  ${vector.ei.toFixed(2)},  // E ← → I
  ${vector.sn.toFixed(2)},  // N ← → S
  ${vector.tf.toFixed(2)},  // F ← → T
  ${vector.jp.toFixed(2)}   // J ← → P
]`}</code>
            </pre>
            <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
              초기 설계는 16가지 중 하나로 분류했지만, 같은 유형 안의 취향 차이를
              담지 못했습니다. 축마다 연속값을 저장하도록 바꾼 뒤 코사인 유사도로
              비교합니다.
            </p>
          </Inspector>
        </div>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 2. 성향 추천 — 후보군 축소 + Top-K                                   */
/* ================================================================== */

const TOP_K = 12;

function Recommend({ vector }: { vector: Axis4 }) {
  const [narrow, setNarrow] = useState(true);
  const me = { gender: "M" as const, birthYear: 1998 };

  const { scored, candidateCount } = useMemo(() => {
    const candidates = narrow
      ? peers.filter(
          (p) => p.gender === me.gender && Math.abs(p.birthYear - me.birthYear) <= 3
        )
      : peers;
    const s = candidates
      .map((p) => ({ ...p, score: cosine(vector, p.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_K);
    return { scored: s, candidateCount: candidates.length };
  }, [narrow, vector, me.gender, me.birthYear]);

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          후보군
        </span>
        <Pill active={!narrow} onClick={() => setNarrow(false)}>
          Before · 전체 사용자 계산 후 전체 정렬
        </Pill>
        <Pill active={narrow} onClick={() => setNarrow(true)}>
          After · 성별·연령 축소 + Top-K
        </Pill>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-2">
          {scored.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3.5 py-3"
            >
              <span className="w-5 shrink-0 font-mono text-[11px] text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
                  {p.nickname}
                  <span className="font-mono text-[10px] text-faint">
                    {mbtiLabel(p.vector)} · {p.gender} · {p.birthYear}
                  </span>
                </p>
                <p className="mt-0.5 truncate text-[12px] text-muted">{p.route}</p>
              </div>
              <div className="w-24 shrink-0">
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${Math.max(2, ((p.score + 1) / 2) * 100)}%` }}
                  />
                </div>
                <p className="tnum mt-1 text-right font-mono text-[10.5px] text-ink-dim">
                  {p.score.toFixed(3)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <Stat label="유사도 계산" value={String(candidateCount)} tone={narrow ? "gain" : "warn"} />
            <Stat
              label="정렬 방식"
              value={narrow ? `힙 ${TOP_K}` : `전체 ${candidateCount}`}
              tone={narrow ? "gain" : "warn"}
            />
          </div>

          <Inspector title={narrow ? "After" : "Before"} tone={narrow ? "gain" : "warn"}>
            <pre className="scroll-thin overflow-x-auto font-mono text-[11px] leading-[1.7] text-ink-dim">
              <code>
                {narrow
                  ? `var candidates =
  findByGenderAndBirthYear(gender, year);
var top = new PriorityQueue<Score>(${TOP_K});
for (var c : candidates) {
  top.offer(cosine(me, c));
  if (top.size() > ${TOP_K}) top.poll();
}`
                  : `findAllUsers()
  .map(this::cosineSimilarity)
  .sorted(Comparator.reverseOrder())
  .limit(${TOP_K});`}
              </code>
            </pre>
            <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
              {narrow
                ? "후보군을 먼저 좁히고 힙 크기를 12로 고정합니다. 실측에서 평균 27.9ms → 7.21ms."
                : "상위 12건만 필요한데 전체를 계산하고 전체를 정렬한 뒤 잘라냅니다."}
            </p>
          </Inspector>
        </div>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 3. 키워드 필터 — 비트마스크                                          */
/* ================================================================== */

function KeywordFilter() {
  const [selected, setSelected] = useState<Keyword[]>(["미식", "야경"]);
  const mask = maskOf(selected);

  const results = useMemo(() => {
    if (mask === 0) return [];
    return destinations
      .map((d) => {
        const dm = maskOf(d.keywords);
        return { ...d, dm, and: dm & mask, score: bitCount(dm & mask) };
      })
      .filter((d) => d.and !== 0)
      .sort((a, b) => b.score - a.score);
  }, [mask]);

  const toggle = (k: Keyword) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  const bin = (n: number) => n.toString(2).padStart(KEYWORDS.length, "0");

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-faint">
          관심 키워드
        </span>
        {KEYWORDS.map((k) => (
          <Pill key={k} active={selected.includes(k)} onClick={() => toggle(k)}>
            {k}
          </Pill>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-2">
          {results.map((d) => (
            <li
              key={d.id}
              className="rounded-lg border border-line bg-surface px-3.5 py-3"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-[13.5px] font-medium text-ink">{d.destName}</span>
                <span className="font-mono text-[10.5px] text-faint">
                  {d.country} · {d.location}
                </span>
                <span className="tnum ml-auto shrink-0 rounded border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-1.5 py-[1px] font-mono text-[10.5px] text-[var(--accent)]">
                  score {d.score}
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{d.info}</p>
              <p className="mt-1.5 font-mono text-[10.5px] text-faint">
                mask {bin(d.dm)} &amp; {bin(mask)} = {bin(d.and)}
              </p>
            </li>
          ))}
          {results.length === 0 && (
            <li className="rounded-lg border border-dashed border-line py-10 text-center text-[13px] text-faint">
              키워드를 선택하면 후보가 나타납니다
            </li>
          )}
        </ul>

        <Inspector title="Bitmask Filtering" tone="gain">
          <div className="space-y-1.5 font-mono text-[11px] text-ink-dim">
            {KEYWORDS.map((k, i) => (
              <div key={k} className="flex items-center gap-2">
                <span className="w-4 text-faint">{i}</span>
                <span
                  className={cx(
                    "w-12",
                    selected.includes(k) ? "text-[var(--accent)]" : "text-faint"
                  )}
                >
                  {k}
                </span>
                <span className={selected.includes(k) ? "text-gain" : "text-faint"}>
                  {selected.includes(k) ? "1" : "0"}
                </span>
              </div>
            ))}
          </div>
          <pre className="mt-3 border-t border-line pt-2.5 font-mono text-[11px] leading-[1.7] text-ink-dim">
            <code>{`mask = 0b${bin(mask)} (${mask})

WHERE (keyword_mask & ${mask}) <> 0
score = bitCount(keyword_mask & ${mask})`}</code>
          </pre>
          <p className="mt-3 text-[11.5px] leading-relaxed text-faint">
            문자열 contains 반복 대신 DB에서 후보를 거르고 비트 개수로 점수를
            매깁니다. 실측에서 평균 15.7ms → 8.92ms.
          </p>
        </Inspector>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 4. AI 챗봇                                                          */
/* ================================================================== */

function Chatbot() {
  const [thread, setThread] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const [shown, setShown] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const ask = (q: string, a: string) => {
    if (typing) return;
    setThread((t) => [...t, { role: "user", text: q }]);
    setTyping(true);
    setShown("");
    let i = 0;
    timer.current = setInterval(() => {
      i += 2;
      setShown(a.slice(0, i));
      if (i >= a.length) {
        if (timer.current) clearInterval(timer.current);
        setTyping(false);
        setThread((t) => [...t, { role: "bot", text: a }]);
        setShown("");
      }
    }, 16);
  };

  return (
    <DemoCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="flex min-h-[360px] flex-col rounded-lg border border-line bg-surface">
          <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[11px]">
              🧭
            </span>
            <span className="text-[12.5px] font-medium text-ink-dim">여행 도우미</span>
            <span className="ml-auto font-mono text-[10px] text-faint">
              gpt-3.5-turbo
            </span>
          </div>

          <div className="scroll-thin flex-1 space-y-3 overflow-y-auto p-4">
            {thread.length === 0 && !typing && (
              <p className="py-12 text-center text-[12.5px] text-faint">
                아래 질문을 눌러보세요
              </p>
            )}
            {thread.map((m, i) => (
              <div
                key={i}
                className={cx("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <p
                  className={cx(
                    "max-w-[85%] rounded-lg px-3 py-2 text-[12.5px] leading-relaxed",
                    m.role === "user"
                      ? "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-ink"
                      : "bg-surface-2 text-ink-dim"
                  )}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <p className="max-w-[85%] rounded-lg bg-surface-2 px-3 py-2 text-[12.5px] leading-relaxed text-ink-dim">
                  {shown}
                  <span className="pulse-dot ml-0.5 inline-block h-3 w-[2px] translate-y-[2px] bg-[var(--accent)]" />
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-line p-2.5">
            {chatbotPresets.map((p) => (
              <button
                key={p.q}
                type="button"
                disabled={typing}
                onClick={() => ask(p.q, p.a)}
                className="rounded-md border border-line bg-bg px-2.5 py-1.5 text-left text-[11.5px] text-muted transition-colors hover:border-line-strong hover:text-ink-dim disabled:opacity-40"
              >
                {p.q}
              </button>
            ))}
          </div>
        </div>

        <Inspector title="Request Flow">
          <pre className="font-mono text-[11px] leading-[1.8] text-ink-dim">
            <code>{`POST /api/chatbot
  ↓
RestTemplate → OpenAI
  model: gpt-3.5-turbo
  system: 여행 상담 프롬프트
  ↓
응답 텍스트를 그대로 렌더링`}</code>
          </pre>
          <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
            데모에서는 API 키 없이 동작하도록 미리 준비된 응답을 타이핑 효과로
            보여줍니다. 실제 서비스는 백엔드에서 OpenAI를 호출했습니다.
          </p>
        </Inspector>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 5. 글로플러 매칭                                                     */
/* ================================================================== */

function Matching() {
  const [picked, setPicked] = useState<number | null>(null);
  const [msgs, setMsgs] = useState(matchingChat);
  const [draft, setDraft] = useState("");
  const glopler = gloplers.find((g) => g.id === picked);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { from: "me", name: "나", text: draft.trim(), at: "14:05" }]);
    setDraft("");
  };

  return (
    <DemoCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-2.5">
          {gloplers.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => setPicked(g.id)}
                className={cx(
                  "w-full rounded-lg border p-4 text-left transition-colors",
                  picked === g.id
                    ? "border-[color-mix(in_srgb,var(--accent)_50%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                    : "border-line bg-surface hover:border-line-strong"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-3 font-mono text-[12px] text-ink-dim">
                    {g.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                      {g.name}
                      <span
                        className={cx(
                          "flex items-center gap-1 font-mono text-[10px]",
                          g.status === "online" ? "text-gain" : "text-faint"
                        )}
                      >
                        <span
                          className={cx(
                            "h-1.5 w-1.5 rounded-full",
                            g.status === "online" ? "bg-gain pulse-dot" : "bg-faint"
                          )}
                        />
                        {g.status}
                      </span>
                    </p>
                    <p className="font-mono text-[11px] text-faint">
                      {g.city}, {g.country} · {g.years}년차 · ★ {g.rating}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {g.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-line px-1.5 py-[2px] font-mono text-[10px] text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-2 font-mono text-[10.5px] text-faint">
                  {g.langs.join(" · ")}
                </p>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex min-h-[320px] flex-col rounded-lg border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="text-[12px] font-medium text-ink-dim">
              {glopler ? `${glopler.name}님과의 채팅` : "매칭 대기"}
            </span>
            <span className="font-mono text-[10px] text-faint">/topic/match</span>
          </div>
          {glopler ? (
            <>
              <div className="scroll-thin flex-1 space-y-2.5 overflow-y-auto p-3">
                {msgs.map((m, i) => (
                  <div
                    key={i}
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
            </>
          ) : (
            <p className="grid flex-1 place-items-center p-6 text-center text-[12.5px] leading-relaxed text-faint">
              왼쪽에서 글로플러를 선택하면
              <br />
              WebSocket 채팅방이 열립니다
            </p>
          )}
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
