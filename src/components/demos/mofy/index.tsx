"use client";

import { useEffect, useMemo, useState } from "react";
import type { DemoScreen } from "@/content/types";
import { DemoShell, DemoCanvas, Inspector } from "@/components/demo/DemoShell";
import { cx } from "@/components/ui/primitives";
import {
  CLOTH_TYPES,
  SKIN_TYPES,
  marketItems,
  pipelineSteps,
  profileDefaults,
  searchCorpus,
  searchSeeds,
  shots,
  stylePosts,
  weatherNow,
} from "@/mocks/mofy";

const PATHS: Record<string, string> = {
  palette: "/colorPalette/new",
  style: "/styleBoard",
  market: "/marketBoard",
  search: "/searchPage",
  profile: "/myPage",
};

export function MofyDemo({ screens }: { screens: DemoScreen[] }) {
  const [active, setActive] = useState(screens[0]?.id ?? "palette");
  return (
    <DemoShell
      appName="MOFY"
      host="mofy.app"
      screens={screens}
      paths={PATHS}
      active={active}
      onChange={setActive}
    >
      {active === "palette" && <PaletteExtract />}
      {active === "style" && <StyleBoard />}
      {active === "market" && <Market />}
      {active === "search" && <SmartSearch />}
      {active === "profile" && <Profile />}
    </DemoShell>
  );
}

/* ================================================================== */
/* 1. 퍼스널 컬러 추출 파이프라인                                        */
/* ================================================================== */

function PaletteExtract() {
  const [shotId, setShotId] = useState(shots[0].id);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const shot = shots.find((s) => s.id === shotId)!;
  const done = step >= pipelineSteps.length;

  useEffect(() => {
    if (!running || step >= pipelineSteps.length) return;
    const t = setTimeout(() => {
      const next = step + 1;
      setStep(next);
      if (next >= pipelineSteps.length) setRunning(false);
    }, 800);
    return () => clearTimeout(t);
  }, [running, step]);

  const pick = (id: string) => {
    setShotId(id);
    setStep(0);
    setRunning(false);
  };

  // Background is stripped from step 2 onward — that's the rembg stage.
  const stripped = step >= 2;

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-faint">
          사진 선택
        </span>
        {shots.map((s) => (
          <Pill key={s.id} active={s.id === shotId} onClick={() => pick(s.id)}>
            {s.label}
          </Pill>
        ))}
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setRunning(true);
          }}
          disabled={running}
          className="ml-auto rounded-md bg-[var(--accent)] px-3 py-1.5 text-[12px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {running ? "분석 중…" : done ? "다시 분석" : "분석 시작"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* mock photo */}
        <div>
          <div
            className="relative aspect-[3/4] overflow-hidden rounded-lg border border-line"
            style={{
              background: stripped
                ? "repeating-conic-gradient(#16161d 0% 25%, #101015 0% 50%) 50% / 16px 16px"
                : shot.bg,
            }}
          >
            <div
              className="absolute inset-x-[22%] bottom-0 top-[14%] rounded-t-[40%] transition-all duration-500"
              style={{ background: shot.subject }}
            />
            <span className="absolute left-2 top-2 rounded bg-black/55 px-1.5 py-[2px] font-mono text-[9.5px] text-white/80">
              {stripped ? "background removed" : "original"}
            </span>
          </div>
          <p className="mt-2 text-center font-mono text-[10px] text-faint">
            데모용 이미지 · 실제로는 업로드 사진을 사용합니다
          </p>
        </div>

        <div className="space-y-3">
          <Inspector title="Pipeline" tone={done ? "gain" : "default"}>
            <ol className="space-y-2">
              {pipelineSteps.map((p, i) => (
                <li
                  key={p.label}
                  className={cx(
                    "flex items-center gap-2.5 transition-opacity",
                    i < step ? "opacity-100" : "opacity-30"
                  )}
                >
                  <span
                    className={cx(
                      "grid h-5 w-5 shrink-0 place-items-center rounded font-mono text-[10px]",
                      i < step
                        ? "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]"
                        : "bg-surface-2 text-faint"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-medium text-ink">
                      {p.label}
                    </span>
                    <span className="block text-[11px] text-faint">{p.detail}</span>
                  </span>
                  <span className="shrink-0 rounded border border-line px-1.5 py-[1px] font-mono text-[9.5px] text-muted">
                    {p.lib}
                  </span>
                </li>
              ))}
            </ol>
          </Inspector>

          {done && (
            <div className="rise rounded-lg border border-line bg-surface p-4">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  추출 팔레트
                </p>
                <span className="rounded border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-1.5 py-[1px] font-mono text-[10px] text-[var(--accent)]">
                  {shot.tone}
                </span>
              </div>

              <div className="mt-3 flex h-12 overflow-hidden rounded-md">
                {shot.palette.map((c) => (
                  <div
                    key={c.hex}
                    style={{ background: c.hex, width: `${c.ratio}%` }}
                    title={`${c.name} ${c.hex}`}
                  />
                ))}
              </div>

              <ul className="mt-3 space-y-1.5">
                {shot.palette.map((c) => (
                  <li key={c.hex} className="flex items-center gap-2.5">
                    <span
                      className="h-4 w-4 shrink-0 rounded border border-line"
                      style={{ background: c.hex }}
                    />
                    <span className="font-mono text-[11px] text-ink-dim">{c.hex}</span>
                    <span className="text-[12px] text-muted">{c.name}</span>
                    <span className="tnum ml-auto font-mono text-[11px] text-faint">
                      {c.ratio}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 2. 스타일 보드                                                       */
/* ================================================================== */

function StyleBoard() {
  const [tag, setTag] = useState<string>("전체");
  const [liked, setLiked] = useState<number[]>([]);

  const tags = useMemo(
    () => ["전체", ...Array.from(new Set(stylePosts.flatMap((p) => p.tags)))],
    []
  );
  const list = tag === "전체" ? stylePosts : stylePosts.filter((p) => p.tags.includes(tag));

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <Pill key={t} active={tag === t} onClick={() => setTag(t)}>
            {t}
          </Pill>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {list.map((p) => {
          const on = liked.includes(p.id);
          return (
            <li
              key={p.id}
              className="overflow-hidden rounded-lg border border-line bg-surface"
            >
              <div style={{ background: p.bg, height: p.height }} />
              <div className="p-3">
                <p className="truncate text-[13px] font-medium text-ink">{p.title}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-faint">@{p.author}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-line px-1.5 py-[1px] font-mono text-[9.5px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-2.5 flex items-center gap-3 border-t border-line pt-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setLiked((l) => (on ? l.filter((x) => x !== p.id) : [...l, p.id]))
                    }
                    className={cx(
                      "font-mono text-[11px] transition-colors",
                      on ? "text-[var(--accent)]" : "text-faint hover:text-ink-dim"
                    )}
                  >
                    {on ? "♥" : "♡"} {p.likes + (on ? 1 : 0)}
                  </button>
                  <span className="font-mono text-[11px] text-faint">💬 {p.comments}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 3. 중고 거래                                                        */
/* ================================================================== */

function Market() {
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(70000);

  const list = marketItems.filter(
    (m) => (!onSaleOnly || m.state) && m.price <= maxPrice
  );

  return (
    <DemoCanvas>
      <div className="mb-3.5 flex flex-wrap items-center gap-3">
        <Pill active={onSaleOnly} onClick={() => setOnSaleOnly((v) => !v)}>
          판매중만 보기
        </Pill>
        <label className="flex items-center gap-2 text-[11.5px] text-muted">
          최대 가격
          <input
            type="range"
            min={15000}
            max={70000}
            step={1000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-36 accent-[var(--accent)]"
          />
          <span className="tnum w-16 font-mono text-[11.5px] text-ink-dim">
            {maxPrice.toLocaleString()}원
          </span>
        </label>
        <span className="ml-auto font-mono text-[11px] text-faint">
          {list.length}건 / 전체 {marketItems.length}건
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_290px]">
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((m) => (
            <li
              key={m.id}
              className="flex gap-3 rounded-lg border border-line bg-surface p-3"
            >
              <div
                className="h-20 w-16 shrink-0 rounded-md"
                style={{ background: m.bg }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-ink">{m.title}</p>
                <p className="tnum mt-1 font-mono text-[14px] font-semibold text-[var(--accent)]">
                  {m.price.toLocaleString()}원
                </p>
                <p className="mt-1 font-mono text-[10.5px] text-faint">
                  {m.address} · {m.size} · @{m.seller}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    className={cx(
                      "rounded border px-1.5 py-[1px] font-mono text-[9.5px]",
                      m.state
                        ? "border-[color-mix(in_srgb,var(--color-gain)_40%,transparent)] text-gain"
                        : "border-line text-faint"
                    )}
                  >
                    {m.state ? "판매중" : "판매완료"}
                  </span>
                  {m.tags.map((t) => (
                    <span key={t} className="font-mono text-[9.5px] text-muted">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <li className="col-span-full rounded-lg border border-dashed border-line py-10 text-center text-[13px] text-faint">
              조건에 맞는 상품이 없습니다
            </li>
          )}
        </ul>

        <Inspector title="Board Schema">
          <pre className="scroll-thin overflow-x-auto font-mono text-[11px] leading-[1.7] text-ink-dim">
            <code>{`class Board(models.Model):
    boardType = SmallIntegerField()
    # 0 자유 · 1 패션 · 2 거래
    title, content, image
    price   = BigIntegerField()
    state   = BooleanField()
    address = TextField(null=True)
    tags    = TextField(null=True)`}</code>
          </pre>
          <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
            자유·패션·거래 글을 한 테이블에 두고 boardType으로 구분했습니다.
            목록·댓글·좋아요 로직을 한 벌만 유지할 수 있는 대신, 거래 전용
            필드는 다른 타입에서 비게 됩니다.
          </p>
        </Inspector>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 4. 검색 · TF-IDF 추천 · 날씨                                         */
/* ================================================================== */

function SmartSearch() {
  const [q, setQ] = useState("니트");
  const suggestions = searchCorpus[q] ?? [];

  return (
    <DemoCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_290px]">
        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-surface p-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색어 입력"
              className="w-full rounded-md border border-line bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-faint focus:border-[var(--accent)] focus:outline-none"
            />
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-faint">
                최근 검색
              </span>
              {searchSeeds.map((s) => (
                <Pill key={s} active={q === s} onClick={() => setQ(s)}>
                  {s}
                </Pill>
              ))}
            </div>
          </div>

          <Inspector
            title="TF-IDF · Cosine Similarity"
            tone={suggestions.length ? "gain" : "default"}
          >
            {suggestions.length === 0 ? (
              <p className="py-6 text-center text-[12px] text-faint">
                위 검색어 중 하나를 선택하면 유사 키워드가 계산됩니다
              </p>
            ) : (
              <ul className="space-y-2.5">
                {suggestions.map((s) => (
                  <li key={s.term} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-[12.5px] text-ink-dim">
                      {s.term}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${s.score * 100}%` }}
                      />
                    </div>
                    <span className="tnum w-10 shrink-0 text-right font-mono text-[11px] text-faint">
                      {s.score.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
              검색 기록을 TF-IDF로 벡터화한 뒤 코사인 유사도가 높은 키워드를
              추천합니다. 데모에서는 미리 계산된 값을 사용합니다.
            </p>
          </Inspector>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              OpenWeatherMap
            </p>
            <div className="mt-2.5 flex items-center gap-3">
              <span className="text-3xl">{weatherNow.icon}</span>
              <div>
                <p className="tnum font-mono text-2xl font-semibold text-ink">
                  {weatherNow.temp}°
                </p>
                <p className="text-[11.5px] text-faint">
                  {weatherNow.city} · {weatherNow.condition} · 체감 {weatherNow.feels}°
                </p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
              {weatherNow.advice.map((a) => (
                <li key={a} className="flex gap-2 text-[12px] leading-relaxed text-muted">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {weatherNow.suggestTags.map((t) => (
                <span
                  key={t}
                  className="rounded border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-1.5 py-[2px] font-mono text-[10px] text-[var(--accent)]"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DemoCanvas>
  );
}

/* ================================================================== */
/* 5. 프로필 · 신체 정보                                                */
/* ================================================================== */

function Profile() {
  const [height, setHeight] = useState(profileDefaults.height);
  const [weight, setWeight] = useState(profileDefaults.weight);
  const [shoe, setShoe] = useState(profileDefaults.shoeType);
  const [cloth, setCloth] = useState<string[]>(profileDefaults.clothType);
  const [skin, setSkin] = useState<string[]>(profileDefaults.skinType);

  const toggle = (
    v: string,
    list: string[],
    set: (n: string[]) => void
  ) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <DemoCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-3 font-mono text-[14px] text-ink-dim">
                {profileDefaults.name.slice(0, 1)}
              </span>
              <div>
                <p className="text-[14px] font-medium text-ink">{profileDefaults.name}</p>
                <p className="font-mono text-[11px] text-faint">
                  @{profileDefaults.userID}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <NumField label="키 (cm)" value={height} min={140} max={200} onChange={setHeight} />
              <NumField label="몸무게 (kg)" value={weight} min={35} max={120} onChange={setWeight} />
              <NumField label="신발 (mm)" value={shoe} min={220} max={300} step={5} onChange={setShoe} />
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              선호 스타일 · clothType
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {CLOTH_TYPES.map((c) => (
                <Pill key={c} active={cloth.includes(c)} onClick={() => toggle(c, cloth, setCloth)}>
                  {c}
                </Pill>
              ))}
            </div>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              피부 타입 · skinType
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {SKIN_TYPES.map((s) => (
                <Pill key={s} active={skin.includes(s)} onClick={() => toggle(s, skin, setSkin)}>
                  {s}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <Inspector title="UserData Row">
          <pre className="scroll-thin overflow-x-auto font-mono text-[11px] leading-[1.7] text-ink-dim">
            <code>{`{
  "height": ${height},
  "weight": ${weight},
  "shoeType": ${shoe},
  "clothType": ${JSON.stringify(cloth)},
  "skinType": ${JSON.stringify(skin)}
}`}</code>
          </pre>
          <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
            clothType과 skinType은 다중 선택이라 JSONField에 배열로 저장했습니다.
            거래글에서 판매자·구매자 사이즈를 비교하는 데 쓰입니다.
          </p>
        </Inspector>
      </div>
    </DemoCanvas>
  );
}

function NumField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
        {label}
      </span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="tnum mt-1 w-full rounded-md border border-line bg-bg px-2.5 py-1.5 font-mono text-[13px] text-ink focus:border-[var(--accent)] focus:outline-none"
      />
    </label>
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
